import { successResponse } from "@/lib/api-response";

export function getAuthenticationServiceStatus() {
  return successResponse("Authentication service ready", {
    service: "authentication",
    features: ["register", "login", "logout", "refresh", "change-password", "session-management"],
    status: "ready",
  });
}
