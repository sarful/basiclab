"use client";

import MeasuringVoltageSketch from "./DC";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

export default function MeasurementPracticalLessonTwoPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={2}
      lessonLabel="Lesson 02"
      lessonTitle="Measuring Voltage"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        english: <UdemyScriptNoteEnglishTab />,
        bangla: <UdemyScriptNoteBanglaTab />,
        lesson: <MeasuringVoltageSketch />,
      }}
    />
  );
}
