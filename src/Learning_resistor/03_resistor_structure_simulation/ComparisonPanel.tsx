"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatResistance } from "./logic";
import { materials } from "./logic";

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
      <h2 className="mb-4 font-semibold text-slate-900">Material Comparison</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {materials.map((material) => {
          const resistance = baseResistance * material.resistanceFactor * (1 + (temperature - 25) * 0.004);
          const current = voltage / Math.max(resistance, 1);
          const stress = clamp(current * voltage * material.heatFactor * 0.14 + temperature / 180, 0, 1);

          return (
            <div key={material.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-slate-900">{material.label}</p>
              <p className="mt-1 text-xs text-slate-500">{material.note}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>Resistance: <b>{formatResistance(resistance)}</b></p>
                <p>Current: <b>{formatCurrent(current)}</b></p>
                <div>
                  <p className="mb-1 text-xs font-semibold text-red-600">Heat stress</p>
                  <div className="h-2 rounded-full bg-slate-200">
                    <motion.div className="h-2 rounded-full bg-red-500" animate={{ width: `${stress * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
