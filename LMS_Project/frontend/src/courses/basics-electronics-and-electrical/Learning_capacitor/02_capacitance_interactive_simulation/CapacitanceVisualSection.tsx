"use client";

import { CapacitanceVisual } from "./CapacitanceVisual";
import { ControlPanelSection } from "./ControlPanelSection";

export function CapacitanceVisualSection({
  voltage,
  setVoltage,
  plateArea,
  setPlateArea,
  plateDistance,
  setPlateDistance,
  dielectricIndex,
  setDielectricIndex,
  capacitance,
  resetSimulation,
}: {
  voltage: number;
  setVoltage: (value: number) => void;
  plateArea: number;
  setPlateArea: (value: number) => void;
  plateDistance: number;
  setPlateDistance: (value: number) => void;
  dielectricIndex: number;
  setDielectricIndex: (value: number) => void;
  capacitance: number;
  resetSimulation: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        voltage={voltage}
        setVoltage={setVoltage}
        plateArea={plateArea}
        setPlateArea={setPlateArea}
        plateDistance={plateDistance}
        setPlateDistance={setPlateDistance}
        dielectricIndex={dielectricIndex}
        setDielectricIndex={setDielectricIndex}
        capacitance={capacitance}
        resetSimulation={resetSimulation}
      />

      <div className="lg:col-span-2">
        <CapacitanceVisual
          plateArea={plateArea}
          plateDistance={plateDistance}
          dielectricIndex={dielectricIndex}
          voltage={voltage}
        />
      </div>
    </div>
  );
}
