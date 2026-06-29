"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import PushbuttonLessonOneSimulation from "./PushbuttonLessonOneSimulation";

export default function PushbuttonLessonOneEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 01">
      <PushbuttonLessonOneSimulation />
    </UniversalSimulationLessonShell>
  );
}
