"use client";

import type { ReactNode } from "react";

import { useAuthorizedLessonTabs } from "@/src/auth/lesson-variant-access";

import UniversalLessonHeader from "../../shared/UniversalLessonHeader";
import { CapacitorCourseNav } from "./capacitor_course_nav";

const capacitorHeaderTabs = [
  { id: "logic", label: "Logic & Theory" },
  { id: "logic_bn", label: "Logic & Theory (Bangla)" },
  { id: "english", label: "Udemy English Script" },
  { id: "bangla", label: "Udemy Script Bangla" },
  { id: "lesson", label: "Simulation" },
] as const;

export default function CapacitorLessonEmbeddedShell({
  children,
  lessonId,
  lessonTitle,
}: {
  children: ReactNode;
  lessonId: number;
  lessonTitle: string;
}) {
  const { tabs } = useAuthorizedLessonTabs(capacitorHeaderTabs, "lesson");

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
        <CapacitorCourseNav currentLessonId={lessonId} />
        {children}
      </div>
    </main>
  );
}
