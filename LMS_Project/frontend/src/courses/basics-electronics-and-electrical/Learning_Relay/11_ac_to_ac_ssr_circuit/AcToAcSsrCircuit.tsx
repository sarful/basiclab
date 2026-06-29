"use client";

import React, { useEffect, useMemo, useState } from "react";

/* =========================================================
   TYPES
   ========================================================= */

type Point = {
  x: number;
  y: number;
};

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ComponentTune = {
  leftRight: number;
  upDown: number;
  widthScale: number;
  heightScale: number;
  scale: number;
  rotate: number;
};

type WireRouteControl = {
  startOffset: Point;
  endOffset: Point;
  bendOffsets: Point[];
};

type FlowType = "input" | "optical" | "gate" | "output" | "none";

type WireSegment = {
  id: string;
  points: Point[];
  width?: number;
  active: boolean;
  flowType: FlowType;
};

type CurrentFlowPath = {
  id: string;
  points: Point[];
  active: boolean;
  flowType: Exclude<FlowType, "none">;
};

type ResistorBase = {
  start: Point;
  end: Point;
  amplitude: number;
  segments: number;
};

type LabelBase = {
  point: Point;
  size: number;
  rotate?: number;
  anchor?: "start" | "middle" | "end";
  color?: string;
  weight?: number;
};

type SimulationMode = "onOff" | "timeline";

type TimelineStep = {
  step: number;
  title: string;
  explanation: string;
  currentFlowDirection: string;
};

type SimulationControlState = {
  mode: SimulationMode;
  isPlaying: boolean;
  onOffActive: boolean;
  timelineStep: number;
};

type SimulationDerivedState = SimulationControlState & {
  inputDcSourceActive: boolean;
  inputDcActive: boolean;
  inputSourceWireActive: boolean;
  inputCurrentActive: boolean;
  inputResistorActive: boolean;
  inputDiodeActive: boolean;
  inputLedOn: boolean;
  inputReturnActive: boolean;

  opticalSignalActive: boolean;

  phototriacOn: boolean;
  triacGateActive: boolean;
  triacOn: boolean;

  acSourceActive: boolean;
  acPilotLightOn: boolean;
  acOutputCurrentActive: boolean;
  circuitOn: boolean;

  currentStepTitle: string;
  currentStepExplanation: string;
  currentFlowDirection: string;
};

type DcToAcSsrDiagramProps = {
  className?: string;
};

/* =========================================================
   SIMULATOR FORMAT
   ========================================================= */

export const RELAY_SIMULATOR_FORMAT = "relay";

/* =========================================================
   VIEW BOX
   ========================================================= */

export const VIEW_BOX: Box = {
  x: -210,
  y: 0,
  width: 2520,
  height: 887,
};

/* =========================================================
   SCALE CONTROLS
   ========================================================= */

export const CIRCUIT_COMPONENT_SCALE = 1;
export const BASE_WIRE_WIDTH = 6;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const SCALE = {
  CIRCUIT_COMPONENT_SCALE,
  BASE_WIRE_WIDTH,
  CIRCUIT_WIRE_SCALE,
  CIRCUIT_CANVAS_SCALE,
};

/* =========================================================
   GLOBAL OFFSET CONTROLS
   ========================================================= */

export const COMPONENT_OFFSET: Point = {
  x: 0,
  y: 0,
};

export const WIRE_OFFSET: Point = {
  x: 0,
  y: 0,
};

/* =========================================================
   GROUP OFFSET CONTROLS
   ========================================================= */

export const INPUT_SIDE_GROUP_OFFSET: Point = {
  x: 50,
  y: 0,
};

export const OUTPUT_SIDE_GROUP_OFFSET: Point = {
  x: 30,
  y: 0,
};

/* =========================================================
   DEBUG TERMINAL DOT CONTROLS
   ========================================================= */

export const DEBUG_TERMINAL_OFFSET = {
  enabled: false,

  inputDcSourcePositive: { x: 0, y: 0 },
  inputDcSourceNegative: { x: 0, y: 0 },

  inputPositive: { x: 0, y: 0 },
  inputNegative: { x: 0, y: 0 },
  inputJunction: { x: 0, y: 0 },

  diodeTop: { x: 0, y: 0 },
  diodeBottom: { x: 0, y: 0 },

  ledTop: { x: 0, y: 0 },
  ledBottom: { x: 0, y: 0 },

  phototriacTop: { x: 0, y: 0 },
  phototriacUpperResistorStart: { x: 0, y: 0 },
  phototriacUpperResistorEnd: { x: 0, y: 0 },
  phototriacMiddle: { x: 0, y: 0 },
  phototriacLowerResistorStart: { x: 0, y: 0 },
  phototriacBottom: { x: 0, y: 0 },

  triacTop: { x: 0, y: 0 },
  triacGate: { x: 0, y: 0 },
  triacBottom: { x: 0, y: 0 },

  outputTop: { x: 0, y: 0 },
  outputBottom: { x: 0, y: 0 },

  acPilotLightLeft: { x: 0, y: 0 },
  acPilotLightRight: { x: 0, y: 0 },

  acSourceTop: { x: 0, y: 0 },
  acSourceBottom: { x: 0, y: 0 },

  dotRadius: 11,
  labelSize: 20,
};

/* =========================================================
   COLORS
   No yellow fill is used. Component bodies stay white.
   ========================================================= */

const COLORS = {
  background: "#f8fafc",
  wire: "#303541",
  symbolFill: "#ffffff",
  orange: "#f97316",
  white: "#ffffff",

  input: "#f97316",
  optical: "#0ea5e9",
  gate: "#a855f7",
  output: "#22c55e",

  inputSoft: "#ffffff",
  opticalSoft: "#ffffff",
  gateSoft: "#ffffff",
  outputSoft: "#ffffff",

  debugInput: "#f97316",
  debugOutput: "#22c55e",
  debugGate: "#a855f7",
};

/* =========================================================
   STYLE CONSTANTS
   ========================================================= */

export const NODE = {
  radius: 15,
  color: COLORS.wire,
};

export const WIRE = {
  color: COLORS.wire,
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  activeWidth: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE + 1.5,
  symbolWidth: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  thinWidth: 4 * CIRCUIT_WIRE_SCALE,
};

export const PATH = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const LABEL = {
  color: COLORS.wire,
  orange: COLORS.orange,
  family:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  weight: 800,
};

/* =========================================================
   SIMULATION CONSTANTS
   ========================================================= */

export const CURRENT_DOT_CONTROL = {
  enabled: true,
  radius: 5,
  count: 4,

  speedSeconds: {
    input: 1.45,
    optical: 1.1,
    gate: 1.35,
    output: 1.8,
  },
};

export const TIMELINE_CONTROL = {
  firstStep: 0,
  finalStep: 8,
  stepDurationMs: 1200,
};

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: 0,
    title: "Idle / SSR OFF",
    explanation:
      "Input DC Source is visible but inactive. The input LED is OFF, optical signal is OFF, phototriac is OFF, TRIAC is OFF, and AC pilot light is OFF.",
    currentFlowDirection: "No current flow.",
  },
  {
    step: 1,
    title: "Input DC Source Applied",
    explanation:
      "Input DC Source becomes active and applies DC voltage to the SSR input terminals.",
    currentFlowDirection: "Input DC Source + → SSR Input +.",
  },
  {
    step: 2,
    title: "Input Current Through R",
    explanation:
      "Input current flows through the input resistor R. The resistor limits current going into the input LED.",
    currentFlowDirection: "Input DC Source + → SSR Input + → R.",
  },
  {
    step: 3,
    title: "Input LED ON",
    explanation:
      "Input LED turns ON. The return path goes back to Input DC Source − through the SSR input − terminal.",
    currentFlowDirection:
      "Input DC Source + → SSR Input + → R → LED → SSR Input − → Input DC Source −.",
  },
  {
    step: 4,
    title: "Optical Signal Active",
    explanation:
      "Light from the input LED reaches the phototriac. Input side and output side stay electrically isolated.",
    currentFlowDirection: "Optical signal: LED → Phototriac.",
  },
  {
    step: 5,
    title: "Phototriac ON",
    explanation:
      "The phototriac receives light and turns ON. It starts preparing the TRIAC gate trigger path.",
    currentFlowDirection:
      "Output-side trigger network begins conducting through the phototriac section.",
  },
  {
    step: 6,
    title: "TRIAC Gate Triggered",
    explanation:
      "Gate current reaches the main TRIAC gate through the phototriac trigger network.",
    currentFlowDirection:
      "AC rail → resistor → phototriac → TRIAC gate trigger path.",
  },
  {
    step: 7,
    title: "Main TRIAC ON",
    explanation:
      "The main TRIAC turns ON and creates a bidirectional AC conduction path.",
    currentFlowDirection: "TRIAC main terminal path is conductive.",
  },
  {
    step: 8,
    title: "AC Pilot Light ON",
    explanation:
      "The AC output loop is complete. AC Source drives current through the AC Pilot Light and the TRIAC-controlled SSR output path.",
    currentFlowDirection:
      "AC Source → AC Pilot Light → SSR Output → TRIAC → AC Source. AC current alternates in both directions.",
  },
];

const DEFAULT_SIMULATION_CONTROL: SimulationControlState = {
  mode: "timeline",
  isPlaying: false,
  onOffActive: false,
  timelineStep: 0,
};

/* =========================================================
   TUNING HELPER
   ========================================================= */

const tune = (value?: Partial<ComponentTune>): ComponentTune => ({
  leftRight: 0,
  upDown: 0,
  widthScale: 1,
  heightScale: 1,
  scale: 1,
  rotate: 0,
  ...value,
});

/* =========================================================
   INPUT SIDE MANUAL CONTROLS
   ========================================================= */

export const INPUT_DC_SOURCE_OFFSET: Point = {
  x: 0,
  y: 0,
};

export const INPUT_DC_SOURCE_CONTROL = {
  topTerminalOffset: { x: 0, y: 0 },
  bottomTerminalOffset: { x: 0, y: 0 },

  longPlateOffset: { x: 0, y: 60 },
  shortPlateOffset: { x: 0, y: -60 },

  plusSymbolOffset: { x: 0, y: 0 },
  minusSymbolOffset: { x: 0, y: 0 },

  plusSymbolSize: 42,
  minusSymbolSize: 42,

  labelOffset: { x: 110, y: 0 },
};

export const INPUT_TERMINAL_CONTROL = {
  positiveNodeOffset: { x: 0, y: 0 },
  negativeNodeOffset: { x: 0, y: 0 },

  plusSymbolOffset: { x: 0, y: 0 },
  minusSymbolOffset: { x: 0, y: 0 },

  labelOffset: { x: 0, y: 0 },
};

export const INPUT_RESISTOR_CONTROL = {
  startOffset: { x: 0, y: 0 },
  endOffset: { x: 0, y: 0 },

  amplitudeScale: 1,
  segmentOffset: 0,

  labelOffset: { x: 0, y: 0 },
};

export const INPUT_NODE_CONTROL = {
  junctionOffset: { x: 0, y: 0 },
};

/* =========================================================
   DIODE CONTROL
   topTerminalOffset is adjusted so the external wire stops
   above the diode body instead of going through the diode.
   ========================================================= */

export const DIODE_CONTROL = {
  topTerminalOffset: { x: 0, y: 160 },
  bottomTerminalOffset: { x: 0, y: 0 },

  plateLeftOffset: { x: 0, y: 0 },
  plateRightOffset: { x: 0, y: 0 },

  triangleTopOffset: { x: 0, y: -20 },
  triangleLeftOffset: { x: 0, y: 0 },
  triangleRightOffset: { x: 0, y: 0 },

  labelOffset: { x: 0, y: 0 },
};

export const LED_CONTROL = {
  topTerminalOffset: { x: 0, y: 0 },
  bottomTerminalOffset: { x: 0, y: 0 },

  triangleLeftOffset: { x: 0, y: 0 },
  triangleRightOffset: { x: 0, y: 0 },
  triangleTipOffset: { x: 0, y: 0 },

  plateLeftOffset: { x: 0, y: 0 },
  plateRightOffset: { x: 0, y: 0 },

  labelOffset: { x: 0, y: 0 },
};

export const OPTICAL_SIGNAL_CONTROL = {
  upperStartOffset: {
    x: INPUT_SIDE_GROUP_OFFSET.x,
    y: INPUT_SIDE_GROUP_OFFSET.y,
  },
  upperEndOffset: {
    x: OUTPUT_SIDE_GROUP_OFFSET.x,
    y: OUTPUT_SIDE_GROUP_OFFSET.y,
  },

  lowerStartOffset: {
    x: INPUT_SIDE_GROUP_OFFSET.x,
    y: INPUT_SIDE_GROUP_OFFSET.y,
  },
  lowerEndOffset: {
    x: OUTPUT_SIDE_GROUP_OFFSET.x,
    y: OUTPUT_SIDE_GROUP_OFFSET.y,
  },

  arrowHeadLengthOffset: 0,
};

/* =========================================================
   OUTPUT SIDE MANUAL CONTROLS
   ========================================================= */

export const OUTPUT_RAIL_CONTROL = {
  topStartOffset: { x: 0, y: 0 },
  topEndOffset: { x: 0, y: 0 },

  bottomStartOffset: { x: 0, y: 0 },
  bottomEndOffset: { x: 0, y: 0 },

  topOutputNodeOffset: { x: 0, y: 0 },
  bottomOutputNodeOffset: { x: 0, y: 0 },

  labelOffset: { x: 0, y: 0 },
};

export const PHOTOTRIAC_CONTROL = {
  topLeadStartOffset: { x: 0, y: 0 },

  upperResistorStartOffset: { x: 0, y: 0 },
  upperResistorEndOffset: { x: 0, y: 0 },
  upperResistorAmplitudeScale: 1,
  upperResistorSegmentOffset: 0,

  upperLeadEndOffset: { x: 0, y: 0 },

  symbolCenterOffset: { x: 0, y: 0 },

  lowerLeadStartOffset: { x: 0, y: 0 },
  middleNodeOffset: { x: 0, y: 0 },

  lowerResistorStartOffset: { x: 0, y: 0 },
  lowerResistorEndOffset: { x: 0, y: 0 },
  lowerResistorAmplitudeScale: 1,
  lowerResistorSegmentOffset: 0,

  labelOffset: { x: 0, y: 0 },
  upperResistorLabelOffset: { x: 0, y: 0 },
  lowerResistorLabelOffset: { x: 0, y: 0 },
};

export const TRIAC_CONTROL = {
  topLeadStartOffset: { x: 0, y: 0 },
  topLeadEndOffset: { x: 0, y: 0 },

  symbolCenterOffset: { x: 0, y: 0 },

  bottomLeadStartOffset: { x: 0, y: 0 },
  bottomLeadEndOffset: { x: 0, y: 0 },

  gateTerminalOffset: { x: 0, y: 0 },

  labelOffset: { x: 0, y: 0 },
};

export const AC_PILOT_LIGHT_OFFSET: Point = {
  x: -100,
  y: 0,
};

export const AC_PILOT_LIGHT_CONTROL = {
  leftTerminalOffset: { x: 0, y: 0 },
  rightTerminalOffset: { x: 0, y: 0 },

  lampCenterOffset: { x: 0, y: 0 },
  lampRadius: 42,

  crossOffset: { x: 0, y: 0 },
  crossSize: 48,

  labelOffset: { x: 0, y: 0 },
};

export const AC_SOURCE_OFFSET: Point = {
  x: -200,
  y: 0,
};

export const AC_SOURCE_CONTROL = {
  topTerminalOffset: { x: 0, y: 0 },
  bottomTerminalOffset: { x: 0, y: 0 },

  circleCenterOffset: { x: 0, y: 0 },
  circleRadius: 88,

  waveOffset: { x: 0, y: 0 },
  waveWidth: 110,
  waveHeight: 42,

  labelOffset: { x: 0, y: 0 },
};

/* =========================================================
   BASE COMPONENT GEOMETRY
   ========================================================= */

export const BASE_COMPONENT = {
  frame: {
    anchor: { x: 878, y: 401 },
    points: [
      { x: 151, y: 52 },
      { x: 1595, y: 52 },
      { x: 1595, y: 750 },
      { x: 151, y: 750 },
      { x: 151, y: 52 },
    ],
  },

  inputDcSource: {
    anchor: { x: -95, y: 415 },

    topTerminal: { x: -95, y: 195 },
    bottomTerminal: { x: -95, y: 635 },

    longPlate: {
      center: { x: -95, y: 320 },
      halfWidth: 58,
    },

    shortPlate: {
      center: { x: -95, y: 510 },
      halfWidth: 36,
    },

    plusSymbol: {
      center: { x: -165, y: 320 },
    },

    minusSymbol: {
      center: { x: -165, y: 510 },
    },

    label: {
      point: { x: -95, y: 710 },
      size: 28,
    } satisfies LabelBase,
  },

  inputTerminal: {
    anchor: { x: 201, y: 415 },

    positiveNode: { x: 201, y: 195 },
    negativeNode: { x: 201, y: 635 },

    plus: {
      center: { x: 117, y: 195 },
      size: 58,
    },

    minus: {
      center: { x: 117, y: 635 },
      size: 58,
    },

    label: {
      point: { x: 98, y: 425 },
      size: 46,
      rotate: -90,
    } satisfies LabelBase,
  },

  inputResistor: {
    anchor: { x: 403, y: 195 },
    start: { x: 340, y: 195 },
    end: { x: 466, y: 195 },
    amplitude: 26,
    segments: 8,
    label: {
      point: { x: 400, y: 139 },
      size: 40,
    } satisfies LabelBase,
  },

  inputNode: {
    anchor: { x: 561, y: 195 },
    junction: { x: 561, y: 195 },
  },

  inputDiode: {
    anchor: { x: 561, y: 415 },

    topTerminal: { x: 561, y: 195 },
    bottomTerminal: { x: 561, y: 635 },

    plateLeft: { x: 518, y: 365 },
    plateRight: { x: 604, y: 365 },

    triangleTop: { x: 561, y: 378 },
    triangleLeft: { x: 516, y: 452 },
    triangleRight: { x: 606, y: 452 },

    label: {
      point: { x: 492, y: 323 },
      size: 36,
    } satisfies LabelBase,
  },

  inputLed: {
    anchor: { x: 811, y: 415 },

    topTerminal: { x: 811, y: 195 },
    bottomTerminal: { x: 811, y: 635 },

    triangleLeft: { x: 770, y: 365 },
    triangleRight: { x: 852, y: 365 },
    triangleTip: { x: 811, y: 445 },

    plateLeft: { x: 770, y: 445 },
    plateRight: { x: 852, y: 445 },

    label: {
      point: { x: 750, y: 323 },
      size: 40,
    } satisfies LabelBase,
  },

  opticalSignal: {
    anchor: { x: 953, y: 455 },

    upper: {
      start: { x: 921, y: 390 },
      end: { x: 986, y: 455 },
    },

    lower: {
      start: { x: 921, y: 455 },
      end: { x: 986, y: 520 },
    },

    arrowHeadLength: 26,
  },

  outputRail: {
    anchor: { x: 1345, y: 415 },

    topStart: { x: 1135, y: 120 },
    topEnd: { x: 1555, y: 120 },

    bottomStart: { x: 1135, y: 710 },
    bottomEnd: { x: 1555, y: 710 },

    topOutputNode: { x: 1555, y: 120 },
    bottomOutputNode: { x: 1555, y: 710 },

    label: {
      point: { x: 1630, y: 425 },
      size: 54,
      rotate: -90,
    } satisfies LabelBase,
  },

  phototriac: {
    anchor: { x: 1135, y: 420 },

    topLeadStart: { x: 1135, y: 120 },

    upperResistor: {
      start: { x: 1135, y: 155 },
      end: { x: 1135, y: 305 },
      amplitude: 26,
      segments: 9,
    } satisfies ResistorBase,

    upperLeadEnd: { x: 1135, y: 375 },

    symbolCenter: { x: 1135, y: 420 },

    lowerLeadStart: { x: 1135, y: 465 },
    middleNode: { x: 1135, y: 508 },

    lowerResistor: {
      start: { x: 1135, y: 508 },
      end: { x: 1135, y: 710 },
      amplitude: 26,
      segments: 9,
    } satisfies ResistorBase,

    label: {
      point: { x: 1020, y: 343 },
      size: 36,
    } satisfies LabelBase,

    upperResistorLabel: {
      point: { x: 1074, y: 200 },
      size: 40,
    } satisfies LabelBase,

    lowerResistorLabel: {
      point: { x: 1076, y: 602 },
      size: 40,
    } satisfies LabelBase,
  },

  triac: {
    anchor: { x: 1427, y: 420 },

    topLeadStart: { x: 1427, y: 120 },
    topLeadEnd: { x: 1427, y: 375 },

    symbolCenter: { x: 1427, y: 420 },

    bottomLeadStart: { x: 1427, y: 465 },
    bottomLeadEnd: { x: 1427, y: 710 },

    gateTerminal: { x: 1390, y: 455 },

    label: {
      point: { x: 1362, y: 373 },
      size: 40,
    } satisfies LabelBase,
  },

  acPilotLight: {
    anchor: { x: 1810, y: 120 },

    leftTerminal: { x: 1745, y: 120 },
    rightTerminal: { x: 1875, y: 120 },

    lampCenter: { x: 1810, y: 120 },

    label: {
      point: { x: 1810, y: 48 },
      size: 30,
    } satisfies LabelBase,
  },

  acSource: {
    anchor: { x: 2070, y: 415 },

    topTerminal: { x: 2070, y: 120 },
    bottomTerminal: { x: 2070, y: 710 },

    circleCenter: { x: 2070, y: 415 },

    label: {
      point: { x: 2070, y: 570 },
      size: 34,
    } satisfies LabelBase,
  },

  title: {
    anchor: { x: 201, y: 812 },
    label: {
      point: { x: 201, y: 812 },
      size: 58,
      anchor: "start",
      color: COLORS.orange,
      weight: 900,
    } satisfies LabelBase,
  },
};

/* =========================================================
   COMPONENT TUNING CONTROLS
   ========================================================= */

export const COMPONENT = {
  frame: tune(),

  inputDcSource: tune({
    leftRight: INPUT_DC_SOURCE_OFFSET.x + INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_DC_SOURCE_OFFSET.y + INPUT_SIDE_GROUP_OFFSET.y,
  }),

  inputTerminal: tune({
    leftRight: INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_SIDE_GROUP_OFFSET.y,
  }),

  inputResistor: tune({
    leftRight: INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_SIDE_GROUP_OFFSET.y,
  }),

  inputNode: tune({
    leftRight: INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_SIDE_GROUP_OFFSET.y,
  }),

  inputDiode: tune({
    leftRight: INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_SIDE_GROUP_OFFSET.y,
  }),

  inputLed: tune({
    leftRight: INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_SIDE_GROUP_OFFSET.y,
  }),

  opticalSignal: tune(),

  outputRail: tune({
    leftRight: OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  phototriac: tune({
    leftRight: OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  triac: tune({
    leftRight: OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  acPilotLight: tune({
    leftRight: AC_PILOT_LIGHT_OFFSET.x + OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: AC_PILOT_LIGHT_OFFSET.y + OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  acSource: tune({
    leftRight: AC_SOURCE_OFFSET.x + OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: AC_SOURCE_OFFSET.y + OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  title: tune(),
  labels: tune(),
};

/* =========================================================
   WIRE ROUTING CONTROLS
   ========================================================= */

export const WIRE_ROUTE_CONTROL: Record<string, WireRouteControl> = {
  inputDcSourcePositiveToInputPositive: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  inputNegativeToInputDcSourceNegative: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  inputPositiveToResistor: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  resistorToInputJunction: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  inputJunctionToDiodeTop: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  inputJunctionToLedTop: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  inputNegativeToDiodeBottom: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  diodeBottomToLedBottom: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  outputTopRail: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  outputTopEndToOutputNode: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  outputBottomRail: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  outputBottomEndToOutputNode: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  phototriacTopLead: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  phototriacUpperLead: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  phototriacLowerLead: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  phototriacMiddleToLowerResistor: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  phototriacToTriacGate: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [{ x: 203, y: 0 }],
  },

  triacTopLead: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  triacBottomLead: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  outputTopToAcPilotLight: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  acPilotLightToAcSourceTop: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },

  acSourceBottomToOutputBottom: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
    bendOffsets: [],
  },
};

/* =========================================================
   TRANSFORM HELPERS
   ========================================================= */

function addOffset(point: Point, offset: Point): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function transformComponentPoint(
  point: Point,
  anchor: Point,
  control: ComponentTune,
): Point {
  const scaleX = CIRCUIT_COMPONENT_SCALE * control.scale * control.widthScale;
  const scaleY = CIRCUIT_COMPONENT_SCALE * control.scale * control.heightScale;

  const localX = (point.x - anchor.x) * scaleX;
  const localY = (point.y - anchor.y) * scaleY;

  const angle = (control.rotate * Math.PI) / 180;

  const rotatedX = localX * Math.cos(angle) - localY * Math.sin(angle);
  const rotatedY = localX * Math.sin(angle) + localY * Math.cos(angle);

  return {
    x: anchor.x + rotatedX + COMPONENT_OFFSET.x + control.leftRight,
    y: anchor.y + rotatedY + COMPONENT_OFFSET.y + control.upDown,
  };
}

function controlledComponentPoint(
  point: Point,
  anchor: Point,
  control: ComponentTune,
  localOffset: Point,
): Point {
  return transformComponentPoint(
    addOffset(point, localOffset),
    anchor,
    control,
  );
}

function componentValue(value: number, control: ComponentTune): number {
  return value * CIRCUIT_COMPONENT_SCALE * control.scale;
}

function wirePoint(point: Point): Point {
  return {
    x: point.x + WIRE_OFFSET.x,
    y: point.y + WIRE_OFFSET.y,
  };
}

function pointsToPath(points: Point[]): string {
  return points
    .map((point, index) => {
      const p = wirePoint(point);
      return `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    })
    .join(" ");
}

function controlledWireRoute(
  start: Point,
  end: Point,
  control: WireRouteControl,
): Point[] {
  const controlledStart = addOffset(start, control.startOffset);
  const controlledEnd = addOffset(end, control.endOffset);

  const bendPoints = control.bendOffsets.map((offset) => ({
    x: controlledStart.x + offset.x,
    y: controlledStart.y + offset.y,
  }));

  return [controlledStart, ...bendPoints, controlledEnd];
}

function getMidPoint(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function reversePoints(points: Point[]): Point[] {
  return [...points].reverse();
}

function getZigZagPoints({
  start,
  end,
  amplitude,
  segments,
}: {
  start: Point;
  end: Point;
  amplitude: number;
  segments: number;
}): Point[] {
  const safeSegments = Math.max(2, Math.round(segments));
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;

  const unitX = dx / length;
  const unitY = dy / length;

  const perpX = -unitY;
  const perpY = unitX;

  return Array.from({ length: safeSegments + 1 }, (_, index) => {
    const t = index / safeSegments;

    const base = {
      x: start.x + dx * t,
      y: start.y + dy * t,
    };

    if (index === 0 || index === safeSegments) return base;

    const direction = index % 2 === 0 ? 1 : -1;

    return {
      x: base.x + perpX * amplitude * direction,
      y: base.y + perpY * amplitude * direction,
    };
  });
}

function flowColor(flowType: FlowType): string {
  if (flowType === "input") return COLORS.input;
  if (flowType === "optical") return COLORS.optical;
  if (flowType === "gate") return COLORS.gate;
  if (flowType === "output") return COLORS.output;
  return COLORS.wire;
}

function softFill(flowType: FlowType): string {
  if (flowType === "input") return COLORS.inputSoft;
  if (flowType === "optical") return COLORS.opticalSoft;
  if (flowType === "gate") return COLORS.gateSoft;
  if (flowType === "output") return COLORS.outputSoft;
  return COLORS.white;
}

/* =========================================================
   SIMULATION HELPERS
   ========================================================= */

function getTimelineStep(step: number): TimelineStep {
  return TIMELINE_STEPS.find((item) => item.step === step) ?? TIMELINE_STEPS[0];
}

function getDerivedSimulationState(
  control: SimulationControlState,
): SimulationDerivedState {
  if (control.mode === "onOff") {
    const isOn = control.onOffActive;

    return {
      ...control,

      inputDcSourceActive: isOn,
      inputDcActive: isOn,
      inputSourceWireActive: isOn,
      inputCurrentActive: isOn,
      inputResistorActive: isOn,
      inputDiodeActive: isOn,
      inputLedOn: isOn,
      inputReturnActive: isOn,

      opticalSignalActive: isOn,

      phototriacOn: isOn,
      triacGateActive: isOn,
      triacOn: isOn,

      acSourceActive: isOn,
      acPilotLightOn: isOn,
      acOutputCurrentActive: isOn,
      circuitOn: isOn,

      currentStepTitle: isOn ? "DC-to-AC SSR ON" : "DC-to-AC SSR OFF",
      currentStepExplanation: isOn
        ? "Input DC Source powers the input LED. The optical signal triggers the phototriac, the TRIAC gate is triggered, the main TRIAC turns ON, and AC current powers the AC Pilot Light."
        : "Input DC Source is inactive. No input current, no optical signal, no TRIAC conduction, and no AC pilot light current.",
      currentFlowDirection: isOn
        ? "Input DC Source + → R → LED → Input DC Source −. AC Source ↔ AC Pilot Light ↔ SSR Output ↔ TRIAC ↔ AC Source."
        : "No current flow.",
    };
  }

  const step = control.timelineStep;
  const timelineStep = getTimelineStep(step);

  const inputDcSourceActive = step >= 1;
  const inputDcActive = step >= 1;
  const inputSourceWireActive = step >= 1;
  const inputCurrentActive = step >= 2;
  const inputResistorActive = step >= 2;
  const inputDiodeActive = step >= 2;
  const inputLedOn = step >= 3;
  const inputReturnActive = step >= 3;

  const opticalSignalActive = step >= 4;

  const phototriacOn = step >= 5;
  const triacGateActive = step >= 6;
  const triacOn = step >= 7;

  const acOutputCurrentActive = step >= 8;
  const acSourceActive = step >= 8;
  const acPilotLightOn = step >= 8;

  return {
    ...control,

    inputDcSourceActive,
    inputDcActive,
    inputSourceWireActive,
    inputCurrentActive,
    inputResistorActive,
    inputDiodeActive,
    inputLedOn,
    inputReturnActive,

    opticalSignalActive,

    phototriacOn,
    triacGateActive,
    triacOn,

    acSourceActive,
    acPilotLightOn,
    acOutputCurrentActive,
    circuitOn: acOutputCurrentActive,

    currentStepTitle: timelineStep.title,
    currentStepExplanation: timelineStep.explanation,
    currentFlowDirection: timelineStep.currentFlowDirection,
  };
}

/* =========================================================
   CIRCUIT POINTS
   ========================================================= */

function getControlledInputDcSourcePoint(point: Point, offset: Point): Point {
  return controlledComponentPoint(
    point,
    BASE_COMPONENT.inputDcSource.anchor,
    COMPONENT.inputDcSource,
    offset,
  );
}

function getCircuitPoints() {
  const tInput = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.inputTerminal.anchor,
      COMPONENT.inputTerminal,
      offset,
    );

  const tResistor = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.inputResistor.anchor,
      COMPONENT.inputResistor,
      offset,
    );

  const tNode = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.inputNode.anchor,
      COMPONENT.inputNode,
      offset,
    );

  const tDiode = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.inputDiode.anchor,
      COMPONENT.inputDiode,
      offset,
    );

  const tLed = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.inputLed.anchor,
      COMPONENT.inputLed,
      offset,
    );

  const tOutput = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.outputRail.anchor,
      COMPONENT.outputRail,
      offset,
    );

  const tPhotoTriac = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.phototriac.anchor,
      COMPONENT.phototriac,
      offset,
    );

  const tTriac = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.triac.anchor,
      COMPONENT.triac,
      offset,
    );

  const tAcPilotLight = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.acPilotLight.anchor,
      COMPONENT.acPilotLight,
      offset,
    );

  const tAcSource = (point: Point, offset: Point) =>
    controlledComponentPoint(
      point,
      BASE_COMPONENT.acSource.anchor,
      COMPONENT.acSource,
      offset,
    );

  return {
    inputDcSourceTop: getControlledInputDcSourcePoint(
      BASE_COMPONENT.inputDcSource.topTerminal,
      INPUT_DC_SOURCE_CONTROL.topTerminalOffset,
    ),

    inputDcSourceBottom: getControlledInputDcSourcePoint(
      BASE_COMPONENT.inputDcSource.bottomTerminal,
      INPUT_DC_SOURCE_CONTROL.bottomTerminalOffset,
    ),

    inputPositiveNode: tInput(
      BASE_COMPONENT.inputTerminal.positiveNode,
      INPUT_TERMINAL_CONTROL.positiveNodeOffset,
    ),

    inputNegativeNode: tInput(
      BASE_COMPONENT.inputTerminal.negativeNode,
      INPUT_TERMINAL_CONTROL.negativeNodeOffset,
    ),

    resistorStart: tResistor(
      BASE_COMPONENT.inputResistor.start,
      INPUT_RESISTOR_CONTROL.startOffset,
    ),

    resistorEnd: tResistor(
      BASE_COMPONENT.inputResistor.end,
      INPUT_RESISTOR_CONTROL.endOffset,
    ),

    inputJunction: tNode(
      BASE_COMPONENT.inputNode.junction,
      INPUT_NODE_CONTROL.junctionOffset,
    ),

    diodeTop: tDiode(
      BASE_COMPONENT.inputDiode.topTerminal,
      DIODE_CONTROL.topTerminalOffset,
    ),

    diodeBottom: tDiode(
      BASE_COMPONENT.inputDiode.bottomTerminal,
      DIODE_CONTROL.bottomTerminalOffset,
    ),

    ledTop: tLed(
      BASE_COMPONENT.inputLed.topTerminal,
      LED_CONTROL.topTerminalOffset,
    ),

    ledBottom: tLed(
      BASE_COMPONENT.inputLed.bottomTerminal,
      LED_CONTROL.bottomTerminalOffset,
    ),

    outputTopStart: tOutput(
      BASE_COMPONENT.outputRail.topStart,
      OUTPUT_RAIL_CONTROL.topStartOffset,
    ),

    outputTopEnd: tOutput(
      BASE_COMPONENT.outputRail.topEnd,
      OUTPUT_RAIL_CONTROL.topEndOffset,
    ),

    outputBottomStart: tOutput(
      BASE_COMPONENT.outputRail.bottomStart,
      OUTPUT_RAIL_CONTROL.bottomStartOffset,
    ),

    outputBottomEnd: tOutput(
      BASE_COMPONENT.outputRail.bottomEnd,
      OUTPUT_RAIL_CONTROL.bottomEndOffset,
    ),

    outputTopNode: tOutput(
      BASE_COMPONENT.outputRail.topOutputNode,
      OUTPUT_RAIL_CONTROL.topOutputNodeOffset,
    ),

    outputBottomNode: tOutput(
      BASE_COMPONENT.outputRail.bottomOutputNode,
      OUTPUT_RAIL_CONTROL.bottomOutputNodeOffset,
    ),

    phototriacTopLeadStart: tPhotoTriac(
      BASE_COMPONENT.phototriac.topLeadStart,
      PHOTOTRIAC_CONTROL.topLeadStartOffset,
    ),

    phototriacUpperResistorStart: tPhotoTriac(
      BASE_COMPONENT.phototriac.upperResistor.start,
      PHOTOTRIAC_CONTROL.upperResistorStartOffset,
    ),

    phototriacUpperResistorEnd: tPhotoTriac(
      BASE_COMPONENT.phototriac.upperResistor.end,
      PHOTOTRIAC_CONTROL.upperResistorEndOffset,
    ),

    phototriacUpperLeadEnd: tPhotoTriac(
      BASE_COMPONENT.phototriac.upperLeadEnd,
      PHOTOTRIAC_CONTROL.upperLeadEndOffset,
    ),

    phototriacLowerLeadStart: tPhotoTriac(
      BASE_COMPONENT.phototriac.lowerLeadStart,
      PHOTOTRIAC_CONTROL.lowerLeadStartOffset,
    ),

    phototriacMiddleNode: tPhotoTriac(
      BASE_COMPONENT.phototriac.middleNode,
      PHOTOTRIAC_CONTROL.middleNodeOffset,
    ),

    phototriacLowerResistorStart: tPhotoTriac(
      BASE_COMPONENT.phototriac.lowerResistor.start,
      PHOTOTRIAC_CONTROL.lowerResistorStartOffset,
    ),

    phototriacLowerResistorEnd: tPhotoTriac(
      BASE_COMPONENT.phototriac.lowerResistor.end,
      PHOTOTRIAC_CONTROL.lowerResistorEndOffset,
    ),

    triacTopLeadStart: tTriac(
      BASE_COMPONENT.triac.topLeadStart,
      TRIAC_CONTROL.topLeadStartOffset,
    ),

    triacTopLeadEnd: tTriac(
      BASE_COMPONENT.triac.topLeadEnd,
      TRIAC_CONTROL.topLeadEndOffset,
    ),

    triacBottomLeadStart: tTriac(
      BASE_COMPONENT.triac.bottomLeadStart,
      TRIAC_CONTROL.bottomLeadStartOffset,
    ),

    triacBottomLeadEnd: tTriac(
      BASE_COMPONENT.triac.bottomLeadEnd,
      TRIAC_CONTROL.bottomLeadEndOffset,
    ),

    triacGateTerminal: tTriac(
      BASE_COMPONENT.triac.gateTerminal,
      TRIAC_CONTROL.gateTerminalOffset,
    ),

    acPilotLightLeft: tAcPilotLight(
      BASE_COMPONENT.acPilotLight.leftTerminal,
      AC_PILOT_LIGHT_CONTROL.leftTerminalOffset,
    ),

    acPilotLightRight: tAcPilotLight(
      BASE_COMPONENT.acPilotLight.rightTerminal,
      AC_PILOT_LIGHT_CONTROL.rightTerminalOffset,
    ),

    acPilotLightCenter: tAcPilotLight(
      BASE_COMPONENT.acPilotLight.lampCenter,
      AC_PILOT_LIGHT_CONTROL.lampCenterOffset,
    ),

    acSourceTop: tAcSource(
      BASE_COMPONENT.acSource.topTerminal,
      AC_SOURCE_CONTROL.topTerminalOffset,
    ),

    acSourceBottom: tAcSource(
      BASE_COMPONENT.acSource.bottomTerminal,
      AC_SOURCE_CONTROL.bottomTerminalOffset,
    ),

    acSourceCenter: tAcSource(
      BASE_COMPONENT.acSource.circleCenter,
      AC_SOURCE_CONTROL.circleCenterOffset,
    ),
  };
}

/* =========================================================
   STRUCTURED WIRE SEGMENTS
   ========================================================= */

function getStructuredWireSegments(
  simulation: SimulationDerivedState,
): WireSegment[] {
  const p = getCircuitPoints();

  const framePoints = BASE_COMPONENT.frame.points.map((point) =>
    transformComponentPoint(
      point,
      BASE_COMPONENT.frame.anchor,
      COMPONENT.frame,
    ),
  );

  const outputTriggerActive =
    simulation.phototriacOn ||
    simulation.triacGateActive ||
    simulation.triacOn ||
    simulation.acOutputCurrentActive;

  return [
    {
      id: "outer-ssr-frame",
      points: framePoints,
      width: WIRE.width,
      active: false,
      flowType: "none",
    },

    {
      id: "input-dc-source-positive-to-input-positive",
      points: controlledWireRoute(
        p.inputDcSourceTop,
        p.inputPositiveNode,
        WIRE_ROUTE_CONTROL.inputDcSourcePositiveToInputPositive,
      ),
      active: simulation.inputSourceWireActive,
      flowType: "input",
    },

    {
      id: "input-negative-to-input-dc-source-negative",
      points: controlledWireRoute(
        p.inputNegativeNode,
        p.inputDcSourceBottom,
        WIRE_ROUTE_CONTROL.inputNegativeToInputDcSourceNegative,
      ),
      active: simulation.inputReturnActive,
      flowType: "input",
    },

    {
      id: "input-positive-to-resistor",
      points: controlledWireRoute(
        p.inputPositiveNode,
        p.resistorStart,
        WIRE_ROUTE_CONTROL.inputPositiveToResistor,
      ),
      active: simulation.inputCurrentActive,
      flowType: "input",
    },

    {
      id: "resistor-to-input-junction",
      points: controlledWireRoute(
        p.resistorEnd,
        p.inputJunction,
        WIRE_ROUTE_CONTROL.resistorToInputJunction,
      ),
      active: simulation.inputCurrentActive,
      flowType: "input",
    },

    {
      id: "input-junction-to-diode-top",
      points: controlledWireRoute(
        p.inputJunction,
        p.diodeTop,
        WIRE_ROUTE_CONTROL.inputJunctionToDiodeTop,
      ),
      active: simulation.inputDiodeActive,
      flowType: "input",
    },

    {
      id: "input-junction-to-led-top",
      points: controlledWireRoute(
        p.inputJunction,
        p.ledTop,
        WIRE_ROUTE_CONTROL.inputJunctionToLedTop,
      ),
      active: simulation.inputLedOn,
      flowType: "input",
    },

    {
      id: "input-negative-to-diode-bottom",
      points: controlledWireRoute(
        p.inputNegativeNode,
        p.diodeBottom,
        WIRE_ROUTE_CONTROL.inputNegativeToDiodeBottom,
      ),
      active: simulation.inputDiodeActive,
      flowType: "input",
    },

    {
      id: "diode-bottom-to-led-bottom",
      points: controlledWireRoute(
        p.diodeBottom,
        p.ledBottom,
        WIRE_ROUTE_CONTROL.diodeBottomToLedBottom,
      ),
      active: simulation.inputReturnActive,
      flowType: "input",
    },

    {
      id: "output-top-rail",
      points: controlledWireRoute(
        p.outputTopStart,
        p.outputTopEnd,
        WIRE_ROUTE_CONTROL.outputTopRail,
      ),
      active: outputTriggerActive,
      flowType: simulation.acOutputCurrentActive ? "output" : "gate",
    },

    {
      id: "output-top-end-to-output-node",
      points: controlledWireRoute(
        p.outputTopEnd,
        p.outputTopNode,
        WIRE_ROUTE_CONTROL.outputTopEndToOutputNode,
      ),
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },

    {
      id: "output-bottom-rail",
      points: controlledWireRoute(
        p.outputBottomStart,
        p.outputBottomEnd,
        WIRE_ROUTE_CONTROL.outputBottomRail,
      ),
      active: outputTriggerActive,
      flowType: simulation.acOutputCurrentActive ? "output" : "gate",
    },

    {
      id: "output-bottom-end-to-output-node",
      points: controlledWireRoute(
        p.outputBottomEnd,
        p.outputBottomNode,
        WIRE_ROUTE_CONTROL.outputBottomEndToOutputNode,
      ),
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },

    {
      id: "phototriac-top-lead",
      points: controlledWireRoute(
        p.phototriacTopLeadStart,
        p.phototriacUpperResistorStart,
        WIRE_ROUTE_CONTROL.phototriacTopLead,
      ),
      active: outputTriggerActive,
      flowType: "gate",
    },

    {
      id: "phototriac-upper-lead",
      points: controlledWireRoute(
        p.phototriacUpperResistorEnd,
        p.phototriacUpperLeadEnd,
        WIRE_ROUTE_CONTROL.phototriacUpperLead,
      ),
      active: simulation.phototriacOn || simulation.triacGateActive,
      flowType: "gate",
    },

    {
      id: "phototriac-lower-lead",
      points: controlledWireRoute(
        p.phototriacLowerLeadStart,
        p.phototriacMiddleNode,
        WIRE_ROUTE_CONTROL.phototriacLowerLead,
      ),
      active: simulation.phototriacOn || simulation.triacGateActive,
      flowType: "gate",
    },

    {
      id: "phototriac-middle-to-lower-resistor",
      points: controlledWireRoute(
        p.phototriacMiddleNode,
        p.phototriacLowerResistorStart,
        WIRE_ROUTE_CONTROL.phototriacMiddleToLowerResistor,
      ),
      active: simulation.triacGateActive,
      flowType: "gate",
    },

    {
      id: "phototriac-to-main-triac-gate",
      points: controlledWireRoute(
        p.phototriacMiddleNode,
        p.triacGateTerminal,
        WIRE_ROUTE_CONTROL.phototriacToTriacGate,
      ),
      active: simulation.triacGateActive,
      flowType: "gate",
    },

    {
      id: "triac-top-lead",
      points: controlledWireRoute(
        p.triacTopLeadStart,
        p.triacTopLeadEnd,
        WIRE_ROUTE_CONTROL.triacTopLead,
      ),
      active: simulation.triacOn || simulation.acOutputCurrentActive,
      flowType: "output",
    },

    {
      id: "triac-bottom-lead",
      points: controlledWireRoute(
        p.triacBottomLeadStart,
        p.triacBottomLeadEnd,
        WIRE_ROUTE_CONTROL.triacBottomLead,
      ),
      active: simulation.triacOn || simulation.acOutputCurrentActive,
      flowType: "output",
    },

    {
      id: "output-top-to-ac-pilot-light",
      points: controlledWireRoute(
        p.outputTopNode,
        p.acPilotLightLeft,
        WIRE_ROUTE_CONTROL.outputTopToAcPilotLight,
      ),
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },

    {
      id: "ac-pilot-light-to-ac-source-top",
      points: controlledWireRoute(
        p.acPilotLightRight,
        p.acSourceTop,
        WIRE_ROUTE_CONTROL.acPilotLightToAcSourceTop,
      ),
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },

    {
      id: "ac-source-bottom-to-output-bottom",
      points: controlledWireRoute(
        p.acSourceBottom,
        p.outputBottomNode,
        WIRE_ROUTE_CONTROL.acSourceBottomToOutputBottom,
      ),
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },
  ];
}

/* =========================================================
   CURRENT FLOW PATHS
   ========================================================= */

function getCurrentFlowPaths(
  simulation: SimulationDerivedState,
): CurrentFlowPath[] {
  const p = getCircuitPoints();

  const inputSourcePositive = controlledWireRoute(
    p.inputDcSourceTop,
    p.inputPositiveNode,
    WIRE_ROUTE_CONTROL.inputDcSourcePositiveToInputPositive,
  );

  const inputSourceNegative = controlledWireRoute(
    p.inputNegativeNode,
    p.inputDcSourceBottom,
    WIRE_ROUTE_CONTROL.inputNegativeToInputDcSourceNegative,
  );

  const inputResistorPath = getZigZagPoints({
    start: p.resistorStart,
    end: p.resistorEnd,
    amplitude:
      componentValue(
        BASE_COMPONENT.inputResistor.amplitude,
        COMPONENT.inputResistor,
      ) * INPUT_RESISTOR_CONTROL.amplitudeScale,
    segments:
      BASE_COMPONENT.inputResistor.segments +
      INPUT_RESISTOR_CONTROL.segmentOffset,
  });

  const phototriacUpperResistorPath = getZigZagPoints({
    start: p.phototriacUpperResistorStart,
    end: p.phototriacUpperResistorEnd,
    amplitude:
      componentValue(
        BASE_COMPONENT.phototriac.upperResistor.amplitude,
        COMPONENT.phototriac,
      ) * PHOTOTRIAC_CONTROL.upperResistorAmplitudeScale,
    segments:
      BASE_COMPONENT.phototriac.upperResistor.segments +
      PHOTOTRIAC_CONTROL.upperResistorSegmentOffset,
  });

  const phototriacLowerResistorPath = getZigZagPoints({
    start: p.phototriacLowerResistorStart,
    end: p.phototriacLowerResistorEnd,
    amplitude:
      componentValue(
        BASE_COMPONENT.phototriac.lowerResistor.amplitude,
        COMPONENT.phototriac,
      ) * PHOTOTRIAC_CONTROL.lowerResistorAmplitudeScale,
    segments:
      BASE_COMPONENT.phototriac.lowerResistor.segments +
      PHOTOTRIAC_CONTROL.lowerResistorSegmentOffset,
  });

  const phototriacGateWirePath = controlledWireRoute(
    p.phototriacMiddleNode,
    p.triacGateTerminal,
    WIRE_ROUTE_CONTROL.phototriacToTriacGate,
  );

  const phototriacMiddleToLowerResistorPath = controlledWireRoute(
    p.phototriacMiddleNode,
    p.phototriacLowerResistorStart,
    WIRE_ROUTE_CONTROL.phototriacMiddleToLowerResistor,
  );

  const outputTopToPilotLightPath = controlledWireRoute(
    p.outputTopNode,
    p.acPilotLightLeft,
    WIRE_ROUTE_CONTROL.outputTopToAcPilotLight,
  );

  const pilotLightToAcSourceTopPath = controlledWireRoute(
    p.acPilotLightRight,
    p.acSourceTop,
    WIRE_ROUTE_CONTROL.acPilotLightToAcSourceTop,
  );

  const acSourceBottomToOutputBottomPath = controlledWireRoute(
    p.acSourceBottom,
    p.outputBottomNode,
    WIRE_ROUTE_CONTROL.acSourceBottomToOutputBottom,
  );

  const acSourceTopToPilotLightPath = reversePoints(
    pilotLightToAcSourceTopPath,
  );

  const pilotLightToOutputTopPath = reversePoints(outputTopToPilotLightPath);

  const outputBottomToAcSourceBottomPath = reversePoints(
    acSourceBottomToOutputBottomPath,
  );

  const triacBodyMidPoint: Point = {
    x: p.triacTopLeadEnd.x,
    y: (p.triacTopLeadEnd.y + p.triacBottomLeadStart.y) / 2,
  };

  const triacConductionPath: Point[] = [
    p.triacTopLeadStart,
    p.triacTopLeadEnd,
    triacBodyMidPoint,
    p.triacBottomLeadStart,
    p.triacBottomLeadEnd,
  ];

  const acOutputForwardPath: Point[] = [
    ...acSourceTopToPilotLightPath,
    p.acPilotLightCenter,
    p.acPilotLightLeft,
    ...pilotLightToOutputTopPath.slice(1),
    p.triacTopLeadStart,
    ...triacConductionPath.slice(1),
    p.outputBottomNode,
    ...outputBottomToAcSourceBottomPath.slice(1),
  ];

  const acOutputReversePath = reversePoints(acOutputForwardPath);

  const gateTriggerPath: Point[] = [
    p.outputTopStart,
    p.phototriacTopLeadStart,
    p.phototriacUpperResistorStart,
    ...phototriacUpperResistorPath.slice(1),
    p.phototriacUpperLeadEnd,
    p.phototriacLowerLeadStart,
    p.phototriacMiddleNode,
    ...phototriacGateWirePath.slice(1),
  ];

  const gateReturnPath: Point[] = [
    p.phototriacMiddleNode,
    ...phototriacMiddleToLowerResistorPath.slice(1),
    ...phototriacLowerResistorPath.slice(1),
    p.outputBottomStart,
  ];

  return [
    {
      id: "input-source-positive-flow",
      points: inputSourcePositive,
      active: simulation.inputSourceWireActive,
      flowType: "input",
    },

    {
      id: "input-positive-to-resistor-flow",
      points: [p.inputPositiveNode, p.resistorStart],
      active: simulation.inputCurrentActive,
      flowType: "input",
    },

    {
      id: "input-resistor-flow",
      points: inputResistorPath,
      active: simulation.inputResistorActive,
      flowType: "input",
    },

    {
      id: "input-led-positive-flow",
      points: [p.resistorEnd, p.inputJunction, p.ledTop],
      active: simulation.inputLedOn,
      flowType: "input",
    },

    {
      id: "input-led-body-flow",
      points: [p.ledTop, p.ledBottom],
      active: simulation.inputLedOn,
      flowType: "input",
    },

    {
      id: "input-led-return-flow",
      points: [p.ledBottom, p.diodeBottom, p.inputNegativeNode],
      active: simulation.inputReturnActive,
      flowType: "input",
    },

    {
      id: "input-source-negative-return-flow",
      points: inputSourceNegative,
      active: simulation.inputReturnActive,
      flowType: "input",
    },

    {
      id: "optical-upper-flow",
      points: [
        transformComponentPoint(
          addOffset(
            BASE_COMPONENT.opticalSignal.upper.start,
            OPTICAL_SIGNAL_CONTROL.upperStartOffset,
          ),
          BASE_COMPONENT.opticalSignal.anchor,
          COMPONENT.opticalSignal,
        ),
        transformComponentPoint(
          addOffset(
            BASE_COMPONENT.opticalSignal.upper.end,
            OPTICAL_SIGNAL_CONTROL.upperEndOffset,
          ),
          BASE_COMPONENT.opticalSignal.anchor,
          COMPONENT.opticalSignal,
        ),
      ],
      active: simulation.opticalSignalActive,
      flowType: "optical",
    },

    {
      id: "optical-lower-flow",
      points: [
        transformComponentPoint(
          addOffset(
            BASE_COMPONENT.opticalSignal.lower.start,
            OPTICAL_SIGNAL_CONTROL.lowerStartOffset,
          ),
          BASE_COMPONENT.opticalSignal.anchor,
          COMPONENT.opticalSignal,
        ),
        transformComponentPoint(
          addOffset(
            BASE_COMPONENT.opticalSignal.lower.end,
            OPTICAL_SIGNAL_CONTROL.lowerEndOffset,
          ),
          BASE_COMPONENT.opticalSignal.anchor,
          COMPONENT.opticalSignal,
        ),
      ],
      active: simulation.opticalSignalActive,
      flowType: "optical",
    },

    {
      id: "triac-gate-trigger-flow",
      points: gateTriggerPath,
      active: simulation.triacGateActive,
      flowType: "gate",
    },

    {
      id: "phototriac-gate-return-flow",
      points: gateReturnPath,
      active: simulation.triacGateActive,
      flowType: "gate",
    },

    {
      id: "ac-output-forward-through-triac-flow",
      points: acOutputForwardPath,
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },

    {
      id: "ac-output-reverse-through-triac-flow",
      points: acOutputReversePath,
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },
  ];
}

/* =========================================================
   REUSABLE SVG BLOCKS
   ========================================================= */

function WirePath({
  points,
  width = WIRE.width,
  color = WIRE.color,
}: {
  points: Point[];
  width?: number;
  color?: string;
}) {
  return (
    <path
      d={pointsToPath(points)}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap={PATH.strokeLinecap}
      strokeLinejoin={PATH.strokeLinejoin}
    />
  );
}

function NodeDot({
  point,
  radius = NODE.radius,
  color = NODE.color,
}: {
  point: Point;
  radius?: number;
  color?: string;
}) {
  const p = wirePoint(point);
  return <circle cx={p.x} cy={p.y} r={radius} fill={color} />;
}

function CurrentFlowDots({ path }: { path: CurrentFlowPath }) {
  const reactId = React.useId().replace(/:/g, "");
  const motionPathId = `motion-${reactId}-${path.id}`;

  if (!CURRENT_DOT_CONTROL.enabled || !path.active) return null;

  const d = pointsToPath(path.points);
  const color = flowColor(path.flowType);
  const duration = CURRENT_DOT_CONTROL.speedSeconds[path.flowType];

  return (
    <g>
      <path id={motionPathId} d={d} fill="none" stroke="none" />

      {Array.from({ length: CURRENT_DOT_CONTROL.count }, (_, index) => {
        const delay = -(duration / CURRENT_DOT_CONTROL.count) * index;

        return (
          <circle
            key={`${path.id}-dot-${index}`}
            r={CURRENT_DOT_CONTROL.radius}
            fill={color}
            opacity={0.9}
          >
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
            >
              <mpath href={`#${motionPathId}`} xlinkHref={`#${motionPathId}`} />
            </animateMotion>
          </circle>
        );
      })}
    </g>
  );
}

function RawPlusSymbol({
  center,
  size,
  color = WIRE.color,
}: {
  center: Point;
  size: number;
  color?: string;
}) {
  const half = size / 2;

  return (
    <>
      <WirePath
        points={[
          { x: center.x - half, y: center.y },
          { x: center.x + half, y: center.y },
        ]}
        color={color}
      />
      <WirePath
        points={[
          { x: center.x, y: center.y - half },
          { x: center.x, y: center.y + half },
        ]}
        color={color}
      />
    </>
  );
}

function RawMinusSymbol({
  center,
  size,
  color = WIRE.color,
}: {
  center: Point;
  size: number;
  color?: string;
}) {
  const half = size / 2;

  return (
    <WirePath
      points={[
        { x: center.x - half, y: center.y },
        { x: center.x + half, y: center.y },
      ]}
      color={color}
    />
  );
}

function LabelText({
  label,
  control,
  anchorPoint,
  offset = { x: 0, y: 0 },
  fill,
  children,
}: {
  label: LabelBase;
  control: ComponentTune;
  anchorPoint: Point;
  offset?: Point;
  fill?: string;
  children: React.ReactNode;
}) {
  const point = transformComponentPoint(
    addOffset(label.point, offset),
    anchorPoint,
    control,
  );

  const rotate = (label.rotate ?? 0) + control.rotate;

  return (
    <text
      x={point.x}
      y={point.y}
      fill={fill ?? label.color ?? LABEL.color}
      fontFamily={LABEL.family}
      fontSize={label.size}
      fontWeight={label.weight ?? LABEL.weight}
      textAnchor={label.anchor ?? "middle"}
      dominantBaseline="middle"
      transform={rotate ? `rotate(${rotate} ${point.x} ${point.y})` : undefined}
    >
      {children}
    </text>
  );
}

function PlusSymbol({
  center,
  size,
  control,
  anchorPoint,
  offset = { x: 0, y: 0 },
  color = WIRE.color,
}: {
  center: Point;
  size: number;
  control: ComponentTune;
  anchorPoint: Point;
  offset?: Point;
  color?: string;
}) {
  const adjustedCenter = addOffset(center, offset);
  const half = size / 2;

  const left = transformComponentPoint(
    { x: adjustedCenter.x - half, y: adjustedCenter.y },
    anchorPoint,
    control,
  );
  const right = transformComponentPoint(
    { x: adjustedCenter.x + half, y: adjustedCenter.y },
    anchorPoint,
    control,
  );
  const top = transformComponentPoint(
    { x: adjustedCenter.x, y: adjustedCenter.y - half },
    anchorPoint,
    control,
  );
  const bottom = transformComponentPoint(
    { x: adjustedCenter.x, y: adjustedCenter.y + half },
    anchorPoint,
    control,
  );

  return (
    <>
      <WirePath points={[left, right]} color={color} />
      <WirePath points={[top, bottom]} color={color} />
    </>
  );
}

function MinusSymbol({
  center,
  size,
  control,
  anchorPoint,
  offset = { x: 0, y: 0 },
  color = WIRE.color,
}: {
  center: Point;
  size: number;
  control: ComponentTune;
  anchorPoint: Point;
  offset?: Point;
  color?: string;
}) {
  const adjustedCenter = addOffset(center, offset);
  const half = size / 2;

  const left = transformComponentPoint(
    { x: adjustedCenter.x - half, y: adjustedCenter.y },
    anchorPoint,
    control,
  );
  const right = transformComponentPoint(
    { x: adjustedCenter.x + half, y: adjustedCenter.y },
    anchorPoint,
    control,
  );

  return <WirePath points={[left, right]} color={color} />;
}

function ResistorBetweenPoints({
  start,
  end,
  amplitude,
  segments,
  active = false,
  flowType = "none",
}: {
  start: Point;
  end: Point;
  amplitude: number;
  segments: number;
  active?: boolean;
  flowType?: FlowType;
}) {
  return (
    <WirePath
      points={getZigZagPoints({
        start,
        end,
        amplitude,
        segments,
      })}
      width={active ? WIRE.activeWidth : WIRE.symbolWidth}
      color={active ? flowColor(flowType) : WIRE.color}
    />
  );
}

/* =========================================================
   INPUT DC SOURCE SYMBOL
   ========================================================= */

function InputDcSourceSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.inputDcSource;
  const control = COMPONENT.inputDcSource;
  const color = active ? COLORS.input : WIRE.color;

  const top = getControlledInputDcSourcePoint(
    base.topTerminal,
    INPUT_DC_SOURCE_CONTROL.topTerminalOffset,
  );

  const bottom = getControlledInputDcSourcePoint(
    base.bottomTerminal,
    INPUT_DC_SOURCE_CONTROL.bottomTerminalOffset,
  );

  const longPlateCenter = getControlledInputDcSourcePoint(
    base.longPlate.center,
    INPUT_DC_SOURCE_CONTROL.longPlateOffset,
  );

  const shortPlateCenter = getControlledInputDcSourcePoint(
    base.shortPlate.center,
    INPUT_DC_SOURCE_CONTROL.shortPlateOffset,
  );

  const longHalf =
    base.longPlate.halfWidth *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.widthScale;

  const shortHalf =
    base.shortPlate.halfWidth *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.widthScale;

  const plusSymbolCenter = getControlledInputDcSourcePoint(
    base.plusSymbol.center,
    INPUT_DC_SOURCE_CONTROL.plusSymbolOffset,
  );

  const minusSymbolCenter = getControlledInputDcSourcePoint(
    base.minusSymbol.center,
    INPUT_DC_SOURCE_CONTROL.minusSymbolOffset,
  );

  return (
    <>
      <WirePath points={[top, longPlateCenter]} color={color} />

      <WirePath
        points={[
          { x: longPlateCenter.x - longHalf, y: longPlateCenter.y },
          { x: longPlateCenter.x + longHalf, y: longPlateCenter.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePath
        points={[
          { x: shortPlateCenter.x - shortHalf, y: shortPlateCenter.y },
          { x: shortPlateCenter.x + shortHalf, y: shortPlateCenter.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePath points={[shortPlateCenter, bottom]} color={color} />

      <RawPlusSymbol
        center={plusSymbolCenter}
        size={INPUT_DC_SOURCE_CONTROL.plusSymbolSize}
        color={color}
      />

      <RawMinusSymbol
        center={minusSymbolCenter}
        size={INPUT_DC_SOURCE_CONTROL.minusSymbolSize}
        color={color}
      />
    </>
  );
}

/* =========================================================
   INPUT DIODE SYMBOL
   Fixed: no internal wire passes through diode triangle.
   ========================================================= */

function InputDiodeSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.inputDiode;
  const control = COMPONENT.inputDiode;
  const color = active ? COLORS.input : WIRE.color;

  const t = (point: Point, offset: Point) =>
    controlledComponentPoint(point, base.anchor, control, offset);

  const top = t(base.topTerminal, DIODE_CONTROL.topTerminalOffset);
  const bottom = t(base.bottomTerminal, DIODE_CONTROL.bottomTerminalOffset);

  const plateLeft = t(base.plateLeft, DIODE_CONTROL.plateLeftOffset);
  const plateRight = t(base.plateRight, DIODE_CONTROL.plateRightOffset);
  const plateCenter = getMidPoint(plateLeft, plateRight);

  const triangleTop = t(base.triangleTop, DIODE_CONTROL.triangleTopOffset);
  const triangleLeft = t(base.triangleLeft, DIODE_CONTROL.triangleLeftOffset);
  const triangleRight = t(
    base.triangleRight,
    DIODE_CONTROL.triangleRightOffset,
  );
  const triangleBaseCenter = getMidPoint(triangleLeft, triangleRight);

  return (
    <>
      <WirePath points={[top, plateCenter]} color={color} />

      <WirePath
        points={[plateLeft, plateRight]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <path
        d={`
          M ${triangleTop.x} ${triangleTop.y}
          L ${triangleLeft.x} ${triangleLeft.y}
          L ${triangleRight.x} ${triangleRight.y}
          Z
        `}
        fill={COLORS.symbolFill}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
        strokeLinejoin={PATH.strokeLinejoin}
      />

      <WirePath points={[triangleBaseCenter, bottom]} color={color} />
    </>
  );
}

/* =========================================================
   INPUT LED SYMBOL
   ========================================================= */

function InputLedSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.inputLed;
  const control = COMPONENT.inputLed;
  const color = active ? COLORS.input : WIRE.color;

  const t = (point: Point, offset: Point) =>
    controlledComponentPoint(point, base.anchor, control, offset);

  const top = t(base.topTerminal, LED_CONTROL.topTerminalOffset);
  const bottom = t(base.bottomTerminal, LED_CONTROL.bottomTerminalOffset);

  const triangleLeft = t(base.triangleLeft, LED_CONTROL.triangleLeftOffset);
  const triangleRight = t(base.triangleRight, LED_CONTROL.triangleRightOffset);
  const triangleTip = t(base.triangleTip, LED_CONTROL.triangleTipOffset);
  const triangleBaseCenter = getMidPoint(triangleLeft, triangleRight);

  const plateLeft = t(base.plateLeft, LED_CONTROL.plateLeftOffset);
  const plateRight = t(base.plateRight, LED_CONTROL.plateRightOffset);
  const plateCenter = getMidPoint(plateLeft, plateRight);

  return (
    <>
      <WirePath points={[top, triangleBaseCenter]} color={color} />

      <path
        d={`
          M ${triangleLeft.x} ${triangleLeft.y}
          L ${triangleRight.x} ${triangleRight.y}
          L ${triangleTip.x} ${triangleTip.y}
          Z
        `}
        fill={COLORS.symbolFill}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
        strokeLinejoin={PATH.strokeLinejoin}
      />

      <WirePath
        points={[plateLeft, plateRight]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePath points={[plateCenter, bottom]} color={color} />
    </>
  );
}

/* =========================================================
   OPTICAL SIGNAL
   ========================================================= */

function OpticalArrow({
  start,
  end,
  startOffset,
  endOffset,
  active,
}: {
  start: Point;
  end: Point;
  startOffset: Point;
  endOffset: Point;
  active: boolean;
}) {
  const control = COMPONENT.opticalSignal;
  const anchor = BASE_COMPONENT.opticalSignal.anchor;

  const s = transformComponentPoint(
    addOffset(start, startOffset),
    anchor,
    control,
  );
  const e = transformComponentPoint(addOffset(end, endOffset), anchor, control);

  const head = componentValue(
    BASE_COMPONENT.opticalSignal.arrowHeadLength +
      OPTICAL_SIGNAL_CONTROL.arrowHeadLengthOffset,
    control,
  );

  const color = active ? COLORS.optical : WIRE.color;

  return (
    <>
      <WirePath points={[s, e]} width={WIRE.symbolWidth} color={color} />

      <WirePath
        points={[e, { x: e.x - head, y: e.y - 2 }]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePath
        points={[e, { x: e.x - 4, y: e.y - head }]}
        width={WIRE.symbolWidth}
        color={color}
      />
    </>
  );
}

/* =========================================================
   TRIAC / PHOTOTRIAC SYMBOL
   ========================================================= */

function TriacLikeSymbol({
  center,
  control,
  anchorPoint,
  symbolScale = 1,
  active = false,
  flowType = "gate",
}: {
  center: Point;
  control: ComponentTune;
  anchorPoint: Point;
  symbolScale?: number;
  active?: boolean;
  flowType?: FlowType;
}) {
  const color = active ? flowColor(flowType) : WIRE.color;

  const topY = center.y - 45 * symbolScale;
  const bottomY = center.y + 45 * symbolScale;

  const barHalf = 58 * symbolScale;
  const triW = 42 * symbolScale;
  const triH = 70 * symbolScale;

  const t = (point: Point) =>
    transformComponentPoint(point, anchorPoint, control);

  const topLeft = t({ x: center.x - barHalf, y: topY });
  const topRight = t({ x: center.x + barHalf, y: topY });
  const bottomLeft = t({ x: center.x - barHalf, y: bottomY });
  const bottomRight = t({ x: center.x + barHalf, y: bottomY });

  const leftTriA = t({
    x: center.x - triW,
    y: topY + 12 * symbolScale,
  });
  const leftTriB = t({
    x: center.x - 3 * symbolScale,
    y: topY + 12 * symbolScale,
  });
  const leftTriC = t({
    x: center.x - triW / 2,
    y: topY + triH,
  });

  const rightTriA = t({
    x: center.x + 3 * symbolScale,
    y: bottomY - 12 * symbolScale,
  });
  const rightTriB = t({
    x: center.x + triW,
    y: bottomY - 12 * symbolScale,
  });
  const rightTriC = t({
    x: center.x + triW / 2,
    y: bottomY - triH,
  });

  return (
    <>
      <WirePath
        points={[topLeft, topRight]}
        width={WIRE.symbolWidth}
        color={color}
      />
      <WirePath
        points={[bottomLeft, bottomRight]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <path
        d={`
          M ${leftTriA.x} ${leftTriA.y}
          L ${leftTriB.x} ${leftTriB.y}
          L ${leftTriC.x} ${leftTriC.y}
          Z
        `}
        fill={COLORS.symbolFill}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
        strokeLinejoin={PATH.strokeLinejoin}
      />

      <path
        d={`
          M ${rightTriA.x} ${rightTriA.y}
          L ${rightTriB.x} ${rightTriB.y}
          L ${rightTriC.x} ${rightTriC.y}
          Z
        `}
        fill={COLORS.symbolFill}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
        strokeLinejoin={PATH.strokeLinejoin}
      />
    </>
  );
}

/* =========================================================
   EXTERNAL AC PILOT LIGHT SYMBOL
   ========================================================= */

function AcPilotLightSymbol({ active }: { active: boolean }) {
  const p = getCircuitPoints();
  const color = active ? COLORS.output : WIRE.color;

  const radius = componentValue(
    AC_PILOT_LIGHT_CONTROL.lampRadius,
    COMPONENT.acPilotLight,
  );

  const crossHalf = componentValue(
    AC_PILOT_LIGHT_CONTROL.crossSize / 2,
    COMPONENT.acPilotLight,
  );

  const lampCenter = addOffset(
    p.acPilotLightCenter,
    AC_PILOT_LIGHT_CONTROL.crossOffset,
  );

  return (
    <>
      <WirePath
        points={[
          p.acPilotLightLeft,
          { x: lampCenter.x - radius, y: lampCenter.y },
        ]}
        color={color}
      />

      <circle
        cx={lampCenter.x}
        cy={lampCenter.y}
        r={radius}
        fill={COLORS.symbolFill}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
      />

      <WirePath
        points={[
          { x: lampCenter.x - crossHalf, y: lampCenter.y - crossHalf },
          { x: lampCenter.x + crossHalf, y: lampCenter.y + crossHalf },
        ]}
        width={WIRE.thinWidth}
        color={color}
      />

      <WirePath
        points={[
          { x: lampCenter.x - crossHalf, y: lampCenter.y + crossHalf },
          { x: lampCenter.x + crossHalf, y: lampCenter.y - crossHalf },
        ]}
        width={WIRE.thinWidth}
        color={color}
      />

      <WirePath
        points={[
          { x: lampCenter.x + radius, y: lampCenter.y },
          p.acPilotLightRight,
        ]}
        color={color}
      />
    </>
  );
}

/* =========================================================
   EXTERNAL AC SOURCE SYMBOL
   ========================================================= */

function AcSourceSymbol({ active }: { active: boolean }) {
  const p = getCircuitPoints();
  const color = active ? COLORS.output : WIRE.color;

  const radius = componentValue(
    AC_SOURCE_CONTROL.circleRadius,
    COMPONENT.acSource,
  );

  const waveWidth = componentValue(
    AC_SOURCE_CONTROL.waveWidth,
    COMPONENT.acSource,
  );

  const waveHeight = componentValue(
    AC_SOURCE_CONTROL.waveHeight,
    COMPONENT.acSource,
  );

  const center = addOffset(p.acSourceCenter, AC_SOURCE_CONTROL.waveOffset);

  const waveStart = {
    x: center.x - waveWidth / 2,
    y: center.y,
  };

  const waveMid = {
    x: center.x,
    y: center.y,
  };

  const waveEnd = {
    x: center.x + waveWidth / 2,
    y: center.y,
  };

  return (
    <>
      <WirePath
        points={[
          p.acSourceTop,
          { x: p.acSourceCenter.x, y: p.acSourceCenter.y - radius },
        ]}
        color={color}
      />

      <circle
        cx={p.acSourceCenter.x}
        cy={p.acSourceCenter.y}
        r={radius}
        fill={COLORS.symbolFill}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
      />

      <path
        d={`
          M ${waveStart.x} ${waveStart.y}
          C ${waveStart.x + waveWidth * 0.18} ${waveStart.y - waveHeight},
            ${waveStart.x + waveWidth * 0.32} ${waveStart.y - waveHeight},
            ${waveMid.x} ${waveMid.y}
          C ${waveStart.x + waveWidth * 0.68} ${waveStart.y + waveHeight},
            ${waveStart.x + waveWidth * 0.82} ${waveStart.y + waveHeight},
            ${waveEnd.x} ${waveEnd.y}
        `}
        fill="none"
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
        strokeLinecap={PATH.strokeLinecap}
      />

      <WirePath
        points={[
          { x: p.acSourceCenter.x, y: p.acSourceCenter.y + radius },
          p.acSourceBottom,
        ]}
        color={color}
      />
    </>
  );
}

/* =========================================================
   CIRCUIT GROUPS
   ========================================================= */

function CircuitWires({ simulation }: { simulation: SimulationDerivedState }) {
  return (
    <>
      {getStructuredWireSegments(simulation).map((wire) => (
        <WirePath
          key={wire.id}
          points={wire.points}
          width={wire.active ? WIRE.activeWidth : (wire.width ?? WIRE.width)}
          color={wire.active ? flowColor(wire.flowType) : WIRE.color}
        />
      ))}
    </>
  );
}

function CircuitInputSymbols({
  simulation,
}: {
  simulation: SimulationDerivedState;
}) {
  const p = getCircuitPoints();

  return (
    <>
      <InputDcSourceSymbol active={simulation.inputDcSourceActive} />

      <PlusSymbol
        center={BASE_COMPONENT.inputTerminal.plus.center}
        size={BASE_COMPONENT.inputTerminal.plus.size}
        control={COMPONENT.inputTerminal}
        anchorPoint={BASE_COMPONENT.inputTerminal.anchor}
        offset={INPUT_TERMINAL_CONTROL.plusSymbolOffset}
        color={simulation.inputDcActive ? COLORS.input : WIRE.color}
      />

      <MinusSymbol
        center={BASE_COMPONENT.inputTerminal.minus.center}
        size={BASE_COMPONENT.inputTerminal.minus.size}
        control={COMPONENT.inputTerminal}
        anchorPoint={BASE_COMPONENT.inputTerminal.anchor}
        offset={INPUT_TERMINAL_CONTROL.minusSymbolOffset}
        color={simulation.inputReturnActive ? COLORS.input : WIRE.color}
      />

      <ResistorBetweenPoints
        start={p.resistorStart}
        end={p.resistorEnd}
        amplitude={
          componentValue(
            BASE_COMPONENT.inputResistor.amplitude,
            COMPONENT.inputResistor,
          ) * INPUT_RESISTOR_CONTROL.amplitudeScale
        }
        segments={
          BASE_COMPONENT.inputResistor.segments +
          INPUT_RESISTOR_CONTROL.segmentOffset
        }
        active={simulation.inputResistorActive}
        flowType="input"
      />

      <InputDiodeSymbol active={simulation.inputDiodeActive} />

      <InputLedSymbol active={simulation.inputLedOn} />
    </>
  );
}

function CircuitOpticalSymbols({
  simulation,
}: {
  simulation: SimulationDerivedState;
}) {
  return (
    <>
      <OpticalArrow
        start={BASE_COMPONENT.opticalSignal.upper.start}
        end={BASE_COMPONENT.opticalSignal.upper.end}
        startOffset={OPTICAL_SIGNAL_CONTROL.upperStartOffset}
        endOffset={OPTICAL_SIGNAL_CONTROL.upperEndOffset}
        active={simulation.opticalSignalActive}
      />

      <OpticalArrow
        start={BASE_COMPONENT.opticalSignal.lower.start}
        end={BASE_COMPONENT.opticalSignal.lower.end}
        startOffset={OPTICAL_SIGNAL_CONTROL.lowerStartOffset}
        endOffset={OPTICAL_SIGNAL_CONTROL.lowerEndOffset}
        active={simulation.opticalSignalActive}
      />
    </>
  );
}

function CircuitOutputSymbols({
  simulation,
}: {
  simulation: SimulationDerivedState;
}) {
  const p = getCircuitPoints();

  return (
    <>
      <ResistorBetweenPoints
        start={p.phototriacUpperResistorStart}
        end={p.phototriacUpperResistorEnd}
        amplitude={
          componentValue(
            BASE_COMPONENT.phototriac.upperResistor.amplitude,
            COMPONENT.phototriac,
          ) * PHOTOTRIAC_CONTROL.upperResistorAmplitudeScale
        }
        segments={
          BASE_COMPONENT.phototriac.upperResistor.segments +
          PHOTOTRIAC_CONTROL.upperResistorSegmentOffset
        }
        active={simulation.phototriacOn || simulation.triacGateActive}
        flowType="gate"
      />

      <TriacLikeSymbol
        center={addOffset(
          BASE_COMPONENT.phototriac.symbolCenter,
          PHOTOTRIAC_CONTROL.symbolCenterOffset,
        )}
        control={COMPONENT.phototriac}
        anchorPoint={BASE_COMPONENT.phototriac.anchor}
        symbolScale={0.92}
        active={simulation.phototriacOn}
        flowType="gate"
      />

      <ResistorBetweenPoints
        start={p.phototriacLowerResistorStart}
        end={p.phototriacLowerResistorEnd}
        amplitude={
          componentValue(
            BASE_COMPONENT.phototriac.lowerResistor.amplitude,
            COMPONENT.phototriac,
          ) * PHOTOTRIAC_CONTROL.lowerResistorAmplitudeScale
        }
        segments={
          BASE_COMPONENT.phototriac.lowerResistor.segments +
          PHOTOTRIAC_CONTROL.lowerResistorSegmentOffset
        }
        active={simulation.triacGateActive}
        flowType="gate"
      />

      <TriacLikeSymbol
        center={addOffset(
          BASE_COMPONENT.triac.symbolCenter,
          TRIAC_CONTROL.symbolCenterOffset,
        )}
        control={COMPONENT.triac}
        anchorPoint={BASE_COMPONENT.triac.anchor}
        symbolScale={0.92}
        active={simulation.triacOn || simulation.acOutputCurrentActive}
        flowType="output"
      />

      <AcPilotLightSymbol active={simulation.acPilotLightOn} />

      <AcSourceSymbol active={simulation.acSourceActive} />
    </>
  );
}

function CircuitNodes({ simulation }: { simulation: SimulationDerivedState }) {
  const p = getCircuitPoints();

  const nodes: {
    point: Point;
    active: boolean;
    flowType: FlowType;
  }[] = [
    {
      point: p.inputDcSourceTop,
      active: simulation.inputDcSourceActive,
      flowType: "input",
    },
    {
      point: p.inputDcSourceBottom,
      active: simulation.inputReturnActive || simulation.inputDcSourceActive,
      flowType: "input",
    },
    {
      point: p.inputPositiveNode,
      active: simulation.inputDcActive,
      flowType: "input",
    },
    {
      point: p.inputNegativeNode,
      active: simulation.inputReturnActive,
      flowType: "input",
    },
    {
      point: p.inputJunction,
      active: simulation.inputCurrentActive,
      flowType: "input",
    },
    {
      point: p.diodeBottom,
      active: simulation.inputReturnActive,
      flowType: "input",
    },
    {
      point: p.ledBottom,
      active: simulation.inputLedOn,
      flowType: "input",
    },
    {
      point: p.phototriacMiddleNode,
      active: simulation.phototriacOn || simulation.triacGateActive,
      flowType: "gate",
    },
    {
      point: p.triacTopLeadStart,
      active: simulation.triacOn || simulation.acOutputCurrentActive,
      flowType: "output",
    },
    {
      point: p.triacBottomLeadEnd,
      active: simulation.triacOn || simulation.acOutputCurrentActive,
      flowType: "output",
    },
    {
      point: p.outputTopNode,
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },
    {
      point: p.outputBottomNode,
      active: simulation.acOutputCurrentActive,
      flowType: "output",
    },
    {
      point: p.acPilotLightLeft,
      active: simulation.acPilotLightOn,
      flowType: "output",
    },
    {
      point: p.acPilotLightRight,
      active: simulation.acPilotLightOn,
      flowType: "output",
    },
    {
      point: p.acSourceTop,
      active: simulation.acSourceActive,
      flowType: "output",
    },
    {
      point: p.acSourceBottom,
      active: simulation.acSourceActive,
      flowType: "output",
    },
  ];

  return (
    <>
      {nodes.map((node, index) => (
        <NodeDot
          key={index}
          point={node.point}
          color={node.active ? flowColor(node.flowType) : NODE.color}
        />
      ))}
    </>
  );
}

function CircuitLabels({ simulation }: { simulation: SimulationDerivedState }) {
  return (
    <>
      <LabelText
        label={BASE_COMPONENT.inputDcSource.label}
        control={COMPONENT.inputDcSource}
        anchorPoint={BASE_COMPONENT.inputDcSource.anchor}
        offset={INPUT_DC_SOURCE_CONTROL.labelOffset}
        fill={simulation.inputDcSourceActive ? COLORS.input : LABEL.color}
      >
        Input DC Source
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.inputTerminal.label}
        control={COMPONENT.inputTerminal}
        anchorPoint={BASE_COMPONENT.inputTerminal.anchor}
        offset={INPUT_TERMINAL_CONTROL.labelOffset}
      >
        Input
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.inputResistor.label}
        control={COMPONENT.inputResistor}
        anchorPoint={BASE_COMPONENT.inputResistor.anchor}
        offset={INPUT_RESISTOR_CONTROL.labelOffset}
        fill={simulation.inputResistorActive ? COLORS.input : LABEL.color}
      >
        R
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.inputDiode.label}
        control={COMPONENT.inputDiode}
        anchorPoint={BASE_COMPONENT.inputDiode.anchor}
        offset={DIODE_CONTROL.labelOffset}
        fill={simulation.inputDiodeActive ? COLORS.input : LABEL.color}
      >
        Diode
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.inputLed.label}
        control={COMPONENT.inputLed}
        anchorPoint={BASE_COMPONENT.inputLed.anchor}
        offset={LED_CONTROL.labelOffset}
        fill={simulation.inputLedOn ? COLORS.input : LABEL.color}
      >
        LED
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.phototriac.label}
        control={COMPONENT.phototriac}
        anchorPoint={BASE_COMPONENT.phototriac.anchor}
        offset={PHOTOTRIAC_CONTROL.labelOffset}
        fill={simulation.phototriacOn ? COLORS.gate : LABEL.color}
      >
        Phototriac
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.phototriac.upperResistorLabel}
        control={COMPONENT.phototriac}
        anchorPoint={BASE_COMPONENT.phototriac.anchor}
        offset={PHOTOTRIAC_CONTROL.upperResistorLabelOffset}
        fill={simulation.triacGateActive ? COLORS.gate : LABEL.color}
      >
        R
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.phototriac.lowerResistorLabel}
        control={COMPONENT.phototriac}
        anchorPoint={BASE_COMPONENT.phototriac.anchor}
        offset={PHOTOTRIAC_CONTROL.lowerResistorLabelOffset}
        fill={simulation.triacGateActive ? COLORS.gate : LABEL.color}
      >
        R
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.triac.label}
        control={COMPONENT.triac}
        anchorPoint={BASE_COMPONENT.triac.anchor}
        offset={TRIAC_CONTROL.labelOffset}
        fill={simulation.triacOn ? COLORS.output : LABEL.color}
      >
        Triac
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.outputRail.label}
        control={COMPONENT.outputRail}
        anchorPoint={BASE_COMPONENT.outputRail.anchor}
        offset={OUTPUT_RAIL_CONTROL.labelOffset}
      >
        Output
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.acPilotLight.label}
        control={COMPONENT.acPilotLight}
        anchorPoint={BASE_COMPONENT.acPilotLight.anchor}
        offset={AC_PILOT_LIGHT_CONTROL.labelOffset}
        fill={simulation.acPilotLightOn ? COLORS.output : LABEL.color}
      >
        AC Pilot Light
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.acSource.label}
        control={COMPONENT.acSource}
        anchorPoint={BASE_COMPONENT.acSource.anchor}
        offset={AC_SOURCE_CONTROL.labelOffset}
        fill={simulation.acSourceActive ? COLORS.output : LABEL.color}
      >
        AC Source
      </LabelText>

      <LabelText
        label={BASE_COMPONENT.title.label}
        control={COMPONENT.title}
        anchorPoint={BASE_COMPONENT.title.anchor}
      >
        DC to AC SSR
      </LabelText>
    </>
  );
}

/* =========================================================
   DEBUG DOTS
   ========================================================= */

function DebugTerminalDots() {
  if (!DEBUG_TERMINAL_OFFSET.enabled) return null;

  const p = getCircuitPoints();

  const debugItems = [
    {
      id: "input-dc-source-positive",
      label: "SRC+",
      point: p.inputDcSourceTop,
      offset: DEBUG_TERMINAL_OFFSET.inputDcSourcePositive,
      color: COLORS.debugInput,
    },
    {
      id: "input-dc-source-negative",
      label: "SRC−",
      point: p.inputDcSourceBottom,
      offset: DEBUG_TERMINAL_OFFSET.inputDcSourceNegative,
      color: COLORS.debugInput,
    },
    {
      id: "input-positive",
      label: "IN+",
      point: p.inputPositiveNode,
      offset: DEBUG_TERMINAL_OFFSET.inputPositive,
      color: COLORS.debugInput,
    },
    {
      id: "input-negative",
      label: "IN−",
      point: p.inputNegativeNode,
      offset: DEBUG_TERMINAL_OFFSET.inputNegative,
      color: COLORS.debugInput,
    },
    {
      id: "input-junction",
      label: "J",
      point: p.inputJunction,
      offset: DEBUG_TERMINAL_OFFSET.inputJunction,
      color: COLORS.debugInput,
    },
    {
      id: "diode-top",
      label: "D+",
      point: p.diodeTop,
      offset: DEBUG_TERMINAL_OFFSET.diodeTop,
      color: COLORS.debugInput,
    },
    {
      id: "diode-bottom",
      label: "D−",
      point: p.diodeBottom,
      offset: DEBUG_TERMINAL_OFFSET.diodeBottom,
      color: COLORS.debugInput,
    },
    {
      id: "led-top",
      label: "LED+",
      point: p.ledTop,
      offset: DEBUG_TERMINAL_OFFSET.ledTop,
      color: COLORS.debugInput,
    },
    {
      id: "led-bottom",
      label: "LED−",
      point: p.ledBottom,
      offset: DEBUG_TERMINAL_OFFSET.ledBottom,
      color: COLORS.debugInput,
    },
    {
      id: "triac-gate",
      label: "G",
      point: p.triacGateTerminal,
      offset: DEBUG_TERMINAL_OFFSET.triacGate,
      color: COLORS.debugGate,
    },
    {
      id: "output-top",
      label: "OUT1",
      point: p.outputTopNode,
      offset: DEBUG_TERMINAL_OFFSET.outputTop,
      color: COLORS.debugOutput,
    },
    {
      id: "output-bottom",
      label: "OUT2",
      point: p.outputBottomNode,
      offset: DEBUG_TERMINAL_OFFSET.outputBottom,
      color: COLORS.debugOutput,
    },
  ];

  return (
    <>
      {debugItems.map((item) => {
        const debugPoint = addOffset(item.point, item.offset);

        return (
          <g key={item.id}>
            <circle
              cx={debugPoint.x}
              cy={debugPoint.y}
              r={DEBUG_TERMINAL_OFFSET.dotRadius}
              fill={item.color}
              stroke="#111827"
              strokeWidth={2}
            />

            <text
              x={debugPoint.x}
              y={debugPoint.y - 22}
              fill={item.color}
              fontFamily={LABEL.family}
              fontSize={DEBUG_TERMINAL_OFFSET.labelSize}
              fontWeight={900}
              textAnchor="middle"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

/* =========================================================
   CONTROL PANEL
   ========================================================= */

function PanelButton({
  children,
  onClick,
  variant = "secondary",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "warning";
  disabled?: boolean;
}) {
  const variantClass = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClass}`}
    >
      {children}
    </button>
  );
}

function ModeSelector({
  mode,
  onModeChange,
}: {
  mode: SimulationMode;
  onModeChange: (mode: SimulationMode) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
      <button
        type="button"
        onClick={() => onModeChange("onOff")}
        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
          mode === "onOff"
            ? "bg-white text-gray-950 shadow-sm"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        ON/OFF Mode
      </button>

      <button
        type="button"
        onClick={() => onModeChange("timeline")}
        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
          mode === "timeline"
            ? "bg-white text-gray-950 shadow-sm"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        Timeline Mode
      </button>
    </div>
  );
}

function StatusIndicator({
  label,
  active,
  flowType,
}: {
  label: string;
  active: boolean;
  flowType: FlowType;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm font-semibold ${
        active
          ? "border-transparent bg-white shadow-sm"
          : "border-gray-200 bg-gray-50 text-gray-500"
      }`}
    >
      <span className="text-gray-700">{label}</span>
      <span
        className="h-3 w-3 rounded-full"
        style={{
          backgroundColor: active ? flowColor(flowType) : "#d1d5db",
        }}
      />
    </div>
  );
}

function OperationLog({ simulation }: { simulation: SimulationDerivedState }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-black uppercase tracking-wide text-gray-700">
          Operation Log
        </h4>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            simulation.circuitOn
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Circuit {simulation.circuitOn ? "ON" : "OFF"}
        </span>
      </div>

      <p className="text-base font-black text-gray-900">
        {simulation.currentStepTitle}
      </p>

      <p className="mt-1 text-sm leading-6 text-gray-600">
        {simulation.currentStepExplanation}
      </p>

      <div className="mt-3 rounded-xl bg-white p-3 text-sm font-semibold text-gray-700 shadow-sm">
        Current flow:{" "}
        <span className="font-bold text-gray-950">
          {simulation.currentFlowDirection}
        </span>
      </div>
    </div>
  );
}

function SimulationControlPanel({
  control,
  simulation,
  setControl,
}: {
  control: SimulationControlState;
  simulation: SimulationDerivedState;
  setControl: React.Dispatch<React.SetStateAction<SimulationControlState>>;
}) {
  const handleModeChange = (mode: SimulationMode) => {
    setControl({
      ...DEFAULT_SIMULATION_CONTROL,
      mode,
    });
  };

  const handleOnOffStart = () => {
    setControl((prev) => ({
      ...prev,
      mode: "onOff",
      isPlaying: false,
      onOffActive: true,
      timelineStep: 0,
    }));
  };

  const handleOnOffStop = () => {
    setControl((prev) => ({
      ...prev,
      isPlaying: false,
      onOffActive: false,
    }));
  };

  const handleReset = () => {
    setControl((prev) => ({
      ...DEFAULT_SIMULATION_CONTROL,
      mode: prev.mode,
    }));
  };

  const handleTimelineStart = () => {
    setControl((prev) => ({
      ...prev,
      mode: "timeline",
      onOffActive: false,
      isPlaying: true,
      timelineStep:
        prev.timelineStep >= TIMELINE_CONTROL.finalStep
          ? TIMELINE_CONTROL.firstStep
          : prev.timelineStep,
    }));
  };

  const handleTimelineStop = () => {
    setControl((prev) => ({
      ...prev,
      isPlaying: false,
    }));
  };

  const handlePreviousStep = () => {
    setControl((prev) => ({
      ...prev,
      mode: "timeline",
      isPlaying: false,
      onOffActive: false,
      timelineStep: Math.max(TIMELINE_CONTROL.firstStep, prev.timelineStep - 1),
    }));
  };

  const handleNextStep = () => {
    setControl((prev) => ({
      ...prev,
      mode: "timeline",
      isPlaying: false,
      onOffActive: false,
      timelineStep: Math.min(TIMELINE_CONTROL.finalStep, prev.timelineStep + 1),
    }));
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="rounded-2xl bg-slate-950 p-4 text-white">
        <div>
          <h2 className="text-xl font-black text-white">
            DC-to-AC SSR Interactive Simulation
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Control the input DC source, input LED, optical isolation,
            phototriac, TRIAC gate, main TRIAC, AC source, and AC pilot light.
          </p>
        </div>

        <ModeSelector mode={control.mode} onModeChange={handleModeChange} />
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-gray-700">
            Controls
          </h3>

          {control.mode === "onOff" ? (
            <div className="flex flex-wrap gap-2">
              <PanelButton variant="primary" onClick={handleOnOffStart}>
                Start
              </PanelButton>

              <PanelButton variant="danger" onClick={handleOnOffStop}>
                Stop
              </PanelButton>

              <PanelButton variant="warning" onClick={handleReset}>
                Reset
              </PanelButton>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <PanelButton variant="primary" onClick={handleTimelineStart}>
                  Start
                </PanelButton>

                <PanelButton variant="danger" onClick={handleTimelineStop}>
                  Stop
                </PanelButton>

                <PanelButton
                  variant="secondary"
                  onClick={handlePreviousStep}
                  disabled={control.timelineStep <= TIMELINE_CONTROL.firstStep}
                >
                  Previous Step
                </PanelButton>

                <PanelButton
                  variant="secondary"
                  onClick={handleNextStep}
                  disabled={control.timelineStep >= TIMELINE_CONTROL.finalStep}
                >
                  Next Step
                </PanelButton>

                <PanelButton variant="warning" onClick={handleReset}>
                  Reset
                </PanelButton>
              </div>

              <div className="mt-4 rounded-2xl bg-gray-50 p-3">
                <div className="mb-2 flex items-center justify-between text-sm font-bold text-gray-700">
                  <span>Timeline Step</span>
                  <span>
                    {control.timelineStep} / {TIMELINE_CONTROL.finalStep}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{
                      width: `${
                        (control.timelineStep / TIMELINE_CONTROL.finalStep) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-gray-500">
                  {control.isPlaying
                    ? "Timeline is playing..."
                    : "Timeline is paused."}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-gray-700">
            Live Status Indicators
          </h3>

          <div className="grid gap-2">
            <StatusIndicator
              label="Input DC Source"
              active={simulation.inputDcSourceActive}
              flowType="input"
            />
            <StatusIndicator
              label="Input DC"
              active={simulation.inputDcActive}
              flowType="input"
            />
            <StatusIndicator
              label="Input Resistor"
              active={simulation.inputResistorActive}
              flowType="input"
            />
            <StatusIndicator
              label="Input Diode"
              active={simulation.inputDiodeActive}
              flowType="input"
            />
            <StatusIndicator
              label="Input LED"
              active={simulation.inputLedOn}
              flowType="input"
            />
            <StatusIndicator
              label="Optical Signal"
              active={simulation.opticalSignalActive}
              flowType="optical"
            />
            <StatusIndicator
              label="Phototriac"
              active={simulation.phototriacOn}
              flowType="gate"
            />
            <StatusIndicator
              label="TRIAC Gate"
              active={simulation.triacGateActive}
              flowType="gate"
            />
            <StatusIndicator
              label="Main TRIAC"
              active={simulation.triacOn}
              flowType="output"
            />
            <StatusIndicator
              label="AC Source"
              active={simulation.acSourceActive}
              flowType="output"
            />
            <StatusIndicator
              label="AC Pilot Light"
              active={simulation.acPilotLightOn}
              flowType="output"
            />
            <StatusIndicator
              label="AC Output Current"
              active={simulation.acOutputCurrentActive}
              flowType="output"
            />
          </div>
        </div>

        <OperationLog simulation={simulation} />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function DcToAcSsrDiagram({
  className = "",
}: DcToAcSsrDiagramProps) {
  const [control, setControl] = useState<SimulationControlState>(
    DEFAULT_SIMULATION_CONTROL,
  );

  useEffect(() => {
    if (control.mode !== "timeline" || !control.isPlaying) return;

    if (control.timelineStep >= TIMELINE_CONTROL.finalStep) {
      setControl((prev) => ({
        ...prev,
        isPlaying: false,
      }));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setControl((prev) => ({
        ...prev,
        timelineStep: Math.min(
          TIMELINE_CONTROL.finalStep,
          prev.timelineStep + 1,
        ),
      }));
    }, TIMELINE_CONTROL.stepDurationMs);

    return () => window.clearTimeout(timeoutId);
  }, [control.mode, control.isPlaying, control.timelineStep]);

  const simulation = useMemo(
    () => getDerivedSimulationState(control),
    [control],
  );

  const currentFlowPaths = useMemo(
    () => getCurrentFlowPaths(simulation),
    [simulation],
  );
  const timeCursor =
    TIMELINE_CONTROL.finalStep > 0
      ? control.timelineStep / TIMELINE_CONTROL.finalStep
      : 0;
  const previewTimelineAt = (nextCursor: number) => {
    const nextStep = Math.min(
      TIMELINE_CONTROL.finalStep,
      Math.max(
        TIMELINE_CONTROL.firstStep,
        Math.round(nextCursor * TIMELINE_CONTROL.finalStep),
      ),
    );

    setControl((prev) => ({
      ...prev,
      mode: "timeline",
      isPlaying: false,
      onOffActive: false,
      timelineStep: nextStep,
    }));
  };

  return (
    <div
      className={`grid w-full gap-5 xl:grid-cols-[360px_minmax(0,1fr)] ${className}`}
      data-simulator-format={RELAY_SIMULATOR_FORMAT}
    >
      <div className="space-y-4 xl:sticky xl:top-4 xl:self-start">
        <SimulationControlPanel
          control={control}
          simulation={simulation}
          setControl={setControl}
        />
      </div>

      <div className="min-w-0 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Time Cursor / Switching Preview
              </h2>
            </div>
            <span className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm">
              {Math.round(timeCursor * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={0.999}
            step={0.001}
            value={timeCursor}
            onChange={(event) => previewTimelineAt(Number(event.target.value))}
            className="w-full accent-green-700"
            aria-label="Time Cursor / Switching Preview"
          />
        </section>

        <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <svg
            viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full"
            role="img"
            aria-label="Interactive DC to AC SSR internal circuit diagram with AC source and pilot light"
          >
            <rect
              x={VIEW_BOX.x}
              y={VIEW_BOX.y}
              width={VIEW_BOX.width}
              height={VIEW_BOX.height}
              fill={COLORS.background}
            />

            <g transform={`scale(${CIRCUIT_CANVAS_SCALE})`}>
              <CircuitWires simulation={simulation} />

              <CircuitInputSymbols simulation={simulation} />

              <CircuitOpticalSymbols simulation={simulation} />

              <CircuitOutputSymbols simulation={simulation} />

              {currentFlowPaths.map((path) => (
                <CurrentFlowDots key={path.id} path={path} />
              ))}

              <CircuitNodes simulation={simulation} />

              <DebugTerminalDots />

              <CircuitLabels simulation={simulation} />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
