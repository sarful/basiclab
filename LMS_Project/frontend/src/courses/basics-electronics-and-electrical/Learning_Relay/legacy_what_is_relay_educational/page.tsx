"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import RelayLessonOneSimulation from "./RelayLessonOneSimulation";

export default function RelayLessonOneEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 01">
      <RelayLessonOneSimulation />
    </UniversalSimulationLessonShell>
  );
}
