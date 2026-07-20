"use client";

export default function PlanningProjectWorkspace({
  projectCode,
  title,
  status,
  folderName,
  description,
  plannedFiles,
}: {
  projectCode: string;
  title: string;
  status: string;
  folderName: string;
  description: string;
  plannedFiles: readonly string[];
}) {
  return (
    <main className="dashboard-page">
      <section className="dashboard-shell course-page-shell">
        <header className="course-page-hero">
          <div className="course-page-copy">
            <div className="course-page-topline">
              <p className="dashboard-kicker">Mini Project Planning</p>
            </div>

            <div className="course-page-title-row">
              <div>
                <h1>
                  {projectCode} {title}
                </h1>
                <p className="dashboard-copy">{description}</p>
              </div>

              <div className="course-status-pill is-neutral">
                <span className="course-status-dot" />
                {status}
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard-surface-card course-surface-card">
          <div className="dashboard-card-head">
            <div>
              <p className="dashboard-section-kicker">Planning Scaffold</p>
              <h2>Placeholder files are ready for later implementation</h2>
            </div>
          </div>

          <p className="dashboard-copy">
            This project route is intentionally lightweight. It keeps the roadmap connected while final
            workspace logic, drawings, notes, and controls are still pending.
          </p>

          <div className="course-page-metrics">
            <article className="course-page-metric-card">
              <strong>{plannedFiles.length}</strong>
              <span>planned files</span>
            </article>
            <article className="course-page-metric-card">
              <strong>Project</strong>
              <span>placeholder only</span>
            </article>
            <article className="course-page-metric-card">
              <strong>Folder</strong>
              <span>{folderName}</span>
            </article>
          </div>

          <div className="course-module-grid">
            {plannedFiles.map((file) => (
              <article key={file} className="course-module-card is-locked">
                <small>Planning file</small>
                <strong>{file}</strong>
                <span>Created as a placeholder scaffold. Final project implementation will be added later.</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
