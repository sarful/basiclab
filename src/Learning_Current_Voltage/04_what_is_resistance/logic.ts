import type { ResistanceLevel } from "./types";

export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_RESISTANCE = 6;
export const ELECTRON_COUNT = 10;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculateCurrent(voltage: number, resistance: number) {
  return resistance <= 0 ? 0 : voltage / resistance;
}

export function getResistanceLevel(resistance: number): ResistanceLevel {
  if (resistance <= 4) return "LOW";
  if (resistance <= 10) return "MEDIUM";
  return "HIGH";
}

export function getFlowPercent(current: number) {
  return clamp(Math.round((current / 3) * 100), 8, 100);
}

export function getElectronSpeed(flowPercent: number) {
  const normalized = clamp(flowPercent, 0, 100);
  return Number((4.6 - (normalized / 100) * 3.1).toFixed(2));
}
