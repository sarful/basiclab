"use client";

import WhatIsBridgeRectifierInteractiveSimulation from "./09_bridge_rectifier/WhatIsBridgeRectifierInteractiveSimulation";

export type {
  ActiveDiode,
  DiodeProfile,
  DiodeType,
  WavePoint,
} from "./09_bridge_rectifier/types";
export {
  FIXED_FREQUENCY_HZ,
  clamp,
  diodeProfiles,
  getBridgeRectifierState,
  runSimulationTests,
} from "./09_bridge_rectifier/logic";

export default function BridgeRectifierSimulation() {
  return <WhatIsBridgeRectifierInteractiveSimulation />;
}
