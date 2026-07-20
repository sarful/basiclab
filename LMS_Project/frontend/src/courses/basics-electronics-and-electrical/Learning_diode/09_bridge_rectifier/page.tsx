"use client";

import DiodeLessonNineSimulation from "./DiodeLessonNineSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function DiodeLessonNineEmbeddedPage() {
  const lessonPanel = <DiodeLessonNineSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={9}
      lessonTitle="Bridge Rectifier"
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
