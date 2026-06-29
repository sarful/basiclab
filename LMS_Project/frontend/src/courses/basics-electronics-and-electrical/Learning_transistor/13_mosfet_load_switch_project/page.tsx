"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import MosfetLoadSwitchProjectWorkspace from "./ProjectWorkspace";

export default function Lesson13MosfetLoadSwitchProjectEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 13" currentLessonId={13} track="transistor">
      <MosfetLoadSwitchProjectWorkspace />
    </UniversalSimulationLessonShell>
  );
}
