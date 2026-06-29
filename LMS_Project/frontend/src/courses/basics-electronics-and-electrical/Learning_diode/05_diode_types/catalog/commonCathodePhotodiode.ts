import type { DiodeType } from "../types";

export const commonCathodePhotodiode: DiodeType = {
  id: "common-cathode-photodiode",
  name: "Common Cathode Photodiode",
  subtitle: "Multi-sensor photodiode with shared cathode",
  icon: "CP",
  category: "Optoelectronics",
  packageStyle: "Array or shared-terminal sensor package",
  symbol: "Common cathode photodiode symbol",
  forwardBehavior: "Usually not used in forward bias for teaching applications.",
  reverseBehavior: "Multiple photo junctions share one cathode return path.",
  keyFeature: "Shared cathode simplifies array-style optical sensing.",
  typicalUse: "Sensor arrays and multi-channel optical reception.",
  applications: ["Optical array", "Channel grouping", "Compact sensor layout"],
  comparisonFocus: "Useful when several sensing elements need one common return node.",
  notes: "The shared terminal changes wiring and readout architecture more than junction physics.",
};
