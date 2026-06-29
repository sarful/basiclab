"use client";

import { useEffect, useMemo, useState } from "react";

import {
  FIXED_FREQUENCY_HZ,
  getHalfWaveState,
  runSimulationTests,
} from "./logic";
import type { DiodeType } from "./types";

export function useHalfWaveRectifierSimulation() {
  const [acVoltage, setAcVoltage] = useState(10);
  const [loadOhm, setLoadOhm] = useState(1000);
  const [diodeType, setDiodeType] = useState<DiodeType>("standard");
  const [timeCursor, setTimeCursor] = useState(0.14);
  const [autoRun, setAutoRun] = useState(false);

  useEffect(() => {
    runSimulationTests();
  }, []);

  useEffect(() => {
    if (!autoRun) return undefined;
    const interval = window.setInterval(() => {
      setTimeCursor((value) => (value + 0.006) % 1);
    }, 35);
    return () => window.clearInterval(interval);
  }, [autoRun]);

  const state = useMemo(
    () =>
      getHalfWaveState(
        acVoltage,
        FIXED_FREQUENCY_HZ,
        loadOhm,
        diodeType,
        timeCursor,
      ),
    [acVoltage, loadOhm, diodeType, timeCursor],
  );

  return {
    acVoltage,
    setAcVoltage,
    loadOhm,
    setLoadOhm,
    diodeType,
    setDiodeType,
    timeCursor,
    setTimeCursor,
    autoRun,
    setAutoRun,
    state,
  };
}
