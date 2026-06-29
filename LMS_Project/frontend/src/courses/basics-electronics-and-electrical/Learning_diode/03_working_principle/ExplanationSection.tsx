"use client";

import { getWorkingState } from "./logic";
import type { BiasMode, Section } from "./types";

export function ExplanationSection({
  section,
  bias,
  voltage,
}: {
  section: Section;
  bias: BiasMode;
  voltage: number;
}) {
  const workingState = getWorkingState(bias, voltage);

  if (section === "construction") {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-emerald-700">
              Teaching Support
            </p>
            <h3 className="mt-1 text-xl font-black text-slate-950">Construction Basics</h3>
          </div>
          <span className="self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-700">
            Structure
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Quick Check
            </p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              <li>The diode is built from one P-type block and one N-type block.</li>
              <li>The P-side terminal is called the anode.</li>
              <li>The N-side terminal is called the cathode.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Key Idea
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Once the P-type and N-type materials are placed together, the junction boundary becomes the active area that controls one-way conduction.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (section === "formation") {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-emerald-700">
              Teaching Support
            </p>
            <h3 className="mt-1 text-xl font-black text-slate-950">Barrier Formation</h3>
          </div>
          <span className="self-start rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-800">
            Junction
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Sequence
            </p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              <li>Electrons diffuse from the N-side toward the P-side.</li>
              <li>Holes diffuse from the P-side toward the N-side.</li>
              <li>Near the boundary they recombine and remove free carriers from the center.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Result
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Fixed ions remain behind, creating the depletion layer and the internal electric field that resists further uncontrolled carrier motion.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-emerald-700">
            Teaching Support
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-950">
            {bias === "forward" ? "Forward Bias Behavior" : "Reverse Bias Behavior"}
          </h3>
        </div>
        <span
          className={`self-start rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${
            bias === "forward"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {bias === "forward" ? "Conduction" : "Blocking"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Live Readout
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
            Voltage: {voltage.toFixed(1)}V
          </p>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-700">
            Conduction level: {(workingState.intensity * 100).toFixed(0)}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Explanation
          </p>
          {bias === "forward" ? (
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              <li>The battery positive terminal is connected to the anode and the negative terminal is connected to the cathode.</li>
              <li>When the applied voltage rises above about 0.7V, the barrier reduces and current begins to flow.</li>
              <li>The higher the forward voltage, the stronger the conduction through the circuit load.</li>
            </ul>
          ) : (
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              <li>The battery polarity is reversed, so the cathode sees the positive side and the anode sees the negative side.</li>
              <li>The depletion barrier widens, which blocks normal current flow.</li>
              <li>Even at {voltage.toFixed(1)}V, the diode remains off in this simplified learning model.</li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
