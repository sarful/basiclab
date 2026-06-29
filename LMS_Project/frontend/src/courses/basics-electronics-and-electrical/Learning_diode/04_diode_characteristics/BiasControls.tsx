"use client";

import type { BiasMode } from "./types";

export function BiasControls({
  bias,
  onBiasChange,
}: {
  bias: BiasMode;
  onBiasChange: (bias: BiasMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onBiasChange("forward")}
        className={`rounded px-5 py-2 font-semibold ${bias === "forward" ? "bg-green-500 text-white" : "bg-green-100 text-green-900"}`}
      >
        Forward Bias
      </button>
      <button
        type="button"
        onClick={() => onBiasChange("reverse")}
        className={`rounded px-5 py-2 font-semibold ${bias === "reverse" ? "bg-red-500 text-white" : "bg-red-100 text-red-900"}`}
      >
        Reverse Bias
      </button>
    </div>
  );
}
