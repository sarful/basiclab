"use client";

import { BranchCurrentSection } from "./BranchCurrentSection";
import { KnowledgeSection } from "./KnowledgeSection";
import { ParallelCircuitVisualSection } from "./ParallelCircuitVisualSection";
import { ParallelResistorMetrics } from "./ParallelResistorMetrics";
import type { ParallelResistorLessonThirteenSimulationProps } from "./types";
import { useParallelResistorCircuitSimulation } from "./useParallelResistorCircuitSimulation";

function LessonContent() {
  const simulation = useParallelResistorCircuitSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <ParallelResistorHero /> */}

      <ParallelResistorMetrics
        eqResistance={simulation.eqResistance}
        totalCurrent={simulation.totalCurrent}
        supplyVoltage={simulation.supplyVoltage}
        totalPower={simulation.totalPower}
      />

      <ParallelCircuitVisualSection
        supplyVoltage={simulation.supplyVoltage}
        branches={simulation.branches}
        onSetSupplyVoltage={simulation.setSupplyVoltage}
        onUpdateBranch={simulation.updateBranch}
        onRemoveBranch={simulation.removeBranch}
        onAddBranch={simulation.addBranch}
        onReset={simulation.resetCircuit}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <BranchCurrentSection
          branches={simulation.branches}
          branchCurrents={simulation.branchCurrents}
          totalCurrent={simulation.totalCurrent}
        />
        <KnowledgeSection />
      </div>
    </div>
  );
}

export default function WhatIsParallelResistorCircuitInteractiveSimulation({
  embedded = false,
}: ParallelResistorLessonThirteenSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
