"use client";

import { CeramicCapacitorMetrics } from "./CeramicCapacitorMetrics";
import { CeramicCapacitorVisualSection } from "./CeramicCapacitorVisualSection";
import { LearningSections } from "./LearningSections";
import type { CapacitorLessonFiveSimulationProps } from "./types";
import { useCeramicCapacitorSimulation } from "./useCeramicCapacitorSimulation";

function LessonContent() {
  const simulation = useCeramicCapacitorSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <CeramicCapacitorHero /> */}

      <CeramicCapacitorMetrics
        capacitancePf={simulation.snapshot.capacitancePf}
        code={simulation.code}
        safePercent={simulation.snapshot.safePercent}
        reactanceOhm={simulation.snapshot.reactanceOhm}
      />

      <CeramicCapacitorVisualSection
        code={simulation.code}
        setCode={simulation.setCode}
        dielectricIndex={simulation.dielectricIndex}
        setDielectricIndex={simulation.setDielectricIndex}
        appliedVoltage={simulation.appliedVoltage}
        setAppliedVoltage={simulation.setAppliedVoltage}
        voltageRating={simulation.voltageRating}
        setVoltageRating={simulation.setVoltageRating}
        frequency={simulation.frequency}
        setFrequency={simulation.setFrequency}
        reactanceOhm={simulation.snapshot.reactanceOhm}
        resetSimulation={simulation.resetSimulation}
      />

      <LearningSections
        filterEffect={simulation.snapshot.filterEffect}
        safePercent={simulation.snapshot.safePercent}
        stabilityPercent={simulation.snapshot.stabilityPercent}
        dielectric={simulation.dielectric}
      />
    </div>
  );
}

export default function WhatIsCeramicCapacitorInteractiveSimulation({
  embedded = false,
}: CapacitorLessonFiveSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
