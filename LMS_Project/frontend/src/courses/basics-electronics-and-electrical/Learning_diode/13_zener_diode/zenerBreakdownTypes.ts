export type ZenerLoadCondition = "light" | "medium" | "heavy";

export type ZenerBiasMode = "reverse" | "forward";

export type FlowMode = "conventional" | "electron";

export type ZenerPreset = {
  label: string;
  value: number;
};

export type ZenerBreakdownState = {
  inputVoltage: number;
  outputVoltage: number;
  zenerVoltageActual: number;
  diodeCurrentMA: number;
  loadCurrentMA: number;
  seriesCurrentMA: number;
  loadResistance: number;
  regulationStatus:
    | "Reverse Leakage"
    | "Reverse Breakdown"
    | "Forward Leakage"
    | "Forward Clamp";
  isBreakdown: boolean;
  isForwardConducting: boolean;
  active: boolean;
  reverseRegion: "pre-breakdown" | "breakdown";
  biasState: "Reverse Bias" | "Forward Bias";
  clampTargetVoltage: number;
  diodeDropVoltage: number;
};
