"use client";

import { formatResistance, resistanceOptions } from "./logic";

export function ResistanceSelector({
  resistance,
  setResistance,
}: {
  resistance: number;
  setResistance: (value: number) => void;
}) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        Resistance: {formatResistance(resistance)}
      </label>
      <select
        value={resistance}
        onChange={(event) => setResistance(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {resistanceOptions.map((value) => (
          <option key={value} value={value}>
            {formatResistance(value)}
          </option>
        ))}
      </select>
    </div>
  );
}
