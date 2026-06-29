import { EffectBar } from "./EffectBar";

type TuningIndicatorsCardProps = {
  overlapRatio: number;
  capacitance: number;
  minCapacitance: number;
  maxCapacitance: number;
  tuningPercent: number;
};

export function TuningIndicatorsCard({
  overlapRatio,
  capacitance,
  minCapacitance,
  maxCapacitance,
  tuningPercent,
}: TuningIndicatorsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Tuning Indicators</h2>
      <div className="space-y-4">
        <EffectBar
          label="Plate Overlap"
          value={overlapRatio}
          maxValue={1}
          color="#8b5cf6"
          note="More overlap means more capacitance."
        />
        <EffectBar
          label="Capacitance Range"
          value={capacitance - minCapacitance}
          maxValue={maxCapacitance - minCapacitance}
          color="#2563eb"
          note="This shows where the current setting sits in the capacitor range."
        />
        <EffectBar
          label="High Frequency Side"
          value={tuningPercent}
          maxValue={1}
          color="#16a34a"
          note="Lower capacitance produces higher resonant frequency."
        />
        <EffectBar
          label="Low Frequency Side"
          value={overlapRatio}
          maxValue={1}
          color="#f97316"
          note="Higher capacitance produces lower resonant frequency."
        />
      </div>
    </div>
  );
}
