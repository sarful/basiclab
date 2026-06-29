"use client";

import { BandModeSelector } from "./BandModeSelector";
import { BandSelectorGroup } from "./BandSelectorGroup";
import { PresetButtons } from "./PresetButtons";
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

      <BandModeSelector mode={mode} onModeChange={onModeChange} />
      <PresetButtons onPresetApply={onPresetApply} />
      <BandSelectorGroup
        mode={mode}
        band1={band1}
        band2={band2}
        band3={band3}
        multiplier={multiplier}
        tolerance={tolerance}
        temp={temp}
        onBand1Change={onBand1Change}
        onBand2Change={onBand2Change}
        onBand3Change={onBand3Change}
        onMultiplierChange={onMultiplierChange}
        onToleranceChange={onToleranceChange}
        onTempChange={onTempChange}
      />
    </div>
  );
}
