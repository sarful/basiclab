"use client";

export type SolveMode = "current" | "voltage" | "resistance";
export type LedColor = "green" | "red" | "yellow";

export type LedOption = {
  color: LedColor;
  label: string;
  emoji: string;
  ledDrop: number;
  safeCurrentMa: number;
  fill: string;
  stroke: string;
  glow: string;
  buttonClass: string;
};

export type LedProblem = {
  color: LedColor;
  label: string;
  emoji: string;
  supplyVoltage: number;
  ledDrop: number;
  currentMa: number;
  safeCurrentMa: number;
  className: string;
};
