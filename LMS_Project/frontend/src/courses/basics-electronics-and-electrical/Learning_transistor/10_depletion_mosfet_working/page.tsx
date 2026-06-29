"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import DepletionMOSFETWorking from "./DepletionMOSFETWorking";

export default function Lesson18DepletionMosfetWorkingEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 10" currentLessonId={10} track="transistor">
      <DepletionMOSFETWorking />
    </UniversalSimulationLessonShell>
  );
}
