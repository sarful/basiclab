"use client";

import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

import LogicTheoryTab from "./LogicTheoryTab";
import Lesson15ClamperCircuitPlanningScaffold from "./PlanningScaffold";

export default function Lesson15ClamperCircuitEmbeddedPage() {
  const lessonPanel = <Lesson15ClamperCircuitPlanningScaffold />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={15}
      lessonTitle="Clamper Circuit"
      lessonContent={{
        logic: <LogicTheoryTab />,
        lesson: lessonPanel,
      }}
    >
      {lessonPanel}
    </DiodeLessonEmbeddedShell>
  );
}
