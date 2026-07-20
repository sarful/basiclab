"use client";

import type { ReactNode } from "react";

import UniversalLessonCourseNav from "../../shared/UniversalLessonCourseNav";
import UniversalLessonHeader from "../../shared/UniversalLessonHeader";

const simulationTabs = [{ id: "simulation", label: "Simulation" }] as const;

export default function VoltageRegulatorLessonFrame({
  children,
  lessonId,
}: {
  children: ReactNode;
  lessonId: number;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffdf8 0%, #f8fafc 100%)",
        padding: "20px 16px 28px",
      }}
    >
      <div style={{ maxWidth: 1420, margin: "0 auto" }}>
        <section
          style={{
            borderRadius: 32,
            border: "2px solid #d8e1ea",
            background: "#ffffff",
            padding: 0,
            boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
            overflow: "hidden",
          }}
        >
          <UniversalLessonHeader
            lessonLabel={`Lesson ${String(lessonId).padStart(2, "0")}`}
            tabs={simulationTabs}
            activeTab="simulation"
          />

          <div style={{ padding: "28px 22px 22px", background: "#f8fafc" }}>
            <div style={{ marginBottom: 22 }}>
              <UniversalLessonCourseNav
                track="voltage-regulator"
                currentLessonId={lessonId}
              />
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
