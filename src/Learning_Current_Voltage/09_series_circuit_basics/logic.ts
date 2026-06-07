import type { FlowLevel } from "./types";

export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_RESISTANCE_ONE = 4;
export const DEFAULT_RESISTANCE_TWO = 8;
export const LED_DROP = 2;
export const ELECTRON_COUNT = 12;

export function getElectronSpeed(current: number) {
  return Math.max(1.1, 4.8 - Math.min(current, 5) * 0.55);
}

export function solveSeriesCircuitLesson(
  voltage: number,
  resistanceOne: number,
  resistanceTwo: number,
) {
  const r1 = Math.max(1, resistanceOne);
  const r2 = Math.max(1, resistanceTwo);
  const availableVoltage = Math.max(0, voltage - LED_DROP);
  const totalResistance = r1 + r2;
  const current = totalResistance <= 0 ? 0 : availableVoltage / totalResistance;
  const dropOne = current * r1;
  const dropTwo = current * r2;

  return {
    voltage,
    resistanceOne: r1,
    resistanceTwo: r2,
    totalResistance,
    current,
    dropOne,
    dropTwo,
    ledDrop: LED_DROP,
    loopRuleText: `${dropOne.toFixed(1)}V + ${dropTwo.toFixed(1)}V + ${LED_DROP.toFixed(1)}V ≈ ${voltage.toFixed(1)}V`,
  };
}

export function getFlowPercent(current: number) {
  return Math.min(100, Math.max(12, (current / 2.5) * 100));
}

export function getFlowLevel(current: number): FlowLevel {
  if (current >= 1.6) return "High";
  if (current >= 0.75) return "Medium";
  return "Low";
}

