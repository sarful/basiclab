import type { BiasMode } from "./types";

export function getLedState(bias: BiasMode, voltage: number) {
  const threshold = 0.7;
  const isConducting = bias === "forward" && voltage >= threshold;
  const currentLevel = isConducting ? Math.min(1, (voltage - threshold) / 4.3) : 0;

  return {
    isConducting,
    currentLevel,
    threshold,
  };
}

export function getBiasResult(bias: BiasMode, voltage = 12) {
  const led = getLedState(bias, voltage);

  return bias === "forward"
    ? {
        isConducting: led.isConducting,
        title: led.isConducting ? "Forward Bias: LED ON" : "Forward Bias: LED OFF",
        text: led.isConducting
          ? `Voltage ${voltage.toFixed(1)}V, তাই diode threshold অতিক্রম করেছে এবং current flow হচ্ছে।`
          : `Voltage ${voltage.toFixed(1)}V, যা 0.7V threshold-এর কম। তাই LED এখনো OFF।`,
      }
    : {
        isConducting: false,
        title: "Reverse Bias: LED OFF",
        text: `Reverse polarity-তে ${voltage.toFixed(1)}V দিলেও diode current block করে, তাই LED OFF থাকে।`,
      };
}

export function runSimulationTests() {
  const tests = [
    {
      name: "Forward bias conducts above threshold",
      pass: getBiasResult("forward", 12).isConducting === true,
    },
    {
      name: "Forward bias blocks below threshold",
      pass: getBiasResult("forward", 0.3).isConducting === false,
    },
    { name: "Reverse bias blocks", pass: getBiasResult("reverse", 12).isConducting === false },
    { name: "LED current level caps at 1", pass: getLedState("forward", 12).currentLevel === 1 },
    { name: "Reverse current level stays 0", pass: getLedState("reverse", 12).currentLevel === 0 },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
