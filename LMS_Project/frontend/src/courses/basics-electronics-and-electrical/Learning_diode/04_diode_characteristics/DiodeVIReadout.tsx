"use client";

import { getDiodeVIState } from "./diodeVILogic";
import type { DiodeBiasMode, DiodeMode } from "./diodeVITypes";

export default function DiodeVIReadout({
  biasMode,
  currentScale,
  diodeMode,
  voltage,
}: {
  biasMode: DiodeBiasMode;
  currentScale: number;
  diodeMode: DiodeMode;
  voltage: number;
}) {
  const state = getDiodeVIState({ biasMode, currentScale, diodeMode, voltage });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Live Readout
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Operating Point</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${
          state.isConducting ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
        }`}>
          {state.isConducting ? "Conduction ON" : "Conduction OFF"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">Voltage</p>
          <p className="mt-1 text-xl font-black text-slate-950">{state.voltage.toFixed(2)}V</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-black uppercase text-red-600">Current</p>
          <p className="mt-1 text-xl font-black text-red-700">{state.currentMA.toFixed(3)}mA</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-black uppercase text-amber-700">Region</p>
          <p className="mt-1 text-lg font-black text-amber-800">{state.region}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-black uppercase text-blue-700">Mode</p>
          <p className="mt-1 text-lg font-black text-blue-800">{diodeMode}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {biasMode === "reverse"
          ? "Reverse bias keeps the diode in its blocking region with only leakage visible on the plot."
          : "Forward bias shows the knee-voltage transition, then the current rises with the selected current scaling."}
      </p>
    </section>
  );
}
