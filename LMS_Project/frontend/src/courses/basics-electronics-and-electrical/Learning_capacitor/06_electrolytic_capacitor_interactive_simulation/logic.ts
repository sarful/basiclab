import type { ElectrolyticSnapshot, PolarityMode } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatCapacitance(valueUf: number) {
  if (valueUf >= 1000) return `${formatNumber(valueUf / 1000, 2)} mF`;
  return `${formatNumber(valueUf, 0)} uF`;
}

export function formatCurrent(value: number) {
  if (Math.abs(value) >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

export function formatEnergy(value: number) {
  if (value >= 1) return `${formatNumber(value, 3)} J`;
  return `${formatNumber(value * 1000, 2)} mJ`;
}

export const capacitanceOptions = [10, 22, 47, 100, 220, 470, 1000, 2200, 4700];
export const ratingOptions = [6.3, 10, 16, 25, 35, 50, 63];
export const esrOptions = [0.05, 0.1, 0.22, 0.47, 1, 2.2];

export function computeElectrolyticSnapshot({
  capacitance,
  voltageRating,
  appliedVoltage,
  esr,
  rippleCurrent,
  polarity,
}: {
  capacitance: number;
  voltageRating: number;
  appliedVoltage: number;
  esr: number;
  rippleCurrent: number;
  polarity: PolarityMode;
}): ElectrolyticSnapshot {
  const capacitanceFarad = capacitance / 1000000;
  const storedEnergy = 0.5 * capacitanceFarad * appliedVoltage * appliedVoltage;
  const voltageStress = appliedVoltage / voltageRating;
  const safetyMargin = clamp((1 - voltageStress) * 100, 0, 100);
  const smoothingLevel = clamp((capacitance / 1000) * (1 / Math.max(esr, 0.05)) * 0.12, 0.08, 1);
  const heatLoss = rippleCurrent * rippleCurrent * esr;
  const leakageRisk = clamp(voltageStress * 0.65 + (polarity === "reverse" ? 0.8 : 0), 0, 1);

  return {
    capacitanceFarad,
    storedEnergy,
    voltageStress,
    safetyMargin,
    smoothingLevel,
    heatLoss,
    leakageRisk,
  };
}
