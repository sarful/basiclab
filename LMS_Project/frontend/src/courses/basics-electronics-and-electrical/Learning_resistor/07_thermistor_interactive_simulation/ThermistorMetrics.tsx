"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";

export function ThermistorMetrics({
  temperature,
  resistance,
  current,
  status,
}: {
  temperature: number;
  resistance: number;
  current: number;
  status: { label: string; tone: string; bg: string };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCardLike
        label="Temperature"
        value={formatNumber(temperature, 0)}
        unit="C"
        tone="text-red-600"
      />
      <MetricCardLike
        label="Resistance"
        value={formatResistance(resistance)
          .replace(" Î©", "")
          .replace(" kÎ©", "")
          .replace(" MÎ©", "")}
        unit={resistance >= 1000000 ? "MÎ©" : resistance >= 1000 ? "kÎ©" : "Î©"}
        tone="text-yellow-600"
      />
      <MetricCardLike
        label="Current"
        value={formatCurrent(current).replace(" A", "").replace(" mA", "")}
        unit={current >= 1 ? "A" : "mA"}
        tone="text-green-600"
      />
      <div className={`rounded-2xl border p-4 shadow-sm ${status.bg}`}>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
        <p className={`mt-2 text-2xl font-bold ${status.tone}`}>{status.label}</p>
      </div>
    </div>
  );
}

function MetricCardLike({
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
      <p className="text-sm text-slate-500">{unit}</p>
    </div>
  );
}
