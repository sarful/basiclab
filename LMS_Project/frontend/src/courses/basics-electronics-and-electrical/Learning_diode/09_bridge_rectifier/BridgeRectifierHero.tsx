"use client";

export function BridgeRectifierHero() {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-black uppercase tracking-widest text-blue-700">
        Rectifier Circuit
      </p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">
        Bridge Rectifier - 4 Diode Simulation
      </h1>
      <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">
        Bridge rectifier: four diodes convert AC input into full-wave DC output.
        Two diodes conduct together in each half-cycle, so every cycle includes
        a 2 x Vf drop.
      </p>
    </section>
  );
}
