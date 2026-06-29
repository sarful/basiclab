"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";

import MosfetSimulatorSketch from "./MosfetSimulatorSketch";

export default function Lesson14MosfetBasicsEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 8" currentLessonId={8} track="transistor">
      <MosfetSimulatorSketch />
    </UniversalSimulationLessonShell>
  );
}
