"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import TransistorDrivingRelayWorkspace from "./TransistorDrivingRelayWorkspace";

export default function Lesson7TransistorDrivingRelayEmbeddedPage() {
  const lessonPanel = <TransistorDrivingRelayWorkspace />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 7"
      currentLessonId={7}
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
