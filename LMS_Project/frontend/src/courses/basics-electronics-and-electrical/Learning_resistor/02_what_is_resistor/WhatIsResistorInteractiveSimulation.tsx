"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { PowerRatingHeatVisualizer } from "./PowerRatingHeatVisualizer";
import type { ResistorLessonTwoProps } from "./types";
import { useWhatIsResistorSimulation } from "./useWhatIsResistorSimulation";

export default function WhatIsResistorInteractiveSimulation({
  panelOnly = false,
  visualOnly = false,
  simulation: externalSimulation,
}: ResistorLessonTwoProps) {
  const internalSimulation = useWhatIsResistorSimulation();
  const simulation = externalSimulation ?? internalSimulation;

  const controlPanel = (
    <ControlPanelSection
      mode={simulation.mode}
      voltage={simulation.voltage}
      outputVoltage={simulation.outputVoltage}
      voltageDrop={simulation.voltageDrop}
      ledVoltageDrop={simulation.ledVoltageDrop}
      resistance={simulation.resistance}
      rating={simulation.rating}
      ledId={simulation.ledId}
      selectedLedLabel={simulation.selectedLed.label}
      selectedPackageLabel={simulation.selectedPackage.label}
      statusMessage={simulation.status.message}
      recommendedLabel={simulation.recommendedPackage.label}
      onModeChange={simulation.setMode}
      onVoltageChange={simulation.setVoltage}
      onResistanceChange={simulation.setResistance}
      onRatingChange={simulation.setRating}
      onLedChange={simulation.setLedId}
    />
  );

  const visualPanel = (
    <PowerRatingHeatVisualizer
      mode={simulation.mode}
      voltage={simulation.voltage}
      outputVoltage={simulation.outputVoltage}
      voltageDrop={simulation.voltageDrop}
      ledVoltageDrop={simulation.ledVoltageDrop}
      resistance={simulation.resistance}
      rating={simulation.rating}
      brightnessLevel={simulation.brightnessLevel}
      selectedLed={simulation.selectedLed}
      selectedPackage={simulation.selectedPackage}
    />
  );

  if (panelOnly) return controlPanel;
  if (visualOnly) return visualPanel;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div>{controlPanel}</div>
      <div>{visualPanel}</div>
    </div>
  );
}
