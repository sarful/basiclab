"use client";

import { useState } from "react";

import { CharacteristicsView } from "./CharacteristicsView";
import { ExplanationSection } from "./ExplanationSection";
import { TabButton } from "./TabButton";
import type { BiasMode, Section } from "./types";
import { WorkingView } from "./WorkingView";

export default function WhatIsDiodeCharacteristicsInteractiveSimulation() {
  const [section, setSection] = useState<Section>("working");
  const [bias, setBias] = useState<BiasMode>("forward");
  const [voltage, setVoltage] = useState(12);

  return (
    <main className="min-h-screen bg-white p-6 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-5">
        <h1 className="text-3xl font-bold">Diode Interactive</h1>

        <div className="flex flex-wrap gap-3">
          <TabButton active={section === "working"} onClick={() => setSection("working")}>
            Working
          </TabButton>
          <TabButton active={section === "characteristics"} onClick={() => setSection("characteristics")}>
            Characteristics
          </TabButton>
        </div>

        {section === "working" && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setBias("forward")}
              className={`rounded px-5 py-2 font-semibold ${bias === "forward" ? "bg-green-500 text-white" : "bg-green-100 text-green-900"}`}
            >
              Forward Bias
            </button>
            <button
              type="button"
              onClick={() => setBias("reverse")}
              className={`rounded px-5 py-2 font-semibold ${bias === "reverse" ? "bg-red-500 text-white" : "bg-red-100 text-red-900"}`}
            >
              Reverse Bias
            </button>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="voltage" className="font-bold">Voltage Controller</label>
            <span className="rounded bg-white px-3 py-1 font-mono font-bold shadow-sm">
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
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>0V</span>
            <span>≈0.7V threshold</span>
            <span>12V</span>
          </div>
        </div>

        {section === "working" && <WorkingView bias={bias} voltage={voltage} />}
        {section === "characteristics" && <CharacteristicsView voltage={voltage} />}
        <ExplanationSection section={section} bias={bias} voltage={voltage} />
      </div>
    </main>
  );
}
