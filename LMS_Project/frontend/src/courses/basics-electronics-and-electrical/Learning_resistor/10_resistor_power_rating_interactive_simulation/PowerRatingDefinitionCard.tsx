"use client";

export function PowerRatingDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">What is Power Rating?</h2>
      <div className="rounded-2xl bg-orange-50 p-4 text-sm text-slate-700 ring-1 ring-orange-100">
        <p className="font-semibold text-orange-700">Definition</p>
        <p className="mt-1">
          Power rating is the maximum wattage a resistor can safely dissipate as heat.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-slate-700 ring-1 ring-red-100">
        <p className="font-semibold text-red-700">Common Mistake</p>
        <p className="mt-1">
          A correct resistance value can still fail if the power rating is too small.
        </p>
      </div>
    </div>
  );
}
