"use client";

import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";
import MeasurementPracticalLessonFiveSimulation from "./MeasurementPracticalLessonFiveSimulation";

export default function MeasurementPracticalLessonFivePage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={5}
      lessonLabel="Lesson 05"
      lessonContent={{
        lesson: <MeasurementPracticalLessonFiveSimulation />,
      }}
      lessonTitle="Continuity Test"
    />
  );
}
