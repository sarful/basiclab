"use client";

export type PmosCurrentFlowMode = "conventional" | "electron";

export type PmosHighSideControls = {
  batteryVoltage: number;
  rpuOhms: number;
  rLedOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: PmosCurrentFlowMode;
};

export type PmosHighSideState = {
  batteryVoltage: number;
  rpuOhms: number;
  rLedOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: PmosCurrentFlowMode;
  sourceVoltage: number;
  gateVoltage: number;
  drainVoltage: number;
  vgs: number;
  loadCurrentMa: number;
  gatePathActive: boolean;
  loadPathActive: boolean;
  isPmosOn: boolean;
  isLedOn: boolean;
  statusLabel: string;
  statusDescription: string;
};
