import type { VariableCapacitorSnapshot } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatCapacitance(valuePf: number) {
  if (valuePf >= 1000) return `${formatNumber(valuePf / 1000, 2)} nF`;
  return `${formatNumber(valuePf, 1)} pF`;
}

export function formatFrequency(valueHz: number) {
  if (valueHz >= 1000000) return `${formatNumber(valueHz / 1000000, 3)} MHz`;
  if (valueHz >= 1000) return `${formatNumber(valueHz / 1000, 2)} kHz`;
  return `${formatNumber(valueHz, 1)} Hz`;
}

export function computeVariableCapacitorSnapshot({
  rotation,
  minCapacitance,
  maxCapacitance,
  inductanceUh,
}: {
  rotation: number;
  minCapacitance: number;
  maxCapacitance: number;
  inductanceUh: number;
}): VariableCapacitorSnapshot {
  const overlapRatio = rotation / 180;
  const capacitance = minCapacitance + (maxCapacitance - minCapacitance) * overlapRatio;
  const capacitanceFarad = capacitance * 1e-12;
  const inductanceHenry = inductanceUh * 1e-6;
  const frequency = 1 / (2 * Math.PI * Math.sqrt(inductanceHenry * capacitanceFarad));
  const tuningPercent = clamp(1 - overlapRatio, 0, 1);

  return {
    overlapRatio,
    capacitance,
    frequency,
    tuningPercent,
  };
}
