import type { BiasMode, Section } from "./types";

export const sections: Section[] = ["working", "characteristics"];
export const biasModes: BiasMode[] = ["forward", "reverse"];

export const DIODE_MODEL = {
  thresholdVoltage: 0.7,
  maxSupplyVoltage: 12,
  seriesResistanceOhms: 470,
  maxSafeCurrentMA: 25,
  reverseLeakageMA: 0.001,
  reverseBreakdownVoltage: -50,
} as const;

export const CHARACTERISTIC_CHART = {
  x: 72,
  y: 45,
  width: 410,
  height: 220,
  zeroY: 265,
  minVoltage: -12,
  maxVoltage: 12,
  minCurrentMA: -25,
  maxCurrentMA: 25,
} as const;

export type WorkingState = {
  threshold: number;
  isConducting: boolean;
  intensity: number;
  currentMA: number;
  region: "forward" | "below-threshold" | "reverse-blocked";
};

export type CharacteristicPoint = {
  x: number;
  y: number;
  voltage: number;
  currentMA: number;
  threshold: number;
  isConducting: boolean;
  region: WorkingState["region"];
};

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function voltageToX(voltage: number): number {
  const safeVoltage = clamp(
    voltage,
    CHARACTERISTIC_CHART.minVoltage,
    CHARACTERISTIC_CHART.maxVoltage,
  );

  const ratio =
    (safeVoltage - CHARACTERISTIC_CHART.minVoltage) /
    (CHARACTERISTIC_CHART.maxVoltage - CHARACTERISTIC_CHART.minVoltage);

  return CHARACTERISTIC_CHART.x + ratio * CHARACTERISTIC_CHART.width;
}

export function currentToY(currentMA: number): number {
  const safeCurrent = clamp(
    currentMA,
    CHARACTERISTIC_CHART.minCurrentMA,
    CHARACTERISTIC_CHART.maxCurrentMA,
  );

  const ratio =
    (safeCurrent - CHARACTERISTIC_CHART.minCurrentMA) /
    (CHARACTERISTIC_CHART.maxCurrentMA - CHARACTERISTIC_CHART.minCurrentMA);

  return CHARACTERISTIC_CHART.zeroY - ratio * CHARACTERISTIC_CHART.height;
}

export function calculateForwardCurrentMA(voltage: number): number {
  if (voltage <= DIODE_MODEL.thresholdVoltage) return 0;

  const currentA =
    (voltage - DIODE_MODEL.thresholdVoltage) / DIODE_MODEL.seriesResistanceOhms;

  return clamp(currentA * 1000, 0, DIODE_MODEL.maxSafeCurrentMA);
}

export function calculateReverseCurrentMA(voltage: number): number {
  if (voltage >= 0) return 0;

  const reverseMagnitude = Math.abs(voltage);

  if (reverseMagnitude < 10) {
    return -DIODE_MODEL.reverseLeakageMA;
  }

  const breakdownProgress = clamp((reverseMagnitude - 10) / 2, 0, 1);
  return -clamp(
    DIODE_MODEL.reverseLeakageMA + breakdownProgress * 24,
    0,
    DIODE_MODEL.maxSafeCurrentMA,
  );
}

export function calculateDiodeCurrentMA(voltage: number): number {
  const safeVoltage = clamp(
    voltage,
    CHARACTERISTIC_CHART.minVoltage,
    CHARACTERISTIC_CHART.maxVoltage,
  );

  if (safeVoltage < 0) return calculateReverseCurrentMA(safeVoltage);
  return calculateForwardCurrentMA(safeVoltage);
}

export function getWorkingState(bias: BiasMode, voltage: number): WorkingState {
  const safeVoltage = clamp(voltage, 0, DIODE_MODEL.maxSupplyVoltage);
  const isConducting =
    bias === "forward" && safeVoltage > DIODE_MODEL.thresholdVoltage;

  const currentMA = isConducting ? calculateForwardCurrentMA(safeVoltage) : 0;

  return {
    threshold: DIODE_MODEL.thresholdVoltage,
    isConducting,
    intensity: clamp(currentMA / DIODE_MODEL.maxSafeCurrentMA, 0, 1),
    currentMA,
    region: isConducting
      ? "forward"
      : bias === "reverse"
        ? "reverse-blocked"
        : "below-threshold",
  };
}

export function getCharacteristicPoint(voltage: number): CharacteristicPoint {
  const safeVoltage = clamp(
    voltage,
    CHARACTERISTIC_CHART.minVoltage,
    CHARACTERISTIC_CHART.maxVoltage,
  );

  const currentMA = calculateDiodeCurrentMA(safeVoltage);
  const isConducting = safeVoltage > DIODE_MODEL.thresholdVoltage;

  return {
    x: voltageToX(safeVoltage),
    y: currentToY(currentMA),
    voltage: safeVoltage,
    currentMA,
    threshold: DIODE_MODEL.thresholdVoltage,
    isConducting,
    region: isConducting
      ? "forward"
      : safeVoltage < 0
        ? "reverse-blocked"
        : "below-threshold",
  };
}

export function buildCharacteristicCurvePath(): string {
  const points = Array.from({ length: 160 }, (_, index) => {
    const voltage =
      CHARACTERISTIC_CHART.minVoltage +
      (index / 159) *
        (CHARACTERISTIC_CHART.maxVoltage - CHARACTERISTIC_CHART.minVoltage);

    const currentMA = calculateDiodeCurrentMA(voltage);

    return {
      x: voltageToX(voltage),
      y: currentToY(currentMA),
    };
  });

  return points
    .map((point, index) =>
      index === 0
        ? `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
        : `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ");
}

export function runSimulationTests() {
  const tests = [
    { name: "Working section exists", pass: sections.includes("working") },
    {
      name: "Characteristics section exists",
      pass: sections.includes("characteristics"),
    },
    { name: "Forward mode exists", pass: biasModes.includes("forward") },
    { name: "Reverse mode exists", pass: biasModes.includes("reverse") },
    {
      name: "Forward conducts above 0.7V",
      pass: getWorkingState("forward", 5).isConducting === true,
    },
    {
      name: "Forward blocks below 0.7V",
      pass: getWorkingState("forward", 0.3).isConducting === false,
    },
    {
      name: "Reverse blocks at 12V",
      pass: getWorkingState("reverse", 12).isConducting === false,
    },
    {
      name: "Origin maps to center axis",
      pass:
        Math.abs(getCharacteristicPoint(0).x - voltageToX(0)) < 0.001 &&
        Math.abs(getCharacteristicPoint(0).y - currentToY(0)) < 0.001,
    },
    {
      name: "Forward current increases",
      pass:
        getCharacteristicPoint(12).currentMA >
        getCharacteristicPoint(1).currentMA,
    },
    {
      name: "Reverse current is negative",
      pass: getCharacteristicPoint(-12).currentMA < 0,
    },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
