"use client";

import DiodeLessonTwelveSimulation from "./DiodeLessonTwelveSimulation";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonTwelveEmbeddedPage() {
  const lessonPanel = <DiodeLessonTwelveSimulation />;

  return (
    <DiodeLessonEmbeddedShell
      lessonId={12}
      lessonTitle="Photodiode"
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
