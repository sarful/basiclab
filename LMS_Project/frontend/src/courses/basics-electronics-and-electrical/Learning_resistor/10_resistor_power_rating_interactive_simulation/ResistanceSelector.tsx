"use client";

import { formatResistance, resistorValues } from "./logic";

export function ResistanceSelector({
  resistance,
  onResistanceChange,
}: {
  resistance: number;
  onResistanceChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Resistance: {formatResistance(resistance)}
      </label>
      <select
        value={resistance}
        onChange={(event) => onResistanceChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {resistorValues.map((value) => (
          <option key={value} value={value}>
            {formatResistance(value)}
          </option>
        ))}
      </select>
    </div>
  );
}
