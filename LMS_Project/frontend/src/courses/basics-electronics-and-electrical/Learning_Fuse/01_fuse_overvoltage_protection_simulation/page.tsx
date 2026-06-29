"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import FuseLessonOneSimulation from "./FuseLessonOneSimulation";

export default function FuseLessonOneEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 01">
      <FuseLessonOneSimulation />
    </UniversalSimulationLessonShell>
  );
}
