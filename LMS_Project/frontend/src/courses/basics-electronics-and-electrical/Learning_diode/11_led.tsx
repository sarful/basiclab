"use client";

import WhatIsLedInteractiveSimulation from "./11_led/WhatIsLedInteractiveSimulation";

export type { LedState } from "./11_led/types";
export { clamp, getLedState, runSimulationTests } from "./11_led/logic";

export default function LedSimulation() {
  return <WhatIsLedInteractiveSimulation />;
}
