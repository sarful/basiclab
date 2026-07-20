"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import TransistorLessonThreeSimulation from "./TransistorLessonThreeSimulation";

export default function TransistorLessonThreeEmbeddedPage() {
  const lessonPanel = <TransistorLessonThreeSimulation />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 03"
      currentLessonId={3}
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
