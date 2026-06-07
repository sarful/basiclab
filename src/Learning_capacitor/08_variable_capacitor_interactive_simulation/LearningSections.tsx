import { EffectBar } from "./EffectBar";

type LearningSectionsProps = {
  overlapRatio: number;
  capacitance: number;
  minCapacitance: number;
  maxCapacitance: number;
  tuningPercent: number;
};

export function LearningSections({
  overlapRatio,
  capacitance,
  minCapacitance,
  maxCapacitance,
  tuningPercent,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
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

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What is a Variable Capacitor?</h2>
        <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Definition</p>
          <p className="mt-1">
            A variable capacitor is a capacitor whose capacitance can be adjusted mechanically.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Working Principle</p>
          <p className="mt-1">
            A movable rotor changes overlap with fixed stator plates. Changing the effective area changes capacitance.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">More overlap, more C</p>
            <p className="mt-1">
              More plate overlap increases the effective field area, so capacitance rises.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Used in radio tuning</p>
            <p className="mt-1">
              A variable capacitor shifts LC resonance so a radio can tune to a desired station.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Usually air dielectric</p>
            <p className="mt-1">
              Traditional variable capacitors often use air between the plates, which keeps loss low.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
