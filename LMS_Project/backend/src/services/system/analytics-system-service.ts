import { CourseModel } from "@/db/models/Course";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { successResponse } from "@/lib/api-response";

export async function getAnalyticsSystemServiceStatus() {
  await connectToDatabase();
  const [userCount, courseCount] = await Promise.all([
    UserModel.countDocuments(),
    CourseModel.countDocuments(),
  ]);

  return successResponse("Analytics service ready", {
    service: "analytics",
    userCount,
    courseCount,
    features: ["dashboard-analytics", "reports", "learning-analytics"],
    status: "ready",
  });
}
