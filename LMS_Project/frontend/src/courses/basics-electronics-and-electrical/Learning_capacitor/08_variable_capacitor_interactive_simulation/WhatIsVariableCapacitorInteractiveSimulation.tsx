"use client";

import { LearningSections } from "./LearningSections";
import { formatFrequency } from "./logic";
import type { CapacitorLessonEightSimulationProps } from "./types";
import { useVariableCapacitorSimulation } from "./useVariableCapacitorSimulation";
import { VariableCapacitorMetrics } from "./VariableCapacitorMetrics";
import { VariableCapacitorVisualSection } from "./VariableCapacitorVisualSection";

function LessonContent() {
  const simulation = useVariableCapacitorSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <VariableCapacitorHero /> */}

      <VariableCapacitorMetrics
        capacitance={simulation.snapshot.capacitance}
        overlapRatio={simulation.snapshot.overlapRatio}
        frequency={simulation.snapshot.frequency}
        plateCount={simulation.plateCount}
      />

      <VariableCapacitorVisualSection
        rotation={simulation.rotation}
        setRotation={simulation.setRotation}
        minCapacitance={simulation.minCapacitance}
        setMinCapacitance={simulation.setMinCapacitance}
        maxCapacitance={simulation.maxCapacitance}
        setMaxCapacitance={simulation.setMaxCapacitance}
        inductanceUh={simulation.inductanceUh}
        setInductanceUh={simulation.setInductanceUh}
        plateCount={simulation.plateCount}
        setPlateCount={simulation.setPlateCount}
        frequencyLabel={formatFrequency(simulation.snapshot.frequency)}
        resetSimulation={simulation.resetSimulation}
      />

      <LearningSections
        overlapRatio={simulation.snapshot.overlapRatio}
        capacitance={simulation.snapshot.capacitance}
        minCapacitance={simulation.minCapacitance}
        maxCapacitance={simulation.maxCapacitance}
        tuningPercent={simulation.snapshot.tuningPercent}
      />
    </div>
  );
}

export default function WhatIsVariableCapacitorInteractiveSimulation({
  embedded = false,
}: CapacitorLessonEightSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
