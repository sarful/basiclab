import { connectToDatabase } from "@/db/mongodb";
import { UserModel } from "@/db/models/User";
import { errorResponse, successResponse } from "@/lib/api-response";
import { hashPassword, normalizeEmail, sanitizeUser } from "@/lib/auth-utils";
import type { RegisterUserInput, UserRole } from "@/types/auth";
import { logActivity } from "@/services/auth/activity-log-service";
import { registerSchema } from "@/services/auth/auth-schemas";
import { issueOtp } from "@/services/auth/otp-service";
import { createSession } from "@/services/auth/session-service";
import { createEmailVerification } from "@/services/auth/verification-service";

export async function registerUser(
  input: RegisterUserInput,
  role: UserRole,
  requestMeta?: { ip?: string; userAgent?: string },
) {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: errorResponse("Invalid registration payload", parsed.error.flatten()),
    };
  }

  await connectToDatabase();

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const existingUser = await UserModel.findOne({
    email: normalizedEmail,
  }).lean();

  if (existingUser) {
    return {
      status: 409,
      body: errorResponse("User already exists"),
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const user = await UserModel.create({
    fullName: parsed.data.fullName,
    email: normalizedEmail,
    passwordHash,
    role,
    preferredLanguage: role === "LEARNER_BN" ? "bn" : "en",
  });

  const verification = await createEmailVerification({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
  });
  const otp = await issueOtp({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
  });
  const tokens = await createSession({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    ...requestMeta,
  });

  await logActivity({
    userId: user._id.toString(),
    action: "USER_REGISTERED",
    entityType: "User",
    entityId: user._id.toString(),
    metadata: { role: user.role, ...requestMeta },
  });

  return {
    status: 201,
    body: successResponse("Registration completed", {
      user: sanitizeUser(user),
      tokens,
      verification: {
        expiresAt: verification.expiresAt,
      },
      otp: {
        expiresAt: otp.expiresAt,
      },
    }),
  };
}
