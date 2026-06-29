import type { BranchItem } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatResistance(value: number) {
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kohm`;
  return `${formatNumber(value, 1)} ohm`;
}

export function formatCurrent(value: number) {
  if (value >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

export function equivalentParallel(resistors: BranchItem[]) {
  const reciprocalSum = resistors.reduce((sum, item) => sum + 1 / item.value, 0);
  return 1 / reciprocalSum;
}

export const resistorOptions = [100, 220, 330, 470, 680, 1000, 2200, 4700, 10000];
