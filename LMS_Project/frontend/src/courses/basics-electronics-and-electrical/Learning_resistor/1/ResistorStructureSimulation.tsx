"use client";

import { ResistorLessonOneControlPanel } from "./ResistorLessonOneControlPanel";
import { ResistorLessonOneHero } from "./ResistorLessonOneHero";
import { ResistorLessonOneVisualPanel } from "./ResistorLessonOneVisualPanel";
import type { ResistorLessonOneSimulationProps } from "./types";
import { useResistorLessonOneSimulation } from "./useResistorLessonOneSimulation";

export default function ResistorStructureSimulation({
  embedded = false,
}: ResistorLessonOneSimulationProps) {
  const simulation = useResistorLessonOneSimulation();

  const controls = (
    <ResistorLessonOneControlPanel
      mode={simulation.mode}
      material={simulation.material}
      flowMode={simulation.flowMode}
      voltage={simulation.voltage}
      baseResistance={simulation.baseResistance}
      temperature={simulation.temperature}
      rotation={simulation.rotation}
      showComparison={simulation.showComparison}
      onReset={simulation.resetSimulation}
      onModeChange={simulation.setMode}
      onFlowModeChange={simulation.setFlowMode}
      onMaterialChange={simulation.setMaterialKey}
      onVoltageChange={simulation.setVoltage}
      onBaseResistanceChange={simulation.setBaseResistance}
      onTemperatureChange={simulation.setTemperature}
      onRotationChange={simulation.setRotation}
      onToggleComparison={simulation.toggleComparison}
    />
  );

  const visuals = (
    <ResistorLessonOneVisualPanel
      resistance={simulation.resistance}
      current={simulation.current}
      power={simulation.power}
      temperature={simulation.temperature}
      mode={simulation.mode}
      material={simulation.material}
      voltage={simulation.voltage}
      baseResistance={simulation.baseResistance}
      rotation={simulation.rotation}
      flowMode={simulation.flowMode}
      showComparison={simulation.showComparison}
    />
  );

  if (embedded) {
    return (
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div>{controls}</div>
        <div>{visuals}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <ResistorLessonOneHero />
        <div className="grid gap-6 lg:grid-cols-3">
          <div>{controls}</div>
          <div className="lg:col-span-2">{visuals}</div>
        </div>
      </div>
    </div>
  );
}
