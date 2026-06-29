"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { HowToReadCard } from "./HowToReadCard";
import { LiveFormulaCard } from "./LiveFormulaCard";
import { ResistorColorCodeMetrics } from "./ResistorColorCodeMetrics";
import { ResistorColorCodeVisualStack } from "./ResistorColorCodeVisualStack";
import type { ResistorColorCodeLessonNineSimulationProps } from "./types";
import { useResistorColorCodeSimulation } from "./useResistorColorCodeSimulation";
export default function WhatIsResistorColorCodeInteractiveSimulation({
  embedded = false,
}: ResistorColorCodeLessonNineSimulationProps) {
  const simulation = useResistorColorCodeSimulation();

  return (
    <div
      className={
        embedded
          ? "text-slate-800"
          : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"
      }
    >
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        {/* <ResistorColorCodeHero /> */}

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              mode={simulation.mode}
              band1={simulation.band1}
              band2={simulation.band2}
              band3={simulation.band3}
              multiplier={simulation.multiplier}
              tolerance={simulation.tolerance}
              temp={simulation.temp}
              onModeChange={simulation.setMode}
              onBand1Change={simulation.setBand1}
              onBand2Change={simulation.setBand2}
              onBand3Change={simulation.setBand3}
              onMultiplierChange={simulation.setMultiplier}
              onToleranceChange={simulation.setTolerance}
              onTempChange={simulation.setTemp}
              onPresetApply={simulation.applyPreset}
            />
            <LiveFormulaCard
              mode={simulation.mode}
              formulaText={simulation.formulaText}
              minResistance={simulation.minResistance}
              maxResistance={simulation.maxResistance}
              tempPpm={simulation.tc.ppm}
            />
            <HowToReadCard />
            {/* <CommonMistakeCard /> */}
          </div>
          <div className="space-y-6">
            <ResistorColorCodeMetrics
              resistance={simulation.resistance}
              tolerance={simulation.tol.tolerance}
              minResistance={simulation.minResistance}
              maxResistance={simulation.maxResistance}
            />
            <ResistorColorCodeVisualStack
              mode={simulation.mode}
              bands={simulation.bands}
              formulaText={simulation.formulaText}
              minResistance={simulation.minResistance}
              maxResistance={simulation.maxResistance}
              tempPpm={simulation.tc.ppm}
              firstDigitValue={simulation.d1.value}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
