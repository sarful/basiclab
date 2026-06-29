import { VerificationTokenModel } from "@/db/models/VerificationToken";
import {
  VERIFICATION_TOKEN_TTL_MS,
} from "@/lib/auth-constants";
import { generateTokenValue } from "@/lib/auth-utils";
import { sendEmail } from "@/services/auth/email-service";
import { recordVerificationEmailNotification } from "@/services/communication/communication-service";

export async function createEmailVerification(user: {
  id: string;
  email: string;
  fullName: string;
}) {
  await VerificationTokenModel.deleteMany({
    userId: user.id,
    consumedAt: { $exists: false },
  });

  const token = generateTokenValue();
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

  await VerificationTokenModel.create({
    userId: user.id,
    token,
    expiresAt,
  });

  await sendEmail({
    to: user.email,
    subject: "Verify your BasicsLearn account",
    text: `Hello ${user.fullName}, verify your email with this token: ${token}`,
  });

  await recordVerificationEmailNotification({
    userId: user.id,
  });

  return { token, expiresAt };
}
