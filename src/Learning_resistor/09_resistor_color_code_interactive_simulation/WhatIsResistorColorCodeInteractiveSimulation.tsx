"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { digitColors, formatResistance, getDigit, getMultiplier, getTemp, getTolerance } from "./logic";
import { KnowledgeSection } from "./KnowledgeSection";
import { ResistorSvg } from "./ResistorSvg";
import type { BandMode } from "./types";

export default function WhatIsResistorColorCodeInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  const [mode, setMode] = useState<BandMode>(4);
  const [band1, setBand1] = useState("Brown");
  const [band2, setBand2] = useState("Black");
  const [band3, setBand3] = useState("Red");
  const [multiplier, setMultiplier] = useState("Brown");
  const [tolerance, setTolerance] = useState("Gold");
  const [temp, setTemp] = useState("Brown");

  const d1 = getDigit(band1);
  const d2 = getDigit(band2);
  const d3 = getDigit(band3);
  const mult = getMultiplier(multiplier);
  const tol = getTolerance(tolerance);
  const tc = getTemp(temp);

  const significant = mode === 4 ? d1.value * 10 + d2.value : d1.value * 100 + d2.value * 10 + d3.value;
  const resistance = significant * mult.multiplier;
  const minResistance = resistance * (1 - tol.tolerance / 100);
  const maxResistance = resistance * (1 + tol.tolerance / 100);

  const bands = useMemo(() => {
    const base = [
      { label: "Band 1", color: d1.hex, name: d1.name, value: `Digit = ${d1.value}` },
      { label: "Band 2", color: d2.hex, name: d2.name, value: `Digit = ${d2.value}` },
    ];

    if (mode >= 5) {
      base.push({ label: "Band 3", color: d3.hex, name: d3.name, value: `Digit = ${d3.value}` });
    }

    base.push({ label: mode === 4 ? "Band 3" : "Band 4", color: mult.hex, name: mult.name, value: `Multiplier = ×${mult.multiplier}` });
    base.push({ label: mode === 4 ? "Band 4" : "Band 5", color: tol.hex, name: tol.name, value: `Tolerance = ±${tol.tolerance}%` });

    if (mode === 6) {
      base.push({ label: "Band 6", color: tc.hex, name: tc.name, value: `Temp = ${tc.ppm} ppm/°C` });
    }

    return base;
  }, [mode, d1, d2, d3, mult, tol, tc]);

  const formulaText = mode === 4 ? `${d1.value}${d2.value} × ${mult.multiplier} = ${formatResistance(resistance)}` : `${d1.value}${d2.value}${d3.value} × ${mult.multiplier} = ${formatResistance(resistance)}`;

  function applyPreset(value: string) {
    if (value === "220") {
      setMode(4);
      setBand1("Red");
      setBand2("Red");
      setMultiplier("Brown");
      setTolerance("Gold");
    }
    if (value === "1k") {
      setMode(4);
      setBand1("Brown");
      setBand2("Black");
      setMultiplier("Red");
      setTolerance("Gold");
    }
    if (value === "10k") {
      setMode(4);
      setBand1("Brown");
      setBand2("Black");
      setMultiplier("Orange");
      setTolerance("Gold");
    }
    if (value === "precision") {
      setMode(5);
      setBand1("Brown");
      setBand2("Black");
      setBand3("Black");
      setMultiplier("Brown");
      setTolerance("Brown");
    }
  }

  return (
    <div className={embedded ? "text-slate-800" : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"}>
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-amber-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Resistor Color Code Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Learn to decode resistor bands for value, tolerance, and temperature coefficient.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              mode={mode}
              band1={band1}
              band2={band2}
              band3={band3}
              multiplier={multiplier}
              tolerance={tolerance}
              temp={temp}
              onModeChange={setMode}
              onBand1Change={setBand1}
              onBand2Change={setBand2}
              onBand3Change={setBand3}
              onMultiplierChange={setMultiplier}
              onToleranceChange={setTolerance}
              onTempChange={setTemp}
              onPresetApply={applyPreset}
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Resistance</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{formatResistance(resistance)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tolerance</p>
                <p className="mt-2 text-3xl font-bold text-orange-600">±{tol.tolerance}%</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Min Value</p>
                <p className="mt-2 text-xl font-bold text-green-600">{formatResistance(minResistance)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Max Value</p>
                <p className="mt-2 text-xl font-bold text-red-600">{formatResistance(maxResistance)}</p>
              </div>
            </div>

            <ResistorSvg mode={mode} bands={bands} />

            <KnowledgeSection mode={mode} formulaText={formulaText} minResistance={minResistance} maxResistance={maxResistance} tempPpm={tc.ppm} firstDigitValue={d1.value} />
          </div>
        </div>
      </div>
    </div>
  );
}
