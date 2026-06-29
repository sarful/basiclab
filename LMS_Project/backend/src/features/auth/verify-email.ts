import { UserModel } from "@/db/models/User";
import { VerificationTokenModel } from "@/db/models/VerificationToken";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logActivity } from "@/services/auth/activity-log-service";
import { verifyEmailSchema } from "@/services/auth/auth-schemas";

export async function verifyEmail(input: unknown) {
  const parsed = verifyEmailSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: errorResponse("Invalid verification payload", parsed.error.flatten()),
    };
  }

  await connectToDatabase();

  const verification = await VerificationTokenModel.findOne({
    token: parsed.data.token,
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!verification) {
    return {
      status: 400,
      body: errorResponse("Verification token is invalid or expired"),
    };
  }

  const user = await UserModel.findById(verification.userId);

  if (!user) {
    return {
      status: 404,
      body: errorResponse("User not found"),
    };
  }

  user.isEmailVerified = true;
  await user.save();

  verification.consumedAt = new Date();
  await verification.save();

  await logActivity({
    userId: user._id.toString(),
    action: "EMAIL_VERIFIED",
    entityType: "User",
    entityId: user._id.toString(),
  });

  return {
    status: 200,
    body: successResponse("Email verified successfully", null),
  };
}
