"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import MosfetSimulatorSketch from "./MosfetSimulatorSketch";

export default function Lesson14MosfetBasicsEmbeddedPage() {
  const lessonPanel = <MosfetSimulatorSketch />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 8"
      currentLessonId={8}
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
