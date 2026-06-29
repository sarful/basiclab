"use client";

import WhatIsCenterTapFullWaveRectifierInteractiveSimulation from "./08_center_tap_full_wave_rectifier/WhatIsCenterTapFullWaveRectifierInteractiveSimulation";

export type {
  ActiveDiode,
  DiodeProfile,
  DiodeType,
  WavePoint,
} from "./08_center_tap_full_wave_rectifier/types";
export {
  FIXED_FREQUENCY_HZ,
  clamp,
  diodeProfiles,
  getFullWaveState,
  runSimulationTests,
} from "./08_center_tap_full_wave_rectifier/logic";

export default function CenterTapFullWaveRectifierSimulation() {
  return <WhatIsCenterTapFullWaveRectifierInteractiveSimulation />;
}
