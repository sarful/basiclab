import type { FlowLevel } from "./types";

export const DEFAULT_VOLTAGE = 12;
export const DEFAULT_BRANCH_ONE = 6;
export const DEFAULT_BRANCH_TWO = 12;
export const DEFAULT_BRANCH_THREE = 18;
export const ELECTRON_COUNT = 12;

export function getElectronSpeed(current: number) {
  return Math.max(1, 4.8 - Math.min(current, 5) * 0.55);
}

export function solveParallelCircuitLesson(
  voltage: number,
  branchOneResistance: number,
  branchTwoResistance: number,
  branchThreeResistance: number,
) {
  const r1 = Math.max(1, branchOneResistance);
  const r2 = Math.max(1, branchTwoResistance);
  const r3 = Math.max(1, branchThreeResistance);
  const currentOne = voltage / r1;
  const currentTwo = voltage / r2;
  const currentThree = voltage / r3;
  const totalCurrent = currentOne + currentTwo + currentThree;
  const equivalentResistance = totalCurrent <= 0 ? 0 : voltage / totalCurrent;

  return {
    voltage,
    branchOneResistance: r1,
    branchTwoResistance: r2,
    branchThreeResistance: r3,
    currentOne,
    currentTwo,
    currentThree,
    totalCurrent,
    equivalentResistance,
    branchRuleText: `${currentOne.toFixed(2)}A + ${currentTwo.toFixed(2)}A + ${currentThree.toFixed(2)}A = ${totalCurrent.toFixed(2)}A`,
  };
}

export function getFlowPercent(current: number) {
  return Math.min(100, Math.max(12, (current / 4) * 100));
}

export function getFlowLevel(current: number): FlowLevel {
  if (current >= 2.5) return "High";
  if (current >= 1.2) return "Medium";
  return "Low";
}
