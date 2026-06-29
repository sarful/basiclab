import type { DiodeType } from "../types";

export const scrSiliconControlledRectifier: DiodeType = {
  id: "scr-silicon-controlled-rectifier",
  name: "SCR (Silicon Controlled Rectifier)",
  subtitle: "Gate-triggered thyristor rectifier",
  icon: "SCR",
  category: "Power Control",
  packageStyle: "TO-package, stud mount, or power module",
  symbol: "SCR symbol",
  forwardBehavior: "Turns on when forward biased and triggered by the gate, then latches on.",
  reverseBehavior: "Blocks reverse voltage like a controlled rectifier device.",
  keyFeature: "Gate-triggered latching control of power current.",
  typicalUse: "AC power control, controlled rectification, and protection crowbars.",
  applications: ["Dimmer", "Motor control", "Controlled rectifier", "Crowbar protection"],
  comparisonFocus: "More controllable than a diode because gate triggering decides turn-on.",
  notes: "An SCR belongs to the thyristor family but is often introduced in advanced diode/power chapters.",
};
