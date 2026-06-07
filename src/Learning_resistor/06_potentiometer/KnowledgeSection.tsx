"use client";

import { formatCurrent, formatNumber, formatResistance } from "./logic";

export function KnowledgeSection({
  supplyVoltage,
  ratio,
  wiperVoltage,
  dividerCurrent,
  rheostatResistance,
  rheostatCurrent,
}: {
  supplyVoltage: number;
  ratio: number;
  wiperVoltage: number;
  dividerCurrent: number;
  rheostatResistance: number;
  rheostatCurrent: number;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What is Potentiometer?</h2>
        <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Definition</p>
          <p className="mt-1">A potentiometer is a three-terminal variable resistor. Moving the wiper changes output voltage or active resistance.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Live Calculation</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
            <p className="font-semibold text-blue-700">Voltage Divider Mode</p>
            <p className="mt-1">Vout = Vin × Wiper%</p>
            <p className="font-bold text-slate-900">Wiper Voltage = 0V + ({supplyVoltage} × {formatNumber(ratio, 2)}) = {formatNumber(wiperVoltage, 2)}V</p>
            <p className="mt-1 text-xs text-slate-600">Divider current stays Vin / Rtotal = {formatCurrent(dividerCurrent)}</p>
          </div>
          <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
            <p className="font-semibold text-yellow-700">Rheostat Mode</p>
            <p className="mt-1">Ractive = R1 = {formatResistance(rheostatResistance)}</p>
            <p className="font-bold text-slate-900">I = {formatCurrent(rheostatCurrent)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Application</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Volume Control</p>
            <p className="mt-1">Used to adjust audio signal level in radios, speakers, and amplifiers.</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
            <p className="font-semibold text-orange-700">Calibration</p>
            <p className="mt-1">Useful for tuning sensors and circuit references by adjusting the wiper.</p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Limitation</p>
            <p className="mt-1">Mechanical wear can happen, and it is not ideal for heavy power loads.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
