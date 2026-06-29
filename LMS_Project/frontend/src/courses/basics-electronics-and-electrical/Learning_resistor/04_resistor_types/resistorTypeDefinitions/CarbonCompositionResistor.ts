"use client";

import type { ResistorType } from "../types";

export const carbonCompositionResistor: ResistorType = {
  key: "carbon",
  category: "Fixed",
  name: "Carbon Composition Resistor",
  short: "Low-cost general-purpose fixed resistor.",
  valueLabel: "Fixed resistance",
  accuracy: 35,
  power: 45,
  cost: 90,
  response: 55,
  color: "#334155",
  bestFor: "General low-cost electronics",
  limitation: "Higher noise and lower precision.",
  application: "Basic LED circuit, school lab, simple PCB",
};
