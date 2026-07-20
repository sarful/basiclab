"use client";

import type { ReactNode } from "react";

import UniversalLessonCourseNav from "../../shared/UniversalLessonCourseNav";
import UniversalLessonHeader from "../../shared/UniversalLessonHeader";

const simulationTabs = [{ id: "simulation", label: "Simulation" }] as const;

type OptocouplerLessonFrameTab = {
  id: string;
  label: string;
};

export default function OptocouplerLessonFrame({
  children,
  lessonId,
  tabs,
  activeTab,
  onTabChange,
}: {
  children: ReactNode;
  lessonId: number;
  tabs?: OptocouplerLessonFrameTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}) {
  const resolvedTabs: OptocouplerLessonFrameTab[] = tabs ?? [...simulationTabs];
  const resolvedActiveTab =
    activeTab ?? resolvedTabs[0]?.id ?? simulationTabs[0].id;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffdf8 0%, #f8fafc 100%)",
        padding: "20px 16px 28px",
      }}
    >
      <div
        style={{
          maxWidth: 1420,
          margin: "0 auto",
        }}
      >
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
            tabs={resolvedTabs}
            activeTab={resolvedActiveTab}
            onTabChange={onTabChange}
          />

          <div style={{ padding: "28px 22px 22px", background: "#f8fafc" }}>
            <div style={{ marginBottom: 22 }}>
              <UniversalLessonCourseNav
                track="optocoupler"
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
