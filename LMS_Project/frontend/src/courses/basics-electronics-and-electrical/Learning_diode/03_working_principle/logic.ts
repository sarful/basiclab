import type { BiasMode, Section } from "./types";

export const sections: Section[] = ["construction", "formation", "working"];
export const biasModes: BiasMode[] = ["forward", "reverse"];

export function getWorkingState(bias: BiasMode, voltage: number) {
  const threshold = 0.7;
  const isConducting = bias === "forward" && voltage >= threshold;
  const intensity = isConducting ? Math.min(1, (voltage - threshold) / 4.3) : 0;
  return { threshold, isConducting, intensity };
}

export function runSimulationTests() {
  const tests = [
    { name: "Construction section exists", pass: sections.includes("construction") },
    { name: "Formation section exists", pass: sections.includes("formation") },
    { name: "Working section exists", pass: sections.includes("working") },
    { name: "Forward mode exists", pass: biasModes.includes("forward") },
    { name: "Reverse mode exists", pass: biasModes.includes("reverse") },
    { name: "Forward conducts above 0.7V", pass: getWorkingState("forward", 5).isConducting === true },
    { name: "Forward blocks below 0.7V", pass: getWorkingState("forward", 0.3).isConducting === false },
    { name: "Reverse blocks at 12V", pass: getWorkingState("reverse", 12).isConducting === false },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
