"use client";

import type { ResistorType } from "../types";

export const potentiometerResistor: ResistorType = {
  key: "potentiometer",
  category: "Variable",
  name: "Potentiometer",
  short: "Variable resistor controlled by a knob or slider.",
  valueLabel: "Adjustable resistance",
  accuracy: 60,
  power: 50,
  cost: 60,
  response: 80,
  color: "#8b5cf6",
  bestFor: "Manual control",
  limitation: "Mechanical wear over time.",
  application: "Volume control, dimmer, calibration knob",
};
