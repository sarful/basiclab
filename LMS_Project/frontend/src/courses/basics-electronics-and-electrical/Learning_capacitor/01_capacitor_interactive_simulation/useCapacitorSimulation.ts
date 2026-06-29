"use client";

import { useMemo, useState } from "react";

import { computeCapacitorSnapshot } from "./logic";
import type { CircuitMode } from "./types";

export function useCapacitorSimulation() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [capacitance, setCapacitance] = useState(470);
  const [resistance, setResistance] = useState(1000);
  const [time, setTime] = useState(1);
  const [mode, setMode] = useState<CircuitMode>("charge");

  const snapshot = useMemo(
    () =>
      computeCapacitorSnapshot({
        supplyVoltage,
        capacitance,
        resistance,
        time,
        mode,
      }),
    [supplyVoltage, capacitance, resistance, time, mode],
  );

  function resetCircuit() {
    setSupplyVoltage(12);
    setCapacitance(470);
    setResistance(1000);
    setTime(1);
    setMode("charge");
  }

  return {
    supplyVoltage,
    capacitance,
    resistance,
    time,
    mode,
    snapshot,
    setSupplyVoltage,
    setCapacitance,
    setResistance,
    setTime,
    setMode,
    resetCircuit,
  };
}
