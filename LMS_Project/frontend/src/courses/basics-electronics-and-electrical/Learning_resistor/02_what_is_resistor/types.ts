export type ResistorPackage = {
  watt: number;
  label: string;
  bodyWidth: number;
  bodyHeight: number;
};

export type LedOption = {
  id: string;
  label: string;
  color: string;
  glow: string;
  forwardVoltage: number;
};

export type ResistorLessonMode = "basic" | "led";

export type CurrentLevel = "low" | "medium" | "high";

export type ResistanceLevel = "low" | "medium" | "high";

export type HeatLevel = "safe" | "warm" | "hot" | "overload";

export type HeatStatus = {
  label: string;
  tone: string;
  bg: string;
  message: string;
};

export type FlowState = {
  flowSpeed: number;
  flowDensity: number;
  wireGlow: number;
  particleCount: number;
  currentLimitingPercent: number;
};

export type EnergyConversionState = {
  electricalEnergy: number;
  heatEnergy: number;
  powerUsagePercent: number;
  heatIntensity: number;
};

export type MeasurementState = {
  voltage: number;
  resistance: number;
  current: number;
  power: number;
  voltageDrop: number;
  ledVoltageDrop: number;
  outputVoltage: number;
};

export type DisplayState = {
  voltageText: string;
  resistanceText: string;
  currentText: string;
  powerText: string;
  voltageDropText: string;
  ledVoltageDropText: string;
  outputVoltageText: string;
};

export type WhatIsResistorSimulationSetters = {
  setVoltage: (value: number) => void;
  setResistance: (value: number) => void;
  setRating: (value: number) => void;
  setLedId: (value: string) => void;
  setMode: (value: ResistorLessonMode) => void;
};

export type WhatIsResistorSimulationState = {
  mode: ResistorLessonMode;
  voltage: number;
  resistance: number;
  rating: number;
  ledId: string;
  selectedLed: LedOption;
  selectedPackage: ResistorPackage;
  current: number;
  power: number;
  outputVoltage: number;
  voltageDrop: number;
  ledVoltageDrop: number;
  brightnessLevel: number;
  status: HeatStatus;
  recommendedPackage: ResistorPackage;

  currentLevel: CurrentLevel;
  resistanceLevel: ResistanceLevel;
  heatLevel: HeatLevel;

  flowSpeed: number;
  flowDensity: number;
  heatIntensity: number;
  currentLimitingPercent: number;
  powerUsagePercent: number;

  flowState: FlowState;
  energyState: EnergyConversionState;
  measurementState: MeasurementState;
  displayState: DisplayState;
} & WhatIsResistorSimulationSetters;

export type ResistorLessonTwoProps = {
  panelOnly?: boolean;
  visualOnly?: boolean;
  simulation?: WhatIsResistorSimulationState;
};
