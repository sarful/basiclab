"use client";

import { useMemo, useState } from "react";

import { computeComparisonSnapshot } from "./logic";

const DEFAULT_VOLTAGE = 12;
const DEFAULT_REVERSE = false;
const DEFAULT_FREQUENCY = 1000;

export function useCapacitorComparisonSimulation() {
  const [voltage, setVoltage] = useState(DEFAULT_VOLTAGE);
  const [reverse, setReverse] = useState(DEFAULT_REVERSE);
  const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);

  const snapshot = useMemo(
    () =>
      computeComparisonSnapshot({
        voltage,
        frequency,
      }),
    [frequency, voltage],
  );

  function resetSimulation() {
    setVoltage(DEFAULT_VOLTAGE);
    setReverse(DEFAULT_REVERSE);
    setFrequency(DEFAULT_FREQUENCY);
  }

  return {
    voltage,
    setVoltage,
    reverse,
    setReverse,
    frequency,
    setFrequency,
    snapshot,
    resetSimulation,
  };
}
