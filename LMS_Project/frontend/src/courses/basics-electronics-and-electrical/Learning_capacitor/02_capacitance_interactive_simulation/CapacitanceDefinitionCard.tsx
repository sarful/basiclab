"use client";

export function CapacitanceDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">What is Capacitance?</h2>
      <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
        <p className="font-semibold text-purple-700">Definition</p>
        <p className="mt-1">
          Capacitance is the ability of a capacitor to store charge. The more charge
          it can store per volt, the higher the capacitance.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Unit</p>
        <p className="mt-1">
          The SI unit of capacitance is the farad. One farad means one coulomb per volt.
        </p>
      </div>
    </div>
  );
}
