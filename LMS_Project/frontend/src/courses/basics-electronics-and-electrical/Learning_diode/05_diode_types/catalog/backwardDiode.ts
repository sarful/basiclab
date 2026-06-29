import type { DiodeType } from "../types";

export const backwardDiode: DiodeType = {
  id: "backward-diode",
  name: "Backward Diode",
  subtitle: "Low-voltage reverse-conduction tunnel diode",
  icon: "BD",
  category: "Microwave / Detector",
  packageStyle: "Specialized RF or microwave package",
  symbol: "Backward diode symbol",
  forwardBehavior: "Shows very limited forward conduction at small voltage.",
  reverseBehavior: "Conducts strongly at very small reverse voltage because of tunneling.",
  keyFeature: "Reverse tunneling conduction at low voltage.",
  typicalUse: "Small-signal detector and microwave circuits.",
  applications: ["RF detector", "Microwave mixer", "Low-level rectification"],
  comparisonFocus: "Different from normal diodes because reverse conduction can appear first.",
  notes: "It is a specialized tunnel-junction device, not a general rectifier.",
  partNumber: "Tunnel detector family",
  specifications: [
    { label: "Reverse Turn-On", value: "~0.1 V to 0.3 V" },
    { label: "Forward Behavior", value: "Limited" },
    { label: "Response", value: "Very fast" },
    { label: "Operating Region", value: "Reverse tunneling" },
    { label: "Package", value: "Specialized RF / detector" },
  ],
};
