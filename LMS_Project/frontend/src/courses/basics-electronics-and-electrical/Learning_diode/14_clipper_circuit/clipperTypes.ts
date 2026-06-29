export type ClipperMode = "positive" | "negative" | "both";

export type FlowMode = "conventional" | "electron";

export type ClipperWavePoint = {
  conducting: boolean;
  negativeClipped: boolean;
  positiveClipped: boolean;
  t: number;
  vin: number;
  voutNegative: number;
  voutPositive: number;
};

export type ClipperState = {
  activeHalfCycleLabel: string;
  biasStateLabel: string;
  clipLevel: number;
  clipThresholdMagnitude: number;
  clippedPeak: number;
  conductionState: string;
  currentDirectionLabel: string;
  diodeDrop: number;
  focusLabel: string;
  inputPeakToPeak: number;
  inputRmsVoltage: number;
  inputAmplitude: number;
  inputTypeLabel: string;
  loadCurrentMilliAmps: number;
  mode: ClipperMode;
  negativeClipThreshold: number;
  negativeConductionCurrentMilliAmps: number;
  negativeConductionState: string;
  negativeEquation: string;
  negativeOutputMinimum: number;
  positiveClipThreshold: number;
  positiveConductionCurrentMilliAmps: number;
  positiveConductionState: string;
  positiveEquation: string;
  positiveOutputMaximum: number;
  outputTypeLabel: string;
  resistorValue: number;
  summaryLine: string;
  switchingPreviewLabel: string;
  timeCursor: number;
  timeCursorPoint: ClipperWavePoint;
  waveform: ClipperWavePoint[];
};
