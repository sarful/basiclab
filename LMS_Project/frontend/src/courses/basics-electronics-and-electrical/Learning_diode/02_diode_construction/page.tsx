"use client";

import DiodeLessonTwoSimulation from "./DiodeLessonTwoSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonTwoEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={2} lessonTitle="Diode Construction">
      <DiodeLessonTwoSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
