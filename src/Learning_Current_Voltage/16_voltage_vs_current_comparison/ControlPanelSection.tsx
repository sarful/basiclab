"use client";

import {
  MAX_RESISTANCE,
  MAX_VOLTAGE,
  MIN_RESISTANCE,
  MIN_VOLTAGE,
} from "./logic";
import { SlidersHorizontal } from "./icons";

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
  onVoltageChange,
  onResistanceChange,
}: {
  voltage: number;
  resistance: number;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <SlidersHorizontal className="h-5 w-5 text-cyan-700" />
        </div>
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Controls
          </div>
          <h2 className="mt-4 text-[1.8rem] font-semibold leading-tight text-slate-950">
            Try the lesson values
          </h2>
          <p className="mt-2 text-base leading-7 text-slate-600">
            Adjust voltage and resistance to see how the push and the flow change
            together.
          </p>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Live
        </div>
      </div>

      <div className="mt-6 space-y-5 border-t border-slate-200 pt-6">
        <RangeControl
          label="Voltage Push"
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
      </div>
    </section>
  );
}
