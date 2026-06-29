"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import MosfetPChannelSwitchCircuitWorkspace from "./MosfetPChannelSwitchCircuitWorkspace";

export default function Lesson14MosfetPChannelSwitchCircuitEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 14" currentLessonId={14} track="transistor">
      <MosfetPChannelSwitchCircuitWorkspace />
    </UniversalSimulationLessonShell>
  );
}
