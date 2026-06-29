import type { DiodeType } from "../types";

export const pinDiode: DiodeType = {
  id: "pin-diode",
  name: "PIN Diode",
  subtitle: "P-I-N structure RF control diode",
  icon: "PN",
  category: "RF Control",
  packageStyle: "SMD RF package or detector package",
  symbol: "PIN diode symbol",
  forwardBehavior: "Acts like a current-controlled RF resistor in forward bias.",
  reverseBehavior: "Acts like a small capacitor or open path in reverse bias.",
  keyFeature: "Intrinsic region improves RF switching and attenuation control.",
  typicalUse: "RF switch, attenuator, and limiter circuits.",
  applications: ["RF switch", "Attenuator", "Antenna path control"],
  comparisonFocus: "Selected for RF behavior instead of low-frequency rectification.",
  notes: "The intrinsic layer is the defining structural difference from a basic PN diode.",
};
