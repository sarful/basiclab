"use client";

import { ColorSelect } from "./ColorSelect";
import { digitColors, multiplierColors, tempColors, toleranceColors } from "./logic";
import type { BandMode } from "./types";

export function BandSelectorGroup({
  mode,
  band1,
  band2,
  band3,
  multiplier,
  tolerance,
  temp,
  onBand1Change,
  onBand2Change,
  onBand3Change,
  onMultiplierChange,
  onToleranceChange,
  onTempChange,
}: {
  mode: BandMode;
  band1: string;
  band2: string;
  band3: string;
  multiplier: string;
  tolerance: string;
  temp: string;
  onBand1Change: (value: string) => void;
  onBand2Change: (value: string) => void;
  onBand3Change: (value: string) => void;
  onMultiplierChange: (value: string) => void;
  onToleranceChange: (value: string) => void;
  onTempChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <ColorSelect
        label="Band 1 / First digit"
        value={band1}
        options={digitColors.slice(1)}
        onChange={onBand1Change}
      />
      <ColorSelect
        label="Band 2 / Second digit"
        value={band2}
        options={digitColors}
        onChange={onBand2Change}
      />
      {mode >= 5 && (
        <ColorSelect
          label="Band 3 / Third digit"
          value={band3}
          options={digitColors}
          onChange={onBand3Change}
        />
      )}
      <ColorSelect
        label={mode === 4 ? "Band 3 / Multiplier" : "Band 4 / Multiplier"}
        value={multiplier}
        options={multiplierColors}
        onChange={onMultiplierChange}
      />
      <ColorSelect
        label={mode === 4 ? "Band 4 / Tolerance" : "Band 5 / Tolerance"}
        value={tolerance}
        options={toleranceColors}
        onChange={onToleranceChange}
      />
      {mode === 6 && (
        <ColorSelect
          label="Band 6 / Temperature coefficient"
          value={temp}
          options={tempColors}
          onChange={onTempChange}
        />
      )}
    </div>
  );
}
