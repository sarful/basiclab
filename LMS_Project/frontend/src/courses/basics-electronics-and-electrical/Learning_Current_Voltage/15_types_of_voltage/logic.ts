export const DC_VOLTAGE_MIN = 1;
export const DC_VOLTAGE_MAX = 20;
export const AC_PEAK_MIN = 1;
export const AC_PEAK_MAX = 20;
export const RESISTANCE_MIN = 1;
export const RESISTANCE_MAX = 20;
export const FREQUENCY_MIN = 0.5;
export const FREQUENCY_MAX = 5;
export const SVG_WIDTH = 520;
export const SVG_HEIGHT = 220;
export const TIME_POINTS = 120;

export const DEFAULT_DC_VOLTAGE = 10;
export const DEFAULT_DC_RESISTANCE = 5;
export const DEFAULT_AC_PEAK_VOLTAGE = 10;
export const DEFAULT_AC_FREQUENCY = 1;
export const DEFAULT_AC_RESISTANCE = 5;

export const voltagePresets = [5, 10, 15, 20] as const;

export function calculateCurrent(voltage: number, resistance: number): number {
  return resistance <= 0 ? 0 : voltage / resistance;
}

export function calculateRms(value: number): number {
  return value / Math.sqrt(2);
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function createSinePath(amplitude: number, frequency: number, scale: number): string {
  const points = Array.from({ length: TIME_POINTS }, (_, index) => {
    const x = 70 + (index / (TIME_POINTS - 1)) * 400;
    const t = index / (TIME_POINTS - 1);
    const y = 100 - Math.sin(t * Math.PI * 2 * frequency) * amplitude * scale;
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(" ");
}

export const voltageTypeLogicTests = [
  { voltage: 10, resistance: 5, current: 2 },
  { voltage: 20, resistance: 10, current: 2 },
  { voltage: 5, resistance: 5, current: 1 },
] as const;

export const rmsLogicTests = [
  { peak: 10, rmsApprox: 7.07 },
  { peak: 20, rmsApprox: 14.14 },
] as const;

export const clampLogicTests = [
  { input: -5, min: 1, max: 20, output: 1 },
  { input: 10, min: 1, max: 20, output: 10 },
  { input: 30, min: 1, max: 20, output: 20 },
] as const;

