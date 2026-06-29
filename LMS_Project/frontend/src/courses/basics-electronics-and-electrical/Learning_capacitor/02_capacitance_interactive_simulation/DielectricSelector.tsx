"use client";

import { dielectricOptions } from "./logic";

export function DielectricSelector({
  dielectricIndex,
  setDielectricIndex,
}: {
  dielectricIndex: number;
  setDielectricIndex: (value: number) => void;
}) {
  const dielectric = dielectricOptions[dielectricIndex];

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        Dielectric Material
      </label>
      <select
        value={dielectricIndex}
        onChange={(event) => setDielectricIndex(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white p-3"
      >
        {dielectricOptions.map((item, index) => (
          <option key={item.name} value={index}>
            {item.label} - k={item.k}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-slate-500">{dielectric.note}</p>
    </div>
  );
}
