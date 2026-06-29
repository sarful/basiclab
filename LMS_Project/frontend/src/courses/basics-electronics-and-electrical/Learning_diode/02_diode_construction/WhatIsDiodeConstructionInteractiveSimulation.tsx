"use client";

import { DiodeConstructionDiagram } from "./ConstructionDiagram.tsx";
import DiodeConstructionControlPanel from "./DiodeConstructionControlPanel.tsx";
import { DiodeConstructionHeader } from "./DiodeConstructionHeader.tsx";
import DiodeProbeReadout from "./DiodeProbeReadout.tsx";
import { useDiodeConstructionSimulation } from "./useDiodeConstructionSimulation.ts";
import { ViewExplanationSection } from "./ViewExplanationSection.tsx";

export default function WhatIsDiodeConstructionInteractiveSimulation() {
  const simulation = useDiodeConstructionSimulation();

  return (
    <main className="min-h-screen bg-white p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <DiodeConstructionHeader view={simulation.view} />

        <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
          <DiodeConstructionControlPanel
            animationSpeed={simulation.animationSpeed}
            onAnimationSpeedChange={simulation.setAnimationSpeed}
            onReset={simulation.reset}
            onShowCarriersChange={simulation.setShowCarriers}
            onShowLabelsChange={simulation.setShowLabels}
            onShowProbeTargetsChange={simulation.setShowProbeTargets}
            view={simulation.view}
            onViewChange={simulation.setView}
            showCarriers={simulation.showCarriers}
            showLabels={simulation.showLabels}
            showProbeTargets={simulation.showProbeTargets}
          />

          <div className="grid gap-5">
            <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-emerald-700">
                    Simulation Panel
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    Diode Construction Diagram
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Inspect material regions, carrier behavior, and the depletion barrier from one engineering-style schematic.
                  </p>
                </div>

                <span className="self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-700">
                  Active
                </span>
              </div>

              <div className="pt-5">
                <DiodeConstructionDiagram
                  animationSpeed={simulation.animationSpeed}
                  onProbeSelect={simulation.setSelectedProbe}
                  selectedProbe={simulation.selectedProbe}
                  showCarriers={simulation.showCarriers}
                  showDebugDots={simulation.showProbeTargets}
                  showLabels={simulation.showLabels}
                  view={simulation.view}
                />
              </div>
            </section>

            <DiodeProbeReadout selectedProbe={simulation.selectedProbe} />
            <ViewExplanationSection view={simulation.view} />
          </div>
        </div>
      </div>
    </main>
  );
}
