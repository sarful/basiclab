"use client";

import React from "react";

type Point = { x: number; y: number };
type ViewBox = { minX: number; minY: number; width: number; height: number };

type TuneTransform = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  scale: number;
  rotation: number;
};

type TransformTune = {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  origin?: Point;
};

type TerminalKey = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
type RotationMode = "normal" | "rotate90";
type SimulationStepKey = "idle" | "input" | "isolation" | "output";

type SvgIds = ReturnType<typeof createSvgIds>;

export type SSR40DAProps = {
  className?: string;
  width?: number | string;
  height?: number | string;

  componentScale?: number;
  canvasScale?: number;
  wireScale?: number;

  componentOffset?: Partial<Point>;
  wireOffset?: Partial<Point>;
  debugTerminalOffset?: Partial<Point>;

  showDebugTerminals?: boolean;

  initialRunning?: boolean;
  autoStart?: boolean;
  simulationSpeed?: number;
  showControls?: boolean;
  showTimeline?: boolean;
  showCurrentDots?: boolean;
  rotationMode?: RotationMode;
};

export type SsrInternalsCircuitProps = SSR40DAProps;

/* =========================================================
   GLOBAL TUNING CONTROLS
========================================================= */

export const CIRCUIT_COMPONENT_SCALE = 0.8;
export const BASE_WIRE_WIDTH = 5;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const COMPONENT_OFFSET: Point = { x: 0, y: 0 };
export const WIRE_OFFSET: Point = { x: 0, y: 0 };
export const DEBUG_TERMINAL_OFFSET: Point = { x: 0, y: 0 };

export const SHOW_DEBUG_TERMINAL_DOTS = false;

/* =========================================================
   MAIN SVG ARCHITECTURE
========================================================= */

export const VIEW_BOX: ViewBox = {
  minX: 0,
  minY: 0,
  width: 720,
  height: 920,
};

export const SCALE = {
  canvas: CIRCUIT_CANVAS_SCALE,
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  baseWireWidth: BASE_WIRE_WIDTH,
  componentOffset: COMPONENT_OFFSET,
  wireOffset: WIRE_OFFSET,
  debugTerminalOffset: DEBUG_TERMINAL_OFFSET,
};

export const BASE_COMPONENT = {
  root: {
    x: 0,
    y: 0,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  bodySide: {
    x: 642,
    y: 50,
    width: 36,
    height: 830,
    topSkew: 22,
    bottomSkew: 30,
    scale: 1,
    rotation: 0,
  },

  bodyFront: {
    x: 70,
    y: 42,
    width: 572,
    height: 838,
    rx: 18,
    scale: 1,
    rotation: 0,
  },

  frontHighlight: {
    x: 88,
    y: 60,
    width: 542,
    height: 802,
    scale: 1,
    rotation: 0,
  },

  topMount: {
    x: 302,
    y: 40,
    width: 116,
    height: 150,
    neckHeight: 98,
    hole: { x: 360, y: 95, radius: 30 },
    scale: 1,
    rotation: 0,
  },

  bottomMount: {
    x: 302,
    y: 730,
    width: 116,
    height: 152,
    sideDrop: 52,
    hole: { x: 360, y: 836, radius: 30 },
    scale: 1,
    rotation: 0,
  },

  terminalPocket: {
    width: 160,
    height: 160,
    rx: 13,
    innerInset: 18,
    innerRx: 8,
    scale: 1,
    rotation: 0,
    screw: {
      centerOffset: { x: 80, y: 80 },
      terminalPlateSize: 106,
      screwOuterRadius: 45,
      screwInnerRadius: 38,
      slotArmLength: 28,
      slotArmWidth: 16,
      slotRound: 8,
      scale: 1,
      rotation: 0,
    },
    positions: {
      topLeft: { x: 95, y: 62, scale: 1, rotation: 0 },
      topRight: { x: 465, y: 62, scale: 1, rotation: 0 },
      bottomLeft: { x: 95, y: 720, scale: 1, rotation: 0 },
      bottomRight: { x: 465, y: 720, scale: 1, rotation: 0 },
    } satisfies Record<TerminalKey, Omit<TuneTransform, "width" | "height">>,
  },

  labelPanel: {
    x: 106,
    y: 230,
    width: 508,
    height: 548,
    corner: 12,
    bottomShelfY: 705,
    bottomStepY: 778,
    leftShelfEndX: 250,
    rightShelfStartX: 470,
    leftStepX: 270,
    rightStepX: 450,
    scale: 1,
    rotation: 0,
  },

  topGroove: {
    outerLeftX: 218,
    outerRightX: 502,
    innerLeftX: 302,
    innerRightX: 418,
    topY: 42,
    lowerY: 177,
    bottomY: 245,
    centerX: 360,
    cupBottomY: 205,
    scale: 1,
    rotation: 0,
  },

  topGrooveStroke: {
    leftX: 302,
    rightX: 418,
    topY: 50,
    neckBottomY: 125,
    cupBottomY: 205,
    centerX: 360,
    scale: 1,
    rotation: 0,
  },

  bottomGroove: {
    centerX: 360,
    darkY: 775,
    darkControlY: 690,
    darkLeftX: 255,
    darkRightX: 465,
    lightLeftX: 286,
    lightRightX: 434,
    lightControlY: 720,
    scale: 1,
    rotation: 0,
  },

  led: {
    x: 562,
    y: 628,
    outerRadius: 32,
    innerRadius: 23,
    highlight: { x: 552, y: 616, radius: 8 },
    scale: 1,
    rotation: 0,
  },

  baseShadow: {
    x1: 103,
    y1: 870,
    cx: 360,
    cy: 900,
    x2: 617,
    y2: 870,
    scale: 1,
    rotation: 0,
  },
};

export const COMPONENT = {
  ...BASE_COMPONENT,
  root: {
    ...BASE_COMPONENT.root,
    x: COMPONENT_OFFSET.x,
    y: COMPONENT_OFFSET.y,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },
};

export const NODE = {
  terminalCenters: {
    topLeft: { x: 175, y: 142 },
    topRight: { x: 545, y: 142 },
    bottomLeft: { x: 175, y: 800 },
    bottomRight: { x: 545, y: 800 },
  } satisfies Record<TerminalKey, Point>,

  terminalWireReference: {
    output1: { x: 168, y: 350 },
    output2: { x: 552, y: 350 },
    input3: { x: 168, y: 752 },
    input4: { x: 552, y: 752 },
  },

  mountHoles: {
    top: BASE_COMPONENT.topMount.hole,
    bottom: BASE_COMPONENT.bottomMount.hole,
  },

  led: {
    center: { x: BASE_COMPONENT.led.x, y: BASE_COMPONENT.led.y },
  },

  debug: {
    radius: 5,
    strokeWidth: 2,
  },
};

export const WIRE = {
  stroke: {
    color: "#f2f2f2",
    width: BASE_WIRE_WIDTH,
    lineCap: "square" as const,
    lineJoin: "miter" as const,
  },

  segments: {
    outputLeftBracket: [
      { from: { x: 142, y: 320 }, to: { x: 142, y: 350 } },
      { from: { x: 142, y: 350 }, to: { x: 285, y: 350 } },
    ],

    outputRightBracket: [
      { from: { x: 578, y: 320 }, to: { x: 578, y: 350 } },
      { from: { x: 578, y: 350 }, to: { x: 435, y: 350 } },
    ],

    modelTopDivider: [{ from: { x: 180, y: 438 }, to: { x: 540, y: 438 } }],

    modelBottomDivider: [{ from: { x: 180, y: 606 }, to: { x: 540, y: 606 } }],

    inputLeftBracket: [
      { from: { x: 245, y: 708 }, to: { x: 245, y: 680 } },
      { from: { x: 245, y: 680 }, to: { x: 302, y: 680 } },
    ],

    inputRightBracket: [
      { from: { x: 475, y: 708 }, to: { x: 475, y: 680 } },
      { from: { x: 475, y: 680 }, to: { x: 418, y: 680 } },
    ],
  },
};

export const PATH = {
  bodySide: (c = BASE_COMPONENT.bodySide) => `
    M ${c.x} ${c.y}
    L ${c.x + c.width} ${c.y + c.topSkew}
    L ${c.x + c.width} ${c.y + c.height - c.bottomSkew}
    L ${c.x} ${c.y + c.height}
    Z
  `,

  topMount: (c = BASE_COMPONENT.topMount) => {
    const centerX = c.x + c.width / 2;

    return `
      M ${c.x} ${c.y}
      L ${c.x + c.width} ${c.y}
      L ${c.x + c.width} ${c.y + c.neckHeight}
      Q ${c.x + c.width} ${c.y + c.height} ${centerX} ${c.y + c.height}
      Q ${c.x} ${c.y + c.height} ${c.x} ${c.y + c.neckHeight}
      Z
    `;
  },

  bottomMount: (c = BASE_COMPONENT.bottomMount) => {
    const centerX = c.x + c.width / 2;

    return `
      M ${c.x} ${c.y + c.sideDrop}
      Q ${c.x} ${c.y} ${centerX} ${c.y}
      Q ${c.x + c.width} ${c.y} ${c.x + c.width} ${c.y + c.sideDrop}
      L ${c.x + c.width} ${c.y + c.height}
      L ${c.x} ${c.y + c.height}
      Z
    `;
  },

  labelPanel: (c = BASE_COMPONENT.labelPanel) => `
    M ${c.x + c.corner} ${c.y}
    L ${c.x + c.width - c.corner} ${c.y}
    Q ${c.x + c.width} ${c.y} ${c.x + c.width} ${c.y + c.corner}
    L ${c.x + c.width} ${c.bottomShelfY - c.corner}
    Q ${c.x + c.width} ${c.bottomShelfY} ${c.x + c.width - c.corner} ${c.bottomShelfY}
    L ${c.rightShelfStartX} ${c.bottomShelfY}
    Q ${c.rightStepX} ${c.bottomShelfY} ${c.rightStepX} ${c.bottomShelfY + 20}
    L ${c.rightStepX} ${c.bottomStepY - 18}
    Q ${c.rightStepX} ${c.bottomStepY} ${c.rightStepX - 18} ${c.bottomStepY}
    L ${c.leftStepX + 18} ${c.bottomStepY}
    Q ${c.leftStepX} ${c.bottomStepY} ${c.leftStepX} ${c.bottomStepY - 18}
    L ${c.leftStepX} ${c.bottomShelfY + 20}
    Q ${c.leftStepX} ${c.bottomShelfY} ${c.leftShelfEndX} ${c.bottomShelfY}
    L ${c.x + c.corner} ${c.bottomShelfY}
    Q ${c.x} ${c.bottomShelfY} ${c.x} ${c.bottomShelfY - c.corner}
    L ${c.x} ${c.y + c.corner}
    Q ${c.x} ${c.y} ${c.x + c.corner} ${c.y}
    Z
  `,

  topGroove: (c = BASE_COMPONENT.topGroove) => `
    M ${c.outerLeftX} ${c.topY}
    L ${c.innerLeftX} ${c.topY}
    L ${c.innerLeftX} 122
    Q ${c.innerLeftX} ${c.cupBottomY} ${c.centerX} ${c.cupBottomY}
    Q ${c.innerRightX} ${c.cupBottomY} ${c.innerRightX} 122
    L ${c.innerRightX} ${c.topY}
    L ${c.outerRightX} ${c.topY}
    L ${c.outerRightX} 162
    Q ${c.outerRightX} ${c.lowerY} ${c.outerRightX - 14} ${c.lowerY}
    L 432 ${c.lowerY}
    Q 410 ${c.bottomY} ${c.centerX} ${c.bottomY}
    Q 310 ${c.bottomY} 288 ${c.lowerY}
    L 232 ${c.lowerY}
    Q ${c.outerLeftX} ${c.lowerY} ${c.outerLeftX} 162
    Z
  `,

  topGrooveStroke: (c = BASE_COMPONENT.topGrooveStroke) => `
    M ${c.leftX} ${c.topY}
    L ${c.leftX} ${c.neckBottomY}
    Q ${c.leftX} ${c.cupBottomY} ${c.centerX} ${c.cupBottomY}
    Q ${c.rightX} ${c.cupBottomY} ${c.rightX} ${c.neckBottomY}
    L ${c.rightX} ${c.topY}
  `,

  bottomGrooveDark: (c = BASE_COMPONENT.bottomGroove) => `
    M ${c.darkLeftX} ${c.darkY}
    Q 280 ${c.darkControlY} ${c.centerX} ${c.darkControlY}
    Q 440 ${c.darkControlY} ${c.darkRightX} ${c.darkY}
  `,

  bottomGrooveLight: (c = BASE_COMPONENT.bottomGroove) => `
    M ${c.lightLeftX} ${c.darkY}
    Q 302 ${c.lightControlY} ${c.centerX} ${c.lightControlY}
    Q 418 ${c.lightControlY} ${c.lightRightX} ${c.darkY}
  `,

  baseShadow: (c = BASE_COMPONENT.baseShadow) => `
    M ${c.x1} ${c.y1}
    Q ${c.cx} ${c.cy} ${c.x2} ${c.y2}
  `,
};

export const LABEL = {
  style: {
    fontFamily: "Arial, Helvetica, sans-serif",
    fill: "#f2f2f2",
    stroke: "#111111",
    strokeWidth: 2,
    paintOrder: "stroke" as const,
    letterSpacing: 0.5,
  },

  items: [
    {
      key: "outputTerminal1",
      text: "1",
      x: 168,
      y: 230,
      size: 58,
      weight: 700,
    },
    {
      key: "outputTerminal2",
      text: "2",
      x: 552,
      y: 230,
      size: 58,
      weight: 700,
    },
    {
      key: "outputVoltage",
      text: "24 ~ 380VAC",
      x: 360,
      y: 310,
      size: 38,
      weight: 700,
    },
    // { key: "output", text: "OUTPUT", x: 360, y: 356, size: 36, weight: 700 },
    // { key: "current", text: "40A", x: 360, y: 406, size: 42, weight: 700 },
    // { key: "model", text: "SSR-40DA", x: 360, y: 510, size: 62, weight: 800 },
    {
      key: "relayName",
      // text: "SOLID STATE RELAY",
      x: 360,
      y: 572,
      size: 41,
      weight: 800,
    },
    {
      key: "inputPlusCenter",
      text: "+",
      x: 360,
      y: 656,
      size: 50,
      weight: 800,
    },
    { key: "input", text: "INPUT", x: 360, y: 708, size: 42, weight: 800 },
    {
      key: "inputTerminal3",
      text: "= 3",
      x: 168,
      y: 752,
      size: 52,
      weight: 700,
    },
    {
      key: "inputVoltage",
      text: "3 ~ 32VDC",
      x: 360,
      y: 758,
      size: 42,
      weight: 800,
    },
    { key: "inputTerminal4", text: "4", x: 552, y: 752, size: 52, weight: 700 },
    { key: "inputPlusRight", text: "+", x: 610, y: 732, size: 50, weight: 800 },
  ],
};

/* =========================================================
   INTERACTIVE SSR SIMULATION MODEL
========================================================= */

export const SIMULATION = {
  cycleMs: 3800,

  stepOrder: ["idle", "input", "isolation", "output"] as const,

  steps: {
    idle: {
      label: "Idle",
      description:
        "DC input is off, the optocoupler is dark, and the AC output is open.",
      from: 0,
      to: 0.18,
    },
    input: {
      label: "1. DC input ON",
      description:
        "Terminals 3 and 4 energize the internal LED side of the SSR.",
      from: 0,
      to: 0.42,
    },
    isolation: {
      label: "2. Optical isolation",
      description:
        "Light crosses the isolation barrier and triggers the output switching stage.",
      from: 0.42,
      to: 0.68,
    },
    output: {
      label: "3. AC load ON",
      description:
        "The output side conducts between terminals 1 and 2 while the input stays active.",
      from: 0.68,
      to: 1,
    },
  } satisfies Record<
    SimulationStepKey,
    { label: string; description: string; from: number; to: number }
  >,
};

/* =========================================================
   INTERNAL CIRCUIT MANUAL TUNING
========================================================= */

export const INTERNAL_CIRCUIT_TUNE = {
  showInternalDebugDots: false,
  showDiodePolarityLabels: true,

  fullCircuitGroup: {
    x: 0,
    y: 80,
    scale: 1,
    rotation: 0,
    origin: { x: 360, y: 385 },
  },

  panel: {
    x: 170,
    y: 150,
    width: 380,
    height: 470,
    rx: 16,
    shadowX: 8,
    shadowY: 10,
    borderWidth: 5,
    innerInset: 8,
    innerStrokeWidth: 2,
  },

  outputTerminalGroup: {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    origin: { x: 360, y: 190 },
  },

  outputTerminal: {
    leftX: 250,
    rightX: 470,
    y: 150,
    radius: 12,
    glowRadius: 6,
    wireY: 210,
    wireLeftEndX: 290,
    wireRightEndX: 430,
    pinLabelY: 195,
    pin1OffsetX: -42,
    pin2OffsetX: 42,
  },

  outputLabel: {
    x: 360,
    y: 178,
    fontSize: 23,
  },

  switchingBlock: {
    group: {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      origin: { x: 360, y: 233 },
    },
    x: 290,
    y: 204,
    width: 140,
    height: 58,
    rx: 8,
    textX: 360,
    textY: 233,
    fontSize: 15,
  },

  lightSensorBlock: {
    group: {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      origin: { x: 360, y: 370 },
    },
    x: 286,
    y: 340,
    width: 148,
    height: 60,
    rx: 8,
    textX: 360,
    textY: 370,
    fontSize: 19,
  },

  switchToSensorLine: {
    strokeWidth: 6,
  },

  sideTitle: {
    x: 204,
    y: 386,
    fontSize: 29,
  },

  opticalArrowGroup: {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    origin: { x: 360, y: 455 },
  },

  lightArrowLeft: {
    x1: 318,
    y1: 486,
    x2: 344,
    y2: 430,
    headX1: 334,
    headY1: 435,
    headX2: 344,
    headY2: 430,
    headX3: 344,
    headY3: 444,
  },

  lightArrowRight: {
    x1: 376,
    y1: 486,
    x2: 402,
    y2: 430,
    headX1: 392,
    headY1: 435,
    headX2: 402,
    headY2: 430,
    headX3: 402,
    headY3: 444,
  },

  inputDiodeTerminalGroup: {
    x: 0,
    y: 10,
    scale: 1,
    rotation: 0,
    origin: { x: 360, y: 570 },
  },

  inputTerminal: {
    leftX: 250,
    rightX: 470,
    y: 620,
    radius: 12,
    glowRadius: 6,
    wireY: 570,
    leftJoinX: 310,
    rightJoinX: 410,
    labelY: 606,
  },

  diodeSymbolGroup: {
    x: 0,
    y: 50,
    scale: 1,
    rotation: 0,
    origin: { x: 360, y: 522 },
  },

  diode: {
    cathodeX: 300,
    cathodeTopY: 492,
    cathodeBottomY: 552,
    tipX: 328,
    baseX: 408,
    topY: 492,
    bottomY: 552,
    midY: 522,
    strokeWidth: 6,
  },

  diodePolarityLabel: {
    anodeX: 414,
    anodeY: 486,
    cathodeX: 292,
    cathodeY: 486,
    fontSize: 11,
  },

  inputLabelGroup: {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    origin: { x: 360, y: 602 },
  },

  inputLedLabel: {
    x: 360,
    y: 584,
    fontSize: 17,
  },

  ledStateLabel: {
    x: 360,
    y: 600,
    fontSize: 10,
  },

  inputMainLabel: {
    x: 360,
    y: 618,
    fontSize: 22,
  },

  currentDotStyle: {
    inputRadius: 5,
    opticalRadius: 5,
    outputRadius: 5,
    opacity: 0.95,
    inputPhases: [0, 0.25, 0.5, 0.75],
    opticalPhases: [0, 0.45],
    outputPhases: [0, 0.33, 0.66],
  },

  internalDebugDots: {
    radius: 4,
    strokeWidth: 1.5,
    fontSize: 8,
    labelOffsetX: 7,
    labelOffsetY: -7,
  },
};

/* =========================================================
   GENERAL HELPERS
========================================================= */

const addPoint = (a: Point, b?: Partial<Point>): Point => ({
  x: a.x + (b?.x ?? 0),
  y: a.y + (b?.y ?? 0),
});

const transformOf = ({
  x,
  y,
  scale,
  rotation,
  origin,
}: {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  origin?: Point;
}) => {
  const rotate = rotation
    ? ` rotate(${rotation} ${origin?.x ?? 0} ${origin?.y ?? 0})`
    : "";
  const scaleValue =
    scale === undefined || scale === 1 ? "" : ` scale(${scale})`;

  return `translate(${x ?? 0} ${y ?? 0})${rotate}${scaleValue}`;
};

/**
 * Internal transform helper.
 * This is used only for manually tuned internal groups.
 * It scales and rotates around the provided origin, then translates.
 */
const tuneTransformOf = (tune: TransformTune) => {
  const x = tune.x ?? 0;
  const y = tune.y ?? 0;
  const scale = tune.scale ?? 1;
  const rotation = tune.rotation ?? 0;
  const origin = tune.origin ?? { x: 0, y: 0 };

  return `
    translate(${x} ${y})
    rotate(${rotation} ${origin.x} ${origin.y})
    translate(${origin.x} ${origin.y})
    scale(${scale})
    translate(${-origin.x} ${-origin.y})
  `;
};

const applyTuneToPoint = (point: Point, tune: TransformTune): Point => {
  const x = tune.x ?? 0;
  const y = tune.y ?? 0;
  const scale = tune.scale ?? 1;
  const rotation = tune.rotation ?? 0;
  const origin = tune.origin ?? { x: 0, y: 0 };

  const scaled = {
    x: origin.x + (point.x - origin.x) * scale,
    y: origin.y + (point.y - origin.y) * scale,
  };

  if (!rotation) {
    return {
      x: scaled.x + x,
      y: scaled.y + y,
    };
  }

  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const dx = scaled.x - origin.x;
  const dy = scaled.y - origin.y;

  return {
    x: origin.x + dx * cos - dy * sin + x,
    y: origin.y + dx * sin + dy * cos + y,
  };
};

const applyTuneToPoints = (points: Point[], tune: TransformTune): Point[] =>
  points.map((point) => applyTuneToPoint(point, tune));

const composeTunePoint = (point: Point, tunes: TransformTune[]): Point =>
  tunes.reduce(
    (currentPoint, tune) => applyTuneToPoint(currentPoint, tune),
    point,
  );

const composeTunePoints = (points: Point[], tunes: TransformTune[]): Point[] =>
  points.map((point) => composeTunePoint(point, tunes));

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalizeSpeed = (speed?: number) => clamp(speed ?? 1, 0.25, 4);

const distanceBetween = (a: Point, b: Point) =>
  Math.hypot(b.x - a.x, b.y - a.y);

const polylineLength = (points: Point[]) =>
  points.reduce((total, point, index) => {
    if (index === 0) return total;
    return total + distanceBetween(points[index - 1], point);
  }, 0);

const pointAtPolylineProgress = (points: Point[], progress: number): Point => {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];

  const normalizedProgress = ((progress % 1) + 1) % 1;
  const totalLength = polylineLength(points);
  const targetLength = normalizedProgress * totalLength;

  let walkedLength = 0;

  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const segmentLength = distanceBetween(start, end);

    if (walkedLength + segmentLength >= targetLength) {
      const localProgress =
        segmentLength === 0 ? 0 : (targetLength - walkedLength) / segmentLength;

      return {
        x: start.x + (end.x - start.x) * localProgress,
        y: start.y + (end.y - start.y) * localProgress,
      };
    }

    walkedLength += segmentLength;
  }

  return points[points.length - 1];
};

const getRuntimeViewBox = (rotationMode: RotationMode): ViewBox => {
  if (rotationMode === "normal") return VIEW_BOX;

  const centerX = VIEW_BOX.minX + VIEW_BOX.width / 2;
  const centerY = VIEW_BOX.minY + VIEW_BOX.height / 2;

  return {
    minX: centerX - VIEW_BOX.height / 2,
    minY: centerY - VIEW_BOX.width / 2,
    width: VIEW_BOX.height,
    height: VIEW_BOX.width,
  };
};

const getSimulationStep = (
  progress: number,
  isPowered: boolean,
): SimulationStepKey => {
  if (!isPowered) return "idle";

  if (progress < SIMULATION.steps.isolation.from) return "input";
  if (progress < SIMULATION.steps.output.from) return "isolation";
  return "output";
};

const createSvgIds = (seed: string) => ({
  bodyFront: `${seed}-bodyFront`,
  bodySide: `${seed}-bodySide`,
  panel: `${seed}-panel`,
  terminalMetal: `${seed}-terminalMetal`,
  screwHead: `${seed}-screwHead`,
  mountMetal: `${seed}-mountMetal`,
  ledRed: `${seed}-ledRed`,
  softShadow: `${seed}-softShadow`,
  textShadow: `${seed}-textShadow`,
  ledGlow: `${seed}-ledGlow`,
  currentGlow: `${seed}-currentGlow`,
  internalPanelClip: `${seed}-internalPanelClip`,
});

const paint = (id: string) => `url(#${id})`;

const createRuntimeScale = (props: SSR40DAProps) => ({
  canvasScale: props.canvasScale ?? SCALE.canvas,
  componentScale: props.componentScale ?? SCALE.component,
  wireScale: props.wireScale ?? SCALE.wire,
  componentOffset: addPoint(SCALE.componentOffset, props.componentOffset),
  wireOffset: addPoint(SCALE.wireOffset, props.wireOffset),
  debugTerminalOffset: addPoint(
    SCALE.debugTerminalOffset,
    props.debugTerminalOffset,
  ),
});

/* =========================================================
   SVG DEFINITIONS
========================================================= */

const SvgDefs = ({ ids }: { ids: SvgIds }) => (
  <defs>
    <linearGradient id={ids.bodyFront} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#222222" />
      <stop offset="45%" stopColor="#111111" />
      <stop offset="100%" stopColor="#050505" />
    </linearGradient>

    <linearGradient id={ids.bodySide} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#3b3b3b" />
      <stop offset="100%" stopColor="#b8b8b8" />
    </linearGradient>

    <linearGradient id={ids.panel} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#202020" />
      <stop offset="100%" stopColor="#111111" />
    </linearGradient>

    <linearGradient id={ids.terminalMetal} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#e8e0d2" />
      <stop offset="45%" stopColor="#7e776d" />
      <stop offset="100%" stopColor="#eee7da" />
    </linearGradient>

    <radialGradient id={ids.screwHead} cx="35%" cy="28%" r="70%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="45%" stopColor="#c8c0b2" />
      <stop offset="100%" stopColor="#6d655b" />
    </radialGradient>

    <linearGradient id={ids.mountMetal} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f3eee4" />
      <stop offset="40%" stopColor="#8d8377" />
      <stop offset="100%" stopColor="#ded7cd" />
    </linearGradient>

    <radialGradient id={ids.ledRed} cx="35%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#ff6969" />
      <stop offset="55%" stopColor="#b00000" />
      <stop offset="100%" stopColor="#430000" />
    </radialGradient>

    <filter id={ids.softShadow} x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow
        dx="14"
        dy="18"
        stdDeviation="14"
        floodColor="#000000"
        floodOpacity="0.55"
      />
    </filter>

    <filter id={ids.textShadow} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="1"
        dy="2"
        stdDeviation="1"
        floodColor="#000000"
        floodOpacity="0.75"
      />
    </filter>

    <filter id={ids.ledGlow} x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="9" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id={ids.currentGlow} x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

/* =========================================================
   REUSABLE OUTER SSR SVG BLOCKS
========================================================= */

const SvgWireSegment = ({
  from,
  to,
  offset,
  strokeWidth,
}: {
  from: Point;
  to: Point;
  offset: Point;
  strokeWidth: number;
}) => {
  const a = addPoint(from, offset);
  const b = addPoint(to, offset);

  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={WIRE.stroke.color}
      strokeWidth={strokeWidth}
      strokeLinecap={WIRE.stroke.lineCap}
    />
  );
};

const SvgWireGroup = ({
  segments,
  offset,
  strokeWidth,
}: {
  segments: readonly { from: Point; to: Point }[];
  offset: Point;
  strokeWidth: number;
}) => (
  <g>
    {segments.map((segment, index) => (
      <SvgWireSegment
        key={`${segment.from.x}-${segment.from.y}-${segment.to.x}-${segment.to.y}-${index}`}
        from={segment.from}
        to={segment.to}
        offset={offset}
        strokeWidth={strokeWidth}
      />
    ))}
  </g>
);

const SvgLabel = ({
  text,
  x,
  y,
  size,
  weight,
  anchor = "middle",
}: {
  text: string;
  x: number;
  y: number;
  size: number;
  weight: number;
  anchor?: "start" | "middle" | "end";
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fontFamily={LABEL.style.fontFamily}
    fontSize={size}
    fontWeight={weight}
    fill={LABEL.style.fill}
    stroke={LABEL.style.stroke}
    strokeWidth={LABEL.style.strokeWidth}
    paintOrder={LABEL.style.paintOrder}
    letterSpacing={LABEL.style.letterSpacing}
  >
    {text}
  </text>
);

const MountHole = ({
  x,
  y,
  radius,
}: {
  x: number;
  y: number;
  radius: number;
}) => (
  <circle
    cx={x}
    cy={y}
    r={radius}
    fill="#ffffff"
    stroke="#4a443b"
    strokeWidth={5}
  />
);

const MetalMount = ({ ids, type }: { ids: SvgIds; type: "top" | "bottom" }) => {
  const config =
    type === "top" ? BASE_COMPONENT.topMount : BASE_COMPONENT.bottomMount;
  const hole = config.hole;

  return (
    <g
      transform={transformOf({
        x: 0,
        y: 0,
        scale: config.scale,
        rotation: config.rotation,
        origin: hole,
      })}
    >
      <path
        d={
          type === "top"
            ? PATH.topMount(BASE_COMPONENT.topMount)
            : PATH.bottomMount(BASE_COMPONENT.bottomMount)
        }
        fill={paint(ids.mountMetal)}
        stroke="#3c3935"
        strokeWidth={4}
        filter={`url(#${ids.softShadow})`}
      />
      <MountHole x={hole.x} y={hole.y} radius={hole.radius} />
    </g>
  );
};

const ScrewSlot = ({
  cx,
  cy,
  armLength,
  armWidth,
  round,
}: {
  cx: number;
  cy: number;
  armLength: number;
  armWidth: number;
  round: number;
}) => (
  <path
    d={`
      M ${cx - armWidth / 2} ${cy - armLength}
      Q ${cx} ${cy - armLength - round / 2} ${cx + armWidth / 2} ${cy - armLength}
      L ${cx + armWidth / 2} ${cy - armWidth / 2}
      L ${cx + armLength} ${cy - armWidth / 2}
      Q ${cx + armLength + round / 2} ${cy} ${cx + armLength} ${cy + armWidth / 2}
      L ${cx + armWidth / 2} ${cy + armWidth / 2}
      L ${cx + armWidth / 2} ${cy + armLength}
      Q ${cx} ${cy + armLength + round / 2} ${cx - armWidth / 2} ${cy + armLength}
      L ${cx - armWidth / 2} ${cy + armWidth / 2}
      L ${cx - armLength} ${cy + armWidth / 2}
      Q ${cx - armLength - round / 2} ${cy} ${cx - armLength} ${cy - armWidth / 2}
      L ${cx - armWidth / 2} ${cy - armWidth / 2}
      Z
    `}
    fill="#34312c"
    opacity={0.9}
  />
);

const Screw = ({ ids, cx, cy }: { ids: SvgIds; cx: number; cy: number }) => {
  const screw = BASE_COMPONENT.terminalPocket.screw;
  const plateSize = screw.terminalPlateSize;

  return (
    <g
      transform={transformOf({
        scale: screw.scale,
        rotation: screw.rotation,
        origin: { x: cx, y: cy },
      })}
    >
      <rect
        x={cx - plateSize / 2}
        y={cy - plateSize / 2}
        width={plateSize}
        height={plateSize}
        rx={8}
        fill={paint(ids.terminalMetal)}
        stroke="#111111"
        strokeWidth={5}
      />

      <circle
        cx={cx}
        cy={cy}
        r={screw.screwOuterRadius}
        fill="#d7d1c5"
        stroke="#151515"
        strokeWidth={5}
      />

      <circle
        cx={cx}
        cy={cy}
        r={screw.screwInnerRadius}
        fill={paint(ids.screwHead)}
        stroke="#5b554c"
        strokeWidth={2}
      />

      <ScrewSlot
        cx={cx}
        cy={cy}
        armLength={screw.slotArmLength}
        armWidth={screw.slotArmWidth}
        round={screw.slotRound}
      />

      <path
        d={`M ${cx - 31} ${cy - 31} Q ${cx - 5} ${cy - 45} ${cx + 25} ${cy - 26}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth={4}
        opacity={0.45}
      />
    </g>
  );
};

const TerminalPocket = ({
  ids,
  part,
}: {
  ids: SvgIds;
  part: Omit<TuneTransform, "width" | "height">;
}) => {
  const terminal = BASE_COMPONENT.terminalPocket;
  const screwCenter = {
    x: part.x + terminal.screw.centerOffset.x,
    y: part.y + terminal.screw.centerOffset.y,
  };

  return (
    <g
      transform={transformOf({
        scale: part.scale,
        rotation: part.rotation,
        origin: screwCenter,
      })}
    >
      <rect
        x={part.x}
        y={part.y}
        width={terminal.width}
        height={terminal.height}
        rx={terminal.rx}
        fill="#050505"
        stroke="#232323"
        strokeWidth={4}
      />

      <rect
        x={part.x + terminal.innerInset}
        y={part.y + terminal.innerInset}
        width={terminal.width - terminal.innerInset * 2}
        height={terminal.height - terminal.innerInset * 2}
        rx={terminal.innerRx}
        fill="#0d0d0d"
      />

      <Screw ids={ids} cx={screwCenter.x} cy={screwCenter.y} />
    </g>
  );
};

const BodySide = ({ ids }: { ids: SvgIds }) => (
  <path d={PATH.bodySide()} fill={paint(ids.bodySide)} opacity={0.92} />
);

const MainBody = ({ ids }: { ids: SvgIds }) => {
  const body = BASE_COMPONENT.bodyFront;

  return (
    <rect
      x={body.x}
      y={body.y}
      width={body.width}
      height={body.height}
      rx={body.rx}
      fill={paint(ids.bodyFront)}
      stroke="#2e2e2e"
      strokeWidth={4}
      filter={`url(#${ids.softShadow})`}
    />
  );
};

const MoldedGrooves = () => (
  <g>
    <path d={PATH.topGroove()} fill="#080808" opacity={0.72} />

    <path
      d={PATH.topGrooveStroke()}
      fill="none"
      stroke="#313131"
      strokeWidth={8}
    />

    <path
      d={PATH.bottomGrooveDark()}
      fill="none"
      stroke="#050505"
      strokeWidth={24}
      opacity={0.8}
    />

    <path
      d={PATH.bottomGrooveLight()}
      fill="none"
      stroke="#353535"
      strokeWidth={8}
      opacity={0.7}
    />
  </g>
);

const LabelPanel = ({ ids }: { ids: SvgIds }) => (
  <path
    d={PATH.labelPanel()}
    fill={paint(ids.panel)}
    stroke="#343434"
    strokeWidth={5}
  />
);

const IndicatorLed = ({
  ids,
  isPowered,
}: {
  ids: SvgIds;
  isPowered: boolean;
}) => {
  const led = BASE_COMPONENT.led;

  return (
    <g
      transform={transformOf({
        scale: led.scale,
        rotation: led.rotation,
        origin: { x: led.x, y: led.y },
      })}
    >
      {isPowered && (
        <circle
          cx={led.x}
          cy={led.y}
          r={led.outerRadius + 12}
          fill="#ff2b2b"
          opacity={0.28}
          filter={`url(#${ids.ledGlow})`}
        />
      )}

      <circle
        cx={led.x}
        cy={led.y}
        r={led.outerRadius}
        fill="#050505"
        stroke="#151515"
        strokeWidth={4}
      />

      <circle
        cx={led.x}
        cy={led.y}
        r={led.innerRadius}
        fill={paint(ids.ledRed)}
        stroke="#230000"
        strokeWidth={3}
        opacity={isPowered ? 1 : 0.55}
      />

      <circle
        cx={led.highlight.x}
        cy={led.highlight.y}
        r={led.highlight.radius}
        fill="#ff8b8b"
        opacity={isPowered ? 0.9 : 0.35}
      />
    </g>
  );
};

const FrontHighlight = () => {
  const highlight = BASE_COMPONENT.frontHighlight;

  return (
    <rect
      x={highlight.x}
      y={highlight.y}
      width={highlight.width}
      height={highlight.height}
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      opacity={0.08}
    />
  );
};

const BaseShadow = () => (
  <path
    d={PATH.baseShadow()}
    fill="none"
    stroke="#000000"
    strokeWidth={10}
    opacity={0.25}
  />
);

const RelayLabels = ({ ids }: { ids: SvgIds }) => (
  <g filter={`url(#${ids.textShadow})`}>
    {LABEL.items.map((item) => (
      <SvgLabel
        key={item.key}
        text={item.text}
        x={item.x}
        y={item.y}
        size={item.size}
        weight={item.weight}
      />
    ))}
  </g>
);

const RelayWires = ({
  offset,
  strokeWidth,
}: {
  offset: Point;
  strokeWidth: number;
}) => (
  <g>
    {Object.entries(WIRE.segments).map(([key, segments]) => (
      <SvgWireGroup
        key={key}
        segments={segments}
        offset={offset}
        strokeWidth={strokeWidth}
      />
    ))}
  </g>
);

const DebugTerminalDots = ({
  show,
  offset,
}: {
  show: boolean;
  offset: Point;
}) => {
  if (!show) return null;

  const allNodes = [
    ...Object.entries(NODE.terminalCenters).map(([key, point]) => ({
      key: `terminal-${key}`,
      point,
      fill: "#00aaff",
    })),
    ...Object.entries(NODE.terminalWireReference).map(([key, point]) => ({
      key: `wire-${key}`,
      point,
      fill: "#ffffff",
    })),
    {
      key: "led-center",
      point: NODE.led.center,
      fill: "#ff3344",
    },
    {
      key: "mount-top",
      point: { x: NODE.mountHoles.top.x, y: NODE.mountHoles.top.y },
      fill: "#35d07f",
    },
    {
      key: "mount-bottom",
      point: { x: NODE.mountHoles.bottom.x, y: NODE.mountHoles.bottom.y },
      fill: "#35d07f",
    },
  ];

  return (
    <g opacity={0.85} pointerEvents="none">
      {allNodes.map(({ key, point, fill }) => {
        const p = addPoint(point, offset);

        return (
          <circle
            key={key}
            cx={p.x}
            cy={p.y}
            r={NODE.debug.radius}
            fill={fill}
            stroke="#ffffff"
            strokeWidth={NODE.debug.strokeWidth}
          />
        );
      })}
    </g>
  );
};

/* =========================================================
   INTERNAL CIRCUIT REUSABLE BLOCKS
========================================================= */

type InternalTune = typeof INTERNAL_CIRCUIT_TUNE;

type InternalColors = {
  panelStroke: string;
  textLight: string;
  inputStroke: string;
  lightStroke: string;
  outputStroke: string;
};

type InternalPaths = {
  input: Point[];
  optical: Point[];
  output: Point[];
};

type DiodeLocalPoints = {
  anode: Point;
  tip: Point;
  cathode: Point;
  cathodeBottom: Point;
};

const InternalPanelClipDefs = ({
  ids,
  tune,
}: {
  ids: SvgIds;
  tune: InternalTune;
}) => (
  <defs>
    <clipPath id={ids.internalPanelClip} clipPathUnits="userSpaceOnUse">
      <rect
        x={tune.panel.x}
        y={tune.panel.y}
        width={tune.panel.width}
        height={tune.panel.height}
        rx={tune.panel.rx}
      />
    </clipPath>
  </defs>
);

const InternalPanelBase = ({ tune }: { tune: InternalTune }) => (
  <g>
    <rect
      x={tune.panel.x + tune.panel.shadowX}
      y={tune.panel.y + tune.panel.shadowY}
      width={tune.panel.width}
      height={tune.panel.height}
      rx={tune.panel.rx}
      fill="#000000"
      opacity={0.45}
    />

    <rect
      x={tune.panel.x}
      y={tune.panel.y}
      width={tune.panel.width}
      height={tune.panel.height}
      rx={tune.panel.rx}
      fill="#080b0f"
      opacity={1}
    />
  </g>
);

const InternalPanelBorder = ({
  tune,
  panelStroke,
}: {
  tune: InternalTune;
  panelStroke: string;
}) => (
  <g pointerEvents="none">
    <rect
      x={tune.panel.x}
      y={tune.panel.y}
      width={tune.panel.width}
      height={tune.panel.height}
      rx={tune.panel.rx}
      fill="none"
      stroke={panelStroke}
      strokeWidth={tune.panel.borderWidth}
    />

    <rect
      x={tune.panel.x + tune.panel.innerInset}
      y={tune.panel.y + tune.panel.innerInset}
      width={tune.panel.width - tune.panel.innerInset * 2}
      height={tune.panel.height - tune.panel.innerInset * 2}
      rx={12}
      fill="none"
      stroke="#1f2937"
      strokeWidth={tune.panel.innerStrokeWidth}
      opacity={0.95}
    />
  </g>
);

const OutputTerminalOverlay = ({
  tune,
  outputStroke,
  outputActive,
}: {
  tune: InternalTune;
  outputStroke: string;
  outputActive: boolean;
}) => (
  <g transform={tuneTransformOf(tune.outputTerminalGroup)}>
    <circle
      cx={tune.outputTerminal.leftX}
      cy={tune.outputTerminal.y}
      r={tune.outputTerminal.radius}
      fill={outputStroke}
    />

    <circle
      cx={tune.outputTerminal.rightX}
      cy={tune.outputTerminal.y}
      r={tune.outputTerminal.radius}
      fill={outputStroke}
    />

    {outputActive && (
      <>
        <circle
          cx={tune.outputTerminal.leftX}
          cy={tune.outputTerminal.y}
          r={tune.outputTerminal.glowRadius}
          fill={outputStroke}
          opacity={0.95}
        />

        <circle
          cx={tune.outputTerminal.rightX}
          cy={tune.outputTerminal.y}
          r={tune.outputTerminal.glowRadius}
          fill={outputStroke}
          opacity={0.95}
        />
      </>
    )}
  </g>
);

const InputTerminalOverlay = ({
  tune,
  inputStroke,
  inputActive,
}: {
  tune: InternalTune;
  inputStroke: string;
  inputActive: boolean;
}) => (
  <g transform={tuneTransformOf(tune.inputDiodeTerminalGroup)}>
    <circle
      cx={tune.inputTerminal.leftX}
      cy={tune.inputTerminal.y}
      r={tune.inputTerminal.radius}
      fill={inputStroke}
    />

    <circle
      cx={tune.inputTerminal.rightX}
      cy={tune.inputTerminal.y}
      r={tune.inputTerminal.radius}
      fill={inputStroke}
    />

    {inputActive && (
      <>
        <circle
          cx={tune.inputTerminal.leftX}
          cy={tune.inputTerminal.y}
          r={tune.inputTerminal.glowRadius}
          fill={inputStroke}
          opacity={0.95}
        />

        <circle
          cx={tune.inputTerminal.rightX}
          cy={tune.inputTerminal.y}
          r={tune.inputTerminal.glowRadius}
          fill={inputStroke}
          opacity={0.95}
        />
      </>
    )}
  </g>
);

const OutputStage = ({
  tune,
  outputStroke,
  outputActive,
}: {
  tune: InternalTune;
  outputStroke: string;
  outputActive: boolean;
}) => (
  <g transform={tuneTransformOf(tune.outputTerminalGroup)}>
    <text
      x={tune.outputLabel.x}
      y={tune.outputLabel.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={tune.outputLabel.fontSize}
      fontWeight={900}
      fill={outputStroke}
    >
      OUTPUT
    </text>

    <text
      x={tune.outputTerminal.leftX + tune.outputTerminal.pin1OffsetX}
      y={tune.outputTerminal.pinLabelY}
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={26}
      fontWeight={900}
      fill={outputStroke}
    >
      1
    </text>

    <text
      x={tune.outputTerminal.rightX + tune.outputTerminal.pin2OffsetX}
      y={tune.outputTerminal.pinLabelY}
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={26}
      fontWeight={900}
      fill={outputStroke}
    >
      2
    </text>

    <path
      d={`
        M ${tune.outputTerminal.leftX} ${tune.outputTerminal.y}
        L ${tune.outputTerminal.leftX} ${tune.outputTerminal.wireY}
        L ${tune.outputTerminal.wireLeftEndX} ${tune.outputTerminal.wireY}
      `}
      fill="none"
      stroke={outputStroke}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={outputActive ? 1 : 0.9}
    />

    <path
      d={`
        M ${tune.outputTerminal.rightX} ${tune.outputTerminal.y}
        L ${tune.outputTerminal.rightX} ${tune.outputTerminal.wireY}
        L ${tune.outputTerminal.wireRightEndX} ${tune.outputTerminal.wireY}
      `}
      fill="none"
      stroke={outputStroke}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={outputActive ? 1 : 0.9}
    />
  </g>
);

const SwitchingStage = ({ tune }: { tune: InternalTune }) => (
  <g transform={tuneTransformOf(tune.switchingBlock.group)}>
    <rect
      x={tune.switchingBlock.x}
      y={tune.switchingBlock.y}
      width={tune.switchingBlock.width}
      height={tune.switchingBlock.height}
      rx={tune.switchingBlock.rx}
      fill="#ffffff"
      stroke="#ffffff"
      strokeWidth={3}
    />

    <text
      x={tune.switchingBlock.textX}
      y={tune.switchingBlock.textY}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={tune.switchingBlock.fontSize}
      fontWeight={900}
      fill="#111827"
    >
      Switching Device
    </text>
  </g>
);

const LightSensorStage = ({
  tune,
  lightActive,
}: {
  tune: InternalTune;
  lightActive: boolean;
}) => (
  <g transform={tuneTransformOf(tune.lightSensorBlock.group)}>
    <rect
      x={tune.lightSensorBlock.x}
      y={tune.lightSensorBlock.y}
      width={tune.lightSensorBlock.width}
      height={tune.lightSensorBlock.height}
      rx={tune.lightSensorBlock.rx}
      fill="#ffffff"
      stroke={lightActive ? "#ffffff" : "#ffffff"}
      strokeWidth={3}
    />

    <text
      x={tune.lightSensorBlock.textX}
      y={tune.lightSensorBlock.textY}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={tune.lightSensorBlock.fontSize}
      fontWeight={900}
      fill="#111827"
    >
      Light Sensor
    </text>
  </g>
);

const SwitchToSensorConnection = ({
  tune,
  outputStroke,
  outputActive,
}: {
  tune: InternalTune;
  outputStroke: string;
  outputActive: boolean;
}) => {
  const switchBottom = composeTunePoint(
    {
      x: tune.switchingBlock.textX,
      y: tune.switchingBlock.y + tune.switchingBlock.height,
    },
    [tune.switchingBlock.group],
  );

  const sensorTop = composeTunePoint(
    {
      x: tune.lightSensorBlock.textX,
      y: tune.lightSensorBlock.y,
    },
    [tune.lightSensorBlock.group],
  );

  return (
    <line
      x1={switchBottom.x}
      y1={switchBottom.y}
      x2={sensorTop.x}
      y2={sensorTop.y}
      stroke={outputStroke}
      strokeWidth={tune.switchToSensorLine.strokeWidth}
      strokeLinecap="round"
      opacity={outputActive ? 1 : 0.85}
    />
  );
};

const OpticalIsolationStage = ({
  tune,
  lightStroke,
  lightActive,
}: {
  tune: InternalTune;
  lightStroke: string;
  lightActive: boolean;
}) => (
  <g transform={tuneTransformOf(tune.opticalArrowGroup)}>
    <path
      d={`
        M ${tune.lightArrowLeft.x1} ${tune.lightArrowLeft.y1}
        L ${tune.lightArrowLeft.x2} ${tune.lightArrowLeft.y2}
      `}
      fill="none"
      stroke={lightStroke}
      strokeWidth={6}
      strokeLinecap="round"
      opacity={lightActive ? 1 : 0.9}
    />

    <path
      d={`
        M ${tune.lightArrowLeft.headX1} ${tune.lightArrowLeft.headY1}
        L ${tune.lightArrowLeft.headX2} ${tune.lightArrowLeft.headY2}
        L ${tune.lightArrowLeft.headX3} ${tune.lightArrowLeft.headY3}
      `}
      fill="none"
      stroke={lightStroke}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={lightActive ? 1 : 0.9}
    />

    <path
      d={`
        M ${tune.lightArrowRight.x1} ${tune.lightArrowRight.y1}
        L ${tune.lightArrowRight.x2} ${tune.lightArrowRight.y2}
      `}
      fill="none"
      stroke={lightStroke}
      strokeWidth={6}
      strokeLinecap="round"
      opacity={lightActive ? 1 : 0.9}
    />

    <path
      d={`
        M ${tune.lightArrowRight.headX1} ${tune.lightArrowRight.headY1}
        L ${tune.lightArrowRight.headX2} ${tune.lightArrowRight.headY2}
        L ${tune.lightArrowRight.headX3} ${tune.lightArrowRight.headY3}
      `}
      fill="none"
      stroke={lightStroke}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={lightActive ? 1 : 0.9}
    />
  </g>
);

const InputDiodeStage = ({
  tune,
  inputStroke,
  inputActive,
  diodeLocalPoints,
}: {
  tune: InternalTune;
  inputStroke: string;
  inputActive: boolean;
  diodeLocalPoints: DiodeLocalPoints;
}) => (
  <g transform={tuneTransformOf(tune.inputDiodeTerminalGroup)}>
    <path
      d={`
        M ${tune.inputTerminal.rightX} ${tune.inputTerminal.y}
        L ${tune.inputTerminal.rightX} ${tune.inputTerminal.wireY}
        L ${tune.inputTerminal.rightJoinX} ${tune.inputTerminal.wireY}
        L ${tune.inputTerminal.rightJoinX} ${diodeLocalPoints.anode.y}
        L ${diodeLocalPoints.anode.x} ${diodeLocalPoints.anode.y}
      `}
      fill="none"
      stroke={inputStroke}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={inputActive ? 1 : 0.9}
    />

    <path
      d={`
        M ${diodeLocalPoints.cathodeBottom.x} ${diodeLocalPoints.cathodeBottom.y}
        L ${diodeLocalPoints.cathode.x} ${diodeLocalPoints.cathode.y}
        L ${tune.inputTerminal.leftJoinX} ${diodeLocalPoints.cathode.y}
        L ${tune.inputTerminal.leftJoinX} ${tune.inputTerminal.wireY}
        L ${tune.inputTerminal.leftX} ${tune.inputTerminal.wireY}
        L ${tune.inputTerminal.leftX} ${tune.inputTerminal.y}
      `}
      fill="none"
      stroke={inputStroke}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={inputActive ? 1 : 0.9}
    />

    <g transform={tuneTransformOf(tune.diodeSymbolGroup)}>
      <path
        d={`
          M ${tune.diode.baseX} ${tune.diode.topY}
          L ${tune.diode.baseX} ${tune.diode.bottomY}
          L ${tune.diode.tipX} ${tune.diode.midY}
          Z
        `}
        fill="#080b0f"
        stroke={inputStroke}
        strokeWidth={tune.diode.strokeWidth}
        strokeLinejoin="round"
      />

      <line
        x1={tune.diode.cathodeX}
        y1={tune.diode.cathodeTopY}
        x2={tune.diode.cathodeX}
        y2={tune.diode.cathodeBottomY}
        stroke={inputStroke}
        strokeWidth={tune.diode.strokeWidth}
        strokeLinecap="round"
      />

      <line
        x1={tune.diode.tipX}
        y1={tune.diode.midY}
        x2={tune.diode.cathodeX}
        y2={tune.diode.midY}
        stroke={inputStroke}
        strokeWidth={tune.diode.strokeWidth}
        strokeLinecap="round"
      />

      {tune.showDiodePolarityLabels && (
        <>
          <text
            x={tune.diodePolarityLabel.anodeX}
            y={tune.diodePolarityLabel.anodeY}
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={tune.diodePolarityLabel.fontSize}
            fontWeight={800}
            fill={inputStroke}
          >
            Anode +
          </text>

          <text
            x={tune.diodePolarityLabel.cathodeX}
            y={tune.diodePolarityLabel.cathodeY}
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={tune.diodePolarityLabel.fontSize}
            fontWeight={800}
            fill={inputStroke}
          >
            Cathode −
          </text>
        </>
      )}
    </g>
  </g>
);

const InputLabelStage = ({
  tune,
  inputStroke,
  inputActive,
}: {
  tune: InternalTune;
  inputStroke: string;
  inputActive: boolean;
}) => (
  <g transform={tuneTransformOf(tune.inputLabelGroup)}>
    <text
      x={tune.inputLedLabel.x}
      y={tune.inputLedLabel.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={tune.inputLedLabel.fontSize}
      fontWeight={900}
      fill={inputStroke}
    >
      INPUT LED
    </text>

    <text
      x={tune.ledStateLabel.x}
      y={tune.ledStateLabel.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={tune.ledStateLabel.fontSize}
      fontWeight={800}
      fill={inputStroke}
    >
      {inputActive ? "LED ON" : "LED OFF"}
    </text>

    <text
      x={tune.inputTerminal.leftX}
      y={tune.inputTerminal.labelY}
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={18}
      fontWeight={900}
      fill={inputStroke}
    >
      − 3
    </text>

    <text
      x={tune.inputTerminal.rightX}
      y={tune.inputTerminal.labelY}
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={18}
      fontWeight={900}
      fill={inputStroke}
    >
      4 +
    </text>

    <text
      x={tune.inputMainLabel.x}
      y={tune.inputMainLabel.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={tune.inputMainLabel.fontSize}
      fontWeight={900}
      fill={inputStroke}
    >
      {/* INPUT */}
    </text>
  </g>
);

const SideTitle = ({
  tune,
  textLight,
}: {
  tune: InternalTune;
  textLight: string;
}) => (
  <text
    x={tune.sideTitle.x}
    y={tune.sideTitle.y}
    textAnchor="middle"
    dominantBaseline="middle"
    fontFamily="Arial, Helvetica, sans-serif"
    fontSize={tune.sideTitle.fontSize}
    fontWeight={900}
    fill={textLight}
    transform={`rotate(-90 ${tune.sideTitle.x} ${tune.sideTitle.y})`}
  >
    SSR INTERNALS
  </text>
);

const InternalCurrentDots = ({
  ids,
  tune,
  paths,
  isRunning,
  isPowered,
  showCurrentDots,
  timelineProgress,
  simulationStep,
  colors,
}: {
  ids: SvgIds;
  tune: InternalTune;
  paths: InternalPaths;
  isRunning: boolean;
  isPowered: boolean;
  showCurrentDots: boolean;
  timelineProgress: number;
  simulationStep: SimulationStepKey;
  colors: InternalColors;
}) => {
  if (
    !showCurrentDots ||
    !isRunning ||
    !isPowered ||
    simulationStep === "idle"
  ) {
    return null;
  }

  const inputDotsActive =
    simulationStep === "input" ||
    simulationStep === "isolation" ||
    simulationStep === "output";

  const opticalDotsActive =
    simulationStep === "isolation" || simulationStep === "output";

  const outputDotsActive = simulationStep === "output";

  const renderDots = (
    path: Point[],
    phases: number[],
    fill: string,
    radius: number,
    active: boolean,
  ) => {
    if (!active) return null;

    return phases.map((phase) => {
      const point = pointAtPolylineProgress(path, timelineProgress + phase);

      return (
        <circle
          key={`${fill}-${phase}`}
          cx={point.x}
          cy={point.y}
          r={radius}
          fill={fill}
          opacity={tune.currentDotStyle.opacity}
          filter={`url(#${ids.currentGlow})`}
        />
      );
    });
  };

  return (
    <g pointerEvents="none">
      {renderDots(
        paths.input,
        tune.currentDotStyle.inputPhases,
        colors.inputStroke,
        tune.currentDotStyle.inputRadius,
        inputDotsActive,
      )}

      {renderDots(
        paths.optical,
        tune.currentDotStyle.opticalPhases,
        colors.lightStroke,
        tune.currentDotStyle.opticalRadius,
        opticalDotsActive,
      )}

      {renderDots(
        paths.output,
        tune.currentDotStyle.outputPhases,
        colors.outputStroke,
        tune.currentDotStyle.outputRadius,
        outputDotsActive,
      )}
    </g>
  );
};

const InternalDebugDots = ({
  tune,
  colors,
  paths,
  diodeAnodePoint,
  diodeCathodePoint,
}: {
  tune: InternalTune;
  colors: InternalColors;
  paths: InternalPaths;
  diodeAnodePoint: Point;
  diodeCathodePoint: Point;
}) => {
  if (!tune.showInternalDebugDots) return null;

  const debug = tune.internalDebugDots;

  const debugNodes = [
    {
      key: "output-1",
      label: "O1",
      point: composeTunePoint(
        { x: tune.outputTerminal.leftX, y: tune.outputTerminal.y },
        [tune.outputTerminalGroup],
      ),
      fill: colors.outputStroke,
    },
    {
      key: "output-2",
      label: "O2",
      point: composeTunePoint(
        { x: tune.outputTerminal.rightX, y: tune.outputTerminal.y },
        [tune.outputTerminalGroup],
      ),
      fill: colors.outputStroke,
    },
    {
      key: "switch-center",
      label: "SW",
      point: composeTunePoint(
        { x: tune.switchingBlock.textX, y: tune.switchingBlock.textY },
        [tune.switchingBlock.group],
      ),
      fill: "#22c55e",
    },
    {
      key: "sensor-center",
      label: "SNS",
      point: composeTunePoint(
        { x: tune.lightSensorBlock.textX, y: tune.lightSensorBlock.textY },
        [tune.lightSensorBlock.group],
      ),
      fill: colors.lightStroke,
    },
    {
      key: "diode-anode",
      label: "A+",
      point: diodeAnodePoint,
      fill: colors.inputStroke,
    },
    {
      key: "diode-cathode",
      label: "C−",
      point: diodeCathodePoint,
      fill: colors.inputStroke,
    },
    {
      key: "input-3",
      label: "3−",
      point: composeTunePoint(
        { x: tune.inputTerminal.leftX, y: tune.inputTerminal.y },
        [tune.inputDiodeTerminalGroup],
      ),
      fill: colors.inputStroke,
    },
    {
      key: "input-4",
      label: "4+",
      point: composeTunePoint(
        { x: tune.inputTerminal.rightX, y: tune.inputTerminal.y },
        [tune.inputDiodeTerminalGroup],
      ),
      fill: colors.inputStroke,
    },
    {
      key: "optical-start",
      label: "LS",
      point: paths.optical[0],
      fill: colors.lightStroke,
    },
    {
      key: "optical-end",
      label: "LE",
      point: paths.optical[paths.optical.length - 1],
      fill: colors.lightStroke,
    },
  ];

  return (
    <g pointerEvents="none">
      {debugNodes.map((node) => (
        <g key={node.key}>
          <circle
            cx={node.point.x}
            cy={node.point.y}
            r={debug.radius}
            fill={node.fill}
            stroke="#ffffff"
            strokeWidth={debug.strokeWidth}
          />

          <text
            x={node.point.x + debug.labelOffsetX}
            y={node.point.y + debug.labelOffsetY}
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={debug.fontSize}
            fontWeight={800}
            fill="#ffffff"
            stroke="#000000"
            strokeWidth={0.8}
            paintOrder="stroke"
          >
            {node.label}
          </text>
        </g>
      ))}
    </g>
  );
};

/* =========================================================
   INTERNAL SSR CIRCUIT STRUCTURE
========================================================= */

const SsrInternalStructure = ({
  ids,
  isPowered,
  isRunning,
  showCurrentDots,
  timelineProgress,
  simulationStep,
}: {
  ids: SvgIds;
  isPowered: boolean;
  isRunning: boolean;
  showCurrentDots: boolean;
  timelineProgress: number;
  simulationStep: SimulationStepKey;
}) => {
  const inputActive = isPowered;
  const lightActive =
    isPowered &&
    (simulationStep === "isolation" || simulationStep === "output");
  const outputActive = isPowered && simulationStep === "output";

  const colors: InternalColors = {
    panelStroke: "#2f3a4a",
    textLight: "#f8fafc",
    inputStroke: "#ef4444",
    lightStroke: "#f59e0b",
    outputStroke: "#60a5fa",
  };

  const tune = INTERNAL_CIRCUIT_TUNE;

  /**
   * Local diode points are transformed only by diodeSymbolGroup.
   * These are used inside inputDiodeTerminalGroup so wires connect correctly.
   */
  const diodeLocalPoints: DiodeLocalPoints = {
    anode: applyTuneToPoint(
      { x: tune.diode.baseX, y: tune.diode.midY },
      tune.diodeSymbolGroup,
    ),
    tip: applyTuneToPoint(
      { x: tune.diode.tipX, y: tune.diode.midY },
      tune.diodeSymbolGroup,
    ),
    cathode: applyTuneToPoint(
      { x: tune.diode.cathodeX, y: tune.diode.midY },
      tune.diodeSymbolGroup,
    ),
    cathodeBottom: applyTuneToPoint(
      { x: tune.diode.cathodeX, y: tune.diode.cathodeBottomY },
      tune.diodeSymbolGroup,
    ),
  };

  /**
   * Current-dot paths are converted into the internal panel coordinate space.
   * The whole internal group transform is applied by the outer <g>, so dots also
   * follow fullCircuitGroup x/y/scale/rotation without double-transforming.
   */
  const inputPathBase: Point[] = [
    { x: tune.inputTerminal.rightX, y: tune.inputTerminal.y },
    { x: tune.inputTerminal.rightX, y: tune.inputTerminal.wireY },
    { x: tune.inputTerminal.rightJoinX, y: tune.inputTerminal.wireY },
    { x: tune.inputTerminal.rightJoinX, y: diodeLocalPoints.anode.y },
  ];

  const inputPathEnd: Point[] = [
    { x: tune.inputTerminal.leftJoinX, y: diodeLocalPoints.cathode.y },
    { x: tune.inputTerminal.leftJoinX, y: tune.inputTerminal.wireY },
    { x: tune.inputTerminal.leftX, y: tune.inputTerminal.wireY },
    { x: tune.inputTerminal.leftX, y: tune.inputTerminal.y },
  ];

  const inputCurrentPath = [
    ...composeTunePoints(inputPathBase, [tune.inputDiodeTerminalGroup]),
    composeTunePoint({ x: tune.diode.baseX, y: tune.diode.midY }, [
      tune.diodeSymbolGroup,
      tune.inputDiodeTerminalGroup,
    ]),
    composeTunePoint({ x: tune.diode.tipX, y: tune.diode.midY }, [
      tune.diodeSymbolGroup,
      tune.inputDiodeTerminalGroup,
    ]),
    composeTunePoint({ x: tune.diode.cathodeX, y: tune.diode.midY }, [
      tune.diodeSymbolGroup,
      tune.inputDiodeTerminalGroup,
    ]),
    ...composeTunePoints(inputPathEnd, [tune.inputDiodeTerminalGroup]),
  ];

  const opticalCurrentPath = composeTunePoints(
    [
      { x: tune.lightArrowLeft.x1, y: tune.lightArrowLeft.y1 },
      { x: tune.lightArrowLeft.x2, y: tune.lightArrowLeft.y2 },
      { x: tune.lightSensorBlock.textX, y: tune.lightSensorBlock.textY },
    ],
    [tune.opticalArrowGroup],
  );

  const switchingCenter = composeTunePoint(
    { x: tune.switchingBlock.textX, y: tune.switchingBlock.textY },
    [tune.switchingBlock.group],
  );

  const outputCurrentPath = [
    ...composeTunePoints(
      [
        { x: tune.outputTerminal.leftX, y: tune.outputTerminal.y },
        { x: tune.outputTerminal.leftX, y: tune.outputTerminal.wireY },
        { x: tune.outputTerminal.wireLeftEndX, y: tune.outputTerminal.wireY },
      ],
      [tune.outputTerminalGroup],
    ),
    switchingCenter,
    ...composeTunePoints(
      [
        { x: tune.outputTerminal.wireRightEndX, y: tune.outputTerminal.wireY },
        { x: tune.outputTerminal.rightX, y: tune.outputTerminal.wireY },
        { x: tune.outputTerminal.rightX, y: tune.outputTerminal.y },
      ],
      [tune.outputTerminalGroup],
    ),
  ];

  const internalPaths: InternalPaths = {
    input: inputCurrentPath,
    optical: opticalCurrentPath,
    output: outputCurrentPath,
  };

  const diodeAnodeDebugPoint = composeTunePoint(
    { x: tune.diode.baseX, y: tune.diode.midY },
    [tune.diodeSymbolGroup, tune.inputDiodeTerminalGroup],
  );

  const diodeCathodeDebugPoint = composeTunePoint(
    { x: tune.diode.cathodeX, y: tune.diode.midY },
    [tune.diodeSymbolGroup, tune.inputDiodeTerminalGroup],
  );

  return (
    <g pointerEvents="none" transform={tuneTransformOf(tune.fullCircuitGroup)}>
      <InternalPanelClipDefs ids={ids} tune={tune} />

      <InternalPanelBase tune={tune} />

      <g clipPath={`url(#${ids.internalPanelClip})`}>
        <SideTitle tune={tune} textLight={colors.textLight} />

        <OutputStage
          tune={tune}
          outputStroke={colors.outputStroke}
          outputActive={outputActive}
        />

        <SwitchingStage tune={tune} />

        <SwitchToSensorConnection
          tune={tune}
          outputStroke={colors.outputStroke}
          outputActive={outputActive}
        />

        <LightSensorStage tune={tune} lightActive={lightActive} />

        <OpticalIsolationStage
          tune={tune}
          lightStroke={colors.lightStroke}
          lightActive={lightActive}
        />

        <InputDiodeStage
          tune={tune}
          inputStroke={colors.inputStroke}
          inputActive={inputActive}
          diodeLocalPoints={diodeLocalPoints}
        />

        <InputLabelStage
          tune={tune}
          inputStroke={colors.inputStroke}
          inputActive={inputActive}
        />

        <InternalCurrentDots
          ids={ids}
          tune={tune}
          paths={internalPaths}
          isRunning={isRunning}
          isPowered={isPowered}
          showCurrentDots={showCurrentDots}
          timelineProgress={timelineProgress}
          simulationStep={simulationStep}
          colors={colors}
        />
      </g>

      <InternalPanelBorder tune={tune} panelStroke={colors.panelStroke} />

      <OutputTerminalOverlay
        tune={tune}
        outputStroke={colors.outputStroke}
        outputActive={outputActive}
      />

      <InputTerminalOverlay
        tune={tune}
        inputStroke={colors.inputStroke}
        inputActive={inputActive}
      />

      <InternalDebugDots
        tune={tune}
        colors={colors}
        paths={internalPaths}
        diodeAnodePoint={diodeAnodeDebugPoint}
        diodeCathodePoint={diodeCathodeDebugPoint}
      />
    </g>
  );
};

/* =========================================================
   TIMELINE UI
========================================================= */

const SimulationTimeline = ({
  show,
  progress,
  step,
  isPowered,
}: {
  show: boolean;
  progress: number;
  step: SimulationStepKey;
  isPowered: boolean;
}) => {
  if (!show) return null;

  const stepInfo = SIMULATION.steps[step];
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-3 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span>{isPowered ? stepInfo.label : "Input OFF"}</span>
        <span>{isPowered ? `${progressPercent}%` : "0%"}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-sky-500 transition-[width] duration-100"
          style={{ width: `${isPowered ? progressPercent : 0}%` }}
        />
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        {isPowered ? stepInfo.description : SIMULATION.steps.idle.description}
      </p>
    </div>
  );
};

/* =========================================================
   CONTROL UI
========================================================= */

const SimulationControls = ({
  show,
  isRunning,
  isPowered,
  speed,
  onToggleRunning,
  onTogglePower,
  onReset,
  onSpeedChange,
}: {
  show: boolean;
  isRunning: boolean;
  isPowered: boolean;
  speed: number;
  onToggleRunning: () => void;
  onTogglePower: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}) => {
  if (!show) return null;

  const buttonBase =
    "rounded-xl px-3 py-2 text-sm font-semibold shadow-sm transition active:scale-95";

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={onToggleRunning}
        className={`${buttonBase} bg-sky-600 text-white hover:bg-sky-700`}
      >
        {isRunning ? "Pause" : "Start"}
      </button>

      <button
        type="button"
        onClick={onTogglePower}
        className={`${buttonBase} ${
          isPowered
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        }`}
      >
        {isPowered ? "Input ON" : "Input OFF"}
      </button>

      <button
        type="button"
        onClick={onReset}
        className={`${buttonBase} bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}
      >
        Reset
      </button>

      <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
        <button
          type="button"
          onClick={() => onSpeedChange(speed - 0.25)}
          className="rounded-lg px-2 py-1 hover:bg-white dark:hover:bg-slate-700"
          aria-label="Decrease simulation speed"
        >
          −
        </button>

        <span className="min-w-12 text-center">{speed.toFixed(2)}x</span>

        <button
          type="button"
          onClick={() => onSpeedChange(speed + 0.25)}
          className="rounded-lg px-2 py-1 hover:bg-white dark:hover:bg-slate-700"
          aria-label="Increase simulation speed"
        >
          +
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SSR40DA({
  className = "",
  width = "100%",
  height = "auto",
  componentScale,
  canvasScale,
  wireScale,
  componentOffset,
  wireOffset,
  debugTerminalOffset,
  showDebugTerminals = SHOW_DEBUG_TERMINAL_DOTS,

  initialRunning,
  autoStart = false,
  simulationSpeed,
  showControls = true,
  showTimeline = true,
  showCurrentDots = true,
  rotationMode = "normal",
}: SSR40DAProps) {
  const rawId = React.useId().replace(/:/g, "");
  const ids = createSvgIds(`ssr40da-${rawId}`);

  const shouldStart = initialRunning ?? autoStart;

  const [isRunning, setIsRunning] = React.useState(Boolean(shouldStart));
  const [isPowered, setIsPowered] = React.useState(
    Boolean(autoStart || shouldStart),
  );
  const [timelineProgress, setTimelineProgress] = React.useState(0);
  const [simulationStep, setSimulationStep] =
    React.useState<SimulationStepKey>("idle");
  const [speed, setSpeed] = React.useState(() =>
    normalizeSpeed(simulationSpeed),
  );

  const runtime = createRuntimeScale({
    componentScale,
    canvasScale,
    wireScale,
    componentOffset,
    wireOffset,
    debugTerminalOffset,
  });

  React.useEffect(() => {
    setSpeed(normalizeSpeed(simulationSpeed));
  }, [simulationSpeed]);

  React.useEffect(() => {
    setSimulationStep(getSimulationStep(timelineProgress, isPowered));
  }, [timelineProgress, isPowered]);

  React.useEffect(() => {
    if (!isRunning || !isPowered) return;

    let frameId = 0;
    let previousTime = performance.now();

    const tick = (time: number) => {
      const delta = time - previousTime;
      previousTime = time;

      setTimelineProgress((current) => {
        const next = current + (delta / SIMULATION.cycleMs) * speed;
        return next >= 1 ? next % 1 : next;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isRunning, isPowered, speed]);

  const wireStrokeWidth = BASE_WIRE_WIDTH * runtime.wireScale;
  const runtimeViewBox = getRuntimeViewBox(rotationMode);
  const rootRotation =
    rotationMode === "rotate90" ? 90 : COMPONENT.root.rotation;

  const handleToggleRunning = () => {
    setIsRunning((current) => !current);
  };

  const handleTogglePower = () => {
    setIsPowered((current) => !current);
    setIsRunning(true);
  };

  const handleReset = () => {
    setTimelineProgress(0);
    setSimulationStep(getSimulationStep(0, isPowered));
  };

  const handleSpeedChange = (nextSpeed: number) => {
    setSpeed(normalizeSpeed(nextSpeed));
  };

  const handleTimeCursorChange = (nextProgress: number) => {
    const normalizedProgress = Math.min(0.999, Math.max(0, nextProgress));

    setIsPowered(true);
    setIsRunning(false);
    setTimelineProgress(normalizedProgress);
  };

  const stepInfo = SIMULATION.steps[simulationStep];
  const progressPercent = Math.round(timelineProgress * 100);

  return (
    <div
      className={`grid w-full gap-5 bg-transparent xl:grid-cols-[360px_minmax(0,1fr)] ${className}`}
      style={{ width, height }}
    >
      <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100 xl:sticky xl:top-4 xl:self-start">
        <div className="rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-300">
            Control Panel
          </p>
          <h3 className="mt-1 text-xl font-black">SSR Internals</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
            <span
              className={`rounded-full px-3 py-1 ${
                isPowered
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-white/10 text-white"
              }`}
            >
              Input {isPowered ? "ON" : "OFF"}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              {isRunning ? "Running" : "Paused"}
            </span>
            <span className="rounded-full bg-sky-400 px-3 py-1 text-slate-950">
              {isPowered ? stepInfo.label : "Input OFF"}
            </span>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
            Simulation Controls
          </p>
          <div className="mt-3">
            <SimulationControls
              show={showControls}
              isRunning={isRunning}
              isPowered={isPowered}
              speed={speed}
              onToggleRunning={handleToggleRunning}
              onTogglePower={handleTogglePower}
              onReset={handleReset}
              onSpeedChange={handleSpeedChange}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <h4 className="text-sm font-black text-slate-800">
            Internal Switching State
          </h4>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            {isPowered ? stepInfo.description : SIMULATION.steps.idle.description}
          </p>
        </section>

        <section className="grid gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold text-emerald-950">
          <div className="flex items-center justify-between">
            <span>Input LED</span>
            <span>{isPowered ? "ON" : "OFF"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Opto Isolation</span>
            <span>{isPowered && simulationStep !== "idle" ? "Active" : "Idle"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Output Switch</span>
            <span>{simulationStep === "output" ? "Conducting" : "Waiting"}</span>
          </div>
        </section>
      </aside>

      <div className="min-w-0 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Time Cursor / Switching Preview
              </h2>
            </div>
            <span className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm">
              {isPowered ? progressPercent : 0}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={0.999}
            step={0.001}
            value={isPowered ? timelineProgress : 0}
            onChange={(event) =>
              handleTimeCursorChange(Number(event.target.value))
            }
            className="w-full accent-green-700"
            aria-label="Time Cursor / Switching Preview"
          />
          <SimulationTimeline
            show={showTimeline}
            progress={timelineProgress}
            step={simulationStep}
            isPowered={isPowered}
          />
        </section>

        <div className="mx-auto flex w-full max-w-[620px] justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          <svg
            viewBox={`${runtimeViewBox.minX} ${runtimeViewBox.minY} ${runtimeViewBox.width} ${runtimeViewBox.height}`}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Interactive SSR-40DA Solid State Relay simulation"
            className="h-auto max-h-[560px] w-auto max-w-full"
            preserveAspectRatio="xMidYMid meet"
            style={{
              transform: `scale(${runtime.canvasScale})`,
              transformOrigin: "center",
            }}
          >
            <SvgDefs ids={ids} />

          <g
            transform={transformOf({
              x: runtime.componentOffset.x,
              y: runtime.componentOffset.y,
              scale: runtime.componentScale,
              rotation: rootRotation,
              origin: {
                x: VIEW_BOX.width / 2,
                y: VIEW_BOX.height / 2,
              },
            })}
          >
            <BodySide ids={ids} />

            <MetalMount ids={ids} type="top" />
            <MetalMount ids={ids} type="bottom" />

            <MainBody ids={ids} />
            <MoldedGrooves />

            <TerminalPocket
              ids={ids}
              part={BASE_COMPONENT.terminalPocket.positions.topLeft}
            />
            <TerminalPocket
              ids={ids}
              part={BASE_COMPONENT.terminalPocket.positions.topRight}
            />
            <TerminalPocket
              ids={ids}
              part={BASE_COMPONENT.terminalPocket.positions.bottomLeft}
            />
            <TerminalPocket
              ids={ids}
              part={BASE_COMPONENT.terminalPocket.positions.bottomRight}
            />

            <LabelPanel ids={ids} />

            <RelayWires
              offset={runtime.wireOffset}
              strokeWidth={wireStrokeWidth}
            />

            <RelayLabels ids={ids} />

            <SsrInternalStructure
              ids={ids}
              isPowered={isPowered}
              isRunning={isRunning}
              showCurrentDots={showCurrentDots}
              timelineProgress={timelineProgress}
              simulationStep={simulationStep}
            />

            <IndicatorLed ids={ids} isPowered={isPowered} />

            <FrontHighlight />
            <BaseShadow />

            <DebugTerminalDots
              show={showDebugTerminals}
              offset={runtime.debugTerminalOffset}
            />
          </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export { SSR40DA as SsrInternalsCircuit };
