import { Types } from "mongoose";

import { AuditLogModel } from "@/db/models/AuditLog";
import { CertificateModel } from "@/db/models/Certificate";
import { CourseModel } from "@/db/models/Course";
import { EnrollmentModel } from "@/db/models/Enrollment";
import { LearningProgressModel } from "@/db/models/LearningProgress";
import { QuizAttemptModel } from "@/db/models/QuizAttempt";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { reportFilterSchema } from "@/services/reporting/reporting-schemas";

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

function buildDateRange(query: { dateFrom?: string; dateTo?: string }) {
  const range: Record<string, Date> = {};

  if (query.dateFrom) {
    const date = new Date(query.dateFrom);
    if (!Number.isNaN(date.getTime())) {
      range.$gte = date;
    }
  }

  if (query.dateTo) {
    const date = new Date(query.dateTo);
    if (!Number.isNaN(date.getTime())) {
      range.$lte = date;
    }
  }

  return Object.keys(range).length ? range : undefined;
}

export async function getUserActivityReport(query: Record<string, string | undefined>) {
  const parsed = reportFilterSchema.safeParse(query);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid user activity report query", parsed.error.flatten()) };
  }

  if (parsed.data.userId && !isValidObjectId(parsed.data.userId)) {
    return { status: 400, body: errorResponse("Invalid user id") };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = {};
  if (parsed.data.userId) filter.userId = parsed.data.userId;
  const createdAt = buildDateRange(parsed.data);
  if (createdAt) filter.createdAt = createdAt;

  const logs = await AuditLogModel.find(filter).sort({ createdAt: -1 }).limit(250);
  const actionCounts = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.action] = (acc[log.action] ?? 0) + 1;
    return acc;
  }, {});

  return {
    status: 200,
    body: successResponse("User activity report fetched successfully", {
      totalActivities: logs.length,
      actionCounts,
      activities: logs.map((log) => ({
        id: log._id.toString(),
        userId: log.userId?.toString(),
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        metadata: log.metadata,
        createdAt: log.createdAt,
      })),
    }),
  };
}

export async function getEnrollmentReport(query: Record<string, string | undefined>) {
  const parsed = reportFilterSchema.safeParse(query);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid enrollment report query", parsed.error.flatten()) };
  }

  if (parsed.data.userId && !isValidObjectId(parsed.data.userId)) {
    return { status: 400, body: errorResponse("Invalid user id") };
  }
  if (parsed.data.courseId && !isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = {};
  if (parsed.data.userId) filter.userId = parsed.data.userId;
  if (parsed.data.courseId) filter.courseId = parsed.data.courseId;
  const requestedAt = buildDateRange(parsed.data);
  if (requestedAt) filter.requestedAt = requestedAt;

  const enrollments = await EnrollmentModel.find(filter).sort({ requestedAt: -1 }).limit(250);
  const summary = enrollments.reduce<Record<string, number>>((acc, enrollment) => {
    acc[enrollment.status] = (acc[enrollment.status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    status: 200,
    body: successResponse("Enrollment report fetched successfully", {
      totalEnrollments: enrollments.length,
      summary,
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment._id.toString(),
        userId: enrollment.userId.toString(),
        courseId: enrollment.courseId.toString(),
        status: enrollment.status,
        source: enrollment.source,
        requestedAt: enrollment.requestedAt,
        reviewedAt: enrollment.reviewedAt,
        reviewedBy: enrollment.reviewedBy?.toString(),
        notes: enrollment.notes,
      })),
    }),
  };
}

export async function getCourseCompletionReport(query: Record<string, string | undefined>) {
  const parsed = reportFilterSchema.safeParse(query);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid course completion report query", parsed.error.flatten()) };
  }

  if (parsed.data.userId && !isValidObjectId(parsed.data.userId)) {
    return { status: 400, body: errorResponse("Invalid user id") };
  }
  if (parsed.data.courseId && !isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = {
    completedAt: { $exists: true, $ne: null },
  };
  if (parsed.data.userId) filter.userId = parsed.data.userId;
  if (parsed.data.courseId) filter.courseId = parsed.data.courseId;
  const completedAt = buildDateRange(parsed.data);
  if (completedAt) filter.completedAt = completedAt;

  const rows = await LearningProgressModel.find(filter).sort({ completedAt: -1 }).limit(250);
  return {
    status: 200,
    body: successResponse("Course completion report fetched successfully", {
      totalCompletedCourses: rows.length,
      completions: rows.map((row) => ({
        id: row._id.toString(),
        userId: row.userId.toString(),
        courseId: row.courseId.toString(),
        completionPercentage: row.completionPercentage,
        completedAt: row.completedAt,
        achievements: row.achievements,
      })),
    }),
  };
}

export async function getProgressReport(query: Record<string, string | undefined>) {
  const parsed = reportFilterSchema.safeParse(query);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid progress report query", parsed.error.flatten()) };
  }

  if (parsed.data.userId && !isValidObjectId(parsed.data.userId)) {
    return { status: 400, body: errorResponse("Invalid user id") };
  }
  if (parsed.data.courseId && !isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = {};
  if (parsed.data.userId) filter.userId = parsed.data.userId;
  if (parsed.data.courseId) filter.courseId = parsed.data.courseId;

  const rows = await LearningProgressModel.find(filter).sort({ updatedAt: -1 }).limit(250);
  return {
    status: 200,
    body: successResponse("Progress report fetched successfully", {
      totalProgressRows: rows.length,
      progress: rows.map((row) => ({
        id: row._id.toString(),
        userId: row.userId.toString(),
        courseId: row.courseId.toString(),
        completionPercentage: row.completionPercentage,
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        completedLessonIds: row.completedLessonIds,
        viewedLessonIds: row.viewedLessonIds,
        lastViewedLessonId: row.lastViewedLessonId,
        achievements: row.achievements,
      })),
    }),
  };
}

export async function getOverviewAnalytics() {
  await connectToDatabase();

  const [totalUsers, totalCourses, totalCertificates, pendingEnrollments, approvedEnrollments, completedCourses, progressRows] =
    await Promise.all([
      UserModel.countDocuments(),
      CourseModel.countDocuments(),
      CertificateModel.countDocuments(),
      EnrollmentModel.countDocuments({ status: "PENDING" }),
      EnrollmentModel.find({ status: "APPROVED" }).select("userId courseId"),
      LearningProgressModel.countDocuments({ completedAt: { $exists: true, $ne: null } }),
      LearningProgressModel.find().select("completionPercentage"),
    ]);

  const activeSince = new Date();
  activeSince.setDate(activeSince.getDate() - 30);
  const activeUsers = await UserModel.countDocuments({
    $or: [{ lastLoginAt: { $gte: activeSince } }, { updatedAt: { $gte: activeSince } }],
  });

  const uniqueEnrolledStudentIds = new Set(
    approvedEnrollments.map((enrollment) => enrollment.userId.toString()),
  );
  const courseCompletionRate =
    approvedEnrollments.length > 0 ? Math.round((completedCourses / approvedEnrollments.length) * 100) : 0;
  const averageProgress =
    progressRows.length > 0
      ? Math.round(
          progressRows.reduce((sum, row) => sum + (row.completionPercentage ?? 0), 0) /
            progressRows.length,
        )
      : 0;

  return {
    status: 200,
    body: successResponse("Overview analytics fetched successfully", {
      totalUsers,
      activeUsers,
      totalCourses,
      enrolledStudents: uniqueEnrolledStudentIds.size,
      courseCompletionRate,
      averageProgress,
      pendingEnrollments,
      totalCertificates,
    }),
  };
}

export async function getLearningAnalytics() {
  await connectToDatabase();

  const [courses, approvedEnrollments, progressRows, quizAttempts, certificates] = await Promise.all([
    CourseModel.find().sort({ createdAt: -1 }),
    EnrollmentModel.find({ status: "APPROVED" }).select("courseId userId"),
    LearningProgressModel.find().select("courseId completionPercentage completedAt"),
    QuizAttemptModel.find().select("courseId percentage passed"),
    CertificateModel.find().select("courseId"),
  ]);

  const analytics = courses.map((course) => {
    const courseId = course._id.toString();
    const courseEnrollments = approvedEnrollments.filter((row) => row.courseId.toString() === courseId);
    const courseProgress = progressRows.filter((row) => row.courseId.toString() === courseId);
    const courseAttempts = quizAttempts.filter((row) => row.courseId.toString() === courseId);
    const courseCertificates = certificates.filter((row) => row.courseId.toString() === courseId);
    const completed = courseProgress.filter((row) => row.completedAt).length;
    const avgProgress =
      courseProgress.length > 0
        ? Math.round(
            courseProgress.reduce((sum, row) => sum + (row.completionPercentage ?? 0), 0) /
              courseProgress.length,
          )
        : 0;
    const avgQuizScore =
      courseAttempts.length > 0
        ? Math.round(
            courseAttempts.reduce((sum, row) => sum + (row.percentage ?? 0), 0) /
              courseAttempts.length,
          )
        : 0;

    return {
      courseId,
      title: course.title,
      status: course.status,
      enrolledStudents: courseEnrollments.length,
      completedStudents: completed,
      completionRate:
        courseEnrollments.length > 0 ? Math.round((completed / courseEnrollments.length) * 100) : 0,
      averageProgress: avgProgress,
      averageQuizScore: avgQuizScore,
      certificatesIssued: courseCertificates.length,
    };
  });

  return {
    status: 200,
    body: successResponse("Learning analytics fetched successfully", analytics),
  };
}
