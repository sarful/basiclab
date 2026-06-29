"use client";

import type { ResistorType } from "../types";

export const wireWoundResistor: ResistorType = {
  key: "wireWound",
  category: "Fixed",
  name: "Wire Wound Resistor",
  short: "High-power resistor made with wound resistance wire.",
  valueLabel: "Fixed high-power value",
  accuracy: 80,
  power: 95,
  cost: 45,
  response: 45,
  color: "#f97316",
  bestFor: "High-power and heat-load circuits",
  limitation: "Larger size and possible inductive effect.",
  application: "Power supplies, heater loads, braking circuits",
};
