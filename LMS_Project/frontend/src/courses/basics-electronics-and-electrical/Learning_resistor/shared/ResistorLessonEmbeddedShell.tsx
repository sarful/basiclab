"use client";

import type { ReactNode } from "react";

import { useAuthorizedLessonTabs } from "@/src/auth/lesson-variant-access";

import UniversalLessonHeader from "../../shared/UniversalLessonHeader";
import { ResistorCourseNav } from "./resistor_course_nav";

const resistorHeaderTabs = [
  { id: "logic", label: "Logic & Theory" },
  { id: "logic_bn", label: "Logic & Theory (Bangla)" },
  { id: "english", label: "Udemy English Script" },
  { id: "bangla", label: "Udemy Script Bangla" },
  { id: "lesson", label: "Simulation" },
] as const;

export default function ResistorLessonEmbeddedShell({
  children,
  lessonId,
  lessonTitle,
}: {
  children: ReactNode;
  lessonId: number;
  lessonTitle: string;
}) {
  const { tabs } = useAuthorizedLessonTabs(resistorHeaderTabs, "lesson");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffdf8 0%, #f8fafc 100%)",
        padding: "24px 16px 32px",
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
        <UniversalLessonHeader
          lessonLabel={`Lesson ${String(lessonId).padStart(2, "0")}`}
          tabs={tabs}
          activeTab="lesson"
        />
        <ResistorCourseNav currentLessonId={lessonId} />
        {children}
      </div>
    </main>
  );
}
