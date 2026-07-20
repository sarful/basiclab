"use client";

import Link from "next/link";

import { useBasicsCourseAccess } from "../../src/auth/useBasicsCourseAccess";
import { useIndustrialSensorCourseAccess } from "../../src/auth/useIndustrialSensorCourseAccess";
import { basicsCourseModules } from "../../src/courses/basics-electronics-and-electrical/courseCatalog";
import {
  industrialSensorCourseHref,
  industrialSensorCourseModules,
  industrialSensorCourseTitle,
  industrialSensorFirstLessonHref,
} from "../../src/courses/Industrial_Sensor/courseCatalog";

const courseTitle = "Basics Electronics and Electrical";
const courseHref = "/courses/basics-electronics-and-electrical";
const firstLessonHref = "/current-voltage-learning/1";
export default function CoursesIndexPage() {
  const { loading, error, isAdmin, isLoggedIn, hasAccess, user, course } =
    useBasicsCourseAccess();
  const industrialSensorAccess = useIndustrialSensorCourseAccess();
  const showBasicsCourse = isAdmin || Boolean(course);
  const showIndustrialSensorCourse = industrialSensorAccess.isAdmin || Boolean(industrialSensorAccess.course);
  const totalCourseCount = Number(showBasicsCourse) + Number(showIndustrialSensorCourse);
  const totalLessonCount =
    (showBasicsCourse ? basicsCourseModules.length : 0) +
    (showIndustrialSensorCourse ? industrialSensorCourseModules.length : 0);

  const accessLabel = loading
    ? "Checking access"
    : isAdmin
      ? `Admin view${course ? ` • ${course.status}` : ""}`
      : hasAccess
        ? "Access unlocked"
        : user?.accountState === "FREE"
          ? "Upgrade required"
          : isLoggedIn
            ? "Account access ready"
            : "Guest view";

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
              This LMS now includes the core electrical basics track and the Industrial Sensor
              simulator course. Open a course workspace, review structured lessons, and continue
              from the correct access state.
            </p>
          </div>

          <aside className="course-directory-summary">
            <div className="course-sidebar-item">
              <span>Active courses</span>
              <strong>{totalCourseCount} live course workspaces</strong>
            </div>
            <div className="course-sidebar-item">
              <span>Lesson coverage</span>
              <strong>{totalLessonCount} lessons</strong>
            </div>
            <div className="course-sidebar-item">
              <span>Practice mode</span>
              <strong>Interactive simulations and guided lesson checks</strong>
            </div>
          </aside>
        </header>

        <section className="course-directory-grid">
          {showBasicsCourse ? <article className="course-directory-card">
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
              capacitor, diode, transformer, fuse, magnetic contactor, optocoupler, pushbutton, relay,
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
                <span>Practice</span>
                <strong>Simulations, quizzes, and visual circuit walkthroughs</strong>
              </article>
            </div>

            <div className="dashboard-actions">
              <Link href={courseHref} className="dashboard-primary-link">
                Open Course Page
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
          </article> : null}

          {showIndustrialSensorCourse ? <article className="course-directory-card">
            <div className="course-page-title-row">
              <div>
                <p className="dashboard-section-kicker">New Course</p>
                <h2>{industrialSensorCourseTitle}</h2>
              </div>
              <div className={`course-status-pill ${industrialSensorAccess.hasAccess || industrialSensorAccess.isAdmin ? "is-approved" : "is-neutral"}`}>
                <span className="course-status-dot" />
                {industrialSensorAccess.isAdmin
                  ? `Admin view${industrialSensorAccess.course ? ` | ${industrialSensorAccess.course.status}` : ""}`
                  : industrialSensorAccess.hasAccess
                    ? "Access unlocked"
                    : "Upgrade required"}
              </div>
            </div>

            <p className="dashboard-copy">
              A complete industrial sensor learning path with interactive labs for proximity,
              photoelectric, ultrasonic, pressure, level, flow, load cell, electrical sensors,
              temperature sensors, and motor feedback topics.
            </p>

            <div className="course-directory-metrics">
              <article className="course-page-overview-card">
                <span>Course path</span>
                <strong>Industrial sensor simulator track</strong>
              </article>
              <article className="course-page-overview-card">
                <span>Lessons</span>
                <strong>{industrialSensorCourseModules.length} lab routes</strong>
              </article>
              <article className="course-page-overview-card">
                <span>Practice</span>
                <strong>Simulator, theory, wiring, quiz</strong>
              </article>
            </div>

            <div className="dashboard-actions">
              <Link href={industrialSensorCourseHref} className="dashboard-primary-link">
                Open Course Page
              </Link>
              {industrialSensorAccess.hasAccess || industrialSensorAccess.isAdmin ? (
                <Link href={industrialSensorFirstLessonHref} className="dashboard-secondary-link">
                  Start Lesson 1
                </Link>
              ) : (
                <Link href="/courses/industrial-sensor/invoice" className="dashboard-secondary-link">
                  Upgrade required
                </Link>
              )}
            </div>
          </article> : null}

          <article className="course-directory-panel">
            <p className="dashboard-section-kicker">Course Access</p>
            <h2>Who can use this page</h2>
            <div className="course-directory-rule-list">
              <div className="course-sidebar-item">
                <span>Admin</span>
                <strong>Can open the course, lessons, and manage publishing.</strong>
              </div>
              <div className="course-sidebar-item">
                <span>Trial or paid learner</span>
                <strong>Can open the course page and unlock the full lesson path directly.</strong>
              </div>
              <div className="course-sidebar-item">
                <span>Guest or free learner</span>
                <strong>Should login or upgrade before protected lesson access is granted.</strong>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
