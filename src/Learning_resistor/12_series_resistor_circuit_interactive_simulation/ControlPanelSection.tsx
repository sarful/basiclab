"use client";

import { formatResistance, resistorOptions } from "./logic";
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
        <button onClick={onResetCircuit} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
          Reset
        </button>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {supplyVoltage}V</label>
        <input type="range" min="1" max="30" step="1" value={supplyVoltage} onChange={(event) => onSupplyVoltageChange(Number(event.target.value))} className="w-full accent-blue-500" />
      </div>

      <div className="space-y-4">
        {resistors.map((resistor, index) => (
          <div key={resistor.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-sm font-semibold text-slate-800">
                R{index + 1}: {formatResistance(resistor.value)}
              </label>
              <button
                onClick={() => onRemoveResistor(resistor.id)}
                disabled={resistors.length <= 1}
                className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remove
              </button>
            </div>
            <select value={resistor.value} onChange={(event) => onUpdateResistor(resistor.id, Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
              {resistorOptions.map((value) => (
                <option key={value} value={value}>
                  {formatResistance(value)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

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
