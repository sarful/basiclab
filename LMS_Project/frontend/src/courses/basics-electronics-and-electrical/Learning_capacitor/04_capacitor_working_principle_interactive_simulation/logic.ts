import type { WorkingMode, WorkingPrincipleSnapshot } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatCurrent(value: number) {
  if (Math.abs(value) >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

export function formatCharge(value: number) {
  return `${formatNumber(value * 1000000, 2)} uC`;
}

export function formatEnergy(value: number) {
  return `${formatNumber(value * 1000, 3)} mJ`;
}

export function computeWorkingPrincipleSnapshot({
  supplyVoltage,
  resistance,
  capacitance,
  time,
  mode,
}: {
  supplyVoltage: number;
  resistance: number;
  capacitance: number;
  time: number;
  mode: WorkingMode;
}): WorkingPrincipleSnapshot {
  const capacitanceFarad = capacitance / 1000000;
  const timeConstant = resistance * capacitanceFarad;
  const safeTau = Math.max(timeConstant, 0.000001);

  const chargeRatio =
    mode === "charging" ? 1 - Math.exp(-time / safeTau) : Math.exp(-time / safeTau);

  const capacitorVoltage = supplyVoltage * chargeRatio;

  const current =
    mode === "charging"
      ? (supplyVoltage / resistance) * Math.exp(-time / safeTau)
      : -(supplyVoltage / resistance) * Math.exp(-time / safeTau);

  const storedCharge = capacitanceFarad * capacitorVoltage;
  const storedEnergy = 0.5 * capacitanceFarad * capacitorVoltage * capacitorVoltage;
  const maxTime = clamp(timeConstant * 6, 0.5, 25);

  return {
    capacitanceFarad,
    timeConstant,
    chargeRatio,
    capacitorVoltage,
    current,
    storedCharge,
    storedEnergy,
    maxTime,
  };
}
