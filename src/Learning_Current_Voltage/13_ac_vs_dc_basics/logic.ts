export const DEFAULT_DC_LEVEL = 6;
export const DEFAULT_AC_PEAK = 6;
export const DEFAULT_FREQUENCY = 2;
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 12;
export const MIN_FREQUENCY = 0.5;
export const MAX_FREQUENCY = 6;

export function getRmsFromPeak(peak: number) {
  return peak / Math.sqrt(2);
}

export function getDcStrength(level: number) {
  return Math.min(100, Math.max(10, (level / MAX_LEVEL) * 100));
}

export function getAcStrength(peak: number) {
  return Math.min(100, Math.max(10, (peak / MAX_LEVEL) * 100));
}

