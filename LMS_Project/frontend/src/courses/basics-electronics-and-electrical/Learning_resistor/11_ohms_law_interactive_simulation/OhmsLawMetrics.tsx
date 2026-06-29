"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";
import { MetricCard } from "./MetricCard";

export function OhmsLawMetrics({
  voltage,
  current,
  resistance,
  power,
}: {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard label="Voltage" value={formatNumber(voltage, 2)} unit="V" tone="text-blue-600" />
      <MetricCard
        label="Current"
        value={formatCurrent(current).replace(" A", "").replace(" mA", "")}
        unit={current >= 1 ? "A" : "mA"}
        tone="text-green-600"
      />
      <MetricCard
        label="Resistance"
        value={formatResistance(resistance).replace(" ohm", "").replace(" kohm", "")}
        unit={resistance >= 1000 ? "kohm" : "ohm"}
        tone="text-yellow-600"
      />
      <MetricCard label="Power" value={formatNumber(power, 3)} unit="W" tone="text-orange-600" />
    </div>
  );
}
