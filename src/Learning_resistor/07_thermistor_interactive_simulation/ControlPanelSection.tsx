"use client";

import { formatResistance } from "./logic";
import type { ThermistorMode } from "./types";

export function ControlPanelSection({
  mode,
  temperature,
  nominalResistance,
  voltage,
  onModeChange,
  onTemperatureChange,
  onNominalResistanceChange,
  onVoltageChange,
}: {
  mode: ThermistorMode;
  temperature: number;
  nominalResistance: number;
  voltage: number;
  onModeChange: (mode: ThermistorMode) => void;
  onTemperatureChange: (value: number) => void;
  onNominalResistanceChange: (value: number) => void;
  onVoltageChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          onClick={() => onModeChange("ntc")}
          className={`rounded-2xl border p-3 text-left transition ${mode === "ntc" ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white"}`}
        >
          <p className="font-semibold text-slate-900">NTC Thermistor</p>
          <p className="text-xs text-slate-600">Temp ↑ → Resistance ↓</p>
        </button>
        <button
          onClick={() => onModeChange("ptc")}
          className={`rounded-2xl border p-3 text-left transition ${mode === "ptc" ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200" : "border-slate-200 bg-white"}`}
        >
          <p className="font-semibold text-slate-900">PTC Thermistor</p>
          <p className="text-xs text-slate-600">Temp ↑ → Resistance ↑</p>
        </button>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Temperature: {temperature}°C</label>
        <input type="range" min="0" max="120" step="1" value={temperature} onChange={(event) => onTemperatureChange(Number(event.target.value))} className="w-full accent-red-500" />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Nominal Resistance @25°C: {formatResistance(nominalResistance)}</label>
        <select value={nominalResistance} onChange={(event) => onNominalResistanceChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {[1000, 4700, 10000, 47000, 100000].map((value) => (
            <option key={value} value={value}>
              {formatResistance(value)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {voltage}V</label>
        <input type="range" min="1" max="24" step="1" value={voltage} onChange={(event) => onVoltageChange(Number(event.target.value))} className="w-full accent-blue-500" />
      </div>
    </div>
  );
}
