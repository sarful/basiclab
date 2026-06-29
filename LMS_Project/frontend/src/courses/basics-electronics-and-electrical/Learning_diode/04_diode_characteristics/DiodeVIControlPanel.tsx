"use client";

import type { DiodeBiasMode, DiodeMode } from "./diodeVITypes";

const MODE_OPTIONS: { value: DiodeMode; label: string; hint: string }[] = [
  { value: "silicon", label: "Silicon", hint: "Typical 0.7V knee" },
  { value: "germanium", label: "Germanium", hint: "Lower barrier diode" },
  { value: "schottky", label: "Schottky", hint: "Fast low-drop diode" },
];

export default function DiodeVIControlPanel({
  biasMode,
  currentScale,
  diodeMode,
  onBiasModeChange,
  onCurrentScaleChange,
  onDiodeModeChange,
  onReset,
  onVoltageChange,
  voltage,
}: {
  biasMode: DiodeBiasMode;
  currentScale: number;
  diodeMode: DiodeMode;
  onBiasModeChange: (value: DiodeBiasMode) => void;
  onCurrentScaleChange: (value: number) => void;
  onDiodeModeChange: (value: DiodeMode) => void;
  onReset: () => void;
  onVoltageChange: (value: number) => void;
  voltage: number;
}) {
  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
            Control Panel
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Diode V-I Lab</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sweep voltage, switch bias direction, and compare diode families against the live operating point.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-slate-700"
        >
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black text-slate-900">Applied Voltage</p>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
            {voltage.toFixed(1)}V
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="12"
          step="0.1"
          value={voltage}
          onChange={(event) => onVoltageChange(Number(event.target.value))}
          className="mt-4 w-full accent-blue-600"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Bias Mode
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["forward", "reverse"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onBiasModeChange(mode)}
                className={`rounded-2xl border px-3 py-3 text-sm font-black ${
                  biasMode === mode
                    ? "border-blue-200 bg-blue-50 text-blue-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {mode === "forward" ? "Forward" : "Reverse"}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Current Scale
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-slate-700">Sensitivity</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              {currentScale.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={currentScale}
            onChange={(event) => onCurrentScaleChange(Number(event.target.value))}
            className="mt-4 w-full accent-orange-500"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Diode Mode
        </p>
        <div className="mt-3 grid gap-2">
          {MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onDiodeModeChange(option.value)}
              className={`rounded-2xl border px-4 py-3 text-left ${
                diodeMode === option.value
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <p className="text-sm font-black">{option.label}</p>
              <p className="mt-1 text-xs text-inherit/80">{option.hint}</p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
