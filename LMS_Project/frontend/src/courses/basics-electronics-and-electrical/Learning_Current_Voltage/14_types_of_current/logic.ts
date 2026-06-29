export const MIN_DC_CURRENT = 0.2;
export const MAX_DC_CURRENT = 5;
export const MIN_AC_PEAK_CURRENT = 0.2;
export const MAX_AC_PEAK_CURRENT = 5;
export const MIN_FREQUENCY = 0.5;
export const MAX_FREQUENCY = 5;
export const DEFAULT_DC_CURRENT = 2;
export const DEFAULT_AC_PEAK_CURRENT = 2;
export const DEFAULT_FREQUENCY = 1;
export const SVG_WIDTH = 520;
export const SVG_HEIGHT = 220;
export const TIME_POINTS = 120;

export function calculateRmsCurrent(peakCurrent: number): number {
  return peakCurrent / Math.sqrt(2);
}

export function getFlowDuration(current: number): number {
  return Math.max(0.65, 3 - current / 2);
}

export function getCurrentStrengthPercent(current: number): number {
  return Math.min(100, Math.round((current / MAX_DC_CURRENT) * 100));
}

export function createSinePath(amplitude: number, frequency: number, scale: number): string {
  const points = Array.from({ length: TIME_POINTS }, (_, index) => {
    const x = 70 + (index / (TIME_POINTS - 1)) * 400;
    const t = index / (TIME_POINTS - 1);
    const y = 110 - Math.sin(t * Math.PI * 2 * frequency) * amplitude * scale;
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(" ");
}

export const currentTypeLogicTests = [
  { dcCurrent: 2, strength: 40 },
  { dcCurrent: 5, strength: 100 },
  { dcCurrent: 0.5, strength: 10 },
] as const;

export const acCurrentRmsTests = [
  { peak: 2, rmsApprox: 1.41 },
  { peak: 5, rmsApprox: 3.54 },
] as const;

