"use client";

import type { Material } from "./types";

export const materials: Material[] = [
  {
    key: "carbon",
    name: "Carbon Composition",
    bn: "à¦•à¦¾à¦°à§à¦¬à¦¨",
    layerLabel: "Carbon resistive core",
    color: "#334155",
    resistanceFactor: 1.2,
    heatFactor: 0.75,
    tempCoefficient: 0.0015,
    description:
      "Carbon material current flow-à¦•à§‡ à¦¬à¦¾à¦§à¦¾ à¦¦à§‡à¦¯à¦¼ à¦à¦¬à¦‚ resistance à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡à¥¤",
    use: "Low-cost general circuit",
  },
  {
    key: "metalFilm",
    name: "Metal Film",
    bn: "à¦®à§‡à¦Ÿà¦¾à¦² à¦«à¦¿à¦²à§à¦®",
    layerLabel: "Thin metal film layer with spiral trim",
    color: "#2563eb",
    resistanceFactor: 0.85,
    heatFactor: 0.45,
    tempCoefficient: 0.00045,
    description:
      "Ceramic core-à¦à¦° à¦‰à¦ªà¦° thin metal film layer à¦¦à¦¿à¦¯à¦¼à§‡ precise resistance à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¥¤",
    use: "Precision electronics",
  },
  {
    key: "wireWound",
    name: "Wire Wound",
    bn: "à¦“à¦¯à¦¼à§à¦¯à¦¾à¦° à¦“à¦¯à¦¼à¦¾à¦‰à¦¨à§à¦¡",
    layerLabel: "Wound resistance wire",
    color: "#f97316",
    resistanceFactor: 0.95,
    heatFactor: 0.9,
    tempCoefficient: 0.0009,
    description:
      "Resistance wire ceramic core-à¦à¦° à¦‰à¦ªà¦° coil à¦†à¦•à¦¾à¦°à§‡ wound à¦•à¦°à¦¾ à¦¥à¦¾à¦•à§‡à¥¤",
    use: "High-power circuit",
  },
];
