"use client";

import { useState } from "react";

import { DiodeConstructionDiagram } from "./ConstructionDiagram";
import type { LayerView } from "./types";
import { ViewExplanationSection } from "./ViewExplanationSection";

export default function WhatIsDiodeConstructionInteractiveSimulation() {
  const [view, setView] = useState<LayerView>("formation");

  return (
    <main className="min-h-screen bg-white p-6 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-5">
        <h1 className="text-3xl font-bold">Diode Construction</h1>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setView("basic")}
            className={`rounded px-5 py-2 font-semibold ${view === "basic" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"}`}
          >
            Basic Structure
          </button>
          <button
            type="button"
            onClick={() => setView("doping")}
            className={`rounded px-5 py-2 font-semibold ${view === "doping" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-900"}`}
          >
            Show Doping
          </button>
          <button
            type="button"
            onClick={() => setView("junction")}
            className={`rounded px-5 py-2 font-semibold ${view === "junction" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-900"}`}
          >
            Show PN Junction
          </button>
          <button
            type="button"
            onClick={() => setView("formation")}
            className={`rounded px-5 py-2 font-semibold ${view === "formation" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-900"}`}
          >
            Formation Animation
          </button>
        </div>

        <DiodeConstructionDiagram view={view} />
        <ViewExplanationSection view={view} />
      </div>
    </main>
  );
}
