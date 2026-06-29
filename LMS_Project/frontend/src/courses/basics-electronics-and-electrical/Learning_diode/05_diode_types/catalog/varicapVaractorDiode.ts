import type { DiodeType } from "../types";

export const varicapVaractorDiode: DiodeType = {
  id: "varicap-varactor-diode",
  name: "Varicap / Varactor Diode",
  subtitle: "Voltage-controlled capacitance diode",
  icon: "VC",
  category: "Tuning",
  packageStyle: "RF diode package",
  symbol: "Varactor diode symbol",
  forwardBehavior: "Usually not used in forward bias for its main function.",
  reverseBehavior: "Junction capacitance changes with reverse voltage.",
  keyFeature: "Acts like a variable capacitor controlled by voltage.",
  typicalUse: "Tuning, VCOs, and RF filter adjustment.",
  applications: ["Radio tuning", "Voltage-controlled oscillator", "Frequency modulation"],
  comparisonFocus: "Chosen for variable capacitance, not current conduction.",
  notes: "The depletion region width controls capacitance as reverse voltage changes.",
};
