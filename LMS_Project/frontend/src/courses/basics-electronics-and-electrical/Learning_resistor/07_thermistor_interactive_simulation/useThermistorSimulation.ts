"use client";

import { useMemo, useState } from "react";

import { calculateThermistorResistance } from "./logic";
import type { ThermistorLessonSevenSimulationProps, ThermistorMode } from "./types";

export function useThermistorSimulation() {
  const [mode, setMode] = useState<ThermistorMode>("ntc");
  const [temperature, setTemperature] = useState(25);
  const [nominalResistance, setNominalResistance] = useState(10000);
  const [voltage, setVoltage] = useState(5);

  const resistance = useMemo(
    () => calculateThermistorResistance(mode, nominalResistance, temperature),
    [mode, nominalResistance, temperature],
  );
  const current = voltage / Math.max(resistance, 1);
  const status =
    temperature > 85
      ? { label: "HIGH TEMP", tone: "text-red-600", bg: "bg-red-50 border-red-200" }
      : temperature > 55
        ? { label: "WARM", tone: "text-orange-600", bg: "bg-orange-50 border-orange-200" }
        : { label: "NORMAL", tone: "text-green-600", bg: "bg-green-50 border-green-200" };

  return {
    mode,
    temperature,
    nominalResistance,
    voltage,
    resistance,
    current,
    status,
    setMode,
    setTemperature,
    setNominalResistance,
    setVoltage,
  };
}
