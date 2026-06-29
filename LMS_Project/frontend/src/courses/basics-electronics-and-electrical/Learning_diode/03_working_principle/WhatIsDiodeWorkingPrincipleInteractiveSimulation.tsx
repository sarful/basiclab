"use client";

import { ConstructionView } from "./ConstructionView";
import { DiodeWorkingPrincipleControlPanel } from "./DiodeWorkingPrincipleControlPanel";
import { DiodeWorkingPrincipleHeader } from "./DiodeWorkingPrincipleHeader";
import { ExplanationSection } from "./ExplanationSection";
import { FormationView } from "./FormationView";
import { useDiodeWorkingPrincipleSimulation } from "./useDiodeWorkingPrincipleSimulation";
import { WorkingView } from "./WorkingView";

const PANEL_META = {
  construction: {
    label: "Simulation Panel",
    title: "Diode Construction View",
    note: "Inspect the P-type region, N-type region, and the basic PN junction boundary.",
    badge: "Structure",
  },
  formation: {
    label: "Simulation Panel",
    title: "PN Junction Formation View",
    note: "Watch carrier diffusion, recombination, and depletion-barrier creation.",
    badge: "Formation",
  },
  working: {
    label: "Simulation Panel",
    title: "Diode Working Principle View",
    note: "Test forward and reverse bias to observe conduction and blocking behavior.",
    badge: "Active",
  },
} as const;

export default function WhatIsDiodeWorkingPrincipleInteractiveSimulation() {
  const simulation = useDiodeWorkingPrincipleSimulation();
  const panelMeta = PANEL_META[simulation.section];

  return (
    <main className="min-h-screen bg-white p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <DiodeWorkingPrincipleHeader />

        <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
          <DiodeWorkingPrincipleControlPanel
            bias={simulation.bias}
            onBiasChange={simulation.setBias}
            onReset={simulation.reset}
            onSectionChange={simulation.setSection}
            onVoltageChange={simulation.setVoltage}
            section={simulation.section}
            voltage={simulation.voltage}
          />

          <div className="grid gap-5">
            <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-emerald-700">
                    {panelMeta.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    {panelMeta.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {panelMeta.note}
                  </p>
                </div>

                <span className="self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-700">
                  {panelMeta.badge}
                </span>
              </div>

              <div className="pt-5">
                {simulation.section === "construction" && <ConstructionView />}
                {simulation.section === "formation" && <FormationView />}
                {simulation.section === "working" && (
                  <WorkingView
                    bias={simulation.bias}
                    voltage={simulation.voltage}
                  />
                )}
              </div>
            </section>

            <ExplanationSection
              section={simulation.section}
              bias={simulation.bias}
              voltage={simulation.voltage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
