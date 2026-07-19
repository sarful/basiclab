"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  approveAdminEnrollment,
  archiveAdminCourse,
  createAdminCourse,
  createEnrollmentRequest,
  fetchAdminEnrollments,
  publishAdminCourse,
  rejectAdminEnrollment,
} from "../../../src/auth/api";
import { INDUSTRIAL_SENSOR_COURSE_SLUG } from "../../../src/auth/course-access";
import type { EnrollmentRecord } from "../../../src/auth/types";
import { useIndustrialSensorCourseAccess } from "../../../src/auth/useIndustrialSensorCourseAccess";
import {
  industrialSensorCourseModules,
  industrialSensorCourseTitle,
  industrialSensorFirstLessonHref,
} from "../../../src/courses/Industrial_Sensor/courseCatalog";

export default function IndustrialSensorCoursePage() {
  const router = useRouter();
  const {
    loading,
    error,
    user,
    course,
    hasAccess,
    isTrialPreview,
    previewLessonLimit,
    trialDaysRemaining,
    canAccessLesson,
    accessOutcome,
    isAdmin,
    isLoggedIn,
    refresh,
  } = useIndustrialSensorCourseAccess();
  const [submitting, setSubmitting] = useState(false);
  const [processingEnrollmentId, setProcessingEnrollmentId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [adminEnrollments, setAdminEnrollments] = useState<EnrollmentRecord[]>([]);
  const [adminEnrollmentRefreshKey, setAdminEnrollmentRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAdminEnrollments() {
      if (!isAdmin || !course) {
        setAdminEnrollments([]);
        return;
      }

      try {
        const response = await fetchAdminEnrollments(course.id);
        if (!cancelled) {
          setAdminEnrollments(response.data);
        }
      } catch {
        if (!cancelled) {
          setAdminEnrollments([]);
        }
      }
    }

    loadAdminEnrollments();

    return () => {
      cancelled = true;
    };
  }, [course, isAdmin, adminEnrollmentRefreshKey]);

  const adminEnrollmentSummary = useMemo(() => {
    const active = adminEnrollments.filter((item) =>
      item.status === "APPROVED" || item.status === "PENDING",
    ).length;
    const approved = adminEnrollments.filter((item) => item.status === "APPROVED").length;
    const pending = adminEnrollments.filter((item) => item.status === "PENDING").length;

    return { active, approved, pending };
  }, [adminEnrollments]);

  const pendingEnrollments = useMemo(
    () => adminEnrollments.filter((item) => item.status === "PENDING"),
    [adminEnrollments],
  );

  const courseStatusTone =
    course?.status === "PUBLISHED"
      ? {
          label: "Published",
          background: "#ecfdf5",
          border: "1px solid #86efac",
          color: "#166534",
          dot: "#16a34a",
        }
      : {
          label: "Unpublished",
          background: "#fef2f2",
          border: "1px solid #fca5a5",
          color: "#b91c1c",
          dot: "#dc2626",
        };

  const learnerStatusLabel = loading
    ? "Checking access"
    : accessOutcome === "LOCKED_COURSE_UNAVAILABLE"
      ? "Course unavailable"
      : isTrialPreview
        ? `Trial preview | ${previewLessonLimit} lessons | ${trialDaysRemaining ?? 0} days left`
      : hasAccess
      ? "Access unlocked"
      : accessOutcome === "LOCKED_PAYMENT_PENDING"
        ? "Payment pending review"
        : accessOutcome === "LOCKED_UPGRADE_REQUIRED"
          ? "Upgrade required"
          : accessOutcome === "LOCKED_TRIAL_EXPIRED"
            ? "Trial expired"
            : isLoggedIn
              ? "Upgrade required"
              : "Login required";

  const learnerStatusTone =
    hasAccess
      ? "is-approved"
      : accessOutcome === "LOCKED_PAYMENT_PENDING"
        ? "is-pending"
        : "is-neutral";

  const overviewItems = isAdmin
    ? [
        { label: "Course role", value: "Admin control panel" },
        { label: "Managed lessons", value: `${industrialSensorCourseModules.length} modules` },
        { label: "Published state", value: course?.status ?? "Not created" },
      ]
    : [
        { label: "Course role", value: "Learner portal" },
        { label: "Managed lessons", value: `${industrialSensorCourseModules.length} modules` },
        { label: "Access state", value: learnerStatusLabel },
      ];

  const heroMetrics = isAdmin
    ? [
        { label: "Enrolled users", value: String(adminEnrollmentSummary.active) },
        { label: "Approved", value: String(adminEnrollmentSummary.approved) },
        { label: "Pending review", value: String(adminEnrollmentSummary.pending) },
      ]
    : [
        { label: "Course lessons", value: String(industrialSensorCourseModules.length) },
        { label: "Simulator labs", value: String(industrialSensorCourseModules.length) },
        { label: "Unlocked now", value: hasAccess ? String(isTrialPreview ? Math.min(previewLessonLimit, industrialSensorCourseModules.length) : industrialSensorCourseModules.length) : "0" },
      ];

  async function handleEnroll() {
    if (user?.accountState === "FREE") {
      router.push("/courses/industrial-sensor/invoice");
      return;
    }

    if (!course) {
      setNotice("This course is not available for access.");
      return;
    }

    setSubmitting(true);
    setNotice(null);
    try {
      const response = await createEnrollmentRequest(course.id);
      setNotice(
        response.data.status === "APPROVED"
          ? "Enrollment approved. Industrial Sensor lessons are ready."
          : "Access request submitted.",
      );
      refresh();
    } catch (requestError) {
      setNotice(requestError instanceof Error ? requestError.message : "Unable to open course access.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateCourse() {
    setSubmitting(true);
    setNotice(null);

    try {
      const createResponse = await createAdminCourse({
        title: industrialSensorCourseTitle,
        slug: INDUSTRIAL_SENSOR_COURSE_SLUG,
        categoryId: "33333333-3333-4333-8333-333333333333",
        description: "Interactive industrial sensor simulator course with PLC wiring focused labs.",
      });

      await publishAdminCourse(createResponse.data.id);
      setNotice("Industrial Sensor backend course created and published.");
      refresh();
    } catch (requestError) {
      setNotice(
        requestError instanceof Error ? requestError.message : "Unable to create the backend course.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish() {
    if (!course) {
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      await publishAdminCourse(course.id);
      setNotice("Course published successfully.");
      refresh();
    } catch (requestError) {
      setNotice(requestError instanceof Error ? requestError.message : "Unable to publish the course.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUnpublish() {
    if (!course) {
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      await archiveAdminCourse(course.id);
      setNotice("Course unpublished successfully.");
      refresh();
    } catch (requestError) {
      setNotice(requestError instanceof Error ? requestError.message : "Unable to unpublish the course.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApproveEnrollment(enrollmentId: string) {
    setProcessingEnrollmentId(enrollmentId);
    setNotice(null);

    try {
      await approveAdminEnrollment(enrollmentId);
      setNotice("Pending enrollment approved successfully.");
      setAdminEnrollmentRefreshKey((value) => value + 1);
      refresh();
    } catch (requestError) {
      setNotice(requestError instanceof Error ? requestError.message : "Unable to approve enrollment.");
    } finally {
      setProcessingEnrollmentId(null);
    }
  }

  async function handleRejectEnrollment(enrollmentId: string) {
    setProcessingEnrollmentId(enrollmentId);
    setNotice(null);

    try {
      await rejectAdminEnrollment(enrollmentId);
      setNotice("Pending enrollment rejected successfully.");
      setAdminEnrollmentRefreshKey((value) => value + 1);
      refresh();
    } catch (requestError) {
      setNotice(requestError instanceof Error ? requestError.message : "Unable to reject enrollment.");
    } finally {
      setProcessingEnrollmentId(null);
    }
  }

  function renderPrimaryAction() {
    if (loading) {
      return (
        <span className="dashboard-primary-link" aria-disabled="true">
          Checking access...
        </span>
      );
    }

    if (!isLoggedIn) {
      return (
        <Link href="/login" className="dashboard-primary-link">
          Login to Continue
        </Link>
      );
    }

    if (isAdmin) {
      if (!course) {
        return (
          <button type="button" className="dashboard-primary-link dashboard-button" onClick={handleCreateCourse}>
            {submitting ? "Publishing course..." : "Create Backend Course"}
          </button>
        );
      }

      return (
        <button
          type="button"
          className="dashboard-primary-link dashboard-button"
          onClick={course.status === "PUBLISHED" ? handleUnpublish : handlePublish}
        >
          {submitting
            ? course.status === "PUBLISHED"
              ? "Unpublishing..."
              : "Publishing..."
            : course.status === "PUBLISHED"
              ? "Unpublish Course"
              : "Publish Course"}
        </button>
      );
    }

    if (!course) {
      return (
        <span className="dashboard-primary-link" aria-disabled="true">
          Course Unavailable
        </span>
      );
    }

    if (hasAccess) {
      return (
        <Link href={industrialSensorFirstLessonHref} className="dashboard-primary-link">
          Open First Lesson
        </Link>
      );
    }

    if (accessOutcome === "LOCKED_PAYMENT_PENDING") {
      return (
        <Link href="/courses/industrial-sensor/invoice" className="dashboard-primary-link">
          Payment Pending
        </Link>
      );
    }

    if (accessOutcome === "LOCKED_TRIAL_EXPIRED") {
      return (
        <Link href="/courses/industrial-sensor/invoice" className="dashboard-primary-link">
          Trial Expired - Upgrade
        </Link>
      );
    }

    if (user?.accountState === "FREE" || accessOutcome === "LOCKED_UPGRADE_REQUIRED") {
      return (
        <Link href="/courses/industrial-sensor/invoice" className="dashboard-primary-link">
          Enroll to Unlock
        </Link>
      );
    }

    return (
      <button type="button" className="dashboard-primary-link dashboard-button" onClick={handleEnroll} disabled={submitting}>
        {submitting ? "Submitting..." : "Open Course Access"}
      </button>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell course-page-shell">
        <header className="course-page-hero">
          <div className="course-page-copy">
            <div className="course-page-topline">
              <p className="dashboard-kicker">Engineering Course</p>
              <div className="course-page-quicklinks">
                <Link href="/" className="dashboard-secondary-link">
                  Home
                </Link>
                <Link href={isAdmin ? "/Admin/courses" : "/User/my-courses"} className="dashboard-secondary-link">
                  {isAdmin ? "Manage Course" : "My Courses"}
                </Link>
              </div>
            </div>

            <div className="course-page-title-row">
              <div>
                <h1>{industrialSensorCourseTitle}</h1>
                <p className="dashboard-copy">
                  Learn industrial sensors through simulator labs, wiring diagrams, theory panels,
                  quizzes, and PLC-focused practice.
                </p>
              </div>

              <div className={`course-status-pill ${learnerStatusTone}`}>
                <span className="course-status-dot" />
                {isAdmin ? `Admin View${course ? ` | ${course.status}` : ""}` : learnerStatusLabel}
              </div>
            </div>

            <div className="dashboard-actions">
              {!isLoggedIn ? <Link href="/register" className="dashboard-secondary-link">Create Account</Link> : null}
              {renderPrimaryAction()}
              <Link href="/courses" className="dashboard-secondary-link">All Courses</Link>
            </div>

            {notice ? <p className="dashboard-copy">{notice}</p> : null}
            {error ? <p className="dashboard-copy">{error}</p> : null}

            <div className="course-page-overview-grid">
              {overviewItems.map((item) => (
                <article key={item.label} className="course-page-overview-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <aside className="course-page-sidebar">
            <div className="course-sidebar-panel">
              <p className="dashboard-section-kicker">Course Overview</p>
              <div className="course-page-metrics">
                {heroMetrics.map((item) => (
                  <article key={item.label} className="course-page-metric-card">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </header>

        {isAdmin ? (
          <>
            <div className="course-admin-grid">
              <section className="dashboard-surface-card course-surface-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Backend Course</p>
                    <h2>Publishing and course availability</h2>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      borderRadius: 9999,
                      padding: "8px 13px",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      background: courseStatusTone.background,
                      border: courseStatusTone.border,
                      color: courseStatusTone.color,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        background: courseStatusTone.dot,
                      }}
                    />
                    {courseStatusTone.label}
                  </span>
                </div>

                <p className="dashboard-copy">
                  Keep one backend course record for the Industrial Sensor training path. Publish it
                  when learners should access sensor labs, or unpublish it to pause enrollment.
                </p>

                <div className="dashboard-stat-grid course-stat-grid">
                  <article className="dashboard-stat-card">
                    <strong>{adminEnrollmentSummary.active}</strong>
                    <span>enrolled users</span>
                  </article>
                  <article className="dashboard-stat-card">
                    <strong>{adminEnrollmentSummary.approved}</strong>
                    <span>approved users</span>
                  </article>
                  <article className="dashboard-stat-card">
                    <strong>{adminEnrollmentSummary.pending}</strong>
                    <span>pending reviews</span>
                  </article>
                  <article className="dashboard-stat-card">
                    <strong>{industrialSensorCourseModules.length}</strong>
                    <span>lesson modules</span>
                  </article>
                </div>
              </section>

              <section className="dashboard-surface-card course-surface-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Pending Approvals</p>
                    <h2>Review learner requests</h2>
                  </div>
                </div>

                <p className="dashboard-copy">
                  Approve pending users to unlock Industrial Sensor. Reject requests that should not
                  enter this course track.
                </p>

                <div className="course-approval-stack">
                  {pendingEnrollments.length ? (
                    pendingEnrollments.map((item) => (
                      <article key={item.id} className="course-approval-card">
                        <div>
                          <strong>{`Pending user ${item.userId.slice(0, 8)}`}</strong>
                          <span>{`Requested at ${new Date(item.requestedAt).toLocaleString()}`}</span>
                        </div>
                        <div className="course-approval-actions">
                          <button
                            type="button"
                            className="dashboard-primary-link dashboard-button"
                            onClick={() => handleApproveEnrollment(item.id)}
                            disabled={processingEnrollmentId === item.id}
                          >
                            {processingEnrollmentId === item.id ? "Processing..." : "Approve"}
                          </button>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => handleRejectEnrollment(item.id)}
                            disabled={processingEnrollmentId === item.id}
                          >
                            Reject
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="course-empty-state">No pending enrollment requests right now.</div>
                  )}
                </div>
              </section>
            </div>

            <section className="dashboard-surface-card course-surface-card">
              <div className="dashboard-card-head">
                <div>
                  <p className="dashboard-section-kicker">Lesson List</p>
                  <h2>All Industrial Sensor lessons</h2>
                </div>
              </div>

              <p className="dashboard-copy">
                Admin can open any simulator lab directly and review the full Industrial Sensor
                sequence.
              </p>

              <div className="course-module-grid">
                {industrialSensorCourseModules.map((module, index) => (
                  <Link key={module.href} href={module.href} className="course-module-card">
                    <small>{`Lesson ${index + 1}`}</small>
                    <strong>{module.shortTitle}</strong>
                    <span>{module.description}</span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="dashboard-surface-card course-surface-card">
            <div className="dashboard-card-head">
              <div>
                <p className="dashboard-section-kicker">Course Roadmap</p>
                <h2>{!course ? "Course unavailable" : hasAccess ? "Continue your sensor labs" : "Lessons require upgrade"}</h2>
              </div>
            </div>

            <p className="dashboard-copy">
              Follow the sensor labs in order and complete each practical topic.
            </p>

            <div className="course-module-grid">
              {industrialSensorCourseModules.map((module, index) =>
                canAccessLesson(index) ? (
                  <Link key={module.href} href={module.href} className="course-module-card">
                    <small>{`Lesson ${index + 1}`}</small>
                    <strong>{module.shortTitle}</strong>
                    <span>{module.description}</span>
                  </Link>
                ) : (
                  <article key={module.href} className="course-module-card is-locked">
                    <small>{`Lesson ${index + 1}`}</small>
                    <strong>{module.shortTitle}</strong>
                    <span>
                      {!course
                        ? "This course is not published for learners."
                        : isTrialPreview
                        ? "Trial preview limit reached"
                        : user?.accountState === "FREE"
                        ? "Upgrade to unlock"
                        : "Login with trial or paid access"}
                    </span>
                  </article>
                ),
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
