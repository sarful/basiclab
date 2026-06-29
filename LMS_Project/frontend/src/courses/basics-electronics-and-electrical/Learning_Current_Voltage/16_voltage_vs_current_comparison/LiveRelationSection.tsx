"use client";

import { Gauge, Zap } from "./icons";

function LiveMeter({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "blue";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="flex items-center justify-between">
        <p className="font-semibold">{label}</p>
        <Gauge className="h-5 w-5" />
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}

export function LiveRelationSection({
  voltagePercent,
  currentPercent,
}: {
  voltagePercent: number;
  currentPercent: number;
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <Zap className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            What to Notice
          </div>
          <h2 className="mt-4 text-[1.8rem] font-semibold leading-tight text-slate-950">
            Watch the push and the flow
          </h2>
          <p className="mt-2 text-base leading-7 text-slate-600">
            As voltage rises, the push becomes stronger. As current rises, the
            actual flow becomes stronger too.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
        <LiveMeter label="Voltage strength" value={`${voltagePercent}%`} tone="red" />
        <LiveMeter label="Current flow" value={`${currentPercent}%`} tone="blue" />
      </div>
    </section>
  );
}
