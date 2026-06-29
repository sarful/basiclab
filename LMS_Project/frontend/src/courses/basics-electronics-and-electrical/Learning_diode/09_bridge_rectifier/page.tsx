"use client";

import DiodeLessonNineSimulation from "./DiodeLessonNineSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonNineEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={9} lessonTitle="Bridge Rectifier">
      <DiodeLessonNineSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
