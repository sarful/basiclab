"use client";

import PlanningLessonSection from "../../shared/planning/PlanningLessonSection";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { planningSimulation } from "./simulation";

export default function Lesson15JfetBasicsPlanningScaffold() {
  return (
    <PlanningLessonSection
      topicCode="6.15"
      title="JFET Basics"
      trackTitle="Lesson 6 Transistor Track"
      status="Missing"
      folderName="Learning_transistor/15_jfet_basics"
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
