"use client";

import DiodeLessonSevenSimulation from "./DiodeLessonSevenSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function DiodeLessonSevenEmbeddedPage() {
  const lessonPanel = <DiodeLessonSevenSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={7}
      lessonTitle="Half-Wave Rectifier"
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
