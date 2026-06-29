"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";
import { MetricCard } from "./MetricCard";

export function ParallelResistorMetrics({
  eqResistance,
  totalCurrent,
  supplyVoltage,
  totalPower,
}: {
  eqResistance: number;
  totalCurrent: number;
  supplyVoltage: number;
  totalPower: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Equivalent Resistance"
        value={formatResistance(eqResistance).replace(" ohm", "").replace(" kohm", "")}
        unit={eqResistance >= 1000 ? "kohm" : "ohm"}
        tone="text-purple-600"
      />
      <MetricCard
        label="Total Current"
        value={formatCurrent(totalCurrent).replace(" A", "").replace(" mA", "")}
        unit={totalCurrent >= 1 ? "A" : "mA"}
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
