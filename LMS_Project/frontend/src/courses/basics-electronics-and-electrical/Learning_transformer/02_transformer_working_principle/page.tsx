"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import TransformerWorkingPrincipleSketch from "./TransformerWorkingPrincipleSketch";

export default function Lesson02TransformerWorkingPrincipleEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 02"
      currentLessonId={2}
      track="transformer"
    >
      <TransformerWorkingPrincipleSketch />
    </UniversalSimulationLessonShell>
  );
}
