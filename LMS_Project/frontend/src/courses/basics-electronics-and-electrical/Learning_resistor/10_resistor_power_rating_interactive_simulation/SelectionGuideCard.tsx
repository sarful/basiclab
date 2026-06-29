"use client";

import { formatNumber } from "./logic";

export function SelectionGuideCard({
  safetyMargin,
  recommendedLabel,
}: {
  safetyMargin: number;
  recommendedLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Selection Guide</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Safe Rule</p>
          <p className="mt-1">Use at least 2x the actual calculated power.</p>
        </div>
        <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
          <p className="font-semibold text-yellow-700">Safety Margin</p>
          <p className="mt-1">
            Selected rating is {formatNumber(safetyMargin, 2)}x the actual power.
          </p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Recommended Wattage</p>
          <p className="mt-1">
            Choose <b>{recommendedLabel}</b> or higher.
          </p>
        </div>
      </div>
    </div>
  );
}
