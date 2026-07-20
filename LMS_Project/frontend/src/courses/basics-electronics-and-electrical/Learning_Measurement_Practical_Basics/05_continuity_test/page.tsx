"use client";

import ContinuityMeterSketch from "./ContinuityMeterSketch";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

export default function MeasurementPracticalLessonFivePage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={5}
      lessonLabel="Lesson 05"
      lessonTitle="Continuity Test"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        english: <UdemyScriptNoteEnglishTab />,
        bangla: <UdemyScriptNoteBanglaTab />,
        lesson: <ContinuityMeterSketch />,
      }}
    />
  );
}
