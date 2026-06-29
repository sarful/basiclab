"use client";

import { BridgeParameterSliders } from "./BridgeParameterSliders";
import { BridgeTimeCursorSection } from "./BridgeTimeCursorSection";
import { DiodeSelector } from "./DiodeSelector";
import { ExplanationSection } from "./ExplanationSection";
import { useBridgeRectifierSimulation } from "./useBridgeRectifierSimulation";

export default function WhatIsBridgeRectifierInteractiveSimulation() {
  const simulation = useBridgeRectifierSimulation();

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* <BridgeRectifierHero /> */}

        <BridgeParameterSliders
          acVoltage={simulation.acVoltage}
          loadOhm={simulation.loadOhm}
          onAcVoltageChange={simulation.setAcVoltage}
          onLoadOhmChange={simulation.setLoadOhm}
        />

        <DiodeSelector
          diodeType={simulation.diodeType}
          setDiodeType={simulation.setDiodeType}
        />

        <BridgeTimeCursorSection
          autoRun={simulation.autoRun}
          timeCursor={simulation.timeCursor}
          showElectronFlow={simulation.showElectronFlow}
          electronFlowRate={simulation.electronFlowRate}
          point={simulation.state.cursorPoint}
          data={simulation.state.waveform}
          diodeDrop={simulation.state.profile.drop}
          onAutoRunToggle={() => simulation.setAutoRun((value) => !value)}
          onShowElectronFlowToggle={() =>
            simulation.setShowElectronFlow((value) => !value)
          }
          onTimeCursorChange={simulation.setTimeCursor}
          onElectronFlowRateChange={simulation.setElectronFlowRate}
        />

        <ExplanationSection state={simulation.state} />
      </div>
    </main>
  );
}
