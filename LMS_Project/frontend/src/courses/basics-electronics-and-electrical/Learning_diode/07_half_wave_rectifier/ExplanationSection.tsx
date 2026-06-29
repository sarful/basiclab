"use client";

import { diodeProfiles } from "./logic";
import type { DiodeType } from "./types";

export function ExplanationSection({
  state,
  diodeType,
}: {
  state: ReturnType<typeof import("./logic").getHalfWaveState>;
  diodeType: DiodeType;
}) {
  return (
    <section className="rounded-3xl bg-yellow-50 p-5 shadow-sm ring-1 ring-yellow-200">
      <h2 className="text-xl font-black text-slate-900">Half-Wave Rectifier Working</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <h3 className="font-black text-green-700">Positive half cycle</h3>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            The diode becomes forward biased, so current reaches the LED load and the
            rectified output rises above zero.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <h3 className="font-black text-red-700">Negative half cycle</h3>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            The diode becomes reverse biased, so ideal current is blocked. Real diodes
            still show leakage and, for non-Schottky parts, a short reverse-recovery tail.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-500">Average DC</p>
          <p className="mt-1 text-lg font-black text-slate-900">{state.avg.toFixed(2)} V</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-500">RMS Output</p>
          <p className="mt-1 text-lg font-black text-slate-900">{state.rms.toFixed(2)} V</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-500">Avg LED Current</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {(state.avgCurrent * 1000).toFixed(2)} mA
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold text-slate-500">Conduction</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {state.conductionPercent.toFixed(0)}%
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Selected Diode
        </p>
        <p className="mt-1 text-lg font-black text-slate-900">
          {diodeProfiles[diodeType].label}
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-700">
          Reverse recovery: {state.recoveryPercent.toFixed(1)}% of shown cycle | Total loss:{" "}
          {state.totalLossW.toFixed(3)} W | Junction rise: {state.junctionRiseC.toFixed(1)} C
        </p>
      </div>
    </section>
  );
}
