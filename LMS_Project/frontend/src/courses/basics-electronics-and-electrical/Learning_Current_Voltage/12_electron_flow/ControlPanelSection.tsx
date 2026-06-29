"use client";

import {
  MAX_RESISTANCE,
  MAX_VOLTAGE,
  MIN_RESISTANCE,
  MIN_VOLTAGE,
  VOLTAGE_PRESETS,
} from "./logic";
import { SlidersHorizontal } from "./icons";
import type { DirectionMode } from "./types";

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  accent: "red" | "slate";
}) {
  const accentClass = accent === "red" ? "accent-red-600" : "accent-slate-600";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-800">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`w-full ${accentClass}`}
      />
    </div>
  );
}

export function ControlPanelSection({
  voltage,
  resistance,
  directionMode,
  onVoltageChange,
  onResistanceChange,
  onDirectionChange,
}: {
  voltage: number;
  resistance: number;
  directionMode: DirectionMode;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
  onDirectionChange: (value: DirectionMode) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <SlidersHorizontal className="h-5 w-5 text-cyan-700" />
        </div>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Controls
          </div>
          <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-slate-950">
            Try the direction
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Change voltage, resistance, and direction mode to see how electron
            movement responds inside the same circuit.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <RangeControl
          label="Battery Voltage"
          value={voltage}
          min={MIN_VOLTAGE}
          max={MAX_VOLTAGE}
          step={0.5}
          unit="V"
          onChange={onVoltageChange}
          accent="red"
        />

        <RangeControl
          label="Resistance"
          value={resistance}
          min={MIN_RESISTANCE}
          max={MAX_RESISTANCE}
          step={0.5}
          unit="Ohm"
          onChange={onResistanceChange}
          accent="slate"
        />

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Quick voltage presets
          </p>
          <div className="grid grid-cols-5 gap-2">
            {VOLTAGE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onVoltageChange(preset)}
                className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                  voltage === preset
                    ? "border-cyan-500 bg-cyan-600 text-white shadow-md"
                    : "border-slate-300 bg-slate-50 text-slate-700 hover:border-cyan-500 hover:bg-cyan-50"
                }`}
              >
                {preset}V
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Direction Mode
          </p>
          <p className="mb-3 text-sm leading-6 text-slate-600">
            Compare real electron motion with the conventional direction used in
            most circuit diagrams.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDirectionChange("electron")}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                directionMode === "electron"
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              Electron Flow
            </button>

            <button
              type="button"
              onClick={() => onDirectionChange("conventional")}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                directionMode === "conventional"
                  ? "border-red-500 bg-red-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-red-50"
              }`}
            >
              Conventional
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
