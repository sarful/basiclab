"use client";

import { ElectrolyticCapacitorMetrics } from "./ElectrolyticCapacitorMetrics";
import { ElectrolyticVisualSection } from "./ElectrolyticVisualSection";
import { LearningSections } from "./LearningSections";
import type { CapacitorLessonSixSimulationProps } from "./types";
import { useElectrolyticCapacitorSimulation } from "./useElectrolyticCapacitorSimulation";

function LessonContent() {
  const simulation = useElectrolyticCapacitorSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <ElectrolyticCapacitorHero /> */}

      <ElectrolyticCapacitorMetrics
        capacitance={simulation.capacitance}
        storedEnergy={simulation.snapshot.storedEnergy}
        voltageRating={simulation.voltageRating}
        appliedVoltage={simulation.appliedVoltage}
        heatLoss={simulation.snapshot.heatLoss}
      />

      <ElectrolyticVisualSection
        capacitance={simulation.capacitance}
        setCapacitance={simulation.setCapacitance}
        voltageRating={simulation.voltageRating}
        setVoltageRating={simulation.setVoltageRating}
        appliedVoltage={simulation.appliedVoltage}
        setAppliedVoltage={simulation.setAppliedVoltage}
        esr={simulation.esr}
        setEsr={simulation.setEsr}
        rippleCurrent={simulation.rippleCurrent}
        setRippleCurrent={simulation.setRippleCurrent}
        polarity={simulation.polarity}
        setPolarity={simulation.setPolarity}
        storedEnergy={simulation.snapshot.storedEnergy}
        resetSimulation={simulation.resetSimulation}
      />

      <LearningSections
        smoothingLevel={simulation.snapshot.smoothingLevel}
        safetyMargin={simulation.snapshot.safetyMargin}
        leakageRisk={simulation.snapshot.leakageRisk}
        heatLoss={simulation.snapshot.heatLoss}
      />
    </div>
  );
}

export default function WhatIsElectrolyticCapacitorInteractiveSimulation({
  embedded = false,
}: CapacitorLessonSixSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
