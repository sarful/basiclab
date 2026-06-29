"use client";

import DiodeLessonFiveSimulation from "./DiodeLessonFiveSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonFiveEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={5} lessonTitle="Diode Types">
      <DiodeLessonFiveSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
