"use client";

import { formatNumber } from "../01_transformer_interactive_simulation/logic";

import type { TransformerWorkingPrincipleSnapshot } from "./transformerWorkingPrincipleTypes";

function ReadoutCard({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex items-end gap-2">
        <span className={`text-2xl font-black ${tone}`}>{value}</span>
        <span className="pb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function TransformerWorkingPrincipleDashboard({
  snapshot,
}: {
  snapshot: TransformerWorkingPrincipleSnapshot;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-cyan-700">
            Industrial Dashboard
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Live Readings
          </h2>
        </div>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-700">
          {snapshot.liveCondition}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ReadoutCard
          label="Input Voltage"
          value={formatNumber(snapshot.inputVoltage, 0)}
          unit="V"
          tone="text-cyan-300"
        />
        <ReadoutCard
          label="Output Voltage"
          value={formatNumber(snapshot.outputVoltage, 1)}
          unit="V"
          tone="text-amber-300"
        />
        <ReadoutCard
          label="Turns Ratio"
          value={formatNumber(snapshot.turnsRatio, 2)}
          unit="R"
          tone="text-violet-300"
        />
        <ReadoutCard
          label="Frequency"
          value={formatNumber(snapshot.frequency, 0)}
          unit="Hz"
          tone="text-emerald-300"
        />
        <ReadoutCard
          label="Flux Level"
          value={formatNumber(snapshot.fluxLevel * 100, 0)}
          unit="%"
          tone="text-sky-300"
        />
        <ReadoutCard
          label="Efficiency"
          value={formatNumber(snapshot.efficiency * 100, 0)}
          unit="%"
          tone="text-orange-300"
        />
      </div>
    </section>
  );
}
