"use client";

import DiodeLessonEightSimulation from "./DiodeLessonEightSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function DiodeLessonEightEmbeddedPage() {
  const lessonPanel = <DiodeLessonEightSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={8}
      lessonTitle="Center-Tap Full-Wave Rectifier"
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
