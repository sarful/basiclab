import { EffectBar } from "./EffectBar";
import type { DielectricOption } from "./types";

type LearningSectionsProps = {
  filterEffect: number;
  safePercent: number;
  stabilityPercent: number;
  dielectric: DielectricOption;
};

export function LearningSections({
  filterEffect,
  safePercent,
  stabilityPercent,
  dielectric,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
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

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What is a Ceramic Capacitor?</h2>
        <div className="rounded-2xl bg-orange-50 p-4 text-sm text-slate-700 ring-1 ring-orange-100">
          <p className="font-semibold text-orange-700">Definition</p>
          <p className="mt-1">
            A ceramic capacitor uses ceramic as its dielectric material. It is small,
            affordable, non-polarized, and useful at high frequency.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Code Reading</p>
          <p className="mt-1">
            In the 3-digit code, the first two digits are the base number and the last digit is the number of zeros in pF.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">No polarity</p>
            <p className="mt-1">
              Ceramic capacitors usually have no plus/minus polarity, so they can be placed either way.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Good for noise filtering</p>
            <p className="mt-1">
              A 100 nF ceramic capacitor is very common for bypassing high-frequency power-line noise.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Respect voltage rating</p>
            <p className="mt-1">
              Running near or above the rated voltage can cause heat, leakage, or failure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
