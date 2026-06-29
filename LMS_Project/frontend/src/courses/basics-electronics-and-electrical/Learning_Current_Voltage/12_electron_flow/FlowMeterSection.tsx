"use client";

import { Gauge } from "./icons";
import type { FlowLevel } from "./types";

export function FlowMeterSection({
  current,
  flowPercent,
  flowLevel,
}: {
  current: number;
  flowPercent: number;
  flowLevel: FlowLevel;
}) {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <Gauge className="h-5 w-5 text-blue-700" />
        </div>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Meter
          </div>
          <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-slate-950">
            Live electron reading
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Watch how strongly charge is moving while you change the circuit
            conditions.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
        <p className="font-mono text-5xl font-semibold text-blue-700">
          {current.toFixed(2)}
        </p>
        <p className="mt-1 text-sm font-semibold text-blue-900">AMPERE (A)</p>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${flowPercent}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Slow Drift</span>
        <span>{flowLevel}</span>
        <span>Fast Drift</span>
      </div>
    </section>
  );
}
