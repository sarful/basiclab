"use client";

import { FilterCircuitDiagram } from "./FilterCircuitDiagram";
import { WaveformPanel } from "./WaveformPanel";
import type { WavePoint } from "./types";

export function CombinedSimulationPanel({
  point,
  data,
  filterEnabled,
  capacitorUf,
  electronFlowRate,
}: {
  point: WavePoint;
  data: WavePoint[];
  filterEnabled: boolean;
  capacitorUf: number;
  electronFlowRate: number;
}) {
  return (
    <section className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <FilterCircuitDiagram
          point={point}
          filterEnabled={filterEnabled}
          capacitorUf={capacitorUf}
          electronFlowRate={electronFlowRate}
        />
        <WaveformPanel data={data} cursorPoint={point} filterEnabled={filterEnabled} />
      </div>
    </section>
  );
}
