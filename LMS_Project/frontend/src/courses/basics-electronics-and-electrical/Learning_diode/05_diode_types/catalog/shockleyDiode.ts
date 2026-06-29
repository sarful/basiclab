import type { DiodeType } from "../types";

export const shockleyDiode: DiodeType = {
  id: "shockley-diode",
  name: "Shockley Diode",
  subtitle: "Four-layer switching diode",
  icon: "SH",
  category: "Trigger / Switching",
  packageStyle: "Trigger diode package",
  symbol: "Shockley diode symbol",
  forwardBehavior: "Remains off until breakover voltage is reached, then switches on.",
  reverseBehavior: "Blocks reverse voltage like a switching junction device.",
  keyFeature: "Breakover-trigger switching.",
  typicalUse: "Trigger circuits and relaxation oscillators.",
  applications: ["Pulse trigger", "Timing circuit", "Oscillator trigger"],
  comparisonFocus: "A switching device that bridges diode and thyristor-style behavior.",
  notes: "Shockley diodes are four-layer devices without a gate terminal.",
};
