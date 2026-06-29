"use client";

import type { ReactNode } from "react";

import { MeasurementPracticalCourseNav } from "./measurement_practical_course_nav";
import {
  LessonShellHeader,
  type LessonShellTab,
  useAuthorizedLessonTabs,
} from "../../Learning_Current_Voltage/shared/lesson_shell";

type MeasurementLessonTab = "lesson" | "logic" | "logic_bn" | "english" | "bangla";

function InProgressTab({
  title,
  section,
}: {
  title: string;
  section: string;
}) {
  return (
    <section
      style={{
        borderRadius: 28,
        border: "1px solid #dbe4ee",
        background: "#ffffff",
        padding: "28px 24px",
        boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 9999,
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          padding: "8px 14px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#1d4ed8",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            background: "#3b82f6",
          }}
        />
        In Progress
      </div>
      <h2
        style={{
          margin: "18px 0 0",
          fontSize: 28,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: "12px 0 0",
          maxWidth: 760,
          fontSize: 16,
          lineHeight: 1.8,
          color: "#64748b",
        }}
      >
        The <strong>{section}</strong> section for <strong>{title}</strong> is now
        scaffolded. The shared lesson header and Phase 2 course navigation are ready
        for the next content pass.
      </p>
    </section>
  );
}

export default function MeasurementPracticalLessonScaffold({
  lessonId,
  lessonLabel,
  lessonContent,
  lessonTitle,
}: {
  lessonId: number;
  lessonLabel: string;
  lessonContent?: Partial<Record<MeasurementLessonTab, ReactNode>>;
  lessonTitle: string;
}) {
  const tabs: LessonShellTab<MeasurementLessonTab>[] = [
    { id: "logic", label: "Logic & Theory" },
    { id: "logic_bn", label: "Logic & Theory (Bangla)" },
    { id: "english", label: "Udemy English Script" },
    { id: "bangla", label: "Udemy Script Bangla" },
    { id: "lesson", label: "Simulation" },
  ];

  const { activeTab, setActiveTab, tabs: visibleTabs } =
    useAuthorizedLessonTabs<MeasurementLessonTab>(tabs, "lesson");

  const sectionTitle =
    activeTab === "logic"
      ? "Logic & Theory"
      : activeTab === "logic_bn"
        ? "Logic & Theory (Bangla)"
        : activeTab === "english"
          ? "Udemy English Script"
          : activeTab === "bangla"
            ? "Udemy Script Bangla"
            : "Simulation";

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
          <LessonShellHeader
            lessonLabel={lessonLabel}
            tabs={visibleTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div style={{ padding: "28px 22px 22px", background: "#f8fafc" }}>
            <div style={{ marginBottom: 22 }}>
              <MeasurementPracticalCourseNav currentLessonId={lessonId} />
            </div>

            {lessonContent?.[activeTab] ?? (
              <InProgressTab title={lessonTitle} section={sectionTitle} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
