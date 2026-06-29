"use client";

export function FilterCircuitHero() {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-black uppercase tracking-widest text-blue-700">
        Rectifier Circuit
      </p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">
        Full-Wave Rectifier - Filter Circuit Simulation
      </h1>
      <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">
        Center-tap full-wave rectifier: two diodes alternate conduction, the capacitor filter reduces ripple, and the output becomes smoother DC. LED load visualization and capacitor filter logic are included.
      </p>
    </section>
  );
}
