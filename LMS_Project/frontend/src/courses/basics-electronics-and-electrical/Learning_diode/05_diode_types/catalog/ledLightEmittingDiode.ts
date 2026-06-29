import type { DiodeType } from "../types";

export const ledLightEmittingDiode: DiodeType = {
  id: "led-light-emitting-diode",
  name: "LED (Light Emitting Diode)",
  subtitle: "Forward-biased light source diode",
  icon: "LED",
  category: "Optoelectronics",
  packageStyle: "Through-hole epoxy or SMD LED package",
  symbol: "A --|>|-- K >>",
  forwardBehavior: "Emits light when forward current flows.",
  reverseBehavior: "Blocks reverse current and is not meant for large reverse voltage.",
  keyFeature: "Converts electrical energy into visible or infrared light.",
  typicalUse: "Indicators, lighting, displays, and optical signaling.",
  applications: ["Status indicator", "Display pixel", "General lighting"],
  comparisonFocus: "Chosen when light output is the main purpose.",
  notes: "Forward voltage depends strongly on LED color and semiconductor material.",
};
