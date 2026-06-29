"use client";

import type { ResistorType } from "../types";

export const metalFilmResistor: ResistorType = {
  key: "metalFilm",
  category: "Fixed",
  name: "Metal Film Resistor",
  short: "Precise and stable fixed resistor.",
  valueLabel: "High-precision fixed value",
  accuracy: 92,
  power: 55,
  cost: 65,
  response: 75,
  color: "#2563eb",
  bestFor: "Precision signal circuits",
  limitation: "Not ideal for heavy power dissipation.",
  application: "Sensors, amplifiers, measuring circuits",
};
