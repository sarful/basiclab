"use client";

import {
  formatCapacitance,
  formatCharge,
  formatEnergy,
  formatNumber,
} from "./logic";
import { MetricCard } from "./MetricCard";

export function CapacitanceMetrics({
  capacitance,
  charge,
  voltage,
  energy,
}: {
  capacitance: number;
  charge: number;
  voltage: number;
  energy: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Capacitance"
        value={formatCapacitance(capacitance).split(" ")[0]}
        unit={formatCapacitance(capacitance).split(" ")[1]}
        tone="text-purple-600"
      />
      <MetricCard
        label="Stored Charge"
        value={formatCharge(charge).split(" ")[0]}
        unit={formatCharge(charge).split(" ")[1]}
        tone="text-blue-600"
      />
      <MetricCard
        label="Voltage"
        value={formatNumber(voltage, 1)}
        unit="V"
        tone="text-green-600"
      />
      <MetricCard
        label="Stored Energy"
        value={formatEnergy(energy).split(" ")[0]}
        unit={formatEnergy(energy).split(" ")[1]}
        tone="text-orange-600"
      />
    </div>
  );
}
