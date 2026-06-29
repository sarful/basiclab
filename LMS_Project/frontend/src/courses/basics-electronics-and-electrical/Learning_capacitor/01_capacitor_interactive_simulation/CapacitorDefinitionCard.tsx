"use client";

export function CapacitorDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">What is Capacitor?</h2>
      <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
        <p className="font-semibold text-purple-700">Definition</p>
        <p className="mt-1">
          A capacitor is an electronic component that stores electrical charge. It is
          usually made from two metal plates separated by a dielectric material.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Main Rule</p>
        <p className="mt-1">
          Higher capacitance means more stored charge at the same voltage. Formula:
          Q = C x V.
        </p>
      </div>
    </div>
  );
}
