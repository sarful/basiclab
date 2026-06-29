"use client";

import { useCallback, useMemo, useState } from "react";

import {
  calculateCurrent,
  calculatePower,
  clamp,
  clampToZero,
  getHeatStatus,
  getRecommendedPackage,
  ledOptions,
  resistorPackages,
  resistorValues,
  roundTo,
  safePowerRating,
  safeResistance,
  safeVoltage,
} from "./logic";
import type { ResistorLessonMode } from "./types";

type CurrentLevel = "low" | "medium" | "high";
type ResistanceLevel = "low" | "medium" | "high";
type HeatLevel = "safe" | "warm" | "hot" | "overload";

function getNearestResistorValue(value: number) {
  const safeValue = safeResistance(value);
  return resistorValues.reduce((nearest, item) =>
    Math.abs(item - safeValue) < Math.abs(nearest - safeValue) ? item : nearest,
  );
}

function getValidRating(value: number) {
  const safeValue = safePowerRating(value);
  return (
    resistorPackages.find((item) => item.watt === safeValue)?.watt ??
    resistorPackages[1].watt
  );
}

function getCurrentLevel(current: number): CurrentLevel {
  if (current >= 0.03) return "high";
  if (current >= 0.01) return "medium";
  return "low";
}

function getResistanceLevel(resistance: number): ResistanceLevel {
  if (resistance <= 220) return "low";
  if (resistance <= 1000) return "medium";
  return "high";
}

function getHeatLevel(powerUsagePercent: number): HeatLevel {
  if (powerUsagePercent >= 100) return "overload";
  if (powerUsagePercent >= 75) return "hot";
  if (powerUsagePercent >= 50) return "warm";
  return "safe";
}

export function useWhatIsResistorSimulation() {
  const [modeState, setModeState] = useState<ResistorLessonMode>("basic");
  const [voltageState, setVoltageState] = useState(5);
  const [resistanceState, setResistanceState] = useState(220);
  const [ratingState, setRatingState] = useState(0.25);
  const [ledIdState, setLedIdState] = useState("red");

  const setMode = useCallback((value: ResistorLessonMode) => {
    setModeState(value === "led" ? "led" : "basic");
  }, []);

  const setVoltage = useCallback((value: number) => {
    setVoltageState(clamp(roundTo(safeVoltage(value), 0), 1, 30));
  }, []);

  const setResistance = useCallback((value: number) => {
    setResistanceState(getNearestResistorValue(value));
  }, []);

  const setRating = useCallback((value: number) => {
    setRatingState(getValidRating(value));
  }, []);

  const setLedId = useCallback((value: string) => {
    const exists = ledOptions.some((item) => item.id === value);
    setLedIdState(exists ? value : ledOptions[0].id);
  }, []);

  const derived = useMemo(() => {
    const mode = modeState;
    const voltage = clamp(roundTo(safeVoltage(voltageState), 2), 1, 30);
    const resistance = getNearestResistorValue(resistanceState);
    const rating = getValidRating(ratingState);

    const selectedPackage =
      resistorPackages.find((item) => item.watt === rating) ??
      resistorPackages[1];

    const selectedLed =
      ledOptions.find((item) => item.id === ledIdState) ?? ledOptions[0];

    const isLedMode = mode === "led";

    const ledVoltageDrop = isLedMode
      ? clampToZero(Math.min(voltage, selectedLed.forwardVoltage), 2)
      : 0;

    const voltageDrop = isLedMode
      ? clampToZero(voltage - ledVoltageDrop, 2)
      : clampToZero(voltage, 2);

    const outputVoltage = isLedMode
      ? clampToZero(voltage - voltageDrop - ledVoltageDrop, 2)
      : 0;

    const current = calculateCurrent(voltageDrop, resistance);
    const power = calculatePower(current, resistance);

    const powerUsagePercent =
      rating > 0 ? clamp(roundTo((power / rating) * 100, 2), 0, 999) : 0;

    const brightnessLevel =
      isLedMode && voltage > selectedLed.forwardVoltage
        ? clamp(roundTo(current / 0.02, 3), 0, 1)
        : 0;

    const currentLevel = getCurrentLevel(current);
    const resistanceLevel = getResistanceLevel(resistance);
    const heatLevel = getHeatLevel(powerUsagePercent);

    const flowSpeed = clamp(roundTo(1 - resistance / 10000, 3), 0.08, 1);
    const flowDensity = clamp(roundTo(current / 0.08, 3), 0.05, 1);
    const heatIntensity = clamp(roundTo(powerUsagePercent / 100, 3), 0, 1);
    const currentLimitingPercent = clamp(
      roundTo((1 - flowDensity) * 100, 1),
      0,
      100,
    );

    const status = getHeatStatus(power, rating);
    const recommendedPackage = getRecommendedPackage(power);

    return {
      mode,
      voltage,
      resistance,
      rating,
      ledId: ledIdState,
      selectedLed,
      selectedPackage,
      current,
      power,
      outputVoltage,
      voltageDrop,
      ledVoltageDrop,
      brightnessLevel,
      status,
      recommendedPackage,
      currentLevel,
      resistanceLevel,
      heatLevel,
      flowSpeed,
      flowDensity,
      heatIntensity,
      currentLimitingPercent,
      powerUsagePercent,
    };
  }, [ledIdState, modeState, ratingState, resistanceState, voltageState]);

  return {
    ...derived,
    setMode,
    setVoltage,
    setResistance,
    setRating,
    setLedId,
  };
}
