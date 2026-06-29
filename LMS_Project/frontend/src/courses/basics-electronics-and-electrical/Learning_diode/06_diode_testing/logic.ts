import type { MeterMode, ReadingInput } from "./types";

export const meterOptions: Array<{ mode: MeterMode; label: string; angle: number }> = [
  { mode: "off", label: "OFF", angle: -120 },
  { mode: "resistance", label: "OHM", angle: -45 },
  { mode: "diode", label: "DIODE", angle: 35 },
  { mode: "continuity", label: "BEEP", angle: 115 },
];

export function calculateReading({
  connected,
  meterMode,
  diodeType,
  forward,
}: ReadingInput) {
  if (meterMode === "off") return "OFF";
  if (!connected) return "---";

  if (meterMode === "continuity") {
    return diodeType === "short" ? "BEEP" : "OL";
  }

  if (meterMode === "resistance") {
    if (diodeType === "short") return "0 OHM";
    if (diodeType === "open") return "INF";
    return forward ? "680 OHM" : "INF";
  }

  if (diodeType === "short") return "0.00";
  if (diodeType === "open") return "OL";

  return forward ? "0.68" : "OL";
}

export function calculateNeedleRotation({
  connected,
  meterMode,
  diodeType,
  forward,
}: ReadingInput) {
  if (meterMode === "off") return -65;
  if (!connected) return -65;
  if (diodeType === "short") return 62;
  if (diodeType === "open") return -65;
  if (meterMode === "continuity") return -65;
  if (meterMode === "resistance") return forward ? 18 : -65;
  if (meterMode === "diode") return forward ? 32 : -65;
  return -65;
}

export function runReadingTests() {
  const testCases: Array<ReadingInput & { expected: string; name: string }> = [
    {
      name: "Meter off shows OFF",
      connected: true,
      meterMode: "off",
      diodeType: "good",
      forward: true,
      expected: "OFF",
    },
    {
      name: "Disconnected meter shows standby display",
      connected: false,
      meterMode: "diode",
      diodeType: "good",
      forward: true,
      expected: "---",
    },
    {
      name: "Good silicon diode forward test shows voltage drop",
      connected: true,
      meterMode: "diode",
      diodeType: "good",
      forward: true,
      expected: "0.68",
    },
    {
      name: "Good silicon diode reverse test shows open loop",
      connected: true,
      meterMode: "diode",
      diodeType: "good",
      forward: false,
      expected: "OL",
    },
    {
      name: "Shorted diode shows near zero voltage",
      connected: true,
      meterMode: "diode",
      diodeType: "short",
      forward: true,
      expected: "0.00",
    },
    {
      name: "Open diode shows open loop",
      connected: true,
      meterMode: "diode",
      diodeType: "open",
      forward: true,
      expected: "OL",
    },
    {
      name: "Shorted diode continuity mode beeps",
      connected: true,
      meterMode: "continuity",
      diodeType: "short",
      forward: true,
      expected: "BEEP",
    },
    {
      name: "Good diode resistance forward test shows resistance",
      connected: true,
      meterMode: "resistance",
      diodeType: "good",
      forward: true,
      expected: "680 OHM",
    },
    {
      name: "Good diode resistance reverse test shows infinity",
      connected: true,
      meterMode: "resistance",
      diodeType: "good",
      forward: false,
      expected: "INF",
    },
  ];

  testCases.forEach((test) => {
    const actual = calculateReading(test);
    console.assert(
      actual === test.expected,
      `[DiodeLab Test Failed] ${test.name}: expected ${test.expected}, received ${actual}`,
    );
  });
}
