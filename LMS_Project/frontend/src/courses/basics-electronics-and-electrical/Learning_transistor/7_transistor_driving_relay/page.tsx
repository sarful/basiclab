"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import TransistorDrivingRelayWorkspace from "./TransistorDrivingRelayWorkspace";

export default function Lesson7TransistorDrivingRelayEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 7" currentLessonId={7} track="transistor">
      <TransistorDrivingRelayWorkspace />
    </UniversalSimulationLessonShell>
  );
}
