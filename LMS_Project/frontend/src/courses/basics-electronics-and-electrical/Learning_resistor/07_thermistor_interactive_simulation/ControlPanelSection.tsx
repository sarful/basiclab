"use client";

import { ModeSelector } from "./ModeSelector";
import { NominalResistanceSelector } from "./NominalResistanceSelector";
import { SupplyVoltageSlider } from "./SupplyVoltageSlider";
import { TemperatureSlider } from "./TemperatureSlider";
import type { ThermistorMode } from "./types";

export function ControlPanelSection({
  mode,
  temperature,
  nominalResistance,
  voltage,
  onModeChange,
  onTemperatureChange,
  onNominalResistanceChange,
  onVoltageChange,
}: {
  mode: ThermistorMode;
  temperature: number;
  nominalResistance: number;
  voltage: number;
  onModeChange: (mode: ThermistorMode) => void;
  onTemperatureChange: (value: number) => void;
  onNominalResistanceChange: (value: number) => void;
  onVoltageChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <ModeSelector mode={mode} onModeChange={onModeChange} />
      <TemperatureSlider
        temperature={temperature}
        onTemperatureChange={onTemperatureChange}
      />
      <NominalResistanceSelector
        nominalResistance={nominalResistance}
        onNominalResistanceChange={onNominalResistanceChange}
      />
      <SupplyVoltageSlider voltage={voltage} onVoltageChange={onVoltageChange} />
    </div>
  );
}
