"use client";

const OMEGA = "\u03a9";

export default function MeasuringResistanceIntro() {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        Measuring Resistance Simulation
      </div>
      <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
        Practice Safe Resistance Measurement
      </h2>
      <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
        Learn how to switch to the ohms family, keep the meter unpowered, and
        place the probes across a resistor to read its value correctly.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">
            Ohms Rule
          </p>
          <p className="mt-2 text-[15px] leading-6 text-amber-950">
            Measure resistance across the component, not along the same node.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
            Black Lead
          </p>
          <p className="mt-2 text-[15px] leading-6 text-emerald-950">
            Keep the black lead in COM for resistance practice.
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">
            Red Lead
          </p>
          <p className="mt-2 text-[15px] leading-6 text-sky-950">
            Use V{OMEGA}mA for {OMEGA} ranges and never measure resistance on a live circuit.
          </p>
        </div>
      </div>
    </>
  );
}
