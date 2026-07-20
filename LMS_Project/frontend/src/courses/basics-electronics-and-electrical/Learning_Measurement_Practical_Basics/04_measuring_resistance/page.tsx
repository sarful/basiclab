"use client";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import MeasuringResistanceSketch from "./MeasuringResistanceSketch";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

export default function MeasurementPracticalLessonFourPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={4}
      lessonLabel="Lesson 04"
      lessonTitle="Measuring Resistance"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        english: <UdemyScriptNoteEnglishTab />,
        bangla: <UdemyScriptNoteBanglaTab />,
        lesson: <MeasuringResistanceSketch />,
      }}
    />
  );
}
