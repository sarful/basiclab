"use client";

import type { DigitColor, MultiplierColor, Preset, TempCoeff, ToleranceColor } from "./types";

export function ControlPanelSection({
  mode,
  voltage,
  presets,
  digitColors,
  multiplierColors,
  toleranceColors,
  tempCoeffs,
  b1,
  b2,
  b3,
  mult,
  tol,
  tc,
  onModeChange,
  onVoltageChange,
  onPresetApply,
  onB1Change,
  onB2Change,
  onB3Change,
  onMultiplierChange,
  onToleranceChange,
  onTempCoeffChange,
}: {
  mode: 4 | 5 | 6;
  voltage: number;
  presets: Preset[];
  digitColors: DigitColor[];
  multiplierColors: MultiplierColor[];
  toleranceColors: ToleranceColor[];
  tempCoeffs: TempCoeff[];
  b1: DigitColor;
  b2: DigitColor;
  b3: DigitColor;
  mult: MultiplierColor;
  tol: ToleranceColor;
  tc: TempCoeff;
  onModeChange: (mode: 4 | 5 | 6) => void;
  onVoltageChange: (value: number) => void;
  onPresetApply: (preset: Preset) => void;
  onB1Change: (value: string) => void;
  onB2Change: (value: string) => void;
  onB3Change: (value: string) => void;
  onMultiplierChange: (value: string) => void;
  onToleranceChange: (value: string) => void;
  onTempCoeffChange: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold text-slate-950">Control Panel</h2>

        <div className="grid gap-2">
          {[4, 5, 6].map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m as 4 | 5 | 6)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                mode === m ? "bg-blue-600 text-white" : "bg-white text-slate-800 ring-1 ring-slate-200"
              }`}
            >
              {m}-Band Resistors
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="mb-3 text-sm font-semibold text-slate-700">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onPresetApply(preset)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <label className="block text-sm font-medium text-slate-800">Voltage: {voltage}V</label>
          <input type="range" min="1" max="20" value={voltage} onChange={(e) => onVoltageChange(Number(e.target.value))} className="mt-3 w-full accent-blue-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        <select className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" value={b1.name} onChange={(e) => onB1Change(e.target.value)}>
          {digitColors.slice(1).map((color) => <option key={color.name}>{color.name}</option>)}
        </select>
        <select className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" value={b2.name} onChange={(e) => onB2Change(e.target.value)}>
          {digitColors.map((color) => <option key={color.name}>{color.name}</option>)}
        </select>
        {mode > 4 && (
          <select className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" value={b3.name} onChange={(e) => onB3Change(e.target.value)}>
            {digitColors.map((color) => <option key={color.name}>{color.name}</option>)}
          </select>
        )}
        <select className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" value={mult.name} onChange={(e) => onMultiplierChange(e.target.value)}>
          {multiplierColors.map((color) => <option key={color.name}>{color.name}</option>)}
        </select>
        <select className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" value={tol.name} onChange={(e) => onToleranceChange(e.target.value)}>
          {toleranceColors.map((color) => <option key={color.name}>{color.name}</option>)}
        </select>
        {mode === 6 && (
          <select className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" value={tc.name} onChange={(e) => onTempCoeffChange(e.target.value)}>
            {tempCoeffs.map((color) => <option key={color.name}>{color.name}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}
