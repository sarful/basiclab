"use client";

import { useEffect, useMemo, useState } from "react";

import { CombinedSimulationPanel } from "./CombinedSimulationPanel";
import { DiodeSelector } from "./DiodeSelector";
import { ExplanationSection } from "./ExplanationSection";
import {
  FIXED_FREQUENCY_HZ,
  getHalfWaveState,
  runSimulationTests,
} from "./logic";
import { Slider } from "./Slider";
import type { DiodeType } from "./types";

export default function WhatIsHalfWaveRectifierInteractiveSimulation() {
  const [acVoltage, setAcVoltage] = useState(10);
  const [loadOhm, setLoadOhm] = useState(1000);
  const [diodeType, setDiodeType] = useState<DiodeType>("standard");
  const [timeCursor, setTimeCursor] = useState(0.14);
  const [autoRun, setAutoRun] = useState(false);

  useEffect(() => {
    runSimulationTests();
  }, []);

  useEffect(() => {
    if (!autoRun) return undefined;
    const interval = window.setInterval(() => {
      setTimeCursor((value) => (value + 0.006) % 1);
    }, 35);
    return () => window.clearInterval(interval);
  }, [autoRun]);

  const state = useMemo(
    () =>
      getHalfWaveState(
        acVoltage,
        FIXED_FREQUENCY_HZ,
        loadOhm,
        diodeType,
        timeCursor,
      ),
    [acVoltage, loadOhm, diodeType, timeCursor],
  );

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-widest text-green-700">
            Rectifier Circuit
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Half-Wave Rectifier: Real Diode Switching
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">
            Industrial behavior model: diode forward drop, reverse leakage, reverse
            recovery, LED glow intensity, overcurrent, and LED blowing risk.
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
                Move the cursor to see diode state at each instant.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutoRun(!autoRun)}
              className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${
                autoRun
                  ? "bg-green-600 text-white"
                  : "bg-white text-slate-900 ring-1 ring-slate-200"
              }`}
            >
              {autoRun ? "Auto Run ON" : "Auto Run OFF"}
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={0.999}
            step={0.001}
            value={timeCursor}
            onChange={(event) => setTimeCursor(Number(event.target.value))}
            className="mb-4 w-full accent-green-700"
          />
          <CombinedSimulationPanel
            point={state.cursorPoint}
            data={state.waveform}
            diodeDrop={state.profile.drop}
          />
        </section>

        <ExplanationSection state={state} diodeType={diodeType} />
      </div>
    </main>
  );
}
