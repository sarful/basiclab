import type { DiodeType } from "../types";

export const tunnelDiode: DiodeType = {
  id: "tunnel-diode",
  name: "Tunnel Diode",
  subtitle: "Negative-resistance tunneling diode",
  icon: "TD",
  category: "High Frequency",
  packageStyle: "Small RF package",
  symbol: "Tunnel diode symbol",
  forwardBehavior: "Has a region where current decreases as voltage increases.",
  reverseBehavior: "Blocks or leaks depending on structure, but main interest is forward negative resistance.",
  keyFeature: "Negative resistance region.",
  typicalUse: "Oscillators, fast switching, and microwave circuits.",
  applications: ["Oscillator", "Microwave amplifier", "Fast pulse circuit"],
  comparisonFocus: "Used for negative-resistance behavior, not ordinary rectification.",
  notes: "Heavy doping causes tunneling effects and unusual I-V behavior.",
  partNumber: "1N3716",
  specifications: [
    { label: "Peak Current", value: "Device-dependent" },
    { label: "Valley Current", value: "Device-dependent" },
    { label: "Negative Resistance", value: "Yes" },
    { label: "Speed", value: "Very fast" },
    { label: "Package", value: "Small RF / microwave" },
  ],
};
