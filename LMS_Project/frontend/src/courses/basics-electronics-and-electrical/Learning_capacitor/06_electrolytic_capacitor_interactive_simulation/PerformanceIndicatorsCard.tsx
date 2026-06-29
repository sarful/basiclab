import { EffectBar } from "./EffectBar";

type PerformanceIndicatorsCardProps = {
  smoothingLevel: number;
  safetyMargin: number;
  leakageRisk: number;
  heatLoss: number;
};

export function PerformanceIndicatorsCard({
  smoothingLevel,
  safetyMargin,
  leakageRisk,
  heatLoss,
}: PerformanceIndicatorsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Performance Indicators</h2>
      <div className="space-y-4">
        <EffectBar
          label="Ripple Smoothing"
          value={smoothingLevel}
          maxValue={1}
          color="#22c55e"
          note="Higher capacitance and lower ESR improve smoothing."
        />
        <EffectBar
          label="Voltage Safety"
          value={safetyMargin}
          maxValue={100}
          color="#16a34a"
          note="More voltage margin means safer operation."
        />
        <EffectBar
          label="Leakage / Failure Risk"
          value={leakageRisk}
          maxValue={1}
          color="#ef4444"
          note="Reverse polarity or over-voltage raises failure risk."
        />
        <EffectBar
          label="ESR Heating"
          value={heatLoss}
          maxValue={1}
          color="#f97316"
          note="Ripple current creates heat through ESR."
        />
      </div>
    </div>
  );
}
