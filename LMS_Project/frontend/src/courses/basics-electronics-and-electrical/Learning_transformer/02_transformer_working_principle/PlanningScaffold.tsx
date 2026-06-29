"use client";

import PlanningLessonSection from "../../shared/planning/PlanningLessonSection";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { planningSimulation } from "./simulation";

export default function Lesson02TransformerWorkingPrinciplePlanningScaffold() {
  return (
    <PlanningLessonSection
      topicCode="7.2"
      title="Transformer Working Principle"
      trackTitle="Lesson 7 Transformer Track"
      status="Partial"
      folderName="Learning_transformer/02_transformer_working_principle"
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
