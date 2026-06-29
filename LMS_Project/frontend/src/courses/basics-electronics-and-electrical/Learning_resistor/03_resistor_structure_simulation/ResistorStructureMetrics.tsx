"use client";

import { formatCurrent, formatResistance, formatValue } from "./logic";
import { MetricCard } from "./MetricCard";

export function ResistorStructureMetrics({
  resistance,
  current,
  temperature,
  power,
}: {
  resistance: number;
  current: number;
  temperature: number;
  power: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Resistance"
        value={formatResistance(resistance)
          .replace(" Î©", "")
          .replace(" kÎ©", "")}
        unit={resistance >= 1000 ? "kÎ©" : "Î©"}
        tone="text-yellow-600"
      />
      <MetricCard
        label="Current"
        value={formatCurrent(current).replace(" A", "").replace(" mA", "")}
        unit={current >= 1 ? "A" : "mA"}
        tone="text-green-600"
      />
      <MetricCard
        label="Temperature"
        value={formatValue(temperature, 0)}
        unit="Â°C"
        tone="text-red-600"
      />
      <MetricCard
        label="Power / Heat"
        value={formatValue(power, 3)}
        unit="W"
        tone="text-orange-600"
      />
    </div>
  );
}
