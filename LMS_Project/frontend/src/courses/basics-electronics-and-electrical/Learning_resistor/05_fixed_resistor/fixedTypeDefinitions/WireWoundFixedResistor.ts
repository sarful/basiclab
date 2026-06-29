export const wireWoundFixedResistor: FixedType = {
  key: "wireWound",
  name: "Wire Wound",
  bn: "Wire Wound Resistor",

  bodyColor: "#f1c27d",
  layerColor: "#f97316",

  description:
    "A high-power fixed resistor constructed from resistive wire wound around a ceramic core.",

  whatIs:
    "A fixed resistor made by winding resistance wire around a ceramic core, designed to handle high power and dissipate heat effectively.",

  toleranceOptions: [1, 2, 5],
  powerOptions: [1, 2, 5, 10],

  accuracy: 80,
  noise: 20,
  heatHandling: 95,

  application:
    "Power supplies, motor braking circuits, load banks, industrial equipment, and heater circuits.",

  limitation:
    "Larger physical size and possible inductive effects at higher frequencies.",
};
