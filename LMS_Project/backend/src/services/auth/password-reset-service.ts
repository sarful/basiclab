import { PasswordResetTokenModel } from "@/db/models/PasswordResetToken";
import { PASSWORD_RESET_TTL_MS } from "@/lib/auth-constants";
import { generateTokenValue } from "@/lib/auth-utils";
import { sendEmail } from "@/services/auth/email-service";

export async function issuePasswordReset(user: {
  id: string;
  email: string;
  fullName: string;
}) {
  await PasswordResetTokenModel.deleteMany({
    userId: user.id,
    consumedAt: { $exists: false },
  });

  const token = generateTokenValue();
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

  await PasswordResetTokenModel.create({
    userId: user.id,
    token,
    expiresAt,
  });

  await sendEmail({
    to: user.email,
    subject: "BasicsLearn password reset",
    text: `Hello ${user.fullName}, reset your password with this token: ${token}`,
  });

  return { token, expiresAt };
}
