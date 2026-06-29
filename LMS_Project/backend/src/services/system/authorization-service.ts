import { successResponse } from "@/lib/api-response";

export function getAuthorizationServiceStatus() {
  return successResponse("Authorization service ready", {
    service: "authorization",
    features: ["rbac", "route-protection", "api-guards", "admin-only-routes"],
    status: "ready",
  });
}
