"use client";

import { formatResistance } from "./logic";

export function ResistorColorCodeMetrics({
  resistance,
  tolerance,
  minResistance,
  maxResistance,
}: {
  resistance: number;
  tolerance: number;
  minResistance: number;
  maxResistance: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Resistance</p>
        <p className="mt-2 text-3xl font-bold text-blue-600">{formatResistance(resistance)}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tolerance</p>
        <p className="mt-2 text-3xl font-bold text-orange-600">+/-{tolerance}%</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Min Value</p>
        <p className="mt-2 text-xl font-bold text-green-600">{formatResistance(minResistance)}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Max Value</p>
        <p className="mt-2 text-xl font-bold text-red-600">{formatResistance(maxResistance)}</p>
      </div>
    </div>
  );
}
