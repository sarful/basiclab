"use client";

import { useState } from "react";

import type { BiasMode, Section } from "./types";

export function useDiodeWorkingPrincipleSimulation() {
  const [section, setSection] = useState<Section>("construction");
  const [bias, setBias] = useState<BiasMode>("forward");
  const [voltage, setVoltage] = useState(5);

  const reset = () => {
    setSection("construction");
    setBias("forward");
    setVoltage(5);
  };

  return {
    section,
    setSection,
    bias,
    setBias,
    voltage,
    setVoltage,
    reset,
  };
}
