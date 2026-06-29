"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";

export function PowerFormulaCard({
  voltage,
  resistance,
  current,
  power,
  powerByI2R,
  powerByV2R,
}: {
  voltage: number;
  resistance: number;
  current: number;
  power: number;
  powerByI2R: number;
  powerByV2R: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Live Formula</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">P = V x I</p>
          <p className="mt-1">
            P = {voltage} x {formatCurrent(current)} = {formatNumber(power, 3)}W
          </p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">P = I^2R</p>
          <p className="mt-1">
            P = {formatNumber(current, 4)}^2 x {formatResistance(resistance)} ={" "}
            {formatNumber(powerByI2R, 3)}W
          </p>
        </div>
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">P = V^2/R</p>
          <p className="mt-1">
            P = {voltage}^2 / {formatResistance(resistance)} = {formatNumber(powerByV2R, 3)}W
          </p>
        </div>
      </div>
    </div>
  );
}
