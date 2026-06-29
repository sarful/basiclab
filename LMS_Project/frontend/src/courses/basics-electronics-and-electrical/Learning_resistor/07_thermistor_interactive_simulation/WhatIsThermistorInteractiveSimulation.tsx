"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { ThermistorGraph } from "./ThermistorGraph";
import { ThermistorMetrics } from "./ThermistorMetrics";
import { ThermistorVisualStack } from "./ThermistorVisualStack";
import type { ThermistorLessonSevenSimulationProps } from "./types";
import { useThermistorSimulation } from "./useThermistorSimulation";

export default function WhatIsThermistorInteractiveSimulation({
  embedded = false,
}: ThermistorLessonSevenSimulationProps) {
  const simulation = useThermistorSimulation();

  return (
    <div
      className={
        embedded
          ? "text-slate-800"
          : "min-h-screen bg-slate-50 p-3 text-slate-800 sm:p-6"
      }
    >
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-6"}>
        {/* <ThermistorHero /> */}

        <ThermistorMetrics
          temperature={simulation.temperature}
          resistance={simulation.resistance}
          current={simulation.current}
          status={simulation.status}
        />

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <ControlPanelSection
              mode={simulation.mode}
              temperature={simulation.temperature}
              nominalResistance={simulation.nominalResistance}
              voltage={simulation.voltage}
              onModeChange={simulation.setMode}
              onTemperatureChange={simulation.setTemperature}
              onNominalResistanceChange={simulation.setNominalResistance}
              onVoltageChange={simulation.setVoltage}
            />

            <ThermistorGraph
              mode={simulation.mode}
              nominalResistance={simulation.nominalResistance}
              temperature={simulation.temperature}
              resistance={simulation.resistance}
            />
          </aside>

          <main className="min-w-0 space-y-6">
            <ThermistorVisualStack
              mode={simulation.mode}
              temperature={simulation.temperature}
              resistance={simulation.resistance}
              voltage={simulation.voltage}
              current={simulation.current}
              nominalResistance={simulation.nominalResistance}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
