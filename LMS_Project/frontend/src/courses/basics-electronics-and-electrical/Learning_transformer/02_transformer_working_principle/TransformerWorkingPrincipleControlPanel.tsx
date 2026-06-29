"use client";

import type {
  TransformerWorkingPrincipleFlowMode,
  TransformerWorkingPrinciplePreset,
  TransformerWorkingPrincipleState,
} from "./transformerWorkingPrincipleTypes";

function formatValue(value: number, digits = 1) {
  return Number(value.toFixed(digits)).toString();
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-cyan-700">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-600"
      />
      <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </label>
  );
}

function SegmentedToggle({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                active
                  ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-300"
                  : "text-slate-500 hover:bg-white hover:text-slate-700"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TransformerWorkingPrincipleControlPanel({
  state,
  onStateChange,
  onReset,
  onPreset,
}: {
  state: TransformerWorkingPrincipleState;
  onStateChange: (patch: Partial<TransformerWorkingPrincipleState>) => void;
  onReset: () => void;
  onPreset: (preset: TransformerWorkingPrinciplePreset) => void;
}) {
  const presets: {
    key: TransformerWorkingPrinciplePreset;
    label: string;
    tone: string;
  }[] = [
    { key: "step-down", label: "Step Down", tone: "border-cyan-500/40 text-cyan-300" },
    { key: "step-up", label: "Step Up", tone: "border-amber-500/40 text-amber-300" },
    { key: "isolation", label: "Isolation Mode", tone: "border-emerald-500/40 text-emerald-300" },
  ];
  const turnsRatio = state.secondaryTurns / Math.max(state.primaryTurns, 1);
  const idealOutputVoltage = state.inputVoltage * turnsRatio;
  const transformerMode =
    state.secondaryTurns === state.primaryTurns
      ? "Isolation"
      : state.secondaryTurns > state.primaryTurns
        ? "Step-Up"
        : "Step-Down";

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-cyan-700">
            Control Panel
          </p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900">
            Transformer Input Console
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tune the driving source and winding turns like an industrial
            commissioning station.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-5">
        <SliderField
          label="Input AC Voltage"
          value={state.inputVoltage}
          min={50}
          max={240}
          step={10}
          unit="V"
          onChange={(value) => onStateChange({ inputVoltage: value })}
        />
        <SliderField
          label="Primary Turns (N1)"
          value={state.primaryTurns}
          min={100}
          max={2000}
          step={20}
          unit="T"
          onChange={(value) => onStateChange({ primaryTurns: value })}
        />
        <SliderField
          label="Secondary Turns (N2)"
          value={state.secondaryTurns}
          min={50}
          max={2000}
          step={20}
          unit="T"
          onChange={(value) => onStateChange({ secondaryTurns: value })}
        />
        <SliderField
          label="Frequency"
          value={state.frequency}
          min={10}
          max={60}
          step={5}
          unit="Hz"
          onChange={(value) => onStateChange({ frequency: value })}
        />

        <SegmentedToggle
          label="Current Flow Mode"
          value={state.flowMode}
          options={[
            { value: "conventional", label: "Conventional" },
            { value: "electron", label: "Electron" },
          ]}
          onChange={(value) =>
            onStateChange({
              flowMode: value as TransformerWorkingPrincipleFlowMode,
            })
          }
        />
      </div>

      <div className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50/70 p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-cyan-700">
          Live Transformer Calculation
        </p>
        <div className="mt-3 grid gap-3 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-slate-500">Turns Ratio</span>
            <span className="font-bold text-cyan-700">
              N2 / N1 = {state.secondaryTurns} / {state.primaryTurns} = {formatValue(turnsRatio, 2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-slate-500">Ideal Output Voltage</span>
            <span className="font-bold text-amber-600">
              V2 = V1 x (N2 / N1) = {formatValue(idealOutputVoltage, 1)}V
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-slate-500">Primary Turns per Volt</span>
            <span className="font-bold text-violet-600">
              {formatValue(state.primaryTurns / Math.max(state.inputVoltage, 1), 2)} T/V
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-slate-500">Operating Mode</span>
            <span className="font-bold text-emerald-600">{transformerMode}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-500">
          Presets
        </p>
        <div className="mt-3 grid gap-3">
          {presets.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => onPreset(preset.key)}
              className={`rounded-2xl border bg-white px-4 py-3 text-left text-sm font-bold transition hover:bg-slate-50 ${preset.tone}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}
