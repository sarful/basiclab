"use client";

import { formatCapacitance } from "./logic";

export function CapacitanceFormulaCard({
  capacitance,
}: {
  capacitance: number;
}) {
  return (
    <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        Main Formula
      </p>
      <p className="mt-1 text-sm text-slate-700">C = Q / V and Q = C x V</p>
      <p className="mt-1 text-lg font-bold text-slate-900">
        C = {formatCapacitance(capacitance)}
      </p>
    </div>
  );
}
