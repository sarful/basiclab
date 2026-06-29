"use client";

export function ResistorColorCodeHero() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-amber-50 via-white to-blue-50 p-5 shadow-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
        Interactive Electronics Trainer
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Resistor Color Code Interactive Simulation
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Learn to decode resistor bands for value, tolerance, and temperature coefficient.
      </p>
    </div>
  );
}
