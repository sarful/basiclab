"use client";

import { StatBar } from "./StatBar";
import type { FixedType } from "./types";

export function PerformanceProfileCard({ selected }: { selected: FixedType }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Performance Profile</h2>
      <div className="space-y-4">
        <StatBar label="Accuracy" value={selected.accuracy} color="#2563eb" />
        <StatBar label="Noise Level" value={selected.noise} color="#ef4444" />
        <StatBar label="Heat Handling" value={selected.heatHandling} color="#f97316" />
      </div>
    </div>
  );
}
