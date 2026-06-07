export type CouplerType = "Phototransistor" | "Photodiode" | "PhotoTRIAC";

export type IsolationMode = "Low" | "Medium" | "High";

export type SimulationResult = {
  ledCurrent: number;
  outputCurrent: number;
  transferPercent: number;
  isolationVoltage: number;
  status: "ON" | "OFF";
};

export type SimulationInput = {
  enabled: boolean;
  inputVoltage: number;
  couplerType: CouplerType;
  isolation: IsolationMode;
};

export type SimulationTest = {
  name: string;
  input: SimulationInput;
  expectedStatus?: SimulationResult["status"];
  expectedIsolationVoltage?: number;
};
