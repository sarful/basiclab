"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { ResistorTypesVisualStack } from "./ResistorTypesVisualStack";
import type { ResistorLessonFourSimulationProps } from "./types";
import { useResistorTypesSimulation } from "./useResistorTypesSimulation";

export default function WhatAreResistorTypesInteractiveSimulation({
  embedded = false,
}: ResistorLessonFourSimulationProps) {
  const simulation = useResistorTypesSimulation();

  return (
    <div
      className={
        embedded
          ? "text-slate-800"
          : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"
      }
    >
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        {/* <ResistorTypesHero /> */}

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              selected={simulation.selected}
              filteredTypes={simulation.filteredTypes}
              controlValue={simulation.controlValue}
              environmentValue={simulation.environmentValue}
              filter={simulation.filter}
              onFilterChange={simulation.setFilter}
              onSelectedKeyChange={simulation.setSelectedKey}
              onControlValueChange={simulation.setControlValue}
              onEnvironmentValueChange={simulation.setEnvironmentValue}
            />
          </div>
          <div>
            <ResistorTypesVisualStack
              selected={simulation.selected}
              controlValue={simulation.controlValue}
              environmentValue={simulation.environmentValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
