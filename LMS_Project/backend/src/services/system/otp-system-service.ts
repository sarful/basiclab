import { successResponse } from "@/lib/api-response";

export function getOtpSystemServiceStatus() {
  return successResponse("OTP service ready", {
    service: "otp",
    features: ["generate-otp", "send-otp-email", "verify-otp", "resend-otp", "expiry-logic"],
    status: "ready",
  });
}
