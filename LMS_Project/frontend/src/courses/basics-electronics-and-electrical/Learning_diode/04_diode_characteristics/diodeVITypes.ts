export type DiodeBiasMode = "forward" | "reverse";
export type DiodeMode = "silicon" | "germanium" | "schottky";

export type DiodeVIState = {
  thresholdVoltage: number;
  voltage: number;
  currentMA: number;
  region: "forward" | "below-threshold" | "reverse-blocked";
  isConducting: boolean;
};
