"use client";

import { CapacitorWorkingPrincipleMetrics } from "./CapacitorWorkingPrincipleMetrics";
import { CapacitorWorkingPrincipleVisualSection } from "./CapacitorWorkingPrincipleVisualSection";
import { LearningSections } from "./LearningSections";
import type { CapacitorLessonFourSimulationProps } from "./types";
import { useCapacitorWorkingPrincipleSimulation } from "./useCapacitorWorkingPrincipleSimulation";

function LessonContent() {
  const simulation = useCapacitorWorkingPrincipleSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <CapacitorWorkingPrincipleHero /> */}

      <CapacitorWorkingPrincipleMetrics
        capacitorVoltage={simulation.snapshot.capacitorVoltage}
        current={simulation.snapshot.current}
        storedCharge={simulation.snapshot.storedCharge}
        storedEnergy={simulation.snapshot.storedEnergy}
      />

      <CapacitorWorkingPrincipleVisualSection
        supplyVoltage={simulation.supplyVoltage}
        setSupplyVoltage={simulation.setSupplyVoltage}
        resistance={simulation.resistance}
        setResistance={simulation.setResistance}
        capacitance={simulation.capacitance}
        setCapacitance={simulation.setCapacitance}
        time={simulation.time}
        setTime={simulation.setTime}
        maxTime={simulation.snapshot.maxTime}
        mode={simulation.mode}
        setMode={simulation.setMode}
        timeConstant={simulation.snapshot.timeConstant}
        chargeRatio={simulation.snapshot.chargeRatio}
        capacitorVoltage={simulation.snapshot.capacitorVoltage}
        current={simulation.snapshot.current}
        resetSimulation={simulation.resetSimulation}
      />

      <LearningSections
        capacitorVoltage={simulation.snapshot.capacitorVoltage}
        supplyVoltage={simulation.supplyVoltage}
        current={simulation.snapshot.current}
        maxCurrent={simulation.supplyVoltage / simulation.resistance}
        storedEnergy={simulation.snapshot.storedEnergy}
        maxEnergy={
          0.5 *
          simulation.snapshot.capacitanceFarad *
          simulation.supplyVoltage *
          simulation.supplyVoltage
        }
        capacitanceFarad={simulation.snapshot.capacitanceFarad}
      />
    </div>
  );
}

export default function WhatIsCapacitorWorkingPrincipleInteractiveSimulation({
  embedded = false,
}: CapacitorLessonFourSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
