"use client";

import { CombinedSimulationPanel } from "./CombinedSimulationPanel";
import type { DiodeProfile, WavePoint } from "./types";

export function BridgeTimeCursorSection({
  autoRun,
  timeCursor,
  showElectronFlow,
  electronFlowRate,
  point,
  data,
  diodeDrop,
  onAutoRunToggle,
  onShowElectronFlowToggle,
  onTimeCursorChange,
  onElectronFlowRateChange,
}: {
  autoRun: boolean;
  timeCursor: number;
  showElectronFlow: boolean;
  electronFlowRate: number;
  point: WavePoint;
  data: WavePoint[];
  diodeDrop: DiodeProfile["drop"];
  onAutoRunToggle: () => void;
  onShowElectronFlowToggle: () => void;
  onTimeCursorChange: (value: number) => void;
  onElectronFlowRateChange: (value: number) => void;
}) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Time Cursor / Switching Preview</h2>
          <p className="text-sm font-bold text-slate-500">
            Move the cursor to see which bridge diode pair conducts: D1+D4 or D2+D3.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onAutoRunToggle}
            className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${
              autoRun
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-900 ring-1 ring-slate-200"
            }`}
          >
            {autoRun ? "Auto Run ON" : "Auto Run OFF"}
          </button>
          <button
            type="button"
            onClick={onShowElectronFlowToggle}
            className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${
              showElectronFlow
                ? "bg-green-600 text-white"
                : "bg-white text-slate-900 ring-1 ring-slate-200"
            }`}
          >
            {showElectronFlow ? "Electron Flow ON" : "Electron Flow OFF"}
          </button>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={0.999}
        step={0.001}
        value={timeCursor}
        onChange={(event) => onTimeCursorChange(Number(event.target.value))}
        className="mb-4 w-full accent-blue-700"
      />
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="font-black text-slate-900">Electron Flow Rate</label>
          <span className="rounded-xl bg-slate-900 px-3 py-1 font-mono text-sm font-black text-white">
            {electronFlowRate.toFixed(1)}x
          </span>
        </div>
        <input
          type="range"
          min={0.2}
          max={3}
          step={0.1}
          value={electronFlowRate}
          onChange={(event) => onElectronFlowRateChange(Number(event.target.value))}
          className="w-full accent-green-600"
        />
      </div>
      <CombinedSimulationPanel
        point={point}
        data={data}
        diodeDrop={diodeDrop}
        showElectronFlow={showElectronFlow}
        electronFlowRate={electronFlowRate}
      />
    </section>
  );
}
