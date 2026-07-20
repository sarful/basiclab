"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import JfetConstructionSimulator from "./JfetConstructionSimulator";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function Lesson15JfetBasicsEmbeddedPage() {
  const lessonPanel = <JfetConstructionSimulator />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 15"
      currentLessonId={15}
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
