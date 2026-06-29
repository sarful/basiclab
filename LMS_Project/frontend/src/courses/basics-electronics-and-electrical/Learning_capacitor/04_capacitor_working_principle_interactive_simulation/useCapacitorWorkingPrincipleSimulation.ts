"use client";

import { useMemo, useState } from "react";

import { computeWorkingPrincipleSnapshot } from "./logic";
import type { WorkingMode } from "./types";

const DEFAULT_SUPPLY_VOLTAGE = 12;
const DEFAULT_RESISTANCE = 1000;
const DEFAULT_CAPACITANCE = 470;
const DEFAULT_TIME = 0.6;
const DEFAULT_MODE: WorkingMode = "charging";

export function useCapacitorWorkingPrincipleSimulation() {
  const [supplyVoltage, setSupplyVoltage] = useState(DEFAULT_SUPPLY_VOLTAGE);
  const [resistance, setResistance] = useState(DEFAULT_RESISTANCE);
  const [capacitance, setCapacitance] = useState(DEFAULT_CAPACITANCE);
  const [time, setTime] = useState(DEFAULT_TIME);
  const [mode, setMode] = useState<WorkingMode>(DEFAULT_MODE);

  const snapshot = useMemo(
    () =>
      computeWorkingPrincipleSnapshot({
        supplyVoltage,
        resistance,
        capacitance,
        time,
        mode,
      }),
    [supplyVoltage, resistance, capacitance, time, mode],
  );

  function resetSimulation() {
    setSupplyVoltage(DEFAULT_SUPPLY_VOLTAGE);
    setResistance(DEFAULT_RESISTANCE);
    setCapacitance(DEFAULT_CAPACITANCE);
    setTime(DEFAULT_TIME);
    setMode(DEFAULT_MODE);
  }

  return {
    supplyVoltage,
    setSupplyVoltage,
    resistance,
    setResistance,
    capacitance,
    setCapacitance,
    time,
    setTime,
    mode,
    setMode,
    snapshot,
    resetSimulation,
  };
}
