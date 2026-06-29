import { formatCapacitance, formatFrequency, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";

type VariableCapacitorMetricsProps = {
  capacitance: number;
  overlapRatio: number;
  frequency: number;
  plateCount: number;
};

export function VariableCapacitorMetrics({
  capacitance,
  overlapRatio,
  frequency,
  plateCount,
}: VariableCapacitorMetricsProps) {
  const [capacitanceValue, capacitanceUnit] = formatCapacitance(capacitance).split(" ");
  const [frequencyValue, frequencyUnit] = formatFrequency(frequency).split(" ");

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Capacitance"
        value={capacitanceValue}
        unit={capacitanceUnit}
        tone="text-purple-600"
      />
      <MetricCard
        label="Overlap"
        value={formatNumber(overlapRatio * 100, 0)}
        unit="%"
        tone="text-blue-600"
      />
      <MetricCard
        label="Tuned Frequency"
        value={frequencyValue}
        unit={frequencyUnit}
        tone="text-green-600"
      />
      <MetricCard
        label="Plate Count"
        value={String(plateCount)}
        unit="plates"
        tone="text-orange-600"
      />
    </div>
  );
}
