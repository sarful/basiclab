"use client";

import { formatResistance } from "./logic";
import type { BandMode } from "./types";

export function LiveFormulaCard({
  mode,
  formulaText,
  minResistance,
  maxResistance,
  tempPpm,
}: {
  mode: BandMode;
  formulaText: string;
  minResistance: number;
  maxResistance: number;
  tempPpm: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Live Formula</h2>
      <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Calculation</p>
        <p className="mt-2 text-lg font-bold text-slate-900">{formulaText}</p>
        <p className="mt-2">
          Allowed range: {formatResistance(minResistance)} to {formatResistance(maxResistance)}
        </p>
        {mode === 6 && <p className="mt-1">Temperature coefficient: {tempPpm} ppm/degC</p>}
      </div>
    </div>
  );
}
