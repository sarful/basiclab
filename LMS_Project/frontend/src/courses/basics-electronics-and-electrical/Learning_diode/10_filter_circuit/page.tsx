"use client";

import DiodeLessonTenSimulation from "./DiodeLessonTenSimulation";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonTenEmbeddedPage() {
  const lessonPanel = <DiodeLessonTenSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={10}
      lessonTitle="Filter Circuit"
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
