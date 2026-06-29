import { PasswordResetTokenModel } from "@/db/models/PasswordResetToken";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { hashPassword, normalizeEmail } from "@/lib/auth-utils";
import { logActivity } from "@/services/auth/activity-log-service";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/services/auth/auth-schemas";
import { issuePasswordReset } from "@/services/auth/password-reset-service";

export async function forgotPassword(input: unknown) {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: errorResponse("Invalid forgot-password payload", parsed.error.flatten()),
    };
  }

  await connectToDatabase();

  const user = await UserModel.findOne({ email: normalizeEmail(parsed.data.email) });

  if (user) {
    await issuePasswordReset({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    await logActivity({
      userId: user._id.toString(),
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "User",
      entityId: user._id.toString(),
    });
  }

  return {
    status: 200,
    body: successResponse(
      "If the email exists, a password reset token has been sent",
      null,
    ),
  };
}

export async function resetPassword(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: errorResponse("Invalid reset-password payload", parsed.error.flatten()),
    };
  }

  await connectToDatabase();

  const tokenRecord = await PasswordResetTokenModel.findOne({
    token: parsed.data.token,
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!tokenRecord) {
    return {
      status: 400,
      body: errorResponse("Password reset token is invalid or expired"),
    };
  }

  const user = await UserModel.findById(tokenRecord.userId);

  if (!user) {
    return {
      status: 404,
      body: errorResponse("User not found"),
    };
  }

  user.passwordHash = await hashPassword(parsed.data.password);
  await user.save();

  tokenRecord.consumedAt = new Date();
  await tokenRecord.save();

  await logActivity({
    userId: user._id.toString(),
    action: "PASSWORD_RESET_COMPLETED",
    entityType: "User",
    entityId: user._id.toString(),
  });

  return {
    status: 200,
    body: successResponse("Password reset successful", null),
  };
}

export async function changePassword(userId: string, input: unknown) {
  const parsed = changePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: errorResponse("Invalid change-password payload", parsed.error.flatten()),
    };
  }

  await connectToDatabase();
  const user = await UserModel.findById(userId);

  if (!user) {
    return {
      status: 404,
      body: errorResponse("User not found"),
    };
  }

  const currentMatches = await import("@/lib/auth-utils").then(({ verifyPassword }) =>
    verifyPassword(parsed.data.currentPassword, user.passwordHash),
  );

  if (!currentMatches) {
    return {
      status: 400,
      body: errorResponse("Current password is incorrect"),
    };
  }

  user.passwordHash = await hashPassword(parsed.data.newPassword);
  await user.save();

  await logActivity({
    userId: user._id.toString(),
    action: "PASSWORD_CHANGED",
    entityType: "User",
    entityId: user._id.toString(),
  });

  return {
    status: 200,
    body: successResponse("Password changed successfully", null),
  };
}
