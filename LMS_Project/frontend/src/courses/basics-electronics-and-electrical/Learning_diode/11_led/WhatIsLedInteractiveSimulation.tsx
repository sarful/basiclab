"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { LedAnimationSection } from "./LedAnimationSection";
import { LedHero } from "./LedHero";
import { LedSymbolSection } from "./LedSymbolSection";
import { UsesSection } from "./UsesSection";
import { useLedSimulation } from "./useLedSimulation";
import { WorkingPrincipleSection } from "./WorkingPrincipleSection";

export default function WhatIsLedInteractiveSimulation() {
  const simulation = useLedSimulation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-yellow-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
        <LedHero />

        <ControlPanelSection
          isPlaying={simulation.isPlaying}
          setIsPlaying={simulation.setIsPlaying}
          resetKey={simulation.resetKey}
          setResetKey={simulation.setResetKey}
          voltage={simulation.voltage}
          setVoltage={simulation.setVoltage}
          forwardVoltage={simulation.forwardVoltage}
          setForwardVoltage={simulation.setForwardVoltage}
          hasResistor={simulation.hasResistor}
          setHasResistor={simulation.setHasResistor}
          state={simulation.state}
        />

        <LedAnimationSection
          isPlaying={simulation.isPlaying}
          resetKey={simulation.resetKey}
          voltage={simulation.voltage}
          forwardVoltage={simulation.forwardVoltage}
          state={simulation.state}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <LedSymbolSection />
          <WorkingPrincipleSection state={simulation.state} />
        </div>

        <UsesSection />
      </div>
    </main>
  );
}
