"use client";

import WhatIsDiodeTestingInteractiveSimulation from "./06_diode_testing/WhatIsDiodeTestingInteractiveSimulation";

export type {
  DiodeType,
  DisplayMode,
  MeterMode,
  ReadingInput,
  Terminal,
} from "./06_diode_testing/types";
export {
  calculateNeedleRotation,
  calculateReading,
  meterOptions,
  runReadingTests,
} from "./06_diode_testing/logic";

export default function DiodeTestingSimulation() {
  return <WhatIsDiodeTestingInteractiveSimulation />;
}
