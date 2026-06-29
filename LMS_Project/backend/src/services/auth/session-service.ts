import { SessionModel } from "@/db/models/Session";
import { signAuthToken, verifyAuthToken } from "@/lib/tokens";
import type { UserRole } from "@/types/auth";

export async function createSession(input: {
  userId: string;
  role: UserRole;
  email: string;
  ip?: string;
  userAgent?: string;
}) {
  const accessToken = signAuthToken(input.userId, "access", {
    role: input.role,
    email: input.email,
  });
  const refreshToken = signAuthToken(input.userId, "refresh", {
    role: input.role,
    email: input.email,
  });

  await SessionModel.create({
    userId: input.userId,
    refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    metadata: {
      ip: input.ip,
      userAgent: input.userAgent,
    },
  });

  return { accessToken, refreshToken };
}

export async function revokeSession(refreshToken: string) {
  await SessionModel.findOneAndUpdate(
    { refreshToken, revokedAt: { $exists: false } },
    { revokedAt: new Date() },
  );
}

export async function rotateSession(refreshToken: string) {
  const payload = verifyAuthToken(refreshToken, "refresh");
  const session = await SessionModel.findOne({
    refreshToken,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    return null;
  }

  await revokeSession(refreshToken);

  return createSession({
    userId: payload.sub!,
    role: payload.role,
    email: payload.email,
  });
}
