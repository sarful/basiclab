"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import TransistorLessonOneSimulation from "./TransistorLessonOneSimulation";

export default function TransistorLessonOneEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 01">
      <TransistorLessonOneSimulation />
    </UniversalSimulationLessonShell>
  );
}
