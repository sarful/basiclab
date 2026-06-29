"use client";

import { KnowledgeSection } from "./KnowledgeSection";
import type { VoltageDropLessonFourteenSimulationProps } from "./types";
import { useVoltageDropSimulation } from "./useVoltageDropSimulation";
import { VoltageDistributionCard } from "./VoltageDistributionCard";
import { VoltageDropMetrics } from "./VoltageDropMetrics";
import { VoltageDropVisualSection } from "./VoltageDropVisualSection";

function LessonContent() {
  const simulation = useVoltageDropSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <VoltageDropHero /> */}

      <VoltageDropMetrics
        supplyVoltage={simulation.supplyVoltage}
        current={simulation.current}
        totalResistance={simulation.totalResistance}
        powerTotal={simulation.powerTotal}
      />

      <VoltageDropVisualSection
        supplyVoltage={simulation.supplyVoltage}
        r1={simulation.r1}
        r2={simulation.r2}
        r3={simulation.r3}
        showR3={simulation.showR3}
        onSetSupplyVoltage={simulation.setSupplyVoltage}
        onSetR1={simulation.setR1}
        onSetR2={simulation.setR2}
        onSetR3={simulation.setR3}
        onToggleR3={simulation.toggleR3}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <VoltageDistributionCard
          drops={simulation.drops}
          supplyVoltage={simulation.supplyVoltage}
          showR3={simulation.showR3}
        />

        <KnowledgeSection
          supplyVoltage={simulation.supplyVoltage}
          totalResistance={simulation.totalResistance}
          current={simulation.current}
          showR3={simulation.showR3}
          sumDrop={simulation.sumDrop}
        />
      </div>
    </div>
  );
}

export default function WhatIsVoltageDropInteractiveSimulation({
  embedded = false,
}: VoltageDropLessonFourteenSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
