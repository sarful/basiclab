"use client";

import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";
import MeasurementPracticalLessonSixSimulation from "./MeasurementPracticalLessonSixSimulation";

export default function MeasurementPracticalLessonSixPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={6}
      lessonLabel="Lesson 06"
      lessonContent={{
        lesson: <MeasurementPracticalLessonSixSimulation />,
      }}
      lessonTitle="Polarity and Ground"
    />
  );
}
