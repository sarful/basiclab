"use client";

import { useMemo, useState } from "react";

import { computeCapacitanceSnapshot, dielectricOptions } from "./logic";

export function useCapacitanceSimulation() {
  const [plateArea, setPlateArea] = useState(45);
  const [plateDistance, setPlateDistance] = useState(6);
  const [dielectricIndex, setDielectricIndex] = useState(2);
  const [voltage, setVoltage] = useState(12);

  const dielectric = dielectricOptions[dielectricIndex];
  const snapshot = useMemo(
    () =>
      computeCapacitanceSnapshot({
        plateArea,
        plateDistance,
        dielectricK: dielectric.k,
        voltage,
      }),
    [plateArea, plateDistance, dielectric.k, voltage],
  );

  function resetSimulation() {
    setPlateArea(45);
    setPlateDistance(6);
    setDielectricIndex(2);
    setVoltage(12);
  }

  return {
    plateArea,
    plateDistance,
    dielectricIndex,
    voltage,
    dielectric,
    snapshot,
    setPlateArea,
    setPlateDistance,
    setDielectricIndex,
    setVoltage,
    resetSimulation,
  };
}
