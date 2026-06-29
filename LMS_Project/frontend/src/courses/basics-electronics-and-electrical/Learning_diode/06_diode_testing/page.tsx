"use client";

import DiodeLessonSixSimulation from "./DiodeLessonSixSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonSixEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={6} lessonTitle="Diode Testing">
      <DiodeLessonSixSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
