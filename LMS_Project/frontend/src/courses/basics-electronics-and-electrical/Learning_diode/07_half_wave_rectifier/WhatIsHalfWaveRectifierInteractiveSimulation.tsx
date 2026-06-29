"use client";

import { DiodeSelector } from "./DiodeSelector";
import { HalfWaveParameterSliders } from "./HalfWaveParameterSliders";
import { TimeCursorSection } from "./TimeCursorSection";
import { useHalfWaveRectifierSimulation } from "./useHalfWaveRectifierSimulation";

export default function WhatIsHalfWaveRectifierInteractiveSimulation() {
  const simulation = useHalfWaveRectifierSimulation();

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <HalfWaveParameterSliders
          acVoltage={simulation.acVoltage}
          loadOhm={simulation.loadOhm}
          onAcVoltageChange={simulation.setAcVoltage}
          onLoadOhmChange={simulation.setLoadOhm}
        />

        <DiodeSelector
          diodeType={simulation.diodeType}
          setDiodeType={simulation.setDiodeType}
        />

        <TimeCursorSection
          autoRun={simulation.autoRun}
          timeCursor={simulation.timeCursor}
          point={simulation.state.cursorPoint}
          data={simulation.state.waveform}
          diodeDrop={simulation.state.profile.drop}
          onAutoRunToggle={() => simulation.setAutoRun((value) => !value)}
          onTimeCursorChange={simulation.setTimeCursor}
        />
      </div>
    </main>
  );
}
