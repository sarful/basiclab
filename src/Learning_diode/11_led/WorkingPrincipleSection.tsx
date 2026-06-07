"use client";

import type { LedState } from "./types";

export function WorkingPrincipleSection({ state }: { state: LedState }) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-black">Working Principle</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
        An LED works in forward bias. When the anode is positive and the cathode is
        negative, current flows. Electron-hole recombination inside the junction
        produces light energy.
      </p>
      <div
        className={`mt-4 rounded-2xl p-4 text-sm font-bold ${
          state.isDamaged ? "bg-red-50 text-red-800" : "bg-yellow-50 text-yellow-800"
        }`}
      >
        Without a current-limiting resistor, too much applied voltage can damage the
        LED. Turn the resistor OFF and raise the voltage to demonstrate the risk.
      </div>
    </section>
  );
}
