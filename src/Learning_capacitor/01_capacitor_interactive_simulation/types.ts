export type CircuitMode = "charge" | "discharge";

export type CapacitorSnapshot = {
  capacitanceFarad: number;
  timeConstant: number;
  chargeLevel: number;
  capacitorVoltage: number;
  storedCharge: number;
  storedEnergy: number;
  current: number;
  maxTime: number;
};
