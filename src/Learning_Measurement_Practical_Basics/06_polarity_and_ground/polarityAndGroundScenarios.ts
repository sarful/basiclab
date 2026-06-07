import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import type { MultimeterMeasurementFamily } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";

const OMEGA = "\u03A9";

export type PolarityAndGroundScenarioId =
  | "battery_polarity_9v"
  | "dc_ground_reference_12v"
  | "reverse_probe_polarity";

export type PolaritySourceType = "dc_battery" | "dc_supply";

export type PolarityProbeTargetId =
  | "battery_positive"
  | "battery_negative"
  | "supply_positive"
  | "supply_ground";

export type PolarityTerminalRole = "ground" | "negative" | "positive";

export type PolarityTerminal = {
  id: PolarityProbeTargetId;
  label: string;
  role: PolarityTerminalRole;
};

export type PolarityAndGroundScenario = {
  expectedBlackLeadJack: MultimeterJackId;
  expectedDialFamily: Extract<MultimeterMeasurementFamily, "dc_voltage">;
  expectedDisplayValue: string;
  expectedRedLeadJack: MultimeterJackId;
  id: PolarityAndGroundScenarioId;
  preferredDialStopIds: MultimeterDialStopId[];
  reverseDisplayValue: string;
  safetyHint: string;
  sourceType: PolaritySourceType;
  targetBlackTerminalId: PolarityProbeTargetId;
  targetRedTerminalId: PolarityProbeTargetId;
  teachingGoal: string;
  terminals: PolarityTerminal[];
  title: string;
  tone: "amber" | "emerald" | "sky";
};

const sharedBlackLeadJack: MultimeterJackId = "jack_com";
const sharedRedLeadJack: MultimeterJackId = "jack_voma";

export const polarityAndGroundScenarios: PolarityAndGroundScenario[] = [
  {
    id: "battery_polarity_9v",
    title: "9V Battery Polarity",
    sourceType: "dc_battery",
    expectedDialFamily: "dc_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "9.0",
    reverseDisplayValue: "-9.0",
    preferredDialStopIds: ["dcv_20", "dcv_200"],
    targetRedTerminalId: "battery_positive",
    targetBlackTerminalId: "battery_negative",
    teachingGoal:
      "Learn that red goes to the positive terminal and black goes to the negative terminal for a positive DC reading.",
    safetyHint: `Use COM and V${OMEGA}mA, then place the probes across the battery + and - terminals.`,
    terminals: [
      { id: "battery_positive", label: "Battery +", role: "positive" },
      { id: "battery_negative", label: "Battery -", role: "negative" },
    ],
    tone: "amber",
  },
  {
    id: "dc_ground_reference_12v",
    title: "12V Ground Reference",
    sourceType: "dc_supply",
    expectedDialFamily: "dc_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "12.0",
    reverseDisplayValue: "-12.0",
    preferredDialStopIds: ["dcv_20", "dcv_200"],
    targetRedTerminalId: "supply_positive",
    targetBlackTerminalId: "supply_ground",
    teachingGoal:
      "Practice using ground as the black-lead reference while measuring the positive supply rail.",
    safetyHint: `Keep black in COM and place it on GND. Use the red lead in V${OMEGA}mA on V+.`,
    terminals: [
      { id: "supply_positive", label: "V+", role: "positive" },
      { id: "supply_ground", label: "GND", role: "ground" },
    ],
    tone: "emerald",
  },
  {
    id: "reverse_probe_polarity",
    title: "Reverse Probe Demo",
    sourceType: "dc_battery",
    expectedDialFamily: "dc_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "-9.0",
    reverseDisplayValue: "9.0",
    preferredDialStopIds: ["dcv_20", "dcv_200"],
    targetRedTerminalId: "battery_negative",
    targetBlackTerminalId: "battery_positive",
    teachingGoal:
      "See that reversing the probe polarity on a DC source gives a negative reading instead of a positive one.",
    safetyHint: `This training demo intentionally reverses the probes to show a negative sign on the display.`,
    terminals: [
      { id: "battery_positive", label: "Battery +", role: "positive" },
      { id: "battery_negative", label: "Battery -", role: "negative" },
    ],
    tone: "sky",
  },
];

export const polarityAndGroundScenarioMap = Object.fromEntries(
  polarityAndGroundScenarios.map((scenario) => [scenario.id, scenario]),
) as Record<PolarityAndGroundScenarioId, PolarityAndGroundScenario>;

