import { EnrollmentModel } from "@/db/models/Enrollment";
import { connectToDatabase } from "@/db/mongodb";
import { successResponse } from "@/lib/api-response";

export async function getCourseAccessServiceStatus() {
  await connectToDatabase();
  const approvedEnrollmentCount = await EnrollmentModel.countDocuments({ status: "APPROVED" });
  return successResponse("Course access service ready", {
    service: "course-access",
    approvedEnrollmentCount,
    features: ["course-catalog", "enrollment-approval", "course-viewer-access"],
    status: "ready",
  });
}
