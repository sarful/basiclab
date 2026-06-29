"use client";

import { CapacitorStructureMetrics } from "./CapacitorStructureMetrics";
import { CapacitorStructureVisualSection } from "./CapacitorStructureVisualSection";
import { LearningSections } from "./LearningSections";
import type { CapacitorLessonThreeSimulationProps } from "./types";
import { useCapacitorStructureSimulation } from "./useCapacitorStructureSimulation";

function LessonContent() {
  const simulation = useCapacitorStructureSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <CapacitorStructureHero /> */}

      <CapacitorStructureMetrics
        capacitance={simulation.snapshot.capacitance}
        plateArea={simulation.plateArea}
        plateDistance={simulation.plateDistance}
        dielectricK={simulation.dielectric.k}
      />

      <CapacitorStructureVisualSection
        plateArea={simulation.plateArea}
        setPlateArea={simulation.setPlateArea}
        plateDistance={simulation.plateDistance}
        setPlateDistance={simulation.setPlateDistance}
        dielectricIndex={simulation.dielectricIndex}
        setDielectricIndex={simulation.setDielectricIndex}
        showField={simulation.showField}
        setShowField={simulation.setShowField}
        capacitance={simulation.snapshot.capacitance}
        resetSimulation={simulation.resetSimulation}
      />

      <LearningSections
        plateArea={simulation.plateArea}
        plateDistance={simulation.plateDistance}
        dielectric={simulation.dielectric}
        relativeEffect={simulation.snapshot.relativeEffect}
      />
    </div>
  );
}

export default function WhatIsCapacitorStructureInteractiveSimulation({
  embedded = false,
}: CapacitorLessonThreeSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
