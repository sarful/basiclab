"use client";

import { Activity } from "./icons";

function SummaryCard({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

export function BeginnerSummarySection() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <Activity className="h-5 w-5 text-cyan-700" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Beginner Summary
            </div>
            <h2 className="mt-4 text-[1.9rem] font-semibold leading-tight text-slate-950">
              Keep the comparison simple
            </h2>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              If you remember what voltage does and what current shows, circuit
              reading becomes much easier.
            </p>
          </div>
        </div>

        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Live
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-4 text-base leading-7 text-cyan-900">
        Voltage is the push that tries to move charge. Current is the amount of
        charge that is actually moving in the circuit.
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Voltage"
          detail="Voltage tells us how strongly the source is pushing electric charge."
        />
        <SummaryCard
          title="Current"
          detail="Current tells us how much charge is really moving through the wire."
        />
        <SummaryCard
          title="Relationship"
          detail="If resistance stays the same, more voltage usually creates more current."
        />
      </div>
    </section>
  );
}
