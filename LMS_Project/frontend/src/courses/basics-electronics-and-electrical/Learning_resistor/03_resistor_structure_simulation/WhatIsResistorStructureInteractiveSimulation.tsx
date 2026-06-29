"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { ResistorStructureMetrics } from "./ResistorStructureMetrics";
import { ResistorStructureVisualStack } from "./ResistorStructureVisualStack";
import type { ResistorLessonThreeSimulationProps } from "./types";
import { useResistorStructureSimulation } from "./useResistorStructureSimulation";

export default function WhatIsResistorStructureInteractiveSimulation({
  embedded = false,
}: ResistorLessonThreeSimulationProps) {
  const simulation = useResistorStructureSimulation();

  return (
    <div
      className={
        embedded
          ? "text-slate-800"
          : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"
      }
    >
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        {/* <ResistorStructureHero /> */}

        <ResistorStructureMetrics
          resistance={simulation.resistance}
          current={simulation.current}
          temperature={simulation.temperature}
          power={simulation.power}
        />

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              mode={simulation.mode}
              materialKey={simulation.materialKey}
              voltage={simulation.voltage}
              baseResistance={simulation.baseResistance}
              temperature={simulation.temperature}
              rotation={simulation.rotation}
              showComparison={simulation.showComparison}
              onModeChange={simulation.setMode}
              onMaterialChange={simulation.setMaterialKey}
              onVoltageChange={simulation.setVoltage}
              onBaseResistanceChange={simulation.setBaseResistance}
              onTemperatureChange={simulation.setTemperature}
              onRotationChange={simulation.setRotation}
              onToggleComparison={simulation.toggleComparison}
              onReset={simulation.resetSimulation}
            />
          </div>

          <ResistorStructureVisualStack
            mode={simulation.mode}
            material={simulation.material}
            voltage={simulation.voltage}
            baseResistance={simulation.baseResistance}
            temperature={simulation.temperature}
            rotation={simulation.rotation}
            showComparison={simulation.showComparison}
          />
        </div>
      </div>
    </div>
  );
}
