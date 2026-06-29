"use client";

import { useMemo, useState } from "react";

import { computeVariableCapacitorSnapshot } from "./logic";

const DEFAULT_ROTATION = 90;
const DEFAULT_MIN_CAPACITANCE = 10;
const DEFAULT_MAX_CAPACITANCE = 365;
const DEFAULT_INDUCTANCE = 220;
const DEFAULT_PLATE_COUNT = 7;

export function useVariableCapacitorSimulation() {
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);
  const [minCapacitance, setMinCapacitance] = useState(DEFAULT_MIN_CAPACITANCE);
  const [maxCapacitance, setMaxCapacitance] = useState(DEFAULT_MAX_CAPACITANCE);
  const [inductanceUh, setInductanceUh] = useState(DEFAULT_INDUCTANCE);
  const [plateCount, setPlateCount] = useState(DEFAULT_PLATE_COUNT);

  const snapshot = useMemo(
    () =>
      computeVariableCapacitorSnapshot({
        rotation,
        minCapacitance,
        maxCapacitance,
        inductanceUh,
      }),
    [rotation, minCapacitance, maxCapacitance, inductanceUh],
  );

  function resetSimulation() {
    setRotation(DEFAULT_ROTATION);
    setMinCapacitance(DEFAULT_MIN_CAPACITANCE);
    setMaxCapacitance(DEFAULT_MAX_CAPACITANCE);
    setInductanceUh(DEFAULT_INDUCTANCE);
    setPlateCount(DEFAULT_PLATE_COUNT);
  }

  return {
    rotation,
    setRotation,
    minCapacitance,
    setMinCapacitance,
    maxCapacitance,
    setMaxCapacitance,
    inductanceUh,
    setInductanceUh,
    plateCount,
    setPlateCount,
    snapshot,
    resetSimulation,
  };
}
