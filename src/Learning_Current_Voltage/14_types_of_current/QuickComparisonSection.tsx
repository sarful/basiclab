"use client";

import { ConceptCard } from "./ui";

export function QuickComparisonSection() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            Comparison View
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Quick comparison
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Use this section to notice the simple practical difference between
            steady DC flow and changing AC flow.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          DC stays one-way. AC changes direction.
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <ConceptCard title="DC Current" detail="Flows in one fixed direction. Example: battery-powered devices." />
        <ConceptCard title="AC Current" detail="Changes direction periodically. Example: household power supply." />
        <ConceptCard title="Frequency" detail="Frequency tells how many times AC changes cycle per second. Unit: Hertz (Hz)." />
      </div>
    </section>
  );
}
