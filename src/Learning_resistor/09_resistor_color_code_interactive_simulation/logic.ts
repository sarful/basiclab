"use client";

import type { DigitColor, MultiplierColor, TempColor, ToleranceColor } from "./types";

export const digitColors: DigitColor[] = [
  { name: "Black", value: 0, hex: "#111827" },
  { name: "Brown", value: 1, hex: "#7c2d12" },
  { name: "Red", value: 2, hex: "#dc2626" },
  { name: "Orange", value: 3, hex: "#f97316" },
  { name: "Yellow", value: 4, hex: "#facc15" },
  { name: "Green", value: 5, hex: "#16a34a" },
  { name: "Blue", value: 6, hex: "#2563eb" },
  { name: "Violet", value: 7, hex: "#7c3aed" },
  { name: "Gray", value: 8, hex: "#9ca3af" },
  { name: "White", value: 9, hex: "#f8fafc" },
];

export const multiplierColors: MultiplierColor[] = [
  { name: "Black", multiplier: 1, hex: "#111827" },
  { name: "Brown", multiplier: 10, hex: "#7c2d12" },
  { name: "Red", multiplier: 100, hex: "#dc2626" },
  { name: "Orange", multiplier: 1000, hex: "#f97316" },
  { name: "Yellow", multiplier: 10000, hex: "#facc15" },
  { name: "Green", multiplier: 100000, hex: "#16a34a" },
  { name: "Blue", multiplier: 1000000, hex: "#2563eb" },
  { name: "Violet", multiplier: 10000000, hex: "#7c3aed" },
  { name: "Gray", multiplier: 100000000, hex: "#9ca3af" },
  { name: "White", multiplier: 1000000000, hex: "#f8fafc" },
  { name: "Gold", multiplier: 0.1, hex: "#d4af37" },
  { name: "Silver", multiplier: 0.01, hex: "#c0c0c0" },
];

export const toleranceColors: ToleranceColor[] = [
  { name: "Brown", tolerance: 1, hex: "#7c2d12" },
  { name: "Red", tolerance: 2, hex: "#dc2626" },
  { name: "Green", tolerance: 0.5, hex: "#16a34a" },
  { name: "Blue", tolerance: 0.25, hex: "#2563eb" },
  { name: "Violet", tolerance: 0.1, hex: "#7c3aed" },
  { name: "Gray", tolerance: 0.05, hex: "#9ca3af" },
  { name: "Gold", tolerance: 5, hex: "#d4af37" },
  { name: "Silver", tolerance: 10, hex: "#c0c0c0" },
];

export const tempColors: TempColor[] = [
  { name: "Brown", ppm: 100, hex: "#7c2d12" },
  { name: "Red", ppm: 50, hex: "#dc2626" },
  { name: "Orange", ppm: 15, hex: "#f97316" },
  { name: "Yellow", ppm: 25, hex: "#facc15" },
  { name: "Blue", ppm: 10, hex: "#2563eb" },
  { name: "Violet", ppm: 5, hex: "#7c3aed" },
];

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatResistance(value: number) {
  if (value >= 1_000_000_000) return `${formatNumber(value / 1_000_000_000, 2)} GΩ`;
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, 2)} MΩ`;
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kΩ`;
  return `${formatNumber(value, 2)} Ω`;
}

export function getDigit(name: string) {
  return digitColors.find((item) => item.name === name) || digitColors[0];
}

export function getMultiplier(name: string) {
  return multiplierColors.find((item) => item.name === name) || multiplierColors[0];
}

export function getTolerance(name: string) {
  return toleranceColors.find((item) => item.name === name) || toleranceColors[6];
}

export function getTemp(name: string) {
  return tempColors.find((item) => item.name === name) || tempColors[0];
}
