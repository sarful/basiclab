import type { DiodeType } from "../types";

export const thermalDiode: DiodeType = {
  id: "thermal-diode",
  name: "Thermal Diode",
  subtitle: "Temperature-sensing diode junction",
  icon: "TH",
  category: "Sensing",
  packageStyle: "Integrated on-chip or compact sensor package",
  symbol: "Thermal diode symbol",
  forwardBehavior: "Forward voltage changes predictably with temperature.",
  reverseBehavior: "Reverse mode is not the usual measurement method.",
  keyFeature: "Temperature-dependent forward voltage.",
  typicalUse: "Temperature monitoring and thermal compensation.",
  applications: ["CPU temperature monitor", "Bias compensation", "Thermal feedback"],
  comparisonFocus: "Used as a junction-temperature sensor instead of a power or signal diode.",
  notes: "The diode equation makes forward voltage a practical temperature indicator.",
};
