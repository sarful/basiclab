"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";
import { MetricCard } from "./MetricCard";

export function SeriesResistorMetrics({
  totalResistance,
  current,
  supplyVoltage,
  totalPower,
}: {
  totalResistance: number;
  current: number;
  supplyVoltage: number;
  totalPower: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Total Resistance"
        value={formatResistance(totalResistance).replace(" ohm", "").replace(" kohm", "")}
        unit={totalResistance >= 1000 ? "kohm" : "ohm"}
        tone="text-yellow-600"
      />
      <MetricCard
        label="Same Current"
        value={formatCurrent(current).replace(" A", "").replace(" mA", "")}
        unit={current >= 1 ? "A" : "mA"}
        tone="text-green-600"
      />
      <MetricCard
        label="Supply Voltage"
        value={formatNumber(supplyVoltage, 1)}
        unit="V"
        tone="text-blue-600"
      />
      <MetricCard
        label="Total Power"
        value={formatNumber(totalPower, 3)}
        unit="W"
        tone="text-orange-600"
      />
    </div>
  );
}
