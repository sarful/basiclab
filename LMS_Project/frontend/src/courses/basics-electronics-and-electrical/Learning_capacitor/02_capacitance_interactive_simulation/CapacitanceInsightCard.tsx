"use client";

export function CapacitanceInsightCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">More C means more charge</p>
          <p className="mt-1">At the same voltage, a larger capacitance stores more charge.</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Plate area matters</p>
          <p className="mt-1">
            Larger plates support more separated charge, which raises capacitance.
          </p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Distance reduces C</p>
          <p className="mt-1">
            When the plates move farther apart, field coupling drops and capacitance falls.
          </p>
        </div>
      </div>
    </div>
  );
}
