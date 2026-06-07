"use client";

import MeasurementPracticalLessonTwoSimulation from "./MeasurementPracticalLessonTwoSimulation";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

export default function MeasurementPracticalLessonTwoPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={2}
      lessonLabel="Lesson 02"
      lessonTitle="Measuring Voltage"
      lessonContent={{
        lesson: <MeasurementPracticalLessonTwoSimulation />,
      }}
    />
  );
}
