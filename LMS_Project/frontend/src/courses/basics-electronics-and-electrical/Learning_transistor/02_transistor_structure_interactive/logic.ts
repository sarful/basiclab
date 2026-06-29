export const BASE_EMITTER_THRESHOLD = 0.6;
export const MIN_VISIBLE_BASE_CURRENT = 0.00002;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function calculateBaseCurrent(
  active: boolean,
  baseVoltage: number,
  baseResistance: number,
) {
  if (!active) return 0;
  return Math.max((baseVoltage - BASE_EMITTER_THRESHOLD) / baseResistance, 0);
}
