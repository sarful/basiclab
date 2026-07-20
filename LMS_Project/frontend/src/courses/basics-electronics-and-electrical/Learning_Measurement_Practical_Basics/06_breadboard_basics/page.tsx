"use client";

import BreadboardInteractiveSimulator from "./BreadboardInteractiveSimulator1";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

export default function MeasurementPracticalLessonEightPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={6}
      lessonLabel="Lesson 06"
      lessonTitle="Breadboard Basics"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        english: <UdemyScriptNoteEnglishTab />,
        bangla: <UdemyScriptNoteBanglaTab />,
        lesson: <BreadboardInteractiveSimulator />,
      }}
    />
  );
}
