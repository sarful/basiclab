import type { SimulationInput, SimulationResult, SimulationTest, SwitchType } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function calculateLedSwitch({
  switchType,
  pressed,
  supplyVoltage,
  resistorOhm,
}: SimulationInput): SimulationResult {
  const ledForwardVoltage = 2;
  const circuitClosed = switchType === "NO" ? pressed : !pressed;
  const currentMa = circuitClosed
    ? clamp(((supplyVoltage - ledForwardVoltage) / resistorOhm) * 1000, 0, 40)
    : 0;
  const ledOn = currentMa > 1;
  const logicText =
    switchType === "NO"
      ? pressed
        ? "The NO pushbutton closes when pressed, so the LED turns ON."
        : "The NO pushbutton stays open normally, so the LED remains OFF until pressed."
      : pressed
        ? "The NC pushbutton opens when pressed, so the LED turns OFF."
        : "The NC pushbutton stays closed normally, so the LED stays ON until pressed.";

  return { circuitClosed, ledOn, currentMa, logicText };
}

export const simulationTests: SimulationTest[] = [
  {
    name: "NO switch is OFF when not pressed",
    input: {
      switchType: "NO" as SwitchType,
      pressed: false,
      supplyVoltage: 5,
      resistorOhm: 330,
    },
    expectedLedOn: false,
  },
  {
    name: "NO switch is ON when pressed",
    input: {
      switchType: "NO" as SwitchType,
      pressed: true,
      supplyVoltage: 5,
      resistorOhm: 330,
    },
    expectedLedOn: true,
  },
  {
    name: "NC switch is ON when not pressed",
    input: {
      switchType: "NC" as SwitchType,
      pressed: false,
      supplyVoltage: 5,
      resistorOhm: 330,
    },
    expectedLedOn: true,
  },
  {
    name: "NC switch is OFF when pressed",
    input: {
      switchType: "NC" as SwitchType,
      pressed: true,
      supplyVoltage: 5,
      resistorOhm: 330,
    },
    expectedLedOn: false,
  },
  {
    name: "Low supply below LED forward voltage stays OFF",
    input: {
      switchType: "NO" as SwitchType,
      pressed: true,
      supplyVoltage: 1.5,
      resistorOhm: 330,
    },
    expectedLedOn: false,
  },
];

export function runSimulationTests() {
  return simulationTests.every(
    (test) => calculateLedSwitch(test.input).ledOn === test.expectedLedOn,
  );
}
