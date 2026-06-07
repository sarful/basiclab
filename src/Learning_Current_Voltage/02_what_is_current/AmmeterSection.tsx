"use client";

import { GaugeIcon } from "./icons";
import { IndustrialHeader } from "./ui";
import type { CurrentLevel } from "./types";
import { motion } from "framer-motion";

export function AmmeterSection({
  current,
  currentPercent,
  currentLevel,
}: {
  current: number;
  currentPercent: number;
  currentLevel: CurrentLevel;
}) {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <IndustrialHeader
        code="METER-01"
        title="Ammeter Reading"
        subtitle="Live current measurement."
        icon={<GaugeIcon className="h-5 w-5 text-blue-700" />}
      />

      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
        <p className="font-mono text-5xl font-semibold text-blue-700">{current.toFixed(2)}</p>
        <p className="mt-1 text-sm font-semibold text-blue-900">AMPERE (A)</p>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-blue-600"
          animate={{ width: `${currentPercent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Low Flow</span>
        <span>{currentLevel}</span>
        <span>High Flow</span>
      </div>
    </section>
  );
}
