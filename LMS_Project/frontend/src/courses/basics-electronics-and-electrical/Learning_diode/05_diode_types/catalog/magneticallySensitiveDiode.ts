import type { DiodeType } from "../types";

export const magneticallySensitiveDiode: DiodeType = {
  id: "magnetically-sensitive-diode",
  name: "Magnetically Sensitive Diode",
  subtitle: "Magnetic-field-responsive semiconductor diode",
  icon: "MD",
  category: "Sensing",
  packageStyle: "Specialized sensor package",
  symbol: "Magnetically sensitive diode symbol",
  forwardBehavior: "Electrical behavior changes slightly with magnetic field influence.",
  reverseBehavior: "Response depends on construction and sensing method.",
  keyFeature: "Links magnetic field changes to diode electrical response.",
  typicalUse: "Magnetic sensing and experimental sensor circuits.",
  applications: ["Field sensing", "Position detection", "Lab instrumentation"],
  comparisonFocus: "A specialized semiconductor sensor rather than a standard current-control diode.",
  notes: "This is a niche teaching device and appears more often in sensor discussions than basic electronics.",
};
