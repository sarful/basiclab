import type { DiodeType } from "../types";

export const schottkyDiode: DiodeType = {
  id: "schottky-diode",
  name: "Schottky Diode",
  subtitle: "Low-drop fast-recovery diode",
  icon: "SD",
  category: "Fast Switching",
  packageStyle: "SMD power package or axial package",
  symbol: "A --|>|-- K (Schottky)",
  forwardBehavior: "Turns on with a lower forward voltage than a silicon PN diode.",
  reverseBehavior: "Blocks reverse current, but usually has more leakage than a standard diode.",
  keyFeature: "Low forward drop and fast switching.",
  typicalUse: "SMPS rectification, OR-ing, and efficiency-focused power paths.",
  applications: ["Switch-mode power supply", "Freewheel path", "Reverse polarity OR-ing"],
  comparisonFocus: "Used when efficiency and switching speed are more important than high reverse rating.",
  notes: "Its metal-semiconductor junction makes it faster than a conventional PN diode.",
  partNumber: "MBR1045",
  specifications: [
    { label: "Forward Voltage", value: "~0.2 V to 0.45 V" },
    { label: "Reverse Voltage", value: "Typically lower than PN diodes" },
    { label: "Forward Current", value: "10 A class" },
    { label: "Recovery", value: "Very fast" },
    { label: "Package", value: "Power Schottky / Axial" },
  ],
};
