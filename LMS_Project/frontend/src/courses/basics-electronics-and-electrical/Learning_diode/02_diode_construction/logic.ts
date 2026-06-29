import type { LayerView } from "./types";

export const views: LayerView[] = ["basic", "doping", "junction", "formation"];

export function runSimulationTests() {
  const tests = [
    { name: "Basic layer view exists", pass: views.includes("basic") },
    { name: "Doping layer view exists", pass: views.includes("doping") },
    { name: "Junction layer view exists", pass: views.includes("junction") },
    { name: "Formation animation view exists", pass: views.includes("formation") },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
