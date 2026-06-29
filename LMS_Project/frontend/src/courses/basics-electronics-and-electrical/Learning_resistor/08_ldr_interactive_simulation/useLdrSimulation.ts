"use client";

import { useMemo, useState } from "react";

import { calculateLdrResistance, clamp } from "./logic";

export function useLdrSimulation() {
  const [lightPercent, setLightPercent] = useState(35);
  const [darkResistance, setDarkResistance] = useState(100000);
  const [fixedResistor, setFixedResistor] = useState(10000);
  const [voltage, setVoltage] = useState(5);

  const resistance = useMemo(
    () => calculateLdrResistance(lightPercent, darkResistance),
    [lightPercent, darkResistance],
  );
  const current = voltage / Math.max(resistance + fixedResistor, 1);
  const outputVoltage = voltage * (resistance / (fixedResistor + resistance));
  const lampLevel = clamp(outputVoltage / Math.max(voltage, 1), 0, 1);
  const lampStatus =
    lampLevel > 0.65
      ? { label: "LIGHT ON", tone: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" }
      : lampLevel > 0.25
        ? { label: "DIM / TRANSITION", tone: "text-orange-600", bg: "bg-orange-50 border-orange-200" }
        : { label: "LIGHT OFF", tone: "text-slate-700", bg: "bg-slate-50 border-slate-200" };

  return {
    lightPercent,
    darkResistance,
    fixedResistor,
    voltage,
    resistance,
    current,
    outputVoltage,
    lampStatus,
    setLightPercent,
    setDarkResistance,
    setFixedResistor,
    setVoltage,
  };
}
