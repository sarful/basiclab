"use client";

import { formatNumber, formatResistance } from "./logic";
import { MetricCard } from "./MetricCard";

export function LdrMetrics({
  lightPercent,
  resistance,
  outputVoltage,
  lampStatus,
}: {
  lightPercent: number;
  resistance: number;
  outputVoltage: number;
  lampStatus: { label: string; tone: string; bg: string };
}) {
  const resistanceLabel = formatResistance(resistance);
  const resistanceValue = resistanceLabel
    .replace(" ohm", "")
    .replace(" kohm", "")
    .replace(" Mohm", "");
  const resistanceUnit = resistance >= 1000000 ? "Mohm" : resistance >= 1000 ? "kohm" : "ohm";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Light Intensity"
        value={formatNumber(lightPercent, 0)}
        unit="%"
        tone="text-yellow-600"
      />
      <MetricCard
        label="LDR Resistance"
        value={resistanceValue}
        unit={resistanceUnit}
        tone="text-yellow-700"
      />
      <MetricCard
        label="Output Voltage"
        value={formatNumber(outputVoltage, 2)}
        unit="V"
        tone="text-purple-600"
      />
      <div className={`rounded-2xl border p-4 shadow-sm ${lampStatus.bg}`}>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Street Light
        </p>
        <p className={`mt-2 text-xl font-bold ${lampStatus.tone}`}>
          {lampStatus.label}
        </p>
      </div>
    </div>
  );
}
