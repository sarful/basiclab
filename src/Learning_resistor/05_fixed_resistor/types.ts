"use client";

export type FixedTypeKey = "carbon" | "metalFilm" | "wireWound";

export type FixedType = {
  key: FixedTypeKey;
  name: string;
  bn: string;
  bodyColor: string;
  layerColor: string;
  description: string;
  whatIs: string;
  toleranceOptions: number[];
  powerOptions: number[];
  accuracy: number;
  noise: number;
  heatHandling: number;
  application: string;
  limitation: string;
};
