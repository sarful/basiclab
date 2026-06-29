"use client";

import { CombinedSimulationPanel } from "./CombinedSimulationPanel";
import type { DiodeProfile, WavePoint } from "./types";

export function CenterTapTimeCursorSection({
  autoRun,
  timeCursor,
  point,
  data,
  diodeDrop,
  onAutoRunToggle,
  onTimeCursorChange,
}: {
  autoRun: boolean;
  timeCursor: number;
  point: WavePoint;
  data: WavePoint[];
  diodeDrop: DiodeProfile["drop"];
  onAutoRunToggle: () => void;
  onTimeCursorChange: (value: number) => void;
}) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Time Cursor / Switching Preview</h2>
          <p className="text-sm font-bold text-slate-500">
            Move the cursor to see which diode conducts: D1 or D2.
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
      <CombinedSimulationPanel
        point={point}
        data={data}
        diodeDrop={diodeDrop}
      />
    </section>
  );
}
