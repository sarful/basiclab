"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { ResistorPowerRatingMetrics } from "./ResistorPowerRatingMetrics";
import { ResistorPowerRatingVisualStack } from "./ResistorPowerRatingVisualStack";
import type { ResistorPowerRatingLessonTenSimulationProps } from "./types";
import { useResistorPowerRatingSimulation } from "./useResistorPowerRatingSimulation";

export default function WhatIsResistorPowerRatingInteractiveSimulation({
  embedded = false,
}: ResistorPowerRatingLessonTenSimulationProps) {
  const simulation = useResistorPowerRatingSimulation();

  return (
    <div
      className={
        embedded
          ? "text-slate-800"
          : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"
      }
    >
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        {/* <ResistorPowerRatingHero /> */}

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              voltage={simulation.voltage}
              resistance={simulation.resistance}
              current={simulation.current}
              power={simulation.power}
              powerByI2R={simulation.powerByI2R}
              powerByV2R={simulation.powerByV2R}
              safetyMargin={simulation.safetyMargin}
              rating={simulation.rating}
              selectedPackageLabel={simulation.selectedPackage.label}
              statusMessage={simulation.status.message}
              recommendedLabel={simulation.recommended.label}
              onVoltageChange={simulation.setVoltage}
              onResistanceChange={simulation.setResistance}
              onRatingChange={simulation.setRating}
            />
          </div>

          <div className="space-y-6">
            <ResistorPowerRatingMetrics
              power={simulation.power}
              rating={simulation.rating}
              current={simulation.current}
              status={simulation.status}
            />
            <ResistorPowerRatingVisualStack
              voltage={simulation.voltage}
              resistance={simulation.resistance}
              rating={simulation.rating}
              selectedPackage={simulation.selectedPackage}
              current={simulation.current}
              power={simulation.power}
              powerByI2R={simulation.powerByI2R}
              powerByV2R={simulation.powerByV2R}
              safetyMargin={simulation.safetyMargin}
              recommendedLabel={simulation.recommended.label}
              onRatingChange={simulation.setRating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
