"use client";

import { packages } from "./logic";

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
        Selected Power Rating: {selectedPackageLabel}
      </label>
      <select
        value={rating}
        onChange={(event) => onRatingChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {packages.map((item) => (
          <option key={item.watt} value={item.watt}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
