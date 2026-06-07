"use client";

import { formatCurrent, formatResistance } from "./logic";
import type { SolveMode } from "./types";

export function ControlPanelSection({
  mode,
  voltage,
  currentInput,
  resistance,
  formula,
  ledBrightness,
  onVoltageChange,
  onCurrentInputChange,
  onResistanceChange,
}: {
  mode: SolveMode;
  voltage: number;
  currentInput: number;
  resistance: number;
  formula: string;
  ledBrightness: number;
  onVoltageChange: (value: number) => void;
  onCurrentInputChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl lg:col-span-1">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      {(mode === "current" || mode === "resistance") && (
        <div className="mb-5">
          <label className="mb-2 block text-sm text-slate-700">Voltage: {voltage}V</label>
          <input type="range" min="1" max="50" value={voltage} onChange={(event) => onVoltageChange(Number(event.target.value))} className="w-full accent-cyan-400" />
        </div>
      )}

      {(mode === "voltage" || mode === "resistance") && (
        <div className="mb-5">
          <label className="mb-2 block text-sm text-slate-700">Current: {formatCurrent(currentInput)}</label>
          <input type="range" min="0.005" max="0.2" step="0.005" value={currentInput} onChange={(event) => onCurrentInputChange(Number(event.target.value))} className="w-full accent-emerald-400" />
        </div>
      )}

      {(mode === "current" || mode === "voltage") && (
        <div className="mb-5">
          <label className="mb-2 block text-sm text-slate-700">Resistance: {formatResistance(resistance)}</label>
          <input type="range" min="10" max="1000" step="10" value={resistance} onChange={(event) => onResistanceChange(Number(event.target.value))} className="w-full accent-yellow-400" />
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Live Formula</p>
        <p className="mt-2 text-sm font-semibold text-blue-700">{formula}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">LED Load</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
          <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-lime-300" style={{ width: `${ledBrightness * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-600">Brightness follows current flow and the selected LED safe current.</p>
      </div>
    </div>
  );
}
