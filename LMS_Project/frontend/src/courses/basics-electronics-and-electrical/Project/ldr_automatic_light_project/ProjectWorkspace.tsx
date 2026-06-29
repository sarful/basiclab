"use client";

import PlanningProjectWorkspace from "../../shared/planning/PlanningProjectWorkspace";

import { planningProject } from "./ProjectPlan";

export default function LdrAutomaticLightProjectWorkspace() {
  return <PlanningProjectWorkspace {...planningProject} />;
}
