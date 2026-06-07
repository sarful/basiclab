"use client";

import { Pause, Play, RotateCcw } from "./icons";
import { IndustrialHeader } from "./ui";

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
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <IndustrialHeader code="PLAY-01" title="Simulation Playback" subtitle="Animation control." icon={<Play className="h-5 w-5 text-emerald-700" />} />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={onPlay} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-1"><Play className="h-4 w-4" /> Play</span>
        </button>
        <button type="button" onClick={onPause} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-1"><Pause className="h-4 w-4" /> Pause</span>
        </button>
        <button type="button" onClick={onReset} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-1"><RotateCcw className="h-4 w-4" /> Reset</span>
        </button>
      </div>
    </section>
  );
}
