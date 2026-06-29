"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import OptocouplerLessonOneSimulation from "./OptocouplerLessonOneSimulation";

export default function OptocouplerLessonOneEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 01">
      <OptocouplerLessonOneSimulation />
    </UniversalSimulationLessonShell>
  );
}
