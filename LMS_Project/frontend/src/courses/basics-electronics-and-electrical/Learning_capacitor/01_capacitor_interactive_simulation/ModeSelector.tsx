"use client";

import type { CircuitMode } from "./types";

export function ModeSelector({
  mode,
  setMode,
}: {
  mode: CircuitMode;
  setMode: (value: CircuitMode) => void;
}) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-100">
      <button
        onClick={() => setMode("charge")}
        className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
          mode === "charge" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700"
        }`}
      >
        Charge
      </button>
      <button
        onClick={() => setMode("discharge")}
        className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
          mode === "discharge"
            ? "bg-orange-500 text-white shadow-sm"
            : "bg-white text-slate-700"
        }`}
      >
        Discharge
      </button>
    </div>
  );
}
