"use client";

import { useMemo, useState } from "react";

import { materials } from "./logic";
import type {
  MaterialKey,
  ResistorLessonThreeSimulationProps,
  StructureMode,
} from "./types";

export function useResistorStructureSimulation() {
  const [mode, setMode] = useState<StructureMode>("cutaway");
  const [materialKey, setMaterialKey] = useState<MaterialKey>("metal-film");
  const [voltage, setVoltage] = useState(9);
  const [baseResistance, setBaseResistance] = useState(1000);
  const [temperature, setTemperature] = useState(25);
  const [rotation, setRotation] = useState(0);
  const [showComparison, setShowComparison] = useState(true);

  const material = useMemo(
    () => materials.find((item) => item.key === materialKey) ?? materials[1],
    [materialKey],
  );
  const resistance =
    baseResistance * material.resistanceFactor * (1 + (temperature - 25) * 0.004);
  const current = voltage / Math.max(resistance, 1);
  const power = voltage * current;

  function resetSimulation() {
    setMode("cutaway");
    setMaterialKey("metal-film");
    setVoltage(9);
    setBaseResistance(1000);
    setTemperature(25);
    setRotation(0);
    setShowComparison(true);
  }

  return {
    mode,
    materialKey,
    voltage,
    baseResistance,
    temperature,
    rotation,
    showComparison,
    material,
    resistance,
    current,
    power,
    setMode,
    setMaterialKey,
    setVoltage,
    setBaseResistance,
    setTemperature,
    setRotation,
    toggleComparison: () => setShowComparison((value) => !value),
    resetSimulation,
  };
}
