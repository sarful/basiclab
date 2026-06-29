"use client";

import { useEffect, useMemo, useState } from "react";

import { getClipperState } from "./clipperLogic";
import type { ClipperMode, FlowMode } from "./clipperTypes";

export function useClipperSimulation() {
  const [mode, setMode] = useState<ClipperMode>("both");
  const [flowMode, setFlowMode] = useState<FlowMode>("conventional");
  const [inputAmplitude, setInputAmplitude] = useState(6);
  const [clipLevel, setClipLevel] = useState(4);
  const [resistorValue, setResistorValue] = useState(1000);
  const [showDebugDots, setShowDebugDots] = useState(true);
  const [timeCursor, setTimeCursor] = useState(0.18);
  const [autoRun, setAutoRun] = useState(true);

  const state = useMemo(
    () =>
      getClipperState({
        clipLevel,
        flowMode,
        inputAmplitude,
        mode,
        resistorValue,
        timeCursor,
      }),
    [clipLevel, flowMode, inputAmplitude, mode, resistorValue, timeCursor],
  );

  useEffect(() => {
    if (!autoRun) return undefined;

    const interval = window.setInterval(() => {
      setTimeCursor((current) => {
        const next = current + 0.008;
        return next >= 1 ? next - 1 : next;
      });
    }, 80);

    return () => window.clearInterval(interval);
  }, [autoRun]);

  const reset = () => {
    setMode("both");
    setFlowMode("conventional");
    setInputAmplitude(6);
    setClipLevel(4);
    setResistorValue(1000);
    setShowDebugDots(true);
    setTimeCursor(0.18);
    setAutoRun(true);
  };

  return {
    autoRun,
    clipLevel,
    flowMode,
    inputAmplitude,
    mode,
    reset,
    resistorValue,
    setAutoRun,
    setClipLevel,
    setFlowMode,
    setInputAmplitude,
    setMode,
    setResistorValue,
    setShowDebugDots,
    setTimeCursor,
    showDebugDots,
    state,
    timeCursor,
  };
}
