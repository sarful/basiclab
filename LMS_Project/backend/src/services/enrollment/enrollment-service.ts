import { Types } from "mongoose";

import { CourseModel } from "@/db/models/Course";
import { EnrollmentModel } from "@/db/models/Enrollment";
import { QuizAttemptModel } from "@/db/models/QuizAttempt";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logActivity } from "@/services/auth/activity-log-service";
import { notifyEnrollmentEvent } from "@/services/communication/communication-service";
import { ensureDefaultBasicsCourse } from "@/services/course/default-course-service";
import { deriveCourseLessons } from "@/services/learning/course-lessons";
import {
  createEnrollmentRequestSchema,
  enrollmentDecisionSchema,
  manualAssignSchema,
  removeAccessSchema,
} from "@/services/enrollment/enrollment-schemas";

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

function getPublishedCourseLessonCount(course: { slug: string }) {
  if (course.slug === "basics-electronics-and-electrical") {
    return 13;
  }

  return 0;
}

function sanitizeEnrollment(enrollment: {
  _id: { toString(): string };
  userId: { toString(): string } | string;
  courseId: { toString(): string } | string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";
  source: "REQUEST" | "MANUAL";
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: { toString(): string } | string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: enrollment._id.toString(),
    userId:
      typeof enrollment.userId === "string"
        ? enrollment.userId
        : enrollment.userId.toString(),
    courseId:
      typeof enrollment.courseId === "string"
        ? enrollment.courseId
        : enrollment.courseId.toString(),
    status: enrollment.status,
    source: enrollment.source,
    requestedAt: enrollment.requestedAt,
    reviewedAt: enrollment.reviewedAt,
    reviewedBy:
      typeof enrollment.reviewedBy === "string"
        ? enrollment.reviewedBy
        : enrollment.reviewedBy?.toString(),
    notes: enrollment.notes,
    createdAt: enrollment.createdAt,
    updatedAt: enrollment.updatedAt,
  };
}

export async function listCourseCatalog(query: Record<string, string | undefined>) {
  await connectToDatabase();
  await ensureDefaultBasicsCourse();

  const filter: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
      { slug: { $regex: query.q, $options: "i" } },
    ];
  }

  if (query.categoryId && isValidObjectId(query.categoryId)) {
    filter.categoryId = query.categoryId;
  }

  const courses = await CourseModel.find(filter).sort({ createdAt: -1 }).limit(100);

  return {
    status: 200,
    body: successResponse(
      "Course catalog fetched successfully",
      courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        slug: course.slug,
        description: course.description,
        categoryId: course.categoryId?.toString(),
        status: course.status,
        resourcePdfUrl: course.resourcePdfUrl,
        videoUrl: course.videoUrl,
        simulationUrl: course.simulationUrl,
        downloadableUrl: course.downloadableUrl,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })),
    ),
  };
}

export async function getPublicCourseStats(slug: string) {
  await connectToDatabase();
  await ensureDefaultBasicsCourse();

  const course = await CourseModel.findOne({
    slug,
    status: "PUBLISHED",
  });

  if (!course) {
    return {
      status: 404,
      body: errorResponse("Published course not found"),
    };
  }

  const [approvedEnrollments, quizAttempts] = await Promise.all([
    EnrollmentModel.countDocuments({
      courseId: course._id,
      status: "APPROVED",
    }),
    QuizAttemptModel.find({
      courseId: course._id,
    }).select("percentage"),
  ]);

  const lessons = deriveCourseLessons(course);
  const publishedLessonCount = Math.max(lessons.length, getPublishedCourseLessonCount(course));
  const averageQuizPercentage =
    quizAttempts.length > 0
      ? quizAttempts.reduce((sum, attempt) => sum + (attempt.percentage ?? 0), 0) /
        quizAttempts.length
      : 0;
  const courseRating =
    quizAttempts.length > 0 ? Number((averageQuizPercentage / 20).toFixed(1)) : null;

  return {
    status: 200,
    body: successResponse("Public course stats fetched successfully", {
      courseId: course._id.toString(),
      slug: course.slug,
      title: course.title,
      studentsEnrolled: approvedEnrollments,
      lessons: publishedLessonCount,
      courseRating,
      ratingSource: quizAttempts.length > 0 ? "quiz-attempt-average" : "no-quiz-attempts",
      quizAttempts: quizAttempts.length,
    }),
  };
}

export async function createEnrollmentRequest(userId: string, input: unknown) {
  const parsed = createEnrollmentRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid enrollment request payload", parsed.error.flatten()) };
  }

  if (!isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  await ensureDefaultBasicsCourse();

  const course = await CourseModel.findById(parsed.data.courseId);
  if (!course || course.status !== "PUBLISHED") {
    return { status: 404, body: errorResponse("Published course not found") };
  }

  const existing = await EnrollmentModel.findOne({
    userId,
    courseId: parsed.data.courseId,
    status: { $in: ["PENDING", "APPROVED"] },
  });

  if (existing) {
    return { status: 409, body: errorResponse("Enrollment request already exists for this course") };
  }

  const enrollment = await EnrollmentModel.create({
    userId,
    courseId: parsed.data.courseId,
    status: "PENDING",
    source: "REQUEST",
    requestedAt: new Date(),
  });

  await logActivity({
    userId,
    action: "ENROLLMENT_REQUEST_CREATED",
    entityType: "Enrollment",
    entityId: enrollment._id.toString(),
    metadata: { courseId: parsed.data.courseId },
  });

  await notifyEnrollmentEvent({
    userId,
    courseId: parsed.data.courseId,
    event: "REQUESTED",
  });

  return {
    status: 201,
    body: successResponse("Enrollment request created successfully", sanitizeEnrollment(enrollment)),
  };
}

export async function listEnrollmentHistory(userId: string) {
  await connectToDatabase();
  const enrollments = await EnrollmentModel.find({ userId }).sort({ requestedAt: -1 });
  return {
    status: 200,
    body: successResponse(
      "Enrollment history fetched successfully",
      enrollments.map((enrollment) => sanitizeEnrollment(enrollment)),
    ),
  };
}

export async function listAdminEnrollments(query: Record<string, string | undefined>) {
  await connectToDatabase();
  const filter: Record<string, unknown> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.courseId && isValidObjectId(query.courseId)) {
    filter.courseId = query.courseId;
  }

  if (query.userId && isValidObjectId(query.userId)) {
    filter.userId = query.userId;
  }

  const enrollments = await EnrollmentModel.find(filter).sort({ requestedAt: -1 }).limit(100);
  return {
    status: 200,
    body: successResponse(
      "Enrollments fetched successfully",
      enrollments.map((enrollment) => sanitizeEnrollment(enrollment)),
    ),
  };
}

async function setEnrollmentStatus(
  enrollmentId: string,
  status: "APPROVED" | "REJECTED" | "REMOVED",
  actorId: string,
  input?: unknown,
) {
  if (!isValidObjectId(enrollmentId)) {
    return { status: 400, body: errorResponse("Invalid enrollment id") };
  }

  const parsed = enrollmentDecisionSchema.safeParse(input ?? {});
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid enrollment action payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const enrollment = await EnrollmentModel.findById(enrollmentId);
  if (!enrollment) {
    return { status: 404, body: errorResponse("Enrollment not found") };
  }

  enrollment.status = status;
  enrollment.reviewedAt = new Date();
  enrollment.reviewedBy = actorId;
  enrollment.notes = parsed.data.notes;
  await enrollment.save();

  await logActivity({
    userId: actorId,
    action: `ENROLLMENT_${status}`,
    entityType: "Enrollment",
    entityId: enrollmentId,
    metadata: { notes: parsed.data.notes },
  });

  await notifyEnrollmentEvent({
    userId: enrollment.userId.toString(),
    courseId: enrollment.courseId.toString(),
    event: status,
    notes: parsed.data.notes,
  });

  return {
    status: 200,
    body: successResponse(
      status === "APPROVED"
        ? "Enrollment approved successfully"
        : status === "REJECTED"
          ? "Enrollment rejected successfully"
          : "Course access removed successfully",
      sanitizeEnrollment(enrollment),
    ),
  };
}

export async function approveEnrollment(enrollmentId: string, actorId: string, input?: unknown) {
  return setEnrollmentStatus(enrollmentId, "APPROVED", actorId, input);
}

export async function rejectEnrollment(enrollmentId: string, actorId: string, input?: unknown) {
  return setEnrollmentStatus(enrollmentId, "REJECTED", actorId, input);
}

export async function assignEnrollment(actorId: string, input: unknown) {
  const parsed = manualAssignSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid manual assignment payload", parsed.error.flatten()) };
  }

  if (!isValidObjectId(parsed.data.userId) || !isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid user or course id") };
  }

  await connectToDatabase();
  const [user, course] = await Promise.all([
    UserModel.findById(parsed.data.userId),
    CourseModel.findById(parsed.data.courseId),
  ]);

  if (!user) {
    return { status: 404, body: errorResponse("User not found") };
  }
  if (!course) {
    return { status: 404, body: errorResponse("Course not found") };
  }

  const existing = await EnrollmentModel.findOne({
    userId: parsed.data.userId,
    courseId: parsed.data.courseId,
    status: { $in: ["PENDING", "APPROVED"] },
  });
  if (existing) {
    return { status: 409, body: errorResponse("Active enrollment already exists") };
  }

  const enrollment = await EnrollmentModel.create({
    userId: parsed.data.userId,
    courseId: parsed.data.courseId,
    status: "APPROVED",
    source: "MANUAL",
    requestedAt: new Date(),
    reviewedAt: new Date(),
    reviewedBy: actorId,
    notes: parsed.data.notes,
  });

  await logActivity({
    userId: actorId,
    action: "ENROLLMENT_ASSIGNED_MANUALLY",
    entityType: "Enrollment",
    entityId: enrollment._id.toString(),
    metadata: { userId: parsed.data.userId, courseId: parsed.data.courseId },
  });

  await notifyEnrollmentEvent({
    userId: parsed.data.userId,
    courseId: parsed.data.courseId,
    event: "APPROVED",
    notes: parsed.data.notes,
  });

  return {
    status: 201,
    body: successResponse("Course assigned successfully", sanitizeEnrollment(enrollment)),
  };
}

export async function removeCourseAccess(actorId: string, input: unknown) {
  const parsed = removeAccessSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid remove-access payload", parsed.error.flatten()) };
  }

  return setEnrollmentStatus(parsed.data.enrollmentId, "REMOVED", actorId, {
    notes: parsed.data.notes,
  });
}
