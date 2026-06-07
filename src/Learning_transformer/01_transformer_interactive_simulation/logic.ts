import type { TransformerSnapshot } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function computeTransformerSnapshot({
  inputVoltage,
  primaryTurns,
  secondaryTurns,
  frequency,
}: {
  inputVoltage: number;
  primaryTurns: number;
  secondaryTurns: number;
  frequency: number;
}): TransformerSnapshot {
  const turnsRatio = secondaryTurns / primaryTurns;
  const outputVoltage = inputVoltage * turnsRatio;
  const efficiency = clamp(
    0.92 - Math.abs(primaryTurns - secondaryTurns) * 0.005,
    0.55,
    0.98,
  );
  const fluxLevel = clamp((inputVoltage / 240) * (frequency / 50), 0.1, 1);

  return { turnsRatio, outputVoltage, efficiency, fluxLevel };
}
