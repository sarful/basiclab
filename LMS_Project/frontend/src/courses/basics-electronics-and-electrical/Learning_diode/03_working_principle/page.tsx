"use client";

import DiodeLessonThreeSimulation from "./DiodeLessonThreeSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonThreeEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={3} lessonTitle="Working Principle">
      <DiodeLessonThreeSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
