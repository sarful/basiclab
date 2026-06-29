"use client";

import { formatResistance } from "./logic";

export function NominalResistanceSelector({
  nominalResistance,
  onNominalResistanceChange,
}: {
  nominalResistance: number;
  onNominalResistanceChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Nominal Resistance @25C: {formatResistance(nominalResistance)}
      </label>
      <select
        value={nominalResistance}
        onChange={(event) => onNominalResistanceChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {[1000, 4700, 10000, 47000, 100000].map((value) => (
          <option key={value} value={value}>
            {formatResistance(value)}
          </option>
        ))}
      </select>
    </div>
  );
}
