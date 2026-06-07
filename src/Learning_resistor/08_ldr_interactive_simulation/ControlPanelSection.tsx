"use client";

import { formatResistance } from "./logic";

export function ControlPanelSection({
  lightPercent,
  darkResistance,
  fixedResistor,
  voltage,
  onLightPercentChange,
  onDarkResistanceChange,
  onFixedResistorChange,
  onVoltageChange,
}: {
  lightPercent: number;
  darkResistance: number;
  fixedResistor: number;
  voltage: number;
  onLightPercentChange: (value: number) => void;
  onDarkResistanceChange: (value: number) => void;
  onFixedResistorChange: (value: number) => void;
  onVoltageChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Light Intensity: {lightPercent}%</label>
        <input type="range" min="0" max="100" step="1" value={lightPercent} onChange={(event) => onLightPercentChange(Number(event.target.value))} className="w-full accent-yellow-500" />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Dark Resistance: {formatResistance(darkResistance)}</label>
        <select value={darkResistance} onChange={(event) => onDarkResistanceChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {[50000, 100000, 250000, 500000, 1000000].map((value) => (
            <option key={value} value={value}>
              {formatResistance(value)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Fixed Resistor: {formatResistance(fixedResistor)}</label>
        <select value={fixedResistor} onChange={(event) => onFixedResistorChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {[1000, 4700, 10000, 22000, 47000, 100000].map((value) => (
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
