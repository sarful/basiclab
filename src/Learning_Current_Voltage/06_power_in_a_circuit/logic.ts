import type { PowerLevel, SolveMode } from "./types";

export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_CURRENT = 1.5;
export const DEFAULT_RESISTANCE = 8;
export const ELECTRON_COUNT = 10;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function solvePowerLesson(
  mode: SolveMode,
  voltage: number,
  current: number,
  resistance: number,
) {
  if (mode === "power") {
    const power = voltage * current;
    return {
      voltage,
      current,
      resistance,
      power,
      formula: `P = V x I = ${formatNumber(voltage, 1)} x ${formatNumber(
        current,
        2,
      )} = ${formatNumber(power, 2)} W`,
    };
  }

  if (mode === "current") {
    const solvedCurrent = resistance <= 0 ? 0 : voltage / resistance;
    const power = voltage * solvedCurrent;
    return {
      voltage,
      current: solvedCurrent,
      resistance,
      power,
      formula: `P = I²R = ${formatNumber(solvedCurrent, 2)}² x ${formatNumber(
        resistance,
        1,
      )} = ${formatNumber(power, 2)} W`,
    };
  }

  const solvedResistance = current <= 0 ? 0 : voltage / current;
  const power = voltage * current;
  return {
    voltage,
    current,
    resistance: solvedResistance,
    power,
    formula: `P = V² / R = ${formatNumber(voltage, 1)}² / ${formatNumber(
      solvedResistance,
      2,
    )} = ${formatNumber(power, 2)} W`,
  };
}

export function getPowerPercent(power: number) {
  return clamp(Math.round((power / 36) * 100), 8, 100);
}

export function getPowerLevel(power: number): PowerLevel {
  if (power >= 18) return "HIGH";
  if (power >= 8) return "MEDIUM";
  return "LOW";
}

export function getElectronSpeed(flowPercent: number) {
  const normalized = clamp(flowPercent, 0, 100);
  return Number((4.6 - (normalized / 100) * 3.1).toFixed(2));
}
