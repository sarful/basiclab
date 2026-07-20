"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import DepletionMOSFETWorking from "./DepletionMOSFETWorking";

export default function Lesson18DepletionMosfetWorkingEmbeddedPage() {
  const lessonPanel = <DepletionMOSFETWorking />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 10"
      currentLessonId={10}
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
