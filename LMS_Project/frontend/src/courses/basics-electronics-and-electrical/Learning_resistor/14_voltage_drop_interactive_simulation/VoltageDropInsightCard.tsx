"use client";

export function VoltageDropInsightCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">
            Higher resistance means higher voltage drop
          </p>
          <p className="mt-1 text-sm text-slate-700">
            In a series circuit, the larger resistor gets a larger share of the supply
            voltage.
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
  );
}
