"use client";

import WhatIsHalfWaveRectifierInteractiveSimulation from "./07_half_wave_rectifier/WhatIsHalfWaveRectifierInteractiveSimulation";

export type {
  DiodeProfile,
  DiodeType,
  StressLevel,
  WavePoint,
} from "./07_half_wave_rectifier/types";
export {
  FIXED_FREQUENCY_HZ,
  clamp,
  diodeProfiles,
  getHalfWaveState,
  runSimulationTests,
} from "./07_half_wave_rectifier/logic";

export default function HalfWaveRectifierSimulation() {
  return <WhatIsHalfWaveRectifierInteractiveSimulation />;
}
