"use client";

import WhatIsDiodeConstructionInteractiveSimulation from "./02_diode_construction/WhatIsDiodeConstructionInteractiveSimulation";

export type { LayerView } from "./02_diode_construction/types";
export { runSimulationTests } from "./02_diode_construction/logic";

export default function DiodeConstructionSimulation() {
  return <WhatIsDiodeConstructionInteractiveSimulation />;
}
