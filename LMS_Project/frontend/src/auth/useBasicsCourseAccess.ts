"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchPaymentHistory,
  fetchAdminCourses,
  fetchCourseCatalog,
  fetchCurrentUser,
  fetchEnrollmentHistory,
} from "./api";
import {
  BASICS_COURSE_SLUG,
  findActiveEnrollment,
  findBasicsCourse,
  findCourseBySlug,
} from "./course-access";
import { getAllowedLessonTabIds } from "./lesson-variant-access";
import type {
  AuthUser,
  CourseAccessOutcome,
  CourseRecord,
  EnrollmentRecord,
  PaymentRequestRecord,
} from "./types";

type BasicsCourseAccessState = {
  loading: boolean;
  error: string | null;
  user: AuthUser | null;
  course: CourseRecord | null;
  enrollment: EnrollmentRecord | null;
  paymentHistory: PaymentRequestRecord[];
};

function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes("unauthorized");
}

export function useCourseAccess(
  courseSlug: string,
  findCourse: (courses: CourseRecord[]) => CourseRecord | null,
) {
  const [state, setState] = useState<BasicsCourseAccessState>({
    loading: true,
    error: null,
    user: null,
    course: null,
    enrollment: null,
    paymentHistory: [],
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [accessCheckedAt, setAccessCheckedAt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let user: AuthUser | null = null;
        let enrollment: EnrollmentRecord | null = null;
        let course: CourseRecord | null = null;
        let paymentHistory: PaymentRequestRecord[] = [];

        try {
          const userResponse = await fetchCurrentUser();
          user = userResponse.data;
        } catch (error) {
          if (!isUnauthorizedError(error)) {
            throw error;
          }
        }

        if (user?.role === "ADMIN") {
          const adminCourseResponse = await fetchAdminCourses(courseSlug);
          course = findCourse(adminCourseResponse.data);
        } else {
          const courseResponse = await fetchCourseCatalog(courseSlug);
          course = findCourse(courseResponse.data);
        }

        if (user && user.role !== "ADMIN" && course) {
          const [enrollmentResponse, paymentHistoryResponse] = await Promise.all([
            fetchEnrollmentHistory(),
            fetchPaymentHistory(),
          ]);
          enrollment = findActiveEnrollment(enrollmentResponse.data, course.id);
          paymentHistory = paymentHistoryResponse.data;
        }

        if (!cancelled) {
          setAccessCheckedAt(Date.now());
          setState({
            loading: false,
            error: null,
            user,
            course,
            enrollment,
            paymentHistory,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to load course access.",
            user: null,
            course: null,
            enrollment: null,
            paymentHistory: [],
          });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [courseSlug, findCourse, refreshKey]);

  const derived = useMemo(() => {
    const isAdmin = state.user?.role === "ADMIN";
    let accessOutcome: CourseAccessOutcome;
    let hasAccess = false;
    let hasFullAccess = false;
    let isTrialPreview = false;
    let trialEndsAt: string | null = null;
    let trialDaysRemaining: number | null = null;
    const previewLessonLimit = Math.max(0, state.course?.previewLessonLimit ?? 0);
    const hasPendingPayment = state.paymentHistory.some(
      (request) => request.status === "PENDING" && (!request.courseId || request.courseId === state.course?.id),
    );
    const hasApprovedEnrollment = state.enrollment?.status === "APPROVED";
    const hasManualAccess = hasApprovedEnrollment && state.enrollment?.source === "MANUAL";

    if (isAdmin) {
      hasAccess = true;
      hasFullAccess = true;
      accessOutcome = "ALLOW";
    } else if (!state.course || state.course.status !== "PUBLISHED") {
      accessOutcome = "LOCKED_COURSE_UNAVAILABLE";
    } else if (state.course.accessType === "FREE" && state.user) {
      hasAccess = true;
      hasFullAccess = true;
      accessOutcome = "ALLOW";
    } else if (state.course.accessType === "FREE") {
      accessOutcome = "LOCKED_ENROLLMENT_REQUIRED";
    } else if (state.user?.accountState === "PAID" || hasManualAccess) {
      hasAccess = true;
      hasFullAccess = true;
      accessOutcome = "ALLOW";
    } else if (state.course.accessType === "TRIAL_PREVIEW") {
      if (!state.course.trialVisible) {
        accessOutcome = "LOCKED_UPGRADE_REQUIRED";
      } else if (state.user?.accountState !== "TRIAL" || !hasApprovedEnrollment) {
        accessOutcome = "LOCKED_ENROLLMENT_REQUIRED";
      } else {
        const trialStartedAt = new Date(
          state.enrollment?.requestedAt ?? state.enrollment?.createdAt ?? accessCheckedAt,
        );
        const trialDurationMs = Math.max(1, state.course.trialDays) * 24 * 60 * 60 * 1000;
        const trialEndDate = new Date(trialStartedAt.getTime() + trialDurationMs);
        const remainingMs = trialEndDate.getTime() - accessCheckedAt;
        trialEndsAt = trialEndDate.toISOString();
        trialDaysRemaining = Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));

        if (remainingMs <= 0) {
          accessOutcome = "LOCKED_TRIAL_EXPIRED";
        } else if (previewLessonLimit <= 0) {
          accessOutcome = "LOCKED_UPGRADE_REQUIRED";
        } else {
          hasAccess = true;
          isTrialPreview = true;
          accessOutcome = "ALLOW";
        }
      }
    } else if (hasPendingPayment) {
      accessOutcome = "LOCKED_PAYMENT_PENDING";
    } else {
      accessOutcome = "LOCKED_UPGRADE_REQUIRED";
    }

    return {
      isAdmin,
      hasAccess,
      hasFullAccess,
      isTrialPreview,
      trialEndsAt,
      trialDaysRemaining,
      previewLessonLimit,
      canAccessLesson: (lessonIndex: number) =>
        hasAccess && (!isTrialPreview || lessonIndex < previewLessonLimit),
      accessOutcome: accessOutcome as CourseAccessOutcome,
      isLoggedIn: Boolean(state.user),
      allowedLessonTabIds: getAllowedLessonTabIds(state.user?.role ?? null),
      refresh: () => setRefreshKey((value) => value + 1),
    };
  }, [accessCheckedAt, state.course, state.enrollment, state.paymentHistory, state.user]);

  return {
    ...state,
    ...derived,
  };
}

export function useBasicsCourseAccess() {
  return useCourseAccess(BASICS_COURSE_SLUG, findBasicsCourse);
}

export function useCourseSlugAccess(courseSlug: string) {
  const findCourse = useCallback(
    (courses: CourseRecord[]) => findCourseBySlug(courses, courseSlug),
    [courseSlug],
  );

  return useCourseAccess(courseSlug, findCourse);
}
