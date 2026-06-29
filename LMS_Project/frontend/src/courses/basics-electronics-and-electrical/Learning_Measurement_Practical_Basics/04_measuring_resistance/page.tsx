"use client";

import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";
import MeasurementPracticalLessonFourSimulation from "./MeasurementPracticalLessonFourSimulation";

export default function MeasurementPracticalLessonFourPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={4}
      lessonLabel="Lesson 04"
      lessonContent={{
        lesson: <MeasurementPracticalLessonFourSimulation />,
      }}
      lessonTitle="Measuring Resistance"
    />
  );
}
