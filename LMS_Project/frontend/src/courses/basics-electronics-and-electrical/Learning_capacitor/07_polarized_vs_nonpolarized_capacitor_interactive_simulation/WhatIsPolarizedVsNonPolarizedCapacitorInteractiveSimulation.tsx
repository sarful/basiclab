"use client";

import { CapacitorComparisonMetrics } from "./CapacitorComparisonMetrics";
import { CapacitorComparisonVisualSection } from "./CapacitorComparisonVisualSection";
import { LearningSections } from "./LearningSections";
import type { CapacitorLessonSevenSimulationProps } from "./types";
import { useCapacitorComparisonSimulation } from "./useCapacitorComparisonSimulation";

function LessonContent() {
  const simulation = useCapacitorComparisonSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <CapacitorComparisonHero /> */}

      <CapacitorComparisonMetrics
        voltage={simulation.voltage}
        safeMargin={simulation.snapshot.safeMargin}
        frequency={simulation.frequency}
        acBehavior={simulation.snapshot.acBehavior}
      />

      <CapacitorComparisonVisualSection
        voltage={simulation.voltage}
        setVoltage={simulation.setVoltage}
        reverse={simulation.reverse}
        setReverse={simulation.setReverse}
        frequency={simulation.frequency}
        setFrequency={simulation.setFrequency}
        resetSimulation={simulation.resetSimulation}
      />

      <LearningSections />
    </div>
  );
}

export default function WhatIsPolarizedVsNonPolarizedCapacitorInteractiveSimulation({
  embedded = false,
}: CapacitorLessonSevenSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
