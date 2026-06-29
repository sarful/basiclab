"use client";

export default function BasicCircuitSafetyIntro() {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-rose-700">
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        Basic Circuit Safety Simulation
      </div>
      <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
        Practice Basic Circuit Safety
      </h2>
      <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
        Learn the safe order before touching a circuit: inspect the source, confirm the correct meter family, and avoid placing probes into an energized path blindly.
      </p>
    </>
  );
}
