"use client";

import { ResistorSelectorGroup } from "./ResistorSelectorGroup";
import { SupplyVoltageSlider } from "./SupplyVoltageSlider";

export function ControlPanelSection({
  supplyVoltage,
  r1,
  r2,
  r3,
  showR3,
  onSetSupplyVoltage,
  onSetR1,
  onSetR2,
  onSetR3,
  onToggleR3,
}: {
  supplyVoltage: number;
  r1: number;
  r2: number;
  r3: number;
  showR3: boolean;
  onSetSupplyVoltage: (value: number) => void;
  onSetR1: (value: number) => void;
  onSetR2: (value: number) => void;
  onSetR3: (value: number) => void;
  onToggleR3: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <SupplyVoltageSlider
        supplyVoltage={supplyVoltage}
        onSetSupplyVoltage={onSetSupplyVoltage}
      />
      <ResistorSelectorGroup
        r1={r1}
        r2={r2}
        r3={r3}
        showR3={showR3}
        onSetR1={onSetR1}
        onSetR2={onSetR2}
        onSetR3={onSetR3}
        onToggleR3={onToggleR3}
      />
    </div>
  );
}
