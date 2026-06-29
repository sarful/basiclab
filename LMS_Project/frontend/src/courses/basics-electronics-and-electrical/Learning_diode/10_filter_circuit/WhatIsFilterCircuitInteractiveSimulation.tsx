"use client";

import { DiodeSelector } from "./DiodeSelector";
import { ExplanationSection } from "./ExplanationSection";
import { FilterParameterSliders } from "./FilterParameterSliders";
import { FilterSettingsSection } from "./FilterSettingsSection";
import { FilterTimeCursorSection } from "./FilterTimeCursorSection";
import { useFilterCircuitSimulation } from "./useFilterCircuitSimulation";

export default function WhatIsFilterCircuitInteractiveSimulation() {
  const simulation = useFilterCircuitSimulation();

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* <FilterCircuitHero /> */}

        <FilterParameterSliders
          acVoltage={simulation.acVoltage}
          loadOhm={simulation.loadOhm}
          onAcVoltageChange={simulation.setAcVoltage}
          onLoadOhmChange={simulation.setLoadOhm}
        />

        <DiodeSelector
          diodeType={simulation.diodeType}
          setDiodeType={simulation.setDiodeType}
        />

        <FilterSettingsSection
          filterEnabled={simulation.filterEnabled}
          capacitorUf={simulation.capacitorUf}
          onFilterEnabledChange={simulation.setFilterEnabled}
          onCapacitorUfChange={simulation.setCapacitorUf}
        />

        <FilterTimeCursorSection
          autoRun={simulation.autoRun}
          timeCursor={simulation.timeCursor}
          electronFlowRate={simulation.electronFlowRate}
          point={simulation.state.cursorPoint}
          data={simulation.state.waveform}
          filterEnabled={simulation.filterEnabled}
          capacitorUf={simulation.capacitorUf}
          onAutoRunToggle={() => simulation.setAutoRun((value) => !value)}
          onTimeCursorChange={simulation.setTimeCursor}
          onElectronFlowRateChange={simulation.setElectronFlowRate}
        />

        <ExplanationSection state={simulation.state} />
      </div>
    </main>
  );
}
