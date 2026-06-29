"use client";

export function ParallelCircuitDefinitionCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">
        What Is a Parallel Resistor Circuit?
      </h2>
      <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
        <p className="font-semibold text-purple-700">Definition</p>
        <p className="mt-1">
          A parallel resistor circuit connects multiple resistors across the same
          two supply nodes in separate current paths.
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Main Rule</p>
        <p className="mt-1">
          In a parallel circuit, each resistor has the same voltage, but current
          divides based on resistance.
        </p>
      </div>
    </div>
  );
}
