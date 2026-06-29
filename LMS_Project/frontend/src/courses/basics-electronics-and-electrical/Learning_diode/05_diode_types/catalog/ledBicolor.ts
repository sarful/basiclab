import type { DiodeType } from "../types";

export const ledBicolor: DiodeType = {
  id: "led-bicolor",
  name: "LED Bicolor",
  subtitle: "Two-color light-emitting diode",
  icon: "BC",
  category: "Optoelectronics",
  packageStyle: "Bi-color indicator package",
  symbol: "Bicolor LED symbol",
  forwardBehavior: "Emits one color depending on current direction or internal arrangement.",
  reverseBehavior: "May emit another color in opposite conduction arrangement for two-lead versions.",
  keyFeature: "Two visible colors from one package.",
  typicalUse: "Status indication where two states must be shown clearly.",
  applications: ["Power / fault indicator", "Charge state display", "Mode indicator"],
  comparisonFocus: "Chosen when one indicator must show more than one state.",
  notes: "Bicolor LEDs may be two-lead reverse-parallel or three-lead common-terminal types.",
};
