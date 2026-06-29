"use client";

export function FixedResistorHero() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 shadow-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-blue-600">
        Interactive Electronics Trainer
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Fixed Resistor - Interactive Simulation
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Explore how fixed resistor value, tolerance, power rating, and type
        affect circuit behavior.
      </p>
    </div>
  );
}
