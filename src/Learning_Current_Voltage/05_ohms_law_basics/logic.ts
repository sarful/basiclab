import type { SolveMode } from "./types";

export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_CURRENT = 2;
export const DEFAULT_RESISTANCE = 6;
export const ELECTRON_COUNT = 10;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function solveOhmsLaw(
  mode: SolveMode,
  voltage: number,
  current: number,
  resistance: number,
) {
  if (mode === "current") {
    const solvedCurrent = resistance <= 0 ? 0 : voltage / resistance;
    return {
      voltage,
      current: solvedCurrent,
      resistance,
      formula: `I = V / R = ${formatNumber(voltage, 1)} / ${formatNumber(
        resistance,
        1,
      )} = ${formatNumber(solvedCurrent, 2)} A`,
    };
  }

  if (mode === "voltage") {
    const solvedVoltage = current * resistance;
    return {
      voltage: solvedVoltage,
      current,
      resistance,
      formula: `V = I x R = ${formatNumber(current, 2)} x ${formatNumber(
        resistance,
        1,
      )} = ${formatNumber(solvedVoltage, 2)} V`,
    };
  }

  const solvedResistance = current <= 0 ? 0 : voltage / current;
  return {
    voltage,
    current,
    resistance: solvedResistance,
    formula: `R = V / I = ${formatNumber(voltage, 1)} / ${formatNumber(
      current,
      2,
    )} = ${formatNumber(solvedResistance, 2)} Ohm`,
  };
}

export function getFlowPercent(current: number) {
  return clamp(Math.round((current / 3) * 100), 8, 100);
}

export function getElectronSpeed(flowPercent: number) {
  const normalized = clamp(flowPercent, 0, 100);
  return Number((4.6 - (normalized / 100) * 3.1).toFixed(2));
}
