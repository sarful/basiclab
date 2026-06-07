import type { CalculationTestCase, TransistorLevel } from "./types";

export const MIN_BASE_BIAS_CURRENT = 0.0002;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function formatResistance(value: number) {
  if (value >= 1000) {
    return `${formatNumber(value / 1000, value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `${value}`;
}

export function getTransistorLevel({
  switchOn,
  transistorBiased,
  lampGlow,
}: {
  switchOn: boolean;
  transistorBiased: boolean;
  lampGlow: number;
}): TransistorLevel {
  if (!switchOn) return "OFF";
  if (!transistorBiased) return "CUT-OFF";
  if (lampGlow > 0.86) return "SATURATION";
  if (lampGlow > 0.35) return "ACTIVE";
  return "WEAK ACTIVE";
}

export const CALCULATION_TEST_CASES: CalculationTestCase[] = [
  {
    name: "switch off base current",
    switchOn: false,
    voltage: 9,
    resistance: 10000,
    gain: 100,
    load: 300,
    expectedBaseCurrent: 0,
    expectedLevel: "OFF",
  },
  {
    name: "9V through 10k base resistor",
    switchOn: true,
    voltage: 9,
    resistance: 10000,
    gain: 100,
    load: 300,
    expectedBaseCurrent: 0.0009,
  },
  {
    name: "minimum bias current required",
    switchOn: true,
    voltage: 3,
    resistance: 50000,
    gain: 100,
    load: 300,
    minimumBiasCurrent: MIN_BASE_BIAS_CURRENT,
    expectedTransistorOn: false,
    expectedLevel: "CUT-OFF",
  },
  {
    name: "collector current is limited by load",
    switchOn: true,
    voltage: 9,
    resistance: 10000,
    gain: 200,
    load: 300,
    expectedMaxCollectorCurrent: 0.03,
    expectedLevel: "SATURATION",
  },
  {
    name: "base resistance slider affects base current",
    switchOn: true,
    voltage: 9,
    resistance: 5000,
    gain: 100,
    load: 300,
    expectedBaseCurrent: 0.0018,
  },
];
