"use client";

import { CircuitDiagram } from "./CircuitDiagram";
import { WaveformPanel } from "./WaveformPanel";
import type { DiodeProfile, WavePoint } from "./types";

export function TimeCursorSection({
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
          <h2 className="text-xl font-black text-slate-900">
            Time Cursor / Switching Preview
          </h2>
          <p className="text-sm font-bold text-slate-500">
            Move the cursor to compare waveform behavior with the live circuit
            path.
          </p>
        </div>

        <button
          type="button"
          onClick={onAutoRunToggle}
          className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm transition ${
            autoRun
              ? "bg-green-600 text-white"
              : "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
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
        className="mb-4 w-full accent-green-700"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Waveform Analysis
            </p>
            <h3 className="text-lg font-black text-slate-900">
              Rectified Output Waveform
            </h3>
            <p className="text-sm font-semibold text-slate-500">
              Observe how the diode converts AC into pulsating DC.
            </p>
          </div>

          <WaveformPanel data={data} cursorPoint={point} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Circuit Operation
            </p>
            <h3 className="text-lg font-black text-slate-900">
              Live Circuit Path
            </h3>
            <p className="text-sm font-semibold text-slate-500">
              Follow the current path through the diode and load.
            </p>
          </div>

          <CircuitDiagram point={point} diodeDrop={diodeDrop} />
        </div>
      </div>
    </section>
  );
}
