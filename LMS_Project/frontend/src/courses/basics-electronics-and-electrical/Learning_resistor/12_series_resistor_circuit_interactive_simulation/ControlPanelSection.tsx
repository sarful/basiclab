"use client";

import { ResistorEditorList } from "./ResistorEditorList";
import { SupplyVoltageSlider } from "./SupplyVoltageSlider";
import type { ResistorItem } from "./types";

export function ControlPanelSection({
  supplyVoltage,
  resistors,
  onSupplyVoltageChange,
  onUpdateResistor,
  onAddResistor,
  onRemoveResistor,
  onResetCircuit,
}: {
  supplyVoltage: number;
  resistors: ResistorItem[];
  onSupplyVoltageChange: (value: number) => void;
  onUpdateResistor: (id: number, value: number) => void;
  onAddResistor: () => void;
  onRemoveResistor: (id: number) => void;
  onResetCircuit: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Control Panel</h2>
        <button
          onClick={onResetCircuit}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <SupplyVoltageSlider
        supplyVoltage={supplyVoltage}
        onSupplyVoltageChange={onSupplyVoltageChange}
      />
      <ResistorEditorList
        resistors={resistors}
        onUpdateResistor={onUpdateResistor}
        onRemoveResistor={onRemoveResistor}
      />

      <button
        onClick={onAddResistor}
        disabled={resistors.length >= 5}
        className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Add Resistor
      </button>
    </div>
  );
}
