"use client";

import DiodeLessonFourSimulation from "./DiodeLessonFourSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function DiodeLessonFourEmbeddedPage() {
  const lessonPanel = <DiodeLessonFourSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={4}
      lessonTitle="Diode Characteristics"
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
