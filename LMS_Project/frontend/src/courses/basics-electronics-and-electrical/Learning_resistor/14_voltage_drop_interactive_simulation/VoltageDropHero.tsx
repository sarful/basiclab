"use client";

export function VoltageDropHero() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5 shadow-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-blue-700">
        Interactive Electronics Trainer
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Voltage Drop Simulation
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Voltage drop means the supply voltage is shared across resistors in a series
        circuit.
      </p>
    </div>
  );
}
