import type { FuseRating, FuseState, SimulationResult, SimulationTest } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function fuseRatingToAmps(rating: FuseRating) {
  if (rating === "0.5A") return 0.5;
  if (rating === "1A") return 1;
  if (rating === "2A") return 2;
  return 5;
}

export function calculateFuseSimulation({
  supplyVoltage,
  loadResistance,
  fuseRating,
  fuseState,
}: {
  supplyVoltage: number;
  loadResistance: number;
  fuseRating: FuseRating;
  fuseState: FuseState;
}): SimulationResult {
  const fuseLimitA = fuseRatingToAmps(fuseRating);
  const currentA = fuseState === "BLOWN" ? 0 : clamp(supplyVoltage / loadResistance, 0, 20);
  const overloadPercent = fuseLimitA > 0 ? (currentA / fuseLimitA) * 100 : 0;
  const shouldBlow = currentA > fuseLimitA;
  const loadPowerW = currentA * currentA * loadResistance;
  const statusText =
    fuseState === "BLOWN"
      ? "Fuse blown: circuit open, current flow stopped."
      : shouldBlow
        ? "Overcurrent detected: the fuse should blow."
        : "Fuse healthy: current is inside the safe limit.";

  return { currentA, fuseLimitA, overloadPercent, shouldBlow, loadPowerW, statusText };
}

export const simulationTests: SimulationTest[] = [
  {
    name: "safe current does not blow fuse",
    input: { supplyVoltage: 5, loadResistance: 20, fuseRating: "1A", fuseState: "GOOD" },
    expectedShouldBlow: false,
  },
  {
    name: "overcurrent should blow fuse",
    input: { supplyVoltage: 24, loadResistance: 10, fuseRating: "1A", fuseState: "GOOD" },
    expectedShouldBlow: true,
  },
  {
    name: "blown fuse stops current",
    input: { supplyVoltage: 24, loadResistance: 10, fuseRating: "1A", fuseState: "BLOWN" },
    expectedCurrentA: 0,
  },
];

export function runSimulationTests() {
  return simulationTests.every((test) => {
    const result = calculateFuseSimulation(test.input);
    const blowOk =
      test.expectedShouldBlow === undefined || result.shouldBlow === test.expectedShouldBlow;
    const currentOk =
      test.expectedCurrentA === undefined || result.currentA === test.expectedCurrentA;
    return blowOk && currentOk;
  });
}
