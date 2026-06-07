import type { CircuitMode, FlowLevel } from "./types";

export const DEFAULT_VOLTAGE = 9;
export const DEFAULT_LOAD_RESISTANCE = 6;
export const SHORT_PATH_RESISTANCE = 0.25;
export const ELECTRON_COUNT = 12;

export function getElectronSpeed(current: number) {
  return Math.max(0.9, 4.8 - Math.min(current, 18) * 0.18);
}

export function solveShortCircuitLesson(
  mode: CircuitMode,
  voltage: number,
  loadResistance: number,
) {
  const safeLoadResistance = Math.max(loadResistance, 0.5);
  const effectiveResistance =
    mode === "short" ? SHORT_PATH_RESISTANCE : safeLoadResistance;
  const current = voltage / effectiveResistance;
  const power = voltage * current;
  const loadActive = mode === "normal";

  return {
    mode,
    voltage,
    loadResistance: safeLoadResistance,
    effectiveResistance,
    current,
    power,
    loadActive,
    riskLabel:
      mode === "short"
        ? power >= 150
          ? "Extreme Risk"
          : "High Risk"
        : current >= 2
          ? "Heavy Load"
          : "Normal Load",
    explanation:
      mode === "short"
        ? "A short circuit creates a very low-resistance path directly back to the battery, so current rises sharply and the load is bypassed."
        : "A normal circuit sends current through the resistor and LED, so the load uses the electrical energy in a controlled way.",
  };
}

export function getFlowPercent(current: number) {
  return Math.min(100, Math.max(8, (current / 18) * 100));
}

export function getFlowLevel(current: number): FlowLevel {
  if (current >= 12) return "Danger";
  if (current >= 6) return "High";
  if (current >= 2) return "Medium";
  return "Low";
}

