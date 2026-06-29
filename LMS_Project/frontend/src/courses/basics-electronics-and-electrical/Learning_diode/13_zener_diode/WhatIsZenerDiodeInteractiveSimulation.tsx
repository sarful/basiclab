"use client";

import ZenerBreakdownCanvas from "./ZenerBreakdownCanvas";
import ZenerBreakdownControlPanel from "./ZenerBreakdownControlPanel";
import ZenerBreakdownDashboard from "./ZenerBreakdownDashboard";
import { useZenerSimulation, ZENER_PRESETS } from "./useZenerSimulation";

export default function WhatIsZenerDiodeInteractiveSimulation() {
  const simulation = useZenerSimulation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-purple-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-700">
                Lesson 13
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">Zener Avalanche Breakdown Simulation</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Explore how a reverse-biased zener diode moves from leakage into breakdown, then regulates voltage
                across changing load conditions with series resistance support.
              </p>
            </div>
            <span className={`self-start rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em] ${
              simulation.state.isBreakdown ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}>
              {simulation.state.regulationStatus}
            </span>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <ZenerBreakdownControlPanel
            biasMode={simulation.biasMode}
            flowMode={simulation.flowMode}
            loadCondition={simulation.loadCondition}
            onBiasModeChange={simulation.setBiasMode}
            onFlowModeChange={simulation.setFlowMode}
            onLoadConditionChange={simulation.setLoadCondition}
            onReset={simulation.reset}
            onSeriesResistanceChange={simulation.setSeriesResistance}
            onSupplyVoltageChange={simulation.setVoltage}
            onZenerPresetChange={simulation.setZenerVoltage}
            presetOptions={ZENER_PRESETS}
            seriesResistance={simulation.seriesResistance}
            state={simulation.state}
            supplyVoltage={simulation.voltage}
            zenerVoltage={simulation.zenerVoltage}
          />

          <div className="space-y-5">
            <ZenerBreakdownCanvas
              biasMode={simulation.biasMode}
              flowMode={simulation.flowMode}
              state={simulation.state}
              supplyVoltage={simulation.voltage}
              zenerVoltage={simulation.zenerVoltage}
            />
            <ZenerBreakdownDashboard
              biasMode={simulation.biasMode}
              flowMode={simulation.flowMode}
              state={simulation.state}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
