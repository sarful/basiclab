"use client";

import ClipperCircuitCanvas from "./ClipperCircuitCanvas";
import ClipperCircuitControlPanel from "./ClipperCircuitControlPanel";
import ClipperTimeCursorSection from "./ClipperTimeCursorSection";
import { useClipperSimulation } from "./useClipperSimulation";

export default function WhatIsClipperCircuitInteractiveSimulation() {
  const simulation = useClipperSimulation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
                Lesson 14
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Positive and Negative Diode Clipping Circuits
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Compare how diode orientation clips either the positive peaks or
                the negative peaks of an AC signal while the resistor keeps the
                circuit current under control.
              </p>
            </div>
            <span className="self-start rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
              {simulation.state.focusLabel}
            </span>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <ClipperCircuitControlPanel
            clipLevel={simulation.clipLevel}
            flowMode={simulation.flowMode}
            inputAmplitude={simulation.inputAmplitude}
            mode={simulation.mode}
            onClipLevelChange={simulation.setClipLevel}
            onFlowModeChange={simulation.setFlowMode}
            onInputAmplitudeChange={simulation.setInputAmplitude}
            onModeChange={simulation.setMode}
            onReset={simulation.reset}
            onResistorValueChange={simulation.setResistorValue}
            onShowDebugDotsChange={simulation.setShowDebugDots}
            resistorValue={simulation.resistorValue}
            state={simulation.state}
            showDebugDots={simulation.showDebugDots}
          />

          <div className="space-y-5">
            <ClipperCircuitCanvas
              flowMode={simulation.flowMode}
              mode={simulation.mode}
              showDebugDots={simulation.showDebugDots}
              state={simulation.state}
            />
            <ClipperTimeCursorSection
              autoRun={simulation.autoRun}
              mode={simulation.mode}
              onAutoRunToggle={() => simulation.setAutoRun((value) => !value)}
              onTimeCursorChange={simulation.setTimeCursor}
              state={simulation.state}
              timeCursor={simulation.timeCursor}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
