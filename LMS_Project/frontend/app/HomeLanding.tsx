"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import {
  createAdminCourse,
  createEnrollmentRequest,
  fetchPublicCourseStats,
  logout,
  publishAdminCourse,
} from "../src/auth/api";

import { BASICS_COURSE_SLUG } from "../src/auth/course-access";
import { useBasicsCourseAccess } from "../src/auth/useBasicsCourseAccess";

const COURSE_URL = "/courses/basics-electronics-and-electrical";

const PROJECTS_URL = "/courses/basics-electronics-and-electrical/projects";

type IconName =
  | "arrow"
  | "book"
  | "check"
  | "circuit"
  | "menu"
  | "play"
  | "star"
  | "users"
  | "x"
  | "zap";

type IconProps = {
  name: IconName;
  size?: number;
};

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Course", href: COURSE_URL },
  { label: "Projects", href: PROJECTS_URL },
];

const benefits = [
  "Beginner-friendly lessons",
  "Interactive practical projects",
  "Progress and completion tracking",
];

function Icon({ name, size = 20 }: IconProps) {
  const icons: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    circuit: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v4" />
        <path d="M15 3v4" />
        <path d="M9 17v4" />
        <path d="M15 17v4" />
        <path d="M3 9h4" />
        <path d="M3 15h4" />
        <path d="M17 9h4" />
        <path d="M17 15h4" />
        <path d="M9 9h6v6H9z" />
      </>
    ),

    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),

    play: <path d="m8 5 11 7-11 7Z" />,

    star: (
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" />
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),

    x: (
      <>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </>
    ),

    zap: <path d="M13 2 3 14h9l-1 8 10-12h-9Z" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

function CoursePreview() {
  const sidebarItems = [
    "Introduction",
    "Ohm's Law",
    "Series Circuits",
    "Parallel Circuits",
    "Power & Energy",
    "Circuit Practice",
  ];

  return (
    <div className="el-preview-wrapper">
      <div className="el-preview-card">
        <div className="el-preview-header">
          <div>
            <small>Course workspace</small>
            <strong>Basics Electronics and Electrical</strong>
          </div>

          <span className="el-status">In progress</span>
        </div>

        <div className="el-preview-body">
          <aside className="el-preview-sidebar">
            <span className="el-module-label">Module 03</span>

            {sidebarItems.map((item, index) => (
              <div
                key={item}
                className={`el-sidebar-item ${index === 3 ? "is-active" : ""}`}
              >
                <span>{item}</span>

                <i>{index < 3 && <Icon name="check" size={8} />}</i>
              </div>
            ))}
          </aside>

          <section className="el-lesson-area">
            <div className="el-progress-row">
              <span>Course progress</span>
              <strong>68%</strong>
            </div>

            <div className="el-progress-track">
              <span />
            </div>

            <small className="el-progress-note">
              9 of 13 lessons completed
            </small>

            <div className="el-circuit-panel">
              <svg
                viewBox="0 0 520 210"
                role="img"
                aria-label="Parallel circuit diagram"
              >
                <defs>
                  <filter id="greenGlow">
                    <feGaussianBlur stdDeviation="5" result="blur" />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path className="circuit-wire" d="M70 55H210V35H330V55H445" />

                <path className="circuit-wire" d="M210 55V155H330V55" />

                <path className="circuit-wire secondary" d="M70 55V155H210" />

                <rect
                  className="circuit-resistor"
                  x="210"
                  y="15"
                  width="120"
                  height="40"
                  rx="7"
                />

                <text
                  className="circuit-label"
                  x="270"
                  y="31"
                  textAnchor="middle"
                >
                  R1
                </text>

                <text
                  className="circuit-value"
                  x="270"
                  y="47"
                  textAnchor="middle"
                >
                  220Ω
                </text>

                <rect
                  className="circuit-resistor"
                  x="210"
                  y="135"
                  width="120"
                  height="40"
                  rx="7"
                />

                <text
                  className="circuit-label"
                  x="270"
                  y="151"
                  textAnchor="middle"
                >
                  R2
                </text>

                <text
                  className="circuit-value"
                  x="270"
                  y="167"
                  textAnchor="middle"
                >
                  330Ω
                </text>

                <line className="battery" x1="48" y1="82" x2="48" y2="128" />

                <line className="battery" x1="60" y1="91" x2="60" y2="119" />

                <text className="battery-label" x="13" y="109">
                  12V
                </text>

                <circle className="circuit-node" cx="70" cy="55" r="4" />

                <circle className="circuit-node" cx="210" cy="55" r="4" />

                <circle className="circuit-node" cx="330" cy="55" r="4" />

                <circle className="circuit-node" cx="445" cy="55" r="4" />

                <circle className="circuit-node" cx="210" cy="155" r="4" />

                <circle className="circuit-node" cx="330" cy="155" r="4" />

                <line
                  className="circuit-wire"
                  x1="445"
                  y1="55"
                  x2="445"
                  y2="98"
                />

                <ellipse
                  className="circuit-led"
                  cx="445"
                  cy="118"
                  rx="15"
                  ry="22"
                  filter="url(#greenGlow)"
                />

                <line className="led-leg" x1="439" y1="140" x2="439" y2="170" />

                <line className="led-leg" x1="451" y1="140" x2="451" y2="170" />
              </svg>
            </div>

            <div className="el-lesson-footer">
              <div>
                <strong>Parallel Circuits</strong>

                <p>Learn how current flows through multiple paths.</p>
              </div>

              <span className="el-lesson-icon">
                <Icon name="circuit" size={22} />
              </span>
            </div>
          </section>
        </div>
      </div>

      <div className="el-meter-card">
        <span>AUTO</span>
        <strong>12.5</strong>
        <small>V</small>
      </div>
    </div>
  );
}

export default function HomeLanding() {
  const router = useRouter();

  const {
    loading,
    error,
    user,
    course,
    hasAccess,
    accessOutcome,
    isAdmin,
    isLoggedIn,
    refresh,
  } = useBasicsCourseAccess();

  const [submitting, setSubmitting] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [courseStats, setCourseStats] = useState<{
    studentsEnrolled: number;
    courseRating: number | null;
    lessons: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCourseStats() {
      try {
        const response = await fetchPublicCourseStats(BASICS_COURSE_SLUG);

        if (!cancelled) {
          setCourseStats({
            studentsEnrolled: response.data.studentsEnrolled,
            courseRating: response.data.courseRating,
            lessons: response.data.lessons,
          });
        }
      } catch {
        if (!cancelled) {
          setCourseStats(null);
        }
      }
    }

    void loadCourseStats();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const normalizedError = error?.toLowerCase() ?? "";

  const isExpectedGuestError =
    normalizedError.includes("auth session missing") ||
    normalizedError.includes("unauthorized") ||
    normalizedError.includes("authentication required") ||
    normalizedError.includes("not authenticated") ||
    normalizedError.includes("401");

  const visibleError = error && !isExpectedGuestError ? error : null;

  async function handleEnroll() {
    if (!course) {
      setNotice("The course is not available yet.");
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      const response = await createEnrollmentRequest(course.id);

      setNotice(response.data.status === "APPROVED" ? "Course access is active now." : "Course access updated.");

      await refresh();
    } catch (requestError) {
      setNotice(
        requestError instanceof Error
          ? requestError.message
          : "Unable to open course access.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateCourse() {
    setSubmitting(true);
    setNotice(null);

    try {
      const response = await createAdminCourse({
        title: "Basics Electronics and Electrical",
        slug: BASICS_COURSE_SLUG,
        categoryId: "11111111-1111-4111-8111-111111111111",
        description:
          "Learn electrical fundamentals, electronic components, circuits, measurement, safety, and practical projects.",
      });

      await publishAdminCourse(response.data.id);

      setNotice("The course was created and published.");

      await refresh();
    } catch (requestError) {
      setNotice(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create the course.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    setNotice(null);

    try {
      await logout();
      await refresh();

      setMobileMenuOpen(false);
      router.replace("/");
    } catch (requestError) {
      setNotice(
        requestError instanceof Error
          ? requestError.message
          : "Unable to log out.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function renderCourseAction(className = "el-button el-button-primary") {
    if (loading) {
      return (
        <span className={className} aria-disabled="true">
          <span className="el-spinner" />
          Checking access
        </span>
      );
    }

    if (!isLoggedIn) {
      return (
        <Link href={COURSE_URL} className={className}>
          Explore course
          <Icon name="arrow" size={18} />
        </Link>
      );
    }

    if (isAdmin && !course) {
      return (
        <button
          type="button"
          className={className}
          onClick={handleCreateCourse}
          disabled={submitting}
        >
          {submitting ? "Publishing..." : "Create course"}
        </button>
      );
    }

    if (isAdmin || hasAccess) {
      return (
        <Link href={COURSE_URL} className={className}>
          {isAdmin ? "Manage course" : "Continue course"}

          <Icon name="arrow" size={18} />
        </Link>
      );
    }

    if (
      user?.accountState === "FREE" ||
      accessOutcome === "LOCKED_PAYMENT_PENDING"
    ) {
      return (
        <Link href="/User/dashboard" className={className}>
          {accessOutcome === "LOCKED_PAYMENT_PENDING"
            ? "Payment status"
            : "Upgrade access"}

          <Icon name="arrow" size={18} />
        </Link>
      );
    }

    return (
      <button
        type="button"
        className={className}
        onClick={handleEnroll}
        disabled={submitting}
      >
        {submitting ? "Opening..." : "Open access"}

        {!submitting && <Icon name="arrow" size={18} />}
      </button>
    );
  }

  const students = courseStats?.studentsEnrolled ?? 0;

  const lessons = courseStats?.lessons ?? 13;

  const rating =
    courseStats?.courseRating !== null &&
    courseStats?.courseRating !== undefined
      ? courseStats.courseRating.toFixed(1)
      : "New";

  return (
    <main className="el-page">
      <header className="el-header">
        <div className="el-container el-header-inner">
          <Link href="/" className="el-brand" aria-label="ET LMS home">
            <span className="el-brand-icon">
              <Icon name="zap" size={20} />
            </span>

            <span className="el-brand-copy">
              <strong>ET LMS</strong>
              <small>Electrical Training</small>
            </span>
          </Link>

          <nav className="el-desktop-nav" aria-label="Primary navigation">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.href === "/" ? "is-active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="el-desktop-actions">
            {isLoggedIn ? (
              <>
                <Link
                  href={isAdmin ? "/Admin/dashboard" : "/User/dashboard"}
                  className="el-button el-button-ghost"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  className="el-button el-button-outline"
                  onClick={handleLogout}
                  disabled={submitting}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="el-button el-button-ghost">
                  Log in
                </Link>

                <Link href="/register" className="el-button el-button-outline">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="el-menu-button"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="el-mobile-menu">
            <nav>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                  <Icon name="arrow" size={16} />
                </Link>
              ))}
            </nav>

            <div className="el-mobile-actions">
              {isLoggedIn ? (
                <>
                  <Link
                    href={isAdmin ? "/Admin/dashboard" : "/User/dashboard"}
                    className="el-button el-button-secondary"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    className="el-button el-button-primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="el-button el-button-secondary">
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    className="el-button el-button-primary"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <section className="el-hero">
        <div className="el-container el-hero-grid">
          <div className="el-hero-copy">
            <p className="el-eyebrow">Electrical training platform</p>

            <h1>
              Build real-world
              <span>electrical skills</span>
              with confidence.
            </h1>

            <p className="el-description">
              Clear lessons, practical projects, and job-relevant electrical
              knowledge.
            </p>

            <div className="el-hero-actions">
              {renderCourseAction()}

              <Link
                href={PROJECTS_URL}
                className="el-button el-button-secondary"
              >
                <span className="el-play-icon">
                  <Icon name="play" size={13} />
                </span>
                View projects
              </Link>
            </div>

            {(notice || visibleError) && (
              <div className="el-feedback-list" aria-live="polite">
                {notice && <p className="el-feedback">{notice}</p>}

                {visibleError && (
                  <p className="el-feedback is-error">{visibleError}</p>
                )}
              </div>
            )}

            <ul className="el-benefit-list">
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <span>
                    <Icon name="check" size={13} />
                  </span>

                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <CoursePreview />
        </div>

        <div className="el-container">
          <div className="el-stat-bar">
            <article>
              <Icon name="users" size={24} />

              <div>
                <strong>{students.toLocaleString()}</strong>
                <small>Active learners</small>
              </div>
            </article>

            <article>
              <Icon name="book" size={24} />

              <div>
                <strong>{lessons}+</strong>
                <small>Structured lessons</small>
              </div>
            </article>

            <article>
              <Icon name="circuit" size={24} />

              <div>
                <strong>8</strong>
                <small>Practical projects</small>
              </div>
            </article>

            <article>
              <Icon name="star" size={24} />

              <div>
                <strong>{rating}</strong>
                <small>Course rating</small>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="el-cta-section">
        <div className="el-container">
          <div className="el-cta-card">
            <div>
              <p>Basics Electronics and Electrical</p>

              <h2>Start learning with practical lessons and projects.</h2>
            </div>

            <div className="el-cta-actions">
              {renderCourseAction("el-button el-button-light")}

              <Link href={COURSE_URL} className="el-cta-link">
                View course details
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html {
          min-width: 320px;
          margin: 0;
          padding: 0;
          scroll-behavior: smooth;
        }

        body {
          min-width: 320px;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          color: #ffffff;
          background: #061518;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          font: inherit;
        }

        svg {
          display: block;
        }

        .el-page {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          color: #ffffff;
          background: #061518;
        }

        .el-container {
          width: min(1240px, calc(100% - 64px));
          margin: 0 auto;
        }

        .el-header {
          position: relative;
          z-index: 100;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(5, 20, 23, 0.94);
          backdrop-filter: blur(18px);
        }

        .el-header-inner {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .el-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
        }

        .el-brand-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: #031614;
          background: #2dd4bf;
          box-shadow: 0 10px 26px rgba(45, 212, 191, 0.22);
        }

        .el-brand-copy {
          display: grid;
          line-height: 1;
        }

        .el-brand-copy strong {
          font-size: 17px;
        }

        .el-brand-copy small {
          margin-top: 6px;
          color: #72d8cc;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .el-desktop-nav {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .el-desktop-nav a {
          padding: 10px 15px;
          border-radius: 9px;
          color: #a7bdc0;
          font-size: 13px;
          font-weight: 700;
        }

        .el-desktop-nav a:hover,
        .el-desktop-nav a.is-active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .el-desktop-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .el-button {
          min-height: 48px;
          padding: 0 21px;
          border: 0;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 800;
          line-height: 1;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .el-button:hover {
          transform: translateY(-1px);
        }

        .el-button:disabled,
        .el-button[aria-disabled="true"] {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .el-button-primary {
          color: #031614;
          background: linear-gradient(135deg, #22d3bd, #47e6ce);
          box-shadow: 0 14px 32px rgba(34, 211, 189, 0.2);
        }

        .el-button-secondary {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.04);
        }

        .el-button-outline {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.19);
          background: rgba(255, 255, 255, 0.06);
        }

        .el-button-ghost {
          color: #bed0d2;
          background: transparent;
        }

        .el-button-light {
          color: #07635b;
          background: #ffffff;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.2);
        }

        .el-menu-button {
          width: 44px;
          height: 44px;
          display: none;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 11px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .el-mobile-menu {
          display: none;
        }

        .el-hero {
          position: relative;
          padding: 86px 0 54px;
          background:
            radial-gradient(
              circle at 30% 15%,
              rgba(20, 184, 166, 0.13),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 65%,
              rgba(13, 148, 136, 0.12),
              transparent 28%
            ),
            linear-gradient(90deg, #041315, #071f23);
        }

        .el-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.18;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(45, 212, 191, 0.05) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(45, 212, 191, 0.05) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image: linear-gradient(to right, transparent, black 45%);
        }

        .el-hero-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns:
            minmax(0, 0.9fr)
            minmax(520px, 1.1fr);
          gap: 72px;
          align-items: center;
        }

        .el-hero-copy {
          min-width: 0;
          padding: 20px 0;
        }

        .el-eyebrow {
          margin: 0 0 20px;
          color: #5eead4;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .el-hero-copy h1 {
          max-width: 670px;
          margin: 0;
          color: #ffffff;
          font-size: clamp(52px, 5vw, 76px);
          font-weight: 800;
          line-height: 1.03;
          letter-spacing: -0.058em;
        }

        .el-hero-copy h1 span {
          display: block;
          color: #20cdb8;
        }

        .el-description {
          max-width: 560px;
          margin: 28px 0 0;
          color: #c1d2d5;
          font-size: 17px;
          line-height: 1.72;
        }

        .el-hero-actions {
          margin-top: 31px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .el-play-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          color: #5eead4;
        }

        .el-feedback-list {
          max-width: 560px;
          margin-top: 20px;
          display: grid;
          gap: 8px;
        }

        .el-feedback {
          margin: 0;
          padding: 11px 13px;
          border: 1px solid rgba(94, 234, 212, 0.24);
          border-radius: 10px;
          color: #a7f3d0;
          background: rgba(13, 148, 136, 0.1);
          font-size: 12px;
          font-weight: 700;
        }

        .el-feedback.is-error {
          color: #fecaca;
          border-color: rgba(248, 113, 113, 0.3);
          background: rgba(127, 29, 29, 0.18);
        }

        .el-benefit-list {
          margin: 31px 0 0;
          padding: 0;
          display: grid;
          gap: 13px;
          list-style: none;
        }

        .el-benefit-list li {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #edfdfb;
          font-size: 13px;
          font-weight: 700;
        }

        .el-benefit-list li > span {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031614;
          background: #20cdb8;
        }

        .el-preview-wrapper {
          position: relative;
          min-width: 0;
          padding-bottom: 68px;
        }

        .el-preview-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 24px;
          background: rgba(5, 23, 28, 0.96);
          box-shadow: 0 35px 70px rgba(0, 0, 0, 0.34);
        }

        .el-preview-header {
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .el-preview-header > div {
          display: grid;
          gap: 5px;
        }

        .el-preview-header small {
          color: #7d999d;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .el-preview-header strong {
          color: #ffffff;
          font-size: 17px;
        }

        .el-status {
          padding: 7px 10px;
          border-radius: 999px;
          color: #a7f3d0;
          background: rgba(16, 185, 129, 0.2);
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .el-preview-body {
          display: grid;
          grid-template-columns: 145px 1fr;
          min-height: 430px;
        }

        .el-preview-sidebar {
          padding: 24px 12px;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          background: #06171c;
        }

        .el-module-label {
          margin-bottom: 14px;
          padding: 0 9px;
          display: block;
          color: #d4e6e8;
          font-size: 10px;
          font-weight: 800;
        }

        .el-sidebar-item {
          min-height: 40px;
          padding: 0 9px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border-radius: 8px;
          color: #9fb5b8;
          font-size: 9px;
          font-weight: 700;
        }

        .el-sidebar-item.is-active {
          color: #dcfffa;
          background: linear-gradient(
            90deg,
            rgba(15, 118, 110, 0.9),
            rgba(15, 118, 110, 0.35)
          );
        }

        .el-sidebar-item i {
          width: 13px;
          height: 13px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid #3c5a60;
          border-radius: 50%;
          color: #5eead4;
        }

        .el-lesson-area {
          min-width: 0;
          padding: 25px;
        }

        .el-progress-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #cce0e2;
          font-size: 10px;
          font-weight: 700;
        }

        .el-progress-track {
          height: 8px;
          margin-top: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: #123139;
        }

        .el-progress-track span {
          width: 68%;
          height: 100%;
          display: block;
          border-radius: inherit;
          background: linear-gradient(90deg, #0fa594, #37d6bf);
        }

        .el-progress-note {
          margin-top: 7px;
          display: block;
          color: #779397;
          font-size: 8px;
        }

        .el-circuit-panel {
          height: 220px;
          margin-top: 17px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          background: #071c22;
        }

        .el-circuit-panel svg {
          width: 100%;
          height: 100%;
        }

        .el-circuit-panel .circuit-wire {
          fill: none;
          stroke: #58ead8;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .el-circuit-panel .secondary {
          opacity: 0.5;
        }

        .el-circuit-panel .circuit-resistor {
          fill: #102e35;
          stroke: #5eead4;
          stroke-width: 1.7;
        }

        .el-circuit-panel .circuit-label {
          fill: #e8fffc;
          font-size: 10px;
          font-weight: 800;
        }

        .el-circuit-panel .circuit-value {
          fill: #a7f3d0;
          font-size: 10px;
        }

        .el-circuit-panel .battery,
        .el-circuit-panel .led-leg {
          stroke: #e6fffb;
          stroke-width: 3;
        }

        .el-circuit-panel .battery-label {
          fill: #e6fffb;
          font-size: 10px;
          font-weight: 800;
        }

        .el-circuit-panel .circuit-node {
          fill: #d8fffa;
        }

        .el-circuit-panel .circuit-led {
          fill: #37efad;
          stroke: #d1fae5;
          stroke-width: 2;
        }

        .el-lesson-footer {
          margin-top: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: #0e2830;
        }

        .el-lesson-footer strong {
          color: #ffffff;
          font-size: 12px;
        }

        .el-lesson-footer p {
          margin: 5px 0 0;
          color: #86a0a4;
          font-size: 8px;
        }

        .el-lesson-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: #22d3bd;
          background: rgba(34, 211, 189, 0.1);
        }

        .el-meter-card {
          position: absolute;
          right: 24px;
          bottom: 0;
          width: 155px;
          height: 94px;
          padding: 14px 17px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          border: 4px solid #18564e;
          border-radius: 18px;
          color: #0b201d;
          background: linear-gradient(145deg, #157468, #0a403b);
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.34);
          transform: rotate(-4deg);
        }

        .el-meter-card::before {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 8px;
          background: #b8c9bb;
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.25);
        }

        .el-meter-card span,
        .el-meter-card strong,
        .el-meter-card small {
          position: relative;
          z-index: 1;
        }

        .el-meter-card span {
          align-self: start;
          grid-column: 1 / -1;
          font-size: 7px;
          font-weight: 900;
        }

        .el-meter-card strong {
          font-family: monospace;
          font-size: 36px;
          line-height: 1;
        }

        .el-meter-card small {
          padding-bottom: 3px;
          font-size: 12px;
          font-weight: 800;
        }

        .el-stat-bar {
          position: relative;
          z-index: 4;
          margin-top: 42px;
          padding: 26px 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 16px;
          background: rgba(8, 25, 29, 0.88);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.22);
        }

        .el-stat-bar article {
          min-height: 58px;
          padding: 0 28px;
          display: flex;
          align-items: center;
          gap: 15px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .el-stat-bar article:last-child {
          border-right: 0;
        }

        .el-stat-bar svg {
          color: #22d3bd;
        }

        .el-stat-bar article > div {
          display: grid;
          gap: 5px;
        }

        .el-stat-bar strong {
          color: #ffffff;
          font-size: 23px;
          line-height: 1;
        }

        .el-stat-bar small {
          color: #9eb4b7;
          font-size: 10px;
        }

        .el-cta-section {
          padding: 78px 0;
          background: #f4f8f7;
        }

        .el-cta-card {
          position: relative;
          min-height: 225px;
          overflow: hidden;
          padding: 50px 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          border-radius: 25px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 85% 0%,
              rgba(45, 212, 191, 0.28),
              transparent 33%
            ),
            linear-gradient(135deg, #073d3a, #071c20);
          box-shadow: 0 25px 55px rgba(7, 61, 58, 0.17);
        }

        .el-cta-card::after {
          content: "";
          position: absolute;
          right: -80px;
          bottom: -145px;
          width: 245px;
          height: 245px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          box-shadow:
            0 0 0 42px rgba(255, 255, 255, 0.025),
            0 0 0 84px rgba(255, 255, 255, 0.018);
        }

        .el-cta-card > div {
          position: relative;
          z-index: 1;
        }

        .el-cta-card p {
          margin: 0;
          color: #5eead4;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .el-cta-card h2 {
          max-width: 700px;
          margin: 15px 0 0;
          color: #ffffff;
          font-size: clamp(30px, 4vw, 47px);
          line-height: 1.12;
          letter-spacing: -0.045em;
        }

        .el-cta-actions {
          display: grid;
          justify-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        .el-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #a7f3d0;
          font-size: 11px;
          font-weight: 800;
        }

        .el-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(0, 0, 0, 0.24);
          border-top-color: #061413;
          border-radius: 50%;
          animation: elSpin 0.75s linear infinite;
        }

        @keyframes elSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1080px) {
          .el-container {
            width: min(100% - 40px, 900px);
          }

          .el-desktop-nav {
            display: none;
          }

          .el-hero {
            padding-top: 70px;
          }

          .el-hero-grid {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .el-hero-copy {
            max-width: 760px;
            margin: 0 auto;
            text-align: center;
          }

          .el-hero-copy h1,
          .el-description {
            margin-right: auto;
            margin-left: auto;
          }

          .el-hero-actions {
            justify-content: center;
          }

          .el-benefit-list {
            width: max-content;
            max-width: 100%;
            margin-right: auto;
            margin-left: auto;
            text-align: left;
          }

          .el-feedback-list {
            margin-right: auto;
            margin-left: auto;
          }

          .el-preview-wrapper {
            width: min(100%, 760px);
            margin: 0 auto;
          }

          .el-stat-bar {
            grid-template-columns: 1fr 1fr;
          }

          .el-stat-bar article:nth-child(2) {
            border-right: 0;
          }

          .el-stat-bar article:nth-child(1),
          .el-stat-bar article:nth-child(2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .el-cta-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .el-cta-actions {
            justify-items: start;
          }
        }

        @media (max-width: 720px) {
          .el-container {
            width: min(100% - 28px, 1240px);
          }

          .el-header-inner {
            min-height: 68px;
          }

          .el-desktop-actions {
            display: none;
          }

          .el-menu-button {
            display: grid;
          }

          .el-mobile-menu {
            position: fixed;
            top: 68px;
            right: 0;
            left: 0;
            z-index: 99;
            height: calc(100vh - 68px);
            padding: 18px 20px;
            display: block;
            overflow-y: auto;
            background: #07191c;
          }

          .el-mobile-menu nav {
            display: grid;
          }

          .el-mobile-menu nav a {
            padding: 17px 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 15px;
            font-weight: 800;
          }

          .el-mobile-actions {
            margin-top: 22px;
            display: grid;
            gap: 10px;
          }

          .el-hero {
            padding: 58px 0 45px;
          }

          .el-hero-copy h1 {
            font-size: clamp(42px, 13vw, 58px);
          }

          .el-description {
            font-size: 16px;
          }

          .el-hero-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .el-hero-actions .el-button {
            width: 100%;
          }

          .el-preview-body {
            grid-template-columns: 105px 1fr;
            min-height: 375px;
          }

          .el-preview-sidebar {
            padding: 18px 8px;
          }

          .el-sidebar-item {
            min-height: 34px;
            padding: 0 6px;
            font-size: 7px;
          }

          .el-lesson-area {
            padding: 18px;
          }

          .el-circuit-panel {
            height: 170px;
          }

          .el-preview-header strong {
            font-size: 14px;
          }

          .el-meter-card {
            right: 15px;
            width: 132px;
            height: 82px;
          }

          .el-meter-card strong {
            font-size: 30px;
          }

          .el-stat-bar {
            padding: 14px;
          }

          .el-stat-bar article {
            min-height: 78px;
            padding: 0 13px;
          }

          .el-stat-bar strong {
            font-size: 20px;
          }

          .el-cta-card {
            padding: 37px 25px;
          }

          .el-cta-actions,
          .el-cta-actions .el-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .el-brand-copy small {
            display: none;
          }

          .el-hero-copy h1 {
            font-size: 40px;
          }

          .el-eyebrow {
            font-size: 9px;
          }

          .el-preview-header {
            padding: 16px;
          }

          .el-status {
            display: none;
          }

          .el-preview-body {
            grid-template-columns: 78px 1fr;
            min-height: 330px;
          }

          .el-preview-sidebar {
            padding: 13px 4px;
          }

          .el-module-label {
            padding: 0 4px;
            font-size: 7px;
          }

          .el-sidebar-item {
            min-height: 29px;
            padding: 0 4px;
            font-size: 6px;
          }

          .el-sidebar-item i {
            width: 9px;
            height: 9px;
          }

          .el-lesson-area {
            padding: 12px;
          }

          .el-circuit-panel {
            height: 135px;
          }

          .el-lesson-footer {
            padding: 10px;
          }

          .el-lesson-footer p {
            display: none;
          }

          .el-lesson-icon {
            width: 34px;
            height: 34px;
          }

          .el-preview-wrapper {
            padding-bottom: 54px;
          }

          .el-meter-card {
            right: 8px;
            width: 112px;
            height: 70px;
            padding: 11px 13px;
          }

          .el-meter-card strong {
            font-size: 25px;
          }

          .el-stat-bar {
            grid-template-columns: 1fr;
          }

          .el-stat-bar article {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .el-stat-bar article:last-child {
            border-bottom: 0;
          }

          .el-cta-card h2 {
            font-size: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
