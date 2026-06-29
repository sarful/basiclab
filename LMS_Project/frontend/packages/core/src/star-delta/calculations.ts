import type { ElectricalMode } from "../../../types/src";

export const STAR_DELTA_RATED_VOLTAGE = 415;

export function resolveMotorEfficiency(horsepower: number) {
  if (horsepower <= 2) return 0.82;
  if (horsepower <= 5) return 0.86;
  if (horsepower <= 10) return 0.88;
  return 0.9;
}

export function resolvePowerFactor(horsepower: number) {
  if (horsepower <= 2) return 0.76;
  if (horsepower <= 5) return 0.8;
  if (horsepower <= 10) return 0.83;
  return 0.85;
}

export function resolveFullLoadCurrent(
  horsepower: number,
  ratedVoltage = STAR_DELTA_RATED_VOLTAGE,
) {
  const safeHorsepower = Math.max(0.5, horsepower);
  const efficiency = resolveMotorEfficiency(safeHorsepower);
  const powerFactor = resolvePowerFactor(safeHorsepower);
  const outputWatts = safeHorsepower * 746;

  return outputWatts / (Math.sqrt(3) * ratedVoltage * efficiency * powerFactor);
}

export function resolveCurrent(
  horsepower: number,
  loadPercent: number,
  running: boolean,
  mode: ElectricalMode,
  ratedVoltage = STAR_DELTA_RATED_VOLTAGE,
) {
  const fullLoadCurrent = resolveFullLoadCurrent(horsepower, ratedVoltage);
  const loadFactor = Math.max(0, loadPercent / 100);
  const noLoadCurrent = fullLoadCurrent * 0.32;
  const ratedRunningCurrent =
    noLoadCurrent +
    (fullLoadCurrent - noLoadCurrent) * Math.min(loadFactor, 1) +
    fullLoadCurrent * Math.max(loadFactor - 1, 0) * 1.45;

  if (!running) return 0;
  if (mode === "transfer") return fullLoadCurrent * 0.18;
  if (mode === "main") return fullLoadCurrent * 0.22;
  if (mode === "star") {
    const starStartingCurrent = Math.max(
      fullLoadCurrent * 1.35,
      ratedRunningCurrent * 1.18,
    );
    return Math.min(starStartingCurrent, fullLoadCurrent * 2.1);
  }

  return ratedRunningCurrent;
}

export function resolveMotorSpeed(
  rpm: number,
  loadPercent: number,
  running: boolean,
  mode: ElectricalMode,
) {
  if (!running) return 0;
  if (mode === "transfer") return rpm * 0.42;
  if (mode === "delta") return rpm * Math.max(0.76, 1 - loadPercent / 250);
  if (mode === "star") return rpm * Math.max(0.52, 0.7 - loadPercent / 400);
  return rpm * 0.3;
}
