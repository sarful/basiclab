"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import MosfetPChannelSwitchCircuitWorkspace from "./MosfetPChannelSwitchCircuitWorkspace";

export default function Lesson14MosfetPChannelSwitchCircuitEmbeddedPage() {
  const lessonPanel = <MosfetPChannelSwitchCircuitWorkspace />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 14"
      currentLessonId={14}
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
