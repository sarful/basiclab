"use client";

import { useMemo, useState } from "react";

import { computeStructureSnapshot, dielectricOptions } from "./logic";

const DEFAULT_PLATE_AREA = 40;
const DEFAULT_PLATE_DISTANCE = 8;
const DEFAULT_DIELECTRIC_INDEX = 1;
const DEFAULT_SHOW_FIELD = true;

export function useCapacitorStructureSimulation() {
  const [plateArea, setPlateArea] = useState(DEFAULT_PLATE_AREA);
  const [plateDistance, setPlateDistance] = useState(DEFAULT_PLATE_DISTANCE);
  const [dielectricIndex, setDielectricIndex] = useState(DEFAULT_DIELECTRIC_INDEX);
  const [showField, setShowField] = useState(DEFAULT_SHOW_FIELD);

  const dielectric = dielectricOptions[dielectricIndex];
  const snapshot = useMemo(
    () =>
      computeStructureSnapshot({
        plateArea,
        plateDistance,
        dielectricK: dielectric.k,
      }),
    [dielectric.k, plateArea, plateDistance],
  );

  function resetSimulation() {
    setPlateArea(DEFAULT_PLATE_AREA);
    setPlateDistance(DEFAULT_PLATE_DISTANCE);
    setDielectricIndex(DEFAULT_DIELECTRIC_INDEX);
    setShowField(DEFAULT_SHOW_FIELD);
  }

  return {
    plateArea,
    setPlateArea,
    plateDistance,
    setPlateDistance,
    dielectricIndex,
    setDielectricIndex,
    showField,
    setShowField,
    dielectric,
    snapshot,
    resetSimulation,
  };
}
