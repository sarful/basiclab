"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { KnowledgeSection } from "./KnowledgeSection";
import { resistorTypes } from "./logic";
import { ResistorVisual } from "./ResistorVisual";
import type { Category, ResistorTypeKey } from "./types";

export default function WhatAreResistorTypesInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  const [selectedKey, setSelectedKey] = useState<ResistorTypeKey>("metalFilm");
  const [controlValue, setControlValue] = useState(45);
  const [environmentValue, setEnvironmentValue] = useState(60);
  const [filter, setFilter] = useState<Category>("All");

  const selected = resistorTypes.find((item) => item.key === selectedKey) || resistorTypes[1];
  const filteredTypes = useMemo(() => {
    if (filter === "All") return resistorTypes;
    return resistorTypes.filter((item) => item.category === filter);
  }, [filter]);

  const visualSide = (
    <div className="space-y-6">
      <ResistorVisual selected={selected} controlValue={controlValue} environmentValue={environmentValue} />
      <KnowledgeSection selected={selected} />
    </div>
  );

  return (
    <div className={embedded ? "text-slate-800" : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"}>
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Resistor Types Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Compare resistor families, understand their behavior, and learn where each one is used.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <ControlPanelSection
              selected={selected}
              filteredTypes={filteredTypes}
              controlValue={controlValue}
              environmentValue={environmentValue}
              filter={filter}
              onFilterChange={setFilter}
              onSelectedKeyChange={setSelectedKey}
              onControlValueChange={setControlValue}
              onEnvironmentValueChange={setEnvironmentValue}
            />
          </div>
          <div>{visualSide}</div>
        </div>
      </div>
    </div>
  );
}
