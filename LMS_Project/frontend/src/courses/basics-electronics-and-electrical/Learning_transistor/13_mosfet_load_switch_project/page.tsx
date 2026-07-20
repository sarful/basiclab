"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import MosfetLoadSwitchProjectWorkspace from "./ProjectWorkspace";

export default function Lesson13MosfetLoadSwitchProjectEmbeddedPage() {
  const lessonPanel = <MosfetLoadSwitchProjectWorkspace />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 13"
      currentLessonId={13}
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
