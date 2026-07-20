import type { FixedType } from "../types";

export const metalFilmFixedResistor: FixedType = {
  key: "metalFilm",
  name: "Metal Film",
  bn: "Metal Film Resistor",

  bodyColor: "#e6d5b8",
  layerColor: "#2563eb",

  description:
    "A precision fixed resistor known for low noise, high accuracy, and stable performance.",

  whatIs:
    "A fixed resistor manufactured using a thin metal film layer to provide excellent accuracy, stability, and low electrical noise.",

  toleranceOptions: [0.1, 0.5, 1, 2],
  powerOptions: [0.125, 0.25, 0.5, 1],

  accuracy: 92,
  noise: 15,
  heatHandling: 55,

  application:
    "Sensor circuits, amplifiers, instrumentation, and precision measurement systems.",

  limitation: "Not the ideal choice for very high-power applications.",
};
