import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import type { MultimeterMeasurementFamily } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";

const OMEGA = "\u03a9";

export type MeasuringVoltageScenarioId =
  | "battery_9v_dc"
  | "dc_supply_12v"
  | "ac_outlet_220v";

export type MeasuringVoltageSourceType =
  | "dc_battery"
  | "dc_supply"
  | "ac_source";

export type VoltageProbeTargetId =
  | "battery_positive"
  | "battery_negative"
  | "supply_positive"
  | "supply_ground"
  | "ac_live"
  | "ac_neutral";

export type MeasuringVoltageTerminal = {
  id: VoltageProbeTargetId;
  label: string;
  role: "negative" | "positive" | "reference";
};

export type MeasuringVoltageScenario = {
  expectedBlackLeadJack: MultimeterJackId;
  expectedDialFamily: Extract<
    MultimeterMeasurementFamily,
    "ac_voltage" | "dc_voltage"
  >;
  expectedDisplayValue: string;
  expectedRedLeadJack: MultimeterJackId;
  id: MeasuringVoltageScenarioId;
  preferredDialStopIds: MultimeterDialStopId[];
  reversePolarityDisplayValue?: string;
  safetyHint: string;
  sourceType: MeasuringVoltageSourceType;
  teachingGoal: string;
  terminals: MeasuringVoltageTerminal[];
  title: string;
};

const sharedBlackLeadJack: MultimeterJackId = "jack_com";
const sharedRedLeadJack: MultimeterJackId = "jack_voma";

export const measuringVoltageScenarios: MeasuringVoltageScenario[] = [
  {
    id: "battery_9v_dc",
    title: "9V Battery Check",
    sourceType: "dc_battery",
    expectedDialFamily: "dc_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "9.0",
    reversePolarityDisplayValue: "-9.0",
    preferredDialStopIds: ["dcv_20", "dcv_200"],
    teachingGoal:
      "Learn that a battery voltage check uses a DC voltage range and the probes go across + and -.",
    safetyHint: `Use COM and V${OMEGA}mA, then place the probes across the battery terminals.`,
    terminals: [
      { id: "battery_positive", label: "Battery +", role: "positive" },
      { id: "battery_negative", label: "Battery -", role: "negative" },
    ],
  },
  {
    id: "dc_supply_12v",
    title: "12V DC Supply",
    sourceType: "dc_supply",
    expectedDialFamily: "dc_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "12.0",
    reversePolarityDisplayValue: "-12.0",
    preferredDialStopIds: ["dcv_20", "dcv_200"],
    teachingGoal:
      "Practice measuring a low-voltage DC supply across V+ and GND.",
    safetyHint: `Black lead stays in COM, red lead stays in V${OMEGA}mA, and probes go across V+ and GND.`,
    terminals: [
      { id: "supply_positive", label: "V+", role: "positive" },
      { id: "supply_ground", label: "GND", role: "reference" },
    ],
  },
  {
    id: "ac_outlet_220v",
    title: "220V AC Demo",
    sourceType: "ac_source",
    expectedDialFamily: "ac_voltage",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "220",
    preferredDialStopIds: ["acv_750", "acv_200"],
    teachingGoal:
      "Show that mains-style AC measurement uses an AC voltage range, not DCV.",
    safetyHint: `For AC voltage training, keep the red lead in V${OMEGA}mA and choose ACV before probing L and N.`,
    terminals: [
      { id: "ac_live", label: "L", role: "positive" },
      { id: "ac_neutral", label: "N", role: "reference" },
    ],
  },
];

export const measuringVoltageScenarioMap = Object.fromEntries(
  measuringVoltageScenarios.map((scenario) => [scenario.id, scenario]),
) as Record<MeasuringVoltageScenarioId, MeasuringVoltageScenario>;

export function getMeasuringVoltageScenario(
  id: MeasuringVoltageScenarioId,
): MeasuringVoltageScenario {
  return measuringVoltageScenarioMap[id];
}
