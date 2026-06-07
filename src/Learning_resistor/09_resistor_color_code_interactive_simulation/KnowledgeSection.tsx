"use client";

import { digitColors, formatResistance, multiplierColors } from "./logic";
import type { BandMode } from "./types";

export function KnowledgeSection({
  mode,
  formulaText,
  minResistance,
  maxResistance,
  tempPpm,
  firstDigitValue,
}: {
  mode: BandMode;
  formulaText: string;
  minResistance: number;
  maxResistance: number;
  tempPpm: number;
  firstDigitValue: number;
}) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Live Formula</h2>
          <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
            <p className="font-semibold text-blue-700">Calculation</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{formulaText}</p>
            <p className="mt-2">
              Allowed range: {formatResistance(minResistance)} → {formatResistance(maxResistance)}
            </p>
            {mode === 6 && <p className="mt-1">Temperature coefficient: {tempPpm} ppm/°C</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">How to Read</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
              <p className="font-semibold text-green-700">Step 1</p>
              <p>The first two or three bands are the significant digits.</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
              <p className="font-semibold text-yellow-700">Step 2</p>
              <p>The multiplier band sets the decimal scale or number of zeros.</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
              <p className="font-semibold text-red-700">Step 3</p>
              <p>The tolerance band shows how much the real value may vary from nominal.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Common Mistake Warning</h2>
          <div className={`rounded-2xl p-4 text-sm ring-1 ${firstDigitValue === 0 ? "bg-red-50 text-red-700 ring-red-100" : "bg-green-50 text-green-700 ring-green-100"}`}>
            <p className="font-bold">{firstDigitValue === 0 ? "Invalid first band" : "Band selection looks valid"}</p>
            <p className="mt-1">
              {firstDigitValue === 0
                ? "The first digit band should not be black because a leading zero causes confusion."
                : "The first band is non-zero, so the leading value is readable."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Color to Number Mapping Table</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-700">
                <th className="p-3">Color</th>
                <th className="p-3">Digit</th>
                <th className="p-3">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {digitColors.map((color) => {
                const multItem = multiplierColors.find((item) => item.name === color.name);
                return (
                  <tr key={color.name} className="border-t transition hover:bg-blue-50">
                    <td className="p-3 font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                        {color.name}
                      </span>
                    </td>
                    <td className="p-3">{color.value}</td>
                    <td className="p-3">{multItem ? `×${multItem.multiplier}` : "—"}</td>
                  </tr>
                );
              })}
              <tr className="border-t transition hover:bg-blue-50">
                <td className="p-3 font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full border border-slate-300 bg-[#d4af37]" />
                    Gold
                  </span>
                </td>
                <td className="p-3">—</td>
                <td className="p-3">×0.1</td>
              </tr>
              <tr className="border-t transition hover:bg-blue-50">
                <td className="p-3 font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full border border-slate-300 bg-[#c0c0c0]" />
                    Silver
                  </span>
                </td>
                <td className="p-3">—</td>
                <td className="p-3">×0.01</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
