"use client";

import ResistanceSimulation from "./1/ResistorStructureSimulation";
import ResistorLearningHeader from "./shared/ResistorLearningHeader";
import { ResistorCourseNav } from "./shared/resistor_course_nav";

export default function ResistorLearningWorkspace() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffdf8 0%, #f8fafc 100%)",
        padding: "24px 16px 32px",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <ResistorLearningHeader />
        <ResistorCourseNav currentLessonId={1} />

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "84px minmax(0,1fr)",
            gap: 18,
            alignItems: "start",
          }}
        >
          <div
            style={{
              borderRadius: 26,
              border: "3px solid #2ea84a",
              background: "#ffffff",
              minHeight: 680,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "18px 10px",
              position: "sticky",
              top: 16,
            }}
          >
            <span
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                color: "#2ea84a",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Control Panel
            </span>
          </div>

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
              <ResistanceSimulation />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
