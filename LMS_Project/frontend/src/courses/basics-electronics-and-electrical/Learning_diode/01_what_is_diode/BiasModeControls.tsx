"use client";

import type { BiasMode } from "./types";

export function BiasModeControls({
  bias,
  onBiasChange,
}: {
  bias: BiasMode;
  onBiasChange: (bias: BiasMode) => void;
}) {
  const isForward = bias === "forward";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onBiasChange("forward")}
        className={`rounded px-5 py-2 font-semibold ${isForward ? "bg-green-500 text-white" : "bg-green-100 text-green-900"}`}
      >
        Forward
      </button>
      <button
        type="button"
        onClick={() => onBiasChange("reverse")}
        className={`rounded px-5 py-2 font-semibold ${!isForward ? "bg-red-500 text-white" : "bg-red-100 text-red-900"}`}
      >
        Reverse
      </button>
    </div>
  );
}
