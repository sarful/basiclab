import { NotificationModel } from "@/db/models/Notification";
import { connectToDatabase } from "@/db/mongodb";
import { successResponse } from "@/lib/api-response";

export async function getNotificationSystemServiceStatus() {
  await connectToDatabase();
  const notificationCount = await NotificationModel.countDocuments();
  return successResponse("Notification service ready", {
    service: "notification",
    notificationCount,
    features: ["email-notifications", "announcements", "support-notifications", "completion-notifications"],
    status: "ready",
  });
}
