"use client";

import PlanningProjectWorkspace from "../../shared/planning/PlanningProjectWorkspace";

import { planningProject } from "./ProjectPlan";

export default function TransistorSwitchCircuitProjectWorkspace() {
  return <PlanningProjectWorkspace {...planningProject} />;
}
