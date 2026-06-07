import { EffectBar } from "./EffectBar";

type LearningSectionsProps = {
  smoothingLevel: number;
  safetyMargin: number;
  leakageRisk: number;
  heatLoss: number;
};

export function LearningSections({
  smoothingLevel,
  safetyMargin,
  leakageRisk,
  heatLoss,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
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

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What is an Electrolytic Capacitor?</h2>
        <div className="rounded-2xl bg-orange-50 p-4 text-sm text-slate-700 ring-1 ring-orange-100">
          <p className="font-semibold text-orange-700">Definition</p>
          <p className="mt-1">
            An electrolytic capacitor uses electrolyte and a very thin oxide dielectric
            to achieve high capacitance values.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Real Marking</p>
          <p className="mt-1">
            The stripe on the body usually marks the negative terminal. The longer lead is commonly positive.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">High capacitance in small size</p>
            <p className="mt-1">
              Electrolytic capacitors can provide capacitance from uF into mF range in a compact size.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Best for bulk smoothing</p>
            <p className="mt-1">
              They are commonly used after rectifiers to reduce ripple in power supplies.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Reverse polarity danger</p>
            <p className="mt-1">
              Reverse polarity or over-voltage can cause heat, leakage, venting, or explosion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
