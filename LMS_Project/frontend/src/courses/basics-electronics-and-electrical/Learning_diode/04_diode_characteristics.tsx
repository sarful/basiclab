"use client";

import WhatIsDiodeCharacteristicsInteractiveSimulation from "./04_diode_characteristics/WhatIsDiodeCharacteristicsInteractiveSimulation";

export type { BiasMode, Section } from "./04_diode_characteristics/types";
export {
  clamp,
  getCharacteristicPoint,
  getWorkingState,
  runSimulationTests,
} from "./04_diode_characteristics/logic";

export default function DiodeCharacteristicsSimulation() {
  return <WhatIsDiodeCharacteristicsInteractiveSimulation />;
}
