import type { DiodeType } from "../types";

export const genericDiode: DiodeType = {
  id: "generic-diode",
  name: "Generic Diode",
  subtitle: "Basic one-way PN junction diode",
  icon: "GD",
  category: "Fundamental",
  packageStyle: "Axial or small signal glass package",
  symbol: "A --|>|-- K",
  forwardBehavior: "Conducts when the anode is positive enough relative to the cathode.",
  reverseBehavior: "Blocks reverse current except for a very small leakage current.",
  keyFeature: "Simple one-way current control.",
  typicalUse: "General rectification, polarity protection, and basic switching.",
  applications: ["Introductory diode circuits", "Reverse polarity guard", "Basic AC rectification"],
  comparisonFocus: "Reference diode for understanding all other diode families.",
  notes: "This is the baseline teaching diode before exploring specialized variants.",
  partNumber: "1N4007",
  specifications: [
    { label: "Forward Voltage", value: "~0.7 V" },
    { label: "Average Forward Current", value: "1 A" },
    { label: "Peak Repetitive Reverse Voltage", value: "1000 V" },
    { label: "Reverse Recovery", value: "~30 us class" },
    { label: "Package", value: "Axial DO-41" },
  ],
};
