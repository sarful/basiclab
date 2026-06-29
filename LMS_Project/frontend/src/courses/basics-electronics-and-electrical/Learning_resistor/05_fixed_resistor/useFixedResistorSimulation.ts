"use client";

import { useMemo, useState } from "react";

import { fixedTypes } from "./fixedTypeDefinitions";
import type { FixedResistorLessonFiveSimulationProps, FixedTypeKey } from "./types";

export function useFixedResistorSimulation() {
  const [typeKey, setTypeKey] = useState<FixedTypeKey>("metalFilm");
  const [resistance, setResistance] = useState(1000);
  const [voltage, setVoltage] = useState(5);
  const [tolerance, setTolerance] = useState(1);
  const [powerRating, setPowerRating] = useState(0.25);

  const selected = fixedTypes.find((item) => item.key === typeKey) || fixedTypes[1];
  const current = voltage / resistance;
  const power = current * current * resistance;
  const minValue = resistance * (1 - tolerance / 100);
  const maxValue = resistance * (1 + tolerance / 100);
  const isOverloaded = power > powerRating;

  const recommendedPower = useMemo(() => {
    if (power <= 0.125) return "1/4W recommended";
    if (power <= 0.25) return "1/2W recommended";
    if (power <= 0.5) return "1W recommended";
    if (power <= 1) return "2W recommended";
    return "High watt resistor needed";
  }, [power]);

  function applyType(key: FixedTypeKey) {
    const next = fixedTypes.find((item) => item.key === key) || fixedTypes[1];
    setTypeKey(key);
    setTolerance(next.toleranceOptions[0]);
    setPowerRating(next.powerOptions[0]);
  }

  return {
    typeKey,
    resistance,
    voltage,
    tolerance,
    powerRating,
    selected,
    current,
    power,
    minValue,
    maxValue,
    isOverloaded,
    recommendedPower,
    setResistance,
    setVoltage,
    setTolerance,
    setPowerRating,
    applyType,
  };
}
