import { formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";

type CapacitorComparisonMetricsProps = {
  voltage: number;
  safeMargin: number;
  frequency: number;
  acBehavior: number;
};

export function CapacitorComparisonMetrics({
  voltage,
  safeMargin,
  frequency,
  acBehavior,
}: CapacitorComparisonMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Applied Voltage"
        value={formatNumber(voltage, 0)}
        unit="V"
        tone="text-orange-600"
      />
      <MetricCard
        label="Voltage Safety"
        value={formatNumber(safeMargin * 100, 0)}
        unit="%"
        tone={safeMargin > 0.2 ? "text-green-600" : "text-red-600"}
      />
      <MetricCard
        label="AC Frequency"
        value={formatNumber(frequency, 0)}
        unit="Hz"
        tone="text-blue-600"
      />
      <MetricCard
        label="AC Behavior"
        value={formatNumber(acBehavior * 100, 0)}
        unit="%"
        tone="text-purple-600"
      />
    </div>
  );
}
