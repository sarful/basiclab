"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getGraphPoints,
  getPhotodiodeState,
  runSimulationTests,
} from "./logic";

const DEFAULTS = {
  lux: 1000,
  reverseVoltage: 5,
  loadKOhm: 100,
  responsivityAW: 0.45,
  activeAreaMM2: 7.5,
  isReverseBias: true,
} as const;

export function usePhotodiodeSimulation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [lux, setLux] = useState(DEFAULTS.lux);
  const [reverseVoltage, setReverseVoltage] = useState(DEFAULTS.reverseVoltage);
  const [loadKOhm, setLoadKOhm] = useState(DEFAULTS.loadKOhm);
  const [responsivityAW, setResponsivityAW] = useState(DEFAULTS.responsivityAW);
  const [activeAreaMM2, setActiveAreaMM2] = useState(DEFAULTS.activeAreaMM2);
  const [isReverseBias, setIsReverseBias] = useState(DEFAULTS.isReverseBias);

  useEffect(() => {
    runSimulationTests();
  }, []);

  const resetSimulation = useCallback(() => {
    setIsPlaying(true);
    setLux(DEFAULTS.lux);
    setReverseVoltage(DEFAULTS.reverseVoltage);
    setLoadKOhm(DEFAULTS.loadKOhm);
    setResponsivityAW(DEFAULTS.responsivityAW);
    setActiveAreaMM2(DEFAULTS.activeAreaMM2);
    setIsReverseBias(DEFAULTS.isReverseBias);
  }, []);

  const state = useMemo(
    () =>
      getPhotodiodeState(
        lux,
        reverseVoltage,
        loadKOhm,
        responsivityAW,
        activeAreaMM2,
        isReverseBias,
      ),
    [lux, reverseVoltage, loadKOhm, responsivityAW, activeAreaMM2, isReverseBias],
  );

  const graphPoints = useMemo(
    () =>
      getGraphPoints(
        reverseVoltage,
        loadKOhm,
        responsivityAW,
        activeAreaMM2,
        isReverseBias,
      ),
    [reverseVoltage, loadKOhm, responsivityAW, activeAreaMM2, isReverseBias],
  );

  return {
    isPlaying,
    setIsPlaying,
    resetSimulation,
    lux,
    setLux,
    reverseVoltage,
    setReverseVoltage,
    loadKOhm,
    setLoadKOhm,
    responsivityAW,
    setResponsivityAW,
    activeAreaMM2,
    setActiveAreaMM2,
    isReverseBias,
    setIsReverseBias,
    state,
    graphPoints,
  };
}
