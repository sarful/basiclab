import { OtpCodeModel } from "@/db/models/OtpCode";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { normalizeEmail } from "@/lib/auth-utils";
import { logActivity } from "@/services/auth/activity-log-service";
import { resendOtpSchema, verifyOtpSchema } from "@/services/auth/auth-schemas";
import { issueOtp } from "@/services/auth/otp-service";

export async function verifyOtp(input: unknown) {
  const parsed = verifyOtpSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: errorResponse("Invalid OTP payload", parsed.error.flatten()),
    };
  }

  await connectToDatabase();

  const user = await UserModel.findOne({
    email: normalizeEmail(parsed.data.email),
  });

  if (!user) {
    return {
      status: 404,
      body: errorResponse("User not found"),
    };
  }

  const otpRecord = await OtpCodeModel.findOne({
    userId: user._id,
    code: parsed.data.code,
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    return {
      status: 400,
      body: errorResponse("OTP is invalid or expired"),
    };
  }

  otpRecord.consumedAt = new Date();
  await otpRecord.save();

  await logActivity({
    userId: user._id.toString(),
    action: "OTP_VERIFIED",
    entityType: "User",
    entityId: user._id.toString(),
  });

  return {
    status: 200,
    body: successResponse("OTP verified successfully", null),
  };
}

export async function resendOtp(input: unknown) {
  const parsed = resendOtpSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: errorResponse("Invalid resend-otp payload", parsed.error.flatten()),
    };
  }

  await connectToDatabase();

  const user = await UserModel.findOne({
    email: normalizeEmail(parsed.data.email),
  });

  if (!user) {
    return {
      status: 404,
      body: errorResponse("User not found"),
    };
  }

  const otp = await issueOtp({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
  });

  await logActivity({
    userId: user._id.toString(),
    action: "OTP_RESENT",
    entityType: "User",
    entityId: user._id.toString(),
  });

  return {
    status: 200,
    body: successResponse("OTP sent successfully", {
      expiresAt: otp.expiresAt,
    }),
  };
}
