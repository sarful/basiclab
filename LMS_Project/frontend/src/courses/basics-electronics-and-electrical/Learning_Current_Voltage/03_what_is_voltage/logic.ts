import type { BulbState, PressureLevel } from "./types";

export const MIN_VOLTAGE = 1;
export const MAX_VOLTAGE = 24;
export const DEFAULT_VOLTAGE = 12;
export const VOLTAGE_PRESETS = [3, 6, 12, 18, 24] as const;

export function getPressureLevel(voltage: number): PressureLevel {
  if (voltage <= 6) return "LOW";
  if (voltage <= 15) return "MEDIUM";
  return "HIGH";
}

export function getBulbState(voltage: number): BulbState {
  if (voltage <= 3) return "off";
  if (voltage <= 10) return "dim";
  return "bright";
}

export function getPressurePercent(voltage: number): number {
  const safeVoltage = Math.max(MIN_VOLTAGE, Math.min(MAX_VOLTAGE, voltage));
  return Math.round((safeVoltage / MAX_VOLTAGE) * 100);
}

export function getFlowSpeed(pressurePercent: number): number {
  return Math.max(0.9, 3 - pressurePercent / 45);
}

export function getRelationText(voltage: number): string {
  const level = getPressureLevel(voltage);
  if (level === "LOW") {
    return "Low voltage creates weak electrical pressure and slow flow.";
  }
  if (level === "MEDIUM") {
    return "Medium voltage creates moderate electrical pressure and steady flow.";
  }
  return "High voltage creates strong electrical pressure and fast flow.";
}
