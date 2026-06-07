"use client";

import type { MaterialSpec } from "./types";

export const materials: MaterialSpec[] = [
  {
    key: "carbon",
    label: "Carbon Composition",
    shellColor: "#334155",
    coreColor: "#64748b",
    resistanceFactor: 1.18,
    heatFactor: 0.76,
    note: "General-purpose structure with moderate noise and higher drift.",
  },
  {
    key: "metal-film",
    label: "Metal Film",
    shellColor: "#2563eb",
    coreColor: "#93c5fd",
    resistanceFactor: 0.84,
    heatFactor: 0.48,
    note: "Thin film on ceramic core with better stability and precision.",
  },
  {
    key: "wire-wound",
    label: "Wire Wound",
    shellColor: "#ea580c",
    coreColor: "#fdba74",
    resistanceFactor: 0.95,
    heatFactor: 0.92,
    note: "Strong power handling but tends to run warmer under load.",
  },
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatValue(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function formatResistance(value: number) {
  if (value >= 1000) return `${formatValue(value / 1000, 2)} kΩ`;
  return `${formatValue(value, 1)} Ω`;
}

export function formatCurrent(value: number) {
  if (value >= 1) return `${formatValue(value, 3)} A`;
  return `${formatValue(value * 1000, 2)} mA`;
}
