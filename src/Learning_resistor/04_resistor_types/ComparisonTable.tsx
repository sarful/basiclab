"use client";

import { StatBar } from "./StatBar";
import type { ResistorType } from "./types";

export function ComparisonTable({ selected }: { selected: ResistorType }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Performance Profile</h2>
      <div className="space-y-4">
        <StatBar label="Accuracy" value={selected.accuracy} color="#2563eb" />
        <StatBar label="Power Handling" value={selected.power} color="#f97316" />
        <StatBar label="Low Cost" value={selected.cost} color="#16a34a" />
        <StatBar label="Response / Control" value={selected.response} color="#8b5cf6" />
      </div>
    </div>
  );
}
