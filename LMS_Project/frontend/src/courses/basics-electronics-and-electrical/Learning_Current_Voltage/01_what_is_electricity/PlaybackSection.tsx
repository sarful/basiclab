"use client";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "./icons";
import type { SimulationMode } from "./types";
import { IndustrialHeader } from "./ui";

export function PlaybackSection({
  mode,
  onModeChange,
  onReset,
}: {
  mode: SimulationMode;
  onModeChange: (mode: SimulationMode) => void;
  onReset: () => void;
}) {
  const isPlaying = mode === "playing";

  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <IndustrialHeader
        code="PLAY-01"
        title="Playback"
        subtitle="Control animation state."
        icon={<PlayIcon className="h-5 w-5 text-emerald-700" />}
      />

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onModeChange("playing")}
          className={`rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm transition ${
            isPlaying
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <PlayIcon className="h-4 w-4" />
            Play
          </span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("paused")}
          className={`rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm transition ${
            !isPlaying
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <PauseIcon className="h-4 w-4" />
            Pause
          </span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <span className="flex items-center justify-center gap-2">
            <RotateCcwIcon className="h-4 w-4" />
            Reset
          </span>
        </button>
      </div>
    </section>
  );
}
