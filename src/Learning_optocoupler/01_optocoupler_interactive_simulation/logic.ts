import type {
  CouplerType,
  IsolationMode,
  SimulationInput,
  SimulationResult,
  SimulationTest,
} from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function calculateSimulation({
  enabled,
  inputVoltage,
  couplerType,
  isolation,
}: SimulationInput): SimulationResult {
  const ledForwardVoltage = 1.2;
  const fixedInputResistance = 330;
  const fixedCtr = 80;
  const ledCurrent = enabled
    ? clamp(
        ((inputVoltage - ledForwardVoltage) / fixedInputResistance) * 1000,
        0,
        30,
      )
    : 0;
  const typeFactor =
    couplerType === "Phototransistor"
      ? 1
      : couplerType === "Photodiode"
        ? 0.28
        : 0.72;
  const outputCurrent = clamp(
    (ledCurrent * fixedCtr * typeFactor) / 100,
    0,
    50,
  );
  const transferPercent =
    ledCurrent > 0
      ? clamp((outputCurrent / ledCurrent) * 100, 0, 200)
      : 0;
  const isolationVoltage =
    isolation === "High" ? 5000 : isolation === "Medium" ? 2500 : 1000;
  const status = ledCurrent > 1 ? "ON" : "OFF";

  return {
    ledCurrent,
    outputCurrent,
    transferPercent,
    isolationVoltage,
    status,
  };
}

export const simulationTests: SimulationTest[] = [
  {
    name: "disabled input keeps optocoupler OFF",
    input: {
      enabled: false,
      inputVoltage: 5,
      couplerType: "Phototransistor" as CouplerType,
      isolation: "Medium" as IsolationMode,
    },
    expectedStatus: "OFF",
  },
  {
    name: "5V enabled phototransistor turns ON",
    input: {
      enabled: true,
      inputVoltage: 5,
      couplerType: "Phototransistor" as CouplerType,
      isolation: "Medium" as IsolationMode,
    },
    expectedStatus: "ON",
  },
  {
    name: "high isolation maps to 5000V",
    input: {
      enabled: true,
      inputVoltage: 5,
      couplerType: "PhotoTRIAC" as CouplerType,
      isolation: "High" as IsolationMode,
    },
    expectedIsolationVoltage: 5000,
  },
  {
    name: "low input below LED forward voltage stays OFF",
    input: {
      enabled: true,
      inputVoltage: 1,
      couplerType: "Photodiode" as CouplerType,
      isolation: "Low" as IsolationMode,
    },
    expectedStatus: "OFF",
  },
];

export function runSimulationSelfTests() {
  return simulationTests.every((test) => {
    const result = calculateSimulation(test.input);
    const statusOk =
      !test.expectedStatus || result.status === test.expectedStatus;
    const isolationOk =
      !test.expectedIsolationVoltage ||
      result.isolationVoltage === test.expectedIsolationVoltage;
    return statusOk && isolationOk;
  });
}
