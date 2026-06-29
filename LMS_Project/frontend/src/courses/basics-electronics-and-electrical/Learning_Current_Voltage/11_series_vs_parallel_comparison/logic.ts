import type { FlowLevel } from "./types";

export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_RESISTANCE_ONE = 4;
export const DEFAULT_RESISTANCE_TWO = 8;
export const ELECTRON_COUNT = 10;

export function solveSeriesVsParallelLesson(
  voltage: number,
  resistanceOne: number,
  resistanceTwo: number,
) {
  const r1 = Math.max(1, resistanceOne);
  const r2 = Math.max(1, resistanceTwo);

  const seriesTotalResistance = r1 + r2;
  const seriesCurrent = voltage / seriesTotalResistance;
  const seriesDropOne = seriesCurrent * r1;
  const seriesDropTwo = seriesCurrent * r2;

  const parallelCurrentOne = voltage / r1;
  const parallelCurrentTwo = voltage / r2;
  const parallelTotalCurrent = parallelCurrentOne + parallelCurrentTwo;
  const parallelEquivalentResistance =
    parallelTotalCurrent <= 0 ? 0 : voltage / parallelTotalCurrent;

  return {
    voltage,
    resistanceOne: r1,
    resistanceTwo: r2,
    seriesTotalResistance,
    seriesCurrent,
    seriesDropOne,
    seriesDropTwo,
    parallelCurrentOne,
    parallelCurrentTwo,
    parallelTotalCurrent,
    parallelEquivalentResistance,
  };
}

export function getSeriesFlowPercent(current: number) {
  return Math.min(100, Math.max(12, (current / 2.5) * 100));
}

export function getParallelFlowPercent(current: number) {
  return Math.min(100, Math.max(12, (current / 4) * 100));
}

export function getFlowLevel(current: number): FlowLevel {
  if (current >= 2.5) return "High";
  if (current >= 1.1) return "Medium";
  return "Low";
}

