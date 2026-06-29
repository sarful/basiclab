import type { BiasMode } from "./types";

export const DIODE_CONSTANTS = {
  FORWARD_VOLTAGE_DROP: 0.7,
  DEFAULT_SUPPLY_VOLTAGE: 12,
  SERIES_RESISTANCE_OHMS: 470,
  MAX_SAFE_CURRENT_AMPS: 0.025,
  REVERSE_LEAKAGE_CURRENT_AMPS: 0.000001,
  REVERSE_BREAKDOWN_VOLTAGE: 50,
} as const;

export type LedState = {
  isConducting: boolean;
  currentLevel: number;
  threshold: number;
  forwardVoltageDrop: number;
  estimatedCurrent: number;
  estimatedCurrentMilliAmps: number;
  powerDissipation: number;
  powerDissipationMilliWatts: number;
  conductionPercentage: number;
  isSafeCurrent: boolean;
  reverseBlocked: boolean;
  explanation: string;
};

export type BiasResult = {
  isConducting: boolean;
  title: string;
  text: string;
};

export type BlockedState = {
  detail: string;
  title: string;
};

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function calculateForwardCurrent(voltage: number): number {
  const usableVoltage = Math.max(
    0,
    voltage - DIODE_CONSTANTS.FORWARD_VOLTAGE_DROP,
  );

  return usableVoltage / DIODE_CONSTANTS.SERIES_RESISTANCE_OHMS;
}

export function calculatePowerDissipation(current: number): number {
  return DIODE_CONSTANTS.FORWARD_VOLTAGE_DROP * current;
}

export function calculateConductionPercentage(current: number): number {
  return clamp((current / DIODE_CONSTANTS.MAX_SAFE_CURRENT_AMPS) * 100, 0, 100);
}

export function getLedState(bias: BiasMode, voltage: number): LedState {
  const safeVoltage = clamp(voltage, 0, DIODE_CONSTANTS.DEFAULT_SUPPLY_VOLTAGE);
  const threshold = DIODE_CONSTANTS.FORWARD_VOLTAGE_DROP;

  const isForward = bias === "forward";
  const isConducting = isForward && safeVoltage >= threshold;

  const estimatedCurrent = isConducting
    ? calculateForwardCurrent(safeVoltage)
    : bias === "reverse"
      ? DIODE_CONSTANTS.REVERSE_LEAKAGE_CURRENT_AMPS
      : 0;

  const powerDissipation = isConducting
    ? calculatePowerDissipation(estimatedCurrent)
    : 0;

  const conductionPercentage = isConducting
    ? calculateConductionPercentage(estimatedCurrent)
    : 0;

  return {
    isConducting,
    currentLevel: conductionPercentage / 100,
    threshold,
    forwardVoltageDrop: threshold,
    estimatedCurrent,
    estimatedCurrentMilliAmps: estimatedCurrent * 1000,
    powerDissipation,
    powerDissipationMilliWatts: powerDissipation * 1000,
    conductionPercentage,
    isSafeCurrent: estimatedCurrent <= DIODE_CONSTANTS.MAX_SAFE_CURRENT_AMPS,
    reverseBlocked: bias === "reverse",
    explanation: getEducationalExplanation(bias, safeVoltage, isConducting),
  };
}

export function getEducationalExplanation(
  bias: BiasMode,
  voltage: number,
  isConducting: boolean,
): string {
  if (bias === "reverse") {
    return "In reverse bias, the diode increases the barrier and blocks the main current path. Only tiny leakage current may remain.";
  }

  if (!isConducting) {
    return `The slider is at ${voltage.toFixed(
      1,
    )}V, which is still below the 0.7V forward threshold, so the diode has not turned on yet.`;
  }

  return `The slider is at ${voltage.toFixed(
    1,
  )}V, above the 0.7V forward threshold, so the diode conducts and the LED turns on.`;
}

export function getBiasResult(
  bias: BiasMode,
  voltage = DIODE_CONSTANTS.DEFAULT_SUPPLY_VOLTAGE,
): BiasResult {
  const led = getLedState(bias, voltage);

  if (bias === "forward") {
    return {
      isConducting: led.isConducting,
      title: led.isConducting ? "Forward Bias: LED ON" : "Below Forward Voltage",
      text: led.isConducting
        ? `At ${voltage.toFixed(
            1,
          )}V, the diode conducts about ${led.estimatedCurrentMilliAmps.toFixed(
            1,
          )}mA and dissipates about ${led.powerDissipationMilliWatts.toFixed(
            1,
          )}mW, so the LED is ON.`
        : `Forward bias is selected, but ${voltage.toFixed(
            1,
          )}V is still below the 0.7V turn-on threshold. The junction has not opened enough for normal current flow, so the LED stays OFF.`,
    };
  }

  return {
    isConducting: false,
    title: "Reverse Blocked",
    text: `At ${voltage.toFixed(
      1,
    )}V reverse bias, the diode blocks the main current path. Only tiny leakage current may exist, so the LED stays OFF.`,
  };
}

export function getBlockedState(
  bias: BiasMode,
  voltage: number,
): BlockedState | null {
  const led = getLedState(bias, voltage);

  if (led.isConducting) return null;

  if (bias === "reverse") {
    return {
      title: "REVERSE BLOCKED",
      detail:
        "Reverse bias widens the junction barrier, so the main current path stays closed.",
    };
  }

  return {
    title: "BELOW FORWARD VOLTAGE",
    detail: `The slider is at ${voltage.toFixed(
      1,
    )}V, still below the 0.7V turn-on threshold for forward conduction.`,
  };
}

export function formatCurrent(amps: number): string {
  if (amps >= 1) return `${amps.toFixed(2)} A`;
  if (amps >= 0.001) return `${(amps * 1000).toFixed(1)} mA`;
  return `${(amps * 1_000_000).toFixed(1)} uA`;
}

export function formatPower(watts: number): string {
  if (watts >= 1) return `${watts.toFixed(2)} W`;
  if (watts >= 0.001) return `${(watts * 1000).toFixed(1)} mW`;
  return `${(watts * 1_000_000).toFixed(1)} uW`;
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
    {
      name: "Reverse bias blocks",
      pass: getBiasResult("reverse", 12).isConducting === false,
    },
    {
      name: "Forward current is calculated from Ohm law",
      pass: getLedState("forward", 12).estimatedCurrent > 0,
    },
    {
      name: "Reverse current remains leakage only",
      pass:
        getLedState("reverse", 12).estimatedCurrent ===
        DIODE_CONSTANTS.REVERSE_LEAKAGE_CURRENT_AMPS,
    },
    {
      name: "Current level stays between 0 and 1",
      pass:
        getLedState("forward", 12).currentLevel >= 0 &&
        getLedState("forward", 12).currentLevel <= 1,
    },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
