"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";

export function KnowledgeSection({
  resistance,
  outputVoltage,
  current,
  voltage,
}: {
  resistance: number;
  outputVoltage: number;
  current: number;
  voltage: number;
}) {
  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What is LDR?</h2>
        <div className="rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
          <p className="font-semibold text-yellow-700">Definition</p>
          <p className="mt-1">An LDR or Light Dependent Resistor changes its resistance according to light intensity.</p>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Main Idea</p>
          <p className="mt-1">In bright light the resistance becomes low, and in darkness the resistance becomes very high.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Applications</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Automatic Street Light</p>
            <p className="mt-1">Used to switch street lights on automatically when the environment becomes dark.</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
            <p className="font-semibold text-orange-700">Light Sensor Module</p>
            <p className="mt-1">Useful in light detection, brightness control, and alarm systems.</p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Limitation</p>
            <p className="mt-1">Response is slower and precision is lower, so it is not ideal for high-speed sensing.</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Live Formula / Logic</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
            <p className="font-semibold text-yellow-700">LDR Resistance</p>
            <p className="mt-1 text-sm text-slate-700">Light ↑ → Rldr ↓ | Light ↓ → Rldr ↑</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Rldr = {formatResistance(resistance)}</p>
          </div>
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">Voltage Divider Output</p>
            <p className="mt-1 text-sm text-slate-700">Vout = Vs × Rldr / (Rfixed + Rldr)</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Vout = {formatNumber(outputVoltage, 2)}V</p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Current</p>
            <p className="mt-1 text-sm text-slate-700">I = V / (Rldr + Rfixed)</p>
            <p className="mt-1 text-sm font-bold text-slate-900">I = {formatCurrent(current)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
