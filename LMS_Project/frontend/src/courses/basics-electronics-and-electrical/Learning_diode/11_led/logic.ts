import type { LedState } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getLedState(
  voltage: number,
  forwardVoltage: number,
  hasResistor: boolean,
): LedState {
  const safeVoltageLimit = forwardVoltage + 2.5;
  const dangerVoltageLimit = forwardVoltage + 5.0;
  const isOn = voltage >= forwardVoltage;
  const isOverVoltage = isOn && voltage > safeVoltageLimit;
  const isDangerVoltage = isOn && voltage > dangerVoltageLimit;
  const isDamaged = isDangerVoltage && !hasResistor;
  const intensity = isOn ? clamp((voltage - forwardVoltage) / 3.5, 0.15, 1) : 0;
  const rawCurrentMA = isOn ? (voltage - forwardVoltage) * 7.5 : 0;
  const currentMA = hasResistor
    ? clamp(rawCurrentMA, 0, 25)
    : clamp(rawCurrentMA * 1.8, 0, 80);

  let status = "LED OFF";
  if (isDamaged) status = "DANGER: LED DAMAGE RISK";
  else if (isOverVoltage) status = "WARNING: OVERVOLTAGE";
  else if (isOn) status = "LED ON";

  return {
    isOn,
    isOverVoltage,
    isDangerVoltage,
    isDamaged,
    hasResistor,
    intensity,
    currentMA,
    safeVoltageLimit,
    dangerVoltageLimit,
    status,
    lightLevel: `${Math.round(intensity * 100)}%`,
  };
}

export function runSimulationTests() {
  const tests = [
    { name: "LED is off below forward voltage", pass: getLedState(1.2, 2.0, true).isOn === false },
    { name: "LED is on above forward voltage", pass: getLedState(3.0, 2.0, true).isOn === true },
    { name: "Current is zero when LED is off", pass: getLedState(1.0, 2.0, true).currentMA === 0 },
    { name: "Current increases when LED is on", pass: getLedState(3.0, 2.0, true).currentMA > 0 },
    { name: "Intensity is clamped to maximum 1", pass: getLedState(12, 2.0, true).intensity <= 1 },
    { name: "Light level returns percent string", pass: getLedState(3.0, 2.0, true).lightLevel.includes("%") },
    { name: "Overvoltage warning appears above safe limit", pass: getLedState(5.0, 2.0, true).isOverVoltage === true },
    { name: "Danger voltage without resistor creates damage risk", pass: getLedState(8.0, 2.0, false).isDamaged === true },
    { name: "Current limiting resistor reduces current", pass: getLedState(8.0, 2.0, true).currentMA < getLedState(8.0, 2.0, false).currentMA },
    { name: "Resistor prevents damage flag at danger voltage", pass: getLedState(8.0, 2.0, true).isDamaged === false },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
