"use client";

import type {
  CurrentLevel,
  EnergyConversionState,
  FlowState,
  HeatLevel,
  LedOption,
  ResistanceLevel,
  ResistorLessonMode,
  ResistorPackage,
} from "./types";

export const resistorPackages: ResistorPackage[] = [
  { watt: 0.125, label: "1/8W", bodyWidth: 220, bodyHeight: 54 },
  { watt: 0.25, label: "1/4W", bodyWidth: 260, bodyHeight: 66 },
  { watt: 0.5, label: "1/2W", bodyWidth: 310, bodyHeight: 78 },
  { watt: 1, label: "1W", bodyWidth: 350, bodyHeight: 88 },
  { watt: 2, label: "2W", bodyWidth: 390, bodyHeight: 102 },
  { watt: 5, label: "5W", bodyWidth: 440, bodyHeight: 118 },
];

export const resistorValues = [47, 100, 220, 330, 470, 1000, 2200, 4700, 10000];

export const ledOptions: LedOption[] = [
  {
    id: "red",
    label: "Red LED",
    color: "#ef4444",
    glow: "#fca5a5",
    forwardVoltage: 1.9,
  },
  {
    id: "yellow",
    label: "Yellow LED",
    color: "#eab308",
    glow: "#fde047",
    forwardVoltage: 2.1,
  },
  {
    id: "green",
    label: "Green LED",
    color: "#22c55e",
    glow: "#86efac",
    forwardVoltage: 2.2,
  },
  {
    id: "blue",
    label: "Blue LED",
    color: "#3b82f6",
    glow: "#93c5fd",
    forwardVoltage: 3,
  },
];

export const digitBandPalette = [
  "#111827",
  "#8b5a2b",
  "#ef4444",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#2563eb",
  "#7c3aed",
  "#94a3b8",
  "#f8fafc",
] as const;

export const multiplierBandPalette: Record<number, string> = {
  0.01: "#c0c0c0",
  0.1: "#d4af37",
  1: "#111827",
  10: "#8b5a2b",
  100: "#ef4444",
  1000: "#f97316",
  10000: "#facc15",
  100000: "#22c55e",
  1000000: "#2563eb",
  10000000: "#7c3aed",
  100000000: "#94a3b8",
  1000000000: "#f8fafc",
};

export function roundTo(value: number, digits = 2): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  if (min > max) return min;
  return Math.min(Math.max(value, min), max);
}

export function clampToZero(value: number, digits = 2): number {
  return Math.max(0, roundTo(value, digits));
}

export function safeDivide(
  numerator: number,
  denominator: number,
  fallback = 0,
): number {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    return fallback;
  }

  return numerator / denominator;
}

export function safeResistance(value: number, fallback = 220): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return value;
}

export function safeVoltage(value: number, fallback = 5): number {
  if (!Number.isFinite(value) || value < 0) return fallback;
  return value;
}

export function safePowerRating(value: number, fallback = 0.25): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return value;
}

export function calculateLedVoltageDrop(
  mode: ResistorLessonMode,
  voltage: number,
  ledForwardVoltage: number,
): number {
  if (mode !== "led") return 0;
  return clampToZero(
    Math.min(safeVoltage(voltage), safeVoltage(ledForwardVoltage, 0)),
    2,
  );
}

export function calculateVoltageDrop(
  mode: ResistorLessonMode,
  voltage: number,
  ledForwardVoltage: number,
): number {
  const safeInputVoltage = safeVoltage(voltage);

  if (mode === "led") {
    const ledDrop = calculateLedVoltageDrop(
      mode,
      safeInputVoltage,
      ledForwardVoltage,
    );
    return clampToZero(safeInputVoltage - ledDrop, 2);
  }

  return clampToZero(safeInputVoltage, 2);
}

export function calculateOutputVoltage(
  voltage: number,
  voltageDrop: number,
  ledVoltageDrop: number,
): number {
  return clampToZero(safeVoltage(voltage) - voltageDrop - ledVoltageDrop, 2);
}

export function calculateCurrent(
  voltageDrop: number,
  resistance: number,
): number {
  return safeDivide(clampToZero(voltageDrop), safeResistance(resistance), 0);
}

export function calculatePower(current: number, resistance: number): number {
  const validCurrent = Number.isFinite(current) && current > 0 ? current : 0;
  return roundTo(validCurrent * validCurrent * safeResistance(resistance), 8);
}

export function getPowerUsagePercent(power: number, rating: number): number {
  return clamp(
    roundTo(safeDivide(power, safePowerRating(rating), 0) * 100, 2),
    0,
    999,
  );
}

export function getCurrentLimitingPercent(resistance: number): number {
  const safeValue = safeResistance(resistance);
  return clamp(
    roundTo((safeValue / Math.max(...resistorValues)) * 100, 1),
    0,
    100,
  );
}

export function getCurrentLevel(current: number): CurrentLevel {
  if (current >= 0.03) return "high";
  if (current >= 0.01) return "medium";
  return "low";
}

export function getResistanceLevel(resistance: number): ResistanceLevel {
  if (resistance <= 220) return "low";
  if (resistance <= 1000) return "medium";
  return "high";
}

export function getHeatLevel(power: number, rating: number): HeatLevel {
  const percent = getPowerUsagePercent(power, rating);
  if (percent >= 100) return "overload";
  if (percent >= 75) return "hot";
  if (percent >= 50) return "warm";
  return "safe";
}

export function getFlowState(current: number, resistance: number): FlowState {
  const flowDensity = clamp(roundTo(current / 0.08, 3), 0.05, 1);
  const flowSpeed = clamp(
    roundTo(1 - safeResistance(resistance) / 10000, 3),
    0.08,
    1,
  );
  const wireGlow = clamp(roundTo(flowDensity * 0.9 + 0.1, 3), 0.1, 1);
  const particleCount = Math.min(Math.max(Math.round(flowDensity * 24), 4), 26);
  const currentLimitingPercent = getCurrentLimitingPercent(resistance);

  return {
    flowSpeed,
    flowDensity,
    wireGlow,
    particleCount,
    currentLimitingPercent,
  };
}

export function getEnergyConversionState(
  power: number,
  rating: number,
): EnergyConversionState {
  const powerUsagePercent = getPowerUsagePercent(power, rating);
  const heatIntensity = clamp(roundTo(powerUsagePercent / 100, 3), 0, 1);

  return {
    electricalEnergy: clamp(
      roundTo(power / Math.max(safePowerRating(rating), 0.001), 3),
      0,
      1,
    ),
    heatEnergy: heatIntensity,
    powerUsagePercent,
    heatIntensity,
  };
}

export function formatNumber(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return "0";
  return Number(roundTo(value, digits).toFixed(digits)).toString();
}

export function formatVoltage(value: number, digits = 2): string {
  return `${formatNumber(clampToZero(value, digits), digits)}V`;
}

export function formatResistance(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 Ω";
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, 2)} MΩ`;
  if (value >= 1_000) return `${formatNumber(value / 1_000, 2)} kΩ`;
  return `${formatNumber(value, 1)} Ω`;
}

export function formatCurrent(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 mA";
  if (value >= 1) return `${formatNumber(value, 2)} A`;
  if (value >= 0.001) return `${formatNumber(value * 1000, 2)} mA`;
  return `${formatNumber(value * 1_000_000, 2)} µA`;
}

export function formatPower(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 mW";
  if (value >= 1) return `${formatNumber(value, 2)} W`;
  if (value >= 0.001) return `${formatNumber(value * 1000, 2)} mW`;
  return `${formatNumber(value * 1_000_000, 2)} µW`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${formatNumber(clamp(value, 0, 999), digits)}%`;
}

export function getHeatStatus(power: number, rating: number) {
  const heatLevel = getHeatLevel(power, rating);

  if (heatLevel === "overload") {
    return {
      label: "OVERLOAD",
      tone: "text-red-600",
      bg: "bg-red-50 border-red-200",
      message: "Power rating exceeded - resistor may overheat.",
    };
  }

  if (heatLevel === "hot") {
    return {
      label: "HOT / CAUTION",
      tone: "text-orange-600",
      bg: "bg-orange-50 border-orange-200",
      message: "Close to the limit - choose a higher wattage for safety.",
    };
  }

  if (heatLevel === "warm") {
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

export function getRecommendedPackage(power: number): ResistorPackage {
  const safeTarget = Math.max(0, power) * 2;

  return (
    resistorPackages.find((item) => item.watt >= safeTarget) ??
    resistorPackages[resistorPackages.length - 1]
  );
}

export function getResistorColorBands(
  resistance: number,
): [string, string, string, string] {
  const normalized = Math.max(1, Math.round(safeResistance(resistance)));
  const digits = normalized.toString();
  const significantDigits =
    digits.length >= 2 ? digits.slice(0, 2) : digits.padEnd(2, "0");

  const multiplierExponent = Math.max(0, digits.length - 2);
  const multiplier = 10 ** multiplierExponent;

  const firstDigit = Number(significantDigits[0] ?? 0);
  const secondDigit = Number(significantDigits[1] ?? 0);

  return [
    digitBandPalette[firstDigit] ?? digitBandPalette[0],
    digitBandPalette[secondDigit] ?? digitBandPalette[0],
    multiplierBandPalette[multiplier] ?? multiplierBandPalette[1],
    "#d4af37",
  ];
}
