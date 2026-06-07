"use client";

import WhatIsDiodeTypesInteractiveSimulation from "./05_diode_types/WhatIsDiodeTypesInteractiveSimulation";

export type { DiodeType } from "./05_diode_types/types";
export { runSimulationTests, getSelectedDiode, searchDiodes } from "./05_diode_types/logic";

export default function DiodeTypesSimulation() {
  return <WhatIsDiodeTypesInteractiveSimulation />;
}
