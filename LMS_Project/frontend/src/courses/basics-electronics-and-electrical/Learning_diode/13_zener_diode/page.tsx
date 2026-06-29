"use client";

import DiodeLessonThirteenSimulation from "./DiodeLessonThirteenSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonThirteenEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={13} lessonTitle="Zener Diode">
      <DiodeLessonThirteenSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
