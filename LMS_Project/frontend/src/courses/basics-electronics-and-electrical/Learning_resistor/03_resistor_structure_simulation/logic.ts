"use client";

import type { MaterialSpec } from "./types";

const REFERENCE_TEMPERATURE_C = 25;
const MIN_SAFE_RESISTANCE_OHM = 0.001;
const CURRENT_DENSITY_REFERENCE_A = 0.08;
const POWER_REFERENCE_W = 1.2;
const MAX_EDUCATIONAL_RESISTANCE_OHM = 5000;
const MAX_EDUCATIONAL_TEMPERATURE_C = 180;

const TEMPERATURE_COEFFICIENTS: Record<MaterialSpec["key"], number> = {
  carbon: 0.0012,
  "metal-film": 0.00025,
  "wire-wound": 0.00055,
};

export type ThermalStressStatus = "safe" | "warm" | "hot" | "failure-risk";

export type SafetyTone = {
  text: string;
  background: string;
  border: string;
  badge: string;
};

export const materials: MaterialSpec[] = [
  {
    key: "carbon",
    label: "Carbon Composition",
    shellColor: "#334155",
    coreColor: "#64748b",
    resistanceFactor: 1.18,
    heatFactor: 0.76,
    note: "Traditional carbon-based construction with higher noise, lower precision, and more resistance drift under heat.",
  },
  {
    key: "metal-film",
    label: "Metal Film",
    shellColor: "#2563eb",
    coreColor: "#93c5fd",
    resistanceFactor: 0.84,
    heatFactor: 0.48,
    note: "Thin metal film on a ceramic core with low noise, high precision, and excellent long-term stability.",
  },
  {
    key: "wire-wound",
    label: "Wire Wound",
    shellColor: "#ea580c",
    coreColor: "#fdba74",
    resistanceFactor: 0.95,
    heatFactor: 0.92,
    note: "Resistive wire wound around a ceramic core with high power handling, strong heat tolerance, and possible inductive behavior.",
  },
];

export function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function formatValue(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function calculateThermalFactor(
  temperature: number,
  material?: MaterialSpec,
) {
  const coefficient = material
    ? TEMPERATURE_COEFFICIENTS[material.key]
    : 0.0005;

  const temperatureRise = temperature - REFERENCE_TEMPERATURE_C;
  return clamp(1 + temperatureRise * coefficient, 0.75, 1.35);
}

export function calculateResistance(
  baseResistance: number,
  material: MaterialSpec,
  temperature: number,
) {
  const safeBaseResistance = Math.max(baseResistance, MIN_SAFE_RESISTANCE_OHM);
  return (
    safeBaseResistance *
    material.resistanceFactor *
    calculateThermalFactor(temperature, material)
  );
}

export function calculateCurrent(voltage: number, resistance: number) {
  const safeResistance = Math.max(resistance, MIN_SAFE_RESISTANCE_OHM);
  return voltage / safeResistance;
}

export function calculatePower(voltage: number, current: number) {
  return voltage * current;
}

export function calculateHeatLevel(
  power: number,
  material: MaterialSpec,
  temperature: number,
) {
  const powerHeat = (power / POWER_REFERENCE_W) * material.heatFactor;
  const ambientHeat = clamp(
    (temperature - REFERENCE_TEMPERATURE_C) /
      (MAX_EDUCATIONAL_TEMPERATURE_C - REFERENCE_TEMPERATURE_C),
    0,
    1,
  );

  return clamp(powerHeat * 0.72 + ambientHeat * 0.28, 0, 1);
}

export function calculateThermalStress(
  power: number,
  material: MaterialSpec,
  temperature: number,
): ThermalStressStatus {
  const heatLevel = calculateHeatLevel(power, material, temperature);

  if (heatLevel >= 0.86) return "failure-risk";
  if (heatLevel >= 0.66) return "hot";
  if (heatLevel >= 0.42) return "warm";
  return "safe";
}

export function calculateCurrentDensity(current: number, resistance: number) {
  const resistanceLimiter = clamp(
    MAX_EDUCATIONAL_RESISTANCE_OHM /
      Math.max(resistance, MIN_SAFE_RESISTANCE_OHM),
    0.25,
    1,
  );

  return clamp(
    (current / CURRENT_DENSITY_REFERENCE_A) * resistanceLimiter,
    0,
    1,
  );
}

export function calculateCollisionLevel(
  resistance: number,
  temperature: number,
) {
  const resistanceEffect = clamp(
    resistance / MAX_EDUCATIONAL_RESISTANCE_OHM,
    0,
    1,
  );
  const temperatureEffect = clamp(
    temperature / MAX_EDUCATIONAL_TEMPERATURE_C,
    0,
    1,
  );

  return clamp(resistanceEffect * 0.72 + temperatureEffect * 0.28, 0, 1);
}

export function calculatePowerDissipationLevel(power: number) {
  return clamp(power / POWER_REFERENCE_W, 0, 1);
}

export function getSafetyLabel(heatLevel: number) {
  if (heatLevel >= 0.86) return "Failure Risk";
  if (heatLevel >= 0.66) return "Hot";
  if (heatLevel >= 0.42) return "Warm";
  return "Safe";
}

export function getSafetyTone(heatLevel: number): SafetyTone {
  if (heatLevel >= 0.86) {
    return {
      text: "text-red-700",
      background: "bg-red-100",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700 ring-red-200",
    };
  }

  if (heatLevel >= 0.66) {
    return {
      text: "text-orange-700",
      background: "bg-orange-100",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-700 ring-orange-200",
    };
  }

  if (heatLevel >= 0.42) {
    return {
      text: "text-yellow-700",
      background: "bg-yellow-100",
      border: "border-yellow-200",
      badge: "bg-yellow-100 text-yellow-700 ring-yellow-200",
    };
  }

  return {
    text: "text-green-700",
    background: "bg-green-100",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700 ring-green-200",
  };
}

export function formatResistance(value: number) {
  if (!Number.isFinite(value)) return "0 Ω";

  const safeValue = Math.max(value, 0);

  if (safeValue >= 1000) {
    return `${formatValue(safeValue / 1000, 2)} kΩ`;
  }

  return `${formatValue(safeValue, 1)} Ω`;
}

export function formatCurrent(value: number) {
  if (!Number.isFinite(value)) return "0 mA";

  const safeValue = Math.max(value, 0);

  if (safeValue >= 1) {
    return `${formatValue(safeValue, 3)} A`;
  }

  return `${formatValue(safeValue * 1000, 2)} mA`;
}

export function formatPower(value: number) {
  if (!Number.isFinite(value)) return "0 mW";

  const safeValue = Math.max(value, 0);

  if (safeValue >= 1) {
    return `${formatValue(safeValue, 3)} W`;
  }

  return `${formatValue(safeValue * 1000, 2)} mW`;
}

export function formatTemperature(value: number) {
  return `${formatValue(value, 0)} °C`;
}

export function formatPercent(value: number) {
  return `${Math.round(clamp(value, 0, 1) * 100)}%`;
}
