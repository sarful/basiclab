import type { ComparisonSnapshot } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatCapacitance(value: number) {
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} mF`;
  if (value >= 1) return `${formatNumber(value, 0)} uF`;
  return `${formatNumber(value * 1000, 0)} nF`;
}

export function computeComparisonSnapshot({
  voltage,
  frequency,
}: {
  voltage: number;
  frequency: number;
}): ComparisonSnapshot {
  const safeMargin = clamp((25 - voltage) / 25, 0, 1);
  const acBehavior = clamp(Math.log10(frequency) / 5, 0.1, 1);

  return {
    safeMargin,
    acBehavior,
  };
}
