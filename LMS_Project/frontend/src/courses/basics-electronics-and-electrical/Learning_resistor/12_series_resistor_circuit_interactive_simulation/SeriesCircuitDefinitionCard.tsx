"use client";

export function SeriesCircuitDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">What Is a Series Resistor Circuit?</h2>
      <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Definition</p>
        <p className="mt-1">
          A series resistor circuit connects resistors one after another in a single
          current path.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
        <p className="font-semibold text-yellow-700">Main Rule</p>
        <p className="mt-1">
          In a series circuit, total resistance equals the sum of all resistor values.
        </p>
      </div>
    </div>
  );
}
