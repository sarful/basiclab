"use client";

import Link from "next/link";

import { basicsCourseProjects } from "../../../../src/courses/basics-electronics-and-electrical/courseCatalog";
import { useBasicsCourseAccess } from "../../../../src/auth/useBasicsCourseAccess";

export default function BasicsElectronicsAndElectricalProjectsPage() {
  const { loading, error, hasAccess, isAdmin, isLoggedIn } = useBasicsCourseAccess();

  const accessLabel = loading
    ? "Checking access"
    : isAdmin
      ? "Admin project access"
      : hasAccess
        ? "Project access unlocked"
        : isLoggedIn
          ? "Upgrade to unlock projects"
          : "Login required";

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell course-page-shell">
        <header className="course-page-hero">
          <div className="course-page-copy">
            <div className="course-page-topline">
              <p className="dashboard-kicker">Project Track</p>
              <div className="course-page-quicklinks">
                <Link href="/" className="dashboard-secondary-link">
                  Home
                </Link>
                <Link href="/dashboard" className="dashboard-secondary-link">
                  Dashboard
                </Link>
                <Link href="/courses/basics-electronics-and-electrical" className="dashboard-secondary-link">
                  Course
                </Link>
              </div>
            </div>

            <div className="course-page-title-row">
              <div>
                <h1>Basics Electronics and Electrical Projects</h1>
                <p className="dashboard-copy">
                  Open the practical project workspaces in sequence. Ready project routes and
                  coming-soon planning placeholders are listed together so the full roadmap stays
                  visible.
                </p>
              </div>

              <div className={`course-status-pill ${hasAccess || isAdmin ? "is-approved" : "is-neutral"}`}>
                <span className="course-status-dot" />
                {accessLabel}
              </div>
            </div>

            {error ? <p className="dashboard-copy">{error}</p> : null}

            <div className="dashboard-actions">
              <Link href="/courses/basics-electronics-and-electrical" className="dashboard-secondary-link">
                Back to course
              </Link>
              <Link href="/current-voltage-learning/1" className="dashboard-primary-link">
                Start from Lesson 1
              </Link>
            </div>
          </div>

          <aside className="course-page-sidebar">
            <div className="course-sidebar-panel">
              <p className="dashboard-section-kicker">Step By Step</p>
              <div className="course-page-metrics">
                <article className="course-page-metric-card">
                  <strong>{basicsCourseProjects.length}</strong>
                  <span>project steps</span>
                </article>
                <article className="course-page-metric-card">
                  <strong>{basicsCourseProjects.filter((project) => project.status === "ready").length}</strong>
                  <span>ready now</span>
                </article>
                <article className="course-page-metric-card">
                  <strong>{basicsCourseProjects.filter((project) => project.status === "coming-soon").length}</strong>
                  <span>next phase</span>
                </article>
              </div>
            </div>
          </aside>
        </header>

        <section className="dashboard-surface-card course-surface-card">
          <div className="dashboard-card-head">
            <div>
              <p className="dashboard-section-kicker">Project Sequence</p>
              <h2>Render and open each project step</h2>
            </div>
          </div>

          <p className="dashboard-copy">
            Follow the projects in order. Admin, trial, and paid users can open ready project steps directly.
            Free users should upgrade first.
          </p>

          <div className="course-module-grid">
            {basicsCourseProjects.map((project) => {
              const canOpen = Boolean(project.href) && (isAdmin || hasAccess);

              if (project.href && canOpen) {
                return (
                  <Link key={project.title} href={project.href} className="course-module-card">
                    <small>{project.status === "ready" ? "Ready project" : "Project route"}</small>
                    <strong>{project.title}</strong>
                    <span>{project.description}</span>
                  </Link>
                );
              }

              return (
                <article
                  key={project.title}
                  className={`course-module-card${project.status === "coming-soon" || (!hasAccess && !isAdmin) ? " is-locked" : ""}`}
                >
                  <small>{project.status === "coming-soon" ? "Next phase" : "Locked project"}</small>
                  <strong>{project.title}</strong>
                  <span>
                    {project.status === "coming-soon"
                      ? project.description
                      : "Upgrade to unlock this project step."}
                  </span>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
