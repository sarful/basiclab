"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import VoltageRegulatorLessonOneSimulation from "./VoltageRegulatorLessonOneSimulation";

export default function VoltageRegulatorLessonOneEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 01">
      <VoltageRegulatorLessonOneSimulation />
    </UniversalSimulationLessonShell>
  );
}
