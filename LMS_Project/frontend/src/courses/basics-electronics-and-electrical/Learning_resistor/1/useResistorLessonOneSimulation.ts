"use client";

import { useMemo, useState } from "react";

import { materials } from "./resistorLessonOneData";
import type { FlowMode, MaterialKey, ViewMode } from "./types";

export function useResistorLessonOneSimulation() {
  const [mode, setMode] = useState<ViewMode>("cutaway");
  const [materialKey, setMaterialKey] = useState<MaterialKey>("metalFilm");
  const [voltage, setVoltage] = useState(9);
  const [baseResistance, setBaseResistance] = useState(1000);
  const [temperature, setTemperature] = useState(25);
  const [rotation, setRotation] = useState(0);
  const [flowMode, setFlowMode] = useState<FlowMode>("electron");
  const [showComparison, setShowComparison] = useState(true);

  const material = useMemo(
    () => materials.find((item) => item.key === materialKey) || materials[1],
    [materialKey],
  );

  const resistance =
    baseResistance *
    material.resistanceFactor *
    (1 + (temperature - 25) * material.tempCoefficient);
  const current = voltage / resistance;
  const power = voltage * current;

  function resetSimulation() {
    setMode("cutaway");
    setMaterialKey("metalFilm");
    setVoltage(9);
    setBaseResistance(1000);
    setTemperature(25);
    setRotation(0);
    setFlowMode("electron");
    setShowComparison(true);
  }

  return {
    mode,
    material,
    voltage,
    baseResistance,
    temperature,
    rotation,
    flowMode,
    showComparison,
    resistance,
    current,
    power,
    resetSimulation,
    setMode,
    setMaterialKey,
    setVoltage,
    setBaseResistance,
    setTemperature,
    setRotation,
    setFlowMode,
    setShowComparison,
    toggleComparison: () => setShowComparison((value) => !value),
  };
}
