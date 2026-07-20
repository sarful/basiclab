"use client";

import { getCharacteristicPoint, getWorkingState } from "./logic";
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
  const working = getWorkingState(bias, voltage);
  const chart = getCharacteristicPoint(voltage);

  if (section === "characteristics") {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-xl font-bold text-slate-900">Characteristics</h2>
        <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
          <li>Below about 0.7V, the forward-biased diode still blocks most current.</li>
          <li>After the threshold, current rises quickly with only a small voltage increase.</li>
          <li>The highlighted point marks the current voltage and current on the VI graph.</li>
          <li>
            Current sample: {voltage.toFixed(1)}V and approximately{" "}
            {chart.currentMA.toFixed(1)}mA.
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      {bias === "forward" ? (
        <>
          <h2 className="text-xl font-bold text-slate-900">Working: Forward Bias</h2>
          <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
            <li>The source positive terminal drives the diode from anode to cathode.</li>
            <li>After about 0.7V, the barrier shrinks and current begins to flow.</li>
            <li>Current voltage: {voltage.toFixed(1)}V</li>
            <li>Conduction level: {(working.intensity * 100).toFixed(0)}%</li>
            <li>When current flows, the diode path becomes active and the load turns on.</li>
          </ul>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-slate-900">Working: Reverse Bias</h2>
          <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
            <li>The source polarity is reversed across the diode.</li>
            <li>The depletion barrier grows and blocks the main current path.</li>
            <li>At {voltage.toFixed(1)}V reverse bias, conduction stays effectively off.</li>
          </ul>
        </>
      )}
    </div>
  );
}
