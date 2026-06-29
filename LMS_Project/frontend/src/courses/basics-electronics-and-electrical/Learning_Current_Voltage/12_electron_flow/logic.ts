import type { DirectionMode, FlowLevel } from "./types";

export const MIN_VOLTAGE = 1;
export const MAX_VOLTAGE = 24;
export const MIN_RESISTANCE = 1;
export const MAX_RESISTANCE = 20;
export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_RESISTANCE = 6;
export const DEFAULT_DIRECTION: DirectionMode = "electron";

export const ELECTRON_COUNT = 8;
export const VOLTAGE_PRESETS = [3, 6, 12, 18, 24] as const;

export function calculateCurrent(voltage: number, resistance: number): number {
  return resistance <= 0 ? 0 : voltage / resistance;
}

export function getFlowLevel(current: number): FlowLevel {
  if (current < 1) return "LOW";
  if (current < 3) return "MEDIUM";
  return "HIGH";
}

export function getFlowPercent(current: number): number {
  return Math.min(100, Math.round((current / 5) * 100));
}

export function getElectronSpeed(flowPercent: number): number {
  return Math.max(0.7, 3.2 - flowPercent / 40);
}

export function getDriftDescription(direction: DirectionMode): string {
  return direction === "electron"
    ? "Electron flow shows negative charges moving from negative terminal to positive terminal."
    : "Conventional current shows positive current direction from positive terminal to negative terminal.";
}

export const electronFlowLogicTests = [
  { voltage: 12, resistance: 6, current: 2 },
  { voltage: 24, resistance: 6, current: 4 },
  { voltage: 6, resistance: 12, current: 0.5 },
] as const;

export const electronFlowLevelTests = [
  { current: 0.5, level: "LOW" },
  { current: 2, level: "MEDIUM" },
  { current: 4, level: "HIGH" },
] as const;

