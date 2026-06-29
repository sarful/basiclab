import type { DiodeType } from "../types";

export const zenerDiode: DiodeType = {
  id: "zener-diode",
  name: "Zener Diode",
  subtitle: "Reverse-voltage regulation diode",
  icon: "ZD",
  category: "Regulation",
  packageStyle: "Axial glass or molded package",
  symbol: "A --|<|-- K",
  forwardBehavior: "Works like a normal diode in forward bias.",
  reverseBehavior: "Conducts in a controlled way once reverse voltage reaches the zener value.",
  keyFeature: "Stable reference and regulation in reverse breakdown.",
  typicalUse: "Voltage reference, clamping, and small regulator stages.",
  applications: ["Reference source", "Overvoltage clamp", "Shunt regulation"],
  comparisonFocus: "Chosen when reverse-voltage control matters more than rectification.",
  notes: "The reverse breakdown region is the intended operating region for a zener diode.",
  partNumber: "1N4733A",
  specifications: [
    { label: "Zener Voltage", value: "5.1 V" },
    { label: "Power Rating", value: "1 W" },
    { label: "Test Current", value: "49 mA" },
    { label: "Reverse Operation", value: "Controlled breakdown" },
    { label: "Package", value: "Axial DO-41" },
  ],
};
