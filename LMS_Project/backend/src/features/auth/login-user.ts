import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { normalizeEmail, sanitizeUser, verifyPassword } from "@/lib/auth-utils";
import { logActivity } from "@/services/auth/activity-log-service";
import { loginSchema } from "@/services/auth/auth-schemas";
import { createSession } from "@/services/auth/session-service";

export async function loginUser(
  input: unknown,
  requestMeta?: { ip?: string; userAgent?: string },
) {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: errorResponse("Invalid login payload", parsed.error.flatten()),
    };
  }

  await connectToDatabase();

  const email = normalizeEmail(parsed.data.email);
  const user = await UserModel.findOne({ email });

  if (!user) {
    return {
      status: 401,
      body: errorResponse("Invalid email or password"),
    };
  }

  const passwordOk = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!passwordOk) {
    await logActivity({
      userId: user._id.toString(),
      action: "LOGIN_FAILED",
      entityType: "User",
      entityId: user._id.toString(),
      metadata: { reason: "invalid_password" },
    });

    return {
      status: 401,
      body: errorResponse("Invalid email or password"),
    };
  }

  if (user.isSuspended) {
    return {
      status: 403,
      body: errorResponse("Account is suspended"),
    };
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await createSession({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    ...requestMeta,
  });

  await logActivity({
    userId: user._id.toString(),
    action: "LOGIN_SUCCESS",
    entityType: "Session",
    entityId: user._id.toString(),
    metadata: requestMeta,
  });

  return {
    status: 200,
    body: successResponse("Login successful", {
      user: sanitizeUser(user),
      tokens,
    }),
  };
}
