"use client";

import { CapacitanceMetrics } from "./CapacitanceMetrics";
import { CapacitanceVisualSection } from "./CapacitanceVisualSection";
import { LearningSections } from "./LearningSections";
import type { CapacitanceLessonTwoSimulationProps } from "./types";
import { useCapacitanceSimulation } from "./useCapacitanceSimulation";

function LessonContent() {
  const simulation = useCapacitanceSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <CapacitanceHero /> */}

      <CapacitanceMetrics
        capacitance={simulation.snapshot.capacitance}
        charge={simulation.snapshot.charge}
        voltage={simulation.voltage}
        energy={simulation.snapshot.energy}
      />

      <CapacitanceVisualSection
        voltage={simulation.voltage}
        setVoltage={simulation.setVoltage}
        plateArea={simulation.plateArea}
        setPlateArea={simulation.setPlateArea}
        plateDistance={simulation.plateDistance}
        setPlateDistance={simulation.setPlateDistance}
        dielectricIndex={simulation.dielectricIndex}
        setDielectricIndex={simulation.setDielectricIndex}
        capacitance={simulation.snapshot.capacitance}
        resetSimulation={simulation.resetSimulation}
      />

      <LearningSections
        plateArea={simulation.plateArea}
        plateDistance={simulation.plateDistance}
        dielectric={simulation.dielectric}
        capacitanceLevel={simulation.snapshot.capacitanceLevel}
      />
    </div>
  );
}

export default function WhatIsCapacitanceInteractiveSimulation({
  embedded = false,
}: CapacitanceLessonTwoSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
