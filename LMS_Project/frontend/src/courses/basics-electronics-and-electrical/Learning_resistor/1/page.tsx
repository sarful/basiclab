"use client";

import ResistorStructureSimulation from "./ResistorStructureSimulation";
import ResistorLessonEmbeddedShell from "../shared/ResistorLessonEmbeddedShell";

export default function ResistorLessonOneEmbeddedPage() {
  return (
    <ResistorLessonEmbeddedShell lessonId={1} lessonTitle="What is Resistance">
      <section
        style={{
          borderRadius: 32,
          border: "3px solid #2ea84a",
          background: "#ffffff",
          minHeight: 680,
          padding: 18,
          boxShadow: "0 14px 36px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            borderRadius: 26,
            border: "1px solid #dbe3ee",
            background: "#f8fafc",
            padding: 16,
            overflow: "hidden",
            minHeight: 640,
          }}
        >
          <div
            style={{
              marginBottom: 10,
              color: "#2ea84a",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.04em",
            }}
          >
            animation
          </div>
          <ResistorStructureSimulation embedded />
        </div>
      </section>
    </ResistorLessonEmbeddedShell>
  );
}
