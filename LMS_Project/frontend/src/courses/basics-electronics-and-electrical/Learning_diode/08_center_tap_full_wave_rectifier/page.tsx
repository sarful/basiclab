"use client";

import DiodeLessonEightSimulation from "./DiodeLessonEightSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonEightEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell
      lessonId={8}
      lessonTitle="Center-Tap Full-Wave Rectifier"
    >
      <DiodeLessonEightSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
