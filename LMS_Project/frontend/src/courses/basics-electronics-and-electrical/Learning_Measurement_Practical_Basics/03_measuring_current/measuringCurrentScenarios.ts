"use client";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import type { MultimeterMeasurementFamily } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";

const OMEGA = "\u03a9";

export type MeasuringCurrentScenarioId =
  | "sensor_loop_20ma"
  | "dc_load_200ma"
  | "high_current_10a";

export type MeasuringCurrentSourceType = "dc_battery" | "dc_supply";

export type MeasuringCurrentProbeTargetId = "gap_left" | "gap_right";

export type MeasuringCurrentScenario = {
  currentPathHint: string;
  expectedBlackLeadJack: MultimeterJackId;
  expectedDialFamily: Extract<MultimeterMeasurementFamily, "dc_current">;
  expectedDisplayValue: string;
  expectedRedLeadJack: MultimeterJackId;
  id: MeasuringCurrentScenarioId;
  loadLabel: string;
  preferredDialStopIds: MultimeterDialStopId[];
  safetyHint: string;
  seriesGapLabels: {
    left: string;
    right: string;
  };
  seriesPathTitle: string;
  sourceLabel: string;
  sourceType: MeasuringCurrentSourceType;
  teachingGoal: string;
  title: string;
};

const sharedBlackLeadJack: MultimeterJackId = "jack_com";

export const measuringCurrentScenarios: MeasuringCurrentScenario[] = [
  {
    id: "sensor_loop_20ma",
    title: "20mA Sensor Loop",
    sourceType: "dc_battery",
    expectedDialFamily: "dc_current",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: "jack_voma",
    expectedDisplayValue: "18.5",
    preferredDialStopIds: ["dca_20m", "dca_200m"],
    teachingGoal:
      `Learn that small control current uses the V${OMEGA}mA jack and a low DCA range.`,
    safetyHint: `Keep black in COM, red in V${OMEGA}mA, and open the circuit so the meter goes in series.`,
    currentPathHint:
      "Break the sensor loop and place the meter between the source and the load so current flows through the meter.",
    sourceLabel: "Loop Supply",
    loadLabel: "Sensor",
    seriesPathTitle: "Open Sensor Loop",
    seriesGapLabels: {
      left: "Supply side",
      right: "Sensor side",
    },
  },
  {
    id: "dc_load_200ma",
    title: "200mA DC Load",
    sourceType: "dc_supply",
    expectedDialFamily: "dc_current",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: "jack_voma",
    expectedDisplayValue: "160",
    preferredDialStopIds: ["dca_200m"],
    teachingGoal:
      "Practice choosing the 200mA DCA range for a moderate DC current load.",
    safetyHint: `Use COM and V${OMEGA}mA, then insert the meter in series with the load.`,
    currentPathHint:
      "Open the positive feed to the load and bridge that gap with the meter leads.",
    sourceLabel: "12V Supply",
    loadLabel: "DC Load",
    seriesPathTitle: "Break the Load Feed",
    seriesGapLabels: {
      left: "Supply side",
      right: "Load side",
    },
  },
  {
    id: "high_current_10a",
    title: "10A High Current",
    sourceType: "dc_supply",
    expectedDialFamily: "dc_current",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: "jack_10a",
    expectedDisplayValue: "8.40",
    preferredDialStopIds: ["dca_10a"],
    teachingGoal:
      "Learn that high current requires the dedicated 10A jack and 10A DCA range.",
    safetyHint:
      `Move the red lead to 10A before measuring large current, then return it to V${OMEGA}mA after the test.`,
    currentPathHint:
      "Only place the meter in series for a short high-current test and confirm the red lead is in the 10A jack first.",
    sourceLabel: "12V Supply",
    loadLabel: "High Load",
    seriesPathTitle: "Insert Meter for High Current",
    seriesGapLabels: {
      left: "Source side",
      right: "Load side",
    },
  },
];
