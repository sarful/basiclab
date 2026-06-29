import { CapacitanceSlider } from "./CapacitanceSlider";
import { ModeSelector } from "./ModeSelector";
import { ResistanceSlider } from "./ResistanceSlider";
import { SupplyVoltageSlider } from "./SupplyVoltageSlider";
import { TimeSlider } from "./TimeSlider";
import type { WorkingMode } from "./types";
import { WorkingFormulaCard } from "./WorkingFormulaCard";

type ControlPanelSectionProps = {
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
  resistance: number;
  setResistance: (value: number) => void;
  capacitance: number;
  setCapacitance: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  maxTime: number;
  mode: WorkingMode;
  setMode: (value: WorkingMode) => void;
  timeConstant: number;
  resetSimulation: () => void;
};

export function ControlPanelSection({
  supplyVoltage,
  setSupplyVoltage,
  resistance,
  setResistance,
  capacitance,
  setCapacitance,
  time,
  setTime,
  maxTime,
  mode,
  setMode,
  timeConstant,
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

      <ModeSelector mode={mode} setMode={setMode} />
      <SupplyVoltageSlider supplyVoltage={supplyVoltage} setSupplyVoltage={setSupplyVoltage} />
      <ResistanceSlider resistance={resistance} setResistance={setResistance} />
      <CapacitanceSlider capacitance={capacitance} setCapacitance={setCapacitance} />
      <TimeSlider time={time} setTime={setTime} maxTime={maxTime} />
      <WorkingFormulaCard timeConstant={timeConstant} />
    </div>
  );
}
