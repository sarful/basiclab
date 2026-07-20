"use client";

import DiodeLessonFiveSimulation from "./DiodeLessonFiveSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function DiodeLessonFiveEmbeddedPage() {
  const lessonPanel = <DiodeLessonFiveSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={5}
      lessonTitle="Diode Types"
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
