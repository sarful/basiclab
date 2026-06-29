"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import MosfetTypesSimulator from "./MosfetTypesSimulator";

export default function Lesson19MosfetTypesSimulatorEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 12" currentLessonId={12} track="transistor">
      <MosfetTypesSimulator />
    </UniversalSimulationLessonShell>
  );
}
