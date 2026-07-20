"use client";

import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ---------------------------------------------
   Types
--------------------------------------------- */

type IsolationMode = "Low" | "Medium" | "High";
type ControlMode = "onOff" | "timeline";
type TimelineStep = 0 | 1 | 2 | 3;

type SimulationResult = {
  ledCurrent: number;
  outputCurrent: number;
  transferPercent: number;
  isolationVoltage: number;
  status: "ON" | "OFF";
};

type Point = {
  x: number;
  y: number;
};

type Offset = {
  x: number;
  y: number;
};

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

const TIMELINE_STEPS = [
  {
    id: 0,
    label: "Input OFF",
    title: "Waiting for input",
    description:
      "Input signal is ready, but the LED has not started the optical transfer.",
  },
  {
    id: 1,
    label: "LED ON",
    title: "Input LED emits light",
    description: "Input current flows through the LED side of the optocoupler.",
  },
  {
    id: 2,
    label: "Light Transfer",
    title: "Isolation barrier transfers light",
    description:
      "Light crosses the gap while input and output remain electrically isolated.",
  },
  {
    id: 3,
    label: "Output ON",
    title: "Photodiode conducts",
    description:
      "The photodiode generates output current and drives the external load path.",
  },
] as const satisfies readonly {
  id: TimelineStep;
  label: string;
  title: string;
  description: string;
}[];

type PhotodiodeCircuitControlPanelProps = {
  initialEnabled?: boolean;
  initialInputVoltage?: number;
  initialIsolation?: IsolationMode;
  showControls?: boolean;
  showCurrentDots?: boolean;
  showDebugTerminals?: boolean;
  showFlowDebugPaths?: boolean;
  className?: string;
};

/* ---------------------------------------------
   Utility helpers
--------------------------------------------- */

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toTimelineStep(progress: number): TimelineStep {
  return clamp(Math.floor(progress * TIMELINE_STEPS.length), 0, 3) as TimelineStep;
}

function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

function addPoint(point: Point, offset: Offset): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function offsetPoints(points: readonly Point[], offset: Offset): Point[] {
  return points.map((point) => addPoint(point, offset));
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

/* ---------------------------------------------
   Simulation logic

   OFF condition is handled here first:
   - disabled input forces LED current to 0
   - no LED current means no photodiode/photo current
   - visual state later uses results.status === "ON"
--------------------------------------------- */

function calculatePhotodiodeSimulation({
  enabled,
  inputVoltage,
  isolation,
}: {
  enabled: boolean;
  inputVoltage: number;
  isolation: IsolationMode;
}): SimulationResult {
  const ledForwardVoltage = 1.2;
  const inputResistanceOhm = 330;

  const referenceCtrPercent = 80;
  const photodiodeTransferFactor = 0.28;

  const ledCurrent = enabled
    ? clamp(
        ((inputVoltage - ledForwardVoltage) / inputResistanceOhm) * 1000,
        0,
        30,
      )
    : 0;

  const outputCurrent =
    ledCurrent > 0
      ? clamp(
          (ledCurrent * referenceCtrPercent * photodiodeTransferFactor) / 100,
          0,
          20,
        )
      : 0;

  const transferPercent =
    ledCurrent > 0 ? clamp((outputCurrent / ledCurrent) * 100, 0, 100) : 0;

  const isolationVoltage =
    isolation === "High" ? 5000 : isolation === "Medium" ? 2500 : 1000;

  const status = enabled && ledCurrent > 1 ? "ON" : "OFF";

  return {
    ledCurrent,
    outputCurrent,
    transferPercent,
    isolationVoltage,
    status,
  };
}

function runSelfTests() {
  const disabledInput = calculatePhotodiodeSimulation({
    enabled: false,
    inputVoltage: 5,
    isolation: "Medium",
  });

  const normalInput = calculatePhotodiodeSimulation({
    enabled: true,
    inputVoltage: 5,
    isolation: "Medium",
  });

  const highIsolation = calculatePhotodiodeSimulation({
    enabled: true,
    inputVoltage: 5,
    isolation: "High",
  });

  const lowInput = calculatePhotodiodeSimulation({
    enabled: true,
    inputVoltage: 1,
    isolation: "Low",
  });

  return (
    disabledInput.ledCurrent === 0 &&
    disabledInput.outputCurrent === 0 &&
    disabledInput.status === "OFF" &&
    normalInput.status === "ON" &&
    highIsolation.isolationVoltage === 5000 &&
    lowInput.status === "OFF"
  );
}

/* ---------------------------------------------
   SVG constants and tuning architecture
--------------------------------------------- */

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1688,
  height: 603,
} as const;

const SVG_VIEW_BOX = `${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`;

const SCALE = {
  CIRCUIT_CANVAS_SCALE: 1,
  CIRCUIT_WIRE_SCALE: 1,
  CIRCUIT_COMPONENT_SCALE: {
    inputBattery: 1,
    inputSwitch: 1,
    optocouplerBox: 1,
    inputLed: 1,
    photodiode: 1,
    outputSource: 1,
    outputLoad: 1,
  },
} as const;

const BASE_WIRE_WIDTH = 5;

const COMPONENT_OFFSET = {
  inputBattery: { x: 0, y: 0 },
  inputSwitch: { x: 0, y: 0 },
  optocouplerBox: { x: 0, y: 0 },
  inputLed: { x: 0, y: 0 },
  photodiode: { x: 0, y: 0 },
  outputSource: { x: 0, y: 0 },
  outputLoad: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const WIRE_OFFSET = {
  inputBattery: { x: 0, y: 0 },
  inputTopToSwitch: { x: 0, y: 0 },
  switchToPin1: { x: 0, y: 0 },
  ledTopDrop: { x: 0, y: 0 },
  ledBottomDrop: { x: 0, y: 0 },
  inputReturn: { x: 0, y: 0 },
  outputTop: { x: 0, y: 0 },
  outputBattery: { x: 0, y: 0 },
  photodiodeLeads: { x: 0, y: 0 },
  outputReturn: { x: 0, y: 0 },
  loadLoop: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const DOT_PATH_OFFSET = {
  inputPositiveToLed: { x: 0, y: 0 },
  inputLedToNegative: { x: 0, y: 0 },
  outputPositiveToPhotodiode: { x: 0, y: 0 },
  outputPhotodiodeToLoadToNegative: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const DEBUG_TERMINAL_OFFSET = {
  marker: { x: 0, y: 0 },
  label: { x: 9, y: -9 },
} as const satisfies Record<string, Offset>;

const LABEL_OFFSET = {
  input: { x: 0, y: 0 },
  vcc: { x: 0, y: 0 },
  pin1: { x: 0, y: 0 },
  pin2: { x: 0, y: 0 },
  pin3: { x: 0, y: 0 },
  pin4: { x: 0, y: 0 },
  packageTitle: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const STYLE = {
  wire: "#020617",
  packageBlue: "#0d47a1",
  inputCurrent: "#2563eb",
  outputCurrent: "#10b981",
  light: "#f59e0b",
  ledFill: "#fbbf24",
  loadGlow: "#facc15",
  loadFill: "#fde68a",
  debugInput: "#2563eb",
  debugOutput: "#10b981",
  debugPower: "#ef4444",
  debugDevice: "#7c3aed",
} as const;

function scaleComponent(component: ComponentBox, scale: number): ComponentBox {
  const width = component.width * scale;
  const height = component.height * scale;

  return {
    ...component,
    x: component.x - (width - component.width) / 2,
    y: component.y - (height - component.height) / 2,
    width,
    height,
  };
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX.width / 2;
  const centerY = VIEW_BOX.height / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

/* ---------------------------------------------
   Component boxes
--------------------------------------------- */

const BASE_COMPONENT = {
  inputBattery: {
    x: 38,
    y: 112,
    width: 104,
    height: 360,
    rotate: 0,
  },
  inputSwitch: {
    x: 238,
    y: 44,
    width: 133,
    height: 80,
    rotate: 0,
  },
  optocouplerBox: {
    x: 582,
    y: 20,
    width: 457,
    height: 504,
    rotate: 0,
  },
  inputLed: {
    x: 708,
    y: 232,
    width: 70,
    height: 92,
    rotate: 0,
  },
  photodiode: {
    x: 900,
    y: 205,
    width: 110,
    height: 140,
    rotate: 0,
  },
  outputSource: {
    x: 1503,
    y: 112,
    width: 82,
    height: 360,
    rotate: 0,
  },
  outputLoad: {
    x: 1288,
    y: 408,
    width: 162,
    height: 124,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  inputBattery: scaleComponent(
    {
      ...BASE_COMPONENT.inputBattery,
      x: BASE_COMPONENT.inputBattery.x + COMPONENT_OFFSET.inputBattery.x,
      y: BASE_COMPONENT.inputBattery.y + COMPONENT_OFFSET.inputBattery.y,
    },
    SCALE.CIRCUIT_COMPONENT_SCALE.inputBattery,
  ),
  inputSwitch: scaleComponent(
    {
      ...BASE_COMPONENT.inputSwitch,
      x: BASE_COMPONENT.inputSwitch.x + COMPONENT_OFFSET.inputSwitch.x,
      y: BASE_COMPONENT.inputSwitch.y + COMPONENT_OFFSET.inputSwitch.y,
    },
    SCALE.CIRCUIT_COMPONENT_SCALE.inputSwitch,
  ),
  optocouplerBox: scaleComponent(
    {
      ...BASE_COMPONENT.optocouplerBox,
      x: BASE_COMPONENT.optocouplerBox.x + COMPONENT_OFFSET.optocouplerBox.x,
      y: BASE_COMPONENT.optocouplerBox.y + COMPONENT_OFFSET.optocouplerBox.y,
    },
    SCALE.CIRCUIT_COMPONENT_SCALE.optocouplerBox,
  ),
  inputLed: scaleComponent(
    {
      ...BASE_COMPONENT.inputLed,
      x: BASE_COMPONENT.inputLed.x + COMPONENT_OFFSET.inputLed.x,
      y: BASE_COMPONENT.inputLed.y + COMPONENT_OFFSET.inputLed.y,
    },
    SCALE.CIRCUIT_COMPONENT_SCALE.inputLed,
  ),
  photodiode: scaleComponent(
    {
      ...BASE_COMPONENT.photodiode,
      x: BASE_COMPONENT.photodiode.x + COMPONENT_OFFSET.photodiode.x,
      y: BASE_COMPONENT.photodiode.y + COMPONENT_OFFSET.photodiode.y,
    },
    SCALE.CIRCUIT_COMPONENT_SCALE.photodiode,
  ),
  outputSource: scaleComponent(
    {
      ...BASE_COMPONENT.outputSource,
      x: BASE_COMPONENT.outputSource.x + COMPONENT_OFFSET.outputSource.x,
      y: BASE_COMPONENT.outputSource.y + COMPONENT_OFFSET.outputSource.y,
    },
    SCALE.CIRCUIT_COMPONENT_SCALE.outputSource,
  ),
  outputLoad: scaleComponent(
    {
      ...BASE_COMPONENT.outputLoad,
      x: BASE_COMPONENT.outputLoad.x + COMPONENT_OFFSET.outputLoad.x,
      y: BASE_COMPONENT.outputLoad.y + COMPONENT_OFFSET.outputLoad.y,
    },
    SCALE.CIRCUIT_COMPONENT_SCALE.outputLoad,
  ),
} as const;

/* ---------------------------------------------
   Nodes
--------------------------------------------- */

const BASE_NODE = {
  batteryTop: { x: 80, y: 112 },
  batteryPositivePlateCenter: { x: 80, y: 352 },
  batteryNegativePlateCenter: { x: 80, y: 378 },
  batteryBottom: { x: 80, y: 472 },

  batteryPlusPlateLeft: { x: 38, y: 352 },
  batteryPlusPlateRight: { x: 98, y: 352 },
  batteryMinusPlateLeft: { x: 50, y: 378 },
  batteryMinusPlateRight: { x: 92, y: 378 },

  switchLeftContact: { x: 238, y: 112 },
  switchRightContact: { x: 342, y: 112 },
  switchOpenEnd: { x: 371, y: 44 },
  switchArmStart: { x: 248, y: 106 },

  pin1: { x: 582, y: 112 },
  pin2: { x: 582, y: 472 },
  pin3: { x: 1039, y: 112 },
  pin4: { x: 1039, y: 472 },

  ledTop: { x: 742, y: 235 },
  ledBottom: { x: 742, y: 324 },
  ledReturn: { x: 742, y: 472 },

  isolationTop: { x: 810, y: 22 },
  isolationBottom: { x: 810, y: 520 },

  photodiodeTop: { x: 956, y: 218 },
  photodiodeBottom: { x: 956, y: 330 },
  photodiodeLeft: { x: 910, y: 238 },
  photodiodeRight: { x: 1002, y: 238 },

  outputTop: { x: 956, y: 112 },
  outputBottom: { x: 956, y: 472 },

  vccTop: { x: 1537, y: 112 },
  vccPositivePlateCenter: { x: 1537, y: 319 },
  vccNegativePlateCenter: { x: 1537, y: 346 },
  vccBottom: { x: 1537, y: 472 },

  vccPlusPlateLeft: { x: 1503, y: 319 },
  vccPlusPlateRight: { x: 1561, y: 319 },
  vccMinusPlateLeft: { x: 1514, y: 346 },
  vccMinusPlateRight: { x: 1550, y: 346 },

  loadInput: { x: 1290, y: 472 },
  loadOutput: { x: 1362, y: 472 },
} as const satisfies Record<string, Point>;

const NODE = {
  batteryTop: addPoint(BASE_NODE.batteryTop, COMPONENT_OFFSET.inputBattery),
  batteryPositivePlateCenter: addPoint(
    BASE_NODE.batteryPositivePlateCenter,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryNegativePlateCenter: addPoint(
    BASE_NODE.batteryNegativePlateCenter,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryBottom: addPoint(BASE_NODE.batteryBottom, COMPONENT_OFFSET.inputBattery),

  batteryPlusPlateLeft: addPoint(
    BASE_NODE.batteryPlusPlateLeft,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryPlusPlateRight: addPoint(
    BASE_NODE.batteryPlusPlateRight,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryMinusPlateLeft: addPoint(
    BASE_NODE.batteryMinusPlateLeft,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryMinusPlateRight: addPoint(
    BASE_NODE.batteryMinusPlateRight,
    COMPONENT_OFFSET.inputBattery,
  ),

  switchLeftContact: addPoint(
    BASE_NODE.switchLeftContact,
    COMPONENT_OFFSET.inputSwitch,
  ),
  switchRightContact: addPoint(
    BASE_NODE.switchRightContact,
    COMPONENT_OFFSET.inputSwitch,
  ),
  switchOpenEnd: addPoint(BASE_NODE.switchOpenEnd, COMPONENT_OFFSET.inputSwitch),
  switchArmStart: addPoint(
    BASE_NODE.switchArmStart,
    COMPONENT_OFFSET.inputSwitch,
  ),

  pin1: addPoint(BASE_NODE.pin1, COMPONENT_OFFSET.optocouplerBox),
  pin2: addPoint(BASE_NODE.pin2, COMPONENT_OFFSET.optocouplerBox),
  pin3: addPoint(BASE_NODE.pin3, COMPONENT_OFFSET.optocouplerBox),
  pin4: addPoint(BASE_NODE.pin4, COMPONENT_OFFSET.optocouplerBox),

  ledTop: addPoint(BASE_NODE.ledTop, COMPONENT_OFFSET.inputLed),
  ledBottom: addPoint(BASE_NODE.ledBottom, COMPONENT_OFFSET.inputLed),
  ledReturn: addPoint(BASE_NODE.ledReturn, COMPONENT_OFFSET.inputLed),

  isolationTop: addPoint(BASE_NODE.isolationTop, COMPONENT_OFFSET.optocouplerBox),
  isolationBottom: addPoint(
    BASE_NODE.isolationBottom,
    COMPONENT_OFFSET.optocouplerBox,
  ),

  photodiodeTop: addPoint(BASE_NODE.photodiodeTop, COMPONENT_OFFSET.photodiode),
  photodiodeBottom: addPoint(
    BASE_NODE.photodiodeBottom,
    COMPONENT_OFFSET.photodiode,
  ),
  photodiodeLeft: addPoint(
    BASE_NODE.photodiodeLeft,
    COMPONENT_OFFSET.photodiode,
  ),
  photodiodeRight: addPoint(
    BASE_NODE.photodiodeRight,
    COMPONENT_OFFSET.photodiode,
  ),

  outputTop: addPoint(BASE_NODE.outputTop, COMPONENT_OFFSET.photodiode),
  outputBottom: addPoint(BASE_NODE.outputBottom, COMPONENT_OFFSET.photodiode),

  vccTop: addPoint(BASE_NODE.vccTop, COMPONENT_OFFSET.outputSource),
  vccPositivePlateCenter: addPoint(
    BASE_NODE.vccPositivePlateCenter,
    COMPONENT_OFFSET.outputSource,
  ),
  vccNegativePlateCenter: addPoint(
    BASE_NODE.vccNegativePlateCenter,
    COMPONENT_OFFSET.outputSource,
  ),
  vccBottom: addPoint(BASE_NODE.vccBottom, COMPONENT_OFFSET.outputSource),

  vccPlusPlateLeft: addPoint(
    BASE_NODE.vccPlusPlateLeft,
    COMPONENT_OFFSET.outputSource,
  ),
  vccPlusPlateRight: addPoint(
    BASE_NODE.vccPlusPlateRight,
    COMPONENT_OFFSET.outputSource,
  ),
  vccMinusPlateLeft: addPoint(
    BASE_NODE.vccMinusPlateLeft,
    COMPONENT_OFFSET.outputSource,
  ),
  vccMinusPlateRight: addPoint(
    BASE_NODE.vccMinusPlateRight,
    COMPONENT_OFFSET.outputSource,
  ),

  loadInput: addPoint(BASE_NODE.loadInput, COMPONENT_OFFSET.outputLoad),
  loadOutput: addPoint(BASE_NODE.loadOutput, COMPONENT_OFFSET.outputLoad),
} as const satisfies Record<string, Point>;

/* ---------------------------------------------
   Wire segments
--------------------------------------------- */

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE,

  batteryTopLead: offsetPoints(
    [NODE.batteryTop, NODE.batteryPositivePlateCenter],
    WIRE_OFFSET.inputBattery,
  ),

  batteryBottomLead: offsetPoints(
    [NODE.batteryNegativePlateCenter, NODE.batteryBottom],
    WIRE_OFFSET.inputBattery,
  ),

  inputTopToSwitch: offsetPoints(
    [NODE.batteryTop, NODE.switchLeftContact],
    WIRE_OFFSET.inputTopToSwitch,
  ),

  switchToPin1AndLed: offsetPoints(
    [
      NODE.switchRightContact,
      { x: 430, y: NODE.switchRightContact.y },
      NODE.pin1,
      { x: NODE.ledTop.x, y: NODE.pin1.y },
    ],
    WIRE_OFFSET.switchToPin1,
  ),

  ledTopDrop: offsetPoints(
    [{ x: NODE.ledTop.x, y: NODE.pin1.y }, NODE.ledTop],
    WIRE_OFFSET.ledTopDrop,
  ),

  ledBottomDrop: offsetPoints(
    [NODE.ledBottom, NODE.ledReturn],
    WIRE_OFFSET.ledBottomDrop,
  ),

  inputReturn: offsetPoints(
    [NODE.ledReturn, NODE.pin2, NODE.batteryBottom],
    WIRE_OFFSET.inputReturn,
  ),

  outputTop: offsetPoints(
    [NODE.outputTop, NODE.pin3, NODE.vccTop],
    WIRE_OFFSET.outputTop,
  ),

  photodiodeTopLead: offsetPoints(
    [NODE.outputTop, NODE.photodiodeTop],
    WIRE_OFFSET.photodiodeLeads,
  ),

  photodiodeBottomLead: offsetPoints(
    [NODE.photodiodeBottom, NODE.outputBottom],
    WIRE_OFFSET.photodiodeLeads,
  ),

  vccTopLead: offsetPoints(
    [NODE.vccTop, NODE.vccPositivePlateCenter],
    WIRE_OFFSET.outputBattery,
  ),

  vccBottomLead: offsetPoints(
    [NODE.vccNegativePlateCenter, NODE.vccBottom],
    WIRE_OFFSET.outputBattery,
  ),

  outputReturnToLoad: offsetPoints(
    [NODE.outputBottom, NODE.pin4, NODE.loadInput],
    WIRE_OFFSET.outputReturn,
  ),

  loadToVccNegative: offsetPoints(
    [NODE.loadOutput, NODE.vccBottom],
    WIRE_OFFSET.loadLoop,
  ),
} as const;

/* ---------------------------------------------
   Logical current paths

   These paths are conventional-current paths only.
   Electrical dots never cross the isolation barrier.
   Only optical light arrows may cross the isolation barrier.
--------------------------------------------- */

const CURRENT_PATH_POINTS = {
  inputPositiveToLed: offsetPoints(
    [
      NODE.batteryPositivePlateCenter,
      NODE.batteryTop,
      NODE.switchLeftContact,
      NODE.switchArmStart,
      NODE.switchRightContact,
      { x: 430, y: NODE.switchRightContact.y },
      NODE.pin1,
      { x: NODE.ledTop.x, y: NODE.pin1.y },
      NODE.ledTop,
    ],
    DOT_PATH_OFFSET.inputPositiveToLed,
  ),

  inputLedToNegative: offsetPoints(
    [
      NODE.ledTop,
      NODE.ledBottom,
      NODE.ledReturn,
      NODE.pin2,
      NODE.batteryBottom,
      NODE.batteryNegativePlateCenter,
    ],
    DOT_PATH_OFFSET.inputLedToNegative,
  ),

  outputPositiveToPhotodiode: offsetPoints(
    [
      NODE.vccPositivePlateCenter,
      NODE.vccTop,
      NODE.pin3,
      NODE.outputTop,
      NODE.photodiodeTop,
    ],
    DOT_PATH_OFFSET.outputPositiveToPhotodiode,
  ),

  outputPhotodiodeToLoadToNegative: offsetPoints(
    [
      NODE.photodiodeTop,
      NODE.photodiodeBottom,
      NODE.outputBottom,
      NODE.pin4,
      NODE.loadInput,
      NODE.loadOutput,
      NODE.vccBottom,
      NODE.vccNegativePlateCenter,
    ],
    DOT_PATH_OFFSET.outputPhotodiodeToLoadToNegative,
  ),
} as const;

const CURRENT_PATH = {
  inputPositiveToLed: pathD(CURRENT_PATH_POINTS.inputPositiveToLed),
  inputLedToNegative: pathD(CURRENT_PATH_POINTS.inputLedToNegative),
  outputPositiveToPhotodiode: pathD(
    CURRENT_PATH_POINTS.outputPositiveToPhotodiode,
  ),
  outputPhotodiodeToLoadToNegative: pathD(
    CURRENT_PATH_POINTS.outputPhotodiodeToLoadToNegative,
  ),
} as const;

/* ---------------------------------------------
   Labels
--------------------------------------------- */

const LABEL = {
  input: addPoint({ x: 215, y: 397 }, LABEL_OFFSET.input),
  vcc: addPoint({ x: 1607, y: 366 }, LABEL_OFFSET.vcc),

  pin1: addPoint({ x: 532, y: 170 }, LABEL_OFFSET.pin1),
  pin2: addPoint({ x: 532, y: 432 }, LABEL_OFFSET.pin2),
  pin3: addPoint({ x: 1055, y: 170 }, LABEL_OFFSET.pin3),
  pin4: addPoint({ x: 1055, y: 432 }, LABEL_OFFSET.pin4),

  packageTitle: addPoint({ x: 660, y: 52 }, LABEL_OFFSET.packageTitle),

  inputPlus: { x: 26, y: 326 },
  inputMinus: { x: 28, y: 437 },

  vccPlus: { x: 1568, y: 301 },
  vccMinus: { x: 1571, y: 412 },
} as const;

/* ---------------------------------------------
   Debug terminal map
--------------------------------------------- */

const DEBUG_TERMINALS = {
  batteryPositive: {
    label: "Battery +",
    point: NODE.batteryPositivePlateCenter,
    color: STYLE.debugPower,
    labelOffset: { x: -70, y: -20 },
  },
  batteryNegative: {
    label: "Battery -",
    point: NODE.batteryNegativePlateCenter,
    color: STYLE.debugPower,
    labelOffset: { x: -70, y: 28 },
  },
  switchLeft: {
    label: "Switch L",
    point: NODE.switchLeftContact,
    color: STYLE.debugInput,
    labelOffset: { x: -30, y: -24 },
  },
  switchRight: {
    label: "Switch R",
    point: NODE.switchRightContact,
    color: STYLE.debugInput,
    labelOffset: { x: -10, y: -28 },
  },
  pin1: {
    label: "Pin 1",
    point: NODE.pin1,
    color: STYLE.debugInput,
    labelOffset: { x: -40, y: -20 },
  },
  pin2: {
    label: "Pin 2",
    point: NODE.pin2,
    color: STYLE.debugInput,
    labelOffset: { x: -40, y: 30 },
  },
  pin3: {
    label: "Pin 3",
    point: NODE.pin3,
    color: STYLE.debugOutput,
    labelOffset: { x: 8, y: -20 },
  },
  pin4: {
    label: "Pin 4",
    point: NODE.pin4,
    color: STYLE.debugOutput,
    labelOffset: { x: 8, y: 30 },
  },
  vccPositive: {
    label: "Vcc +",
    point: NODE.vccPositivePlateCenter,
    color: STYLE.debugPower,
    labelOffset: { x: 20, y: -20 },
  },
  vccNegative: {
    label: "Vcc -",
    point: NODE.vccNegativePlateCenter,
    color: STYLE.debugPower,
    labelOffset: { x: 20, y: 28 },
  },
  loadInput: {
    label: "Load IN",
    point: NODE.loadInput,
    color: STYLE.debugOutput,
    labelOffset: { x: -58, y: 38 },
  },
  loadOutput: {
    label: "Load OUT",
    point: NODE.loadOutput,
    color: STYLE.debugOutput,
    labelOffset: { x: 10, y: 38 },
  },
  photodiodeTop: {
    label: "Photodiode +",
    point: NODE.photodiodeTop,
    color: STYLE.debugDevice,
    labelOffset: { x: 12, y: -20 },
  },
  photodiodeBottom: {
    label: "Photodiode -",
    point: NODE.photodiodeBottom,
    color: STYLE.debugDevice,
    labelOffset: { x: 12, y: 30 },
  },
} as const;

/* ---------------------------------------------
   Reusable SVG helpers
--------------------------------------------- */

function WirePath({
  points,
  width = WIRE.width,
}: {
  points: readonly Point[];
  width?: number;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function FlowDots({
  path,
  active,
  color,
  count = 10,
  duration = 2.1,
  radius = 4,
}: {
  path: string;
  active: boolean;
  color: string;
  count?: number;
  duration?: number;
  radius?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.circle
          key={`${path}-${index}`}
          r={radius}
          fill={color}
          stroke="white"
          strokeWidth="1"
          initial={false}
          animate={{
            offsetDistance: active ? ["0%", "100%"] : "0%",
            opacity: active ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            duration: active ? duration : 0.15,
            repeat: active ? Infinity : 0,
            ease: "linear",
            delay: active ? index * (duration / count) : 0,
          }}
          style={
            {
              offsetPath: `path('${path}')`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

function FlowDebugPaths() {
  return (
    <g opacity="0.45">
      {Object.entries(CURRENT_PATH).map(([name, path]) => {
        const isInputPath = name.startsWith("input");

        return (
          <path
            key={name}
            d={path}
            stroke={isInputPath ? STYLE.inputCurrent : STYLE.outputCurrent}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="12 12"
            opacity="0.45"
          />
        );
      })}
    </g>
  );
}

function DebugTerminals() {
  return (
    <g>
      {Object.entries(DEBUG_TERMINALS).map(([key, terminal]) => {
        const markerPoint = addPoint(
          terminal.point,
          DEBUG_TERMINAL_OFFSET.marker,
        );
        const labelBase = addPoint(markerPoint, DEBUG_TERMINAL_OFFSET.label);
        const labelPoint = addPoint(labelBase, terminal.labelOffset);

        return (
          <g key={key}>
            <circle
              cx={markerPoint.x}
              cy={markerPoint.y}
              r="7"
              fill={terminal.color}
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={labelPoint.x}
              y={labelPoint.y}
              fontSize="22"
              fontFamily="Arial"
              fontWeight="700"
              fill={terminal.color}
            >
              {terminal.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: input battery
--------------------------------------------- */

function InputBattery() {
  return (
    <g>
      <WirePath points={WIRE.batteryTopLead} />
      <WirePath points={WIRE.batteryBottomLead} />

      <line
        x1={NODE.batteryPlusPlateLeft.x}
        y1={NODE.batteryPlusPlateLeft.y}
        x2={NODE.batteryPlusPlateRight.x}
        y2={NODE.batteryPlusPlateRight.y}
        stroke={STYLE.wire}
        strokeWidth="9"
        strokeLinecap="round"
      />

      <line
        x1={NODE.batteryMinusPlateLeft.x}
        y1={NODE.batteryMinusPlateLeft.y}
        x2={NODE.batteryMinusPlateRight.x}
        y2={NODE.batteryMinusPlateRight.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <text
        x={LABEL.inputPlus.x}
        y={LABEL.inputPlus.y}
        fontSize="46"
        fontFamily="Arial"
        fontWeight="700"
      >
        +
      </text>

      <text
        x={LABEL.inputMinus.x}
        y={LABEL.inputMinus.y}
        fontSize="46"
        fontFamily="Arial"
        fontWeight="700"
      >
        -
      </text>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: input switch
--------------------------------------------- */

function InputSwitch({ active }: { active: boolean }) {
  return (
    <g>
      <WirePath points={WIRE.inputTopToSwitch} />

      <circle
        cx={NODE.switchLeftContact.x}
        cy={NODE.switchLeftContact.y}
        r="11"
        fill="#ffffff"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <circle
        cx={NODE.switchRightContact.x}
        cy={NODE.switchRightContact.y}
        r="11"
        fill="#ffffff"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <motion.line
        x1={NODE.switchArmStart.x}
        y1={NODE.switchArmStart.y}
        x2={active ? NODE.switchRightContact.x : NODE.switchOpenEnd.x}
        y2={active ? NODE.switchRightContact.y : NODE.switchOpenEnd.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 14,
        }}
      />

      <WirePath points={WIRE.switchToPin1AndLed} />
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: optocoupler package
--------------------------------------------- */

function OptocouplerFrame() {
  return (
    <g>
      <rect
        x={COMPONENT.optocouplerBox.x}
        y={COMPONENT.optocouplerBox.y}
        width={COMPONENT.optocouplerBox.width}
        height={COMPONENT.optocouplerBox.height}
        fill="none"
        stroke={STYLE.packageBlue}
        strokeWidth="5"
      />

      <line
        x1={NODE.isolationTop.x}
        y1={NODE.isolationTop.y}
        x2={NODE.isolationBottom.x}
        y2={NODE.isolationBottom.y}
        stroke={STYLE.wire}
        strokeWidth="4"
        strokeDasharray="32 14"
      />

      <text
        x={LABEL.packageTitle.x}
        y={LABEL.packageTitle.y}
        fontSize="22"
        fontFamily="Arial"
        fontWeight="700"
        fill={STYLE.packageBlue}
      >
        Optical Isolation
      </text>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: input LED and optical arrows

   OFF visual logic:
   - LED symbol stays visible as a passive component
   - light arrows fully disappear when OFF
   - this prevents the output side from looking optically activated
--------------------------------------------- */

function InputLed({ active }: { active: boolean }) {
  const trianglePoints = [
    `${NODE.ledTop.x - 34},${NODE.ledTop.y}`,
    `${NODE.ledTop.x + 34},${NODE.ledTop.y}`,
    `${NODE.ledTop.x},${NODE.ledBottom.y - 14}`,
  ].join(" ");

  return (
    <g>
      <WirePath points={WIRE.ledTopDrop} />

      <motion.polygon
        points={trianglePoints}
        fill={active ? STYLE.ledFill : "white"}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinejoin="round"
        initial={false}
        animate={{
          opacity: active ? [0.75, 1, 0.75] : 1,
        }}
        transition={{
          duration: active ? 1 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      />

      <line
        x1={NODE.ledTop.x - 34}
        y1={NODE.ledBottom.y}
        x2={NODE.ledTop.x + 34}
        y2={NODE.ledBottom.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <WirePath points={WIRE.ledBottomDrop} />

      <motion.g
        initial={false}
        animate={{
          opacity: active ? [0.35, 1, 0.35] : 0,
        }}
        transition={{
          duration: active ? 1.15 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      >
        <line
          x1={NODE.ledTop.x + 38}
          y1={NODE.ledTop.y + 25}
          x2={NODE.photodiodeLeft.x - 34}
          y2={NODE.photodiodeLeft.y + 5}
          stroke={STYLE.light}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon
          points={`${NODE.photodiodeLeft.x - 46},${NODE.photodiodeLeft.y - 2} ${
            NODE.photodiodeLeft.x - 22
          },${NODE.photodiodeLeft.y + 4} ${NODE.photodiodeLeft.x - 42},${
            NODE.photodiodeLeft.y + 16
          }`}
          fill={STYLE.light}
        />

        <line
          x1={NODE.ledTop.x + 42}
          y1={NODE.ledBottom.y - 10}
          x2={NODE.photodiodeLeft.x - 28}
          y2={NODE.photodiodeBottom.y - 18}
          stroke={STYLE.light}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon
          points={`${NODE.photodiodeLeft.x - 40},${
            NODE.photodiodeBottom.y - 25
          } ${NODE.photodiodeLeft.x - 16},${
            NODE.photodiodeBottom.y - 18
          } ${NODE.photodiodeLeft.x - 36},${
            NODE.photodiodeBottom.y - 6
          }`}
          fill={STYLE.light}
        />
      </motion.g>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: input return wire
   Pin 2 -> battery negative return path
--------------------------------------------- */

function InputReturnWire() {
  return <WirePath points={WIRE.inputReturn} />;
}

/* ---------------------------------------------
   Circuit block: photodiode output symbol

   OFF visual logic:
   - photodiode body remains visible as a passive symbol
   - photodiode receiving-light arrows disappear fully when OFF
   - photodiode body does not pulse when OFF
--------------------------------------------- */

function PhotodiodeOutput({ active }: { active: boolean }) {
  const photodiodeTriangle = [
    `${NODE.photodiodeLeft.x},${NODE.photodiodeTop.y + 18}`,
    `${NODE.photodiodeRight.x},${NODE.photodiodeTop.y + 18}`,
    `${NODE.photodiodeTop.x},${NODE.photodiodeBottom.y - 16}`,
  ].join(" ");

  return (
    <g>
      <WirePath points={WIRE.photodiodeTopLead} />
      <WirePath points={WIRE.photodiodeBottomLead} />

      <motion.polygon
        points={photodiodeTriangle}
        fill={active ? "#d1fae5" : "white"}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinejoin="round"
        initial={false}
        animate={{
          opacity: active ? [0.85, 1, 0.85] : 1,
        }}
        transition={{
          duration: active ? 1.1 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      />

      <line
        x1={NODE.photodiodeLeft.x}
        y1={NODE.photodiodeBottom.y}
        x2={NODE.photodiodeRight.x}
        y2={NODE.photodiodeBottom.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <motion.g
        initial={false}
        animate={{
          opacity: active ? [0.35, 1, 0.35] : 0,
        }}
        transition={{
          duration: active ? 1.2 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      >
        <line
          x1={NODE.photodiodeLeft.x - 60}
          y1={NODE.photodiodeTop.y + 28}
          x2={NODE.photodiodeLeft.x - 8}
          y2={NODE.photodiodeTop.y + 12}
          stroke={STYLE.wire}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polygon
          points={`${NODE.photodiodeLeft.x - 18},${NODE.photodiodeTop.y + 4} ${
            NODE.photodiodeLeft.x
          },${NODE.photodiodeTop.y + 10} ${NODE.photodiodeLeft.x - 13},${
            NODE.photodiodeTop.y + 24
          }`}
          fill={STYLE.wire}
        />

        <line
          x1={NODE.photodiodeLeft.x - 55}
          y1={NODE.photodiodeBottom.y - 18}
          x2={NODE.photodiodeLeft.x - 5}
          y2={NODE.photodiodeBottom.y - 32}
          stroke={STYLE.wire}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polygon
          points={`${NODE.photodiodeLeft.x - 15},${
            NODE.photodiodeBottom.y - 40
          } ${NODE.photodiodeLeft.x + 4},${NODE.photodiodeBottom.y - 34} ${
            NODE.photodiodeLeft.x - 10
          },${NODE.photodiodeBottom.y - 20}`}
          fill={STYLE.wire}
        />
      </motion.g>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: output Vcc source
--------------------------------------------- */

function DcOutputSource() {
  return (
    <g>
      <WirePath points={WIRE.outputTop} />

      <WirePath points={WIRE.vccTopLead} />
      <WirePath points={WIRE.vccBottomLead} />

      <line
        x1={NODE.vccPlusPlateLeft.x}
        y1={NODE.vccPlusPlateLeft.y}
        x2={NODE.vccPlusPlateRight.x}
        y2={NODE.vccPlusPlateRight.y}
        stroke={STYLE.wire}
        strokeWidth="9"
        strokeLinecap="round"
      />

      <line
        x1={NODE.vccMinusPlateLeft.x}
        y1={NODE.vccMinusPlateLeft.y}
        x2={NODE.vccMinusPlateRight.x}
        y2={NODE.vccMinusPlateRight.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <text
        x={LABEL.vccPlus.x}
        y={LABEL.vccPlus.y}
        fontSize="46"
        fontFamily="Arial"
        fontWeight="700"
      >
        +
      </text>

      <text
        x={LABEL.vccMinus.x}
        y={LABEL.vccMinus.y}
        fontSize="46"
        fontFamily="Arial"
        fontWeight="700"
      >
        -
      </text>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: output DC load

   OFF visual logic:
   - load symbol remains visible
   - load glow disappears fully when OFF
   - output arrows disappear fully when OFF
--------------------------------------------- */

function DcLoadNetwork({ active }: { active: boolean }) {
  return (
    <g>
      <WirePath points={WIRE.outputReturnToLoad} />

      <motion.circle
        cx={NODE.loadInput.x + 38}
        cy={NODE.loadInput.y}
        r="68"
        fill={STYLE.loadGlow}
        initial={false}
        animate={{
          opacity: active ? [0.08, 0.3, 0.08] : 0,
        }}
        transition={{
          duration: active ? 1.1 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      />

      <polygon
        points={`${NODE.loadInput.x},${NODE.loadInput.y - 40} ${
          NODE.loadInput.x
        },${NODE.loadInput.y + 40} ${NODE.loadInput.x + 66},${
          NODE.loadInput.y
        }`}
        fill={active ? STYLE.loadFill : "white"}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinejoin="round"
      />

      <line
        x1={NODE.loadOutput.x}
        y1={NODE.loadOutput.y - 43}
        x2={NODE.loadOutput.x}
        y2={NODE.loadOutput.y + 43}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <WirePath points={WIRE.loadToVccNegative} />

      <motion.g
        initial={false}
        animate={{
          opacity: active ? [0.35, 1, 0.35] : 0,
        }}
        transition={{
          duration: active ? 1.1 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      >
        <line
          x1={NODE.loadOutput.x + 18}
          y1={NODE.loadOutput.y - 38}
          x2={NODE.loadOutput.x + 45}
          y2={NODE.loadOutput.y - 68}
          stroke={STYLE.wire}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon
          points={`${NODE.loadOutput.x + 40},${NODE.loadOutput.y - 72} ${
            NODE.loadOutput.x + 58
          },${NODE.loadOutput.y - 77} ${NODE.loadOutput.x + 50},${
            NODE.loadOutput.y - 60
          }`}
          fill={STYLE.wire}
        />

        <line
          x1={NODE.loadOutput.x + 18}
          y1={NODE.loadOutput.y - 10}
          x2={NODE.loadOutput.x + 55}
          y2={NODE.loadOutput.y - 10}
          stroke={STYLE.wire}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon
          points={`${NODE.loadOutput.x + 50},${NODE.loadOutput.y - 18} ${
            NODE.loadOutput.x + 68
          },${NODE.loadOutput.y - 10} ${NODE.loadOutput.x + 50},${
            NODE.loadOutput.y - 2
          }`}
          fill={STYLE.wire}
        />
      </motion.g>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: labels and pin markers
--------------------------------------------- */

function PinLabels() {
  return (
    <g>
      <circle cx={NODE.pin1.x} cy={NODE.pin1.y} r="10" fill={STYLE.wire} />
      <circle cx={NODE.pin2.x} cy={NODE.pin2.y} r="10" fill={STYLE.wire} />
      <circle cx={NODE.pin3.x} cy={NODE.pin3.y} r="10" fill={STYLE.wire} />
      <circle cx={NODE.pin4.x} cy={NODE.pin4.y} r="10" fill={STYLE.wire} />

      <text
        x={LABEL.input.x}
        y={LABEL.input.y}
        fontSize="56"
        fontFamily="Arial"
      >
        INPUT
      </text>

      <text
        x={LABEL.vcc.x}
        y={LABEL.vcc.y}
        fontSize="56"
        fontFamily="Arial"
      >
        Vcc
      </text>

      <text
        x={LABEL.pin1.x}
        y={LABEL.pin1.y}
        fontSize="58"
        fontFamily="Arial"
        fontWeight="700"
      >
        1
      </text>

      <text
        x={LABEL.pin2.x}
        y={LABEL.pin2.y}
        fontSize="58"
        fontFamily="Arial"
        fontWeight="700"
      >
        2
      </text>

      <text
        x={LABEL.pin3.x}
        y={LABEL.pin3.y}
        fontSize="58"
        fontFamily="Arial"
        fontWeight="700"
      >
        3
      </text>

      <text
        x={LABEL.pin4.x}
        y={LABEL.pin4.y}
        fontSize="58"
        fontFamily="Arial"
        fontWeight="700"
      >
        4
      </text>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: current flow layer

   Current dots depend on results.status === "ON" through active.
   This prevents hidden or faint current motion when the circuit is OFF.
--------------------------------------------- */

function CurrentFlowLayer({
  active,
  showCurrentDots,
  showFlowDebugPaths,
}: {
  active: boolean;
  showCurrentDots: boolean;
  showFlowDebugPaths: boolean;
}) {
  return (
    <>
      {showFlowDebugPaths && <FlowDebugPaths />}

      {showCurrentDots && (
        <>
          <FlowDots
            path={CURRENT_PATH.inputPositiveToLed}
            active={active}
            color={STYLE.inputCurrent}
            count={12}
            duration={2.2}
            radius={3.8}
          />

          <FlowDots
            path={CURRENT_PATH.inputLedToNegative}
            active={active}
            color={STYLE.inputCurrent}
            count={10}
            duration={2.2}
            radius={3.8}
          />

          <FlowDots
            path={CURRENT_PATH.outputPositiveToPhotodiode}
            active={active}
            color={STYLE.outputCurrent}
            count={10}
            duration={2.35}
            radius={3.8}
          />

          <FlowDots
            path={CURRENT_PATH.outputPhotodiodeToLoadToNegative}
            active={active}
            color={STYLE.outputCurrent}
            count={13}
            duration={2.45}
            radius={3.8}
          />
        </>
      )}
    </>
  );
}

/* ---------------------------------------------
   Main circuit SVG
--------------------------------------------- */

function PhotodiodeCircuitSvg({
  active,
  showCurrentDots,
  showDebugTerminals,
  showFlowDebugPaths,
}: {
  active: boolean;
  showCurrentDots: boolean;
  showDebugTerminals: boolean;
  showFlowDebugPaths: boolean;
}) {
  const canvasTransform = buildCanvasScaleTransform(SCALE.CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={SVG_VIEW_BOX}
      className="h-auto w-full"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="Photodiode optocoupler switching circuit schematic"
    >
      <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill="#ffffff" />

      <g transform={canvasTransform}>
        <InputBattery />
        <InputSwitch active={active} />

        <OptocouplerFrame />
        <InputLed active={active} />
        <InputReturnWire />

        <PhotodiodeOutput active={active} />

        <DcOutputSource />
        <DcLoadNetwork active={active} />

        <CurrentFlowLayer
          active={active}
          showCurrentDots={showCurrentDots}
          showFlowDebugPaths={showFlowDebugPaths}
        />

        <PinLabels />

        {showDebugTerminals && <DebugTerminals />}
      </g>
    </svg>
  );
}

/* ---------------------------------------------
   Control panel
--------------------------------------------- */

function ControlPanel({
  controlMode,
  inputVoltage,
  setInputVoltage,
  isolation,
  setIsolation,
  enabled,
  onControlModeChange,
  onToggleEnabled,
  results,
  selfTestsPassed,
}: {
  controlMode: ControlMode;
  inputVoltage: number;
  setInputVoltage: Dispatch<SetStateAction<number>>;
  isolation: IsolationMode;
  setIsolation: Dispatch<SetStateAction<IsolationMode>>;
  enabled: boolean;
  onControlModeChange: (mode: ControlMode) => void;
  onToggleEnabled: () => void;
  results: SimulationResult;
  selfTestsPassed: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
            Output Device
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Photodiode Control
          </h2>
        </div>

        <div
          className={cn(
            "rounded-full px-4 py-2 text-xs font-black",
            results.status === "ON"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600",
          )}
        >
          {results.status}
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <p className="text-sm font-black text-emerald-800">Selected Type</p>
        <p className="mt-1 text-2xl font-black text-emerald-700">
          Photodiode
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Mode Select
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onControlModeChange("onOff")}
            className={cn(
              "rounded-2xl px-3 py-3 text-sm font-black transition",
              controlMode === "onOff"
                ? "bg-purple-700 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100",
            )}
          >
            ON/OFF Mode
          </button>

          <button
            type="button"
            onClick={() => onControlModeChange("timeline")}
            className={cn(
              "rounded-2xl px-3 py-3 text-sm font-black transition",
              controlMode === "timeline"
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100",
            )}
          >
            Timeline Mode
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <span className="font-black text-slate-700">Input Signal</span>

        <button
          type="button"
          onClick={onToggleEnabled}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-black transition",
            enabled
              ? "bg-emerald-600 text-white"
              : "bg-slate-300 text-slate-700",
          )}
        >
          {enabled ? "ON" : "OFF"}
        </button>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Input Voltage: {inputVoltage} V
        </label>

        <input
          type="range"
          min="0"
          max="24"
          step="0.5"
          value={inputVoltage}
          onChange={(event) => setInputVoltage(Number(event.target.value))}
          className="w-full accent-emerald-600"
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-bold text-slate-700">
          Isolation Level
        </p>

        <div className="grid grid-cols-3 gap-2">
          {(["Low", "Medium", "High"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setIsolation(mode)}
              className={cn(
                "rounded-2xl px-3 py-3 text-sm font-black transition",
                isolation === mode
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-700",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            LED Current
          </p>

          <p className="mt-2 text-2xl font-black text-red-600">
            {formatNumber(results.ledCurrent, 1)}mA
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Photo Current
          </p>

          <p className="mt-2 text-2xl font-black text-emerald-600">
            {formatNumber(results.outputCurrent, 2)}mA
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Isolation Rating
          </p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            {results.isolationVoltage}V
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Transfer
          </p>

          <p className="mt-2 text-2xl font-black text-emerald-600">
            {formatNumber(results.transferPercent, 0)}%
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Logic
        </p>

        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          When the input LED is ON, light crosses the isolation barrier and
          generates current in the photodiode. The output side conducts through
          the external Vcc and load circuit while staying electrically isolated
          from the input side.
        </p>

        <p className="mt-3 text-sm font-black text-slate-900">
          Status: {results.status}
        </p>

        <p className="mt-1 text-xs font-bold text-slate-500">
          Self tests: {selfTestsPassed ? "passed" : "failed"}
        </p>
      </div>
    </div>
  );
}

function SwitchingPreview({
  timelineProgress,
  timelineStep,
  onTimelineChange,
}: {
  timelineProgress: number;
  timelineStep: TimelineStep;
  onTimelineChange: (value: number) => void;
}) {
  const activeStep = TIMELINE_STEPS[timelineStep];

  return (
    <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Time Cursor / Switching Preview
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {activeStep.title}
          </p>
        </div>

        <span className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm">
          {Math.round(timelineProgress * 100)}%
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={0.999}
        step={0.001}
        value={timelineProgress}
        onChange={(event) => onTimelineChange(Number(event.target.value))}
        className="w-full accent-green-700"
        aria-label="Time Cursor / Switching Preview"
      />

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {TIMELINE_STEPS.map((step) => {
          const isActive = timelineStep === step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-2xl border px-3 py-3 text-sm font-black transition",
                isActive
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-50 text-slate-500",
              )}
            >
              {step.label}
            </div>
          );
        })}
      </div>

      <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-600 ring-1 ring-slate-200">
        {activeStep.description}
      </p>
    </section>
  );
}

/* ---------------------------------------------
   Main exported component

   Active state logic:
   All visual activity depends on results.status === "ON".
   This keeps OFF truly inactive and avoids faint light/current leftovers.
--------------------------------------------- */

export default function PhotodiodeCircuitControlPanel({
  initialEnabled = true,
  initialInputVoltage = 5,
  initialIsolation = "Medium",
  showControls = true,
  showCurrentDots = true,
  showDebugTerminals = false,
  showFlowDebugPaths = false,
  className,
}: PhotodiodeCircuitControlPanelProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [inputVoltage, setInputVoltage] = useState(() =>
    clamp(initialInputVoltage, 0, 24),
  );
  const [isolation, setIsolation] = useState<IsolationMode>(initialIsolation);
  const [controlMode, setControlMode] = useState<ControlMode>("onOff");
  const [timelineProgress, setTimelineProgress] = useState(0);

  const selfTestsPassed = useMemo(() => runSelfTests(), []);
  const timelineStep = toTimelineStep(timelineProgress);

  const results = useMemo(
    () =>
      calculatePhotodiodeSimulation({
        enabled,
        inputVoltage,
        isolation,
      }),
    [enabled, inputVoltage, isolation],
  );

  const timelineCircuitActive =
    controlMode === "timeline" &&
    enabled &&
    timelineStep > 0 &&
    results.status === "ON";
  const active =
    controlMode === "timeline" ? timelineCircuitActive : results.status === "ON";

  const handleControlModeChange = (mode: ControlMode) => {
    setControlMode(mode);

    if (mode === "timeline") {
      setEnabled(true);
    }
  };

  const handleToggleEnabled = () => {
    setControlMode("onOff");
    setEnabled((current) => !current);
  };

  const handleTimelineChange = (value: number) => {
    setControlMode("timeline");
    setEnabled(true);
    setTimelineProgress(clamp(value, 0, 0.999));
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-white p-3 text-slate-800 sm:p-6",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-5",
          showControls ? "xl:grid-cols-[340px_minmax(0,1fr)]" : "grid-cols-1",
        )}
      >
        {showControls && (
          <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
            <ControlPanel
              controlMode={controlMode}
              inputVoltage={inputVoltage}
              setInputVoltage={setInputVoltage}
              isolation={isolation}
              setIsolation={setIsolation}
              enabled={enabled}
              onControlModeChange={handleControlModeChange}
              onToggleEnabled={handleToggleEnabled}
              results={results}
              selfTestsPassed={selfTestsPassed}
            />
          </aside>
        )}

        <div
          className={cn(
            "rounded-3xl border border-slate-200 bg-white p-5 shadow-xl",
          )}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                Photodiode Circuit
              </p>

              <h1 className="mt-1 text-2xl font-black text-slate-900">
                LED to Optical Isolation to Photodiode Output
              </h1>
            </div>

            <div
              className={cn(
                "rounded-full px-4 py-2 text-xs font-black",
                active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {active ? "ACTIVE" : "OFF"}
            </div>
          </div>

          <SwitchingPreview
            timelineProgress={timelineProgress}
            timelineStep={timelineStep}
            onTimelineChange={handleTimelineChange}
          />

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
            <PhotodiodeCircuitSvg
              active={active}
              showCurrentDots={showCurrentDots}
              showDebugTerminals={showDebugTerminals}
              showFlowDebugPaths={showFlowDebugPaths}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
