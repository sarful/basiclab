"use client";

import { ReactNode, useState } from "react";

type WorkspaceTab = {
  key: string;
  label: string;
  canvasTitle: string;
  canvasToolbar?: ReactNode;
  panelTitle?: string;
  canvasContent: ReactNode;
  panelContent?: ReactNode;
  fullWidth?: boolean;
  layout?: "split" | "stacked" | "dual-stacked";
  secondaryCanvasTitle?: string;
  secondaryCanvasToolbar?: ReactNode;
  secondaryCanvasContent?: ReactNode;
};

type ProjectWorkspaceTemplateProps = {
  badge?: string;
  title?: string;
  tabs: WorkspaceTab[];
  initialTabKey?: string;
  className?: string;
  headerActions?: ReactNode;
};

export default function ProjectWorkspaceTemplate({
  badge = "PROJECT",
  title = "Project Workspace",
  tabs,
  initialTabKey,
  className = "",
  headerActions,
}: ProjectWorkspaceTemplateProps) {
  const [activeTabKey, setActiveTabKey] = useState(
    initialTabKey ?? tabs[0]?.key ?? "",
  );

  const activeTab =
    tabs.find((tab) => tab.key === activeTabKey) ?? tabs[0] ?? null;

  if (!activeTab) {
    return null;
  }

  return (
    <section
      className={`project-workspace project-workspace--${activeTab.key} ${className}`}
    >
      <div className="project-workspace-header">
        <div className="project-workspace-header-main">
          <span className="project-workspace-badge">{badge}</span>
          <h1 className="project-workspace-title">{title}</h1>
        </div>

        <div className="project-workspace-tabs">
          {tabs.map((tab) => {
            const active = tab.key === activeTab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTabKey(tab.key)}
                className={`project-workspace-tab ${active ? "is-active" : ""}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {headerActions ? (
        <div className="project-workspace-stickybar">
          <div className="project-workspace-header-actions">{headerActions}</div>
        </div>
      ) : null}

      {activeTab.fullWidth ? (
        <div className="project-workspace-theory">
          <h2 className="project-workspace-section-title">
            {activeTab.canvasTitle}
          </h2>
          <div className="project-workspace-section-body">
            {activeTab.canvasContent}
          </div>
        </div>
      ) : activeTab.layout === "dual-stacked" ? (
        <div className="project-workspace-stack project-workspace-stack-dual">
          {activeTab.panelContent ? (
            <div className="project-workspace-panel project-workspace-panel-horizontal">
              <h2 className="project-workspace-section-title">
                {activeTab.panelTitle ?? "Control Panel"}
              </h2>
              <div className="project-workspace-section-body project-workspace-panel-body project-workspace-panel-body-horizontal">
                {activeTab.panelContent}
              </div>
            </div>
          ) : null}

          <div className="project-workspace-dual-canvas">
            <div className="project-workspace-canvas">
              <div className="project-workspace-section-head">
                <h2 className="project-workspace-section-title">
                  {activeTab.canvasTitle}
                </h2>
                {activeTab.canvasToolbar ? (
                  <div className="project-workspace-section-tools">
                    {activeTab.canvasToolbar}
                  </div>
                ) : null}
              </div>
              <div className="project-workspace-section-body project-workspace-canvas-body">
                {activeTab.canvasContent}
              </div>
            </div>

            <div className="project-workspace-canvas">
              <div className="project-workspace-section-head">
                <h2 className="project-workspace-section-title">
                  {activeTab.secondaryCanvasTitle ?? "Secondary Canvas"}
                </h2>
                {activeTab.secondaryCanvasToolbar ? (
                  <div className="project-workspace-section-tools">
                    {activeTab.secondaryCanvasToolbar}
                  </div>
                ) : null}
              </div>
              <div className="project-workspace-section-body project-workspace-canvas-body">
                {activeTab.secondaryCanvasContent}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab.layout === "stacked" ? (
        <div className="project-workspace-stack project-workspace-stack-sidebar">
          <div className="project-workspace-panel project-workspace-panel-sidebar">
            <h2 className="project-workspace-section-title">
              {activeTab.panelTitle ?? "Control Panel"}
            </h2>
            <div className="project-workspace-section-body project-workspace-panel-body project-workspace-panel-body-sidebar">
              {activeTab.panelContent}
            </div>
          </div>

          <div className="project-workspace-canvas">
            <div className="project-workspace-section-head">
              <h2 className="project-workspace-section-title">
                {activeTab.canvasTitle}
              </h2>
              {activeTab.canvasToolbar ? (
                <div className="project-workspace-section-tools">
                  {activeTab.canvasToolbar}
                </div>
              ) : null}
            </div>
            <div className="project-workspace-section-body project-workspace-canvas-body">
              {activeTab.canvasContent}
            </div>
          </div>
        </div>
      ) : (
        <div className="project-workspace-grid">
          <div className="project-workspace-panel">
            <h2 className="project-workspace-section-title">
              {activeTab.panelTitle ?? "Control Panel"}
            </h2>
            <div className="project-workspace-section-body project-workspace-panel-body">
              {activeTab.panelContent}
            </div>
          </div>

          <div className="project-workspace-canvas">
            <div className="project-workspace-section-head">
              <h2 className="project-workspace-section-title">
                {activeTab.canvasTitle}
              </h2>
              {activeTab.canvasToolbar ? (
                <div className="project-workspace-section-tools">
                  {activeTab.canvasToolbar}
                </div>
              ) : null}
            </div>
            <div className="project-workspace-section-body project-workspace-canvas-body">
              {activeTab.canvasContent}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
