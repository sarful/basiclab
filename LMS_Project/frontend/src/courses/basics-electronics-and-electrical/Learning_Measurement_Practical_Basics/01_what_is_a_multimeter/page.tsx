"use client";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import MeasurementPracticalLessonOneSimulation from "./MeasurementPracticalLessonOneSimulation";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { MeasurementPracticalCourseNav } from "../shared/measurement_practical_course_nav";
import {
  LessonShellHeader,
  type LessonShellTab,
  useAuthorizedLessonTabs,
} from "../../Learning_Current_Voltage/shared/lesson_shell";

type LessonTab = "lesson" | "logic" | "logic_bn" | "english" | "bangla";

export default function MeasurementPracticalLessonOnePage() {
  const tabs: LessonShellTab<LessonTab>[] = [
    { id: "logic", label: "Logic & Theory" },
    { id: "logic_bn", label: "Logic & Theory (Bangla)" },
    { id: "english", label: "Udemy English Script" },
    { id: "bangla", label: "Udemy Script Bangla" },
    { id: "lesson", label: "Simulation" },
  ];

  const { activeTab, setActiveTab, tabs: visibleTabs } =
    useAuthorizedLessonTabs<LessonTab>(tabs, "lesson");

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
            tabs={visibleTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div style={{ padding: "28px 22px 22px", background: "#f8fafc" }}>
            <div style={{ marginBottom: 22 }}>
              <MeasurementPracticalCourseNav currentLessonId={1} />
            </div>
            {activeTab === "lesson" ? <MeasurementPracticalLessonOneSimulation /> : null}
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
