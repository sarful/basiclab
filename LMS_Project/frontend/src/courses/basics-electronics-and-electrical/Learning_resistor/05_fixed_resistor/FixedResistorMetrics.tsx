"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";

export function FixedResistorMetrics({
  current,
  power,
  minValue,
  maxValue,
  isOverloaded,
}: {
  current: number;
  power: number;
  minValue: number;
  maxValue: number;
  isOverloaded: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current</p>
        <p className="mt-2 text-3xl font-bold text-green-600">
          {formatCurrent(current)}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Power</p>
        <p
          className={`mt-2 text-3xl font-bold ${
            isOverloaded ? "text-red-600" : "text-orange-600"
          }`}
        >
          {formatNumber(power, 3)} W
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Tolerance Range
        </p>
        <p className="mt-2 text-sm font-bold text-blue-600">
          {formatResistance(minValue)} to {formatResistance(maxValue)}
        </p>
      </div>

      <div
        className={`rounded-2xl border p-4 shadow-sm ${
          isOverloaded ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
        }`}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
        <p
          className={`mt-2 text-2xl font-bold ${
            isOverloaded ? "text-red-600" : "text-green-600"
          }`}
        >
          {isOverloaded ? "OVERLOAD" : "SAFE"}
        </p>
      </div>
    </div>
  );
}
