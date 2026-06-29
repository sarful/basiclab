"use client";

import Link from "next/link";

import { useBasicsCourseAccess } from "../../src/auth/useBasicsCourseAccess";
import {
  basicsCourseModules,
  basicsCourseProjects,
} from "../../src/courses/basics-electronics-and-electrical/courseCatalog";

const courseTitle = "Basics Electronics and Electrical";
const courseHref = "/courses/basics-electronics-and-electrical";
const projectHref = "/courses/basics-electronics-and-electrical/projects";
const firstLessonHref = "/current-voltage-learning/1";

export default function CoursesIndexPage() {
  const { loading, error, isAdmin, isLoggedIn, hasAccess, enrollment, course } =
    useBasicsCourseAccess();

  const accessLabel = loading
    ? "Checking access"
    : isAdmin
      ? `Admin view${course ? ` • ${course.status}` : ""}`
      : enrollment?.status ?? (isLoggedIn ? "Not enrolled yet" : "Guest view");

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell course-directory-shell">
        <header className="course-directory-hero">
          <div className="course-directory-copy">
            <div className="course-page-topline">
              <p className="dashboard-kicker">Course Directory</p>
              <div className="course-page-quicklinks">
                <Link href="/" className="dashboard-secondary-link">
                  Home
                </Link>
                <Link href="/dashboard" className="dashboard-secondary-link">
                  Dashboard
                </Link>
              </div>
            </div>

            <h1>Courses</h1>
            <p className="dashboard-copy">
              This LMS currently uses one main training track. Open the course workspace, review
              lessons, projects, and continue from the correct access state.
            </p>
          </div>

          <aside className="course-directory-summary">
            <div className="course-sidebar-item">
              <span>Active course</span>
              <strong>1 live course workspace</strong>
            </div>
            <div className="course-sidebar-item">
              <span>Lesson coverage</span>
              <strong>{basicsCourseModules.length} lessons</strong>
            </div>
            <div className="course-sidebar-item">
              <span>Project coverage</span>
              <strong>{basicsCourseProjects.length} projects</strong>
            </div>
          </aside>
        </header>

        <section className="course-directory-grid">
          <article className="course-directory-card">
            <div className="course-page-title-row">
              <div>
                <p className="dashboard-section-kicker">Featured Course</p>
                <h2>{courseTitle}</h2>
              </div>
              <div className="course-status-pill is-neutral">
                <span className="course-status-dot" />
                {accessLabel}
              </div>
            </div>

            <p className="dashboard-copy">
              The single industrial learning path for current, measurement, resistor,
              capacitor, diode, transformer, fuse, optocoupler, pushbutton, relay,
              transistor, regulator, and water-flow analogy fundamentals.
            </p>

            {error ? <p className="dashboard-copy">{error}</p> : null}

            <div className="course-directory-metrics">
              <article className="course-page-overview-card">
                <span>Course path</span>
                <strong>Single structured electrical basics track</strong>
              </article>
              <article className="course-page-overview-card">
                <span>Lessons</span>
                <strong>{basicsCourseModules.length} lesson routes</strong>
              </article>
              <article className="course-page-overview-card">
                <span>Projects</span>
                <strong>{basicsCourseProjects.length} project workspaces</strong>
              </article>
            </div>

            <div className="dashboard-actions">
              <Link href={courseHref} className="dashboard-primary-link">
                Open Course Page
              </Link>
              <Link href={projectHref} className="dashboard-secondary-link">
                Open Projects
              </Link>
              {hasAccess || isAdmin ? (
                <Link href={firstLessonHref} className="dashboard-secondary-link">
                  Start Lesson 1
                </Link>
              ) : (
                <Link href="/register" className="dashboard-secondary-link">
                  Register To Enroll
                </Link>
              )}
            </div>
          </article>

          <article className="course-directory-panel">
            <p className="dashboard-section-kicker">Course Access</p>
            <h2>Who can use this page</h2>
            <div className="course-directory-rule-list">
              <div className="course-sidebar-item">
                <span>Admin</span>
                <strong>Can open the course, projects, lessons, and manage publishing.</strong>
              </div>
              <div className="course-sidebar-item">
                <span>Approved learner</span>
                <strong>Can open the course page and unlock the full lesson path.</strong>
              </div>
              <div className="course-sidebar-item">
                <span>Guest or not enrolled</span>
                <strong>Should register or enroll first before lesson access is granted.</strong>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
