import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import type { MultimeterMeasurementFamily } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";

const OMEGA = "\u03A9";

export type BatteryBasicsScenarioId =
  | "fresh_9v_battery"
  | "low_9v_battery"
  | "reverse_probe_demo";

export type BatteryProbeTargetId = "battery_positive" | "battery_negative";

export type BatteryHealth = "fresh" | "low" | "reversed";

export type BatteryBasicsScenario = {
  expectedBlackLeadJack: MultimeterJackId;
  expectedDialFamily: Extract<MultimeterMeasurementFamily, "dc_voltage">;
  expectedDisplayValue: string;
  expectedRedLeadJack: MultimeterJackId;
  health: BatteryHealth;
  id: BatteryBasicsScenarioId;
  preferredDialStopIds: MultimeterDialStopId[];
  reverseDisplayValue: string;
  safetyHint: string;
  targetBlackTerminalId: BatteryProbeTargetId;
  targetRedTerminalId: BatteryProbeTargetId;
  teachingGoal: string;
  title: string;
  tone: "amber" | "emerald" | "sky";
};

const sharedBlackLeadJack: MultimeterJackId = "jack_com";
const sharedRedLeadJack: MultimeterJackId = "jack_voma";

export const batteryBasicsScenarios: BatteryBasicsScenario[] = [
  {
    id: "fresh_9v_battery",
    title: "Fresh 9V Battery",
    expectedDialFamily: "dc_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "9.2",
    reverseDisplayValue: "-9.2",
    preferredDialStopIds: ["dcv_20", "dcv_200"],
    targetRedTerminalId: "battery_positive",
    targetBlackTerminalId: "battery_negative",
    health: "fresh",
    teachingGoal:
      "Recognize a healthy battery reading and practice placing the red probe on + and black probe on -.",
    safetyHint: `Use COM and V${OMEGA}mA, then place the probes across the battery terminals without shorting them together.`,
    tone: "emerald",
  },
  {
    id: "low_9v_battery",
    title: "Low 9V Battery",
    expectedDialFamily: "dc_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "6.4",
    reverseDisplayValue: "-6.4",
    preferredDialStopIds: ["dcv_20", "dcv_200"],
    targetRedTerminalId: "battery_positive",
    targetBlackTerminalId: "battery_negative",
    health: "low",
    teachingGoal:
      "See how a weak battery still shows polarity correctly but a lower DC voltage reading than expected.",
    safetyHint: `A low battery can still be measured the same way: black in COM, red in V${OMEGA}mA, probes across + and -.`,
    tone: "amber",
  },
  {
    id: "reverse_probe_demo",
    title: "Reverse Probe Demo",
    expectedDialFamily: "dc_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "-9.0",
    reverseDisplayValue: "9.0",
    preferredDialStopIds: ["dcv_20", "dcv_200"],
    targetRedTerminalId: "battery_negative",
    targetBlackTerminalId: "battery_positive",
    health: "reversed",
    teachingGoal:
      "Learn that the minus sign appears when the red and black probes are reversed on a DC battery.",
    safetyHint:
      "This demo intentionally reverses probe direction to teach polarity sign. The jack setup stays the same.",
    tone: "sky",
  },
];

export const batteryRequiredJacksLabel = `COM + V${OMEGA}mA`;

