"use client";

import DiodeLessonSevenSimulation from "./DiodeLessonSevenSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonSevenEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={7} lessonTitle="Half-Wave Rectifier">
      <DiodeLessonSevenSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
