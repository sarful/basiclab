"use client";

export type ResistorTypeKey =
  | "carbon"
  | "metalFilm"
  | "wireWound"
  | "potentiometer"
  | "thermistor"
  | "ldr";

export type Category = "All" | "Fixed" | "Variable" | "Sensor";

export type ResistorType = {
  key: ResistorTypeKey;
  category: Exclude<Category, "All">;
  name: string;
  short: string;
  valueLabel: string;
  accuracy: number;
  power: number;
  cost: number;
  response: number;
  color: string;
  bestFor: string;
  limitation: string;
  application: string;
};
