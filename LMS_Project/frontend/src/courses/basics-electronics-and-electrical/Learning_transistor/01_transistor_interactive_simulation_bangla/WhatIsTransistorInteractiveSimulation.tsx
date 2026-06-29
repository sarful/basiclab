"use client";

import { useState } from "react";

import TransistorAnalogy from "./analogy/Transistor_Analogy";
import type { Mode } from "./analogy/types";
import CircuitVisual from "./CircuitVisual";

export default function WhatIsTransistorInteractiveSimulation() {
  const [controlSignal, setControlSignal] = useState(50);
  const [mode, setMode] = useState<Mode>("ON");
  const switchOn = mode === "ON" && controlSignal > 0;
  const baseVoltage = 9;
  const baseResistance = Math.max(1200, 12000 - controlSignal * 100);
  const loadResistance = 300;
  const gain = 80 + Math.round(controlSignal * 0.6);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6fbf7] p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-700 sm:text-xs sm:tracking-[0.32em]">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-3 text-2xl font-black text-slate-900 sm:text-4xl">
            What is a Transistor
          </h1>
          {/* <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            This lesson uses only the water-tap analogy. The left side gives the
            controls and concept mapping, and the right side shows the analogy
            animation and transistor behavior.
          </p> */}
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <TransistorAnalogy
              controlSignal={controlSignal}
              mode={mode}
              onControlSignalChange={setControlSignal}
              onModeChange={setMode}
              panelOnly
              hidePageChrome
            />
          </div>
          <div>
            <div className="space-y-6">
              <TransistorAnalogy
                controlSignal={controlSignal}
                mode={mode}
                onControlSignalChange={setControlSignal}
                onModeChange={setMode}
                visualOnly
                hidePageChrome
              />
              <CircuitVisual
                baseVoltage={baseVoltage}
                baseResistance={baseResistance}
                loadResistance={loadResistance}
                switchOn={switchOn}
                gain={gain}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
