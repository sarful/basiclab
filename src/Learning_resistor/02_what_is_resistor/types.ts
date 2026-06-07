"use client";

export type DigitColor = { name: string; value: number; hex: string };
export type MultiplierColor = { name: string; multiplier: number; hex: string };
export type ToleranceColor = { name: string; tolerance: string; hex: string };
export type TempCoeff = { name: string; ppm: string; hex: string };
export type Preset = {
  label: string;
  mode: 4 | 5 | 6;
  b1: string;
  b2: string;
  b3?: string;
  mult: string;
  tol: string;
  tc?: string;
};

export type ResistorLessonTwoProps = {
  panelOnly?: boolean;
  visualOnly?: boolean;
};
