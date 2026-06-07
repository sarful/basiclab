"use client";

import WhatIsDiodeWorkingPrincipleInteractiveSimulation from "./03_working_principle/WhatIsDiodeWorkingPrincipleInteractiveSimulation";

export type { BiasMode, Section } from "./03_working_principle/types";
export { getWorkingState, runSimulationTests } from "./03_working_principle/logic";

export default function WorkingPrincipleSimulation() {
  return <WhatIsDiodeWorkingPrincipleInteractiveSimulation />;
}
