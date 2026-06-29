"use client";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatResistance(value: number) {
  if (value >= 1000000) return `${formatNumber(value / 1000000, 2)} Mohm`;
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kohm`;
  return `${formatNumber(value, 1)} ohm`;
}

export function formatCurrent(value: number) {
  if (value >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

export function calculateLdrResistance(lightPercent: number, darkResistance: number) {
  const light = clamp(lightPercent, 0, 100);
  const minResistance = 500;
  const normalized = light / 100;
  return minResistance + darkResistance * Math.pow(1 - normalized, 2.6);
}
