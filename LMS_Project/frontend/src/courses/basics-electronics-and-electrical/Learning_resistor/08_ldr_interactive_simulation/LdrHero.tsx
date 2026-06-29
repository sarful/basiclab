"use client";

export function LdrHero() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-yellow-50 via-white to-slate-50 p-5 shadow-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-yellow-700">
        Interactive Electronics Trainer
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        LDR Interactive Simulation
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Explore how an LDR changes resistance with light and controls a simple
        street-light response.
      </p>
    </div>
  );
}
