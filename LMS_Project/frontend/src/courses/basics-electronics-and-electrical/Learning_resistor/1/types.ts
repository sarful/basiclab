"use client";

export type ViewMode = "assembled" | "exploded" | "cutaway" | "microscopic";
export type FlowMode = "electron" | "conventional";
export type MaterialKey = "carbon" | "metalFilm" | "wireWound";

export type Material = {
  key: MaterialKey;
  name: string;
  bn: string;
  layerLabel: string;
  color: string;
  resistanceFactor: number;
  heatFactor: number;
  tempCoefficient: number;
  description: string;
  use: string;
};

export type ResistorLessonOneSimulationProps = {
  embedded?: boolean;
};
