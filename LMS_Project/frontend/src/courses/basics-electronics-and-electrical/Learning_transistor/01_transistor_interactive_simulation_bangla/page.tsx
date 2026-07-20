"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import TransistorLessonOneSimulation from "./TransistorLessonOneSimulation";

export default function TransistorLessonOneEmbeddedPage() {
  const lessonPanel = <TransistorLessonOneSimulation />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 01"
      currentLessonId={1}
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
