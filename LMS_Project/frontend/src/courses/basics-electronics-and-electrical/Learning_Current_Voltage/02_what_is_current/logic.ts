import type { CurrentLevel } from "./types";

export const MIN_VOLTAGE = 1;
export const MAX_VOLTAGE = 24;
export const MIN_RESISTANCE = 1;
export const MAX_RESISTANCE = 20;
export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_RESISTANCE = 6;
export const ELECTRON_COUNT = 9;
export const CURRENT_SCALE = 5;
export const VOLTAGE_PRESETS = [3, 6, 12, 18, 24] as const;

export function calculateCurrent(voltage: number, resistance: number): number {
  return resistance <= 0 ? 0 : voltage / resistance;
}

export function getCurrentLevel(current: number): CurrentLevel {
  if (current < 1) return "LOW";
  if (current < 3) return "MEDIUM";
  return "HIGH";
}

export function getCurrentPercent(current: number): number {
  return Math.min(100, Math.round((current / CURRENT_SCALE) * 100));
}

export function getFlowDuration(currentPercent: number): number {
  return Math.max(0.65, 3 - currentPercent / 45);
}

export const currentLogicTests = [
  { voltage: 12, resistance: 6, current: 2 },
  { voltage: 24, resistance: 6, current: 4 },
  { voltage: 6, resistance: 12, current: 0.5 },
] as const;

export const currentLevelTests = [
  { current: 0.5, level: "LOW" },
  { current: 2, level: "MEDIUM" },
  { current: 4, level: "HIGH" },
] as const;
