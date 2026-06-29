"use client";

import DiodeLessonOneSimulation from "./DiodeLessonOneSimulation";
import DiodeLessonEmbeddedShell from "../shared/DiodeLessonEmbeddedShell";

export default function DiodeLessonOneEmbeddedPage() {
  return (
    <DiodeLessonEmbeddedShell lessonId={1} lessonTitle="What is Diode">
      <DiodeLessonOneSimulation />
    </DiodeLessonEmbeddedShell>
  );
}
