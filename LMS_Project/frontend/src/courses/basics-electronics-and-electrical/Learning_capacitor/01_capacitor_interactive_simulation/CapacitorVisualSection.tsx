"use client";

import { CapacitorCircuitVisual } from "./CapacitorCircuitVisual";
import { ControlPanelSection } from "./ControlPanelSection";
import type { CircuitMode } from "./types";

export function CapacitorVisualSection({
  supplyVoltage,
  setSupplyVoltage,
  capacitance,
  setCapacitance,
  resistance,
  setResistance,
  time,
  setTime,
  maxTime,
  mode,
  setMode,
  storedCharge,
  resetCircuit,
  chargeLevel,
  capacitorVoltage,
  current,
  timeConstant,
}: {
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
  capacitance: number;
  setCapacitance: (value: number) => void;
  resistance: number;
  setResistance: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  maxTime: number;
  mode: CircuitMode;
  setMode: (value: CircuitMode) => void;
  storedCharge: number;
  resetCircuit: () => void;
  chargeLevel: number;
  capacitorVoltage: number;
  current: number;
  timeConstant: number;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        supplyVoltage={supplyVoltage}
        setSupplyVoltage={setSupplyVoltage}
        capacitance={capacitance}
        setCapacitance={setCapacitance}
        resistance={resistance}
        setResistance={setResistance}
        time={time}
        setTime={setTime}
        maxTime={maxTime}
        mode={mode}
        setMode={setMode}
        storedCharge={storedCharge}
        resetCircuit={resetCircuit}
      />

      <div className="lg:col-span-2">
        <CapacitorCircuitVisual
          supplyVoltage={supplyVoltage}
          resistance={resistance}
          capacitance={capacitance}
          chargeLevel={chargeLevel}
          capacitorVoltage={capacitorVoltage}
          current={current}
          mode={mode}
          timeConstant={timeConstant}
        />
      </div>
    </div>
  );
}
