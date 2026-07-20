"use client";

import AcVoltageSocketSketch from "./AcVoltageSocketSketch";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

export default function AcVoltageSocketPage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={9}
      lessonLabel="Lesson 09"
      lessonTitle="AC Voltage Socket"
      lessonContent={{
        lesson: <AcVoltageSocketSketch />,
      }}
    />
  );
}
