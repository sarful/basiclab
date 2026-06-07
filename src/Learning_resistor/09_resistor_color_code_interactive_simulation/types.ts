"use client";

export type BandMode = 4 | 5 | 6;

export type DigitColor = {
  name: string;
  value: number;
  hex: string;
};

export type MultiplierColor = {
  name: string;
  multiplier: number;
  hex: string;
};

export type ToleranceColor = {
  name: string;
  tolerance: number;
  hex: string;
};

export type TempColor = {
  name: string;
  ppm: number;
  hex: string;
};
