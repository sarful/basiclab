"use client";

import { Pause, Play, RotateCcw } from "./icons";
import { IndustrialLabel } from "./ui";

export function PlaybackSection({
  onPlay,
  onPause,
  onReset,
}: {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <IndustrialLabel code="GLOBAL-CTRL" label="Simulation Playback" />
          <p className="mt-2 text-sm text-slate-600">
            Use Play, Pause, and Reset to control animated flow and waveform behavior.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onPlay}
            className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-cyan-500 hover:bg-cyan-50"
          >
            <span className="flex items-center justify-center gap-2">
              <Play className="h-4 w-4" /> Play
            </span>
          </button>
          <button
            type="button"
            onClick={onPause}
            className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-cyan-500 hover:bg-cyan-50"
          >
            <span className="flex items-center justify-center gap-2">
              <Pause className="h-4 w-4" /> Pause
            </span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-cyan-500 hover:bg-cyan-50"
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
