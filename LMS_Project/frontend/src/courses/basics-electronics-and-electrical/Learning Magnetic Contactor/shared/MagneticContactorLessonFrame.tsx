"use client";

import type { ReactNode } from "react";

import { useAuthorizedLessonTabs } from "@/src/auth/lesson-variant-access";

import UniversalLessonCourseNav from "../../shared/UniversalLessonCourseNav";
import UniversalLessonHeader from "../../shared/UniversalLessonHeader";

const magneticContactorTabs = [
  { id: "logic", label: "Logic & Theory" },
  { id: "logic_bn", label: "Logic & Theory (Bangla)" },
  { id: "english", label: "Udemy English Script" },
  { id: "bangla", label: "Udemy Script Bangla" },
  { id: "lesson", label: "Simulation" },
] as const;

type MagneticContactorLessonTab = (typeof magneticContactorTabs)[number]["id"];

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
        The <strong>{section}</strong> section for <strong>{title}</strong> is
        scaffolded and ready for the next content pass.
      </p>
    </section>
  );
}

export default function MagneticContactorLessonFrame({
  children,
  lessonId,
  lessonContent,
  lessonTitle,
}: {
  children: ReactNode;
  lessonId: number;
  lessonContent?: Partial<Record<MagneticContactorLessonTab, ReactNode>>;
  lessonTitle?: string;
}) {
  const { activeTab, setActiveTab, tabs } = useAuthorizedLessonTabs(
    magneticContactorTabs,
    "lesson",
  );

  const renderedContent =
    lessonContent?.[activeTab] ??
    (activeTab === "lesson" ? children : undefined);

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
        background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 48%, #f8fafc 100%)",
        padding: "20px 16px 28px",
      }}
    >
      <div
        style={{
          maxWidth: 1560,
          margin: "0 auto",
        }}
      >
        <section
          style={{
            borderRadius: 32,
            border: "2px solid #d7e3f3",
            background: "#ffffff",
            padding: 0,
            boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
            overflow: "hidden",
          }}
        >
          <UniversalLessonHeader
            lessonLabel={`Lesson ${String(lessonId).padStart(2, "0")}`}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div style={{ padding: "28px 22px 22px", background: "#f8fafc" }}>
            <div style={{ marginBottom: 22 }}>
              <UniversalLessonCourseNav
                track="magnetic-contactor"
                currentLessonId={lessonId}
              />
            </div>
            {renderedContent ?? (
              <InProgressTab
                title={lessonTitle ?? `Magnetic Contactor Lesson ${lessonId}`}
                section={sectionTitle}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
