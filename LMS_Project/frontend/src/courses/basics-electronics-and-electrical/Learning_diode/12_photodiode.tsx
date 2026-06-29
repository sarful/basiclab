"use client";

import WhatIsPhotodiodeInteractiveSimulation from "./12_photodiode/WhatIsPhotodiodeInteractiveSimulation";

export type { PhotodiodeState } from "./12_photodiode/types";
export {
  clamp,
  getGraphPoints,
  getPhotodiodeState,
  luxToIrradiance,
  runSimulationTests,
} from "./12_photodiode/logic";

export default function PhotodiodeSimulation() {
  return <WhatIsPhotodiodeInteractiveSimulation />;
}
