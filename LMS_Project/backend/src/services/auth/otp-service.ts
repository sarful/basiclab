import { OtpCodeModel } from "@/db/models/OtpCode";
import { OTP_TTL_MS } from "@/lib/auth-constants";
import { generateOtpCode } from "@/lib/auth-utils";
import { sendEmail } from "@/services/auth/email-service";
import { recordOtpEmailNotification } from "@/services/communication/communication-service";

export async function issueOtp(user: {
  id: string;
  email: string;
  fullName: string;
}) {
  await OtpCodeModel.deleteMany({
    userId: user.id,
    consumedAt: { $exists: false },
  });

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await OtpCodeModel.create({
    userId: user.id,
    code,
    expiresAt,
  });

  await sendEmail({
    to: user.email,
    subject: "Your BasicsLearn OTP code",
    text: `Hello ${user.fullName}, your OTP code is ${code}. It expires in 10 minutes.`,
  });

  await recordOtpEmailNotification({
    userId: user.id,
    expiresAt,
  });

  return { code, expiresAt };
}
