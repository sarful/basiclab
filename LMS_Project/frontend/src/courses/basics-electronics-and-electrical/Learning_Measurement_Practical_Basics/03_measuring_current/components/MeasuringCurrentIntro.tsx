"use client";

const OMEGA = "\u03a9";

export default function MeasuringCurrentIntro() {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-orange-700">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        Measuring Current Simulation
      </div>
      <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
        Practice Safe Current Measurement
      </h2>
      <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
        Learn how to choose DCA, move the red lead to the correct current jack,
        and place the meter across an open circuit so current flows through the meter.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-700">
            Current Rule
          </p>
          <p className="mt-2 text-[15px] leading-6 text-orange-950">
            Current must flow through the meter, so the meter goes in series.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
            Small Current
          </p>
          <p className="mt-2 text-[15px] leading-6 text-emerald-950">
            Use COM + V{OMEGA}mA for small DCA ranges like 20mA and 200mA.
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-700">
            High Current
          </p>
          <p className="mt-2 text-[15px] leading-6 text-rose-950">
            Move the red lead to 10A only for high-current tests, then return it to V{OMEGA}mA.
          </p>
        </div>
      </div>
    </>
  );
}
