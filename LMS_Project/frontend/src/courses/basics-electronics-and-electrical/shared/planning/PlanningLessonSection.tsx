"use client";

import type { ReactNode } from "react";

import PlanningTopicPanel from "./PlanningTopicPanel";

export default function PlanningLessonSection({
  topicCode,
  title,
  trackTitle,
  status,
  folderName,
  plannedFiles,
  simulationLabel,
  simulationNote,
  children,
}: {
  topicCode: string;
  title: string;
  trackTitle: string;
  status: string;
  folderName: string;
  plannedFiles: string[];
  simulationLabel: string;
  simulationNote: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        minHeight: 600,
      }}
    >
      <section
        style={{
          borderRadius: 26,
          border: "1px solid #dbe4ee",
          background: "linear-gradient(135deg, #f8fffb 0%, #ffffff 100%)",
          padding: 22,
          display: "grid",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 10, maxWidth: 760 }}>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#047857",
              }}
            >
              {trackTitle}
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.08,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              {topicCode} {title}
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#475569" }}>
              This route is reserved as a planning scaffold only. Final teaching notes, Bangla notes,
              English script notes, and interactive logic will be implemented later.
            </p>
          </div>

          <div
            style={{
              minWidth: 240,
              borderRadius: 22,
              border: "1px solid #d1fae5",
              background: "#ecfdf5",
              padding: 18,
              display: "grid",
              gap: 12,
              alignSelf: "start",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#047857" }}>
                Status
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 800, color: "#065f46" }}>{status}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#047857" }}>
                Folder
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: "#065f46" }}>{folderName}</p>
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: 22,
            border: "1px dashed #cbd5e1",
            background: "#ffffff",
            padding: 18,
            display: "grid",
            gap: 10,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#475569" }}>
            Planned Files
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {plannedFiles.map((file) => (
              <span
                key={file}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 34,
                  padding: "8px 12px",
                  borderRadius: 9999,
                  border: "1px solid #dbe4ee",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {file}
              </span>
            ))}
          </div>
        </div>
      </section>

      <PlanningTopicPanel
        sectionLabel="Simulation Plan"
        title={simulationLabel}
        description={simulationNote}
      />

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
