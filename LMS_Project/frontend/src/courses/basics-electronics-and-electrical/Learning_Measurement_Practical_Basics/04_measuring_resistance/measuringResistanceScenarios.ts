"use client";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import type { MultimeterMeasurementFamily } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";

const OMEGA = "\u03a9";

export type MeasuringResistanceScenarioId =
  | "resistor_220_ohm"
  | "resistor_2k2_ohm"
  | "resistor_680_ohm";

export type ResistanceProbeTargetId = "terminal_left" | "terminal_right";

export type MeasuringResistanceScenario = {
  expectedBlackLeadJack: MultimeterJackId;
  expectedDialFamily: Extract<MultimeterMeasurementFamily, "resistance">;
  expectedDisplayValue: string;
  expectedRedLeadJack: MultimeterJackId;
  id: MeasuringResistanceScenarioId;
  preferredDialStopIds: MultimeterDialStopId[];
  resistanceLabel: string;
  safetyHint: string;
  targetColor: string;
  teachingGoal: string;
  terminalLabels: {
    left: string;
    right: string;
  };
  title: string;
};

const sharedBlackLeadJack: MultimeterJackId = "jack_com";
const sharedRedLeadJack: MultimeterJackId = "jack_voma";

export const measuringResistanceScenarios: MeasuringResistanceScenario[] = [
  {
    id: "resistor_220_ohm",
    title: `220${OMEGA} Resistor Check`,
    resistanceLabel: `220 ${OMEGA}`,
    expectedDialFamily: "resistance",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "220",
    preferredDialStopIds: ["ohm_2000"],
    teachingGoal:
      "Practice moving to the ohms family and measuring a low-value resistor across both legs.",
    safetyHint:
      "Remove power from the circuit before resistance measurement and measure directly across the isolated resistor.",
    terminalLabels: {
      left: "Lead 1",
      right: "Lead 2",
    },
    targetColor: "#f59e0b",
  },
  {
    id: "resistor_2k2_ohm",
    title: `2.2k${OMEGA} Resistor Check`,
    resistanceLabel: `2.2k ${OMEGA}`,
    expectedDialFamily: "resistance",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "2.20",
    preferredDialStopIds: ["ohm_20k"],
    teachingGoal:
      "Learn to choose a higher ohms range for kilo-ohm resistors while keeping both probes across the component.",
    safetyHint:
      "Use COM and VΩmA, keep the board de-energized, and place one probe on each resistor terminal.",
    terminalLabels: {
      left: "Lead A",
      right: "Lead B",
    },
    targetColor: "#0ea5e9",
  },
  {
    id: "resistor_680_ohm",
    title: `680${OMEGA} Resistor Check`,
    resistanceLabel: `680 ${OMEGA}`,
    expectedDialFamily: "resistance",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    expectedDisplayValue: "680",
    preferredDialStopIds: ["ohm_2000"],
    teachingGoal:
      "Build confidence reading another resistor value by keeping the probes across both terminals with the correct ohms range.",
    safetyHint:
      "Never measure resistance on a live circuit. Isolate the resistor and then bridge both leads with the probes.",
    terminalLabels: {
      left: "Node 1",
      right: "Node 2",
    },
    targetColor: "#22c55e",
  },
];
