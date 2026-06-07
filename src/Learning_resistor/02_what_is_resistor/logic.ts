"use client";

import type { DigitColor, MultiplierColor, Preset, TempCoeff, ToleranceColor } from "./types";

export const digitColors: DigitColor[] = [
  { name: "Black", value: 0, hex: "#111827" },
  { name: "Brown", value: 1, hex: "#8B4513" },
  { name: "Red", value: 2, hex: "#EF4444" },
  { name: "Orange", value: 3, hex: "#F97316" },
  { name: "Yellow", value: 4, hex: "#FACC15" },
  { name: "Green", value: 5, hex: "#22C55E" },
  { name: "Blue", value: 6, hex: "#2563EB" },
  { name: "Violet", value: 7, hex: "#A855F7" },
  { name: "Gray", value: 8, hex: "#9CA3AF" },
  { name: "White", value: 9, hex: "#F9FAFB" },
];

export const multiplierColors: MultiplierColor[] = [
  { name: "Black", multiplier: 1, hex: "#111827" },
  { name: "Brown", multiplier: 10, hex: "#8B4513" },
  { name: "Red", multiplier: 100, hex: "#EF4444" },
  { name: "Orange", multiplier: 1000, hex: "#F97316" },
  { name: "Yellow", multiplier: 10000, hex: "#FACC15" },
  { name: "Green", multiplier: 100000, hex: "#22C55E" },
  { name: "Blue", multiplier: 1000000, hex: "#2563EB" },
  { name: "Violet", multiplier: 10000000, hex: "#A855F7" },
];

export const toleranceColors: ToleranceColor[] = [
  { name: "Brown", tolerance: "±1%", hex: "#8B4513" },
  { name: "Red", tolerance: "±2%", hex: "#EF4444" },
  { name: "Green", tolerance: "±0.5%", hex: "#22C55E" },
  { name: "Blue", tolerance: "±0.25%", hex: "#2563EB" },
  { name: "Violet", tolerance: "±0.1%", hex: "#A855F7" },
  { name: "Gold", tolerance: "±5%", hex: "#D4AF37" },
  { name: "Silver", tolerance: "±10%", hex: "#C0C0C0" },
];

export const tempCoeffs: TempCoeff[] = [
  { name: "Brown", ppm: "100ppm/°C", hex: "#8B4513" },
  { name: "Red", ppm: "50ppm/°C", hex: "#EF4444" },
  { name: "Orange", ppm: "15ppm/°C", hex: "#F97316" },
  { name: "Yellow", ppm: "25ppm/°C", hex: "#FACC15" },
  { name: "Blue", ppm: "10ppm/°C", hex: "#2563EB" },
];

export const presets: Preset[] = [
  { label: "220Ω", mode: 4, b1: "Red", b2: "Red", mult: "Brown", tol: "Gold" },
  { label: "1kΩ", mode: 4, b1: "Brown", b2: "Black", mult: "Red", tol: "Gold" },
  { label: "10kΩ", mode: 4, b1: "Brown", b2: "Black", mult: "Orange", tol: "Gold" },
  { label: "4.7kΩ", mode: 4, b1: "Yellow", b2: "Violet", mult: "Red", tol: "Gold" },
  { label: "1.00kΩ 1%", mode: 5, b1: "Brown", b2: "Black", b3: "Black", mult: "Brown", tol: "Brown" },
  { label: "10kΩ 1% TC", mode: 6, b1: "Brown", b2: "Black", b3: "Black", mult: "Red", tol: "Brown", tc: "Brown" },
];

export function findDigit(name: string) {
  return digitColors.find((color) => color.name === name) || digitColors[0];
}

export function findMultiplier(name: string) {
  return multiplierColors.find((color) => color.name === name) || multiplierColors[0];
}

export function findTolerance(name: string) {
  return toleranceColors.find((color) => color.name === name) || toleranceColors[5];
}

export function findTempCoeff(name: string) {
  return tempCoeffs.find((color) => color.name === name) || tempCoeffs[0];
}

export function formatResistance(value: number) {
  if (value >= 1_000_000) return `${value / 1_000_000} MΩ`;
  if (value >= 1_000) return `${value / 1_000} kΩ`;
  return `${value} Ω`;
}

export function multiplierText(value: number) {
  return `×${value.toLocaleString()}`;
}
