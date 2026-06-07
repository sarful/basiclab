"use client";

import { useEffect, useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { getGraphPoints, getPhotodiodeState, runSimulationTests } from "./logic";
import { LearningPanelSection } from "./LearningPanelSection";
import { PhotodiodeAnimationSection } from "./PhotodiodeAnimationSection";
import { PhotodiodeSymbolSection } from "./PhotodiodeSymbolSection";
import { SensorGraphSection } from "./SensorGraphSection";
import { UsesSection } from "./UsesSection";
import { WorkingPrincipleSection } from "./WorkingPrincipleSection";

export default function WhatIsPhotodiodeInteractiveSimulation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [lux, setLux] = useState(1000);
  const [reverseVoltage, setReverseVoltage] = useState(5);
  const [loadKOhm, setLoadKOhm] = useState(100);
  const [responsivityAW, setResponsivityAW] = useState(0.45);
  const [activeAreaMM2, setActiveAreaMM2] = useState(7.5);
  const [isReverseBias, setIsReverseBias] = useState(true);

  useEffect(() => {
    runSimulationTests();
  }, []);

  const state = useMemo(
    () =>
      getPhotodiodeState(
        lux,
        reverseVoltage,
        loadKOhm,
        responsivityAW,
        activeAreaMM2,
        isReverseBias,
      ),
    [lux, reverseVoltage, loadKOhm, responsivityAW, activeAreaMM2, isReverseBias],
  );
  const graphPoints = useMemo(
    () =>
      getGraphPoints(
        reverseVoltage,
        loadKOhm,
        responsivityAW,
        activeAreaMM2,
        isReverseBias,
      ),
    [reverseVoltage, loadKOhm, responsivityAW, activeAreaMM2, isReverseBias],
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-green-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
        <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-green-700">
                Electronics Learning
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                Photodiode
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Real sensor simulator: lux input to optical power, photocurrent, load
                resistor output voltage, and graph visualization.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-4 text-white sm:p-5">
              <p className="text-xs font-bold text-slate-300">Key Idea</p>
              <p className="mt-2 text-xl font-black sm:text-2xl">Lux up means photocurrent up means Vout up</p>
            </div>
          </div>
        </section>

        <ControlPanelSection
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          resetKey={resetKey}
          setResetKey={setResetKey}
          lux={lux}
          setLux={setLux}
          reverseVoltage={reverseVoltage}
          setReverseVoltage={setReverseVoltage}
          loadKOhm={loadKOhm}
          setLoadKOhm={setLoadKOhm}
          responsivityAW={responsivityAW}
          setResponsivityAW={setResponsivityAW}
          activeAreaMM2={activeAreaMM2}
          setActiveAreaMM2={setActiveAreaMM2}
          isReverseBias={isReverseBias}
          setIsReverseBias={setIsReverseBias}
          state={state}
        />

        <PhotodiodeAnimationSection
          isPlaying={isPlaying}
          resetKey={resetKey}
          lux={lux}
          state={state}
        />
        <SensorGraphSection
          points={graphPoints}
          currentLux={state.lux}
          currentCurrentUA={state.photocurrentUA}
        />
        <LearningPanelSection state={state} />

        <div className="grid gap-5 lg:grid-cols-2">
          <PhotodiodeSymbolSection />
          <WorkingPrincipleSection state={state} />
        </div>

        <UsesSection />
      </div>
    </main>
  );
}
