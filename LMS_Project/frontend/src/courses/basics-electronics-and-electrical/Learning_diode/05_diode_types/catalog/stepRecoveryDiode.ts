import type { DiodeType } from "../types";

export const stepRecoveryDiode: DiodeType = {
  id: "step-recovery-diode",
  name: "Step Recovery Diode",
  subtitle: "Charge-storage pulse sharpening diode",
  icon: "SR",
  category: "Pulse / RF",
  packageStyle: "Small high-frequency package",
  symbol: "Step recovery diode symbol",
  forwardBehavior: "Stores charge during forward conduction.",
  reverseBehavior: "Releases stored charge abruptly, creating a very fast transition.",
  keyFeature: "Fast pulse edge generation.",
  typicalUse: "Pulse shaping, harmonic generation, and timing circuits.",
  applications: ["Pulse generator", "Comb generator", "High-speed timing"],
  comparisonFocus: "Used for abrupt switching effects rather than ordinary rectification.",
  notes: "Its stored-charge behavior is intentionally used in high-speed circuits.",
};
