"use client";

import { CapacitanceSelector } from "./CapacitanceSelector";
import { ChargeFormulaCard } from "./ChargeFormulaCard";
import { ModeSelector } from "./ModeSelector";
import { ResistanceSelector } from "./ResistanceSelector";
import { SupplyVoltageSlider } from "./SupplyVoltageSlider";
import { TimeSlider } from "./TimeSlider";
import type { CircuitMode } from "./types";

type ControlPanelSectionProps = {
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
  capacitance: number;
  setCapacitance: (value: number) => void;
  resistance: number;
  setResistance: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  maxTime: number;
  mode: CircuitMode;
  setMode: (value: CircuitMode) => void;
  storedCharge: number;
  resetCircuit: () => void;
};

export function ControlPanelSection({
  supplyVoltage,
  setSupplyVoltage,
  capacitance,
  setCapacitance,
  resistance,
  setResistance,
  time,
  setTime,
  maxTime,
  mode,
  setMode,
  storedCharge,
  resetCircuit,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={resetCircuit}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <ModeSelector mode={mode} setMode={setMode} />
      <SupplyVoltageSlider
        supplyVoltage={supplyVoltage}
        setSupplyVoltage={setSupplyVoltage}
      />
      <CapacitanceSelector
        capacitance={capacitance}
        setCapacitance={setCapacitance}
      />
      <ResistanceSelector resistance={resistance} setResistance={setResistance} />
      <TimeSlider time={time} setTime={setTime} maxTime={maxTime} />
      <ChargeFormulaCard storedCharge={storedCharge} />
    </div>
  );
}
