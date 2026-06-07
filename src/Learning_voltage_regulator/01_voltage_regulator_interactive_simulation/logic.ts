import type { LoadMode, RegulatorType } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function getLoadCurrent(loadMode: LoadMode) {
  return loadMode === "Light" ? 0.2 : loadMode === "Heavy" ? 1.5 : 0.8;
}

export function getRegulatorBaseVoltage(regulatorType: RegulatorType) {
  if (regulatorType === "7809") return 9;
  if (regulatorType === "7812") return 12;
  if (regulatorType === "7905") return -5;
  if (regulatorType === "7912") return -12;
  if (regulatorType === "LM317") return 12;
  return 5;
}

export function getRegulatorResults(
  regulatorType: RegulatorType,
  inputVoltage: number,
  loadCurrent: number,
  ripple: number,
) {
  const vout = getRegulatorBaseVoltage(regulatorType);
  const effective =
    vout < 0
      ? -clamp(Math.abs(vout) - loadCurrent * 0.4, 0, Math.abs(vout))
      : clamp(vout - loadCurrent * 0.4, 0, vout);
  const efficiency = ["7805", "7809", "7812", "7905", "7912"].includes(
    regulatorType,
  )
    ? 45
    : 58;
  const heat = clamp((inputVoltage - effective) * 5, 10, 100);
  const filteredRipple = ripple * 0.08;

  return { effective, efficiency, heat, filteredRipple };
}
