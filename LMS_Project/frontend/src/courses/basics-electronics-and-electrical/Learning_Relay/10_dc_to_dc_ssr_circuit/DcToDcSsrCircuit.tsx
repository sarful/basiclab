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

type ElectronicsSymbolViewBox = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

type ElectronicsSymbolTerminalMap = {
  gate: Point;
  drain: Point;
  source: Point;
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

type WireRouteControl = {
  startOffset: Point;
  endOffset: Point;
  bendOffsets: Point[];
};

type HorizontalResistorBase = {
  start: Point;
  end: Point;
  amplitude: number;
  segments: number;
};

type VerticalResistorBase = {
  topTerminal: Point;
  bottomTerminal: Point;
  amplitude: number;
  segments: number;
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
  inputLedOn: boolean;
  inputReturnActive: boolean;
  opticalSignalActive: boolean;
  phototransistorOn: boolean;
  mosfetGateActive: boolean;
  mosfetOn: boolean;
  outputInternalActive: boolean;
  dcSourceActive: boolean;
  loadLedOn: boolean;
  outputCurrentActive: boolean;
  circuitOn: boolean;
  currentStepTitle: string;
  currentStepExplanation: string;
  currentFlowDirection: string;
};

type DcToDcSsrDiagramProps = {
  className?: string;
};

/* =========================================================
   VIEW_BOX + GLOBAL SCALE CONTROLS
   ========================================================= */

export const VIEW_BOX = {
  x: -180,
  y: 0,
  width: 1420,
  height: 402,
};

export const CIRCUIT_COMPONENT_SCALE = 0.82;
export const BASE_WIRE_WIDTH = 3;
export const CIRCUIT_WIRE_SCALE = 0.68;
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

export const INPUT_SIDE_GROUP_OFFSET: Point = {
  x: 40,
  y: 0,
};

export const OUTPUT_SIDE_GROUP_OFFSET: Point = {
  x: 20,
  y: 0,
};

export const EXTERNAL_OUTPUT_CIRCUIT_OFFSET: Point = {
  x: -90,
  y: 0,
};

export const DEBUG_TERMINAL_OFFSET = {
  enabled: false,

  gate: { x: 0, y: 0 },
  drain: { x: 0, y: 0 },
  source: { x: 0, y: 0 },

  dotRadius: 5,
  labelSize: 11,
};

/* =========================================================
   INPUT DC SOURCE CONTROL
   Same style/control pattern as output DC Source.
   ========================================================= */

export const INPUT_DC_SOURCE_OFFSET: Point = {
  // Move whole Input DC Source left/right.
  x: 60,

  // Move whole Input DC Source up/down.
  y: 0,
};

export const INPUT_DC_SOURCE_CONTROL = {
  // Move Input DC Source + terminal connection.
  topTerminalOffset: { x: 0, y: 0 },

  // Move Input DC Source − terminal connection.
  bottomTerminalOffset: { x: 0, y: 0 },

  // Move long battery plate.
  longPlateOffset: { x: 0, y: 20 },

  // Move short battery plate.
  shortPlateOffset: { x: 0, y: -20 },

  // Move plus symbol.
  plusSymbolOffset: { x: 0, y: 0 },

  // Move minus symbol.
  minusSymbolOffset: { x: 0, y: 0 },

  // Plus/minus symbol size.
  plusSymbolSize: 24,
  minusSymbolSize: 24,
};

export const INPUT_DC_SOURCE_WIRE_CONTROL: {
  positiveToInputPositive: WireRouteControl;
  inputNegativeToSourceNegative: WireRouteControl;
} = {
  positiveToInputPositive: {
    // Start = Input DC Source +
    startOffset: { x: 0, y: 0 },

    // End = SSR Input +
    endOffset: { x: 0, y: 0 },

    // Orthogonal bend points from start point.
    bendOffsets: [],
  },

  inputNegativeToSourceNegative: {
    // Start = SSR Input −
    startOffset: { x: 0, y: 0 },

    // End = Input DC Source −
    endOffset: { x: 0, y: 0 },

    // Orthogonal bend points from start point.
    bendOffsets: [],
  },
};

/* =========================================================
   SIMULATION COLORS
   ========================================================= */

export const SIMULATION_COLORS = {
  input: "#f97316",
  optical: "#facc15",
  gate: "#a855f7",
  output: "#22c55e",

  inputSoft: "#fff7ed",
  opticalSoft: "#fef9c3",
  gateSoft: "#f5e8ff",
  outputSoft: "#ecfdf5",

  inactiveWire: "#2f3444",
  inactiveFill: "#ffffff",
  inactiveSoft: "#f3f4f6",

  yellowFill: "#f8fafc",
  orangeLabel: "#f6a13a",

  debugGate: "#22c55e",
  debugDrain: "#ef4444",
  debugSource: "#3b82f6",
};

/* =========================================================
   CURRENT DOT CONTROL
   ========================================================= */

export const CURRENT_DOT_CONTROL = {
  enabled: true,
  radius: 4.2,
  count: 4,

  speedSeconds: {
    input: 1.45,
    optical: 1.1,
    gate: 1.35,
    output: 2.25,
  },
};

/* =========================================================
   TIMELINE CONTROL
   ========================================================= */

export const TIMELINE_CONTROL = {
  firstStep: 0,
  finalStep: 8,
  stepDurationMs: 1200,
};

/* =========================================================
   LIGHT ARROW ADJUSTMENT CONTROL
   ========================================================= */

export const LIGHT_ARROW_CONTROL = {
  upper: {
    startOffset: { x: 20, y: 20 },
    endOffset: { x: 20, y: 20 },
  },

  lower: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
  },

  arrowHeadLength: 13,
  arrowHeadAngleOffset: 1,
};

/* =========================================================
   OUTPUT DC SOURCE CONTROL
   ========================================================= */

export const DC_SOURCE_CONTROL = {
  topTerminalOffset: { x: 0, y: 0 },
  bottomTerminalOffset: { x: 0, y: 0 },

  longPlateOffset: { x: 0, y: 20 },
  shortPlateOffset: { x: 0, y: -20 },

  plusSymbolOffset: { x: 0, y: 0 },
  minusSymbolOffset: { x: 0, y: 0 },

  plusSymbolSize: 24,
  minusSymbolSize: 24,
};

/* =========================================================
   LOAD LED CONTROL
   ========================================================= */

export const LOAD_LED_CONTROL = {
  lightArrowEnabled: true,

  upperLight: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
  },

  lowerLight: {
    startOffset: { x: 0, y: 0 },
    endOffset: { x: 0, y: 0 },
  },

  arrowHeadLength: 10,
  arrowHeadAngleOffset: 1,
};

/* =========================================================
   LOAD LED WIRE CONTROL
   ========================================================= */

export const LOAD_LED_WIRE_CONTROL: {
  outputPositiveToLoadLed: WireRouteControl;
  loadLedToDcSourcePositive: WireRouteControl;
} = {
  outputPositiveToLoadLed: {
    // Start = SSR Output +
    startOffset: { x: 0, y: 0 },

    // End = Load LED cathode
    endOffset: { x: 60, y: 0 },

    bendOffsets: [],
  },

  loadLedToDcSourcePositive: {
    // Start = Load LED anode
    startOffset: { x: 0, y: 0 },

    // End = Output DC Source +
    endOffset: { x: 0, y: 0 },

    bendOffsets: [],
  },
};

/* =========================================================
   MOSFET GATE TO GND RESISTOR CONTROL
   ========================================================= */

export const GATE_PULLDOWN_RESISTOR_CONTROL = {
  enabled: true,

  topOffset: { x: 0, y: 0 },
  bottomOffset: { x: 0, y: 0 },

  amplitude: 10,
  segments: 7,

  labelOffset: { x: -28, y: 42 },
};

/* =========================================================
   TIMELINE STEPS
   ========================================================= */

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: 0,
    title: "Idle / SSR OFF",
    explanation:
      "Input DC Source is visible but inactive. No current flows, the input LED is OFF, the phototransistor is OFF, the MOSFET is OFF, and the load LED is OFF.",
    currentFlowDirection: "No current flow.",
  },
  {
    step: 1,
    title: "Input DC Source Applied",
    explanation:
      "The input DC source becomes active. Its + and − terminals are highlighted, and current starts moving from Input DC Source + to SSR Input +.",
    currentFlowDirection: "Input DC Source + → SSR Input +.",
  },
  {
    step: 2,
    title: "Input Current Through R",
    explanation:
      "Input current flows through the input resistor R. The resistor limits the LED input current.",
    currentFlowDirection: "Input DC Source + → SSR Input + → input resistor R.",
  },
  {
    step: 3,
    title: "Input LED ON",
    explanation:
      "The input LED receives current and turns ON. Current returns from SSR Input − to Input DC Source −.",
    currentFlowDirection:
      "Input DC Source + → SSR Input + → R → LED → SSR Input − → Input DC Source −.",
  },
  {
    step: 4,
    title: "Optical Isolation Active",
    explanation:
      "Light travels from the input LED to the phototransistor. Electrical isolation is maintained between input and output sides.",
    currentFlowDirection: "Optical signal: input LED → phototransistor.",
  },
  {
    step: 5,
    title: "Phototransistor ON",
    explanation:
      "The phototransistor receives light and turns ON. Its collector-emitter path becomes active.",
    currentFlowDirection:
      "Output control path begins through the phototransistor.",
  },
  {
    step: 6,
    title: "MOSFET Gate Activated",
    explanation:
      "The MOSFET gate path becomes active through the phototransistor and the gate-to-GND resistor.",
    currentFlowDirection:
      "Output + control rail → resistor → phototransistor → MOSFET gate → gate resistor → Output −.",
  },
  {
    step: 7,
    title: "MOSFET ON",
    explanation:
      "The MOSFET turns ON. Drain-to-source conduction becomes active and the output path is ready.",
    currentFlowDirection: "MOSFET drain → source path becomes conductive.",
  },
  {
    step: 8,
    title: "Load LED ON",
    explanation:
      "The output current loop is complete. The output DC source supplies current into the Load LED anode, through the LED to its cathode, then through the SSR output path and MOSFET.",
    currentFlowDirection:
      "Output DC Source + → Load LED anode → Load LED cathode → SSR Output + → MOSFET drain → MOSFET source → SSR Output − → Output DC Source −.",
  },
];

/* =========================================================
   DEFAULT SIMULATION STATE
   ========================================================= */

const DEFAULT_SIMULATION_CONTROL: SimulationControlState = {
  mode: "timeline",
  isPlaying: false,
  onOffActive: false,
  timelineStep: 0,
};

/* =========================================================
   COLORS
   ========================================================= */

const COLORS = {
  wire: SIMULATION_COLORS.inactiveWire,
  fill: SIMULATION_COLORS.inactiveFill,
  yellow: SIMULATION_COLORS.yellowFill,
  orange: SIMULATION_COLORS.orangeLabel,
  debugGate: SIMULATION_COLORS.debugGate,
  debugDrain: SIMULATION_COLORS.debugDrain,
  debugSource: SIMULATION_COLORS.debugSource,
};

/* =========================================================
   NODE, WIRE, PATH, LABEL STYLE
   ========================================================= */

export const NODE = {
  radius: 5.4,
  color: COLORS.wire,
};

export const WIRE = {
  color: COLORS.wire,
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  activeWidth: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE + 1.3,
  thinWidth: 3 * CIRCUIT_WIRE_SCALE,
  symbolWidth: 4 * CIRCUIT_WIRE_SCALE,
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
  weight: 700,
};

/* =========================================================
   TUNE HELPERS
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

function combineTune(...controls: ComponentTune[]): ComponentTune {
  return controls.reduce(
    (acc, control) => ({
      leftRight: acc.leftRight + control.leftRight,
      upDown: acc.upDown + control.upDown,
      widthScale: acc.widthScale * control.widthScale,
      heightScale: acc.heightScale * control.heightScale,
      scale: acc.scale * control.scale,
      rotate: acc.rotate + control.rotate,
    }),
    tune(),
  );
}

function componentPoint(point: Point, control: ComponentTune): Point {
  return {
    x: point.x + COMPONENT_OFFSET.x + control.leftRight,
    y: point.y + COMPONENT_OFFSET.y + control.upDown,
  };
}

function componentSize(value: number, control: ComponentTune): number {
  return value * CIRCUIT_COMPONENT_SCALE * control.scale;
}

function componentLocalPoint(
  point: Point,
  anchor: Point,
  control: ComponentTune,
): Point {
  const anchorPoint = componentPoint(anchor, control);

  return {
    x:
      anchorPoint.x +
      (point.x - anchor.x) *
        CIRCUIT_COMPONENT_SCALE *
        control.scale *
        control.widthScale,

    y:
      anchorPoint.y +
      (point.y - anchor.y) *
        CIRCUIT_COMPONENT_SCALE *
        control.scale *
        control.heightScale,
  };
}

function wirePoint(point: Point): Point {
  return {
    x: point.x + WIRE_OFFSET.x,
    y: point.y + WIRE_OFFSET.y,
  };
}

function addOffset(point: Point, offset: Point): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
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

function reversePoints(points: Point[]): Point[] {
  return [...points].reverse();
}

function polylinePath(points: Point[]): string {
  return points
    .map((point, index) => {
      const p = wirePoint(point);
      return `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    })
    .join(" ");
}

function flowColor(flowType: FlowType): string {
  if (flowType === "input") return SIMULATION_COLORS.input;
  if (flowType === "optical") return SIMULATION_COLORS.optical;
  if (flowType === "gate") return SIMULATION_COLORS.gate;
  if (flowType === "output") return SIMULATION_COLORS.output;
  return WIRE.color;
}

function activeSoftFill(flowType: FlowType): string {
  if (flowType === "input") return SIMULATION_COLORS.inputSoft;
  if (flowType === "optical") return SIMULATION_COLORS.opticalSoft;
  if (flowType === "gate") return SIMULATION_COLORS.gateSoft;
  if (flowType === "output") return SIMULATION_COLORS.outputSoft;
  return COLORS.fill;
}

/* =========================================================
   SIMULATION HELPERS
   ========================================================= */

function getTimelineStep(step: number): TimelineStep {
  return (
    TIMELINE_STEPS.find((timelineStep) => timelineStep.step === step) ??
    TIMELINE_STEPS[0]
  );
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
      inputLedOn: isOn,
      inputReturnActive: isOn,
      opticalSignalActive: isOn,
      phototransistorOn: isOn,
      mosfetGateActive: isOn,
      mosfetOn: isOn,
      outputInternalActive: isOn,
      dcSourceActive: isOn,
      loadLedOn: isOn,
      outputCurrentActive: isOn,
      circuitOn: isOn,
      currentStepTitle: isOn ? "SSR ON" : "SSR OFF",
      currentStepExplanation: isOn
        ? "Input DC Source is active. Input current flows through R and the input LED, optical isolation drives the phototransistor, the MOSFET turns ON, and the load LED receives output current."
        : "Input DC Source is inactive. No input current flows, the input LED is OFF, the optical signal is removed, and the output current path is OFF.",
      currentFlowDirection: isOn
        ? "Input DC Source + → SSR Input + → R → LED → SSR Input − → Input DC Source −. Output DC Source + → Load LED anode → Load LED cathode → SSR Output + → MOSFET → SSR Output − → Output DC Source −."
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
  const inputLedOn = step >= 3;
  const inputReturnActive = step >= 3;
  const opticalSignalActive = step >= 4;
  const phototransistorOn = step >= 5;
  const mosfetGateActive = step >= 6;
  const mosfetOn = step >= 7;
  const outputInternalActive = step >= 7;
  const outputCurrentActive = step >= 8;
  const dcSourceActive = outputCurrentActive;
  const loadLedOn = outputCurrentActive;

  return {
    ...control,
    inputDcSourceActive,
    inputDcActive,
    inputSourceWireActive,
    inputCurrentActive,
    inputResistorActive,
    inputLedOn,
    inputReturnActive,
    opticalSignalActive,
    phototransistorOn,
    mosfetGateActive,
    mosfetOn,
    outputInternalActive,
    dcSourceActive,
    loadLedOn,
    outputCurrentActive,
    circuitOn: outputCurrentActive,
    currentStepTitle: timelineStep.title,
    currentStepExplanation: timelineStep.explanation,
    currentFlowDirection: timelineStep.currentFlowDirection,
  };
}

/* =========================================================
   BASE COMPONENT GEOMETRY
   ========================================================= */

export const BASE_COMPONENT = {
  frame: {
    x: 58,
    y: 15,
    width: 851,
    height: 373,
  },

  inputDcSource: {
    topTerminal: { x: -95, y: 112 },
    bottomTerminal: { x: -95, y: 314 },

    longPlate: {
      center: { x: -95, y: 168 },
      halfWidth: 30,
    },

    shortPlate: {
      center: { x: -95, y: 252 },
      halfWidth: 18,
    },

    plusSymbol: {
      center: { x: -135, y: 168 },
    },

    minusSymbol: {
      center: { x: -135, y: 252 },
    },

    label: { x: -95, y: 360 },
  },

  inputTerminal: {
    topNode: { x: 59, y: 112 },
    bottomNode: { x: 59, y: 314 },
    plus: { x: 23, y: 113, size: 31 },
    minus: { x: 23, y: 314, size: 31 },
    label: { x: 23, y: 222 },
  },

  outputTerminal: {
    topNode: { x: 909, y: 62 },
    bottomNode: { x: 909, y: 346 },
    plus: { x: 956, y: 62, size: 30 },
    minus: { x: 956, y: 346, size: 31 },
    label: { x: 947, y: 222 },
  },

  inputResistor: {
    start: { x: 128, y: 112 },
    end: { x: 198, y: 112 },
    amplitude: 11,
    segments: 7,
    label: { x: 162, y: 82 },
  },

  diode: {
    topTerminal: { x: 285, y: 112 },
    bottomTerminal: { x: 285, y: 314 },
    plateY: 179,
    plateHalfWidth: 30,
    triangleTop: { x: 285, y: 187 },
    triangleLeft: { x: 263, y: 238 },
    triangleRight: { x: 307, y: 238 },
    label: { x: 241, y: 152 },
  },

  led: {
    topTerminal: { x: 440, y: 112 },
    bottomTerminal: { x: 440, y: 314 },
    triangleTopY: 178,
    triangleBottomY: 228,
    triangleHalfWidth: 22,
    plateY: 237,
    plateHalfWidth: 30,
    label: { x: 397, y: 157 },
  },

  light: {
    upper: {
      start: { x: 496, y: 178 },
      end: { x: 527, y: 209 },
    },
    lower: {
      start: { x: 496, y: 212 },
      end: { x: 527, y: 243 },
    },
  },

  photoTransistor: {
    center: { x: 594, y: 215 },
    radius: 36,
    topTerminal: { x: 612, y: 162 },
    bottomTerminal: { x: 612, y: 273 },
    label: { x: 610, y: 296 },
  },

  photoResistor: {
    topTerminal: { x: 644, y: 83 },
    bottomTerminal: { x: 644, y: 158 },
    amplitude: 10,
    segments: 7,
    label: { x: 614, y: 111 },
  },

  mosfet: {
    gateTarget: { x: 725, y: 214 },
    symbolScale: 3.25,
    label: { x: 770, y: 135 },
  },

  loadLed: {
    // Correct polarity:
    // Anode = right side, connected to Output DC Source +
    // Cathode = left side, connected to SSR Output +
    cathode: { x: 1020, y: 62 },
    anode: { x: 1110, y: 62 },

    // Triangle points left from anode side toward cathode bar.
    triangleBaseCenter: { x: 1090, y: 62 },
    triangleTip: { x: 1055, y: 62 },
    triangleHalfHeight: 18,

    // Cathode bar is on the left side.
    plateCenter: { x: 1040, y: 62 },
    plateHalfHeight: 22,

    upperLight: {
      start: { x: 1058, y: 38 },
      end: { x: 1086, y: 18 },
    },

    lowerLight: {
      start: { x: 1072, y: 48 },
      end: { x: 1100, y: 28 },
    },

    label: { x: 1065, y: 108 },
  },

  dcSource: {
    topTerminal: { x: 1165, y: 62 },
    bottomTerminal: { x: 1165, y: 346 },

    longPlate: {
      center: { x: 1165, y: 158 },
      halfWidth: 32,
    },

    shortPlate: {
      center: { x: 1165, y: 232 },
      halfWidth: 20,
    },

    plusSymbol: {
      center: { x: 1210, y: 158 },
    },

    minusSymbol: {
      center: { x: 1210, y: 232 },
    },

    label: { x: 1165, y: 300 },
  },

  title: {
    position: { x: 68, y: 360 },
  },
};

/* =========================================================
   COMPONENT TUNING CONTROL SECTION
   ========================================================= */

export const COMPONENT = {
  frame: tune(),

  inputDcSource: tune({
    leftRight: INPUT_DC_SOURCE_OFFSET.x,
    upDown: INPUT_DC_SOURCE_OFFSET.y,
  }),

  inputTerminal: tune(),
  outputTerminal: tune(),

  inputResistor: tune({
    leftRight: INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_SIDE_GROUP_OFFSET.y,
  }),

  diode: tune({
    leftRight: INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_SIDE_GROUP_OFFSET.y,
  }),

  led: tune({
    leftRight: INPUT_SIDE_GROUP_OFFSET.x,
    upDown: INPUT_SIDE_GROUP_OFFSET.y,
  }),

  light: tune({
    leftRight: OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  photoTransistor: tune({
    leftRight: OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  photoResistor: tune({
    leftRight: OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  mosfet: tune({
    leftRight: OUTPUT_SIDE_GROUP_OFFSET.x,
    upDown: OUTPUT_SIDE_GROUP_OFFSET.y,
  }),

  gatePulldownResistor: tune(),

  loadLed: tune({
    leftRight: EXTERNAL_OUTPUT_CIRCUIT_OFFSET.x,
    upDown: EXTERNAL_OUTPUT_CIRCUIT_OFFSET.y,
  }),

  dcSource: tune({
    leftRight: EXTERNAL_OUTPUT_CIRCUIT_OFFSET.x,
    upDown: EXTERNAL_OUTPUT_CIRCUIT_OFFSET.y,
  }),

  labels: tune(),
  title: tune(),
};

/* =========================================================
   MOSFET SYMBOL CONSTANTS
   ========================================================= */

export const P_CHANNEL_MOSFET_SYMBOL_VIEW_BOX: ElectronicsSymbolViewBox = {
  minX: -10,
  minY: -10,
  width: 61,
  height: 71,
};

export const P_CHANNEL_MOSFET_TERMINAL_OFFSET: ElectronicsSymbolTerminalMap = {
  gate: { x: 0, y: 30 },
  drain: { x: 30, y: 0 },
  source: { x: 30, y: 50 },
};

const P_CHANNEL_MOSFET_INTERNAL_SHIFT: Point = {
  x: 0.5,
  y: 0.5,
};

function getMosfetLayout() {
  const control = COMPONENT.mosfet;

  const scaleX =
    BASE_COMPONENT.mosfet.symbolScale *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.widthScale;

  const scaleY =
    BASE_COMPONENT.mosfet.symbolScale *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.heightScale;

  const gateTarget = componentPoint(BASE_COMPONENT.mosfet.gateTarget, control);

  const placement = {
    x:
      gateTarget.x -
      (P_CHANNEL_MOSFET_TERMINAL_OFFSET.gate.x -
        P_CHANNEL_MOSFET_SYMBOL_VIEW_BOX.minX +
        P_CHANNEL_MOSFET_INTERNAL_SHIFT.x) *
        scaleX,

    y:
      gateTarget.y -
      (P_CHANNEL_MOSFET_TERMINAL_OFFSET.gate.y -
        P_CHANNEL_MOSFET_SYMBOL_VIEW_BOX.minY +
        P_CHANNEL_MOSFET_INTERNAL_SHIFT.y) *
        scaleY,

    scaleX,
    scaleY,
  };

  const terminal = (name: keyof ElectronicsSymbolTerminalMap): Point => {
    const baseTerminal = P_CHANNEL_MOSFET_TERMINAL_OFFSET[name];
    const debugOffset = DEBUG_TERMINAL_OFFSET[name];

    return {
      x:
        placement.x +
        (baseTerminal.x -
          P_CHANNEL_MOSFET_SYMBOL_VIEW_BOX.minX +
          P_CHANNEL_MOSFET_INTERNAL_SHIFT.x) *
          scaleX +
        debugOffset.x,

      y:
        placement.y +
        (baseTerminal.y -
          P_CHANNEL_MOSFET_SYMBOL_VIEW_BOX.minY +
          P_CHANNEL_MOSFET_INTERNAL_SHIFT.y) *
          scaleY +
        debugOffset.y,
    };
  };

  return {
    placement,
    terminals: {
      gate: terminal("gate"),
      drain: terminal("drain"),
      source: terminal("source"),
    },
  };
}

/* =========================================================
   DC SOURCE POINT CONTROL HELPERS
   ========================================================= */

function getControlledInputDcSourcePoint(point: Point, offset: Point): Point {
  return componentPoint(
    {
      x: point.x + offset.x,
      y: point.y + offset.y,
    },
    COMPONENT.inputDcSource,
  );
}

function getControlledDcSourcePoint(point: Point, offset: Point): Point {
  return componentPoint(
    {
      x: point.x + offset.x,
      y: point.y + offset.y,
    },
    COMPONENT.dcSource,
  );
}

/* =========================================================
   RESISTOR POINT HELPERS
   ========================================================= */

function getHorizontalResistorPoints(
  base: HorizontalResistorBase,
  control: ComponentTune,
): Point[] {
  const start = componentPoint(base.start, control);
  const end = componentPoint(base.end, control);

  const amplitude =
    base.amplitude *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.heightScale;

  const length = end.x - start.x;
  const step = length / base.segments;

  return Array.from({ length: base.segments + 1 }, (_, index) => {
    if (index === 0) return start;
    if (index === base.segments) return end;

    return {
      x: start.x + step * index,
      y: index % 2 === 0 ? start.y + amplitude : start.y - amplitude,
    };
  });
}

function getVerticalResistorPoints(
  base: VerticalResistorBase,
  control: ComponentTune,
): Point[] {
  const top = componentPoint(base.topTerminal, control);
  const bottom = componentPoint(base.bottomTerminal, control);

  const amplitude =
    base.amplitude *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.widthScale;

  const length = bottom.y - top.y;
  const step = length / base.segments;

  return Array.from({ length: base.segments + 1 }, (_, index) => {
    if (index === 0) return top;
    if (index === base.segments) return bottom;

    return {
      x: index % 2 === 0 ? top.x + amplitude : top.x - amplitude,
      y: top.y + step * index,
    };
  });
}

function getVerticalResistorBetweenPoints({
  top,
  bottom,
  amplitude,
  segments,
}: {
  top: Point;
  bottom: Point;
  amplitude: number;
  segments: number;
}): Point[] {
  const length = bottom.y - top.y;
  const step = length / segments;

  return Array.from({ length: segments + 1 }, (_, index) => {
    if (index === 0) return top;
    if (index === segments) return bottom;

    return {
      x: index % 2 === 0 ? top.x + amplitude : top.x - amplitude,
      y: top.y + step * index,
    };
  });
}

/* =========================================================
   LIGHT ARROW POINT HELPERS
   ========================================================= */

function getLightArrowPoints({
  start,
  end,
  startOffset,
  endOffset,
}: {
  start: Point;
  end: Point;
  startOffset: Point;
  endOffset: Point;
}): Point[] {
  const control = COMPONENT.light;

  const s = componentPoint(
    {
      x: start.x + startOffset.x,
      y: start.y + startOffset.y,
    },
    control,
  );

  const e = componentPoint(
    {
      x: end.x + endOffset.x,
      y: end.y + endOffset.y,
    },
    control,
  );

  return [s, e];
}

/* =========================================================
   CIRCUIT POINTS
   ========================================================= */

function getCircuitPoints() {
  const mosfet = getMosfetLayout();

  const inputDcSourceTop = getControlledInputDcSourcePoint(
    BASE_COMPONENT.inputDcSource.topTerminal,
    INPUT_DC_SOURCE_CONTROL.topTerminalOffset,
  );

  const inputDcSourceBottom = getControlledInputDcSourcePoint(
    BASE_COMPONENT.inputDcSource.bottomTerminal,
    INPUT_DC_SOURCE_CONTROL.bottomTerminalOffset,
  );

  const inputTop = componentPoint(
    BASE_COMPONENT.inputTerminal.topNode,
    COMPONENT.inputTerminal,
  );

  const inputBottom = componentPoint(
    BASE_COMPONENT.inputTerminal.bottomNode,
    COMPONENT.inputTerminal,
  );

  const outputTop = componentPoint(
    BASE_COMPONENT.outputTerminal.topNode,
    COMPONENT.outputTerminal,
  );

  const outputBottom = componentPoint(
    BASE_COMPONENT.outputTerminal.bottomNode,
    COMPONENT.outputTerminal,
  );

  const inputResistorStart = componentPoint(
    BASE_COMPONENT.inputResistor.start,
    COMPONENT.inputResistor,
  );

  const inputResistorEnd = componentPoint(
    BASE_COMPONENT.inputResistor.end,
    COMPONENT.inputResistor,
  );

  const diodeTop = componentPoint(
    BASE_COMPONENT.diode.topTerminal,
    COMPONENT.diode,
  );

  const diodeBottom = componentPoint(
    BASE_COMPONENT.diode.bottomTerminal,
    COMPONENT.diode,
  );

  const ledTop = componentPoint(BASE_COMPONENT.led.topTerminal, COMPONENT.led);

  const ledBottom = componentPoint(
    BASE_COMPONENT.led.bottomTerminal,
    COMPONENT.led,
  );

  const photoTop = componentLocalPoint(
    BASE_COMPONENT.photoTransistor.topTerminal,
    BASE_COMPONENT.photoTransistor.center,
    COMPONENT.photoTransistor,
  );

  const photoBottom = componentLocalPoint(
    BASE_COMPONENT.photoTransistor.bottomTerminal,
    BASE_COMPONENT.photoTransistor.center,
    COMPONENT.photoTransistor,
  );

  const photoResistorTop = componentPoint(
    BASE_COMPONENT.photoResistor.topTerminal,
    COMPONENT.photoResistor,
  );

  const photoResistorBottom = componentPoint(
    BASE_COMPONENT.photoResistor.bottomTerminal,
    COMPONENT.photoResistor,
  );

  const loadLedAnode = componentPoint(
    BASE_COMPONENT.loadLed.anode,
    COMPONENT.loadLed,
  );

  const loadLedCathode = componentPoint(
    BASE_COMPONENT.loadLed.cathode,
    COMPONENT.loadLed,
  );

  const dcSourceTop = getControlledDcSourcePoint(
    BASE_COMPONENT.dcSource.topTerminal,
    DC_SOURCE_CONTROL.topTerminalOffset,
  );

  const dcSourceBottom = getControlledDcSourcePoint(
    BASE_COMPONENT.dcSource.bottomTerminal,
    DC_SOURCE_CONTROL.bottomTerminalOffset,
  );

  const gatePulldownX =
    mosfet.terminals.gate.x +
    2 +
    GATE_PULLDOWN_RESISTOR_CONTROL.topOffset.x +
    COMPONENT.gatePulldownResistor.leftRight;

  const gatePulldownTop = {
    x: gatePulldownX,
    y:
      photoBottom.y +
      GATE_PULLDOWN_RESISTOR_CONTROL.topOffset.y +
      COMPONENT.gatePulldownResistor.upDown,
  };

  const gatePulldownBottom = {
    x: gatePulldownX + GATE_PULLDOWN_RESISTOR_CONTROL.bottomOffset.x,
    y:
      outputBottom.y +
      GATE_PULLDOWN_RESISTOR_CONTROL.bottomOffset.y +
      COMPONENT.gatePulldownResistor.upDown,
  };

  return {
    mosfet,

    inputDcSourceTop,
    inputDcSourceBottom,

    inputTop,
    inputBottom,
    outputTop,
    outputBottom,

    inputResistorStart,
    inputResistorEnd,

    diodeTop,
    diodeBottom,

    ledTop,
    ledBottom,

    photoTop,
    photoBottom,

    photoResistorTop,
    photoResistorBottom,

    loadLedAnode,
    loadLedCathode,

    dcSourceTop,
    dcSourceBottom,

    gatePulldownTop,
    gatePulldownBottom,
  };
}

/* =========================================================
   STRUCTURED WIRE SEGMENTS
   ========================================================= */

function getStructuredWireSegments(
  simulation: SimulationDerivedState,
): WireSegment[] {
  const p = getCircuitPoints();
  const mosfet = p.mosfet.terminals;

  const gateSupplyActive =
    simulation.phototransistorOn ||
    simulation.mosfetGateActive ||
    simulation.mosfetOn ||
    simulation.outputCurrentActive;

  const segments: WireSegment[] = [
    {
      id: "input-dc-source-positive-to-input-positive",
      points: controlledWireRoute(
        p.inputDcSourceTop,
        p.inputTop,
        INPUT_DC_SOURCE_WIRE_CONTROL.positiveToInputPositive,
      ),
      active: simulation.inputSourceWireActive,
      flowType: "input",
    },

    {
      id: "input-negative-to-input-dc-source-negative",
      points: controlledWireRoute(
        p.inputBottom,
        p.inputDcSourceBottom,
        INPUT_DC_SOURCE_WIRE_CONTROL.inputNegativeToSourceNegative,
      ),
      active: simulation.inputReturnActive,
      flowType: "input",
    },

    {
      id: "input-positive-to-resistor",
      points: [p.inputTop, p.inputResistorStart],
      active: simulation.inputCurrentActive,
      flowType: "input",
    },

    {
      id: "input-positive-bus",
      points: [p.inputResistorEnd, p.ledTop],
      active: simulation.inputCurrentActive,
      flowType: "input",
    },

    {
      id: "input-negative-bus",
      points: [p.inputBottom, p.ledBottom],
      active: simulation.inputLedOn,
      flowType: "input",
    },

    {
      id: "output-top-rail",
      points: [{ x: p.photoResistorTop.x, y: p.outputTop.y }, p.outputTop],
      active: gateSupplyActive,
      flowType: "gate",
    },

    {
      id: "photo-resistor-top-lead",
      points: [
        { x: p.photoResistorTop.x, y: p.outputTop.y },
        p.photoResistorTop,
      ],
      active: gateSupplyActive,
      flowType: "gate",
    },

    {
      id: "photo-resistor-to-phototransistor",
      points: [
        p.photoResistorBottom,
        { x: p.photoResistorBottom.x, y: p.photoTop.y },
        p.photoTop,
      ],
      active: simulation.phototransistorOn,
      flowType: "gate",
    },

    {
      id: "phototransistor-to-mosfet-gate",
      points: [
        p.photoBottom,
        p.gatePulldownTop,
        { x: p.gatePulldownTop.x, y: mosfet.gate.y },
        mosfet.gate,
      ],
      active: simulation.mosfetGateActive,
      flowType: "gate",
    },
  ];

  if (GATE_PULLDOWN_RESISTOR_CONTROL.enabled) {
    segments.push({
      id: "gate-pulldown-resistor-to-output-negative",
      points: [
        p.gatePulldownBottom,
        { x: mosfet.source.x, y: p.outputBottom.y },
      ],
      active: simulation.mosfetGateActive,
      flowType: "gate",
    });
  }

  segments.push(
    {
      id: "mosfet-drain-to-output-positive",
      points: [{ x: mosfet.drain.x, y: p.outputTop.y }, mosfet.drain],
      active: simulation.outputInternalActive,
      flowType: "output",
    },

    {
      id: "mosfet-source-to-output-negative",
      points: [
        mosfet.source,
        { x: mosfet.source.x, y: p.outputBottom.y },
        p.outputBottom,
      ],
      active: simulation.outputInternalActive,
      flowType: "output",
    },

    {
      id: "output-positive-to-load-led-cathode",
      points: controlledWireRoute(
        p.outputTop,
        p.loadLedCathode,
        LOAD_LED_WIRE_CONTROL.outputPositiveToLoadLed,
      ),
      active: simulation.outputCurrentActive,
      flowType: "output",
    },

    {
      id: "load-led-anode-to-dc-source-positive",
      points: controlledWireRoute(
        p.loadLedAnode,
        p.dcSourceTop,
        LOAD_LED_WIRE_CONTROL.loadLedToDcSourcePositive,
      ),
      active: simulation.outputCurrentActive,
      flowType: "output",
    },

    {
      id: "dc-source-negative-to-output-negative",
      points: [p.dcSourceBottom, p.outputBottom],
      active: simulation.outputCurrentActive,
      flowType: "output",
    },
  );

  return segments;
}

/* =========================================================
   CURRENT FLOW PATHS
   ========================================================= */

function getCurrentFlowPaths(
  simulation: SimulationDerivedState,
): CurrentFlowPath[] {
  const p = getCircuitPoints();
  const mosfet = p.mosfet.terminals;

  const inputSourcePositivePath = controlledWireRoute(
    p.inputDcSourceTop,
    p.inputTop,
    INPUT_DC_SOURCE_WIRE_CONTROL.positiveToInputPositive,
  );

  const inputSourceNegativePath = controlledWireRoute(
    p.inputBottom,
    p.inputDcSourceBottom,
    INPUT_DC_SOURCE_WIRE_CONTROL.inputNegativeToSourceNegative,
  );

  const inputResistorPath = getHorizontalResistorPoints(
    BASE_COMPONENT.inputResistor,
    COMPONENT.inputResistor,
  );

  const photoResistorPath = getVerticalResistorPoints(
    BASE_COMPONENT.photoResistor,
    COMPONENT.photoResistor,
  );

  const gatePulldownResistorPath = getVerticalResistorBetweenPoints({
    top: p.gatePulldownTop,
    bottom: p.gatePulldownBottom,
    amplitude: GATE_PULLDOWN_RESISTOR_CONTROL.amplitude,
    segments: GATE_PULLDOWN_RESISTOR_CONTROL.segments,
  });

  const upperOpticalPath = getLightArrowPoints({
    start: BASE_COMPONENT.light.upper.start,
    end: BASE_COMPONENT.light.upper.end,
    startOffset: LIGHT_ARROW_CONTROL.upper.startOffset,
    endOffset: LIGHT_ARROW_CONTROL.upper.endOffset,
  });

  const lowerOpticalPath = getLightArrowPoints({
    start: BASE_COMPONENT.light.lower.start,
    end: BASE_COMPONENT.light.lower.end,
    startOffset: LIGHT_ARROW_CONTROL.lower.startOffset,
    endOffset: LIGHT_ARROW_CONTROL.lower.endOffset,
  });

  const outputPositiveToLoadLedCathode = controlledWireRoute(
    p.outputTop,
    p.loadLedCathode,
    LOAD_LED_WIRE_CONTROL.outputPositiveToLoadLed,
  );

  const loadLedAnodeToDcSourcePositive = controlledWireRoute(
    p.loadLedAnode,
    p.dcSourceTop,
    LOAD_LED_WIRE_CONTROL.loadLedToDcSourcePositive,
  );

  const gateTopRailPath: Point[] = [
    p.outputTop,
    { x: p.photoResistorTop.x, y: p.outputTop.y },
  ];

  const photoResistorTopLeadPath: Point[] = [
    { x: p.photoResistorTop.x, y: p.outputTop.y },
    p.photoResistorTop,
  ];

  const gateTopRailActive =
    simulation.phototransistorOn ||
    simulation.mosfetGateActive ||
    simulation.mosfetOn ||
    simulation.outputInternalActive ||
    simulation.outputCurrentActive;

  const sourcePositiveToLoadLedAnode = reversePoints(
    loadLedAnodeToDcSourcePositive,
  );

  const loadLedCathodeToOutputPositive = reversePoints(
    outputPositiveToLoadLedCathode,
  );

  const completeOutputCurrentLoopPath: Point[] = [
    // Output DC Source + to Load LED anode.
    ...sourcePositiveToLoadLedAnode,

    // Through Load LED from anode to cathode.
    p.loadLedCathode,

    // Load LED cathode to SSR Output +.
    ...loadLedCathodeToOutputPositive.slice(1),

    // SSR Output + to MOSFET drain.
    { x: mosfet.drain.x, y: p.outputTop.y },
    mosfet.drain,

    // MOSFET drain to source.
    mosfet.source,

    // MOSFET source to SSR Output −.
    { x: mosfet.source.x, y: p.outputBottom.y },
    p.outputBottom,

    // Return to Output DC Source −.
    p.dcSourceBottom,
  ];

  return [
    {
      id: "input-dc-source-positive-dots",
      points: inputSourcePositivePath,
      active: simulation.inputSourceWireActive,
      flowType: "input",
    },
    {
      id: "input-terminal-to-resistor-dots",
      points: [p.inputTop, p.inputResistorStart],
      active: simulation.inputCurrentActive,
      flowType: "input",
    },
    {
      id: "input-resistor-dots",
      points: inputResistorPath,
      active: simulation.inputResistorActive,
      flowType: "input",
    },
    {
      id: "input-resistor-to-led-dots",
      points: [p.inputResistorEnd, p.ledTop],
      active: simulation.inputCurrentActive,
      flowType: "input",
    },
    {
      id: "input-led-body-dots",
      points: [p.ledTop, p.ledBottom],
      active: simulation.inputLedOn,
      flowType: "input",
    },
    {
      id: "input-led-return-dots",
      points: [p.ledBottom, p.inputBottom],
      active: simulation.inputReturnActive,
      flowType: "input",
    },
    {
      id: "input-dc-source-negative-return-dots",
      points: inputSourceNegativePath,
      active: simulation.inputReturnActive,
      flowType: "input",
    },

    {
      id: "upper-optical-dots",
      points: upperOpticalPath,
      active: simulation.opticalSignalActive,
      flowType: "optical",
    },
    {
      id: "lower-optical-dots",
      points: lowerOpticalPath,
      active: simulation.opticalSignalActive,
      flowType: "optical",
    },

    {
      id: "output-top-rail-gate-dots",
      points: gateTopRailPath,
      active: gateTopRailActive,
      flowType: "gate",
    },
    {
      id: "photo-resistor-top-lead-dots",
      points: photoResistorTopLeadPath,
      active: gateTopRailActive,
      flowType: "gate",
    },
    {
      id: "photo-resistor-dots",
      points: photoResistorPath,
      active: simulation.phototransistorOn,
      flowType: "gate",
    },
    {
      id: "photo-to-transistor-dots",
      points: [
        p.photoResistorBottom,
        { x: p.photoResistorBottom.x, y: p.photoTop.y },
        p.photoTop,
      ],
      active: simulation.phototransistorOn,
      flowType: "gate",
    },
    {
      id: "phototransistor-to-gate-dots",
      points: [
        p.photoBottom,
        p.gatePulldownTop,
        { x: p.gatePulldownTop.x, y: mosfet.gate.y },
        mosfet.gate,
      ],
      active: simulation.mosfetGateActive,
      flowType: "gate",
    },
    {
      id: "gate-pulldown-dots",
      points: gatePulldownResistorPath,
      active:
        simulation.mosfetGateActive && GATE_PULLDOWN_RESISTOR_CONTROL.enabled,
      flowType: "gate",
    },

    {
      id: "complete-output-current-loop-dots",
      points: completeOutputCurrentLoopPath,
      active: simulation.outputCurrentActive,
      flowType: "output",
    },
  ];
}

/* =========================================================
   REUSABLE SVG BLOCKS
   ========================================================= */

function WirePolyline({
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
      d={polylinePath(points)}
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
  return <circle cx={point.x} cy={point.y} r={radius} fill={color} />;
}

function LabelText({
  point,
  children,
  size = 24,
  rotate,
  fill = LABEL.color,
  anchor = "middle",
}: {
  point: Point;
  children: React.ReactNode;
  size?: number;
  rotate?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={point.x}
      y={point.y}
      fill={fill}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontFamily={LABEL.family}
      fontSize={size}
      fontWeight={LABEL.weight}
      transform={rotate ? `rotate(${rotate} ${point.x} ${point.y})` : undefined}
    >
      {children}
    </text>
  );
}

function CurrentFlowDots({ path }: { path: CurrentFlowPath }) {
  if (!CURRENT_DOT_CONTROL.enabled || !path.active) return null;

  const d = polylinePath(path.points);
  const color = flowColor(path.flowType);
  const duration = CURRENT_DOT_CONTROL.speedSeconds[path.flowType];
  const dotCount = CURRENT_DOT_CONTROL.count;

  return (
    <>
      {Array.from({ length: dotCount }, (_, index) => {
        const delay = -(duration / dotCount) * index;

        return (
          <circle
            key={`${path.id}-dot-${index}`}
            r={CURRENT_DOT_CONTROL.radius}
            fill={color}
            opacity={0.88}
          >
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              path={d}
              begin={`${delay}s`}
            />
          </circle>
        );
      })}
    </>
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
      <WirePolyline
        points={[
          { x: center.x - half, y: center.y },
          { x: center.x + half, y: center.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePolyline
        points={[
          { x: center.x, y: center.y - half },
          { x: center.x, y: center.y + half },
        ]}
        width={WIRE.symbolWidth}
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
    <WirePolyline
      points={[
        { x: center.x - half, y: center.y },
        { x: center.x + half, y: center.y },
      ]}
      width={WIRE.symbolWidth}
      color={color}
    />
  );
}

function PlusSymbol({
  center,
  size,
  control,
  active = false,
  flowType = "none",
}: {
  center: Point;
  size: number;
  control: ComponentTune;
  active?: boolean;
  flowType?: FlowType;
}) {
  const p = componentPoint(center, control);
  const half = componentSize(size, control) / 2;
  const color = active ? flowColor(flowType) : WIRE.color;

  return (
    <>
      <WirePolyline
        points={[
          { x: p.x - half, y: p.y },
          { x: p.x + half, y: p.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePolyline
        points={[
          { x: p.x, y: p.y - half },
          { x: p.x, y: p.y + half },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />
    </>
  );
}

function MinusSymbol({
  center,
  size,
  control,
  active = false,
  flowType = "none",
}: {
  center: Point;
  size: number;
  control: ComponentTune;
  active?: boolean;
  flowType?: FlowType;
}) {
  const p = componentPoint(center, control);
  const half = componentSize(size, control) / 2;
  const color = active ? flowColor(flowType) : WIRE.color;

  return (
    <WirePolyline
      points={[
        { x: p.x - half, y: p.y },
        { x: p.x + half, y: p.y },
      ]}
      width={WIRE.symbolWidth}
      color={color}
    />
  );
}

/* =========================================================
   REUSABLE RESISTOR BLOCKS
   ========================================================= */

function HorizontalResistor({
  base,
  control,
  active = false,
}: {
  base: HorizontalResistorBase;
  control: ComponentTune;
  active?: boolean;
}) {
  return (
    <WirePolyline
      points={getHorizontalResistorPoints(base, control)}
      width={active ? WIRE.activeWidth : WIRE.symbolWidth}
      color={active ? SIMULATION_COLORS.input : WIRE.color}
    />
  );
}

function VerticalResistor({
  base,
  control,
  active = false,
}: {
  base: VerticalResistorBase;
  control: ComponentTune;
  active?: boolean;
}) {
  return (
    <WirePolyline
      points={getVerticalResistorPoints(base, control)}
      width={active ? WIRE.activeWidth : WIRE.symbolWidth}
      color={active ? SIMULATION_COLORS.gate : WIRE.color}
    />
  );
}

function VerticalResistorBetweenPoints({
  top,
  bottom,
  amplitude,
  segments,
  active = false,
}: {
  top: Point;
  bottom: Point;
  amplitude: number;
  segments: number;
  active?: boolean;
}) {
  return (
    <WirePolyline
      points={getVerticalResistorBetweenPoints({
        top,
        bottom,
        amplitude,
        segments,
      })}
      width={active ? WIRE.activeWidth : WIRE.symbolWidth}
      color={active ? SIMULATION_COLORS.gate : WIRE.color}
    />
  );
}

/* =========================================================
   DIODE BLOCK
   ========================================================= */

function InputDiodeSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.diode;
  const control = COMPONENT.diode;
  const color = active ? SIMULATION_COLORS.input : WIRE.color;

  const top = componentPoint(base.topTerminal, control);
  const bottom = componentPoint(base.bottomTerminal, control);

  const plateCenter = componentPoint(
    { x: base.topTerminal.x, y: base.plateY + 10 },
    control,
  );

  const plateHalf =
    base.plateHalfWidth *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.widthScale;

  const triangleTop = componentPoint(base.triangleTop, control);

  const triangleHalf =
    ((base.triangleRight.x - base.triangleLeft.x) / 2) *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.widthScale;

  const triangleHeight =
    (base.triangleLeft.y - base.triangleTop.y) *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.heightScale;

  const triangleLeft = {
    x: triangleTop.x - triangleHalf,
    y: triangleTop.y + triangleHeight,
  };

  const triangleRight = {
    x: triangleTop.x + triangleHalf,
    y: triangleTop.y + triangleHeight,
  };

  return (
    <>
      <WirePolyline points={[top, plateCenter]} color={color} />

      <WirePolyline
        points={[{ x: triangleTop.x, y: triangleLeft.y }, bottom]}
        color={color}
      />

      <WirePolyline
        points={[
          { x: plateCenter.x - plateHalf, y: plateCenter.y },
          { x: plateCenter.x + plateHalf, y: plateCenter.y },
        ]}
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
        fill={active ? activeSoftFill("input") : COLORS.yellow}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
        strokeLinejoin={PATH.strokeLinejoin}
      />
    </>
  );
}

/* =========================================================
   INPUT LED BLOCK
   ========================================================= */

function LedSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.led;
  const control = COMPONENT.led;
  const color = active ? SIMULATION_COLORS.input : WIRE.color;

  const top = componentPoint(base.topTerminal, control);
  const bottom = componentPoint(base.bottomTerminal, control);

  const triangleTopCenter = componentPoint(
    { x: base.topTerminal.x, y: base.triangleTopY + 20 },
    control,
  );

  const triangleHalf =
    base.triangleHalfWidth *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.widthScale;

  const triangleHeight =
    (base.triangleBottomY - base.triangleTopY) *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.heightScale;

  const triangleLeft = {
    x: triangleTopCenter.x - triangleHalf,
    y: triangleTopCenter.y,
  };

  const triangleRight = {
    x: triangleTopCenter.x + triangleHalf,
    y: triangleTopCenter.y,
  };

  const triangleBottom = {
    x: triangleTopCenter.x,
    y: triangleTopCenter.y + triangleHeight,
  };

  const plateCenter = componentPoint(
    { x: base.topTerminal.x, y: base.plateY },
    control,
  );

  const plateHalf =
    base.plateHalfWidth *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.widthScale;

  return (
    <>
      <WirePolyline points={[top, triangleTopCenter]} color={color} />

      <WirePolyline points={[plateCenter, bottom]} color={color} />

      <path
        d={`
          M ${triangleLeft.x} ${triangleLeft.y}
          L ${triangleRight.x} ${triangleRight.y}
          L ${triangleBottom.x} ${triangleBottom.y}
          Z
        `}
        fill={active ? COLORS.yellow : COLORS.fill}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
        strokeLinejoin={PATH.strokeLinejoin}
      />

      <WirePolyline
        points={[
          { x: plateCenter.x - plateHalf, y: plateCenter.y },
          { x: plateCenter.x + plateHalf, y: plateCenter.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />
    </>
  );
}

/* =========================================================
   LIGHT ARROW BLOCK
   ========================================================= */

function LightArrow({
  start,
  end,
  startOffset = { x: 0, y: 0 },
  endOffset = { x: 0, y: 0 },
  active,
}: {
  start: Point;
  end: Point;
  startOffset?: Point;
  endOffset?: Point;
  active: boolean;
}) {
  if (!active) return null;

  const [s, e] = getLightArrowPoints({
    start,
    end,
    startOffset,
    endOffset,
  });

  const control = COMPONENT.light;
  const arrowSize = componentSize(LIGHT_ARROW_CONTROL.arrowHeadLength, control);
  const angleOffset = LIGHT_ARROW_CONTROL.arrowHeadAngleOffset;

  return (
    <>
      <WirePolyline
        points={[s, e]}
        width={WIRE.symbolWidth}
        color={SIMULATION_COLORS.optical}
      />

      <WirePolyline
        points={[e, { x: e.x - arrowSize, y: e.y - angleOffset }]}
        width={WIRE.symbolWidth}
        color={SIMULATION_COLORS.optical}
      />

      <WirePolyline
        points={[e, { x: e.x - angleOffset, y: e.y - arrowSize }]}
        width={WIRE.symbolWidth}
        color={SIMULATION_COLORS.optical}
      />
    </>
  );
}

/* =========================================================
   PHOTOTRANSISTOR BLOCK
   ========================================================= */

function PhotoTransistorSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.photoTransistor;
  const control = COMPONENT.photoTransistor;
  const color = active ? SIMULATION_COLORS.gate : WIRE.color;

  const center = componentPoint(base.center, control);

  const scaleX = CIRCUIT_COMPONENT_SCALE * control.scale * control.widthScale;
  const scaleY = CIRCUIT_COMPONENT_SCALE * control.scale * control.heightScale;

  return (
    <g
      transform={`
        translate(${center.x} ${center.y})
        scale(${scaleX} ${scaleY})
        translate(${-base.center.x} ${-base.center.y})
      `}
      fill="none"
      stroke={color}
      strokeLinecap={PATH.strokeLinecap}
      strokeLinejoin={PATH.strokeLinejoin}
    >
      <circle
        cx={base.center.x}
        cy={base.center.y}
        r={base.radius}
        fill={active ? SIMULATION_COLORS.gateSoft : COLORS.fill}
        strokeWidth={WIRE.thinWidth}
      />

      <path d="M 590 190 L 590 246" strokeWidth={WIRE.thinWidth} />
      <path d="M 590 204 L 613 186" strokeWidth={WIRE.thinWidth} />
      <path d="M 590 230 L 613 248" strokeWidth={WIRE.thinWidth} />
      <path d="M 612 187 L 612 162" strokeWidth={WIRE.symbolWidth} />
      <path d="M 612 249 L 612 273" strokeWidth={WIRE.symbolWidth} />

      <path d="M 606 243 L 616 250 L 614 238" strokeWidth={WIRE.thinWidth} />
    </g>
  );
}

/* =========================================================
   P-CHANNEL MOSFET BLOCK
   ========================================================= */

function PChannelMosfetSymbolInline({ active }: { active: boolean }) {
  const layout = getMosfetLayout();
  const color = active ? SIMULATION_COLORS.output : WIRE.color;

  return (
    <g
      transform={`
        translate(${layout.placement.x} ${layout.placement.y})
        scale(${layout.placement.scaleX} ${layout.placement.scaleY})
        translate(${Math.abs(P_CHANNEL_MOSFET_SYMBOL_VIEW_BOX.minX)} ${Math.abs(
          P_CHANNEL_MOSFET_SYMBOL_VIEW_BOX.minY,
        )})
        translate(${P_CHANNEL_MOSFET_INTERNAL_SHIFT.x} ${
          P_CHANNEL_MOSFET_INTERNAL_SHIFT.y
        })
      `}
      fill={active ? SIMULATION_COLORS.outputSoft : "#fff"}
      fillRule="evenodd"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Roboto"
      textAnchor="middle"
    >
      <circle cx="25" cy="25" r="11" strokeWidth="0.5" />

      <path d="M20 19v11H0" fill="none" strokeWidth="0.5" />
      <path d="M23 19v2" fill="none" strokeWidth="0.5" />
      <path d="M23 24v2" fill="none" strokeWidth="0.5" />
      <path d="M23 29v2" fill="none" strokeWidth="0.5" />
      <path d="M23 30h7v20" fill="none" strokeWidth="0.5" />
      <path d="M23 20h7V0" fill="none" strokeWidth="0.5" />
      <path d="M23 25h7v5" fill="none" strokeWidth="0.5" />

      <path d="M27.5 23.75L30 25l-2.5 1.25" fill="none" strokeWidth="0.5" />

      <text fontSize="7" textAnchor="end" fill={color} stroke="none">
        <tspan x="28" y="46.81">
          S
        </tspan>
      </text>

      <text fontSize="7" textAnchor="start" fill={color} stroke="none">
        <tspan x="2" y="26.81">
          G
        </tspan>
      </text>

      <text fontSize="7" textAnchor="end" fill={color} stroke="none">
        <tspan x="28" y="9">
          D
        </tspan>
      </text>
    </g>
  );
}

/* =========================================================
   MOSFET GATE TO GND RESISTOR BLOCK
   ========================================================= */

function GatePulldownResistorSymbol({ active }: { active: boolean }) {
  if (!GATE_PULLDOWN_RESISTOR_CONTROL.enabled) return null;

  const p = getCircuitPoints();

  return (
    <VerticalResistorBetweenPoints
      top={p.gatePulldownTop}
      bottom={p.gatePulldownBottom}
      amplitude={GATE_PULLDOWN_RESISTOR_CONTROL.amplitude}
      segments={GATE_PULLDOWN_RESISTOR_CONTROL.segments}
      active={active}
    />
  );
}

/* =========================================================
   INPUT DC SOURCE BLOCK
   ========================================================= */

function InputDcSourceSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.inputDcSource;
  const control = COMPONENT.inputDcSource;
  const color = active ? SIMULATION_COLORS.input : WIRE.color;

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
      <WirePolyline points={[top, longPlateCenter]} color={color} />

      <WirePolyline
        points={[
          { x: longPlateCenter.x - longHalf, y: longPlateCenter.y },
          { x: longPlateCenter.x + longHalf, y: longPlateCenter.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePolyline
        points={[
          { x: shortPlateCenter.x - shortHalf, y: shortPlateCenter.y },
          { x: shortPlateCenter.x + shortHalf, y: shortPlateCenter.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePolyline points={[shortPlateCenter, bottom]} color={color} />

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
   LOAD LED BLOCK
   ========================================================= */

function LoadLedSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.loadLed;
  const control = COMPONENT.loadLed;
  const color = active ? SIMULATION_COLORS.output : WIRE.color;

  const anode = componentPoint(base.anode, control);
  const cathode = componentPoint(base.cathode, control);

  const triangleBaseCenter = componentLocalPoint(
    base.triangleBaseCenter,
    base.anode,
    control,
  );

  const triangleTip = componentLocalPoint(
    base.triangleTip,
    base.anode,
    control,
  );
  const plateCenter = componentLocalPoint(
    base.plateCenter,
    base.anode,
    control,
  );

  const triangleHalfHeight =
    base.triangleHalfHeight *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.heightScale;

  const plateHalfHeight =
    base.plateHalfHeight *
    CIRCUIT_COMPONENT_SCALE *
    control.scale *
    control.heightScale;

  const upperLightStart = componentPoint(
    {
      x: base.upperLight.start.x + LOAD_LED_CONTROL.upperLight.startOffset.x,
      y: base.upperLight.start.y + LOAD_LED_CONTROL.upperLight.startOffset.y,
    },
    control,
  );

  const upperLightEnd = componentPoint(
    {
      x: base.upperLight.end.x + LOAD_LED_CONTROL.upperLight.endOffset.x,
      y: base.upperLight.end.y + LOAD_LED_CONTROL.upperLight.endOffset.y,
    },
    control,
  );

  const lowerLightStart = componentPoint(
    {
      x: base.lowerLight.start.x + LOAD_LED_CONTROL.lowerLight.startOffset.x,
      y: base.lowerLight.start.y + LOAD_LED_CONTROL.lowerLight.startOffset.y,
    },
    control,
  );

  const lowerLightEnd = componentPoint(
    {
      x: base.lowerLight.end.x + LOAD_LED_CONTROL.lowerLight.endOffset.x,
      y: base.lowerLight.end.y + LOAD_LED_CONTROL.lowerLight.endOffset.y,
    },
    control,
  );

  const arrowSize = componentSize(LOAD_LED_CONTROL.arrowHeadLength, control);
  const angleOffset = LOAD_LED_CONTROL.arrowHeadAngleOffset;

  return (
    <>
      <WirePolyline points={[anode, triangleBaseCenter]} color={color} />

      <path
        d={`
          M ${triangleBaseCenter.x} ${triangleBaseCenter.y - triangleHalfHeight}
          L ${triangleBaseCenter.x} ${triangleBaseCenter.y + triangleHalfHeight}
          L ${triangleTip.x} ${triangleTip.y}
          Z
        `}
        fill={active ? COLORS.yellow : COLORS.fill}
        stroke={color}
        strokeWidth={WIRE.symbolWidth}
        strokeLinejoin={PATH.strokeLinejoin}
      />

      <WirePolyline
        points={[
          { x: plateCenter.x, y: plateCenter.y - plateHalfHeight },
          { x: plateCenter.x, y: plateCenter.y + plateHalfHeight },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePolyline points={[plateCenter, cathode]} color={color} />

      {LOAD_LED_CONTROL.lightArrowEnabled && active ? (
        <>
          <WirePolyline
            points={[upperLightStart, upperLightEnd]}
            width={WIRE.symbolWidth}
            color={SIMULATION_COLORS.optical}
          />

          <WirePolyline
            points={[
              upperLightEnd,
              {
                x: upperLightEnd.x - arrowSize,
                y: upperLightEnd.y + angleOffset,
              },
            ]}
            width={WIRE.symbolWidth}
            color={SIMULATION_COLORS.optical}
          />

          <WirePolyline
            points={[
              upperLightEnd,
              {
                x: upperLightEnd.x - angleOffset,
                y: upperLightEnd.y + arrowSize,
              },
            ]}
            width={WIRE.symbolWidth}
            color={SIMULATION_COLORS.optical}
          />

          <WirePolyline
            points={[lowerLightStart, lowerLightEnd]}
            width={WIRE.symbolWidth}
            color={SIMULATION_COLORS.optical}
          />

          <WirePolyline
            points={[
              lowerLightEnd,
              {
                x: lowerLightEnd.x - arrowSize,
                y: lowerLightEnd.y + angleOffset,
              },
            ]}
            width={WIRE.symbolWidth}
            color={SIMULATION_COLORS.optical}
          />

          <WirePolyline
            points={[
              lowerLightEnd,
              {
                x: lowerLightEnd.x - angleOffset,
                y: lowerLightEnd.y + arrowSize,
              },
            ]}
            width={WIRE.symbolWidth}
            color={SIMULATION_COLORS.optical}
          />
        </>
      ) : null}
    </>
  );
}

/* =========================================================
   OUTPUT DC SOURCE BLOCK
   ========================================================= */

function DcSourceSymbol({ active }: { active: boolean }) {
  const base = BASE_COMPONENT.dcSource;
  const control = COMPONENT.dcSource;
  const color = active ? SIMULATION_COLORS.output : WIRE.color;

  const top = getControlledDcSourcePoint(
    base.topTerminal,
    DC_SOURCE_CONTROL.topTerminalOffset,
  );

  const bottom = getControlledDcSourcePoint(
    base.bottomTerminal,
    DC_SOURCE_CONTROL.bottomTerminalOffset,
  );

  const longPlateCenter = getControlledDcSourcePoint(
    base.longPlate.center,
    DC_SOURCE_CONTROL.longPlateOffset,
  );

  const shortPlateCenter = getControlledDcSourcePoint(
    base.shortPlate.center,
    DC_SOURCE_CONTROL.shortPlateOffset,
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

  const plusSymbolCenter = getControlledDcSourcePoint(
    base.plusSymbol.center,
    DC_SOURCE_CONTROL.plusSymbolOffset,
  );

  const minusSymbolCenter = getControlledDcSourcePoint(
    base.minusSymbol.center,
    DC_SOURCE_CONTROL.minusSymbolOffset,
  );

  return (
    <>
      <WirePolyline points={[top, longPlateCenter]} color={color} />

      <WirePolyline
        points={[
          { x: longPlateCenter.x - longHalf, y: longPlateCenter.y },
          { x: longPlateCenter.x + longHalf, y: longPlateCenter.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePolyline
        points={[
          { x: shortPlateCenter.x - shortHalf, y: shortPlateCenter.y },
          { x: shortPlateCenter.x + shortHalf, y: shortPlateCenter.y },
        ]}
        width={WIRE.symbolWidth}
        color={color}
      />

      <WirePolyline points={[shortPlateCenter, bottom]} color={color} />

      <RawPlusSymbol
        center={plusSymbolCenter}
        size={DC_SOURCE_CONTROL.plusSymbolSize}
        color={color}
      />

      <RawMinusSymbol
        center={minusSymbolCenter}
        size={DC_SOURCE_CONTROL.minusSymbolSize}
        color={color}
      />
    </>
  );
}

/* =========================================================
   DEBUG TERMINAL DOTS
   ========================================================= */

function DebugTerminalDots() {
  if (!DEBUG_TERMINAL_OFFSET.enabled) return null;

  const { terminals } = getMosfetLayout();

  const debugItems = [
    {
      id: "gate",
      label: "G",
      point: terminals.gate,
      color: COLORS.debugGate,
    },
    {
      id: "drain",
      label: "D",
      point: terminals.drain,
      color: COLORS.debugDrain,
    },
    {
      id: "source",
      label: "S",
      point: terminals.source,
      color: COLORS.debugSource,
    },
  ];

  return (
    <>
      {debugItems.map((item) => (
        <g key={item.id}>
          <circle
            cx={item.point.x}
            cy={item.point.y}
            r={DEBUG_TERMINAL_OFFSET.dotRadius}
            fill={item.color}
            stroke="#111827"
            strokeWidth={1}
          />

          <text
            x={item.point.x}
            y={item.point.y - 10}
            textAnchor="middle"
            fontSize={DEBUG_TERMINAL_OFFSET.labelSize}
            fontWeight={700}
            fill={item.color}
          >
            {item.label}
          </text>
        </g>
      ))}
    </>
  );
}

/* =========================================================
   CIRCUIT NODES
   ========================================================= */

function CircuitNodes({ simulation }: { simulation: SimulationDerivedState }) {
  const p = getCircuitPoints();
  const mosfet = p.mosfet.terminals;

  const nodes: {
    point: Point;
    active: boolean;
    flowType: FlowType;
    show: boolean;
  }[] = [
    {
      point: p.inputDcSourceTop,
      active: simulation.inputDcSourceActive,
      flowType: "input",
      show: true,
    },
    {
      point: p.inputDcSourceBottom,
      active: simulation.inputReturnActive || simulation.inputDcSourceActive,
      flowType: "input",
      show: true,
    },

    {
      point: p.inputTop,
      active: simulation.inputDcActive,
      flowType: "input",
      show: false,
    },
    {
      point: p.inputBottom,
      active: simulation.inputReturnActive,
      flowType: "input",
      show: false,
    },
    {
      point: p.diodeTop,
      active: simulation.inputCurrentActive,
      flowType: "input",
      show: false,
    },
    {
      point: p.diodeBottom,
      active: simulation.inputLedOn,
      flowType: "input",
      show: false,
    },

    {
      point: p.outputTop,
      active: simulation.outputCurrentActive || simulation.mosfetOn,
      flowType: "output",
      show: true,
    },
    {
      point: p.outputBottom,
      active: simulation.outputCurrentActive || simulation.mosfetOn,
      flowType: "output",
      show: true,
    },
    {
      point: { x: mosfet.drain.x, y: p.outputTop.y },
      active: simulation.outputInternalActive,
      flowType: "output",
      show: true,
    },
    {
      point: mosfet.drain,
      active: simulation.outputInternalActive,
      flowType: "output",
      show: true,
    },
    {
      point: mosfet.source,
      active: simulation.outputInternalActive,
      flowType: "output",
      show: true,
    },
  ];

  if (GATE_PULLDOWN_RESISTOR_CONTROL.enabled) {
    nodes.push(
      {
        point: p.gatePulldownTop,
        active: simulation.mosfetGateActive,
        flowType: "gate",
        show: true,
      },
      {
        point: p.gatePulldownBottom,
        active: simulation.mosfetGateActive,
        flowType: "gate",
        show: true,
      },
    );
  }

  nodes.push(
    {
      point: p.loadLedAnode,
      active: simulation.loadLedOn,
      flowType: "output",
      show: true,
    },
    {
      point: p.loadLedCathode,
      active: simulation.loadLedOn,
      flowType: "output",
      show: true,
    },
    {
      point: p.dcSourceTop,
      active: simulation.dcSourceActive,
      flowType: "output",
      show: true,
    },
    {
      point: p.dcSourceBottom,
      active: simulation.outputCurrentActive,
      flowType: "output",
      show: true,
    },
  );

  return (
    <>
      {nodes
        .filter((node) => node.show)
        .map((node, index) => (
          <NodeDot
            key={index}
            point={node.point}
            color={node.active ? flowColor(node.flowType) : NODE.color}
          />
        ))}
    </>
  );
}

/* =========================================================
   CIRCUIT LABELS
   ========================================================= */

function CircuitLabels({ simulation }: { simulation: SimulationDerivedState }) {
  const p = getCircuitPoints();

  const inputDcSourceLabel = componentPoint(
    BASE_COMPONENT.inputDcSource.label,
    COMPONENT.inputDcSource,
  );

  const inputLabel = componentPoint(
    BASE_COMPONENT.inputTerminal.label,
    COMPONENT.inputTerminal,
  );

  const outputLabel = componentPoint(
    BASE_COMPONENT.outputTerminal.label,
    COMPONENT.outputTerminal,
  );

  return (
    <>
      <LabelText
        point={inputDcSourceLabel}
        size={18}
        fill={
          simulation.inputDcSourceActive ? SIMULATION_COLORS.input : LABEL.color
        }
      >
        Input DC Source
      </LabelText>

      <LabelText point={inputLabel} size={31} rotate={-90}>
        Input
      </LabelText>

      <LabelText point={outputLabel} size={31} rotate={-90}>
        Output
      </LabelText>

      <LabelText
        point={componentPoint(
          BASE_COMPONENT.inputResistor.label,
          combineTune(COMPONENT.labels, COMPONENT.inputResistor),
        )}
        size={24}
        fill={
          simulation.inputResistorActive ? SIMULATION_COLORS.input : LABEL.color
        }
      >
        R
      </LabelText>

      <LabelText
        point={componentPoint(
          BASE_COMPONENT.diode.label,
          combineTune(COMPONENT.labels, COMPONENT.diode),
        )}
        size={24}
        fill={
          simulation.inputCurrentActive ? SIMULATION_COLORS.input : LABEL.color
        }
      >
        Diode
      </LabelText>

      <LabelText
        point={componentPoint(
          BASE_COMPONENT.led.label,
          combineTune(COMPONENT.labels, COMPONENT.led),
        )}
        size={24}
        fill={simulation.inputLedOn ? SIMULATION_COLORS.input : LABEL.color}
      >
        LED
      </LabelText>

      <LabelText
        point={componentPoint(
          BASE_COMPONENT.photoResistor.label,
          combineTune(COMPONENT.labels, COMPONENT.photoResistor),
        )}
        size={24}
        fill={
          simulation.phototransistorOn ? SIMULATION_COLORS.gate : LABEL.color
        }
      >
        R
      </LabelText>

      <LabelText
        point={componentPoint(
          BASE_COMPONENT.mosfet.label,
          combineTune(COMPONENT.labels, COMPONENT.mosfet),
        )}
        size={24}
        fill={simulation.mosfetOn ? SIMULATION_COLORS.output : LABEL.color}
      >
        Mosfet
      </LabelText>

      <LabelText
        point={componentPoint(
          BASE_COMPONENT.photoTransistor.label,
          combineTune(COMPONENT.labels, COMPONENT.photoTransistor),
        )}
        size={24}
        fill={
          simulation.phototransistorOn ? SIMULATION_COLORS.gate : LABEL.color
        }
      >
        Phototransistor
      </LabelText>

      {GATE_PULLDOWN_RESISTOR_CONTROL.enabled ? (
        <LabelText
          point={{
            x:
              p.gatePulldownTop.x +
              GATE_PULLDOWN_RESISTOR_CONTROL.labelOffset.x,
            y:
              p.gatePulldownTop.y +
              GATE_PULLDOWN_RESISTOR_CONTROL.labelOffset.y,
          }}
          size={24}
          fill={
            simulation.mosfetGateActive ? SIMULATION_COLORS.gate : LABEL.color
          }
        >
          R
        </LabelText>
      ) : null}

      <LabelText
        point={componentPoint(
          BASE_COMPONENT.loadLed.label,
          combineTune(COMPONENT.labels, COMPONENT.loadLed),
        )}
        size={20}
        fill={simulation.loadLedOn ? SIMULATION_COLORS.output : LABEL.color}
      >
        Load LED
      </LabelText>

      <LabelText
        point={componentPoint(
          BASE_COMPONENT.dcSource.label,
          combineTune(COMPONENT.labels, COMPONENT.dcSource),
        )}
        size={22}
        fill={
          simulation.dcSourceActive ? SIMULATION_COLORS.output : LABEL.color
        }
      >
        DC Source
      </LabelText>

      <LabelText
        point={componentPoint(BASE_COMPONENT.title.position, COMPONENT.title)}
        size={33}
        anchor="start"
        fill={LABEL.orange}
      >
        DC to DC SSR
      </LabelText>
    </>
  );
}

/* =========================================================
   CONTROL PANEL UI
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
            DC-to-DC SSR Interactive Simulation
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Follow the input DC source, input LED, optical isolation,
            phototransistor, MOSFET gate, and output load current path.
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
              label="Phototransistor"
              active={simulation.phototransistorOn}
              flowType="gate"
            />
            <StatusIndicator
              label="MOSFET Gate"
              active={simulation.mosfetGateActive}
              flowType="gate"
            />
            <StatusIndicator
              label="MOSFET"
              active={simulation.mosfetOn}
              flowType="output"
            />
            <StatusIndicator
              label="Load LED"
              active={simulation.loadLedOn}
              flowType="output"
            />
            <StatusIndicator
              label="Output Current"
              active={simulation.outputCurrentActive}
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

export default function DcToDcSsrDiagram({
  className = "",
}: DcToDcSsrDiagramProps) {
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

  const wireSegments = useMemo(
    () => getStructuredWireSegments(simulation),
    [simulation],
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

  const frame: Box = {
    x: BASE_COMPONENT.frame.x + COMPONENT_OFFSET.x + COMPONENT.frame.leftRight,
    y: BASE_COMPONENT.frame.y + COMPONENT_OFFSET.y + COMPONENT.frame.upDown,
    width: BASE_COMPONENT.frame.width * COMPONENT.frame.widthScale,
    height: BASE_COMPONENT.frame.height * COMPONENT.frame.heightScale,
  };

  return (
    <div
      className={`grid w-full gap-5 xl:grid-cols-[360px_minmax(0,1fr)] ${className}`}
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

        <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <svg
            viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full"
            role="img"
            aria-label="Interactive DC to DC SSR internal circuit simulation diagram"
          >
            <rect
              x={VIEW_BOX.x}
              y={VIEW_BOX.y}
              width={VIEW_BOX.width}
              height={VIEW_BOX.height}
              fill="white"
            />

          <g transform={`scale(${CIRCUIT_CANVAS_SCALE})`}>
            <rect
              x={frame.x}
              y={frame.y}
              width={frame.width}
              height={frame.height}
              fill="none"
              stroke={WIRE.color}
              strokeWidth={WIRE.width}
              strokeLinejoin={PATH.strokeLinejoin}
            />

            <PlusSymbol
              center={BASE_COMPONENT.inputTerminal.plus}
              size={BASE_COMPONENT.inputTerminal.plus.size}
              control={COMPONENT.inputTerminal}
              active={simulation.inputDcActive}
              flowType="input"
            />

            <MinusSymbol
              center={BASE_COMPONENT.inputTerminal.minus}
              size={BASE_COMPONENT.inputTerminal.minus.size}
              control={COMPONENT.inputTerminal}
              active={simulation.inputReturnActive}
              flowType="input"
            />

            <PlusSymbol
              center={BASE_COMPONENT.outputTerminal.plus}
              size={BASE_COMPONENT.outputTerminal.plus.size}
              control={COMPONENT.outputTerminal}
              active={
                simulation.outputCurrentActive ||
                simulation.outputInternalActive
              }
              flowType="output"
            />

            <MinusSymbol
              center={BASE_COMPONENT.outputTerminal.minus}
              size={BASE_COMPONENT.outputTerminal.minus.size}
              control={COMPONENT.outputTerminal}
              active={
                simulation.outputCurrentActive ||
                simulation.outputInternalActive
              }
              flowType="output"
            />

            {wireSegments.map((wire) => (
              <WirePolyline
                key={wire.id}
                points={wire.points}
                width={
                  wire.active ? WIRE.activeWidth : (wire.width ?? WIRE.width)
                }
                color={wire.active ? flowColor(wire.flowType) : WIRE.color}
              />
            ))}

            <InputDcSourceSymbol active={simulation.inputDcSourceActive} />

            <HorizontalResistor
              base={BASE_COMPONENT.inputResistor}
              control={COMPONENT.inputResistor}
              active={simulation.inputResistorActive}
            />

            <InputDiodeSymbol active={simulation.inputCurrentActive} />

            <LedSymbol active={simulation.inputLedOn} />

            <LightArrow
              start={BASE_COMPONENT.light.upper.start}
              end={BASE_COMPONENT.light.upper.end}
              startOffset={LIGHT_ARROW_CONTROL.upper.startOffset}
              endOffset={LIGHT_ARROW_CONTROL.upper.endOffset}
              active={simulation.opticalSignalActive}
            />

            <LightArrow
              start={BASE_COMPONENT.light.lower.start}
              end={BASE_COMPONENT.light.lower.end}
              startOffset={LIGHT_ARROW_CONTROL.lower.startOffset}
              endOffset={LIGHT_ARROW_CONTROL.lower.endOffset}
              active={simulation.opticalSignalActive}
            />

            <VerticalResistor
              base={BASE_COMPONENT.photoResistor}
              control={COMPONENT.photoResistor}
              active={simulation.phototransistorOn}
            />

            <PhotoTransistorSymbol active={simulation.phototransistorOn} />

            <PChannelMosfetSymbolInline active={simulation.mosfetOn} />

            <GatePulldownResistorSymbol active={simulation.mosfetGateActive} />

            <LoadLedSymbol active={simulation.loadLedOn} />

            <DcSourceSymbol active={simulation.dcSourceActive} />

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
