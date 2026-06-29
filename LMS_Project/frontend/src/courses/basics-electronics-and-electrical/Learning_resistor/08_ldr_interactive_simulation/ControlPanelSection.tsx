"use client";

import { DarkResistanceSelector } from "./DarkResistanceSelector";
import { FixedResistorSelector } from "./FixedResistorSelector";
import { LightIntensitySlider } from "./LightIntensitySlider";
import { SupplyVoltageSlider } from "./SupplyVoltageSlider";

export function ControlPanelSection({
  lightPercent,
  darkResistance,
  fixedResistor,
  voltage,
  onLightPercentChange,
  onDarkResistanceChange,
  onFixedResistorChange,
  onVoltageChange,
}: {
  lightPercent: number;
  darkResistance: number;
  fixedResistor: number;
  voltage: number;
  onLightPercentChange: (value: number) => void;
  onDarkResistanceChange: (value: number) => void;
  onFixedResistorChange: (value: number) => void;
  onVoltageChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <LightIntensitySlider
        lightPercent={lightPercent}
        onLightPercentChange={onLightPercentChange}
      />
      <DarkResistanceSelector
        darkResistance={darkResistance}
        onDarkResistanceChange={onDarkResistanceChange}
      />
      <FixedResistorSelector
        fixedResistor={fixedResistor}
        onFixedResistorChange={onFixedResistorChange}
      />
      <SupplyVoltageSlider voltage={voltage} onVoltageChange={onVoltageChange} />
    </div>
  );
}
