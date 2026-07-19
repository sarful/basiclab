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
import { BASICS_COURSE_SLUG } from "../../../src/auth/course-access";
import type { EnrollmentRecord } from "../../../src/auth/types";
import { useBasicsCourseAccess } from "../../../src/auth/useBasicsCourseAccess";
import {
  basicsCourseModules,
  basicsCourseProjects,
} from "../../../src/courses/basics-electronics-and-electrical/courseCatalog";

export default function BasicsElectronicsAndElectricalCoursePage() {
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
  } = useBasicsCourseAccess();
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

    return {
      active,
      approved,
      pending,
    };
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
        { label: "Managed lessons", value: `${basicsCourseModules.length} modules` },
        { label: "Published state", value: course?.status ?? "Not created" },
      ]
    : [
        { label: "Course role", value: "Learner portal" },
        { label: "Managed lessons", value: `${basicsCourseModules.length} modules` },
        { label: "Access state", value: learnerStatusLabel },
      ];

  const heroMetrics = isAdmin
    ? [
        { label: "Enrolled users", value: String(adminEnrollmentSummary.active) },
        { label: "Approved", value: String(adminEnrollmentSummary.approved) },
        { label: "Pending review", value: String(adminEnrollmentSummary.pending) },
      ]
    : [
        { label: "Course lessons", value: String(basicsCourseModules.length) },
        { label: "Project steps", value: String(basicsCourseProjects.length) },
        { label: "Unlocked now", value: hasAccess ? String(isTrialPreview ? Math.min(previewLessonLimit, basicsCourseModules.length) : basicsCourseModules.length) : "0" },
      ];

  async function handleEnroll() {
    if (user?.accountState === "FREE") {
      router.push("/courses/basics-electronics-and-electrical/invoice");
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
          ? "Enrollment approved. Course lessons are ready."
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
        title: "Basics Electronics and Electrical",
        slug: BASICS_COURSE_SLUG,
        categoryId: "11111111-1111-4111-8111-111111111111",
        description:
          "Single frontend course that groups the core electronics and electrical learning modules.",
      });

      await publishAdminCourse(createResponse.data.id);
      setNotice("Backend course created and published. Learners can now enroll.");
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
      setNotice(
        requestError instanceof Error ? requestError.message : "Unable to publish the course.",
      );
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
      setNotice(
        requestError instanceof Error ? requestError.message : "Unable to unpublish the course.",
      );
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
      setNotice(
        requestError instanceof Error ? requestError.message : "Unable to approve enrollment.",
      );
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
      setNotice(
        requestError instanceof Error ? requestError.message : "Unable to reject enrollment.",
      );
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
        <Link href="/current-voltage-learning/1" className="dashboard-primary-link">
          Open First Lesson
        </Link>
      );
    }

    if (accessOutcome === "LOCKED_PAYMENT_PENDING") {
      return (
        <Link href="/courses/basics-electronics-and-electrical/invoice" className="dashboard-primary-link">
          Payment Pending
        </Link>
      );
    }

    if (accessOutcome === "LOCKED_TRIAL_EXPIRED") {
      return (
        <Link href="/courses/basics-electronics-and-electrical/invoice" className="dashboard-primary-link">
          Trial Expired - Upgrade
        </Link>
      );
    }

    if (
      user?.accountState === "FREE" ||
      accessOutcome === "LOCKED_UPGRADE_REQUIRED"
    ) {
      return (
        <Link href="/courses/basics-electronics-and-electrical/invoice" className="dashboard-primary-link">
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
                <h1>Basics Electronics and Electrical</h1>
                <p className="dashboard-copy">
                  Learn core electrical and electronics concepts through lessons and practical projects.
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
              {hasAccess || isAdmin ? (
                <Link href="/courses/basics-electronics-and-electrical/projects" className="dashboard-secondary-link">Course Projects</Link>
              ) : null}
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
                  Keep one backend course record for this training path. Publish it when learners
                  should be allowed to request access, or unpublish it to stop new enrollment.
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
                    <strong>{basicsCourseModules.length}</strong>
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
                  Approve pending users to unlock the course. Reject requests that should not enter
                  the learner track.
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
                  <p className="dashboard-section-kicker">Project List</p>
                  <h2>Project workspaces inside this course</h2>
                </div>
              </div>

              <p className="dashboard-copy">
                The course project folder is now attached to Basics Electronics and Electrical and
                the first ready projects open step by step from one place.
              </p>

              <div className="course-module-grid">
                {basicsCourseProjects.map((project) =>
                  project.href ? (
                    <Link key={project.title} href={project.href} className="course-module-card">
                      <small>{project.status === "ready" ? "Ready project" : "Project route"}</small>
                      <strong>{project.title}</strong>
                      <span>{project.description}</span>
                    </Link>
                  ) : (
                    <article key={project.title} className="course-module-card is-locked">
                      <small>Next phase</small>
                      <strong>{project.title}</strong>
                      <span>{project.description}</span>
                    </article>
                  ),
                )}
              </div>
            </section>

            <section className="dashboard-surface-card course-surface-card">
              <div className="dashboard-card-head">
                <div>
                  <p className="dashboard-section-kicker">Lesson List</p>
                  <h2>All lessons in this course</h2>
                </div>
              </div>

              <p className="dashboard-copy">
                Admin can open any lesson directly from this course page and review the full lesson sequence.
              </p>

              <div className="course-module-grid">
                {basicsCourseModules.map((module, index) => (
                  <Link key={module.href} href={module.href} className="course-module-card">
                    <small>{`Lesson ${index + 1}`}</small>
                    <strong>{module.title.replace(/^Lesson \d+\s/, "")}</strong>
                    <span>Open lesson module</span>
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
                <h2>{!course ? "Course unavailable" : hasAccess ? "Continue your lessons" : "Lessons require upgrade"}</h2>
              </div>
            </div>

            <p className="dashboard-copy">
              Follow the lessons in order and complete each practical topic.
            </p>

            <div className="course-module-grid">
              {basicsCourseModules.map((module, index) =>
                canAccessLesson(index) ? (
                  <Link key={module.href} href={module.href} className="course-module-card">
                    <small>{`Lesson ${index + 1}`}</small>
                    <strong>{module.title.replace(/^Lesson \d+\s/, "")}</strong>
                    <span>Open lesson module</span>
                  </Link>
                ) : (
                  <article key={module.href} className="course-module-card is-locked">
                    <small>{`Lesson ${index + 1}`}</small>
                    <strong>{module.title.replace(/^Lesson \d+\s/, "")}</strong>
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

            {hasAccess ? (
              <div className="dashboard-actions" style={{ marginTop: 24 }}>
                <Link href="/courses/basics-electronics-and-electrical/projects" className="dashboard-secondary-link">Open Project Steps</Link>
              </div>
            ) : null}
          </section>
        )}
      </section>
    </main>
  );
}
