"use client";

import { ColorSelect } from "./ColorSelect";
import { digitColors, multiplierColors, tempColors, toleranceColors } from "./logic";
import type { BandMode } from "./types";

export function ControlPanelSection({
  mode,
  band1,
  band2,
  band3,
  multiplier,
  tolerance,
  temp,
  onModeChange,
  onBand1Change,
  onBand2Change,
  onBand3Change,
  onMultiplierChange,
  onToleranceChange,
  onTempChange,
  onPresetApply,
}: {
  mode: BandMode;
  band1: string;
  band2: string;
  band3: string;
  multiplier: string;
  tolerance: string;
  temp: string;
  onModeChange: (mode: BandMode) => void;
  onBand1Change: (value: string) => void;
  onBand2Change: (value: string) => void;
  onBand3Change: (value: string) => void;
  onMultiplierChange: (value: string) => void;
  onToleranceChange: (value: string) => void;
  onTempChange: (value: string) => void;
  onPresetApply: (preset: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {[4, 5, 6].map((item) => (
          <button
            key={item}
            onClick={() => onModeChange(item as BandMode)}
            className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${mode === item ? "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 bg-white text-slate-700"}`}
          >
            {item}-Band
          </button>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2">
        <button onClick={() => onPresetApply("220")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          220Ω
        </button>
        <button onClick={() => onPresetApply("1k")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          1kΩ
        </button>
        <button onClick={() => onPresetApply("10k")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          10kΩ
        </button>
        <button onClick={() => onPresetApply("precision")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          1kΩ 1%
        </button>
      </div>

      <div className="space-y-4">
        <ColorSelect label="Band 1 / First digit" value={band1} options={digitColors.slice(1)} onChange={onBand1Change} />
        <ColorSelect label="Band 2 / Second digit" value={band2} options={digitColors} onChange={onBand2Change} />
        {mode >= 5 && <ColorSelect label="Band 3 / Third digit" value={band3} options={digitColors} onChange={onBand3Change} />}
        <ColorSelect label={mode === 4 ? "Band 3 / Multiplier" : "Band 4 / Multiplier"} value={multiplier} options={multiplierColors} onChange={onMultiplierChange} />
        <ColorSelect label={mode === 4 ? "Band 4 / Tolerance" : "Band 5 / Tolerance"} value={tolerance} options={toleranceColors} onChange={onToleranceChange} />
        {mode === 6 && <ColorSelect label="Band 6 / Temperature coefficient" value={temp} options={tempColors} onChange={onTempChange} />}
      </div>
    </div>
  );
}
