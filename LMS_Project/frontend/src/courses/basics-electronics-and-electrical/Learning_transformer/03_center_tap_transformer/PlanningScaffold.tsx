"use client";

import PlanningLessonSection from "../../shared/planning/PlanningLessonSection";

import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import { planningSimulation } from "./simulation";

export default function Lesson03CenterTapTransformerPlanningScaffold() {
  return (
    <PlanningLessonSection
      topicCode="7.3"
      title="Center-Tap Transformer"
      trackTitle="Lesson 3 Transformer Track"
      status="Missing"
      folderName="Learning_transformer/03_center_tap_transformer"
      plannedFiles={[
        "page.tsx",
        "PlanningScaffold.tsx",
        "simulation.ts",
        "LogicTheoryTab.tsx",
        "LogicTheoryBanglaTab.tsx",
        "UdemyScriptNoteEnglishTab.tsx",
        "UdemyScriptNoteBanglaTab.tsx",
      ]}
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
