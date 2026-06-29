export type CenterTapTransformerPreset =
  | "balanced-step-down"
  | "balanced-isolation"
  | "step-up-center-tap";

export type CenterTapTransformerFlowMode = "conventional" | "electron";

export type CenterTapTransformerState = {
  inputVoltage: number;
  primaryTurns: number;
  upperSecondaryTurns: number;
  lowerSecondaryTurns: number;
  frequency: number;
  flowMode: CenterTapTransformerFlowMode;
  showDebugDots: boolean;
};

export type CenterTapTransformerStepState = {
  id: 1 | 2 | 3;
  title: string;
  detail: string;
  active: boolean;
};

export type CenterTapTransformerSnapshot = {
  inputVoltage: number;
  frequency: number;
  upperVoltage: number;
  lowerVoltage: number;
  endToEndVoltage: number;
  turnsRatioHalf: number;
  turnsRatioFull: number;
  fluxLevel: number;
  efficiency: number;
  transformerMode: "STEP-UP" | "STEP-DOWN" | "ISOLATION";
  liveCondition: "ACTIVE" | "UNBALANCED TAP" | "LOW FLUX";
  centerTapBalanced: boolean;
  centerTapOffsetPercent: number;
  energyDirectionLabel: string;
  statusBadges: string[];
  liveIndicators: {
    inputActive: boolean;
    fluxActive: boolean;
    centerTapReady: boolean;
    outputAvailable: boolean;
  };
  stepStates: CenterTapTransformerStepState[];
};
