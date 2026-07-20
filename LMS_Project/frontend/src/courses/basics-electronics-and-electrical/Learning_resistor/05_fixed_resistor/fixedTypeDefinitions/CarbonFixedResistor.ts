import type { FixedType } from "../types";

export const carbonFixedResistor: FixedType = {
  key: "carbon",
  name: "Carbon Composition",
  bn: "Carbon Composition Resistor",
  bodyColor: "#d6b27b",
  layerColor: "#334155",

  description:
    "A low-cost fixed resistor commonly used in basic electronic circuits and educational laboratories.",

  whatIs:
    "A fixed resistor made from a mixture of carbon powder and binding material, used to control current flow in general-purpose electronic circuits.",

  toleranceOptions: [5, 10, 20],
  powerOptions: [0.25, 0.5, 1],

  accuracy: 35,
  noise: 75,
  heatHandling: 45,

  application:
    "Basic LED circuits, educational projects, school laboratories, and simple electronics.",

  limitation:
    "Higher electrical noise and lower accuracy compared to modern precision resistors.",
};
