"use client";

import CurrentVoltageLessonOneSimulation from "./CurrentVoltageLessonOneSimulation";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { CurrentVoltageCourseNav } from "../shared/current_voltage_course_nav";
import {
  LessonShellHeader,
  useAuthorizedLessonTabs,
  type LessonShellTab,
} from "../shared/lesson_shell";

type LessonTab = "lesson" | "logic" | "logic_bn" | "english" | "bangla";

export default function CurrentVoltageLessonOneEmbeddedPage() {
  const { activeTab, setActiveTab, tabs } = useAuthorizedLessonTabs<LessonTab>(
    [
    { id: "logic", label: "Logic & Theory" },
    { id: "logic_bn", label: "Logic & Theory (Bangla)" },
    { id: "english", label: "Udemy English Script" },
    { id: "bangla", label: "Udemy Script Bangla" },
    { id: "lesson", label: "Simulation" },
    ] satisfies LessonShellTab<LessonTab>[],
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
            lessonLabel="Lesson 01"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div style={{ padding: "28px 22px 22px", background: "#f8fafc" }}>
            <div style={{ marginBottom: 22 }}>
              <CurrentVoltageCourseNav currentLessonId={1} />
            </div>
            {activeTab === "lesson" ? <CurrentVoltageLessonOneSimulation /> : null}
            {activeTab === "logic" ? <LogicTheoryTab /> : null}
            {activeTab === "logic_bn" ? <LogicTheoryBanglaTab /> : null}
            {activeTab === "english" ? <UdemyScriptNoteEnglishTab /> : null}
            {activeTab === "bangla" ? <UdemyScriptNoteBanglaTab /> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
