import type { BiasMode, Section } from "./types";

export const sections: Section[] = ["working", "characteristics"];
export const biasModes: BiasMode[] = ["forward", "reverse"];

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getWorkingState(bias: BiasMode, voltage: number) {
  const threshold = 0.7;
  const isConducting = bias === "forward" && voltage >= threshold;
  const intensity = isConducting ? clamp((voltage - threshold) / 4.3, 0, 1) : 0;
  const currentMA = isConducting ? intensity * 20 : 0;
  return { threshold, isConducting, intensity, currentMA };
}

export function getCharacteristicPoint(voltage: number) {
  const threshold = 0.7;
  const forwardCurrentMA =
    voltage <= threshold ? 0 : 2.4 * (Math.exp((voltage - threshold) / 2.25) - 1);
  const currentMA = clamp(forwardCurrentMA, 0, 100);
  const x = 70 + (voltage / 12) * 380;
  const y = 250 - (currentMA / 100) * 180;
  return { x, y, currentMA, threshold };
}

export function runSimulationTests() {
  const tests = [
    { name: "Working section exists", pass: sections.includes("working") },
    { name: "Characteristics section exists", pass: sections.includes("characteristics") },
    { name: "Forward mode exists", pass: biasModes.includes("forward") },
    { name: "Reverse mode exists", pass: biasModes.includes("reverse") },
    { name: "Forward conducts above 0.7V", pass: getWorkingState("forward", 5).isConducting === true },
    { name: "Forward blocks below 0.7V", pass: getWorkingState("forward", 0.3).isConducting === false },
    { name: "Reverse blocks at 12V", pass: getWorkingState("reverse", 12).isConducting === false },
    {
      name: "Characteristic point stays inside chart at 12V",
      pass: getCharacteristicPoint(12).y >= 70 && getCharacteristicPoint(12).y <= 250,
    },
    {
      name: "Characteristic point starts at graph origin",
      pass: getCharacteristicPoint(0).x === 70 && getCharacteristicPoint(0).y === 250,
    },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
