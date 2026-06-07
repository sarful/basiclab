"use client";

import { formatResistance, standardValues } from "./logic";
import type { FixedType, FixedTypeKey } from "./types";

export function ControlPanelSection({
  fixedTypes,
  selected,
  resistance,
  voltage,
  tolerance,
  powerRating,
  onTypeChange,
  onResistanceChange,
  onVoltageChange,
  onToleranceChange,
  onPowerRatingChange,
}: {
  fixedTypes: FixedType[];
  selected: FixedType;
  resistance: number;
  voltage: number;
  tolerance: number;
  powerRating: number;
  onTypeChange: (key: FixedTypeKey) => void;
  onResistanceChange: (value: number) => void;
  onVoltageChange: (value: number) => void;
  onToleranceChange: (value: number) => void;
  onPowerRatingChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <div className="mb-5 grid gap-2">
        {fixedTypes.map((item) => (
          <button
            key={item.key}
            onClick={() => onTypeChange(item.key)}
            className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${
              selected.key === item.key ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white"
            }`}
          >
            <p className="font-semibold text-slate-900">{item.bn}</p>
            <p className="text-xs text-slate-600">{item.description}</p>
          </button>
        ))}
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Resistance: {formatResistance(resistance)}</label>
        <select value={resistance} onChange={(event) => onResistanceChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {standardValues.map((value) => (
            <option key={value} value={value}>
              {formatResistance(value)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Voltage: {voltage}V</label>
        <input type="range" min="1" max="30" step="1" value={voltage} onChange={(event) => onVoltageChange(Number(event.target.value))} className="w-full accent-blue-500" />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Tolerance: ±{tolerance}%</label>
        <select value={tolerance} onChange={(event) => onToleranceChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {selected.toleranceOptions.map((value) => (
            <option key={value} value={value}>
              ±{value}%
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-700">Power Rating: {powerRating}W</label>
        <select value={powerRating} onChange={(event) => onPowerRatingChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {selected.powerOptions.map((value) => (
            <option key={value} value={value}>
              {value}W
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
