"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import MosfetTypesSimulator from "./MosfetTypesSimulator";

export default function Lesson19MosfetTypesSimulatorEmbeddedPage() {
  const lessonPanel = <MosfetTypesSimulator />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 12"
      currentLessonId={12}
      track="transistor"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        lesson: lessonPanel,
      }}
      tabs={[
        { id: "logic", label: "Logic & Theory" },
        { id: "logic_bn", label: "Logic & Theory (Bangla)" },
        { id: "lesson", label: "Simulation" },
      ]}
    >
      {lessonPanel}
    </UniversalSimulationLessonShell>
  );
}
