"use client";

export function ParallelResistorHero() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-purple-700">
        Interactive Electronics Trainer
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Parallel Resistor Circuit Simulation
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        In a parallel circuit, resistors are connected in separate branches. Voltage
        stays the same, current divides, and equivalent resistance decreases.
      </p>
    </div>
  );
}
