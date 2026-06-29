"use client";

export function HalfWaveRectifierHero() {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-black uppercase tracking-widest text-green-700">
        Rectifier Circuit
      </p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">
        Half-Wave Rectifier: Real Diode Switching
      </h1>
      <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">
        Industrial behavior model: diode forward drop, reverse leakage, reverse
        recovery, LED glow intensity, overcurrent, and LED blowing risk.
      </p>
    </section>
  );
}
