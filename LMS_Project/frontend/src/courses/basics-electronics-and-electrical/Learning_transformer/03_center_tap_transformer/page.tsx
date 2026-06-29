"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import CenterTapTransformerSketch from "./CenterTapTransformerSketch";

export default function Lesson03CenterTapTransformerEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 03"
      currentLessonId={3}
      track="transformer"
    >
      <CenterTapTransformerSketch />
    </UniversalSimulationLessonShell>
  );
}
