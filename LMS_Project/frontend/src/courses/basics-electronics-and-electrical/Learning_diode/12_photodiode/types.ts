export type FlowMode = "conventional" | "electron";

export type PhotodiodeState = {
  lux: number;
  reverseVoltage: number;
  loadKOhm: number;
  responsivityAW: number;
  activeAreaMM2: number;
  hasLight: boolean;
  isActive: boolean;
  isReverseBias: boolean;
  normalizedLight: number;
  irradianceWM2: number;
  opticalPowerUW: number;
  darkCurrentUA: number;
  photocurrentUA: number;
  totalCurrentUA: number;
  loadCurrentUA: number;
  outputVoltage: number;
  photodiodeVoltage: number;
  forwardDropVoltage: number;
  saturationCurrentUA: number;
  lightLabel: string;
  status: string;
  conductionLabel: string;
  biasDescription: string;
  outputLevel: string;
};
