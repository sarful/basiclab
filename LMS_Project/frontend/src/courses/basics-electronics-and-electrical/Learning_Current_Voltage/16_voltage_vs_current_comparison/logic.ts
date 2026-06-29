"use client";

import type { FlowLevel } from "./types";

export const MIN_VOLTAGE = 1;
export const MAX_VOLTAGE = 24;
export const MIN_RESISTANCE = 1;
export const MAX_RESISTANCE = 20;
export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_RESISTANCE = 6;

export function calculateCurrent(voltage: number, resistance: number): number {
  return resistance <= 0 ? 0 : voltage / resistance;
}

export function getVoltageLevel(voltage: number): FlowLevel {
  if (voltage < 8) return "LOW";
  if (voltage < 18) return "MEDIUM";
  return "HIGH";
}

export function getCurrentLevel(current: number): FlowLevel {
  if (current < 1) return "LOW";
  if (current < 3) return "MEDIUM";
  return "HIGH";
}

export function getVoltagePercent(voltage: number): number {
  return Math.round((voltage / MAX_VOLTAGE) * 100);
}

export function getCurrentPercent(current: number): number {
  return Math.min(100, Math.round((current / 5) * 100));
}

export const ohmsLawTests = [
  { voltage: 12, resistance: 6, current: 2 },
  { voltage: 24, resistance: 6, current: 4 },
  { voltage: 6, resistance: 12, current: 0.5 },
] as const;
