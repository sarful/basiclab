"use client";

import { formatCurrent, formatNumber, formatResistance, packages } from "./logic";

export function KnowledgeSection({
  voltage,
  resistance,
  current,
  power,
  powerByI2R,
  powerByV2R,
  safetyMargin,
  recommendedLabel,
  rating,
  onRatingChange,
}: {
  voltage: number;
  resistance: number;
  current: number;
  power: number;
  powerByI2R: number;
  powerByV2R: number;
  safetyMargin: number;
  recommendedLabel: string;
  rating: number;
  onRatingChange: (value: number) => void;
}) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">What is Power Rating?</h2>
          <div className="rounded-2xl bg-orange-50 p-4 text-sm text-slate-700 ring-1 ring-orange-100">
            <p className="font-semibold text-orange-700">Definition</p>
            <p className="mt-1">Power rating is the maximum wattage a resistor can safely dissipate as heat.</p>
          </div>
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-slate-700 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Common Mistake</p>
            <p className="mt-1">A correct resistance value can still fail if the power rating is too small.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Live Formula</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">P = V × I</p>
              <p className="mt-1">P = {voltage} × {formatCurrent(current)} = {formatNumber(power, 3)}W</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
              <p className="font-semibold text-green-700">P = I²R</p>
              <p className="mt-1">P = {formatNumber(current, 4)}² × {formatResistance(resistance)} = {formatNumber(powerByI2R, 3)}W</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
              <p className="font-semibold text-purple-700">P = V²/R</p>
              <p className="mt-1">P = {voltage}² / {formatResistance(resistance)} = {formatNumber(powerByV2R, 3)}W</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Selection Guide</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
              <p className="font-semibold text-green-700">Safe Rule</p>
              <p className="mt-1">Use at least 2× the actual calculated power.</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
              <p className="font-semibold text-yellow-700">Safety Margin</p>
              <p className="mt-1">Selected rating is {formatNumber(safetyMargin, 2)}× the actual power.</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Recommended Wattage</p>
              <p className="mt-1">
                Choose <b>{recommendedLabel}</b> or higher.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Power Rating Comparison</h2>
        <div className="grid gap-4 md:grid-cols-6">
          {packages.map((item) => {
            const safe = item.watt >= power * 2;
            const overloaded = item.watt < power;
            return (
              <button
                key={item.watt}
                onClick={() => onRatingChange(item.watt)}
                className={`rounded-2xl border p-4 text-center ${
                  rating === item.watt
                    ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200"
                    : overloaded
                      ? "border-red-200 bg-red-50"
                      : safe
                        ? "border-green-200 bg-green-50"
                        : "border-yellow-200 bg-yellow-50"
                }`}
                type="button"
              >
                <div className="mx-auto rounded-full bg-amber-200 ring-2 ring-amber-600" style={{ width: item.size, height: item.size / 2 }} />
                <p className="mt-3 font-bold text-slate-900">{item.label}</p>
                <p className={`mt-1 text-xs font-semibold ${overloaded ? "text-red-600" : safe ? "text-green-600" : "text-yellow-700"}`}>
                  {overloaded ? "Burn risk" : safe ? "Recommended" : "Caution"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
