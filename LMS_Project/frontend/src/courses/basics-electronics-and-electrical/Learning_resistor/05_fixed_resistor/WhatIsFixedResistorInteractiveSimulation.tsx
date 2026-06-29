"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { FixedResistorMetrics } from "./FixedResistorMetrics";
import { FixedResistorVisualStack } from "./FixedResistorVisualStack";
import { fixedTypes } from "./fixedTypeDefinitions";
import type { FixedResistorLessonFiveSimulationProps } from "./types";
import { useFixedResistorSimulation } from "./useFixedResistorSimulation";

export default function WhatIsFixedResistorInteractiveSimulation({
  embedded = false,
}: FixedResistorLessonFiveSimulationProps) {
  const simulation = useFixedResistorSimulation();

  return (
    <div
      className={
        embedded
          ? "text-slate-800"
          : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"
      }
    >
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        {/* <FixedResistorHero /> */}

        <FixedResistorMetrics
          current={simulation.current}
          power={simulation.power}
          minValue={simulation.minValue}
          maxValue={simulation.maxValue}
          isOverloaded={simulation.isOverloaded}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            fixedTypes={fixedTypes}
            selected={simulation.selected}
            resistance={simulation.resistance}
            voltage={simulation.voltage}
            tolerance={simulation.tolerance}
            powerRating={simulation.powerRating}
            onTypeChange={simulation.applyType}
            onResistanceChange={simulation.setResistance}
            onVoltageChange={simulation.setVoltage}
            onToleranceChange={simulation.setTolerance}
            onPowerRatingChange={simulation.setPowerRating}
          />

          <div className="lg:col-span-2">
            <FixedResistorVisualStack
              selected={simulation.selected}
              resistance={simulation.resistance}
              tolerance={simulation.tolerance}
              powerRating={simulation.powerRating}
              voltage={simulation.voltage}
              power={simulation.power}
              recommendedPower={simulation.recommendedPower}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
