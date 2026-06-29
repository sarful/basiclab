export type TransformerWorkingPrinciplePreset =
  | "step-down"
  | "step-up"
  | "isolation";

export type TransformerWorkingPrincipleFlowMode =
  | "conventional"
  | "electron";

export type TransformerWorkingPrincipleState = {
  inputVoltage: number;
  primaryTurns: number;
  secondaryTurns: number;
  frequency: number;
  flowMode: TransformerWorkingPrincipleFlowMode;
  showDebugDots: boolean;
};

export type TransformerWorkingPrincipleStepState = {
  id: 1 | 2 | 3;
  title: string;
  detail: string;
  active: boolean;
};

export type TransformerWorkingPrincipleSnapshot = {
  inputVoltage: number;
  frequency: number;
  turnsRatio: number;
  outputVoltage: number;
  fluxLevel: number;
  efficiency: number;
  transformerMode: "STEP-UP" | "STEP-DOWN" | "ISOLATION";
  liveCondition: "ACTIVE" | "LOW FLUX";
  isolationStatus: "Isolated Magnetic Coupling" | "Balanced Isolation Transfer";
  energyDirectionLabel: string;
  fluxIndicatorLabel: string;
  statusBadges: string[];
  liveIndicators: {
    inputActive: boolean;
    fluxActive: boolean;
    secondaryInduced: boolean;
    isolationConfirmed: boolean;
  };
  stepStates: TransformerWorkingPrincipleStepState[];
};
