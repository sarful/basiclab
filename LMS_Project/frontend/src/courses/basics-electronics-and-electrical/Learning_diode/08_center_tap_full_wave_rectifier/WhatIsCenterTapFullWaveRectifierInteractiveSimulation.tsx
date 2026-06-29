"use client";

import { CenterTapParameterSliders } from "./CenterTapParameterSliders";
import { CenterTapTimeCursorSection } from "./CenterTapTimeCursorSection";
import { DiodeSelector } from "./DiodeSelector";
import { ExplanationSection } from "./ExplanationSection";
import { useCenterTapRectifierSimulation } from "./useCenterTapRectifierSimulation";

export default function WhatIsCenterTapFullWaveRectifierInteractiveSimulation() {
  const simulation = useCenterTapRectifierSimulation();

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* <CenterTapRectifierHero /> */}

        <CenterTapParameterSliders
          acVoltage={simulation.acVoltage}
          loadOhm={simulation.loadOhm}
          onAcVoltageChange={simulation.setAcVoltage}
          onLoadOhmChange={simulation.setLoadOhm}
        />

        <DiodeSelector
          diodeType={simulation.diodeType}
          setDiodeType={simulation.setDiodeType}
        />

        <CenterTapTimeCursorSection
          autoRun={simulation.autoRun}
          timeCursor={simulation.timeCursor}
          point={simulation.state.cursorPoint}
          data={simulation.state.waveform}
          diodeDrop={simulation.state.profile.drop}
          onAutoRunToggle={() => simulation.setAutoRun((value) => !value)}
          onTimeCursorChange={simulation.setTimeCursor}
        />

        <ExplanationSection state={simulation.state} />
      </div>
    </main>
  );
}
