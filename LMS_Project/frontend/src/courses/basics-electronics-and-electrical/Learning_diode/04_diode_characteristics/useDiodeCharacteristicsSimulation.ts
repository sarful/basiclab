"use client";

import { useState } from "react";

import type { Section } from "./types";
import type { DiodeBiasMode, DiodeMode } from "./diodeVITypes";

export function useDiodeCharacteristicsSimulation() {
  const [section, setSection] = useState<Section>("working");
  const [bias, setBias] = useState<DiodeBiasMode>("forward");
  const [voltage, setVoltage] = useState(12);
  const [diodeMode, setDiodeMode] = useState<DiodeMode>("silicon");
  const [currentScale, setCurrentScale] = useState(1);

  const reset = () => {
    setSection("working");
    setBias("forward");
    setVoltage(12);
    setDiodeMode("silicon");
    setCurrentScale(1);
  };

  return {
    section,
    setSection,
    bias,
    setBias,
    currentScale,
    diodeMode,
    reset,
    setCurrentScale,
    setDiodeMode,
    voltage,
    setVoltage,
  };
}
