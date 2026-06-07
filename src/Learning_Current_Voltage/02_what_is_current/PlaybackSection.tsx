"use client";

import type { SimulationMode } from "./types";
import { PauseIcon, PlayIcon, RotateCcwIcon } from "./icons";
import { IndustrialHeader } from "./ui";

export function PlaybackSection({
  onModeChange,
  onReset,
}: {
  onModeChange: (mode: SimulationMode) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <IndustrialHeader
        code="PLAY-01"
        title="Playback"
        subtitle="Control animation state."
        icon={<PlayIcon className="h-5 w-5 text-emerald-700" />}
      />

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={() => onModeChange("playing")} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-1"><PlayIcon className="h-4 w-4" /> Play</span>
        </button>
        <button type="button" onClick={() => onModeChange("paused")} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-1"><PauseIcon className="h-4 w-4" /> Pause</span>
        </button>
        <button type="button" onClick={onReset} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-1"><RotateCcwIcon className="h-4 w-4" /> Reset</span>
        </button>
      </div>
    </section>
  );
}
