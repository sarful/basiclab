"use client";

import CurrentVoltageLessonNineSeriesCircuitSimulation from "./CurrentVoltageLessonNineSeriesCircuitSimulation";
import { LogicTheoryBanglaSection } from "./LogicTheoryBanglaSection";
import { LogicTheorySection } from "./LogicTheorySection";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { CurrentVoltageCourseNav } from "../shared/current_voltage_course_nav";
import {
  LessonShellHeader,
  useAuthorizedLessonTabs,
  type LessonShellTab,
} from "../shared/lesson_shell";

type LessonNineTab =
  | "logic"
  | "logic_bn"
  | "english"
  | "bangla"
  | "lesson";

function InProgressTab({ title }: { title: string }) {
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
        This section is the next part of the Series Circuit Basics lesson build.
        The shared lesson shell and course navigation are now ready, and this tab
        is prepared for the next content pass.
      </p>
    </section>
  );
}

export default function CurrentVoltageLessonNineSeriesCircuitEmbeddedPage() {
  const { activeTab, setActiveTab, tabs } = useAuthorizedLessonTabs<LessonNineTab>(
    [
    { id: "logic", label: "Logic & Theory" },
    { id: "logic_bn", label: "Logic & Theory (Bangla)" },
    { id: "english", label: "Udemy English Script" },
    { id: "bangla", label: "Udemy Script Bangla" },
    { id: "lesson", label: "Simulation" },
    ] satisfies LessonShellTab<LessonNineTab>[],
    "lesson",
  );

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
            lessonLabel="Lesson 09"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div style={{ padding: "28px 22px 22px", background: "#f8fafc" }}>
            <div style={{ marginBottom: 22 }}>
              <CurrentVoltageCourseNav currentLessonId={9} />
            </div>

            {activeTab === "lesson" ? <CurrentVoltageLessonNineSeriesCircuitSimulation /> : null}
            {activeTab === "logic" ? <LogicTheorySection /> : null}
            {activeTab === "logic_bn" ? <LogicTheoryBanglaSection /> : null}
            {activeTab === "english" ? <UdemyScriptNoteEnglishTab /> : null}
            {activeTab === "bangla" ? <UdemyScriptNoteBanglaTab /> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
