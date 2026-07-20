"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import EnhancementMosfetWorkingScene from "./EnhancementMosfetWorkingScene";

export default function Lesson17EnhancementMosfetWorkingEmbeddedPage() {
  const lessonPanel = <EnhancementMosfetWorkingScene />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 9"
      currentLessonId={9}
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
