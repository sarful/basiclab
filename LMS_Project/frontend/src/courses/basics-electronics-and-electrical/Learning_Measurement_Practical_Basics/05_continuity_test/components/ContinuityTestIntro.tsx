"use client";

const OMEGA = "\u03a9";

export default function ContinuityTestIntro() {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Continuity Test Simulation
      </div>
      <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
        Practice Continuity Testing
      </h2>
      <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
        Learn how to switch to the diode / continuity-style function, keep the
        circuit unpowered, and check whether a path is electrically continuous.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
            Continuity Rule
          </p>
          <p className="mt-2 text-[15px] leading-6 text-emerald-950">
            Touch one probe to each test point to see whether the path is closed.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">
            Meter Setup
          </p>
          <p className="mt-2 text-[15px] leading-6 text-slate-950">
            Use COM + V{OMEGA}mA with the diode / continuity-style function.
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-700">
            Power Safety
          </p>
          <p className="mt-2 text-[15px] leading-6 text-rose-950">
            Power must be off before testing continuity on wires, fuses, or contacts.
          </p>
        </div>
      </div>
    </>
  );
}
