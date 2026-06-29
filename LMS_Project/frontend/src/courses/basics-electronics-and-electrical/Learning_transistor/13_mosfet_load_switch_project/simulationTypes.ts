"use client";

export type NmosCurrentFlowMode = "conventional" | "electron";

export type NmosLowSideControls = {
  batteryVoltage: number;
  rpdOhms: number;
  rLedOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: NmosCurrentFlowMode;
};

export type NmosLowSideState = {
  batteryVoltage: number;
  rpdOhms: number;
  rLedOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: NmosCurrentFlowMode;
  sourceVoltage: number;
  gateVoltage: number;
  drainVoltage: number;
  vgs: number;
  loadCurrentMa: number;
  gatePathActive: boolean;
  loadPathActive: boolean;
  isNmosOn: boolean;
  isLedOn: boolean;
  statusLabel: string;
  statusDescription: string;
};
