"use client";

import { useMemo, useState } from "react";

import { getZenerBreakdownState } from "./zenerBreakdownLogic";
import type {
  FlowMode,
  ZenerBiasMode,
  ZenerLoadCondition,
  ZenerPreset,
} from "./zenerBreakdownTypes";

export const ZENER_PRESETS: ZenerPreset[] = [
  { label: "3.3V Zener", value: 3.3 },
  { label: "4.7V Zener", value: 4.7 },
  { label: "5.1V Zener", value: 5.1 },
  { label: "6.2V Zener", value: 6.2 },
  { label: "9.1V Zener", value: 9.1 },
  { label: "12V Zener", value: 12 },
];

export function useZenerSimulation() {
  const [voltage, setVoltage] = useState(9);
  const [zenerVoltage, setZenerVoltage] = useState(5.1);
  const [seriesResistance, setSeriesResistance] = useState(330);
  const [loadCondition, setLoadCondition] = useState<ZenerLoadCondition>("medium");
  const [biasMode, setBiasMode] = useState<ZenerBiasMode>("reverse");
  const [flowMode, setFlowMode] = useState<FlowMode>("conventional");

  const state = useMemo(
    () =>
      getZenerBreakdownState({
        biasMode,
        loadCondition,
        seriesResistance,
        supplyVoltage: voltage,
        zenerVoltage,
      }),
    [biasMode, loadCondition, seriesResistance, voltage, zenerVoltage],
  );

  const reset = () => {
    setVoltage(9);
    setZenerVoltage(5.1);
    setSeriesResistance(330);
    setLoadCondition("medium");
    setBiasMode("reverse");
    setFlowMode("conventional");
  };

  return {
    biasMode,
    flowMode,
    loadCondition,
    reset,
    seriesResistance,
    setBiasMode,
    setFlowMode,
    setLoadCondition,
    setSeriesResistance,
    setVoltage,
    setZenerVoltage,
    state,
    voltage,
    zenerVoltage,
  };
}
