import type { CeramicSnapshot, CodeOption, DielectricOption } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatCapacitancePf(valuePf: number) {
  if (valuePf >= 1000000) return `${formatNumber(valuePf / 1000000, 2)} uF`;
  if (valuePf >= 1000) return `${formatNumber(valuePf / 1000, 2)} nF`;
  return `${formatNumber(valuePf, 0)} pF`;
}

export function ceramicCodeToPf(code: string) {
  const firstTwo = Number(code.slice(0, 2));
  const multiplier = Number(code.slice(2));
  return firstTwo * Math.pow(10, multiplier);
}

export const codeOptions: CodeOption[] = [
  { code: "101", label: "101 = 100 pF" },
  { code: "102", label: "102 = 1 nF" },
  { code: "103", label: "103 = 10 nF" },
  { code: "104", label: "104 = 100 nF / 0.1 uF" },
  { code: "105", label: "105 = 1 uF" },
];

export const dielectricOptions: DielectricOption[] = [
  {
    name: "C0G / NP0",
    stability: 0.98,
    tempDrift: 0.02,
    color: "#dbeafe",
    note: "Very stable, ideal for timing and RF circuits",
  },
  {
    name: "X7R",
    stability: 0.78,
    tempDrift: 0.22,
    color: "#ede9fe",
    note: "Common choice for decoupling and filtering",
  },
  {
    name: "Y5V",
    stability: 0.45,
    tempDrift: 0.55,
    color: "#fee2e2",
    note: "High capacitance in small size, but lower stability",
  },
];

export function computeCeramicSnapshot({
  code,
  dielectric,
  appliedVoltage,
  voltageRating,
  frequency,
}: {
  code: string;
  dielectric: DielectricOption;
  appliedVoltage: number;
  voltageRating: number;
  frequency: number;
}): CeramicSnapshot {
  const capacitancePf = ceramicCodeToPf(code);
  const voltageStress = clamp(appliedVoltage / voltageRating, 0, 1.4);
  const safePercent = clamp((1 - voltageStress) * 100, 0, 100);
  const stabilityPercent = dielectric.stability * 100;
  const filterEffect = clamp(Math.log10(frequency + 1) / 5, 0.05, 1);
  const reactanceOhm = 1 / (2 * Math.PI * frequency * (capacitancePf * 1e-12));

  return {
    capacitancePf,
    voltageStress,
    safePercent,
    stabilityPercent,
    filterEffect,
    reactanceOhm,
  };
}
