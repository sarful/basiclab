import { Types } from "mongoose";

import { CourseModel } from "@/db/models/Course";
import { EnrollmentModel } from "@/db/models/Enrollment";
import { LearningProgressModel } from "@/db/models/LearningProgress";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logActivity } from "@/services/auth/activity-log-service";
import { notifyCourseCompletion } from "@/services/communication/communication-service";
import {
  deriveCourseLessons,
  deriveCourseLessonsForRole,
} from "@/services/learning/course-lessons";
import type { SanitizedUser, UserRole } from "@/types/auth";

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

async function ensureApprovedEnrollment(userId: string, courseId: string) {
  return EnrollmentModel.findOne({
    userId,
    courseId,
    status: "APPROVED",
  });
}

async function getOrCreateProgress(userId: string, courseId: string) {
  let progress = await LearningProgressModel.findOne({ userId, courseId });
  if (!progress) {
    progress = await LearningProgressModel.create({
      userId,
      courseId,
      startedAt: new Date(),
    });
  }
  return progress;
}

async function getUserRole(userId: string) {
  const user = await UserModel.findById(userId).select("role");
  return user?.role as UserRole | undefined;
}

function filterProgressLessonIds(lessonIds: string[], allowedLessonIds: Set<string>) {
  return lessonIds.filter((lessonId) => allowedLessonIds.has(lessonId));
}

function getCompletionState(completedLessonIds: string[], allowedLessonIds: Set<string>) {
  const filteredCompletedLessonIds = filterProgressLessonIds(
    completedLessonIds,
    allowedLessonIds,
  );
  const totalLessons = allowedLessonIds.size;
  const completionPercentage =
    totalLessons > 0 ? Math.round((filteredCompletedLessonIds.length / totalLessons) * 100) : 0;

  return {
    filteredCompletedLessonIds,
    totalLessons,
    completionPercentage,
  };
}

function sanitizeProgress(progress: {
  _id: { toString(): string };
  userId: { toString(): string } | string;
  courseId: { toString(): string } | string;
  completedLessonIds: string[];
  viewedLessonIds: string[];
  lastViewedLessonId?: string;
  completionPercentage: number;
  startedAt?: Date;
  completedAt?: Date;
  history: Array<Record<string, unknown>>;
  achievements: Array<Record<string, unknown>>;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: progress._id.toString(),
    userId:
      typeof progress.userId === "string"
        ? progress.userId
        : progress.userId.toString(),
    courseId:
      typeof progress.courseId === "string"
        ? progress.courseId
        : progress.courseId.toString(),
    completedLessonIds: progress.completedLessonIds,
    viewedLessonIds: progress.viewedLessonIds,
    lastViewedLessonId: progress.lastViewedLessonId,
    completionPercentage: progress.completionPercentage,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
    history: progress.history,
    achievements: progress.achievements,
    createdAt: progress.createdAt,
    updatedAt: progress.updatedAt,
  };
}

function awardAchievement(
  progress: InstanceType<typeof LearningProgressModel>,
  code: string,
  title: string,
) {
  const exists = progress.achievements.some(
    (achievement: { code?: string }) => achievement.code === code,
  );
  if (!exists) {
    progress.achievements.push({
      code,
      title,
      awardedAt: new Date(),
    });
    progress.history.push({
      type: "ACHIEVEMENT_UNLOCKED",
      title,
      occurredAt: new Date(),
      metadata: { code },
    });
  }
}

function getLessonsForRole(
  course: InstanceType<typeof CourseModel>,
  role: UserRole,
) {
  return role === "ADMIN"
    ? deriveCourseLessons(course)
    : deriveCourseLessonsForRole(course, role);
}

function buildScopedProgress(
  progress: InstanceType<typeof LearningProgressModel>,
  allowedLessonIds: Set<string>,
) {
  const filteredViewedLessonIds = filterProgressLessonIds(
    progress.viewedLessonIds,
    allowedLessonIds,
  );
  const completionState = getCompletionState(progress.completedLessonIds, allowedLessonIds);
  const lastViewedLessonId =
    progress.lastViewedLessonId && allowedLessonIds.has(progress.lastViewedLessonId)
      ? progress.lastViewedLessonId
      : undefined;

  return {
    ...sanitizeProgress(progress),
    viewedLessonIds: filteredViewedLessonIds,
    completedLessonIds: completionState.filteredCompletedLessonIds,
    lastViewedLessonId,
    completionPercentage: completionState.completionPercentage,
    completedAt:
      completionState.totalLessons > 0 &&
      completionState.filteredCompletedLessonIds.length >= completionState.totalLessons
        ? progress.completedAt
        : undefined,
  };
}

export async function getMyLearning(userId: string) {
  await connectToDatabase();

  const role = await getUserRole(userId);
  if (!role) {
    return { status: 404, body: errorResponse("User not found") };
  }

  const approvedEnrollments = await EnrollmentModel.find({
    userId,
    status: "APPROVED",
  }).sort({ requestedAt: -1 });

  const courseIds = approvedEnrollments.map((enrollment) => enrollment.courseId);
  const [courses, progressRows] = await Promise.all([
    CourseModel.find({ _id: { $in: courseIds } }),
    LearningProgressModel.find({ userId, courseId: { $in: courseIds } }),
  ]);

  const progressMap = new Map(progressRows.map((row) => [row.courseId.toString(), row]));
  const courseMap = new Map(courses.map((course) => [course._id.toString(), course]));

  const items = approvedEnrollments
    .map((enrollment) => {
      const course = courseMap.get(enrollment.courseId.toString());
      if (!course) return null;

      const lessons = getLessonsForRole(course, role);
      const allowedLessonIds = new Set(lessons.map((lesson) => lesson.id));
      const progress = progressMap.get(course._id.toString());
      const completionState = getCompletionState(
        progress?.completedLessonIds ?? [],
        allowedLessonIds,
      );

      return {
        enrollmentId: enrollment._id.toString(),
        courseId: course._id.toString(),
        title: course.title,
        status: enrollment.status,
        lessonCount: lessons.length,
        completionPercentage: completionState.completionPercentage,
        completedLessonIds: completionState.filteredCompletedLessonIds,
        lastViewedLessonId:
          progress?.lastViewedLessonId && allowedLessonIds.has(progress.lastViewedLessonId)
            ? progress.lastViewedLessonId
            : undefined,
        completedAt:
          progress &&
          completionState.totalLessons > 0 &&
          completionState.filteredCompletedLessonIds.length >= completionState.totalLessons
            ? progress.completedAt
            : undefined,
      };
    })
    .filter(Boolean);

  return {
    status: 200,
    body: successResponse("My learning dashboard fetched successfully", {
      totalCourses: items.length,
      completedCourses: items.filter((item) => item && item.completedAt).length,
      activeCourses: items.filter((item) => item && !item.completedAt).length,
      items,
    }),
  };
}

export async function getMyCourses(userId: string) {
  const dashboard = await getMyLearning(userId);
  if (dashboard.status !== 200 || !("data" in dashboard.body)) {
    return dashboard;
  }

  return {
    status: 200,
    body: successResponse("My courses fetched successfully", dashboard.body.data.items),
  };
}

export async function getCourseViewer(
  user: Pick<SanitizedUser, "id" | "role">,
  courseId: string,
) {
  if (!isValidObjectId(courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();

  if (user.role !== "ADMIN") {
    const enrollment = await ensureApprovedEnrollment(user.id, courseId);
    if (!enrollment) {
      return { status: 403, body: errorResponse("Course access not granted") };
    }
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return { status: 404, body: errorResponse("Course not found") };
  }

  const lessons = getLessonsForRole(course, user.role);
  const allowedLessonIds = new Set(lessons.map((lesson) => lesson.id));
  const progress = await getOrCreateProgress(user.id, courseId);

  return {
    status: 200,
    body: successResponse("Course viewer fetched successfully", {
      course: {
        id: course._id.toString(),
        title: course.title,
        slug: course.slug,
        description: course.description,
        status: course.status,
      },
      lessons,
      progress: buildScopedProgress(progress, allowedLessonIds),
    }),
  };
}

export async function getLessonViewer(
  user: Pick<SanitizedUser, "id" | "role">,
  courseId: string,
  lessonId: string,
) {
  const viewer = await getCourseViewer(user, courseId);
  if (viewer.status !== 200 || !("data" in viewer.body)) {
    return viewer;
  }

  const lesson = viewer.body.data.lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return { status: 404, body: errorResponse("Lesson not found") };
  }

  await connectToDatabase();
  const progress = await getOrCreateProgress(user.id, courseId);

  if (!progress.viewedLessonIds.includes(lessonId)) {
    progress.viewedLessonIds.push(lessonId);
  }
  progress.lastViewedLessonId = lessonId;
  progress.history.push({
    type: "LESSON_VIEWED",
    lessonId,
    title: lesson.title,
    occurredAt: new Date(),
  });
  await progress.save();

  return {
    status: 200,
    body: successResponse("Lesson viewer fetched successfully", {
      lesson,
      progress: buildScopedProgress(
        progress,
        new Set(viewer.body.data.lessons.map((item) => item.id)),
      ),
    }),
  };
}

export async function markLessonComplete(
  user: Pick<SanitizedUser, "id" | "role">,
  courseId: string,
  lessonId: string,
) {
  const viewer = await getCourseViewer(user, courseId);
  if (viewer.status !== 200 || !("data" in viewer.body)) {
    return viewer;
  }

  const lesson = viewer.body.data.lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return { status: 404, body: errorResponse("Lesson not found") };
  }

  await connectToDatabase();
  const progress = await getOrCreateProgress(user.id, courseId);

  if (!progress.completedLessonIds.includes(lessonId)) {
    progress.completedLessonIds.push(lessonId);
    progress.history.push({
      type: "LESSON_COMPLETED",
      lessonId,
      title: lesson.title,
      occurredAt: new Date(),
    });
  }

  progress.lastViewedLessonId = lessonId;

  const allowedLessonIds = new Set(viewer.body.data.lessons.map((item) => item.id));
  const completionState = getCompletionState(progress.completedLessonIds, allowedLessonIds);
  progress.completionPercentage = completionState.completionPercentage;

  if (!progress.startedAt) {
    progress.startedAt = new Date();
  }

  if (completionState.filteredCompletedLessonIds.length >= 1) {
    awardAchievement(progress, "FIRST_LESSON", "First Lesson Complete");
  }

  if (
    completionState.totalLessons > 0 &&
    completionState.filteredCompletedLessonIds.length >= completionState.totalLessons
  ) {
    const wasCompleted = Boolean(progress.completedAt);
    progress.completedAt = progress.completedAt ?? new Date();
    progress.history.push({
      type: "COURSE_COMPLETED",
      title: "Course Completed",
      occurredAt: new Date(),
    });
    awardAchievement(progress, "COURSE_COMPLETE", "Course Completed");

    if (!wasCompleted) {
      await notifyCourseCompletion({
        userId: user.id,
        courseId,
      });
    }
  } else {
    progress.completedAt = undefined;
  }

  await progress.save();

  await logActivity({
    userId: user.id,
    action: "LESSON_COMPLETED",
    entityType: "LearningProgress",
    entityId: progress._id.toString(),
    metadata: { courseId, lessonId },
  });

  return {
    status: 200,
    body: successResponse("Lesson marked complete", {
      lessonId,
      progress: buildScopedProgress(progress, allowedLessonIds),
    }),
  };
}

export async function getLearningHistory(userId: string) {
  await connectToDatabase();
  const rows = await LearningProgressModel.find({ userId }).sort({ updatedAt: -1 });
  const history = rows.flatMap((row) =>
    row.history.map((entry: { toObject?: () => Record<string, unknown> }) => ({
      courseId: row.courseId.toString(),
      ...(entry.toObject?.() ?? entry),
    })),
  );

  history.sort((a, b) => {
    const aTime = new Date((a.occurredAt as Date | string | undefined) ?? 0).getTime();
    const bTime = new Date((b.occurredAt as Date | string | undefined) ?? 0).getTime();
    return bTime - aTime;
  });

  return {
    status: 200,
    body: successResponse("Learning history fetched successfully", history),
  };
}

export async function getAchievements(userId: string) {
  await connectToDatabase();
  const rows = await LearningProgressModel.find({ userId }).sort({ updatedAt: -1 });
  const achievements = rows.flatMap((row) =>
    row.achievements.map(
      (achievement: { toObject?: () => Record<string, unknown> }) => ({
        courseId: row.courseId.toString(),
        ...(achievement.toObject?.() ?? achievement),
      }),
    ),
  );

  return {
    status: 200,
    body: successResponse("Achievements fetched successfully", achievements),
  };
}
