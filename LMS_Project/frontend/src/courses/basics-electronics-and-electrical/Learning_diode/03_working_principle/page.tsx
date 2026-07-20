"use client";

import DiodeLessonThreeSimulation from "./DiodeLessonThreeSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function DiodeLessonThreeEmbeddedPage() {
  const lessonPanel = <DiodeLessonThreeSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={3}
      lessonTitle="Working Principle"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        lesson: lessonPanel,
      }}
    >
      {lessonPanel}
    </DiodeLessonEmbeddedShell>
  );
}
