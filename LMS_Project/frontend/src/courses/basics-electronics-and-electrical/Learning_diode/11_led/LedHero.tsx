"use client";

export function LedHero() {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-yellow-600">
            Electronics Learning
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            LED
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            An LED, or Light Emitting Diode, gives light when current flows in
            forward bias. At higher voltage, the lesson can also demonstrate why a
            resistor is needed for protection.
          </p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-4 text-white sm:p-5">
          <p className="text-xs font-bold text-slate-300">Key Idea</p>
          <p className="mt-2 text-xl font-black sm:text-2xl">
            When applied voltage is at least Vf, the LED glows. Too much voltage is dangerous.
          </p>
        </div>
      </div>
    </section>
  );
}
