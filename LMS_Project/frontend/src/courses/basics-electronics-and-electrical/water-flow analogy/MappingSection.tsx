"use client";

function MapItem({ left, right }: { left: string; right: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
      {left} <span className="text-blue-600">&lt;-&gt;</span> {right}
    </div>
  );
}

export function MappingSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-[1rem] font-semibold tracking-tight text-blue-700">
        Simple mapping <span className="font-medium text-slate-500">(Electrical vs Water)</span>
      </h2>

      <div className="grid gap-3 text-sm font-bold md:grid-cols-4">
        <MapItem left="Battery" right="Pump" />
        <MapItem left="Wire" right="Pipe" />
        <MapItem left="Resistor" right="Narrow Pipe" />
        <MapItem left="Ammeter" right="Flow Meter" />
      </div>
    </section>
  );
}
