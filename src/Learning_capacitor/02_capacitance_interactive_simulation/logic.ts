import type { CapacitanceSnapshot, DielectricOption } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatCapacitance(value: number) {
  if (value >= 1e-6) return `${formatNumber(value * 1e6, 2)} uF`;
  if (value >= 1e-9) return `${formatNumber(value * 1e9, 2)} nF`;
  return `${formatNumber(value * 1e12, 2)} pF`;
}

export function formatCharge(value: number) {
  if (value >= 0.001) return `${formatNumber(value * 1000, 3)} mC`;
  if (value >= 0.000001) return `${formatNumber(value * 1000000, 2)} uC`;
  return `${formatNumber(value * 1000000000, 2)} nC`;
}

export function formatEnergy(value: number) {
  if (value >= 0.001) return `${formatNumber(value * 1000, 3)} mJ`;
  return `${formatNumber(value * 1000000, 2)} uJ`;
}

export const dielectricOptions: DielectricOption[] = [
  { name: "Air", label: "Air", k: 1, color: "#e0f2fe", note: "Low capacitance" },
  { name: "Paper", label: "Paper", k: 3.5, color: "#fef3c7", note: "Medium capacitance" },
  { name: "Mica", label: "Mica", k: 6, color: "#ede9fe", note: "Stable capacitance" },
  { name: "Ceramic", label: "Ceramic", k: 10, color: "#fee2e2", note: "High capacitance" },
];

export function computeCapacitanceSnapshot({
  plateArea,
  plateDistance,
  dielectricK,
  voltage,
}: {
  plateArea: number;
  plateDistance: number;
  dielectricK: number;
  voltage: number;
}): CapacitanceSnapshot {
  const epsilonZero = 8.854e-12;
  const areaMeter = plateArea / 10000;
  const distanceMeter = plateDistance / 1000;
  const capacitance = (dielectricK * epsilonZero * areaMeter) / Math.max(distanceMeter, 0.000001);
  const charge = capacitance * voltage;
  const energy = 0.5 * capacitance * voltage * voltage;
  const capacitanceLevel = clamp((plateArea * dielectricK) / plateDistance / 95, 0.08, 1);

  return {
    capacitance,
    charge,
    energy,
    capacitanceLevel,
  };
}
