"use client";

import type { PhotodiodeState } from "./types";

export function LearningPanelSection({ state }: { state: PhotodiodeState }) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-black">Learning Notes</h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl bg-green-50 p-4 text-sm leading-6 text-green-900">
          <h3 className="font-black">1) Lux to Irradiance</h3>
          <p>Lux is a human-vision light unit. This app approximates visible light as <b>1 W/m2 about 120 lux</b>.</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 text-sm leading-6 text-green-900">
          <h3 className="font-black">2) Optical Power</h3>
          <p>Optical power depends on irradiance and photodiode active area. A larger area catches more light.</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 text-sm leading-6 text-green-900">
          <h3 className="font-black">3) Responsivity</h3>
          <p>Responsivity means how much current comes from light power. Unit: <b>A/W</b>.</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 text-sm leading-6 text-green-900">
          <h3 className="font-black">4) Output Voltage</h3>
          <p>Load resistor converts current to voltage: <b>Vout about I x R</b>. With the current settings, the model gives about <b>{state.outputVoltage.toFixed(2)}V</b>.</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-sm font-bold text-white">
        Current model: lux to W/m2 to optical power to photocurrent to load resistor voltage. It is educational, not a replacement for a datasheet model.
      </div>
    </section>
  );
}
