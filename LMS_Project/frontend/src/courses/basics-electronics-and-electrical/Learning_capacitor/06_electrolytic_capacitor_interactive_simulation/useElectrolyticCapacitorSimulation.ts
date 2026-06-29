"use client";

import { useMemo, useState } from "react";

import { computeElectrolyticSnapshot } from "./logic";
import type { PolarityMode } from "./types";

const DEFAULT_CAPACITANCE = 470;
const DEFAULT_VOLTAGE_RATING = 25;
const DEFAULT_APPLIED_VOLTAGE = 12;
const DEFAULT_ESR = 0.22;
const DEFAULT_RIPPLE_CURRENT = 0.4;
const DEFAULT_POLARITY: PolarityMode = "correct";

export function useElectrolyticCapacitorSimulation() {
  const [capacitance, setCapacitance] = useState(DEFAULT_CAPACITANCE);
  const [voltageRating, setVoltageRating] = useState(DEFAULT_VOLTAGE_RATING);
  const [appliedVoltage, setAppliedVoltage] = useState(DEFAULT_APPLIED_VOLTAGE);
  const [esr, setEsr] = useState(DEFAULT_ESR);
  const [rippleCurrent, setRippleCurrent] = useState(DEFAULT_RIPPLE_CURRENT);
  const [polarity, setPolarity] = useState<PolarityMode>(DEFAULT_POLARITY);

  const snapshot = useMemo(
    () =>
      computeElectrolyticSnapshot({
        capacitance,
        voltageRating,
        appliedVoltage,
        esr,
        rippleCurrent,
        polarity,
      }),
    [appliedVoltage, capacitance, esr, polarity, rippleCurrent, voltageRating],
  );

  function resetSimulation() {
    setCapacitance(DEFAULT_CAPACITANCE);
    setVoltageRating(DEFAULT_VOLTAGE_RATING);
    setAppliedVoltage(DEFAULT_APPLIED_VOLTAGE);
    setEsr(DEFAULT_ESR);
    setRippleCurrent(DEFAULT_RIPPLE_CURRENT);
    setPolarity(DEFAULT_POLARITY);
  }

  return {
    capacitance,
    setCapacitance,
    voltageRating,
    setVoltageRating,
    appliedVoltage,
    setAppliedVoltage,
    esr,
    setEsr,
    rippleCurrent,
    setRippleCurrent,
    polarity,
    setPolarity,
    snapshot,
    resetSimulation,
  };
}
