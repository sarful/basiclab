import mongoose from "mongoose";

import { AuditLogModel } from "@/db/models/AuditLog";
import { CourseModel } from "@/db/models/Course";
import { EnrollmentModel } from "@/db/models/Enrollment";
import { LearningProgressModel } from "@/db/models/LearningProgress";
import { UploadedFileModel } from "@/db/models/UploadedFile";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { successResponse } from "@/lib/api-response";
import { ensureDefaultBasicsCourse } from "@/services/course/default-course-service";
import { getStorageStats } from "@/services/storage/storage-service";

export async function getAdminDashboard() {
  await connectToDatabase();
  await ensureDefaultBasicsCourse();

  const activeSince = new Date();
  activeSince.setDate(activeSince.getDate() - 30);

  const [
    totalUsers,
    totalCourses,
    pendingEnrollments,
    completedCourses,
    activeLearners,
    recentActivities,
    storageStats,
    totalFiles,
  ] = await Promise.all([
    UserModel.countDocuments(),
    CourseModel.countDocuments(),
    EnrollmentModel.countDocuments({ status: "PENDING" }),
    LearningProgressModel.countDocuments({ completedAt: { $exists: true, $ne: null } }),
    UserModel.countDocuments({
      role: { $in: ["LEARNER_EN", "LEARNER_BN"] },
      $or: [{ lastLoginAt: { $gte: activeSince } }, { updatedAt: { $gte: activeSince } }],
    }),
    AuditLogModel.find().sort({ createdAt: -1 }).limit(10),
    getStorageStats(),
    UploadedFileModel.countDocuments({ isActive: true }),
  ]);

  const dbStateMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    status: 200,
    body: successResponse("Admin dashboard fetched successfully", {
      widgets: {
        totalUsers,
        totalCourses,
        pendingEnrollments,
        completedCourses,
        activeLearners,
      },
      recentActivities: recentActivities.map((item) => ({
        id: item._id.toString(),
        userId: item.userId?.toString(),
        action: item.action,
        entityType: item.entityType,
        entityId: item.entityId,
        metadata: item.metadata,
        createdAt: item.createdAt,
      })),
      systemHealth: {
        service: "lms-backend",
        database: dbStateMap[mongoose.connection.readyState] ?? "unknown",
        storageDriver: storageStats.storageDriver,
        uploadDirectory: storageStats.uploadDirectory,
        totalFiles,
        totalStorageBytes: storageStats.totalBytes,
        totalStorageMegabytes: storageStats.totalMegabytes,
        timestamp: new Date().toISOString(),
      },
    }),
  };
}
