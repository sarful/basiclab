"use client";

import type { ResistorType } from "../types";

export const thermistorResistor: ResistorType = {
  key: "thermistor",
  category: "Sensor",
  name: "Thermistor",
  short: "Temperature-sensitive resistor.",
  valueLabel: "Resistance changes with temperature",
  accuracy: 70,
  power: 35,
  cost: 70,
  response: 88,
  color: "#ef4444",
  bestFor: "Temperature sensing",
  limitation: "Non-linear response.",
  application: "Battery protection, thermostats, fan control",
};
