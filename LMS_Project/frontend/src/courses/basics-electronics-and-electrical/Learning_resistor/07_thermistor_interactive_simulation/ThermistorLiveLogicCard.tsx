"use client";

import { formatCurrent, formatResistance } from "./logic";
import type { ThermistorMode } from "./types";

export function ThermistorLiveLogicCard({
  mode,
  resistance,
  voltage,
  current,
}: {
  mode: ThermistorMode;
  resistance: number;
  voltage: number;
  current: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Live Formula / Logic</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Selected Mode</p>
          <p className="mt-1 text-sm text-slate-700">{mode.toUpperCase()} thermistor</p>
        </div>
        <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
          <p className="font-semibold text-yellow-700">Resistance</p>
          <p className="mt-1 text-sm text-slate-700">R = {formatResistance(resistance)}</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Current</p>
          <p className="mt-1 text-sm text-slate-700">
            I = V / R = {voltage} / {formatResistance(resistance)} = {formatCurrent(current)}
          </p>
        </div>
      </div>
    </div>
  );
}
