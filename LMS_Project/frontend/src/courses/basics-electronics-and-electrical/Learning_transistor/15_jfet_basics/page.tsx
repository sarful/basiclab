"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import JfetConstructionSimulator from "./JfetConstructionSimulator";

export default function Lesson15JfetBasicsEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 15" currentLessonId={15} track="transistor">
      <JfetConstructionSimulator />
    </UniversalSimulationLessonShell>
  );
}
