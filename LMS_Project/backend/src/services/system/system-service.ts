import { successResponse } from "@/lib/api-response";
import { getAnalyticsSystemServiceStatus } from "@/services/system/analytics-system-service";
import { getAuthenticationServiceStatus } from "@/services/system/authentication-service";
import { getAuthorizationServiceStatus } from "@/services/system/authorization-service";
import { getCourseAccessServiceStatus } from "@/services/system/course-access-service";
import { getEmailVerificationServiceStatus } from "@/services/system/email-verification-service";
import { getNotificationSystemServiceStatus } from "@/services/system/notification-system-service";
import { getOtpSystemServiceStatus } from "@/services/system/otp-system-service";
import { getProgressTrackingServiceStatus } from "@/services/system/progress-tracking-service";

export async function getSystemServicesOverview() {
  const [
    courseAccess,
    progressTracking,
    notification,
    analytics,
  ] = await Promise.all([
    getCourseAccessServiceStatus(),
    getProgressTrackingServiceStatus(),
    getNotificationSystemServiceStatus(),
    getAnalyticsSystemServiceStatus(),
  ]);

  return {
    status: 200,
    body: successResponse("System services fetched successfully", [
      getAuthenticationServiceStatus().data,
      getAuthorizationServiceStatus().data,
      getEmailVerificationServiceStatus().data,
      getOtpSystemServiceStatus().data,
      courseAccess.data,
      progressTracking.data,
      notification.data,
      analytics.data,
    ]),
  };
}
