"use client";

import {
  formatCapacitance,
  formatCurrent,
  formatEnergy,
  formatNumber,
} from "./logic";

import { MetricCard } from "./MetricCard";

export function CapacitorMetrics({
  capacitance,
  capacitorVoltage,
  current,
  storedEnergy,
}: {
  capacitance: number;
  capacitorVoltage: number;
  current: number;
  storedEnergy: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Capacitance"
        value={formatCapacitance(capacitance).replace(" uF", "").replace(" mF", "")}
        unit={capacitance >= 1000 ? "mF" : "uF"}
        tone="text-purple-600"
      />
      <MetricCard
        label="Capacitor Voltage"
        value={formatNumber(capacitorVoltage, 2)}
        unit="V"
        tone="text-blue-600"
      />
      <MetricCard
        label="Instant Current"
        value={formatCurrent(Math.abs(current)).replace(" A", "").replace(" mA", "")}
        unit={Math.abs(current) >= 1 ? "A" : "mA"}
        tone="text-green-600"
      />
      <MetricCard
        label="Stored Energy"
        value={formatEnergy(storedEnergy).replace(" mJ", "").replace(" uJ", "")}
        unit={storedEnergy >= 0.001 ? "mJ" : "uJ"}
        tone="text-orange-600"
      />
    </div>
  );
}
