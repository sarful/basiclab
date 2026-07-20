"use client";

import DiodeLessonOneSimulation from "./DiodeLessonOneSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function DiodeLessonOneEmbeddedPage() {
  const lessonPanel = <DiodeLessonOneSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={1}
      lessonTitle="What is Diode"
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
