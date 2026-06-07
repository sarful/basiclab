"use client";

import { PlayIcon, RotateCcwIcon } from "./icons";
import { IndustrialHeader } from "./ui";
import type { SimulationMode } from "./types";

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
    </section>
  );
}
