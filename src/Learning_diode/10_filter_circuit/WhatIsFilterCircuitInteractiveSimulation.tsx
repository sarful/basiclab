"use client";

import { useEffect, useMemo, useState } from "react";

import { CombinedSimulationPanel } from "./CombinedSimulationPanel";
import { DiodeSelector } from "./DiodeSelector";
import { ExplanationSection } from "./ExplanationSection";
import { FilterControl } from "./FilterControl";
import { getFilterCircuitState, runSimulationTests } from "./logic";
import { Slider } from "./Slider";
import type { DiodeType } from "./types";

export default function WhatIsFilterCircuitInteractiveSimulation() {
  const [acVoltage, setAcVoltage] = useState(10);
  const [loadOhm, setLoadOhm] = useState(1000);
  const [diodeType, setDiodeType] = useState<DiodeType>("standard");
  const [timeCursor, setTimeCursor] = useState(0.14);
  const [autoRun, setAutoRun] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [capacitorUf, setCapacitorUf] = useState(470);
  const [electronFlowRate, setElectronFlowRate] = useState(1);

  useEffect(() => {
    runSimulationTests();
  }, []);

  useEffect(() => {
    if (!autoRun) return undefined;
    const interval = window.setInterval(() => setTimeCursor((value) => (value + 0.006) % 1), 35);
    return () => window.clearInterval(interval);
  }, [autoRun]);

  const state = useMemo(
    () => getFilterCircuitState(acVoltage, loadOhm, diodeType, timeCursor, filterEnabled, capacitorUf),
    [acVoltage, loadOhm, diodeType, timeCursor, filterEnabled, capacitorUf],
  );

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-widest text-blue-700">Rectifier Circuit</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Full-Wave Rectifier - Filter Circuit Simulation</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">
            Center-tap full-wave rectifier: two diodes alternate conduction, the capacitor filter reduces ripple, and the output becomes smoother DC. LED load visualization and capacitor filter logic are included.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Slider label="AC Voltage (RMS)" value={acVoltage} min={1} max={50} step={1} suffix=" V" onChange={setAcVoltage} />
          <Slider label="LED Load Equivalent" value={loadOhm} min={50} max={5000} step={50} suffix=" OHM" onChange={setLoadOhm} />
        </section>

        <DiodeSelector diodeType={diodeType} setDiodeType={setDiodeType} />

        <section className="grid gap-4 lg:grid-cols-2">
          <FilterControl filterEnabled={filterEnabled} setFilterEnabled={setFilterEnabled} />
          <Slider label="Filter Capacitor" value={capacitorUf} min={10} max={4700} step={10} suffix=" uF" onChange={setCapacitorUf} />
        </section>

        <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">Time Cursor / Switching + Filter Preview</h2>
              <p className="text-sm font-bold text-slate-500">Move the cursor to see D1/D2 conduction and capacitor charging/discharging.</p>
            </div>
            <button type="button" onClick={() => setAutoRun(!autoRun)} className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${autoRun ? "bg-blue-600 text-white" : "bg-white text-slate-900 ring-1 ring-slate-200"}`}>
              {autoRun ? "Auto Run ON" : "Auto Run OFF"}
            </button>
          </div>
          <input type="range" min={0} max={0.999} step={0.001} value={timeCursor} onChange={(event) => setTimeCursor(Number(event.target.value))} className="mb-4 w-full accent-blue-700" />
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <span className="mr-2 text-sm font-black text-slate-700">Electron Flow Rate:</span>
            {[
              { label: "Slow", value: 0.55 },
              { label: "Normal", value: 1 },
              { label: "Fast", value: 1.8 },
              { label: "Turbo", value: 2.8 },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setElectronFlowRate(item.value)}
                className={`rounded-xl px-3 py-2 text-xs font-black shadow-sm transition ${electronFlowRate === item.value ? "bg-sky-600 text-white" : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-sky-50"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <CombinedSimulationPanel
            point={state.cursorPoint}
            data={state.waveform}
            filterEnabled={filterEnabled}
            capacitorUf={capacitorUf}
            electronFlowRate={electronFlowRate}
          />
        </section>

        <ExplanationSection state={state} />
      </div>
    </main>
  );
}
