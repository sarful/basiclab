"use client";

import type { BandMode } from "./types";

export function BandModeSelector({
  mode,
  onModeChange,
}: {
  mode: BandMode;
  onModeChange: (mode: BandMode) => void;
}) {
  return (
    <div className="mb-5 grid grid-cols-3 gap-2">
      {[4, 5, 6].map((item) => (
        <button
          key={item}
          onClick={() => onModeChange(item as BandMode)}
          className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
            mode === item
              ? "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
              : "border-slate-200 bg-white text-slate-700"
          }`}
        >
          {item}-Band
        </button>
      ))}
    </div>
  );
}
