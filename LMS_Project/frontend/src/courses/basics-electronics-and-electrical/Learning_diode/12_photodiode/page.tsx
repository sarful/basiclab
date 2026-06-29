"use client";

import DiodeLessonTwelveSimulation from "./DiodeLessonTwelveSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonTwelveEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={12} lessonTitle="Photodiode">
      <DiodeLessonTwelveSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
