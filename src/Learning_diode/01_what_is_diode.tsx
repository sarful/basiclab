"use client";

import WhatIsDiodeInteractiveSimulation from "./01_what_is_diode/WhatIsDiodeInteractiveSimulation";

export type { BiasMode } from "./01_what_is_diode/types";
export { getBiasResult, getLedState, runSimulationTests } from "./01_what_is_diode/logic";

export default function WhatIsDiodeSimulation() {
  return <WhatIsDiodeInteractiveSimulation />;
}
