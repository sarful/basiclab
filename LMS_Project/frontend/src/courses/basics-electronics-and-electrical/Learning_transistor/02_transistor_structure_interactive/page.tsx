"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import TransistorLessonTwoSimulation from "./TransistorLessonTwoSimulation";

export default function TransistorLessonTwoEmbeddedPage() {
  const lessonPanel = <TransistorLessonTwoSimulation />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 02"
      currentLessonId={2}
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
