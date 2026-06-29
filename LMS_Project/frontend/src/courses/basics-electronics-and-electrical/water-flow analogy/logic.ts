import type { WaterFlowCard } from "./types";

export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_RESISTANCE = 120;
export const MIN_VOLTAGE = 0;
export const MAX_VOLTAGE = 24;
export const MIN_RESISTANCE = 1;
export const MAX_RESISTANCE = 1000;

export function calculateCurrent(voltage: number, resistance: number): number {
  return resistance <= 0 ? 0 : voltage / resistance;
}

export function calculatePower(voltage: number, current: number): number {
  return voltage * current;
}

export function calculateCurrentPercent(current: number): number {
  return Math.min(1, current / 0.5);
}

export function calculatePipeOpening(resistance: number): number {
  return Math.max(12, Math.min(70, 82 - resistance * 0.07));
}

export function calculateFlowRate(current: number): number {
  return current * 100;
}

export function calculateFlowSpeed(current: number): number {
  return Math.max(1.2, Math.min(6, current * 35));
}

export function calculateNeedleAngle(currentPercent: number): number {
  return -130 + currentPercent * 220;
}

export const analogyCards: WaterFlowCard[] = [
  {
    title: "VOLTAGE",
    text: "Pressure pushing water",
    tone: "red",
  },
  {
    title: "CURRENT",
    text: "Water flow rate",
    tone: "green",
  },
  {
    title: "RESISTANCE",
    text: "Narrow pipe restriction",
    tone: "purple",
  },
  {
    title: "RESULT",
    text: "More pressure and less restriction create more flow",
    tone: "blue",
  },
];
