"use client";

import PlanningLessonSection from "../../shared/planning/PlanningLessonSection";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { planningSimulation } from "./simulation";

export default function Lesson02PushbuttonBasicsPlanningScaffold() {
  return (
    <PlanningLessonSection
      topicCode="9.3"
      title="Pushbutton Basics"
      trackTitle="Lesson 9 Protection and Control Components"
      status="Partial"
      folderName="Learning_Pushbutton/02_pushbutton_basics"
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
