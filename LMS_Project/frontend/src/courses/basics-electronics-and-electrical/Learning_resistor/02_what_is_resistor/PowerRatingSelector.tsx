"use client";

import { resistorPackages } from "./logic";

export function PowerRatingSelector({
  rating,
  selectedPackageLabel,
  onRatingChange,
}: {
  rating: number;
  selectedPackageLabel: string;
  onRatingChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Resistor Heat Capacity: {selectedPackageLabel}
      </label>
      <select
        value={rating}
        onChange={(event) => onRatingChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {resistorPackages.map((item) => (
          <option key={item.watt} value={item.watt}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
