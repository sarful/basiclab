"use client";

import type { ResistorPackage } from "./types";

export const packages: ResistorPackage[] = [
  { watt: 0.125, label: "1/8W", size: 35, bodyWidth: 220, bodyHeight: 54 },
  { watt: 0.25, label: "1/4W", size: 45, bodyWidth: 260, bodyHeight: 66 },
  { watt: 0.5, label: "1/2W", size: 58, bodyWidth: 310, bodyHeight: 78 },
  { watt: 1, label: "1W", size: 70, bodyWidth: 350, bodyHeight: 88 },
  { watt: 2, label: "2W", size: 86, bodyWidth: 390, bodyHeight: 102 },
  { watt: 5, label: "5W", size: 108, bodyWidth: 440, bodyHeight: 118 },
];

export const resistorValues = [47, 100, 220, 330, 470, 1000, 2200, 4700, 10000];

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 3) {
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

export function getStatus(power: number, rating: number) {
  const ratio = power / rating;
  if (ratio >= 1) {
    return {
      label: "OVERLOAD",
      tone: "text-red-600",
      bg: "bg-red-50 border-red-200",
      message: "Power rating exceeded - resistor may burn.",
    };
  }
  if (ratio >= 0.75) {
    return {
      label: "HOT / CAUTION",
      tone: "text-orange-600",
      bg: "bg-orange-50 border-orange-200",
      message: "Close to the limit - choose a higher wattage for safety.",
    };
  }
  if (ratio >= 0.5) {
    return {
      label: "WARM",
      tone: "text-yellow-700",
      bg: "bg-yellow-50 border-yellow-200",
      message: "Working, but heat is noticeable.",
    };
  }
  return {
    label: "SAFE",
    tone: "text-green-600",
    bg: "bg-green-50 border-green-200",
    message: "Good safety margin.",
  };
}

export function recommendedPackage(power: number) {
  const safeTarget = power * 2;
  return packages.find((item) => item.watt >= safeTarget) || packages[packages.length - 1];
}
