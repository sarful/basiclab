import { formatCapacitance, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";

type CapacitorStructureMetricsProps = {
  capacitance: number;
  plateArea: number;
  plateDistance: number;
  dielectricK: number;
};

export function CapacitorStructureMetrics({
  capacitance,
  plateArea,
  plateDistance,
  dielectricK,
}: CapacitorStructureMetricsProps) {
  const [capacitanceValue, capacitanceUnit] = formatCapacitance(capacitance).split(" ");

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Capacitance"
        value={capacitanceValue}
        unit={capacitanceUnit}
        tone="text-purple-600"
      />
      <MetricCard
        label="Plate Area"
        value={formatNumber(plateArea, 0)}
        unit="cm2"
        tone="text-blue-600"
      />
      <MetricCard
        label="Plate Distance"
        value={formatNumber(plateDistance, 1)}
        unit="mm"
        tone="text-green-600"
      />
      <MetricCard
        label="Dielectric k"
        value={formatNumber(dielectricK, 1)}
        unit="relative"
        tone="text-orange-600"
      />
    </div>
  );
}
