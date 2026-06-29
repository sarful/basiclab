"use client";

import { ControlPanelSection } from "./ControlPanelSection";
import { VoltageDropCircuit } from "./VoltageDropCircuit";

export function VoltageDropVisualSection({
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
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        supplyVoltage={supplyVoltage}
        r1={r1}
        r2={r2}
        r3={r3}
        showR3={showR3}
        onSetSupplyVoltage={onSetSupplyVoltage}
        onSetR1={onSetR1}
        onSetR2={onSetR2}
        onSetR3={onSetR3}
        onToggleR3={onToggleR3}
      />

      <div className="lg:col-span-2">
        <VoltageDropCircuit
          supplyVoltage={supplyVoltage}
          r1={r1}
          r2={r2}
          r3={r3}
          showR3={showR3}
        />
      </div>
    </div>
  );
}
