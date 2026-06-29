import type { DiodeType } from "../types";

export const tvsDiode: DiodeType = {
  id: "tvs-diode",
  name: "TVS Diode (Transient Voltage Suppressor)",
  subtitle: "Fast surge clamp diode",
  icon: "TVS",
  category: "Protection",
  packageStyle: "SMB, SMC, or transient clamp package",
  symbol: "TVS diode symbol",
  forwardBehavior: "Behaves like a diode in forward direction if used that way.",
  reverseBehavior: "Clamps transient overvoltage very quickly during surge events.",
  keyFeature: "High-speed transient suppression.",
  typicalUse: "ESD protection, surge suppression, and line protection.",
  applications: ["USB protection", "Power rail surge clamp", "Automotive transient suppression"],
  comparisonFocus: "Chosen for protection speed and surge energy handling, not steady regulation.",
  notes: "TVS devices are optimized for short, high-energy voltage spikes.",
};
