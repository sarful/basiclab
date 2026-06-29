import type { DiodeType } from "../types";

export const laserDiode: DiodeType = {
  id: "laser-diode",
  name: "Laser Diode",
  subtitle: "Coherent light-emitting diode",
  icon: "LD",
  category: "Optoelectronics",
  packageStyle: "Can package, optical module, or fiber package",
  symbol: "Laser diode symbol",
  forwardBehavior: "Produces coherent light once threshold current is reached.",
  reverseBehavior: "Reverse bias is usually limited and not a normal operating mode.",
  keyFeature: "High-intensity coherent optical output.",
  typicalUse: "Fiber optics, barcode scanners, and optical modules.",
  applications: ["Optical transmitter", "Laser pointer", "Scanner head"],
  comparisonFocus: "Different from LED because it has threshold behavior and coherent output.",
  notes: "Laser diodes need controlled drive current to avoid damage.",
};
