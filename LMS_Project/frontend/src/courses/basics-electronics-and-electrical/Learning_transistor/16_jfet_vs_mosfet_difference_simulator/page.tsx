"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import JfetVsMosfetDifferenceSimulator from "./JfetVsMosfetDifferenceSimulator";

export default function Lesson16JfetVsMosfetDifferenceEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 16" currentLessonId={16} track="transistor">
      <JfetVsMosfetDifferenceSimulator />
    </UniversalSimulationLessonShell>
  );
}
