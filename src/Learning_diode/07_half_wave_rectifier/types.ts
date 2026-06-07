export type DiodeType = "standard" | "fast" | "schottky";
export type StressLevel = "normal" | "high" | "surge";

export type DiodeProfile = {
  label: string;
  drop: number;
  recoveryDeg: number;
  leakageMA: number;
  maxCurrentA: number;
  thermalResistance: number;
};

export type WavePoint = {
  t: number;
  phase: number;
  vin: number;
  idealVout: number;
  vout: number;
  current: number;
  conducting: boolean;
  reverseRecovery: boolean;
  leakage: boolean;
  stress: StressLevel;
  ledOn: boolean;
  ledBlown: boolean;
  ledIntensity: number;
};
