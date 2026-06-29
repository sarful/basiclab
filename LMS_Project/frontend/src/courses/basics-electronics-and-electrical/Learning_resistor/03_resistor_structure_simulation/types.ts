"use client";

export type StructureMode = "assembled" | "cutaway" | "exploded";
export type MaterialKey = "carbon" | "metal-film" | "wire-wound";

export type MaterialSpec = {
  key: MaterialKey;
  label: string;
  shellColor: string;
  coreColor: string;
  resistanceFactor: number;
  heatFactor: number;
  note: string;
};

export type ResistorLessonThreeSimulationProps = {
  embedded?: boolean;
};
