"use client";

import { formatNumber } from "./logic";
import type { FixedType } from "./types";

export function SelectionGuideCard({
  selected,
  power,
  recommendedPower,
}: {
  selected: FixedType;
  power: number;
  recommendedPower: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Selection Guide</h2>

      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Power Check</p>
          <p className="mt-1">Calculated power: {formatNumber(power, 3)}W</p>
          <p className="font-bold text-slate-900">{recommendedPower}</p>
        </div>

        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Limitation</p>
          <p className="mt-1">{selected.limitation}</p>
        </div>
      </div>
    </div>
  );
}
