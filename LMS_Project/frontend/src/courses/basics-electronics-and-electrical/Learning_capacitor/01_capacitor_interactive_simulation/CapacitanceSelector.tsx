"use client";

import { capacitanceOptions, formatCapacitance } from "./logic";

export function CapacitanceSelector({
  capacitance,
  setCapacitance,
}: {
  capacitance: number;
  setCapacitance: (value: number) => void;
}) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        Capacitance: {formatCapacitance(capacitance)}
      </label>
      <select
        value={capacitance}
        onChange={(event) => setCapacitance(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {capacitanceOptions.map((value) => (
          <option key={value} value={value}>
            {formatCapacitance(value)}
          </option>
        ))}
      </select>
    </div>
  );
}
