"use client";

import type { NpnWorkingState } from "./simulationTypes";

export default function LiveEquationsPanel({ state }: { state: NpnWorkingState }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Live Equations
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-900">
            Saturation Check Math
          </h3>
        </div>
        <div className="rounded-full bg-red-100 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-700">
          Live Solve
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {state.equations.map((equation) => (
          <div
            key={equation.label}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900">{equation.label}</p>
                <p className="mt-1 font-mono text-sm text-slate-600">
                  {equation.expression}
                </p>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-900 shadow-sm">
                {equation.value}
              </div>
            </div>
            {equation.note ? (
              <p className="mt-2 text-xs font-semibold text-slate-500">
                {equation.note}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
