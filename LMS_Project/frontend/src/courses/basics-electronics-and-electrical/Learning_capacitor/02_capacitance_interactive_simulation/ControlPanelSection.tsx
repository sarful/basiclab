"use client";

import { CapacitanceFormulaCard } from "./CapacitanceFormulaCard";
import { DielectricSelector } from "./DielectricSelector";
import { PlateAreaSlider } from "./PlateAreaSlider";
import { PlateDistanceSlider } from "./PlateDistanceSlider";
import { VoltageSlider } from "./VoltageSlider";

type ControlPanelSectionProps = {
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
};

export function ControlPanelSection({
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
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetSimulation}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <VoltageSlider voltage={voltage} setVoltage={setVoltage} />
      <PlateAreaSlider plateArea={plateArea} setPlateArea={setPlateArea} />
      <PlateDistanceSlider
        plateDistance={plateDistance}
        setPlateDistance={setPlateDistance}
      />
      <DielectricSelector
        dielectricIndex={dielectricIndex}
        setDielectricIndex={setDielectricIndex}
      />
      <CapacitanceFormulaCard capacitance={capacitance} />
    </div>
  );
}
