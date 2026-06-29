"use client";

import WhatIsFilterCircuitInteractiveSimulation from "./10_filter_circuit/WhatIsFilterCircuitInteractiveSimulation";

export type {
  ActiveDiode,
  DiodeProfile,
  DiodeType,
  WavePoint,
} from "./10_filter_circuit/types";
export {
  FIXED_FREQUENCY_HZ,
  clamp,
  diodeProfiles,
  getFilterCircuitState,
  runSimulationTests,
} from "./10_filter_circuit/logic";

export default function FilterCircuitSimulation() {
  return <WhatIsFilterCircuitInteractiveSimulation />;
}
