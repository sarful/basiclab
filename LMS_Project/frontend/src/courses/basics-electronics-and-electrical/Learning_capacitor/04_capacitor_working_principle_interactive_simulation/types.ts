export type WorkingMode = "charging" | "discharging";

export type WorkingPrincipleSnapshot = {
  capacitanceFarad: number;
  timeConstant: number;
  chargeRatio: number;
  capacitorVoltage: number;
  current: number;
  storedCharge: number;
  storedEnergy: number;
  maxTime: number;
};

export type CapacitorLessonFourSimulationProps = {
  embedded?: boolean;
};
