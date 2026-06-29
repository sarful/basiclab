"use client";

import {
  MAX_RESISTANCE,
  MAX_VOLTAGE,
  MIN_RESISTANCE,
  MIN_VOLTAGE,
  VOLTAGE_PRESETS,
} from "./logic";
import { SlidersHorizontalIcon } from "./icons";
import { IndustrialHeader, RangeControl } from "./ui";

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
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <IndustrialHeader
        code="PANEL-01"
        title="Control Panel"
        subtitle="Adjust voltage and resistance to change current."
        icon={<SlidersHorizontalIcon className="h-5 w-5 text-cyan-700" />}
      />

      <div className="mt-4 space-y-4">
        <RangeControl
          label="Battery Voltage"
          value={voltage}
          min={MIN_VOLTAGE}
          max={MAX_VOLTAGE}
          step={0.5}
          unit="V"
          onChange={onVoltageChange}
          tone="red"
        />

        <RangeControl
          label="Resistance"
          value={resistance}
          min={MIN_RESISTANCE}
          max={MAX_RESISTANCE}
          step={0.5}
          unit="Ohm"
          onChange={onResistanceChange}
          tone="slate"
        />

        <div className="grid grid-cols-5 gap-2">
          {VOLTAGE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onVoltageChange(preset)}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                voltage === preset
                  ? "border-blue-500 bg-blue-600 text-white shadow-md"
                  : "border-slate-300 bg-slate-50 text-slate-700 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              {preset}V
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
