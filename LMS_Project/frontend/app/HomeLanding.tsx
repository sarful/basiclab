"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  createAdminCourse,
  createEnrollmentRequest,
  fetchPublicCourseStats,
  logout,
  publishAdminCourse,
} from "../src/auth/api";
import { useBackendMode } from "../src/auth/backend-mode";
import { BASICS_COURSE_SLUG } from "../src/auth/course-access";
import { useBasicsCourseAccess } from "../src/auth/useBasicsCourseAccess";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Categories", href: "/courses/basics-electronics-and-electrical" },
  { label: "About Us", href: "/dashboard" },
  { label: "Resources", href: "/courses/basics-electronics-and-electrical/projects" },
  { label: "Contact", href: "/register" },
];

const heroBenefits = [
  "Expert Instructors",
  "Practical Learning",
  "Certificate on Completion",
  "Learn at Your Pace",
];

const featureCards = [
  {
    title: "High Quality Lessons",
    copy: "Well-structured lesson routes from electricity to regulator fundamentals.",
  },
  {
    title: "Hands-on Projects",
    copy: "Real project workspaces connected to the same electronics track.",
  },
  {
    title: "Industry Relevant",
    copy: "Core electrical and electronics topics arranged in one practical roadmap.",
  },
  {
    title: "Quizzes and Progress",
    copy: "Track attempts, completion rate, and dashboard progress from one place.",
  },
  {
    title: "Certified Learning",
    copy: "Build a consistent learning journey with guided lessons and milestones.",
  },
];

const spotlightCards = [
  {
    title: "Basics Electronics and Electrical",
    badge: "Beginner Friendly",
    description:
      "Learn electronics, electrical circuits, components and practical applications.",
    href: "/courses/basics-electronics-and-electrical",
  },
];

const statsStrip = [
  { value: "10K+", label: "Happy Students" },
  { value: "1", label: "Main Course" },
  { value: "13+", label: "Lesson Routes" },
  { value: "8", label: "Projects Included" },
];

export default function HomeLanding() {
  const router = useRouter();
  const { isDisconnected } = useBackendMode();
  const { loading, error, course, enrollment, hasAccess, isAdmin, isLoggedIn, refresh } =
    useBasicsCourseAccess();
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
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

    loadCourseStats();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading && isLoggedIn && !isDisconnected) {
      router.replace("/dashboard");
    }
  }, [isDisconnected, isLoggedIn, loading, router]);

  async function handleEnroll() {
    if (!course) {
      setNotice("The backend course is not published yet.");
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      const response = await createEnrollmentRequest(course.id);
      setNotice(
        `${response.data.status} enrollment created. Course lessons are now unlocked for this account.`,
      );
      refresh();
    } catch (requestError) {
      setNotice(
        requestError instanceof Error ? requestError.message : "Unable to create enrollment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      refresh();
      router.replace("/");
    } catch (requestError) {
      setNotice(requestError instanceof Error ? requestError.message : "Unable to logout.");
    }
  }

  async function handleCreateCourse() {
    setSubmitting(true);
    setNotice(null);

    try {
      const createResponse = await createAdminCourse({
        title: "Basics Electronics and Electrical",
        slug: BASICS_COURSE_SLUG,
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

  function renderPrimaryAction() {
    if (loading) {
      return (
        <span className="home-ref-primary" aria-disabled="true">
          Checking Access...
        </span>
      );
    }

    if (!isLoggedIn) {
      return (
        <Link href="/register" className="home-ref-primary">
          Explore Courses
        </Link>
      );
    }

    if (isAdmin && !course) {
      return (
        <button type="button" className="home-ref-primary" onClick={handleCreateCourse}>
          {submitting ? "Publishing..." : "Create Backend Course"}
        </button>
      );
    }

    if (isAdmin || hasAccess) {
      return (
        <Link href="/courses/basics-electronics-and-electrical" className="home-ref-primary">
          Explore Courses
        </Link>
      );
    }

    return (
      <button type="button" className="home-ref-primary" onClick={handleEnroll}>
        {submitting ? "Enrolling..." : "Explore Courses"}
      </button>
    );
  }

  return (
    <main className="home-ref-page">
      <section className="home-ref-shell">
        <header className="home-ref-topbar">
          <Link href="/" className="home-ref-logo" aria-label="Electrical Training Platform home">
            <span>LOGO</span>
          </Link>

          <nav className="home-ref-nav" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={item.label === "Home" ? "is-active" : ""}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="home-ref-topbar-actions">
            <label className="home-ref-search">
              <span>Search</span>
              <input type="text" placeholder="Search courses, lessons..." />
            </label>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="home-ref-login">
                  Dashboard
                </Link>
                <button type="button" className="home-ref-primary home-ref-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="home-ref-cart">Cart</div>
                <Link href="/login" className="home-ref-login">
                  Login
                </Link>
                <Link href="/register" className="home-ref-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="home-ref-hero">
          <div className="home-ref-copy">
            <p className="home-ref-kicker">Electrical Training Platform</p>
            <h1>Learn Electronics &amp; Electrical Skills Online</h1>
            <p className="home-ref-description">
              Expert-led course access, practical projects, and hands-on lesson flow to build
              your electronics and electrical learning journey inside one structured LMS.
            </p>

            <div className="home-ref-cta-row">
              {renderPrimaryAction()}
              <Link href="/courses/basics-electronics-and-electrical" className="home-ref-secondary">
                Watch Intro
              </Link>
            </div>

            {notice ? <p className="home-ref-feedback">{notice}</p> : null}
            {error ? <p className="home-ref-feedback">{error}</p> : null}
            {enrollment ? (
              <p className="home-ref-feedback">
                Enrollment status: <strong>{enrollment.status}</strong>
              </p>
            ) : null}

            <div className="home-ref-benefits">
              {heroBenefits.map((item) => (
                <article key={item} className="home-ref-benefit">
                  <span className="home-ref-benefit-icon" />
                  <strong>{item}</strong>
                </article>
              ))}
            </div>
          </div>

          <aside className="home-ref-visual">
            <div className="home-ref-visual-frame">
              <div className="home-ref-wire" />
              <div className="home-ref-board">
                <span />
                <span />
                <span />
              </div>
              <div className="home-ref-led" />
              <div className="home-ref-meter">
                <div className="home-ref-meter-screen">12.5</div>
                <div className="home-ref-meter-dial" />
              </div>
            </div>
          </aside>
        </section>

        <section className="home-ref-feature-strip">
          {featureCards.map((item) => (
            <article key={item.title} className="home-ref-feature-card">
              <span className="home-ref-feature-icon" />
              <div>
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="home-ref-courses">
          <div className="home-ref-section-head">
            <div>
              <p className="home-ref-kicker">Popular Courses</p>
              <h2>Real course routes and lesson entry points</h2>
            </div>
            <Link href="/courses" className="home-ref-viewall">
              View All Courses
            </Link>
          </div>

          <div
            className={`home-ref-course-grid ${
              spotlightCards.length === 1 ? "is-single-course" : ""
            }`}
          >
            {spotlightCards.map((item) => (
              <Link key={item.title} href={item.href} className="home-ref-course-card">
                <div className="home-ref-course-image">
                  <span>Course Image / Thumbnail</span>
                </div>
                <div className="home-ref-course-body">
                  <div className="home-ref-course-topline">
                    <span className="home-ref-course-badge">{item.badge}</span>
                    <span className="home-ref-course-save" aria-hidden="true">
                      Save
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="home-ref-course-note">{item.description}</p>
                  <div className="home-ref-course-stats">
                    <article>
                      <strong>
                        {courseStats ? courseStats.studentsEnrolled.toLocaleString() : "0"}
                      </strong>
                      <span>Students Enrolled</span>
                    </article>
                    <article>
                      <strong>
                        {courseStats?.courseRating !== null && courseStats
                          ? courseStats.courseRating.toFixed(1)
                          : "N/A"}
                      </strong>
                      <span>Course Rating</span>
                    </article>
                    <article>
                      <strong>{courseStats ? courseStats.lessons : "0"}</strong>
                      <span>Lessons</span>
                    </article>
                  </div>
                  <div className="home-ref-course-footer">
                    <span>Start Learning</span>
                    <small>Open the main course workspace</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-ref-stats">
          {statsStrip.map((item) => (
            <article key={item.label} className="home-ref-stat-item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="home-ref-bottom-cta">
          <div>
            <p className="home-ref-kicker">Start Your Learning Journey Today</p>
            <h2>Join the electrical basics path and unlock lessons step by step.</h2>
            <p>
              Use the homepage, course page, and dashboard together to continue your training
              flow from registration to lesson completion.
            </p>
          </div>

          <div className="home-ref-form-row">
            <input type="email" placeholder="Enter your email" />
            {isLoggedIn ? (
              <Link href="/dashboard" className="home-ref-primary">
                Open Dashboard
              </Link>
            ) : (
              <Link href="/register" className="home-ref-primary">
                Get Started
              </Link>
            )}
            <span>No spam, unsubscribe anytime.</span>
          </div>
        </section>
      </section>
    </main>
  );
}
