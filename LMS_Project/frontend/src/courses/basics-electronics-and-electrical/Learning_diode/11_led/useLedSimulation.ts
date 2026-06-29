"use client";

import { useEffect, useMemo, useState } from "react";

import { getLedState, runSimulationTests } from "./logic";

export function useLedSimulation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [voltage, setVoltage] = useState(3.2);
  const [forwardVoltage, setForwardVoltage] = useState(2.0);
  const [hasResistor, setHasResistor] = useState(true);

  useEffect(() => {
    runSimulationTests();
  }, []);

  const state = useMemo(
    () => getLedState(voltage, forwardVoltage, hasResistor),
    [voltage, forwardVoltage, hasResistor],
  );

  return {
    isPlaying,
    setIsPlaying,
    resetKey,
    setResetKey,
    voltage,
    setVoltage,
    forwardVoltage,
    setForwardVoltage,
    hasResistor,
    setHasResistor,
    state,
  };
}
