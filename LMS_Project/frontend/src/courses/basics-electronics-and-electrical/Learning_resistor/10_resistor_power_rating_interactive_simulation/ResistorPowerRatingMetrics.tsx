"use client";

import { formatCurrent, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";

export function ResistorPowerRatingMetrics({
  power,
  rating,
  current,
  status,
}: {
  power: number;
  rating: number;
  current: number;
  status: { label: string; tone: string; bg: string };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Actual Power"
        value={formatNumber(power, 3)}
        unit="W"
        tone={power > rating ? "text-red-600" : "text-orange-600"}
      />
      <MetricCard
        label="Power Rating"
        value={formatNumber(rating, 3)}
        unit="W"
        tone="text-blue-600"
      />
      <MetricCard
        label="Current"
        value={formatCurrent(current).replace(" A", "").replace(" mA", "")}
        unit={current >= 1 ? "A" : "mA"}
        tone="text-green-600"
      />
      <div className={`rounded-2xl border p-4 shadow-sm ${status.bg}`}>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
        <p className={`mt-2 text-xl font-bold ${status.tone}`}>{status.label}</p>
      </div>
    </div>
  );
}
