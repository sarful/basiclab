"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";

export function KnowledgeSection({
  supplyVoltage,
  totalResistance,
  current,
  showR3,
  sumDrop,
}: {
  supplyVoltage: number;
  totalResistance: number;
  current: number;
  showR3: boolean;
  sumDrop: number;
}) {
  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What Is Voltage Drop?</h2>
        <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Definition</p>
          <p className="mt-1">
            Voltage drop is the voltage difference across a component where
            electrical energy is used or dissipated.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
          <p className="font-semibold text-yellow-700">Main Idea</p>
          <p className="mt-1">
            In a series circuit, current stays the same, but voltage is divided
            based on resistance values.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Live Formula</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Current</p>
            <p className="mt-1">
              I = Vs / Rtotal = {supplyVoltage} / {formatResistance(totalResistance)} ={" "}
              {formatCurrent(current)}
            </p>
          </div>
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">Voltage Drop</p>
            <p className="mt-1">Vdrop = I × R</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
            <p className="font-semibold text-orange-700">Check</p>
            <p className="mt-1">
              V1 + V2 {showR3 ? "+ V3 " : ""}= {formatNumber(sumDrop, 2)}V ≈ {supplyVoltage}V
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
            <p className="font-semibold text-blue-700">Higher resistance means higher voltage drop</p>
            <p className="mt-1 text-sm text-slate-700">
              In a series circuit, the larger resistor gets a larger share of the supply voltage.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Current is the same</p>
            <p className="mt-1 text-sm text-slate-700">
              The same current flows through all components in a series circuit.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Common mistake</p>
            <p className="mt-1 text-sm text-slate-700">
              Voltage does not vanish. It is used by the load or dissipated as heat.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
