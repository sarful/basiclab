"use client";

import { useState } from "react";

import CurrentVoltageLessonTwoSimulation from "./CurrentVoltageLessonTwoSimulation";
import { LogicTheoryBanglaSection } from "./LogicTheoryBanglaSection";
import { LogicTheorySection } from "./LogicTheorySection";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { CurrentVoltageCourseNav } from "../shared/current_voltage_course_nav";
import {
  LessonShellHeader,
  type LessonShellTab,
} from "../shared/lesson_shell";

type LessonTwoTab =
  | "logic"
  | "logic_bn"
  | "english"
  | "bangla"
  | "lesson";

export default function CurrentVoltageLessonTwoEmbeddedPage() {
  const [activeTab, setActiveTab] = useState<LessonTwoTab>("lesson");
  const tabs: LessonShellTab<LessonTwoTab>[] = [
    { id: "logic", label: "Logic & Theory" },
    { id: "logic_bn", label: "Logic & Theory (Bangla)" },
    { id: "english", label: "Udemy English Script" },
    { id: "bangla", label: "Udemy Script Bangla" },
    { id: "lesson", label: "Simulation" },
  ];

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
            lessonLabel="Lesson 02"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div style={{ padding: "28px 22px 22px", background: "#f8fafc" }}>
            <div style={{ marginBottom: 22 }}>
              <CurrentVoltageCourseNav currentLessonId={2} />
            </div>
            {activeTab === "lesson" ? <CurrentVoltageLessonTwoSimulation /> : null}
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
