"use client";

export type RelayCurrentFlowMode = "conventional" | "electron";

export type RelayDriverControls = {
  dcVoltage: number;
  acVoltage: number;
  baseResistorOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: RelayCurrentFlowMode;
};

export type RelayDriverState = {
  dcVoltage: number;
  acVoltage: number;
  baseResistorOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: RelayCurrentFlowMode;
  baseCurrentMa: number;
  coilCurrentMa: number;
  transistorOn: boolean;
  relayEnergized: boolean;
  contactClosedToNo: boolean;
  lampOn: boolean;
  statusLabel: string;
  statusDescription: string;
  relayContactLabel: string;
  coilPathActive: boolean;
  loadPathActive: boolean;
};
