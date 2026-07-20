"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import JfetVsMosfetDifferenceSimulator from "./JfetVsMosfetDifferenceSimulator";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function Lesson16JfetVsMosfetDifferenceEmbeddedPage() {
  const lessonPanel = <JfetVsMosfetDifferenceSimulator />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 16"
      currentLessonId={16}
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
