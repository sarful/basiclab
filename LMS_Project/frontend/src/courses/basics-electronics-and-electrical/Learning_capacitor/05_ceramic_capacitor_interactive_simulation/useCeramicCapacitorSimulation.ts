"use client";

import { useMemo, useState } from "react";

import { computeCeramicSnapshot, dielectricOptions } from "./logic";

const DEFAULT_CODE = "104";
const DEFAULT_DIELECTRIC_INDEX = 1;
const DEFAULT_APPLIED_VOLTAGE = 5;
const DEFAULT_VOLTAGE_RATING = 50;
const DEFAULT_FREQUENCY = 1000;

export function useCeramicCapacitorSimulation() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [dielectricIndex, setDielectricIndex] = useState(DEFAULT_DIELECTRIC_INDEX);
  const [appliedVoltage, setAppliedVoltage] = useState(DEFAULT_APPLIED_VOLTAGE);
  const [voltageRating, setVoltageRating] = useState(DEFAULT_VOLTAGE_RATING);
  const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);

  const dielectric = dielectricOptions[dielectricIndex];
  const snapshot = useMemo(
    () =>
      computeCeramicSnapshot({
        code,
        dielectric,
        appliedVoltage,
        voltageRating,
        frequency,
      }),
    [appliedVoltage, code, dielectric, frequency, voltageRating],
  );

  function resetSimulation() {
    setCode(DEFAULT_CODE);
    setDielectricIndex(DEFAULT_DIELECTRIC_INDEX);
    setAppliedVoltage(DEFAULT_APPLIED_VOLTAGE);
    setVoltageRating(DEFAULT_VOLTAGE_RATING);
    setFrequency(DEFAULT_FREQUENCY);
  }

  return {
    code,
    setCode,
    dielectricIndex,
    setDielectricIndex,
    appliedVoltage,
    setAppliedVoltage,
    voltageRating,
    setVoltageRating,
    frequency,
    setFrequency,
    dielectric,
    snapshot,
    resetSimulation,
  };
}
