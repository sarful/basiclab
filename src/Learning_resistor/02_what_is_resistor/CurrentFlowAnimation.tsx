"use client";

import { motion } from "framer-motion";

import { formatResistance } from "./logic";

export function CurrentFlowAnimation({
  current,
  currentDisplay,
  voltage,
  resistance,
}: {
  current: number;
  currentDisplay: string;
  voltage: number;
  resistance: number;
}) {
  const intensity = Math.min(Math.max(current * 450, 8), 100);
  const particleCount = Math.min(Math.max(Math.round(current * 160), 4), 18);
  const duration = Math.max(0.65, 2.4 - current * 8);
  const heatLevel = Math.min(current * current * resistance, 8);
  const heatPercent = Math.min((heatLevel / 8) * 100, 100);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Current Flow Animation</h2>
          <p className="text-sm text-slate-600">Electron flow speed changes with current.</p>
        </div>
        <div className="rounded-2xl bg-blue-50 px-4 py-2 text-right">
          <p className="text-xs text-blue-700">Live Current</p>
          <p className="text-xl font-bold text-blue-800">{currentDisplay}</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-5">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
          <div className="rounded-xl bg-slate-900 px-3 py-2 text-white shadow">Battery {voltage}V</div>
          <div className="flex-1 text-center">electron flow →</div>
          <div className="rounded-xl bg-amber-100 px-3 py-2 text-amber-900 shadow-sm">Resistor {formatResistance(resistance)}</div>
        </div>

        <div className="relative mt-5 h-16 rounded-full bg-slate-200 shadow-inner">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 opacity-80"
            animate={{ width: `${intensity}%` }}
            transition={{ duration: 0.45 }}
          />

          <div className="absolute inset-0 overflow-hidden rounded-full">
            {Array.from({ length: particleCount }).map((_, index) => (
              <motion.span
                key={`${particleCount}-${index}`}
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-blue-300"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 900, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * (duration / particleCount),
                }}
                style={{ left: 0 }}
              />
            ))}
          </div>

          <motion.div
            className="absolute right-[12%] top-1/2 h-20 w-24 -translate-y-1/2 rounded-3xl border-2 border-amber-700 bg-gradient-to-br from-amber-200 to-orange-300 shadow-lg"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 1.3 }}
          >
            <div className="mt-6 text-center text-xs font-bold text-amber-950">R</div>
          </motion.div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">Flow Strength</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div className="h-2 rounded-full bg-blue-500" animate={{ width: `${intensity}%` }} />
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">Electron Speed</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{current > 0.05 ? "Fast" : current > 0.01 ? "Medium" : "Slow"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">Heat Effect</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500" animate={{ width: `${heatPercent}%` }} />
            </div>
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          Higher voltage makes electron flow faster. Higher resistance makes the flow slower. A resistor also dissipates part of the energy as heat.
        </p>
      </div>
    </div>
  );
}
