"use client";

export type CurrentFlowMode = "conventional" | "electron";

export type PnpWorkingControls = {
  batteryVoltage: number;
  rbOhms: number;
  rpuOhms: number;
  rLedOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: CurrentFlowMode;
};

export type PnpWorkingMode = "cutoff" | "active" | "saturated";

export type EquationLine = {
  label: string;
  expression: string;
  value: string;
  note?: string;
};

export type PnpWorkingState = {
  batteryVoltage: number;
  rbOhms: number;
  rpuOhms: number;
  rLedOhms: number;
  switchClosed: boolean;
  mode: PnpWorkingMode;
  emitterVoltage: number;
  baseVoltage: number;
  collectorVoltage: number;
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
  forcedBetaTarget: number;
  saturationBaseCurrentMa: number;
  collectorCurrentLimitMa: number;
  betaEstimate: number;
  saturationMargin: number;
  equations: EquationLine[];
};
