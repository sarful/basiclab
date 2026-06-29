"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { LdrGraph } from "./LdrGraph";
import { LdrMetrics } from "./LdrMetrics";
import { LdrVisualStack } from "./LdrVisualStack";
import type { LdrLessonEightSimulationProps } from "./types";
import { useLdrSimulation } from "./useLdrSimulation";

export default function WhatIsLdrInteractiveSimulation({
  embedded = false,
}: LdrLessonEightSimulationProps) {
  const simulation = useLdrSimulation();

  return (
    <div
      className={
        embedded
          ? "text-slate-800"
          : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"
      }
    >
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        {/* <LdrHero /> */}

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-6">
            <ControlPanelSection
              lightPercent={simulation.lightPercent}
              darkResistance={simulation.darkResistance}
              fixedResistor={simulation.fixedResistor}
              voltage={simulation.voltage}
              onLightPercentChange={simulation.setLightPercent}
              onDarkResistanceChange={simulation.setDarkResistance}
              onFixedResistorChange={simulation.setFixedResistor}
              onVoltageChange={simulation.setVoltage}
            />

            <LdrGraph
              darkResistance={simulation.darkResistance}
              lightPercent={simulation.lightPercent}
            />
          </div>

          <div className="space-y-6">
            <LdrMetrics
              lightPercent={simulation.lightPercent}
              resistance={simulation.resistance}
              outputVoltage={simulation.outputVoltage}
              lampStatus={simulation.lampStatus}
            />
            <LdrVisualStack
              lightPercent={simulation.lightPercent}
              darkResistance={simulation.darkResistance}
              resistance={simulation.resistance}
              outputVoltage={simulation.outputVoltage}
              current={simulation.current}
              voltage={simulation.voltage}
              fixedResistor={simulation.fixedResistor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
