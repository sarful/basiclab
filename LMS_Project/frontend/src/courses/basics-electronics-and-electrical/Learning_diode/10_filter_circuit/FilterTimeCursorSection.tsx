"use client";

import { CombinedSimulationPanel } from "./CombinedSimulationPanel";
import type { WavePoint } from "./types";

export function FilterTimeCursorSection({
  autoRun,
  timeCursor,
  electronFlowRate,
  point,
  data,
  filterEnabled,
  capacitorUf,
  onAutoRunToggle,
  onTimeCursorChange,
  onElectronFlowRateChange,
}: {
  autoRun: boolean;
  timeCursor: number;
  electronFlowRate: number;
  point: WavePoint;
  data: WavePoint[];
  filterEnabled: boolean;
  capacitorUf: number;
  onAutoRunToggle: () => void;
  onTimeCursorChange: (value: number) => void;
  onElectronFlowRateChange: (value: number) => void;
}) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Time Cursor / Switching + Filter Preview</h2>
          <p className="text-sm font-bold text-slate-500">
            Move the cursor to see D1/D2 conduction and capacitor charging/discharging.
          </p>
        </div>
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
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
        <span className="mr-2 text-sm font-black text-slate-700">
          Electron Flow Rate:
        </span>
        {[
          { label: "Slow", value: 0.55 },
          { label: "Normal", value: 1 },
          { label: "Fast", value: 1.8 },
          { label: "Turbo", value: 2.8 },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onElectronFlowRateChange(item.value)}
            className={`rounded-xl px-3 py-2 text-xs font-black shadow-sm transition ${
              electronFlowRate === item.value
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-sky-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <CombinedSimulationPanel
        point={point}
        data={data}
        filterEnabled={filterEnabled}
        capacitorUf={capacitorUf}
        electronFlowRate={electronFlowRate}
      />
    </section>
  );
}
