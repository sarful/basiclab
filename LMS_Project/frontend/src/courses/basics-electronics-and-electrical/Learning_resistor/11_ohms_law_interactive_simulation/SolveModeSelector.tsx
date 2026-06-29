"use client";

import type { SolveMode } from "./types";

export function SolveModeSelector({
  mode,
  onModeChange,
  onReset,
}: {
  mode: SolveMode;
  onModeChange: (mode: SolveMode) => void;
  onReset: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
      {[
        { id: "current", label: "Solve Current (I)" },
        { id: "voltage", label: "Solve Voltage (V)" },
        { id: "resistance", label: "Solve Resistance (R)" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => onModeChange(item.id as SolveMode)}
          className={`w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-md transition hover:-translate-y-0.5 sm:w-auto sm:py-2 ${
            mode === item.id
              ? "bg-cyan-500 text-slate-950"
              : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          {item.label}
        </button>
      ))}
      <button
        onClick={onReset}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-md transition hover:-translate-y-0.5 hover:bg-slate-100 sm:w-auto sm:py-2"
      >
        Reset Default
      </button>
    </div>
  );
}
