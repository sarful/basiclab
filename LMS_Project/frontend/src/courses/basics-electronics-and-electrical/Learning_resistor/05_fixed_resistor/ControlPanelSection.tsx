"use client";

import { FixedTypeSelector } from "./FixedTypeSelector";
import { PowerRatingSelector } from "./PowerRatingSelector";
import { ResistanceSelector } from "./ResistanceSelector";
import { ToleranceSelector } from "./ToleranceSelector";
import { VoltageSlider } from "./VoltageSlider";
import type { FixedType, FixedTypeKey } from "./types";

export function ControlPanelSection({
  fixedTypes,
  selected,
  resistance,
  voltage,
  tolerance,
  powerRating,
  onTypeChange,
  onResistanceChange,
  onVoltageChange,
  onToleranceChange,
  onPowerRatingChange,
}: {
  fixedTypes: FixedType[];
  selected: FixedType;
  resistance: number;
  voltage: number;
  tolerance: number;
  powerRating: number;
  onTypeChange: (key: FixedTypeKey) => void;
  onResistanceChange: (value: number) => void;
  onVoltageChange: (value: number) => void;
  onToleranceChange: (value: number) => void;
  onPowerRatingChange: (value: number) => void;
}) {
  return (
    <aside
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"
      aria-label="Fixed resistor simulation control panel"
    >
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
          Interactive Controls
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Control Panel</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Select a fixed resistor type, adjust circuit values, and observe how
          resistance, tolerance, voltage, and power rating affect resistor
          behavior.
        </p>
      </div>

      <div className="space-y-5">
        <section aria-label="Select fixed resistor type">
          <FixedTypeSelector
            fixedTypes={fixedTypes}
            selectedKey={selected.key}
            onTypeChange={onTypeChange}
          />
        </section>

        <section aria-label="Adjust resistance value">
          <ResistanceSelector
            resistance={resistance}
            onResistanceChange={onResistanceChange}
          />
        </section>

        <section aria-label="Adjust source voltage">
          <VoltageSlider voltage={voltage} onVoltageChange={onVoltageChange} />
        </section>

        <section aria-label="Select resistor tolerance">
          <ToleranceSelector
            tolerance={tolerance}
            toleranceOptions={selected.toleranceOptions}
            onToleranceChange={onToleranceChange}
          />
        </section>

        <section aria-label="Select resistor power rating">
          <PowerRatingSelector
            powerRating={powerRating}
            powerOptions={selected.powerOptions}
            onPowerRatingChange={onPowerRatingChange}
          />
        </section>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
        <p className="font-semibold text-slate-900">Learning Focus</p>
        <p className="mt-1 leading-6">
          Higher resistance reduces current. Higher voltage increases current. A
          suitable power rating prevents overheating.
        </p>
      </div>
    </aside>
  );
}
