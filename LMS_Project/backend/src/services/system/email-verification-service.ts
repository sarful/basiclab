import { successResponse } from "@/lib/api-response";

export function getEmailVerificationServiceStatus() {
  return successResponse("Email verification service ready", {
    service: "email-verification",
    features: ["verification-token", "verification-email", "verify-email-endpoint"],
    status: "ready",
  });
}
