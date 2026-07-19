"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { industrialSensorCourseModules } from "../courses/Industrial_Sensor/courseCatalog";
import { basicsCourseModules } from "../courses/basics-electronics-and-electrical/courseCatalog";
import { BASICS_COURSE_SLUG } from "./course-access";
import { useCourseSlugAccess } from "./useBasicsCourseAccess";

function getLessonIndex(courseSlug: string, pathname: string) {
  const lessons = courseSlug === "industrial-sensor"
    ? industrialSensorCourseModules
    : basicsCourseModules;

  return lessons.findIndex((lesson) => {
    const lessonPath = lesson.href.replace(/\/\d+$/, "");
    const currentPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    return currentPath === lessonPath || currentPath.startsWith(`${lessonPath}/`);
  });
}

type CourseAccessGateProps = {
  children: ReactNode;
  courseSlug?: string;
  courseHref?: string;
};

export default function CourseAccessGate({
  children,
  courseSlug = BASICS_COURSE_SLUG,
  courseHref = "/courses/basics-electronics-and-electrical",
}: CourseAccessGateProps) {
  const pathname = usePathname();
  const {
    loading,
    error,
    user,
    course,
    enrollment,
    hasAccess,
    isAdmin,
    isTrialPreview,
    previewLessonLimit,
    canAccessLesson,
    accessOutcome,
  } = useCourseSlugAccess(courseSlug);
  const lessonIndex = getLessonIndex(courseSlug, pathname);
  const canOpenCurrentRoute =
    hasAccess && (!isTrialPreview || (lessonIndex >= 0 && canAccessLesson(lessonIndex)));

  if (loading) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-empty">
            <p className="dashboard-kicker">Checking access</p>
            <h1>Verifying your account before opening lessons.</h1>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-empty">
            <p className="dashboard-kicker">Access error</p>
            <h1>We could not verify your course access.</h1>
            <p>{error}</p>
            <div className="dashboard-actions">
              <Link href="/dashboard" className="dashboard-primary-link">
                Back to dashboard
              </Link>
              <Link href="/" className="dashboard-secondary-link">
                Homepage
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-empty">
            <p className="dashboard-kicker">Login required</p>
            <h1>Sign in first to unlock lessons with your trial or paid account.</h1>
            <div className="dashboard-actions">
              <Link href="/login" className="dashboard-primary-link">
                Login
              </Link>
              <Link href="/register" className="dashboard-secondary-link">
                Register
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isAdmin || canOpenCurrentRoute) {
    return <>{children}</>;
  }

  const message =
    isTrialPreview
      ? `Your trial includes the first ${previewLessonLimit} lessons. Upgrade to open this lesson or project.`
      : accessOutcome === "LOCKED_COURSE_UNAVAILABLE"
      ? "This course is currently unavailable to learners."
      : accessOutcome === "LOCKED_UPGRADE_REQUIRED"
      ? "This course needs a paid upgrade before the lessons unlock."
      : accessOutcome === "LOCKED_PAYMENT_PENDING"
        ? "Your payment request is pending admin review. Lessons will unlock after approval."
      : accessOutcome === "LOCKED_TRIAL_EXPIRED"
        ? "Your trial access is no longer enough for this course. Upgrade to continue."
        : "This lesson is locked for free accounts. Upgrade to unlock the course.";

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <div className="dashboard-empty">
          <p className="dashboard-kicker">
            {accessOutcome === "LOCKED_COURSE_UNAVAILABLE" ? "Course unavailable" : isTrialPreview ? "Trial preview limit" : "Upgrade required"}
          </p>
          <h1>{message}</h1>
          <p>
            {course
              ? `Open the ${course.title} course page and upgrade if your account is free.`
              : "The course is not published in the backend yet, so learner access is still locked."}
          </p>
          {enrollment ? (
            <p className="dashboard-copy">
              Current enrollment status: <strong>{enrollment.status}</strong>
            </p>
          ) : null}
          <div className="dashboard-actions">
            <Link
              href={courseHref}
              className="dashboard-primary-link"
            >
              Open course page
            </Link>
            <Link href="/dashboard" className="dashboard-secondary-link">
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
