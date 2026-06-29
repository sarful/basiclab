"use client";

import { useMemo, useState } from "react";

import { getBiasResult, getLedState } from "./logic";
import type { BiasMode } from "./types";

export function useWhatIsDiodeSimulation() {
  const [bias, setBias] = useState<BiasMode>("forward");
  const [voltage, setVoltage] = useState(12);

  const led = useMemo(() => getLedState(bias, voltage), [bias, voltage]);
  const status = useMemo(() => getBiasResult(bias, voltage), [bias, voltage]);

  return {
    bias,
    setBias,
    voltage,
    setVoltage,
    led,
    status,
    isForward: bias === "forward",
  };
}
