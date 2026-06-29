"use client";

import { KnowledgeSection } from "./KnowledgeSection";
import { SeriesCircuitVisualSection } from "./SeriesCircuitVisualSection";
import { SeriesResistorMetrics } from "./SeriesResistorMetrics";
import type { SeriesResistorLessonTwelveSimulationProps } from "./types";
import { useSeriesResistorCircuitSimulation } from "./useSeriesResistorCircuitSimulation";
import { VoltageDistributionCard } from "./VoltageDistributionCard";

function LessonContent() {
  const simulation = useSeriesResistorCircuitSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <SeriesResistorHero /> */}

      <SeriesResistorMetrics
        totalResistance={simulation.totalResistance}
        current={simulation.current}
        supplyVoltage={simulation.supplyVoltage}
        totalPower={simulation.totalPower}
      />

      <SeriesCircuitVisualSection
        supplyVoltage={simulation.supplyVoltage}
        resistors={simulation.resistors}
        onSupplyVoltageChange={simulation.setSupplyVoltage}
        onUpdateResistor={simulation.updateResistor}
        onAddResistor={simulation.addResistor}
        onRemoveResistor={simulation.removeResistor}
        onResetCircuit={simulation.resetCircuit}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <VoltageDistributionCard
          voltageDrops={simulation.voltageDrops}
          resistors={simulation.resistors}
          supplyVoltage={simulation.supplyVoltage}
        />

        <KnowledgeSection />
      </div>
    </div>
  );
}

export default function WhatIsSeriesResistorCircuitInteractiveSimulation({
  embedded = false,
}: SeriesResistorLessonTwelveSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
