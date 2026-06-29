import { EffectBar } from "./EffectBar";
import type { DielectricOption } from "./types";

type PerformanceIndicatorsCardProps = {
  filterEffect: number;
  safePercent: number;
  stabilityPercent: number;
  dielectric: DielectricOption;
};

export function PerformanceIndicatorsCard({
  filterEffect,
  safePercent,
  stabilityPercent,
  dielectric,
}: PerformanceIndicatorsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Performance Indicators</h2>
      <div className="space-y-4">
        <EffectBar
          label="Filtering Effect"
          value={filterEffect}
          maxValue={1}
          color="#f97316"
          note="Higher-frequency noise is bypassed more easily."
        />
        <EffectBar
          label="Voltage Safety"
          value={safePercent}
          maxValue={100}
          color="#16a34a"
          note="Applied voltage should remain below the rating."
        />
        <EffectBar
          label="Dielectric Stability"
          value={stabilityPercent}
          maxValue={100}
          color="#2563eb"
          note="C0G is very stable, while Y5V is less stable."
        />
        <EffectBar
          label="Temperature Drift"
          value={dielectric.tempDrift * 100}
          maxValue={100}
          color="#ef4444"
          note="More drift means capacitance changes more with temperature."
        />
      </div>
    </div>
  );
}
