"use client";

import MeasurementPracticalLessonThreeSimulation from "./MeasurementPracticalLessonThreeSimulation";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

export default function MeasurementPracticalLessonThreePage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={3}
      lessonLabel="Lesson 03"
      lessonTitle="Measuring Current"
      lessonContent={{
        lesson: <MeasurementPracticalLessonThreeSimulation />,
      }}
    />
  );
}
