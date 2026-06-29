"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import TransformerLessonOneSimulation from "./TransformerLessonOneSimulation";

export default function TransformerLessonOneEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 01">
      <TransformerLessonOneSimulation />
    </UniversalSimulationLessonShell>
  );
}
