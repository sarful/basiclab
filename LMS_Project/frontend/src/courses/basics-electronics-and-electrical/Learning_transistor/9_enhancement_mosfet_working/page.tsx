"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import EnhancementMosfetWorkingScene from "./EnhancementMosfetWorkingScene";

export default function Lesson17EnhancementMosfetWorkingEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 9" currentLessonId={9} track="transistor">
      <EnhancementMosfetWorkingScene />
    </UniversalSimulationLessonShell>
  );
}
