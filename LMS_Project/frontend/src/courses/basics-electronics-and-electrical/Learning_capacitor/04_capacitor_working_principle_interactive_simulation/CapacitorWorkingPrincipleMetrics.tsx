import { formatCharge, formatCurrent, formatEnergy, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";

type CapacitorWorkingPrincipleMetricsProps = {
  capacitorVoltage: number;
  current: number;
  storedCharge: number;
  storedEnergy: number;
};

export function CapacitorWorkingPrincipleMetrics({
  capacitorVoltage,
  current,
  storedCharge,
  storedEnergy,
}: CapacitorWorkingPrincipleMetricsProps) {
  const [currentValue, currentUnit] = formatCurrent(current).split(" ");
  const [chargeValue] = formatCharge(storedCharge).split(" ");
  const [energyValue] = formatEnergy(storedEnergy).split(" ");

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Capacitor Voltage"
        value={formatNumber(capacitorVoltage, 2)}
        unit="V"
        tone="text-purple-600"
      />
      <MetricCard
        label="Current"
        value={currentValue}
        unit={currentUnit}
        tone="text-blue-600"
      />
      <MetricCard
        label="Stored Charge"
        value={chargeValue}
        unit="uC"
        tone="text-green-600"
      />
      <MetricCard
        label="Stored Energy"
        value={energyValue}
        unit="mJ"
        tone="text-orange-600"
      />
    </div>
  );
}
