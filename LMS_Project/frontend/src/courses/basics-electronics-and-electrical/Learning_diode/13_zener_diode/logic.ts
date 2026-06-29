import type { BiasMode } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getZenerState(
  voltage: number,
  zenerVoltage: number,
  biasMode: BiasMode,
) {
  const forwardThreshold = 0.7;
  const isForwardOn = biasMode === "forward" && voltage >= forwardThreshold;
  const isBreakdown = biasMode === "reverse" && voltage >= zenerVoltage;
  const active = isForwardOn || isBreakdown;
  const currentMA = isBreakdown
    ? clamp((voltage - zenerVoltage) * 8, 0, 45)
    : isForwardOn
      ? clamp((voltage - forwardThreshold) * 6, 0, 35)
      : 0;

  return {
    active,
    isForwardOn,
    isBreakdown,
    currentMA,
    outputVoltage: isBreakdown
      ? zenerVoltage
      : biasMode === "forward" && isForwardOn
        ? forwardThreshold
        : 0,
    status: isBreakdown
      ? "Breakdown Active"
      : isForwardOn
        ? "Forward Conducting"
        : "No Conduction",
  };
}

export function runSimulationTests() {
  const tests = [
    {
      name: "Reverse below Vz does not breakdown",
      pass: getZenerState(4, 5.1, "reverse").isBreakdown === false,
    },
    {
      name: "Reverse above Vz breakdown active",
      pass: getZenerState(6, 5.1, "reverse").isBreakdown === true,
    },
    {
      name: "Forward above 0.7V conducts",
      pass: getZenerState(1, 5.1, "forward").isForwardOn === true,
    },
    {
      name: "Forward below 0.7V blocks",
      pass: getZenerState(0.3, 5.1, "forward").isForwardOn === false,
    },
    {
      name: "Breakdown clamps output voltage to Vz",
      pass: getZenerState(9, 5.1, "reverse").outputVoltage === 5.1,
    },
    {
      name: "Current never goes negative",
      pass: getZenerState(0, 5.1, "reverse").currentMA >= 0,
    },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
