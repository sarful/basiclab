import { LearningProgressModel } from "@/db/models/LearningProgress";
import { connectToDatabase } from "@/db/mongodb";
import { successResponse } from "@/lib/api-response";

export async function getProgressTrackingServiceStatus() {
  await connectToDatabase();
  const progressRowCount = await LearningProgressModel.countDocuments();
  return successResponse("Progress tracking service ready", {
    service: "progress-tracking",
    progressRowCount,
    features: ["lesson-completion", "course-completion", "history", "achievements"],
    status: "ready",
  });
}
