"use client";

import type { PhotodiodeState } from "./types";

export function WorkingPrincipleSection({ state }: { state: PhotodiodeState }) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-black">Working Principle</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
        A photodiode works as a light sensor in reverse bias. When light falls on the
        junction, electron-hole pairs are created and reverse photocurrent is generated.
        This model estimates irradiance, optical power, responsivity, and load resistor output.
      </p>
      <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">
        Dark current: {state.darkCurrentUA.toFixed(2)}uA | Irradiance: {state.irradianceWM2.toFixed(2)} W/m2 | Output: {state.outputVoltage.toFixed(2)}V
      </div>
    </section>
  );
}
