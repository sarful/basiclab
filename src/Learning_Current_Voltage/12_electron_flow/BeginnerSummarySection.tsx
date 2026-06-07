"use client";

import { Info } from "./icons";
import { ConceptCard } from "./ui";

export function BeginnerSummarySection() {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <Info className="h-5 w-5 text-cyan-700" />
        </div>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Summary
          </div>
          <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-slate-950">
            Beginner summary
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep these simple ideas in mind while you compare electron flow with
            conventional current direction.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-7 text-cyan-900">
        Electrons are real negative charges. They move from the negative
        terminal toward the positive terminal when the circuit path is complete.
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ConceptCard
          title="Electron Flow"
          detail="Electrons move from the negative terminal toward the positive terminal."
        />
        <ConceptCard
          title="Conventional Current"
          detail="Conventional current direction is shown from positive to negative terminal."
        />
        <ConceptCard
          title="Resistance Effect"
          detail="Higher resistance makes electron flow slower when voltage stays the same."
        />
      </div>
    </section>
  );
}
