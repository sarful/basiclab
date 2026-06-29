"use client";

import { formatResistance } from "./logic";

export function DarkResistanceSelector({
  darkResistance,
  onDarkResistanceChange,
}: {
  darkResistance: number;
  onDarkResistanceChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Dark Resistance: {formatResistance(darkResistance)}
      </label>
      <select
        value={darkResistance}
        onChange={(event) => onDarkResistanceChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {[50000, 100000, 250000, 500000, 1000000].map((value) => (
          <option key={value} value={value}>
            {formatResistance(value)}
          </option>
        ))}
      </select>
    </div>
  );
}
