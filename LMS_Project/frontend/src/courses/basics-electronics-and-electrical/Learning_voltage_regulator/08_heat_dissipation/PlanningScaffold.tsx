"use client";

import PlanningLessonSection from "../../shared/planning/PlanningLessonSection";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { planningSimulation } from "./simulation";

export default function Lesson08HeatDissipationPlanningScaffold() {
  return (
    <PlanningLessonSection
      topicCode="8.8"
      title="Heat Dissipation"
      trackTitle="Lesson 8 Voltage Regulator Track"
      status="Missing"
      folderName="Learning_voltage_regulator/08_heat_dissipation"
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
