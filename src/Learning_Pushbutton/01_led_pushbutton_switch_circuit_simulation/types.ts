export type SwitchType = "NO" | "NC";

export type SimulationResult = {
  circuitClosed: boolean;
  ledOn: boolean;
  currentMa: number;
  logicText: string;
};

export type SimulationInput = {
  switchType: SwitchType;
  pressed: boolean;
  supplyVoltage: number;
  resistorOhm: number;
};

export type SimulationTest = {
  name: string;
  input: SimulationInput;
  expectedLedOn: boolean;
};
