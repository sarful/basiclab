"use client";

import { formatCurrent, formatResistance } from "./logic";
import type { ThermistorMode } from "./types";

export function KnowledgeSection({
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
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">What is Thermistor?</h2>
          <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
            <p className="font-semibold text-blue-700">Definition</p>
            <p className="mt-1">A thermistor is a resistor whose value changes with temperature.</p>
          </div>
          <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
            <p className="font-semibold text-yellow-700">Main Idea</p>
            <p className="mt-1">In NTC devices temperature rise lowers resistance, while in PTC devices temperature rise increases resistance.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Applications</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
              <p className="font-semibold text-green-700">Temperature Sensor</p>
              <p className="mt-1">Used in battery packs, thermostats, room sensing, and cooling fan control.</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
              <p className="font-semibold text-orange-700">Protection Circuit</p>
              <p className="mt-1">Useful for over-temperature protection and inrush current limiting.</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
              <p className="font-semibold text-red-700">Limitation</p>
              <p className="mt-1">Thermistor response is non-linear, so calibration may be required.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Live Formula / Logic</h2>
        <div className="grid gap-4 md:grid-cols-4">
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
            <p className="mt-1 text-sm text-slate-700">I = V / R = {voltage} / {formatResistance(resistance)} = {formatCurrent(current)}</p>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-4 ring-1 ring-cyan-100">
            <p className="font-semibold text-cyan-700">Fan Response Logic</p>
            <p className="mt-1 text-sm text-slate-700">Cooling fan speed follows temperature: low temp → slow fan, high temp → fast fan.</p>
          </div>
        </div>
      </div>
    </>
  );
}
