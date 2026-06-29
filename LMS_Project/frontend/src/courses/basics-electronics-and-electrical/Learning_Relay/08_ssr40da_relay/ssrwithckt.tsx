"use client";

import React from "react";

/* =========================================================
   TYPES
========================================================= */

type Point = { x: number; y: number };
type ViewBox = { minX: number; minY: number; width: number; height: number };
type Segment = { from: Point; to: Point };
type TerminalKey = "output1" | "output2" | "input3" | "input4";
type RotationMode = "normal" | "rotate90";

type TuneTransform = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  scale: number;
  rotation: number;
};

type ManualGroupControl = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
};

type SsrGroupControl = ManualGroupControl & {
  baseWidth: number;
  baseHeight: number;
  terminals: Record<TerminalKey, Point>;
};

type CurrentKind = "dc" | "ac";

type CurrentFlowPath = {
  key: string;
  kind: CurrentKind;
  points: Point[];
  d: string;
  length: number;
  dotCount: number;
  phaseOffset: number;
  reverse?: boolean;
};

type SvgIds = {
  bodyFront: string;
  bodySide: string;
  panel: string;
  terminalMetal: string;
  screwHead: string;
  mountMetal: string;
  ledRed: string;
  ledGlow: string;
  loadGlow: string;
  sourceGlow: string;
  dotGlow: string;
  softShadow: string;
  textShadow: string;
};

export type RelayProps = {
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
  showCircuitLabels?: boolean;

  ssrGroup?: Partial<ManualGroupControl>;

  initialRunning?: boolean;
  autoStart?: boolean;
  simulationSpeed?: number;
  showControls?: boolean;
  showTimeline?: boolean;
  showCurrentDots?: boolean;
  rotationMode?: RotationMode;
  loop?: boolean;
};

/* =========================================================
   REQUIRED GLOBAL TUNING CONTROLS
========================================================= */

export const CIRCUIT_COMPONENT_SCALE = 0.6;
export const BASE_WIRE_WIDTH = 3;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const COMPONENT_OFFSET: Point = { x: 0, y: 0 };
export const WIRE_OFFSET: Point = { x: 0, y: 0 };
export const DEBUG_TERMINAL_OFFSET: Point = { x: 0, y: 0 };

export const CURRENT_DOT_OFFSET: Point = { x: 0, y: 0 };
export const CURRENT_DOT_SCALE = 1;

export const TIMELINE_OFFSET: Point = { x: 0, y: 0 };
export const TIMELINE_SCALE = 1;

export const CONTROL_PANEL_OFFSET: Point = { x: 0, y: 0 };
export const ROTATION_OFFSET: Point = { x: 0, y: 0 };
export const ROTATED_COMPONENT_OFFSET: Point = { x: 0, y: 0 };

export const SHOW_DEBUG_TERMINAL_DOTS = false;

/* =========================================================
   REQUIRED SECTIONS
========================================================= */

export const VIEW_BOX: ViewBox = {
  minX: 0,
  minY: 0,
  width: 420,
  height: 820,
};

export const ROTATED_VIEW_BOX: ViewBox = {
  minX: 0,
  minY: 0,
  width: 820,
  height: 420,
};

export const ROTATION_ORIGIN: Point = {
  x: VIEW_BOX.width / 2,
  y: VIEW_BOX.height / 2,
};

export const ROTATION_CONFIG = {
  normal: {
    mode: "normal" as const,
    degree: 0,
    viewBox: VIEW_BOX,
    origin: ROTATION_ORIGIN,
    offset: { x: 0, y: 0 },
  },
  rotate90: {
    mode: "rotate90" as const,
    degree: 90,
    viewBox: ROTATED_VIEW_BOX,
    origin: { x: 0, y: 0 },
    offset: ROTATION_OFFSET,
  },
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

/* =========================================================
   SIMULATION CONSTANTS
========================================================= */

export const SIMULATION_TIMELINE = [
  { step: 0, title: "OFF", description: "Circuit idle" },
  { step: 1, title: "DC Input", description: "DC source applied" },
  { step: 2, title: "Input LED", description: "SSR LED turns ON" },
  { step: 3, title: "Opto", description: "Opto-isolation activates" },
  { step: 4, title: "Switch", description: "Output switch closes" },
  { step: 5, title: "AC Flow", description: "AC load current flows" },
  { step: 6, title: "Load ON", description: "Load is energized" },
];

export const SIMULATION_STEP_DURATION = 900;

export const TIMELINE_CONFIG = {
  width: 420,
  height: 86,
  progressHeight: 6,
  dotSize: 18,
  activeColor: "#16a34a",
  inactiveColor: "#d1d5db",
  activeText: "#111827",
  inactiveText: "#6b7280",
  completeColor: "#2563eb",
};

export const CURRENT_FLOW = {
  inputActivationStep: 1,
  ledActivationStep: 2,
  optoActivationStep: 3,
  outputSwitchStep: 4,
  outputActivationStep: 5,
  loadActivationStep: 6,
};

export const CURRENT_DOT = {
  dc: {
    radius: 4,
    fill: "#2563eb",
    stroke: "#ffffff",
    strokeWidth: 1.4,
    opacity: 0.95,
  },
  ac: {
    radius: 4.8,
    fill: "#f97316",
    stroke: "#ffffff",
    strokeWidth: 1.5,
    opacity: 0.95,
  },
};

export const CURRENT_ANIMATION = {
  baseCycleDurationMs: 2300,
  acCycleDurationMs: 1900,
  acHalfCycleMs: 700,
  minSpeed: 0.25,
  maxSpeed: 3,
  speedStep: 0.25,
};

export const LED_ACTIVE_STYLE = {
  glowRadius: 46,
  glowOpacity: 0.85,
  ledOpacity: 1,
  highlightOpacity: 0.95,
};

export const LOAD_ACTIVE_STYLE = {
  fill: "#fff7ed",
  stroke: "#f97316",
  glowStroke: "#fb923c",
  glowWidth: 9,
  glowOpacity: 0.34,
};

export const SOURCE_ACTIVE_STYLE = {
  stroke: "#2563eb",
  glowStroke: "#60a5fa",
  glowWidth: 8,
  glowOpacity: 0.28,
};

/* =========================================================
   FULL MANUAL SSR GROUP CONTROL
========================================================= */

export const SSR_GROUP_MANUAL_ADJUSTMENT: SsrGroupControl = {
  x: 59,
  y: 160,
  width: 302.4,
  height: 386.4,
  scale: 1,
  rotation: 0,
  baseWidth: 720,
  baseHeight: 920,
  terminals: {
    output1: { x: 175, y: 142 },
    output2: { x: 545, y: 142 },
    input3: { x: 175, y: 800 },
    input4: { x: 545, y: 800 },
  },
};

/* =========================================================
   BASE COMPONENT GEOMETRY
========================================================= */

export const BASE_COMPONENT = {
  root: {
    x: 0,
    y: 0,
    width: VIEW_BOX.width,
    height: VIEW_BOX.height,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  ssr: SSR_GROUP_MANUAL_ADJUSTMENT,

  outputCircuit: {
    x: 0,
    y: 0,
    width: VIEW_BOX.width,
    height: 170,
    topBusY: 36,
    scale: 1,
    rotation: 0,
  },

  outputLoad: {
    x: 119,
    y: 90,
    width: 27,
    height: 62,
    rx: 3,
    scale: 1,
    rotation: 0,
  },

  outputSource: {
    x: 288,
    y: 74,
    width: 40,
    height: 40,
    radius: 20,
    lowerConnector: {
      x: 282,
      y: 99,
      width: 12,
      height: 14,
      rx: 2,
    },
    scale: 1,
    rotation: 0,
  },

  inputSource: {
    x: 210,
    y: 600,
    width: 68,
    height: 52,
    leftTerminalX: 176,
    rightTerminalX: 244,
    plateShortX: 203,
    plateLongX: 220,
    plateShortHeight: 22,
    plateLongHeight: 36,
    scale: 1,
    rotation: 0,
  },

  terminalPocket: {
    x: 0,
    y: 0,
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
    },
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
    width: 64,
    height: 64,
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
    width: 514,
    height: 30,
    scale: 1,
    rotation: 0,
  },
};

/* =========================================================
   GEOMETRY HELPERS
========================================================= */

const centerX = (part: { x: number; width: number }) => part.x + part.width / 2;
const topY = (part: { y: number }) => part.y;
const bottomY = (part: { y: number; height: number }) => part.y + part.height;

const addPoint = (a: Point, b?: Partial<Point>): Point => ({
  x: a.x + (b?.x ?? 0),
  y: a.y + (b?.y ?? 0),
});

const distanceBetween = (a: Point, b: Point) =>
  Math.hypot(b.x - a.x, b.y - a.y);

const degToRad = (degree: number) => (degree * Math.PI) / 180;

export const rotatePointAround = (
  point: Point,
  origin: Point,
  degree: number,
): Point => {
  if (!degree) return point;

  const rad = degToRad(degree);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const dx = point.x - origin.x;
  const dy = point.y - origin.y;

  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
};

export const transformPointByRotationMode = (
  point: Point,
  mode: RotationMode,
): Point => {
  if (mode === "rotate90") {
    const rotated = rotatePointAround(point, { x: 0, y: 0 }, 90);

    return {
      x: rotated.x + ROTATED_VIEW_BOX.width + ROTATION_OFFSET.x,
      y: rotated.y + ROTATION_OFFSET.y,
    };
  }

  return {
    x: point.x + ROTATION_OFFSET.x,
    y: point.y + ROTATION_OFFSET.y,
  };
};

export const transformSegmentsByRotationMode = (
  segments: Segment[],
  mode: RotationMode,
): Segment[] =>
  segments.map((segment) => ({
    from: transformPointByRotationMode(segment.from, mode),
    to: transformPointByRotationMode(segment.to, mode),
  }));

export const getRotationModeTransform = (mode: RotationMode) => {
  if (mode === "rotate90") {
    return `translate(${ROTATED_VIEW_BOX.width + ROTATION_OFFSET.x} ${ROTATION_OFFSET.y}) rotate(90) translate(${ROTATED_COMPONENT_OFFSET.x} ${ROTATED_COMPONENT_OFFSET.y})`;
  }

  return `translate(${ROTATION_OFFSET.x} ${ROTATION_OFFSET.y})`;
};

const getSsrScale = (ssr: SsrGroupControl) => ({
  scaleX: (ssr.width / ssr.baseWidth) * ssr.scale,
  scaleY: (ssr.height / ssr.baseHeight) * ssr.scale,
});

const getSsrCenter = (ssr: SsrGroupControl): Point => {
  const { scaleX, scaleY } = getSsrScale(ssr);

  return {
    x: ssr.x + (ssr.baseWidth * scaleX) / 2,
    y: ssr.y + (ssr.baseHeight * scaleY) / 2,
  };
};

const moduleToWorld = (point: Point, ssr: SsrGroupControl): Point => {
  const { scaleX, scaleY } = getSsrScale(ssr);
  const center = getSsrCenter(ssr);

  const scaledPoint = {
    x: center.x + (point.x - ssr.baseWidth / 2) * scaleX,
    y: center.y + (point.y - ssr.baseHeight / 2) * scaleY,
  };

  return rotatePointAround(scaledPoint, center, ssr.rotation);
};

export const buildPolylinePath = (points: Point[]) => {
  if (!points.length) return "";
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
};

export const buildSegmentPath = (segments: Segment[]) =>
  segments
    .map(
      (segment) =>
        `M ${segment.from.x} ${segment.from.y} L ${segment.to.x} ${segment.to.y}`,
    )
    .join(" ");

export const getPathLengthSafe = (
  target?: SVGPathElement | null | Point[],
): number => {
  if (!target) return 0;

  if (Array.isArray(target)) {
    return target.reduce((total, point, index, points) => {
      if (index === 0) return total;
      return total + distanceBetween(points[index - 1], point);
    }, 0);
  }

  try {
    return target.getTotalLength();
  } catch {
    return 0;
  }
};

export const createCurrentFlowPath = ({
  key,
  kind,
  points,
  dotCount,
  phaseOffset = 0,
  reverse = false,
}: {
  key: string;
  kind: CurrentKind;
  points: Point[];
  dotCount: number;
  phaseOffset?: number;
  reverse?: boolean;
}): CurrentFlowPath => ({
  key,
  kind,
  points,
  d: buildPolylinePath(points),
  length: getPathLengthSafe(points),
  dotCount,
  phaseOffset,
  reverse,
});

const getPointOnPolyline = (points: Point[], progress: number): Point => {
  if (!points.length) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];

  const normalizedProgress = ((progress % 1) + 1) % 1;
  const totalLength = getPathLengthSafe(points);

  if (!totalLength) return points[0];

  let targetDistance = totalLength * normalizedProgress;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const segmentLength = distanceBetween(previous, current);

    if (targetDistance <= segmentLength) {
      const localProgress =
        segmentLength === 0 ? 0 : targetDistance / segmentLength;

      return {
        x: previous.x + (current.x - previous.x) * localProgress,
        y: previous.y + (current.y - previous.y) * localProgress,
      };
    }

    targetDistance -= segmentLength;
  }

  return points[points.length - 1];
};

const transformOf = ({
  x = 0,
  y = 0,
  scale = 1,
  rotation = 0,
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
  const scaleValue = scale === 1 ? "" : ` scale(${scale})`;
  return `translate(${x} ${y})${rotate}${scaleValue}`;
};

const ssrGroupTransform = (ssr: SsrGroupControl) => {
  const { scaleX, scaleY } = getSsrScale(ssr);
  const center = getSsrCenter(ssr);

  return `
    translate(${center.x} ${center.y})
    rotate(${ssr.rotation})
    scale(${scaleX} ${scaleY})
    translate(${-ssr.baseWidth / 2} ${-ssr.baseHeight / 2})
  `;
};

const createSvgIds = (seed: string): SvgIds => ({
  bodyFront: `${seed}-bodyFront`,
  bodySide: `${seed}-bodySide`,
  panel: `${seed}-panel`,
  terminalMetal: `${seed}-terminalMetal`,
  screwHead: `${seed}-screwHead`,
  mountMetal: `${seed}-mountMetal`,
  ledRed: `${seed}-ledRed`,
  ledGlow: `${seed}-ledGlow`,
  loadGlow: `${seed}-loadGlow`,
  sourceGlow: `${seed}-sourceGlow`,
  dotGlow: `${seed}-dotGlow`,
  softShadow: `${seed}-softShadow`,
  textShadow: `${seed}-textShadow`,
});

const paint = (id: string) => `url(#${id})`;

const createRuntimeScale = (props: RelayProps) => ({
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

const createRuntimeComponents = (props: Pick<RelayProps, "ssrGroup">) => ({
  ssr: {
    ...BASE_COMPONENT.ssr,
    ...(props.ssrGroup ?? {}),
  } as SsrGroupControl,
});

const getStepFromProgress = (progress: number) => {
  const maxStep = SIMULATION_TIMELINE.length - 1;
  return Math.min(maxStep, Math.floor(progress * maxStep + 0.0001));
};

/* =========================================================
   NODE + WIRE FACTORIES
========================================================= */

const createNodeMap = (ssr: SsrGroupControl) => ({
  ssrTerminals: {
    output1: moduleToWorld(ssr.terminals.output1, ssr),
    output2: moduleToWorld(ssr.terminals.output2, ssr),
    input3: moduleToWorld(ssr.terminals.input3, ssr),
    input4: moduleToWorld(ssr.terminals.input4, ssr),
  } satisfies Record<TerminalKey, Point>,

  outputLoad: {
    top: {
      x: centerX(BASE_COMPONENT.outputLoad),
      y: topY(BASE_COMPONENT.outputLoad),
    },
    bottom: {
      x: centerX(BASE_COMPONENT.outputLoad),
      y: bottomY(BASE_COMPONENT.outputLoad),
    },
  },

  outputSource: {
    top: {
      x: BASE_COMPONENT.outputSource.x,
      y: BASE_COMPONENT.outputSource.y - BASE_COMPONENT.outputSource.radius,
    },
    bottom: {
      x: BASE_COMPONENT.outputSource.x,
      y: BASE_COMPONENT.outputSource.y + BASE_COMPONENT.outputSource.radius,
    },
    lowerConnectorBottom: {
      x: BASE_COMPONENT.outputSource.x,
      y:
        BASE_COMPONENT.outputSource.lowerConnector.y +
        BASE_COMPONENT.outputSource.lowerConnector.height,
    },
  },

  inputSource: {
    leftTerminal: {
      x: BASE_COMPONENT.inputSource.leftTerminalX,
      y: BASE_COMPONENT.inputSource.y,
    },
    rightTerminal: {
      x: BASE_COMPONENT.inputSource.rightTerminalX,
      y: BASE_COMPONENT.inputSource.y,
    },
    leftPlate: {
      x: BASE_COMPONENT.inputSource.plateShortX,
      y: BASE_COMPONENT.inputSource.y,
    },
    rightPlate: {
      x: BASE_COMPONENT.inputSource.plateLongX,
      y: BASE_COMPONENT.inputSource.y,
    },
  },

  debug: {
    radius: 5,
    strokeWidth: 2,
  },
});

const createWireSegments = (nodes: ReturnType<typeof createNodeMap>) => ({
  outputSide: [
    {
      from: nodes.ssrTerminals.output1,
      to: nodes.outputLoad.bottom,
    },
    {
      from: nodes.outputLoad.top,
      to: {
        x: nodes.outputLoad.top.x,
        y: BASE_COMPONENT.outputCircuit.topBusY,
      },
    },
    {
      from: {
        x: nodes.outputLoad.top.x,
        y: BASE_COMPONENT.outputCircuit.topBusY,
      },
      to: {
        x: nodes.outputSource.top.x,
        y: BASE_COMPONENT.outputCircuit.topBusY,
      },
    },
    {
      from: {
        x: nodes.outputSource.top.x,
        y: BASE_COMPONENT.outputCircuit.topBusY,
      },
      to: nodes.outputSource.top,
    },
    {
      from: nodes.outputSource.bottom,
      to: nodes.outputSource.lowerConnectorBottom,
    },
    {
      from: nodes.outputSource.lowerConnectorBottom,
      to: nodes.ssrTerminals.output2,
    },
  ] satisfies Segment[],

  inputSide: [
    {
      from: nodes.ssrTerminals.input3,
      to: {
        x: nodes.ssrTerminals.input3.x,
        y: BASE_COMPONENT.inputSource.y,
      },
    },
    {
      from: {
        x: nodes.ssrTerminals.input3.x,
        y: BASE_COMPONENT.inputSource.y,
      },
      to: nodes.inputSource.leftTerminal,
    },
    {
      from: nodes.inputSource.rightTerminal,
      to: {
        x: nodes.ssrTerminals.input4.x,
        y: BASE_COMPONENT.inputSource.y,
      },
    },
    {
      from: {
        x: nodes.ssrTerminals.input4.x,
        y: BASE_COMPONENT.inputSource.y,
      },
      to: nodes.ssrTerminals.input4,
    },
  ] satisfies Segment[],
});

const createCurrentFlowPaths = (nodes: ReturnType<typeof createNodeMap>) => {
  const inputInternalY =
    Math.max(nodes.ssrTerminals.input3.y, nodes.ssrTerminals.input4.y) + 24;

  const outputInternalY =
    Math.min(nodes.ssrTerminals.output1.y, nodes.ssrTerminals.output2.y) - 18;

  return {
    input: [
      createCurrentFlowPath({
        key: "dc-positive-to-input-4",
        kind: "dc",
        dotCount: 3,
        phaseOffset: 0,
        points: [
          nodes.inputSource.rightTerminal,
          {
            x: nodes.ssrTerminals.input4.x,
            y: nodes.inputSource.rightTerminal.y,
          },
          nodes.ssrTerminals.input4,
        ],
      }),
      createCurrentFlowPath({
        key: "dc-internal-4-to-3",
        kind: "dc",
        dotCount: 3,
        phaseOffset: 0.2,
        points: [
          nodes.ssrTerminals.input4,
          {
            x: nodes.ssrTerminals.input4.x,
            y: inputInternalY,
          },
          {
            x: nodes.ssrTerminals.input3.x,
            y: inputInternalY,
          },
          nodes.ssrTerminals.input3,
        ],
      }),
      createCurrentFlowPath({
        key: "dc-return-3-to-negative",
        kind: "dc",
        dotCount: 3,
        phaseOffset: 0.4,
        points: [
          nodes.ssrTerminals.input3,
          {
            x: nodes.ssrTerminals.input3.x,
            y: nodes.inputSource.leftTerminal.y,
          },
          nodes.inputSource.leftTerminal,
        ],
      }),
    ],

    output: [
      createCurrentFlowPath({
        key: "ac-source-load-ssr-loop",
        kind: "ac",
        dotCount: 8,
        phaseOffset: 0,
        reverse: true,
        points: [
          nodes.outputSource.top,
          {
            x: nodes.outputSource.top.x,
            y: BASE_COMPONENT.outputCircuit.topBusY,
          },
          {
            x: nodes.outputLoad.top.x,
            y: BASE_COMPONENT.outputCircuit.topBusY,
          },
          nodes.outputLoad.top,
          nodes.outputLoad.bottom,
          nodes.ssrTerminals.output1,
          {
            x: nodes.ssrTerminals.output1.x,
            y: outputInternalY,
          },
          {
            x: nodes.ssrTerminals.output2.x,
            y: outputInternalY,
          },
          nodes.ssrTerminals.output2,
          nodes.outputSource.lowerConnectorBottom,
          nodes.outputSource.bottom,
          nodes.outputSource.top,
        ],
      }),
    ],
  };
};

export const COMPONENT = {
  ...BASE_COMPONENT,
  root: {
    ...BASE_COMPONENT.root,
    x: COMPONENT_OFFSET.x,
    y: COMPONENT_OFFSET.y,
    scale: CIRCUIT_COMPONENT_SCALE,
  },
};

export const NODE = createNodeMap(BASE_COMPONENT.ssr);

export const WIRE = {
  stroke: {
    color: "#111111",
    width: BASE_WIRE_WIDTH,
    lineCap: "square" as const,
    lineJoin: "miter" as const,
  },

  segments: createWireSegments(NODE),
};

export const INPUT_CURRENT_FLOW_PATHS = createCurrentFlowPaths(NODE).input;
export const OUTPUT_CURRENT_FLOW_PATHS = createCurrentFlowPaths(NODE).output;

export const PATH = {
  bodySide: (c = BASE_COMPONENT.bodySide) => `
    M ${c.x} ${c.y}
    L ${c.x + c.width} ${c.y + c.topSkew}
    L ${c.x + c.width} ${c.y + c.height - c.bottomSkew}
    L ${c.x} ${c.y + c.height}
    Z
  `,

  topMount: (c = BASE_COMPONENT.topMount) => {
    const middle = c.x + c.width / 2;
    return `
      M ${c.x} ${c.y}
      L ${c.x + c.width} ${c.y}
      L ${c.x + c.width} ${c.y + c.neckHeight}
      Q ${c.x + c.width} ${c.y + c.height} ${middle} ${c.y + c.height}
      Q ${c.x} ${c.y + c.height} ${c.x} ${c.y + c.neckHeight}
      Z
    `;
  },

  bottomMount: (c = BASE_COMPONENT.bottomMount) => {
    const middle = c.x + c.width / 2;
    return `
      M ${c.x} ${c.y + c.sideDrop}
      Q ${c.x} ${c.y} ${middle} ${c.y}
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

  ssrPrintOutputLeftBracket: "M 142 320 L 142 350 L 285 350",
  ssrPrintOutputRightBracket: "M 578 320 L 578 350 L 435 350",
  ssrPrintInputLeftBracket: "M 245 708 L 245 680 L 302 680",
  ssrPrintInputRightBracket: "M 475 708 L 475 680 L 418 680",

  acWave: (cx: number, cy: number, r: number) => `
    M ${cx - r + 6} ${cy}
    C ${cx - r + 13} ${cy - 13}, ${cx - 7} ${cy - 13}, ${cx} ${cy}
    C ${cx + 7} ${cy + 13}, ${cx + r - 13} ${cy + 13}, ${cx + r - 6} ${cy}
  `,

  loadResistor: (c = BASE_COMPONENT.outputLoad) => {
    const cx = c.x + c.width / 2;
    const y1 = c.y + 8;
    const step = 8;

    return `
      M ${cx} ${y1}
      L ${cx - 7} ${y1 + step}
      L ${cx + 7} ${y1 + step * 2}
      L ${cx - 7} ${y1 + step * 3}
      L ${cx + 7} ${y1 + step * 4}
      L ${cx - 7} ${y1 + step * 5}
      L ${cx} ${c.y + c.height - 8}
    `;
  },
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

  circuitStyle: {
    fontFamily: "Arial, Helvetica, sans-serif",
    fill: "#111111",
    stroke: "none",
    strokeWidth: 0,
    paintOrder: "fill" as const,
  },

  ssrItems: [
    {
      key: "outputTerminal1",
      text: "1",
      x: 168,
      y: 292,
      size: 58,
      weight: 700,
    },
    {
      key: "outputTerminal2",
      text: "2",
      x: 552,
      y: 292,
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
    { key: "output", text: "OUTPUT", x: 360, y: 356, size: 36, weight: 700 },
    { key: "current", text: "40A", x: 360, y: 406, size: 42, weight: 700 },
    { key: "model", text: "SSR-40DA", x: 360, y: 510, size: 62, weight: 800 },
    {
      key: "relayName",
      text: "SOLID STATE RELAY",
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

  circuitItems: [
    {
      key: "load",
      text: "LOAD",
      x: BASE_COMPONENT.outputLoad.x - 9,
      y: BASE_COMPONENT.outputLoad.y + BASE_COMPONENT.outputLoad.height / 2 + 4,
      size: 12,
      weight: 700,
      anchor: "end" as const,
    },
    {
      key: "acSource",
      text: "AC",
      x: BASE_COMPONENT.outputSource.x + 31,
      y: BASE_COMPONENT.outputSource.y + 4,
      size: 12,
      weight: 700,
      anchor: "start" as const,
    },
    {
      key: "dcInput",
      text: "DC INPUT",
      x: BASE_COMPONENT.inputSource.x,
      y: BASE_COMPONENT.inputSource.y + 40,
      size: 12,
      weight: 700,
      anchor: "middle" as const,
    },
  ],
};

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
        dx="10"
        dy="13"
        stdDeviation="9"
        floodColor="#000000"
        floodOpacity="0.5"
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

    <filter id={ids.ledGlow} x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feColorMatrix
        in="blur"
        type="matrix"
        values="1 0 0 0 1  0 0.1 0 0 0.1  0 0 0.1 0 0.1  0 0 0 0.9 0"
      />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id={ids.loadGlow} x="-90%" y="-90%" width="280%" height="280%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id={ids.sourceGlow} x="-90%" y="-90%" width="280%" height="280%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id={ids.dotGlow} x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

/* =========================================================
   REUSABLE TEXT + WIRE BLOCKS
========================================================= */

const SvgText = ({
  text,
  x,
  y,
  size,
  weight,
  anchor = "middle",
  fill = LABEL.style.fill,
  stroke = LABEL.style.stroke,
  strokeWidth = LABEL.style.strokeWidth,
  paintOrder = LABEL.style.paintOrder,
}: {
  text: string;
  x: number;
  y: number;
  size: number;
  weight: number;
  anchor?: "start" | "middle" | "end";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  paintOrder?: "stroke" | "fill";
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fontFamily={LABEL.style.fontFamily}
    fontSize={size}
    fontWeight={weight}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    paintOrder={paintOrder}
    letterSpacing={LABEL.style.letterSpacing}
  >
    {text}
  </text>
);

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
      strokeLinejoin={WIRE.stroke.lineJoin}
    />
  );
};

const SvgWireGroup = ({
  segments,
  offset,
  strokeWidth,
}: {
  segments: Segment[];
  offset: Point;
  strokeWidth: number;
}) => (
  <g>
    <path
      d={buildSegmentPath(segments)}
      fill="none"
      stroke="transparent"
      strokeWidth={strokeWidth + 8}
    />

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

const ExternalWireSystem = ({
  segments,
  offset,
  strokeWidth,
}: {
  segments: ReturnType<typeof createWireSegments>;
  offset: Point;
  strokeWidth: number;
}) => {
  const groups = Object.entries(segments) as Array<[string, Segment[]]>;

  return (
    <g>
      {groups.map(([key, groupSegments]) => (
        <SvgWireGroup
          key={key}
          segments={groupSegments}
          offset={offset}
          strokeWidth={strokeWidth}
        />
      ))}
    </g>
  );
};

/* =========================================================
   CURRENT FLOW BLOCKS
========================================================= */

const AnimatedWirePath = ({
  path,
  active,
}: {
  path: CurrentFlowPath;
  active: boolean;
}) => {
  if (!active) return null;

  const color = path.kind === "dc" ? CURRENT_DOT.dc.fill : CURRENT_DOT.ac.fill;

  return (
    <path
      d={path.d}
      fill="none"
      stroke={color}
      strokeWidth={path.kind === "dc" ? 2.6 : 3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="6 9"
      opacity={0.24}
      pointerEvents="none"
    />
  );
};

const CurrentDot = ({
  point,
  kind,
  ids,
}: {
  point: Point;
  kind: CurrentKind;
  ids: SvgIds;
}) => {
  const style = CURRENT_DOT[kind];
  const p = addPoint(point, CURRENT_DOT_OFFSET);

  return (
    <circle
      cx={p.x}
      cy={p.y}
      r={style.radius * CURRENT_DOT_SCALE}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      opacity={style.opacity}
      filter={`url(#${ids.dotGlow})`}
      pointerEvents="none"
    />
  );
};

const CurrentDotFlow = ({
  ids,
  path,
  active,
  clock,
  speed,
  acReverse,
}: {
  ids: SvgIds;
  path: CurrentFlowPath;
  active: boolean;
  clock: number;
  speed: number;
  acReverse?: boolean;
}) => {
  if (!active || !path.length) return null;

  const cycleDuration =
    path.kind === "dc"
      ? CURRENT_ANIMATION.baseCycleDurationMs
      : CURRENT_ANIMATION.acCycleDurationMs;

  return (
    <g pointerEvents="none">
      {Array.from({ length: path.dotCount }).map((_, index) => {
        const baseProgress =
          clock / (cycleDuration / Math.max(speed, CURRENT_ANIMATION.minSpeed));
        const spacedProgress =
          baseProgress + index / path.dotCount + path.phaseOffset;
        const shouldReverse = path.reverse && acReverse;
        const progress = shouldReverse ? 1 - spacedProgress : spacedProgress;
        const point = getPointOnPolyline(path.points, progress);

        return (
          <CurrentDot
            key={`${path.key}-${index}`}
            ids={ids}
            kind={path.kind}
            point={point}
          />
        );
      })}
    </g>
  );
};

const CurrentFlowLayer = ({
  ids,
  paths,
  isInputActive,
  isOutputActive,
  showCurrentDots,
  clock,
  speed,
}: {
  ids: SvgIds;
  paths: ReturnType<typeof createCurrentFlowPaths>;
  isInputActive: boolean;
  isOutputActive: boolean;
  showCurrentDots: boolean;
  clock: number;
  speed: number;
}) => {
  const acReverse =
    Math.floor(clock / Math.max(1, CURRENT_ANIMATION.acHalfCycleMs)) % 2 === 1;

  if (!showCurrentDots) return null;

  return (
    <g>
      {paths.input.map((path) => (
        <AnimatedWirePath
          key={`wire-${path.key}`}
          path={path}
          active={isInputActive}
        />
      ))}

      {paths.output.map((path) => (
        <AnimatedWirePath
          key={`wire-${path.key}`}
          path={path}
          active={isOutputActive}
        />
      ))}

      {paths.input.map((path) => (
        <CurrentDotFlow
          key={path.key}
          ids={ids}
          path={path}
          active={isInputActive}
          clock={clock}
          speed={speed}
        />
      ))}

      {paths.output.map((path) => (
        <CurrentDotFlow
          key={path.key}
          ids={ids}
          path={path}
          active={isOutputActive}
          clock={clock}
          speed={speed}
          acReverse={acReverse}
        />
      ))}
    </g>
  );
};

/* =========================================================
   EXTERNAL CIRCUIT BLOCKS
========================================================= */

const OutputLoadBlock = ({ active, ids }: { active: boolean; ids: SvgIds }) => {
  const load = BASE_COMPONENT.outputLoad;

  return (
    <g
      transform={transformOf({
        scale: load.scale,
        rotation: load.rotation,
        origin: { x: centerX(load), y: load.y + load.height / 2 },
      })}
    >
      {active && (
        <rect
          x={load.x - 5}
          y={load.y - 5}
          width={load.width + 10}
          height={load.height + 10}
          rx={load.rx + 5}
          fill="none"
          stroke={LOAD_ACTIVE_STYLE.glowStroke}
          strokeWidth={LOAD_ACTIVE_STYLE.glowWidth}
          opacity={LOAD_ACTIVE_STYLE.glowOpacity}
          filter={`url(#${ids.loadGlow})`}
        >
          <animate
            attributeName="opacity"
            values={`${LOAD_ACTIVE_STYLE.glowOpacity};0.12;${LOAD_ACTIVE_STYLE.glowOpacity}`}
            dur="0.9s"
            repeatCount="indefinite"
          />
        </rect>
      )}

      <rect
        x={load.x}
        y={load.y}
        width={load.width}
        height={load.height}
        rx={load.rx}
        fill={active ? LOAD_ACTIVE_STYLE.fill : "#ffffff"}
        stroke={active ? LOAD_ACTIVE_STYLE.stroke : "#111111"}
        strokeWidth={2.4}
      />

      <path
        d={PATH.loadResistor(load)}
        fill="none"
        stroke={active ? LOAD_ACTIVE_STYLE.stroke : "#111111"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

const OutputACSource = ({ active, ids }: { active: boolean; ids: SvgIds }) => {
  const source = BASE_COMPONENT.outputSource;
  const connector = source.lowerConnector;

  return (
    <g
      transform={transformOf({
        scale: source.scale,
        rotation: source.rotation,
        origin: { x: source.x, y: source.y },
      })}
    >
      {active && (
        <circle
          cx={source.x}
          cy={source.y}
          r={source.radius + 7}
          fill="none"
          stroke={SOURCE_ACTIVE_STYLE.glowStroke}
          strokeWidth={SOURCE_ACTIVE_STYLE.glowWidth}
          opacity={SOURCE_ACTIVE_STYLE.glowOpacity}
          filter={`url(#${ids.sourceGlow})`}
        >
          <animate
            attributeName="r"
            values={`${source.radius + 5};${source.radius + 10};${source.radius + 5}`}
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      <circle
        cx={source.x}
        cy={source.y}
        r={source.radius}
        fill="#ffffff"
        stroke={active ? SOURCE_ACTIVE_STYLE.stroke : "#111111"}
        strokeWidth={2.4}
      />

      <path
        d={PATH.acWave(source.x, source.y, source.radius)}
        fill="none"
        stroke={active ? SOURCE_ACTIVE_STYLE.stroke : "#111111"}
        strokeWidth={active ? 2.8 : 2}
        strokeLinecap="round"
      >
        {active && (
          <animate
            attributeName="stroke-width"
            values="2.2;3.4;2.2"
            dur="0.55s"
            repeatCount="indefinite"
          />
        )}
      </path>

      <rect
        x={connector.x}
        y={connector.y}
        width={connector.width}
        height={connector.height}
        rx={connector.rx}
        fill="#ffffff"
        stroke={active ? SOURCE_ACTIVE_STYLE.stroke : "#111111"}
        strokeWidth={2}
      />
    </g>
  );
};

const InputBatterySource = ({ active }: { active: boolean }) => {
  const battery = BASE_COMPONENT.inputSource;
  const y = battery.y;
  const activeStroke = active ? "#2563eb" : "#111111";

  return (
    <g
      transform={transformOf({
        scale: battery.scale,
        rotation: battery.rotation,
        origin: { x: battery.x, y: battery.y },
      })}
    >
      <line
        x1={battery.leftTerminalX}
        y1={y}
        x2={battery.plateShortX - 8}
        y2={y}
        stroke={activeStroke}
        strokeWidth={2.6}
      />

      <line
        x1={battery.plateLongX + 8}
        y1={y}
        x2={battery.rightTerminalX}
        y2={y}
        stroke={activeStroke}
        strokeWidth={2.6}
      />

      <line
        x1={battery.plateShortX}
        y1={y - battery.plateShortHeight / 2}
        x2={battery.plateShortX}
        y2={y + battery.plateShortHeight / 2}
        stroke={activeStroke}
        strokeWidth={2.6}
      />

      <line
        x1={battery.plateLongX}
        y1={y - battery.plateLongHeight / 2}
        x2={battery.plateLongX}
        y2={y + battery.plateLongHeight / 2}
        stroke={activeStroke}
        strokeWidth={2.6}
      />

      <SvgText
        text="-"
        x={battery.plateShortX - 15}
        y={y + 5}
        size={11}
        weight={700}
        fill="#111111"
        stroke="none"
        strokeWidth={0}
        paintOrder="fill"
      />

      <SvgText
        text="+"
        x={battery.plateLongX + 15}
        y={y + 5}
        size={11}
        weight={700}
        fill="#111111"
        stroke="none"
        strokeWidth={0}
        paintOrder="fill"
      />
    </g>
  );
};

const ExternalCircuitLabels = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <g>
      {LABEL.circuitItems.map((item) => (
        <SvgText
          key={item.key}
          text={item.text}
          x={item.x}
          y={item.y}
          size={item.size}
          weight={item.weight}
          anchor={item.anchor}
          fill={LABEL.circuitStyle.fill}
          stroke={LABEL.circuitStyle.stroke}
          strokeWidth={LABEL.circuitStyle.strokeWidth}
          paintOrder={LABEL.circuitStyle.paintOrder}
        />
      ))}
    </g>
  );
};

/* =========================================================
   SSR-40DA VISUAL BLOCKS
========================================================= */

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
      Q ${cx} ${cy - armLength - round / 2} ${cx + armWidth / 2} ${
        cy - armLength
      }
      L ${cx + armWidth / 2} ${cy - armWidth / 2}
      L ${cx + armLength} ${cy - armWidth / 2}
      Q ${cx + armLength + round / 2} ${cy} ${cx + armLength} ${
        cy + armWidth / 2
      }
      L ${cx + armWidth / 2} ${cy + armWidth / 2}
      L ${cx + armWidth / 2} ${cy + armLength}
      Q ${cx} ${cy + armLength + round / 2} ${cx - armWidth / 2} ${
        cy + armLength
      }
      L ${cx - armWidth / 2} ${cy + armWidth / 2}
      L ${cx - armLength} ${cy + armWidth / 2}
      Q ${cx - armLength - round / 2} ${cy} ${cx - armLength} ${
        cy - armWidth / 2
      }
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
        d={`M ${cx - 31} ${cy - 31} Q ${cx - 5} ${cy - 45} ${cx + 25} ${
          cy - 26
        }`}
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
  part: TuneTransform;
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

const SSRPrintDecoration = () => (
  <g>
    <path
      d={PATH.ssrPrintOutputLeftBracket}
      fill="none"
      stroke="#f2f2f2"
      strokeWidth={5}
      strokeLinecap="square"
    />

    <path
      d={PATH.ssrPrintOutputRightBracket}
      fill="none"
      stroke="#f2f2f2"
      strokeWidth={5}
      strokeLinecap="square"
    />

    <line
      x1={180}
      y1={438}
      x2={540}
      y2={438}
      stroke="#f2f2f2"
      strokeWidth={6}
    />

    <line
      x1={180}
      y1={606}
      x2={540}
      y2={606}
      stroke="#f2f2f2"
      strokeWidth={6}
    />

    <path
      d={PATH.ssrPrintInputLeftBracket}
      fill="none"
      stroke="#f2f2f2"
      strokeWidth={4}
    />

    <path
      d={PATH.ssrPrintInputRightBracket}
      fill="none"
      stroke="#f2f2f2"
      strokeWidth={4}
    />
  </g>
);

const IndicatorLed = ({ ids, active }: { ids: SvgIds; active: boolean }) => {
  const led = BASE_COMPONENT.led;

  return (
    <g
      transform={transformOf({
        scale: led.scale,
        rotation: led.rotation,
        origin: { x: led.x, y: led.y },
      })}
    >
      {active && (
        <circle
          cx={led.x}
          cy={led.y}
          r={LED_ACTIVE_STYLE.glowRadius}
          fill="#ff2a2a"
          opacity={LED_ACTIVE_STYLE.glowOpacity}
          filter={`url(#${ids.ledGlow})`}
        >
          <animate
            attributeName="opacity"
            values="0.75;0.25;0.75"
            dur="0.75s"
            repeatCount="indefinite"
          />
        </circle>
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
        opacity={active ? LED_ACTIVE_STYLE.ledOpacity : 0.78}
      />

      <circle
        cx={led.highlight.x}
        cy={led.highlight.y}
        r={led.highlight.radius}
        fill="#ff8b8b"
        opacity={active ? LED_ACTIVE_STYLE.highlightOpacity : 0.65}
      />
    </g>
  );
};

const SSRLabels = ({ ids }: { ids: SvgIds }) => (
  <g filter={`url(#${ids.textShadow})`}>
    {LABEL.ssrItems.map((item) => (
      <SvgText
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

const SSRModule = ({
  ids,
  ssr,
  ledActive,
}: {
  ids: SvgIds;
  ssr: SsrGroupControl;
  ledActive: boolean;
}) => (
  <g transform={ssrGroupTransform(ssr)}>
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
    <SSRPrintDecoration />
    <SSRLabels ids={ids} />
    <IndicatorLed ids={ids} active={ledActive} />
    <FrontHighlight />
    <BaseShadow />
  </g>
);

/* =========================================================
   DEBUG BLOCK
========================================================= */

const DebugTerminalDots = ({
  show,
  offset,
  nodes,
  currentPaths,
}: {
  show: boolean;
  offset: Point;
  nodes: ReturnType<typeof createNodeMap>;
  currentPaths: ReturnType<typeof createCurrentFlowPaths>;
}) => {
  if (!show) return null;

  const currentControlPoints = [
    ...currentPaths.input,
    ...currentPaths.output,
  ].flatMap((path) =>
    path.points.map((point, index) => ({
      key: `current-${path.key}-${index}`,
      point,
      fill: path.kind === "dc" ? "#2563eb" : "#f97316",
    })),
  );

  const debugNodes = [
    { key: "ssr-output-1", point: nodes.ssrTerminals.output1, fill: "#00aaff" },
    { key: "ssr-output-2", point: nodes.ssrTerminals.output2, fill: "#00aaff" },
    { key: "ssr-input-3", point: nodes.ssrTerminals.input3, fill: "#00aaff" },
    { key: "ssr-input-4", point: nodes.ssrTerminals.input4, fill: "#00aaff" },

    { key: "load-top", point: nodes.outputLoad.top, fill: "#ffbb00" },
    { key: "load-bottom", point: nodes.outputLoad.bottom, fill: "#ffbb00" },

    { key: "ac-top", point: nodes.outputSource.top, fill: "#ff3344" },
    { key: "ac-bottom", point: nodes.outputSource.bottom, fill: "#ff3344" },
    {
      key: "ac-lower-connector",
      point: nodes.outputSource.lowerConnectorBottom,
      fill: "#ff3344",
    },

    {
      key: "battery-left",
      point: nodes.inputSource.leftTerminal,
      fill: "#35d07f",
    },
    {
      key: "battery-right",
      point: nodes.inputSource.rightTerminal,
      fill: "#35d07f",
    },
    {
      key: "battery-left-plate",
      point: nodes.inputSource.leftPlate,
      fill: "#22c55e",
    },
    {
      key: "battery-right-plate",
      point: nodes.inputSource.rightPlate,
      fill: "#22c55e",
    },

    ...currentControlPoints,
  ];

  return (
    <g opacity={0.85} pointerEvents="none">
      {debugNodes.map(({ key, point, fill }) => {
        const p = addPoint(point, offset);

        return (
          <circle
            key={key}
            cx={p.x}
            cy={p.y}
            r={nodes.debug.radius}
            fill={fill}
            stroke="#ffffff"
            strokeWidth={nodes.debug.strokeWidth}
          />
        );
      })}
    </g>
  );
};

/* =========================================================
   TIMELINE + CONTROL PANEL
========================================================= */

const SimulationTimeline = ({
  progress,
  activeStep,
  show,
}: {
  progress: number;
  activeStep: number;
  show: boolean;
}) => {
  if (!show) return null;

  return (
    <div
      className="w-full rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm"
      style={{
        transform: `translate(${TIMELINE_OFFSET.x}px, ${TIMELINE_OFFSET.y}px) scale(${TIMELINE_SCALE})`,
        transformOrigin: "top left",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
          Simulation Timeline
        </span>
        <span className="text-xs font-semibold text-slate-500">
          {Math.round(progress * 100)}%
        </span>
      </div>

      <div className="relative mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-150"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SIMULATION_TIMELINE.map((item) => {
          const isActive = activeStep === item.step;
          const isComplete = activeStep > item.step;

          return (
            <div
              key={item.step}
              className={[
                "rounded-lg border p-2 transition-colors",
                isActive
                  ? "border-green-500 bg-green-50"
                  : isComplete
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 bg-slate-50",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white",
                    isActive
                      ? "bg-green-600"
                      : isComplete
                        ? "bg-blue-600"
                        : "bg-slate-400",
                  ].join(" ")}
                >
                  {item.step}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {item.title}
                </span>
              </div>
              <div className="mt-1 text-[10px] leading-tight text-slate-500">
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ControlPanel = ({
  show,
  isRunning,
  isPowered,
  speed,
  rotationMode,
  onStart,
  onStop,
  onReset,
  onSpeedChange,
  onRotationModeChange,
}: {
  show: boolean;
  isRunning: boolean;
  isPowered: boolean;
  speed: number;
  rotationMode: RotationMode;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
  onRotationModeChange: (value: RotationMode) => void;
}) => {
  if (!show) return null;

  return (
    <div
      className="w-full rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm"
      style={{
        transform: `translate(${CONTROL_PANEL_OFFSET.x}px, ${CONTROL_PANEL_OFFSET.y}px)`,
      }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onStart}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-green-700"
        >
          Start
        </button>

        <button
          type="button"
          onClick={onStop}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
        >
          Stop
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
        >
          Reset
        </button>

        <span
          className={[
            "ml-auto rounded-full px-3 py-1 text-xs font-bold",
            isPowered
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600",
          ].join(" ")}
        >
          {isPowered ? "ON" : "OFF"} {isRunning ? "• RUNNING" : "• STOPPED"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Speed: {speed.toFixed(2)}x
          <input
            type="range"
            min={CURRENT_ANIMATION.minSpeed}
            max={CURRENT_ANIMATION.maxSpeed}
            step={CURRENT_ANIMATION.speedStep}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="w-full accent-blue-600"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Rotation
          <select
            value={rotationMode}
            onChange={(event) =>
              onRotationModeChange(event.target.value as RotationMode)
            }
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="normal">Normal</option>
            <option value="rotate90">Rotate 90°</option>
          </select>
        </label>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export function Relay({
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
  showCircuitLabels = true,
  ssrGroup,

  initialRunning = false,
  autoStart = false,
  simulationSpeed = 1,
  showControls = true,
  showTimeline = true,
  showCurrentDots = true,
  rotationMode: rotationModeProp = "normal",
  loop = true,
}: RelayProps) {
  const rawId = React.useId().replace(/:/g, "");
  const ids = createSvgIds(`ssr-relay-${rawId}`);

  const initialActive = initialRunning || autoStart;

  const [isRunning, setIsRunning] = React.useState(initialActive);
  const [isPowered, setIsPowered] = React.useState(initialActive);
  const [simulationStep, setSimulationStep] = React.useState(0);
  const [timelineProgress, setTimelineProgress] = React.useState(0);
  const [speed, setSpeed] = React.useState(simulationSpeed);
  const [rotationModeState, setRotationModeState] =
    React.useState<RotationMode>(rotationModeProp);
  const [animationClock, setAnimationClock] = React.useState(0);

  const rafRef = React.useRef<number | null>(null);
  const lastTickRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setSpeed(simulationSpeed);
  }, [simulationSpeed]);

  React.useEffect(() => {
    setRotationModeState(rotationModeProp);
  }, [rotationModeProp]);

  React.useEffect(() => {
    if (autoStart) {
      setIsRunning(true);
      setIsPowered(true);
    }
  }, [autoStart]);

  React.useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTickRef.current = null;
      return;
    }

    const totalDuration =
      SIMULATION_STEP_DURATION * Math.max(1, SIMULATION_TIMELINE.length - 1);

    const tick = (time: number) => {
      const last = lastTickRef.current ?? time;
      const delta = time - last;
      lastTickRef.current = time;

      const safeSpeed = Math.max(CURRENT_ANIMATION.minSpeed, speed);

      setAnimationClock((current) => current + delta * safeSpeed);

      setTimelineProgress((currentProgress) => {
        let nextProgress =
          currentProgress + (delta * safeSpeed) / totalDuration;

        if (nextProgress >= 1) {
          if (loop) {
            nextProgress %= 1;
          } else {
            nextProgress = 1;
            setIsRunning(false);
            setIsPowered(true);
          }
        }

        const nextStep = getStepFromProgress(nextProgress);
        setSimulationStep(nextStep);
        setIsPowered(nextStep >= CURRENT_FLOW.inputActivationStep);

        return nextProgress;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTickRef.current = null;
    };
  }, [isRunning, speed, loop]);

  const runtime = createRuntimeScale({
    componentScale,
    canvasScale,
    wireScale,
    componentOffset,
    wireOffset,
    debugTerminalOffset,
  });

  const runtimeComponents = createRuntimeComponents({ ssrGroup });
  const runtimeNodes = createNodeMap(runtimeComponents.ssr);
  const runtimeWireSegments = createWireSegments(runtimeNodes);
  const runtimeCurrentPaths = createCurrentFlowPaths(runtimeNodes);

  const activeViewBox =
    rotationModeState === "rotate90" ? ROTATED_VIEW_BOX : VIEW_BOX;

  const wireStrokeWidth = BASE_WIRE_WIDTH * runtime.wireScale;

  const inputActive =
    isPowered && simulationStep >= CURRENT_FLOW.inputActivationStep;

  const ledActive =
    isPowered && simulationStep >= CURRENT_FLOW.ledActivationStep;

  const outputActive =
    isPowered && simulationStep >= CURRENT_FLOW.outputActivationStep;

  const loadActive =
    isPowered && simulationStep >= CURRENT_FLOW.loadActivationStep;

  const handleStart = () => {
    if (timelineProgress >= 1) {
      setTimelineProgress(0);
      setSimulationStep(0);
      setAnimationClock(0);
    }

    setIsRunning(true);
    setIsPowered(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPowered(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPowered(false);
    setSimulationStep(0);
    setTimelineProgress(0);
    setAnimationClock(0);
    lastTickRef.current = null;
  };

  return (
    <div
      className={`inline-flex flex-col items-stretch justify-center gap-3 bg-transparent ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox={`${activeViewBox.minX} ${activeViewBox.minY} ${activeViewBox.width} ${activeViewBox.height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Interactive SSR-40DA relay simulation with input DC source, output AC source, load, current flow, and timeline"
        className="h-auto w-full max-w-full"
        style={{
          transform: `scale(${runtime.canvasScale})`,
          transformOrigin: "center",
        }}
      >
        <SvgDefs ids={ids} />

        <g transform={getRotationModeTransform(rotationModeState)}>
          <g
            transform={transformOf({
              x: runtime.componentOffset.x,
              y: runtime.componentOffset.y,
              scale: runtime.componentScale,
              rotation: COMPONENT.root.rotation,
              origin: {
                x: VIEW_BOX.width / 2,
                y: VIEW_BOX.height / 2,
              },
            })}
          >
            <ExternalWireSystem
              segments={runtimeWireSegments}
              offset={runtime.wireOffset}
              strokeWidth={wireStrokeWidth}
            />

            <CurrentFlowLayer
              ids={ids}
              paths={runtimeCurrentPaths}
              isInputActive={inputActive && isRunning}
              isOutputActive={outputActive && isRunning}
              showCurrentDots={showCurrentDots}
              clock={animationClock}
              speed={speed}
            />

            <OutputLoadBlock active={loadActive} ids={ids} />
            <OutputACSource active={outputActive} ids={ids} />
            <InputBatterySource active={inputActive} />

            <SSRModule
              ids={ids}
              ssr={runtimeComponents.ssr}
              ledActive={ledActive}
            />

            <ExternalCircuitLabels show={showCircuitLabels} />

            <DebugTerminalDots
              show={showDebugTerminals}
              offset={runtime.debugTerminalOffset}
              nodes={runtimeNodes}
              currentPaths={runtimeCurrentPaths}
            />
          </g>
        </g>
      </svg>

      <ControlPanel
        show={showControls}
        isRunning={isRunning}
        isPowered={isPowered}
        speed={speed}
        rotationMode={rotationModeState}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        onSpeedChange={setSpeed}
        onRotationModeChange={setRotationModeState}
      />

      <SimulationTimeline
        show={showTimeline}
        progress={timelineProgress}
        activeStep={simulationStep}
      />
    </div>
  );
}

export default Relay;
