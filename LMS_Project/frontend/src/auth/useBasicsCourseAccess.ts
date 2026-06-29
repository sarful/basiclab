"use client";

import { useEffect, useMemo, useState } from "react";

import {
  fetchAdminCourses,
  fetchCourseCatalog,
  fetchCurrentUser,
  fetchEnrollmentHistory,
} from "./api";
import {
  BASICS_COURSE_SLUG,
  findActiveEnrollment,
  findBasicsCourse,
} from "./course-access";
import { getAllowedLessonTabIds } from "./lesson-variant-access";
import type { AuthUser, CourseRecord, EnrollmentRecord } from "./types";

type BasicsCourseAccessState = {
  loading: boolean;
  error: string | null;
  user: AuthUser | null;
  course: CourseRecord | null;
  enrollment: EnrollmentRecord | null;
};

function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes("unauthorized");
}

export function useBasicsCourseAccess() {
  const [state, setState] = useState<BasicsCourseAccessState>({
    loading: true,
    error: null,
    user: null,
    course: null,
    enrollment: null,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let user: AuthUser | null = null;
        let enrollment: EnrollmentRecord | null = null;
        let course: CourseRecord | null = null;

        try {
          const userResponse = await fetchCurrentUser();
          user = userResponse.data;
        } catch (error) {
          if (!isUnauthorizedError(error)) {
            throw error;
          }
        }

        if (user?.role === "ADMIN") {
          const adminCourseResponse = await fetchAdminCourses(BASICS_COURSE_SLUG);
          course = findBasicsCourse(adminCourseResponse.data);
        } else {
          const courseResponse = await fetchCourseCatalog(BASICS_COURSE_SLUG);
          course = findBasicsCourse(courseResponse.data);
        }

        if (user && user.role !== "ADMIN" && course) {
          const enrollmentResponse = await fetchEnrollmentHistory();
          enrollment = findActiveEnrollment(enrollmentResponse.data, course.id);
        }

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            user,
            course,
            enrollment,
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
          });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const derived = useMemo(() => {
    const isAdmin = state.user?.role === "ADMIN";
    const hasAccess = Boolean(isAdmin || state.enrollment?.status === "APPROVED");

    return {
      isAdmin,
      hasAccess,
      isLoggedIn: Boolean(state.user),
      allowedLessonTabIds: getAllowedLessonTabIds(state.user?.role ?? null),
      refresh: () => setRefreshKey((value) => value + 1),
    };
  }, [state.enrollment, state.user]);

  return {
    ...state,
    ...derived,
  };
}
