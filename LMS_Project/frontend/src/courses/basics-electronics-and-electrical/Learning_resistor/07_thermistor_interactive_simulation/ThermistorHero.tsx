"use client";

export function ThermistorHero() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-red-50 via-white to-blue-50 p-5 shadow-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-red-600">
        Interactive Electronics Trainer
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Thermistor Interactive Simulation
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Explore how thermistors respond to temperature and how that changes
        resistance and current.
      </p>
    </div>
  );
}
