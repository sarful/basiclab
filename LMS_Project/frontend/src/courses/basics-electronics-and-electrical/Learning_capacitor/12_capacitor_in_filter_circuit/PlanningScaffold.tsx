"use client";

import PlanningLessonSection from "../../shared/planning/PlanningLessonSection";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { planningSimulation } from "./simulation";

export default function Lesson12CapacitorInFilterCircuitPlanningScaffold() {
  return (
    <PlanningLessonSection
      topicCode="4.12"
      title="Capacitor in Filter Circuit"
      trackTitle="Lesson 4 Capacitor Track"
      status="Partial"
      folderName="Learning_capacitor/12_capacitor_in_filter_circuit"
      plannedFiles={["page.tsx", "PlanningScaffold.tsx", "simulation.ts", "LogicTheoryTab.tsx", "LogicTheoryBanglaTab.tsx", "UdemyScriptNoteEnglishTab.tsx", "UdemyScriptNoteBanglaTab.tsx"]}
      simulationLabel={planningSimulation.label}
      simulationNote={planningSimulation.note}
    >
      <LogicTheoryTab />
      <LogicTheoryBanglaTab />
      <UdemyScriptNoteEnglishTab />
      <UdemyScriptNoteBanglaTab />
    </PlanningLessonSection>
  );
}
