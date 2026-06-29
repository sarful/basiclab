"use client";

import DiodeLessonTenSimulation from "./DiodeLessonTenSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonTenEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={10} lessonTitle="Filter Circuit">
      <DiodeLessonTenSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
