import type { DiodeType } from "../types";

export const photodiode: DiodeType = {
  id: "photodiode",
  name: "Photodiode",
  subtitle: "Light-sensing diode",
  icon: "PD",
  category: "Optoelectronics",
  packageStyle: "Transparent lens or sensor package",
  symbol: "A --|<|-- K <<",
  forwardBehavior: "Can conduct like a diode, but normal sensing use is reverse biased.",
  reverseBehavior: "Produces photocurrent when light falls on the junction.",
  keyFeature: "Converts light into current.",
  typicalUse: "Light sensor, optical receiver, and isolation feedback.",
  applications: ["Light sensing", "Remote receiver", "Optocoupler output side"],
  comparisonFocus: "Used when electrical output must respond to light input.",
  notes: "Photocurrent is proportional to light intensity over a useful operating range.",
};
