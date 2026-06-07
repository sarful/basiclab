"use client";

import { CircuitDiagram } from "./CircuitDiagram";
import { WaveformPanel } from "./WaveformPanel";
import type { WavePoint } from "./types";

export function CombinedSimulationPanel({
  point,
  data,
  diodeDrop,
}: {
  point: WavePoint;
  data: WavePoint[];
  diodeDrop: number;
}) {
  return (
    <section className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <CircuitDiagram point={point} diodeDrop={diodeDrop} />
        <WaveformPanel data={data} cursorPoint={point} />
      </div>
    </section>
  );
}
