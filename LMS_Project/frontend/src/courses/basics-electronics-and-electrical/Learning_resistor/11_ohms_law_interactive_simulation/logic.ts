"use client";

import type { LedOption } from "./types";

export const ledOptions: LedOption[] = [
  {
    color: "green",
    label: "Green LED",
    emoji: "Green",
    ledDrop: 2.2,
    safeCurrentMa: 20,
    fill: "#22c55e",
    stroke: "#16a34a",
    glow: "34,197,94",
    buttonClass: "bg-green-50 text-green-700 border-green-200",
  },
  {
    color: "red",
    label: "Red LED",
    emoji: "Red",
    ledDrop: 2,
    safeCurrentMa: 20,
    fill: "#ef4444",
    stroke: "#dc2626",
    glow: "239,68,68",
    buttonClass: "bg-red-50 text-red-700 border-red-200",
  },
  {
    color: "yellow",
    label: "Yellow LED",
    emoji: "Yellow",
    ledDrop: 2.1,
    safeCurrentMa: 20,
    fill: "#eab308",
    stroke: "#ca8a04",
    glow: "234,179,8",
    buttonClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
];

export const standardResistors = [
  10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100, 120, 150, 180, 220, 270, 330,
  390, 470, 560, 680, 820, 1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600,
  6800, 8200, 10000, 12000, 15000, 18000, 22000, 27000, 33000, 39000, 47000, 56000,
  68000, 82000, 100000,
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 3) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatCurrent(value: number) {
  if (value >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

export function formatResistance(value: number) {
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kohm`;
  return `${formatNumber(value, 1)} ohm`;
}

export function nearestStandardResistor(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return standardResistors.reduce((nearest, current) =>
    Math.abs(current - value) < Math.abs(nearest - value) ? current : nearest,
  );
}

export function getSafeLedStatus(current: number, safeCurrentMa: number) {
  const currentMa = current * 1000;

  if (currentMa > safeCurrentMa * 1.25) {
    return {
      label: "UNSAFE",
      tone: "text-red-600",
      bg: "bg-red-50",
      message: "Current is too high and may damage the LED.",
    };
  }

  if (currentMa > safeCurrentMa) {
    return {
      label: "CAUTION",
      tone: "text-orange-600",
      bg: "bg-orange-50",
      message: "Current is close to or slightly above the safe range.",
    };
  }

  if (currentMa < safeCurrentMa * 0.25) {
    return {
      label: "DIM",
      tone: "text-yellow-700",
      bg: "bg-yellow-50",
      message: "Current is low, so the LED will look dim.",
    };
  }

  return {
    label: "SAFE",
    tone: "text-green-600",
    bg: "bg-green-50",
    message: "Current is inside the safe operating range.",
  };
}
