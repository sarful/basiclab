"use client";

export type CurrentFlowMode = "conventional" | "electron";

export type FaultMode =
  | "none"
  | "rb_open"
  | "rpd_open"
  | "led_reverse"
  | "low_supply"
  | "collector_open";

export type PresetMode =
  | "manual"
  | "safe_off"
  | "switch_on"
  | "weak_base"
  | "fault_check";

export type NpnWorkingControls = {
  batteryVoltage: number;
  rbOhms: number;
  rpdOhms: number;
  rLedOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: CurrentFlowMode;
  faultMode: FaultMode;
  presetMode: PresetMode;
};

export type NpnWorkingMode = "cutoff" | "active" | "saturated";

export type EquationLine = {
  label: string;
  expression: string;
  value: string;
  note?: string;
};

export type LearningTaskResult = {
  id: string;
  title: string;
  target: string;
  passed: boolean;
  feedback: string;
};

export type NpnWorkingState = {
  batteryVoltage: number;
  rbOhms: number;
  rpdOhms: number;
  rLedOhms: number;
  switchClosed: boolean;
  mode: NpnWorkingMode;
  baseVoltage: number;
  collectorVoltage: number;
  emitterVoltage: number;
  baseCurrentMa: number;
  collectorCurrentMa: number;
  ledCurrentMa: number;
  ledBrightness: number;
  basePathActive: boolean;
  loadPathActive: boolean;
  isLedOn: boolean;
  statusLabel: string;
  statusDescription: string;
  flowMode: CurrentFlowMode;
  faultMode: FaultMode;
  presetMode: PresetMode;
  forcedBetaTarget: number;
  saturationBaseCurrentMa: number;
  collectorCurrentLimitMa: number;
  betaEstimate: number;
  saturationMargin: number;
  equations: EquationLine[];
  learningTasks: LearningTaskResult[];
};
