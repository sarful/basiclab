"use client";

export function PhotodiodeHero() {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-green-700">
            Electronics Learning
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Photodiode
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Real sensor simulator: lux input to optical power, photocurrent, load
            resistor output voltage, and graph visualization.
          </p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-4 text-white sm:p-5">
          <p className="text-xs font-bold text-slate-300">Key Idea</p>
          <p className="mt-2 text-xl font-black sm:text-2xl">
            Lux up means photocurrent up means Vout up
          </p>
        </div>
      </div>
    </section>
  );
}
