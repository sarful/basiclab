"use client";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import type { MultimeterMeasurementFamily } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";

const OMEGA = "\u03a9";

export type ContinuityTestScenarioId =
  | "closed_wire_path"
  | "blown_fuse_open"
  | "closed_switch_path";

export type ContinuityProbeTargetId = "point_a" | "point_b";

export type ContinuityPathState = "closed" | "open";

export type ContinuityTestScenario = {
  expectedBlackLeadJack: MultimeterJackId;
  expectedDialFamily: Extract<MultimeterMeasurementFamily, "diode">;
  expectedRedLeadJack: MultimeterJackId;
  id: ContinuityTestScenarioId;
  pathState: ContinuityPathState;
  preferredDialStopIds: MultimeterDialStopId[];
  previewLabel: string;
  safetyHint: string;
  teachingGoal: string;
  terminalLabels: {
    left: string;
    right: string;
  };
  title: string;
  tone: "emerald" | "rose" | "sky";
};

const sharedBlackLeadJack: MultimeterJackId = "jack_com";
const sharedRedLeadJack: MultimeterJackId = "jack_voma";

export const continuityTestScenarios: ContinuityTestScenario[] = [
  {
    id: "closed_wire_path",
    title: "Closed Wire Path",
    previewLabel: "Wire Link",
    pathState: "closed",
    expectedDialFamily: "diode",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    preferredDialStopIds: ["diode"],
    teachingGoal:
      "Learn that a closed conductor path gives continuity when both probes touch opposite test points.",
    safetyHint:
      "Power must be off. Continuity is checked on an unpowered path with COM and VΩmA leads.",
    terminalLabels: {
      left: "Point A",
      right: "Point B",
    },
    tone: "emerald",
  },
  {
    id: "blown_fuse_open",
    title: "Blown Fuse Open",
    previewLabel: "Open Fuse",
    pathState: "open",
    expectedDialFamily: "diode",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    preferredDialStopIds: ["diode"],
    teachingGoal:
      "See that an open path does not beep and does not show continuity even when the probes are on the correct test points.",
    safetyHint:
      "Isolate the fuse path and test with power removed. An open fuse should not produce a continuity indication.",
    terminalLabels: {
      left: "Fuse In",
      right: "Fuse Out",
    },
    tone: "rose",
  },
  {
    id: "closed_switch_path",
    title: "Closed Switch Path",
    previewLabel: "Closed Contact",
    pathState: "closed",
    expectedDialFamily: "diode",
    expectedBlackLeadJack: sharedBlackLeadJack,
    expectedRedLeadJack: sharedRedLeadJack,
    preferredDialStopIds: ["diode"],
    teachingGoal:
      "Practice continuity across a closed contact path by touching one probe to each terminal.",
    safetyHint:
      "Make sure the contact is isolated from live power before running a continuity check.",
    terminalLabels: {
      left: "Contact In",
      right: "Contact Out",
    },
    tone: "sky",
  },
];

export const continuityFunctionLabel = `Diode / continuity-style function`;
export const continuityRequiredJacksLabel = `COM + V${OMEGA}mA`;
