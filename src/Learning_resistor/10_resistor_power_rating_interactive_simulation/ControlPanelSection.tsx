"use client";

import { formatResistance, packages, resistorValues } from "./logic";

export function ControlPanelSection({
  voltage,
  resistance,
  rating,
  selectedPackageLabel,
  statusMessage,
  recommendedLabel,
  onVoltageChange,
  onResistanceChange,
  onRatingChange,
}: {
  voltage: number;
  resistance: number;
  rating: number;
  selectedPackageLabel: string;
  statusMessage: string;
  recommendedLabel: string;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
  onRatingChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {voltage}V</label>
        <input type="range" min="1" max="30" step="1" value={voltage} onChange={(event) => onVoltageChange(Number(event.target.value))} className="w-full accent-orange-500" />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Resistance: {formatResistance(resistance)}</label>
        <select value={resistance} onChange={(event) => onResistanceChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {resistorValues.map((value) => (
            <option key={value} value={value}>
              {formatResistance(value)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Selected Power Rating: {selectedPackageLabel}</label>
        <select value={rating} onChange={(event) => onRatingChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
          {packages.map((item) => (
            <option key={item.watt} value={item.watt}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border bg-white p-4 text-sm">
        <p className="font-bold text-slate-800">{statusMessage}</p>
        <p className="mt-2 text-slate-700">
          Recommended: <b>{recommendedLabel}</b> or higher
        </p>
      </div>
    </div>
  );
}
