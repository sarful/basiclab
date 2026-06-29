"use client";

import type { ClipperMode, FlowMode } from "./clipperTypes";
import type { ClipperState } from "./clipperTypes";

export default function ClipperCircuitControlPanel({
  clipLevel,
  flowMode,
  inputAmplitude,
  mode,
  onClipLevelChange,
  onFlowModeChange,
  onInputAmplitudeChange,
  onModeChange,
  onReset,
  onResistorValueChange,
  onShowDebugDotsChange,
  resistorValue,
  state,
  showDebugDots,
}: {
  clipLevel: number;
  flowMode: FlowMode;
  inputAmplitude: number;
  mode: ClipperMode;
  onClipLevelChange: (value: number) => void;
  onFlowModeChange: (value: FlowMode) => void;
  onInputAmplitudeChange: (value: number) => void;
  onModeChange: (value: ClipperMode) => void;
  onReset: () => void;
  onResistorValueChange: (value: number) => void;
  onShowDebugDotsChange: (value: boolean) => void;
  resistorValue: number;
  state: ClipperState;
  showDebugDots: boolean;
}) {
  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Control Panel
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Clipper Circuit Lab
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Compare positive and negative diode clipping from one training
            dashboard using the same source, resistor, and output reference.
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
          Circuit Selector
        </p>
        <div className="mt-3 grid gap-2">
          {([
            ["positive", "Positive Clipper"],
            ["negative", "Negative Clipper"],
            ["both", "Both Circuits"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onModeChange(value)}
              className={`rounded-2xl border px-3 py-3 text-left text-sm font-black ${
                mode === value
                  ? "border-blue-200 bg-blue-50 text-blue-800"
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

      {[
        {
          label: "Input Amplitude",
          value: `${inputAmplitude.toFixed(1)}Vpk`,
          min: 0.5,
          max: 12,
          step: 0.1,
          onChange: onInputAmplitudeChange,
          numericValue: inputAmplitude,
        },
        {
          label: "Clip Level",
          value: `${clipLevel.toFixed(1)}Vref`,
          min: 0.5,
          max: 6,
          step: 0.1,
          onChange: onClipLevelChange,
          numericValue: clipLevel,
        },
        {
          label: "Load Resistor",
          value: `${resistorValue} Ohm`,
          min: 220,
          max: 4700,
          step: 10,
          onChange: onResistorValueChange,
          numericValue: resistorValue,
        },
      ].map((control) => (
        <div key={control.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-slate-900">{control.label}</p>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
              {control.value}
            </span>
          </div>
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={control.numericValue}
            onChange={(event) => control.onChange(Number(event.target.value))}
            className="mt-4 w-full accent-blue-600"
          />
        </div>
      ))}

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
          Live Clipping Math
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Positive Limit
            </p>
            <p className="mt-1 text-lg font-black text-slate-950">
              +{state.positiveOutputMaximum.toFixed(1)}V
            </p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Negative Limit
            </p>
            <p className="mt-1 text-lg font-black text-slate-950">
              {state.negativeOutputMinimum.toFixed(1)}V
            </p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Diode Drop
            </p>
            <p className="mt-1 text-lg font-black text-slate-950">
              {state.diodeDrop.toFixed(1)}V
            </p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Active Clip Current
            </p>
            <p className="mt-1 text-lg font-black text-slate-950">
              {state.loadCurrentMilliAmps.toFixed(2)}mA
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-emerald-900">
          {state.summaryLine}
        </p>
        <div className="mt-3 grid gap-2">
          <div className="rounded-2xl border border-emerald-100 bg-white px-3 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700">
              Positive Clipper Equation
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-700">
              {state.positiveEquation}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white px-3 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700">
              Negative Clipper Equation
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-700">
              {state.negativeEquation}
            </p>
          </div>
        </div>
      </div>

      <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <div>
          <p className="text-sm font-black text-slate-900">Terminal Debug</p>
          <p className="mt-1 text-xs text-slate-500">
            Show DEBUG_TERMINAL_OFFSET markers while routing wires.
          </p>
        </div>
        <input
          type="checkbox"
          checked={showDebugDots}
          onChange={(event) => onShowDebugDotsChange(event.target.checked)}
          className="h-5 w-5 accent-blue-600"
        />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Flow Logic
        </p>
        <p className="mt-3 text-sm font-black text-slate-900">
          {flowMode === "conventional" ? "Conventional Flow" : "Electron Flow"}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          {state.currentDirectionLabel}
        </p>
        <div className="mt-3 grid gap-2">
          <div className="rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-slate-700">
            Active half-cycle: {state.activeHalfCycleLabel}
          </div>
          <div className="rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-slate-700">
            Bias state: {state.biasStateLabel}
          </div>
          <div className="rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-slate-700">
            Positive clipper: {state.positiveConductionState} above +{state.positiveClipThreshold.toFixed(1)}V with {state.positiveConductionCurrentMilliAmps.toFixed(2)}mA clip current
          </div>
          <div className="rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-slate-700">
            Negative clipper: {state.negativeConductionState} below {state.negativeClipThreshold.toFixed(1)}V with {state.negativeConductionCurrentMilliAmps.toFixed(2)}mA clip current
          </div>
        </div>
      </div>
    </aside>
  );
}
