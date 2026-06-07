"use client";

import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";
import MeasurementPracticalLessonSevenSimulation from "./MeasurementPracticalLessonSevenSimulation";

export default function MeasurementPracticalLessonSevenPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={7}
      lessonLabel="Lesson 07"
      lessonContent={{
        lesson: <MeasurementPracticalLessonSevenSimulation />,
      }}
      lessonTitle="Battery Basics"
    />
  );
}
