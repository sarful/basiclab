import type { CapacitorSnapshot, CircuitMode } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatCapacitance(value: number) {
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} mF`;
  return `${formatNumber(value, 0)} uF`;
}

export function formatResistance(value: number) {
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kOhm`;
  return `${formatNumber(value, 0)} Ohm`;
}

export function formatCurrent(value: number) {
  const absoluteValue = Math.abs(value);
  if (absoluteValue >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

export function formatCharge(value: number) {
  if (value >= 0.001) return `${formatNumber(value * 1000, 3)} mC`;
  return `${formatNumber(value * 1000000, 2)} uC`;
}

export function formatEnergy(value: number) {
  if (value >= 0.001) return `${formatNumber(value * 1000, 3)} mJ`;
  return `${formatNumber(value * 1000000, 2)} uJ`;
}

export const capacitanceOptions = [10, 22, 47, 100, 220, 470, 1000, 2200, 4700];
export const resistanceOptions = [100, 220, 470, 1000, 2200, 4700, 10000, 22000, 47000];

export function computeCapacitorSnapshot({
  supplyVoltage,
  capacitance,
  resistance,
  time,
  mode,
}: {
  supplyVoltage: number;
  capacitance: number;
  resistance: number;
  time: number;
  mode: CircuitMode;
}): CapacitorSnapshot {
  const capacitanceFarad = capacitance / 1000000;
  const timeConstant = resistance * capacitanceFarad;
  const safeTau = Math.max(timeConstant, 0.000001);
  const chargeLevel =
    mode === "charge" ? 1 - Math.exp(-time / safeTau) : Math.exp(-time / safeTau);
  const capacitorVoltage = supplyVoltage * chargeLevel;
  const storedCharge = capacitanceFarad * capacitorVoltage;
  const storedEnergy = 0.5 * capacitanceFarad * capacitorVoltage * capacitorVoltage;
  const current =
    mode === "charge"
      ? (supplyVoltage / resistance) * Math.exp(-time / safeTau)
      : -(supplyVoltage / resistance) * Math.exp(-time / safeTau);
  const maxTime = clamp(timeConstant * 6, 0.2, 30);

  return {
    capacitanceFarad,
    timeConstant,
    chargeLevel,
    capacitorVoltage,
    storedCharge,
    storedEnergy,
    current,
    maxTime,
  };
}
