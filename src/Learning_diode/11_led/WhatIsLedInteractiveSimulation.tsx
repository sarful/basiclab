"use client";

import { useEffect, useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { getLedState, runSimulationTests } from "./logic";
import { LedAnimationSection } from "./LedAnimationSection";
import { LedSymbolSection } from "./LedSymbolSection";
import { UsesSection } from "./UsesSection";
import { WorkingPrincipleSection } from "./WorkingPrincipleSection";

export default function WhatIsLedInteractiveSimulation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [voltage, setVoltage] = useState(3.2);
  const [forwardVoltage, setForwardVoltage] = useState(2.0);
  const [hasResistor, setHasResistor] = useState(true);

  useEffect(() => {
    runSimulationTests();
  }, []);

  const state = useMemo(
    () => getLedState(voltage, forwardVoltage, hasResistor),
    [voltage, forwardVoltage, hasResistor],
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-yellow-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
        <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-yellow-600">
                Electronics Learning
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">LED</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                An LED, or Light Emitting Diode, gives light when current flows in
                forward bias. At higher voltage, the lesson can also demonstrate why a
                resistor is needed for protection.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-4 text-white sm:p-5">
              <p className="text-xs font-bold text-slate-300">Key Idea</p>
              <p className="mt-2 text-xl font-black sm:text-2xl">
                When applied voltage is at least Vf, the LED glows. Too much voltage is dangerous.
              </p>
            </div>
          </div>
        </section>

        <ControlPanelSection
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          resetKey={resetKey}
          setResetKey={setResetKey}
          voltage={voltage}
          setVoltage={setVoltage}
          forwardVoltage={forwardVoltage}
          setForwardVoltage={setForwardVoltage}
          hasResistor={hasResistor}
          setHasResistor={setHasResistor}
          state={state}
        />

        <LedAnimationSection
          isPlaying={isPlaying}
          resetKey={resetKey}
          voltage={voltage}
          forwardVoltage={forwardVoltage}
          state={state}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <LedSymbolSection />
          <WorkingPrincipleSection state={state} />
        </div>

        <UsesSection />
      </div>
    </main>
  );
}
