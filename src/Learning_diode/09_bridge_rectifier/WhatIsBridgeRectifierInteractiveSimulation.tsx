"use client";

import { useEffect, useMemo, useState } from "react";

import { CombinedSimulationPanel } from "./CombinedSimulationPanel";
import { DiodeSelector } from "./DiodeSelector";
import { ExplanationSection } from "./ExplanationSection";
import { getBridgeRectifierState, runSimulationTests } from "./logic";
import { Slider } from "./Slider";
import type { DiodeType } from "./types";

export default function WhatIsBridgeRectifierInteractiveSimulation() {
  const [acVoltage, setAcVoltage] = useState(10);
  const [loadOhm, setLoadOhm] = useState(1000);
  const [diodeType, setDiodeType] = useState<DiodeType>("standard");
  const [timeCursor, setTimeCursor] = useState(0.14);
  const [autoRun, setAutoRun] = useState(false);
  const [showElectronFlow, setShowElectronFlow] = useState(true);
  const [electronFlowRate, setElectronFlowRate] = useState(1);

  useEffect(() => {
    runSimulationTests();
  }, []);

  useEffect(() => {
    if (!autoRun) return undefined;
    const interval = window.setInterval(
      () => setTimeCursor((value) => (value + 0.006) % 1),
      35,
    );
    return () => window.clearInterval(interval);
  }, [autoRun]);

  const state = useMemo(
    () => getBridgeRectifierState(acVoltage, loadOhm, diodeType, timeCursor),
    [acVoltage, loadOhm, diodeType, timeCursor],
  );

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-widest text-blue-700">
            Rectifier Circuit
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Bridge Rectifier - 4 Diode Simulation
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">
            Bridge rectifier: four diodes convert AC input into full-wave DC output.
            Two diodes conduct together in each half-cycle, so every cycle includes
            a 2 x Vf drop.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Slider
            label="AC Voltage (RMS)"
            value={acVoltage}
            min={1}
            max={50}
            step={1}
            suffix=" V"
            onChange={setAcVoltage}
          />
          <Slider
            label="LED Current Limit"
            value={loadOhm}
            min={50}
            max={5000}
            step={50}
            suffix=" OHM"
            onChange={setLoadOhm}
          />
        </section>

        <DiodeSelector diodeType={diodeType} setDiodeType={setDiodeType} />

        <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">Time Cursor / Switching Preview</h2>
              <p className="text-sm font-bold text-slate-500">
                Move the cursor to see which bridge diode pair conducts: D1+D4 or D2+D3.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAutoRun(!autoRun)}
                className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${
                  autoRun
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-900 ring-1 ring-slate-200"
                }`}
              >
                {autoRun ? "Auto Run ON" : "Auto Run OFF"}
              </button>
              <button
                type="button"
                onClick={() => setShowElectronFlow(!showElectronFlow)}
                className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${
                  showElectronFlow
                    ? "bg-green-600 text-white"
                    : "bg-white text-slate-900 ring-1 ring-slate-200"
                }`}
              >
                {showElectronFlow ? "Electron Flow ON" : "Electron Flow OFF"}
              </button>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={0.999}
            step={0.001}
            value={timeCursor}
            onChange={(event) => setTimeCursor(Number(event.target.value))}
            className="mb-4 w-full accent-blue-700"
          />
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="font-black text-slate-900">Electron Flow Rate</label>
              <span className="rounded-xl bg-slate-900 px-3 py-1 font-mono text-sm font-black text-white">
                {electronFlowRate.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3}
              step={0.1}
              value={electronFlowRate}
              onChange={(event) => setElectronFlowRate(Number(event.target.value))}
              className="w-full accent-green-600"
            />
          </div>
          <CombinedSimulationPanel
            point={state.cursorPoint}
            data={state.waveform}
            diodeDrop={state.profile.drop}
            showElectronFlow={showElectronFlow}
            electronFlowRate={electronFlowRate}
          />
        </section>

        <ExplanationSection state={state} />
      </div>
    </main>
  );
}
