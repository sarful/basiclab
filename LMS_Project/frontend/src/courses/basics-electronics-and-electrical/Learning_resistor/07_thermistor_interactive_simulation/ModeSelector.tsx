"use client";

import type { ThermistorMode } from "./types";

export function ModeSelector({
  mode,
  onModeChange,
}: {
  mode: ThermistorMode;
  onModeChange: (mode: ThermistorMode) => void;
}) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button
        onClick={() => onModeChange("ntc")}
        className={`rounded-2xl border p-3 text-left transition ${
          mode === "ntc"
            ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200"
            : "border-slate-200 bg-white"
        }`}
      >
        <p className="font-semibold text-slate-900">NTC Thermistor</p>
        <p className="text-xs text-slate-600">Temp up {"->"} Resistance down</p>
      </button>
      <button
        onClick={() => onModeChange("ptc")}
        className={`rounded-2xl border p-3 text-left transition ${
          mode === "ptc"
            ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200"
            : "border-slate-200 bg-white"
        }`}
      >
        <p className="font-semibold text-slate-900">PTC Thermistor</p>
        <p className="text-xs text-slate-600">Temp up {"->"} Resistance up</p>
      </button>
    </div>
  );
}
