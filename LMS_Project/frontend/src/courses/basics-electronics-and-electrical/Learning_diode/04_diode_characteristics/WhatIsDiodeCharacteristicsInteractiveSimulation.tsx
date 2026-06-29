"use client";

import DiodeVIControlPanel from "./DiodeVIControlPanel";
import DiodeVIGraph from "./DiodeVIGraph";
import DiodeVIReadout from "./DiodeVIReadout";
import { ExplanationSection } from "./ExplanationSection";
import { useDiodeCharacteristicsSimulation } from "./useDiodeCharacteristicsSimulation";
import { WorkingView } from "./WorkingView";

export default function WhatIsDiodeCharacteristicsInteractiveSimulation() {
  const simulation = useDiodeCharacteristicsSimulation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="grid gap-5 p-5 lg:grid-cols-[360px_1fr]">
            <aside className="space-y-4">
              <DiodeVIControlPanel
                biasMode={simulation.bias}
                currentScale={simulation.currentScale}
                diodeMode={simulation.diodeMode}
                onBiasModeChange={simulation.setBias}
                onCurrentScaleChange={simulation.setCurrentScale}
                onDiodeModeChange={simulation.setDiodeMode}
                onReset={simulation.reset}
                onVoltageChange={simulation.setVoltage}
                voltage={simulation.voltage}
              />
              <ExplanationSection
                section="characteristics"
                bias={simulation.bias}
                voltage={simulation.voltage}
              />
            </aside>

            <section className="space-y-5">
              <DiodeVIGraph
                biasMode={simulation.bias}
                currentScale={simulation.currentScale}
                diodeMode={simulation.diodeMode}
                voltage={simulation.voltage}
              />

              <DiodeVIReadout
                biasMode={simulation.bias}
                currentScale={simulation.currentScale}
                diodeMode={simulation.diodeMode}
                voltage={simulation.voltage}
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 px-2">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Step 02
                  </p>

                  <h2 className="text-xl font-black text-slate-900">
                    Live Diode Working Circuit
                  </h2>
                </div>

                <WorkingView
                  bias={simulation.bias}
                  voltage={simulation.voltage}
                />
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
