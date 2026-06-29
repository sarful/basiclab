"use client";

import { packages } from "./logic";

export function PowerRatingComparison({
  power,
  rating,
  onRatingChange,
}: {
  power: number;
  rating: number;
  onRatingChange: (value: number) => void;
}) {
  return (
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
              <div
                className="mx-auto rounded-full bg-amber-200 ring-2 ring-amber-600"
                style={{ width: item.size, height: item.size / 2 }}
              />
              <p className="mt-3 font-bold text-slate-900">{item.label}</p>
              <p
                className={`mt-1 text-xs font-semibold ${
                  overloaded ? "text-red-600" : safe ? "text-green-600" : "text-yellow-700"
                }`}
              >
                {overloaded ? "Burn risk" : safe ? "Recommended" : "Caution"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
