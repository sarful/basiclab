"use client";

import DiodeLessonElevenSimulation from "./DiodeLessonElevenSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonElevenEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={11} lessonTitle="LED">
      <DiodeLessonElevenSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
