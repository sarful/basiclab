"use client";

import { LedResistorProblems } from "./LedResistorProblems";
import { LedSelectorSection } from "./LedSelectorSection";
import { ledOptions } from "./logic";
import { OhmsLawMetrics } from "./OhmsLawMetrics";
import { OhmsLawVisualSection } from "./OhmsLawVisualSection";
import { SolveModeSelector } from "./SolveModeSelector";
import type { OhmsLawLessonElevenSimulationProps } from "./types";
import { useOhmsLawSimulation } from "./useOhmsLawSimulation";

function LessonContent() {
  const simulation = useOhmsLawSimulation();

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
      {/* <OhmsLawHero
        statusLabel={simulation.ledStatus.label}
        statusTone={simulation.ledStatus.tone}
      /> */}

      <SolveModeSelector
        mode={simulation.mode}
        onModeChange={simulation.setMode}
        onReset={simulation.resetSimulation}
      />

      <OhmsLawMetrics
        voltage={simulation.solved.voltage}
        current={simulation.solved.current}
        resistance={simulation.solved.resistance}
        power={simulation.power}
      />

      <LedSelectorSection
        selectedLed={simulation.selectedLed}
        ledOptions={ledOptions}
        ledStatusLabel={simulation.ledStatus.label}
        ledStatusTone={simulation.ledStatus.tone}
        ledStatusBg={simulation.ledStatus.bg}
        ledStatusMessage={simulation.ledStatus.message}
        ledSupplyVoltage={simulation.ledSupplyVoltage}
        requiredLedResistor={simulation.requiredLedResistor}
        roundedLedResistor={simulation.roundedLedResistor}
        onLedChange={simulation.setSelectedLed}
      />

      <OhmsLawVisualSection
        mode={simulation.mode}
        voltage={simulation.voltage}
        currentInput={simulation.currentInput}
        resistance={simulation.resistance}
        formula={simulation.solved.formula}
        ledBrightness={simulation.ledBrightness}
        solvedVoltage={simulation.solved.voltage}
        solvedResistance={simulation.solved.resistance}
        solvedCurrent={simulation.solved.current}
        selectedLed={simulation.selectedLed}
        onVoltageChange={simulation.setVoltage}
        onCurrentInputChange={simulation.setCurrentInput}
        onResistanceChange={simulation.setResistance}
      />

      <LedResistorProblems supplyVoltage={simulation.ledSupplyVoltage} />
    </div>
  );
}

export default function WhatIsOhmsLawInteractiveSimulation({
  embedded = false,
}: OhmsLawLessonElevenSimulationProps) {
  if (embedded) {
    return <LessonContent />;
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <LessonContent />
    </div>
  );
}
