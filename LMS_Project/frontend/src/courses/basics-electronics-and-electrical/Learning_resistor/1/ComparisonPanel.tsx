"use client";

import { formatCurrent, formatResistance } from "./logic";
import { materials } from "./resistorLessonOneData";

export function ComparisonPanel({
  voltage,
  baseResistance,
  temperature,
}: {
  voltage: number;
  baseResistance: number;
  temperature: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Material Comparison Mode</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {materials.map((material) => {
          const resistance =
            baseResistance *
            material.resistanceFactor *
            (1 + (temperature - 25) * material.tempCoefficient);
          const current = voltage / resistance;
          return (
            <div
              key={material.key}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-bold text-slate-900">{material.bn}</p>
              <p className="mt-1 text-xs text-slate-500">{material.use}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>
                  R = <b>{formatResistance(resistance)}</b>
                </p>
                <p>
                  I = <b>{formatCurrent(current)}</b>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
