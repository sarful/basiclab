"use client";

import { BridgeCircuit } from "./BridgeCircuit";
import { WaveformPanel } from "./WaveformPanel";
import type { WavePoint } from "./types";

export function CombinedSimulationPanel({
  point,
  data,
  diodeDrop,
  showElectronFlow,
  electronFlowRate,
}: {
  point: WavePoint;
  data: WavePoint[];
  diodeDrop: number;
  showElectronFlow: boolean;
  electronFlowRate: number;
}) {
  return (
    <section className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <BridgeCircuit
          point={point}
          diodeDrop={diodeDrop}
          showElectronFlow={showElectronFlow}
          electronFlowRate={electronFlowRate}
        />
        <WaveformPanel data={data} cursorPoint={point} />
      </div>
    </section>
  );
}
