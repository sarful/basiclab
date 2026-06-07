import type { DielectricOption, StructureSnapshot } from "./types";

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

export const dielectricOptions: DielectricOption[] = [
  { name: "Air", label: "Air", k: 1, color: "#e0f2fe", note: "Lowest dielectric strength" },
  { name: "Paper", label: "Paper", k: 3.5, color: "#fef3c7", note: "Used in some general capacitors" },
  { name: "Mica", label: "Mica", k: 6, color: "#ede9fe", note: "Stable and low-loss dielectric" },
  { name: "Ceramic", label: "Ceramic", k: 10, color: "#fee2e2", note: "High capacitance in small size" },
];

export function computeStructureSnapshot({
  plateArea,
  plateDistance,
  dielectricK,
}: {
  plateArea: number;
  plateDistance: number;
  dielectricK: number;
}): StructureSnapshot {
  const epsilonZero = 8.854e-12;
  const areaMeter = plateArea / 10000;
  const distanceMeter = plateDistance / 1000;
  const capacitance = (dielectricK * epsilonZero * areaMeter) / Math.max(distanceMeter, 0.000001);
  const relativeEffect = clamp((plateArea * dielectricK) / plateDistance / 90, 0.08, 1);

  return {
    capacitance,
    relativeEffect,
  };
}
