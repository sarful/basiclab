"use client";

import type {
  FlowMode,
  ZenerBiasMode,
  ZenerBreakdownState,
  ZenerLoadCondition,
  ZenerPreset,
} from "./zenerBreakdownTypes";

const LOAD_OPTIONS: Array<{ label: string; value: ZenerLoadCondition }> = [
  { label: "Light Load", value: "light" },
  { label: "Medium Load", value: "medium" },
  { label: "Heavy Load", value: "heavy" },
];

export default function ZenerBreakdownControlPanel({
  biasMode,
  flowMode,
  loadCondition,
  onBiasModeChange,
  onFlowModeChange,
  onLoadConditionChange,
  onReset,
  onSeriesResistanceChange,
  onSupplyVoltageChange,
  onZenerPresetChange,
  presetOptions,
  seriesResistance,
  state,
  supplyVoltage,
  zenerVoltage,
}: {
  biasMode: ZenerBiasMode;
  flowMode: FlowMode;
  loadCondition: ZenerLoadCondition;
  onBiasModeChange: (value: ZenerBiasMode) => void;
  onFlowModeChange: (value: FlowMode) => void;
  onLoadConditionChange: (value: ZenerLoadCondition) => void;
  onReset: () => void;
  onSeriesResistanceChange: (value: number) => void;
  onSupplyVoltageChange: (value: number) => void;
  onZenerPresetChange: (value: number) => void;
  presetOptions: ZenerPreset[];
  seriesResistance: number;
  state: ZenerBreakdownState;
  supplyVoltage: number;
  zenerVoltage: number;
}) {
  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-indigo-700">
            Control Panel
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Zener Regulator Lab
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tune the battery, resistor, diode selection, and bias direction to
            study real zener clamp behavior from the actual circuit values.
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
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Bias Mode
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {([
            ["reverse", "Reverse Bias"],
            ["forward", "Forward Bias"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onBiasModeChange(value)}
              className={`rounded-2xl border px-3 py-3 text-sm font-black ${
                biasMode === value
                  ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Flow Mode
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-[22px] border border-slate-200 bg-white p-1.5">
          {([
            ["conventional", "Conventional"],
            ["electron", "Electron"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onFlowModeChange(value)}
              className={`rounded-2xl px-3 py-3 text-sm font-black ${
                flowMode === value
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black text-slate-900">Supply Voltage</p>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
            {supplyVoltage.toFixed(1)}V
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={18}
          step={0.1}
          value={supplyVoltage}
          onChange={(event) => onSupplyVoltageChange(Number(event.target.value))}
          className="mt-4 w-full accent-indigo-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black text-slate-900">Series Resistance</p>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
            {seriesResistance} Ohm
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={1000}
          step={10}
          value={seriesResistance}
          onChange={(event) =>
            onSeriesResistanceChange(Number(event.target.value))
          }
          className="mt-4 w-full accent-indigo-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black text-slate-900">Zener Selection</p>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
            {zenerVoltage.toFixed(1)}V
          </span>
        </div>
        <select
          value={zenerVoltage}
          onChange={(event) => onZenerPresetChange(Number(event.target.value))}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none"
        >
          {presetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Load Condition
        </p>
        <div className="mt-3 grid gap-2">
          {LOAD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onLoadConditionChange(option.value)}
              className={`rounded-2xl border px-3 py-3 text-left text-sm font-black ${
                loadCondition === option.value
                  ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Bias State
          </p>
          <p className="mt-1 text-lg font-black text-slate-950">
            {state.biasState}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Circuit Region
          </p>
          <p className="mt-1 text-lg font-black text-slate-950">
            {state.regulationStatus}
          </p>
        </div>
      </div>
    </aside>
  );
}
