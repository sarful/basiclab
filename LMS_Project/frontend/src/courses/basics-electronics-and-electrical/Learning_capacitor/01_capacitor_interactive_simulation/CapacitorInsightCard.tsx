"use client";

export function CapacitorInsightCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Capacitor blocks steady DC</p>
          <p className="mt-1">Once fully charged, an ideal capacitor stops steady DC current.</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Current starts high</p>
          <p className="mt-1">
            At the beginning of charging the current is highest, then it falls as
            capacitor voltage rises.
          </p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Energy is stored in field</p>
          <p className="mt-1">The energy is stored in the electric field between the plates.</p>
        </div>
      </div>
    </div>
  );
}
