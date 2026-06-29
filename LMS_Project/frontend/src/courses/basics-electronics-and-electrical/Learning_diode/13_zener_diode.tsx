"use client";

import WhatIsZenerDiodeInteractiveSimulation from "./13_zener_diode/WhatIsZenerDiodeInteractiveSimulation";

export type { BiasMode } from "./13_zener_diode/types";
export { clamp, getZenerState, runSimulationTests } from "./13_zener_diode/logic";

export default function ZenerDiodeSimulation() {
  return <WhatIsZenerDiodeInteractiveSimulation />;
}
