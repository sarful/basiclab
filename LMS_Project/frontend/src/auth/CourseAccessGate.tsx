"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useBasicsCourseAccess } from "./useBasicsCourseAccess";

export default function CourseAccessGate({ children }: { children: ReactNode }) {
  const { loading, error, user, course, enrollment, hasAccess, isAdmin } =
    useBasicsCourseAccess();

  if (loading) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-empty">
            <p className="dashboard-kicker">Checking access</p>
            <h1>Verifying course enrollment before opening lessons.</h1>
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
            <h1>Sign in first, then enroll in the course to unlock lessons.</h1>
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

  if (isAdmin || hasAccess) {
    return <>{children}</>;
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <div className="dashboard-empty">
          <p className="dashboard-kicker">Enrollment required</p>
          <h1>This lesson is locked until you enroll in the course.</h1>
          <p>
            {course
              ? `Open the ${course.title} course page and use the enroll button first.`
              : "The course is not published in the backend yet, so learner access is still locked."}
          </p>
          {enrollment ? (
            <p className="dashboard-copy">
              Current enrollment status: <strong>{enrollment.status}</strong>
            </p>
          ) : null}
          <div className="dashboard-actions">
            <Link
              href="/courses/basics-electronics-and-electrical"
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
