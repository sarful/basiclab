"use client";

import AmmeterCircuitSketch from "./AmmeterCircuitSketch";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

export default function MeasurementPracticalLessonThreePage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={3}
      lessonLabel="Lesson 03"
      lessonTitle="Measuring Current"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        english: <UdemyScriptNoteEnglishTab />,
        bangla: <UdemyScriptNoteBanglaTab />,
        lesson: <AmmeterCircuitSketch />,
      }}
    />
  );
}
