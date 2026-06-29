import type { DiodeType } from "../types";

export const bidirectionalPhotodiode: DiodeType = {
  id: "bidirectional-photodiode",
  name: "Bidirectional Photodiode",
  subtitle: "Two-direction optical sensing structure",
  icon: "BP",
  category: "Optoelectronics",
  packageStyle: "Dual optical sensor package",
  symbol: "Bidirectional photodiode symbol",
  forwardBehavior: "Supports optical response with symmetrical or paired sensing arrangement.",
  reverseBehavior: "Can respond to light for signals in both directions depending on structure.",
  keyFeature: "Bidirectional optical detection.",
  typicalUse: "Specialized optical coupling or dual-direction sensing.",
  applications: ["Optical link experiment", "Dual-path sensing", "Balanced detector"],
  comparisonFocus: "More specialized than a standard single photodiode receiver.",
  notes: "This is a teaching category for dual-direction light detection behavior.",
};
