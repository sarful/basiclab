"use client";

import { formatResistance } from "./logic";
import type { Mode } from "./types";

export function ControlPanelSection({
  mode,
  supplyVoltage,
  totalResistance,
  wiperPercent,
  onModeChange,
  onSupplyVoltageChange,
  onTotalResistanceChange,
  onWiperPercentChange,
}: {
  mode: Mode;
  supplyVoltage: number;
  totalResistance: number;
  wiperPercent: number;
  onModeChange: (mode: Mode) => void;
  onSupplyVoltageChange: (value: number) => void;
  onTotalResistanceChange: (value: number) => void;
  onWiperPercentChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          onClick={() => onModeChange("voltageDivider")}
          className={`rounded-2xl border p-3 text-left transition ${mode === "voltageDivider" ? "border-purple-400 bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 bg-white"}`}
        >
          <p className="font-semibold text-slate-900">Voltage Divider</p>
          <p className="text-xs text-slate-600">3-pin output voltage control</p>
        </button>
        <button
          onClick={() => onModeChange("rheostat")}
          className={`rounded-2xl border p-3 text-left transition ${mode === "rheostat" ? "border-purple-400 bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 bg-white"}`}
        >
          <p className="font-semibold text-slate-900">Rheostat</p>
          <p className="text-xs text-slate-600">2-pin current control</p>
        </button>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {supplyVoltage}V</label>
        <input type="range" min="1" max="24" step="1" value={supplyVoltage} onChange={(event) => onSupplyVoltageChange(Number(event.target.value))} className="w-full accent-blue-500" />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Total Resistance: {formatResistance(totalResistance)}</label>
        <select value={totalResistance} onChange={(event) => onTotalResistanceChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {[1000, 2200, 4700, 10000, 22000, 47000, 100000].map((value) => (
            <option key={value} value={value}>
              {formatResistance(value)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-700">Wiper Position: {wiperPercent}%</label>
        <input type="range" min="1" max="99" step="1" value={wiperPercent} onChange={(event) => onWiperPercentChange(Number(event.target.value))} className="w-full accent-purple-500" />
      </div>
    </div>
  );
}
