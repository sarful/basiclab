"use client";

import { useMemo, useState } from "react";

import { BiasDetailsSection } from "./BiasDetailsSection";
import { CircuitDiagram } from "./CircuitDiagram";
import { getBiasResult, getLedState } from "./logic";
import type { BiasMode } from "./types";

export default function WhatIsDiodeInteractiveSimulation() {
  const [bias, setBias] = useState<BiasMode>("forward");
  const [voltage, setVoltage] = useState(12);
  const led = getLedState(bias, voltage);
  const status = useMemo(() => getBiasResult(bias, voltage), [bias, voltage]);
  const isForward = bias === "forward";

  return (
    <main className="min-h-screen bg-white p-6 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-5">
        <h1 className="text-3xl font-bold">ডায়োড কী</h1>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setBias("forward")}
            className={`rounded px-5 py-2 font-semibold ${isForward ? "bg-green-500 text-white" : "bg-green-100 text-green-900"}`}
          >
            Forward
          </button>
          <button
            type="button"
            onClick={() => setBias("reverse")}
            className={`rounded px-5 py-2 font-semibold ${!isForward ? "bg-red-500 text-white" : "bg-red-100 text-red-900"}`}
          >
            Reverse
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="voltage" className="font-bold">Voltage Slider</label>
            <span className="rounded bg-white px-3 py-1 font-mono font-bold text-slate-800 shadow-sm">
              {voltage.toFixed(1)}V
            </span>
          </div>
          <input
            id="voltage"
            type="range"
            min="0"
            max="12"
            step="0.1"
            value={voltage}
            onChange={(event) => setVoltage(Number(event.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>0V</span>
            <span>0.7V threshold</span>
            <span>12V</span>
          </div>
        </div>

        <CircuitDiagram bias={bias} voltage={voltage} />

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-xl font-bold">{status.title}</h2>
          <p className="text-slate-700">{status.text}</p>
          <BiasDetailsSection isForward={isForward} currentLevel={led.currentLevel} />
        </div>
      </div>
    </main>
  );
}
