import { formatCapacitancePf, formatNumber } from "./logic";
import { MetricCard } from "./MetricCard";

type CeramicCapacitorMetricsProps = {
  capacitancePf: number;
  code: string;
  safePercent: number;
  reactanceOhm: number;
};

export function CeramicCapacitorMetrics({
  capacitancePf,
  code,
  safePercent,
  reactanceOhm,
}: CeramicCapacitorMetricsProps) {
  const [capacitanceValue, capacitanceUnit] = formatCapacitancePf(capacitancePf).split(" ");

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Capacitance"
        value={capacitanceValue}
        unit={capacitanceUnit}
        tone="text-orange-600"
      />
      <MetricCard label="Code" value={code} unit="marking" tone="text-blue-600" />
      <MetricCard
        label="Safety Margin"
        value={formatNumber(safePercent, 0)}
        unit="%"
        tone="text-green-600"
      />
      <MetricCard
        label="Reactance"
        value={formatNumber(reactanceOhm >= 1000 ? reactanceOhm / 1000 : reactanceOhm, 2)}
        unit={reactanceOhm >= 1000 ? "kOhm" : "Ohm"}
        tone="text-purple-600"
      />
    </div>
  );
}
