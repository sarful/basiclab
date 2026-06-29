"use client";

import DiodeLessonFourSimulation from "./DiodeLessonFourSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonFourEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={4} lessonTitle="Diode Characteristics">
      <DiodeLessonFourSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
