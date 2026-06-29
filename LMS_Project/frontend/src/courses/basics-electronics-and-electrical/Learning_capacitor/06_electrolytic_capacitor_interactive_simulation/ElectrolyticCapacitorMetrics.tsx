import { formatCapacitance, formatEnergy, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";

type ElectrolyticCapacitorMetricsProps = {
  capacitance: number;
  storedEnergy: number;
  voltageRating: number;
  appliedVoltage: number;
  heatLoss: number;
};

export function ElectrolyticCapacitorMetrics({
  capacitance,
  storedEnergy,
  voltageRating,
  appliedVoltage,
  heatLoss,
}: ElectrolyticCapacitorMetricsProps) {
  const [energyValue, energyUnit] = formatEnergy(storedEnergy).split(" ");

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Capacitance"
        value={formatCapacitance(capacitance).replace(" uF", "").replace(" mF", "")}
        unit={capacitance >= 1000 ? "mF" : "uF"}
        tone="text-orange-600"
      />
      <MetricCard
        label="Stored Energy"
        value={energyValue}
        unit={energyUnit}
        tone="text-blue-600"
      />
      <MetricCard
        label="Voltage Margin"
        value={formatNumber(voltageRating - appliedVoltage, 1)}
        unit="V"
        tone={voltageRating >= appliedVoltage ? "text-green-600" : "text-red-600"}
      />
      <MetricCard
        label="ESR Heat"
        value={formatNumber(heatLoss * 1000, 2)}
        unit="mW"
        tone="text-red-600"
      />
    </div>
  );
}
