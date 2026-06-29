"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";

export function LdrLiveLogicCard({
  resistance,
  outputVoltage,
  current,
}: {
  resistance: number;
  outputVoltage: number;
  current: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Live Formula / Logic</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
          <p className="font-semibold text-yellow-700">LDR Resistance</p>
          <p className="mt-1 text-sm text-slate-700">
            Light up to resistance down. Light down to resistance up.
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            Rldr = {formatResistance(resistance)}
          </p>
        </div>
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Voltage Divider Output</p>
          <p className="mt-1 text-sm text-slate-700">
            Vout = Vs x Rldr / (Rfixed + Rldr)
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            Vout = {formatNumber(outputVoltage, 2)}V
          </p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Current</p>
          <p className="mt-1 text-sm text-slate-700">I = V / (Rldr + Rfixed)</p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            I = {formatCurrent(current)}
          </p>
        </div>
      </div>
    </div>
  );
}
