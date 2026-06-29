"use client";

import { formatResistance } from "./logic";

export function FixedResistorSelector({
  fixedResistor,
  onFixedResistorChange,
}: {
  fixedResistor: number;
  onFixedResistorChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Fixed Resistor: {formatResistance(fixedResistor)}
      </label>
      <select
        value={fixedResistor}
        onChange={(event) => onFixedResistorChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {[1000, 4700, 10000, 22000, 47000, 100000].map((value) => (
          <option key={value} value={value}>
            {formatResistance(value)}
          </option>
        ))}
      </select>
    </div>
  );
}
