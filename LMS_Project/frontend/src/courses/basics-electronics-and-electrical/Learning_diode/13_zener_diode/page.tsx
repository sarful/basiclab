"use client";

import DiodeLessonThirteenSimulation from "./DiodeLessonThirteenSimulation";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonThirteenEmbeddedPage() {
  const lessonPanel = <DiodeLessonThirteenSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={13}
      lessonTitle="Zener Diode"
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
