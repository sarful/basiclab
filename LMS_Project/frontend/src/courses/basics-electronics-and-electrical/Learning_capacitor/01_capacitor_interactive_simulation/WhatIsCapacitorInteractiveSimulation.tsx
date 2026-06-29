"use client";

import { CapacitorMetrics } from "./CapacitorMetrics";
import { CapacitorVisualSection } from "./CapacitorVisualSection";
import { LearningSections } from "./LearningSections";
import type { CapacitorLessonOneSimulationProps } from "./types";
import { useCapacitorSimulation } from "./useCapacitorSimulation";

function LessonContent() {
  const simulation = useCapacitorSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <CapacitorHero /> */}

      <CapacitorMetrics
        capacitance={simulation.capacitance}
        capacitorVoltage={simulation.snapshot.capacitorVoltage}
        current={simulation.snapshot.current}
        storedEnergy={simulation.snapshot.storedEnergy}
      />

      <CapacitorVisualSection
        supplyVoltage={simulation.supplyVoltage}
        setSupplyVoltage={simulation.setSupplyVoltage}
        capacitance={simulation.capacitance}
        setCapacitance={simulation.setCapacitance}
        resistance={simulation.resistance}
        setResistance={simulation.setResistance}
        time={simulation.time}
        setTime={simulation.setTime}
        maxTime={simulation.snapshot.maxTime}
        mode={simulation.mode}
        setMode={simulation.setMode}
        storedCharge={simulation.snapshot.storedCharge}
        resetCircuit={simulation.resetCircuit}
        chargeLevel={simulation.snapshot.chargeLevel}
        capacitorVoltage={simulation.snapshot.capacitorVoltage}
        current={simulation.snapshot.current}
        timeConstant={simulation.snapshot.timeConstant}
      />

      <LearningSections
        supplyVoltage={simulation.supplyVoltage}
        computed={simulation.snapshot}
      />
    </div>
  );
}

export default function WhatIsCapacitorInteractiveSimulation({
  embedded = false,
}: CapacitorLessonOneSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
