"use client";

import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";
import MeasurementPracticalLessonTenSimulation from "./MeasurementPracticalLessonTenSimulation";

export default function MeasurementPracticalLessonTenPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={8}
      lessonLabel="Lesson 08"
      lessonContent={{
        lesson: <MeasurementPracticalLessonTenSimulation />,
      }}
      lessonTitle="Basic Circuit Safety"
    />
  );
}
