"use client";

import type { ResistorType } from "../types";

export const lightDependentResistor: ResistorType = {
  key: "ldr",
  category: "Sensor",
  name: "Light Dependent Resistor",
  short: "Light-sensitive resistor.",
  valueLabel: "Resistance changes with light",
  accuracy: 50,
  power: 25,
  cost: 80,
  response: 45,
  color: "#eab308",
  bestFor: "Light detection",
  limitation: "Slower response and lower precision.",
  application: "Automatic lights, light sensor modules",
};
