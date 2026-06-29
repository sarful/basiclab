"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import RelayLessonTwoSimulation from "./RelayLessonTwoSimulation";

export default function RelayLessonTwoEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 02">
      <RelayLessonTwoSimulation />
    </UniversalSimulationLessonShell>
  );
}
