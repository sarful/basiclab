"use client";

import type { ReactNode } from "react";

import {
  ACVoltageSourceSymbol,
  BackgroundPixelGred,
  DCVoltageSourceV1Symbol,
  NPNTransistorSymbol,
  PilotLight,
  ResistorSymbol,
  SPDTSymbol,
  SPSTSwitchSymbol,
} from "@/src/library";
import { buildRelayFlowVisualState } from "./electronFlowLogic";
import type { RelayCurrentFlowMode } from "./simulationTypes";

type Point = { x: number; y: number };
type Offset = { x: number; y: number };
type ComponentOffset = { x: number; y: number; rotation: number };
type ComponentBox = { x: number; y: number; width: number; height: number };
type PositionedComponentBox = ComponentBox & { rotation: number };
type LocalPoint = { x: number; y: number };

type TransistorDrivingRelayProps = {
  dcVoltage: number;
  acVoltage: number;
  baseResistorOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: RelayCurrentFlowMode;
  baseCurrentMa: number;
  coilCurrentMa: number;
  transistorOn: boolean;
  relayEnergized: boolean;
  contactClosedToNo: boolean;
  lampOn: boolean;
  coilPathActive: boolean;
  loadPathActive: boolean;
  relayContactLabel: string;
  onToggleSwitch: () => void;
};

const VIEW_BOX = { x: 0, y: 0, width: 1320, height: 760 } as const;

const SCALE = {
  component: 2,
  wire: 1,
  canvas: 1,
} as const;

const CIRCUIT_COMPONENT_SCALE = {
  dcReference: SCALE.component,
  switch: SCALE.component,
  transistor: SCALE.component,
  relayResistor: SCALE.component,
  relay: SCALE.component,
  loadAcSource: SCALE.component,
  lamp: SCALE.component,
} as const;

const INDIVIDUAL_SYMBOL_SIZE = {
  loadAcSource: {
    width: 56,
    height: 80,
    offsetX: 18,
    offsetY: 8,
  },
} as const;

const BASE_WIRE_WIDTH = 1.8;
const CIRCUIT_WIRE_SCALE = SCALE.wire;
const CIRCUIT_CANVAS_SCALE = SCALE.canvas;
const SHOW_DEBUG_TERMINAL_DOTS = true;

const COMPONENT_OFFSET = {
  dcReference: { x: 0, y: 0, rotation: 0 },
  switch: { x: 70, y: 0, rotation: 0 },
  transistor: { x: 0, y: 0, rotation: 0 },
  relayResistor: { x: 0, y: 0, rotation: 0 },
  relay: { x: -130, y: 50, rotation: 0 },
  loadAcSource: { x: -30, y: 40, rotation: -90 },
  lamp: { x: -117, y: 120, rotation: 0 },
} as const satisfies Record<string, ComponentOffset>;

const WIRE_ROUTE_CONFIG = {
  vdcToCollector: {
    kind: "top-bridge",
    topRailY: -70,
    startX: -20,
    startY: 0,
    endX: 20,
    endY: 60,
  },
  vdcMinusToRelayA2: {
    kind: "bottom-bridge",
    bottomRailY: 50,
    startX: -20,
    startY: -20,
    endX: 5,
    endY: -20,
  },
  topRailToSwitchLeft: {
    kind: "top-tap",
    topRailY: -135,
    railTapX: -15,
    endX: 0,
    endY: 0,
  },
  switchRightToBase: {
    kind: "hv",
    startX: 0,
    startY: 0,
    endX: 60,
    endY: 0,
  },
  switchRightToResistorTop: {
    kind: "hv",
    startX: 15,
    startY: 0,
    endX: 10,
    endY: 120,
  },
  resistorBottomToBottomRail: {
    kind: "bottom-drop",
    bottomRailY: 25,
    startX: 10,
    startY: -70,
    endX: 10,
  },
  emitterToRelayA1: {
    kind: "hv",
    startX: 20,
    startY: -45,
    endX: 5,
    endY: 50,
  },
  loadAcTopToRelayTop: {
    kind: "elbow-x",
    startX: 15,
    startY: 60,
    elbowX: -5,
    endX: 0,
    endY: 10,
  },
  loadAcBottomToLampTop: {
    kind: "vh",
    startX: -130,
    startY: 60,
    endX: -70,
    endY: 30,
  },
  relayBottomToLampBottom: {
    kind: "bottom-bridge",
    bottomRailY: -90,
    startX: -8,
    startY: -10,
    endX: -62,
    endY: -140,
  },
} as const;

const WIRE_OFFSET = WIRE_ROUTE_CONFIG;

const DEBUG_TERMINAL_OFFSET = {
  dcReferenceTop: { x: -20, y: 5 },
  dcReferenceBottom: { x: -20, y: -20 },
  switchLeft: { x: 0, y: 0 },
  switchRight: { x: 0, y: 0 },
  transistorBase: { x: 60, y: 4 },
  transistorCollector: { x: 20, y: 50 },
  transistorEmitter: { x: 20, y: -40 },
  relayResistorTop: { x: 10, y: 120 },
  relayResistorBottom: { x: 10, y: -70 },
  relayCoilTop: { x: 5, y: 35 },
  relayCoilBottom: { x: 5, y: -15 },
  relayThrowTop: { x: -5, y: 13 },
  relayCommon: { x: -3, y: 10 },
  relayThrowBottom: { x: -8, y: 10 },
  loadAcTop: { x: 15, y: 60 },
  loadAcBottom: { x: -130, y: 55 },
  lampTop: { x: -65, y: 30 },
  lampBottom: { x: -65, y: -140 },
} as const satisfies Record<string, Offset>;

const LABEL = {
  canvas: "Transistor driving relay placement canvas",
  dcReference: "VDC",
  switch: "SW1",
  transistor: "Q1 2N3904",
  relayResistor: "R1 100 Ohm",
  relay: "RLY1 SPDT",
  loadAcSource: "V3 sine 1 kHz",
  lamp: "LAMP1 100 Ohm",
} as const;

const STYLE = {
  background: "#ffffff",
  boardBorder: "#dbe3ef",
  label: "#0f172a",
  muted: "#64748b",
  wire: "#0f172a",
  conventionalFlow: "#f59e0b",
  electronFlow: "#2563eb",
  relayActive: "#10b981",
  relayIdle: "#94a3b8",
  lampGlow: "#facc15",
  debugTerminal: "#ef4444",
  debugTerminalStroke: "#ffffff",
  cardStroke: "#cbd5e1",
} as const;

const STANDARD_COMPONENT_WIDTH = 120;
const STANDARD_COMPONENT_HEIGHT = 120;

const BASE_COMPONENT = {
  dcReference: {
    x: 188,
    y: 228,
    width: STANDARD_COMPONENT_WIDTH,
    height: STANDARD_COMPONENT_HEIGHT,
  },
  switch: {
    x: 374,
    y: 206,
    width: STANDARD_COMPONENT_WIDTH,
    height: STANDARD_COMPONENT_HEIGHT,
  },
  transistor: {
    x: 664,
    y: 206,
    width: STANDARD_COMPONENT_WIDTH,
    height: STANDARD_COMPONENT_HEIGHT,
  },
  relayResistor: {
    x: 500,
    y: 374,
    width: STANDARD_COMPONENT_WIDTH,
    height: STANDARD_COMPONENT_HEIGHT,
  },
  relay: {
    x: 824,
    y: 374,
    width: STANDARD_COMPONENT_WIDTH,
    height: STANDARD_COMPONENT_HEIGHT,
  },
  loadAcSource: {
    x: 954,
    y: 206,
    width: STANDARD_COMPONENT_WIDTH,
    height: STANDARD_COMPONENT_HEIGHT,
  },
  lamp: {
    x: 1092,
    y: 374,
    width: STANDARD_COMPONENT_WIDTH,
    height: STANDARD_COMPONENT_HEIGHT,
  },
} as const satisfies Record<string, ComponentBox>;

const SYMBOL_CENTER = {
  resistor: { x: 25, y: 10 },
  transistor: { x: 30, y: 30 },
  switch: { x: 120, y: 55 },
  acSource: { x: 160, y: 280 },
  dcSource: { x: 57, y: 75 },
  lamp: { x: 10, y: 25 },
} as const satisfies Record<string, LocalPoint>;

const SYMBOL_POINT = {
  resistorTop: { x: 0, y: 10 },
  resistorBottom: { x: 50, y: 10 },
  transistorBase: { x: 0, y: 30 },
  transistorCollector: { x: 30, y: 0 },
  transistorEmitter: { x: 30, y: 60 },
  switchLeft: { x: 71, y: 56 },
  switchRight: { x: 170, y: 57 },
  relayCoilTop: { x: 117, y: 22 },
  relayCoilBottom: { x: 117, y: 123 },
  relayCommon: { x: 156, y: 40 },
  relayThrowTop: { x: 156, y: 40 },
  relayThrowBottom: { x: 188, y: 103 },
  acSourceTop: { x: 160, y: 11 },
  acSourceBottom: { x: 160, y: 549 },
  dcSourceTop: { x: 57, y: 24 },
  dcSourceBottom: { x: 57, y: 125 },
  lampTop: { x: 10, y: 0 },
  lampBottom: { x: 10, y: 50 },
} as const satisfies Record<string, LocalPoint>;

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

function offsetComponent(
  component: ComponentBox,
  offset: ComponentOffset,
): PositionedComponentBox {
  return {
    ...component,
    x: component.x + offset.x,
    y: component.y + offset.y,
    rotation: offset.rotation,
  };
}

function rotateVector(x: number, y: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

function scalePointFromCenter(
  component: PositionedComponentBox,
  point: LocalPoint,
  center: LocalPoint,
  sourceWidth: number,
  sourceHeight: number,
): Point {
  const scaleX = component.width / sourceWidth;
  const scaleY = component.height / sourceHeight;
  const rotatedPoint = rotateVector(
    (point.x - center.x) * scaleX,
    (point.y - center.y) * scaleY,
    component.rotation,
  );

  return {
    x: component.x + component.width / 2 + rotatedPoint.x,
    y: component.y + component.height / 2 + rotatedPoint.y,
  };
}

function rotate90PointFromCenter(
  component: PositionedComponentBox,
  point: LocalPoint,
  center: LocalPoint,
  sourceWidth: number,
  sourceHeight: number,
): Point {
  const scaleX = component.width / sourceWidth;
  const scaleY = component.height / sourceHeight;
  const offsetX = (point.x - center.x) * scaleX;
  const offsetY = (point.y - center.y) * scaleY;
  const rotatedPoint = rotateVector(-offsetY, offsetX, component.rotation);

  return {
    x: component.x + component.width / 2 + rotatedPoint.x,
    y: component.y + component.height / 2 + rotatedPoint.y,
  };
}

function offsetPoint(point: Point, offset: Offset): Point {
  return { x: point.x + offset.x, y: point.y + offset.y };
}

function offsetPoints(points: readonly Point[], offset: Offset) {
  return points.map((point) => offsetPoint(point, offset));
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX.width / 2;
  const centerY = VIEW_BOX.height / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

const COMPONENT = {
  dcReference: offsetComponent(
    scaleComponent(
      BASE_COMPONENT.dcReference,
      CIRCUIT_COMPONENT_SCALE.dcReference,
    ),
    COMPONENT_OFFSET.dcReference,
  ),
  switch: offsetComponent(
    scaleComponent(BASE_COMPONENT.switch, CIRCUIT_COMPONENT_SCALE.switch),
    COMPONENT_OFFSET.switch,
  ),
  transistor: offsetComponent(
    scaleComponent(
      BASE_COMPONENT.transistor,
      CIRCUIT_COMPONENT_SCALE.transistor,
    ),
    COMPONENT_OFFSET.transistor,
  ),
  relayResistor: offsetComponent(
    scaleComponent(
      BASE_COMPONENT.relayResistor,
      CIRCUIT_COMPONENT_SCALE.relayResistor,
    ),
    COMPONENT_OFFSET.relayResistor,
  ),
  relay: offsetComponent(
    scaleComponent(BASE_COMPONENT.relay, CIRCUIT_COMPONENT_SCALE.relay),
    COMPONENT_OFFSET.relay,
  ),
  loadAcSource: offsetComponent(
    scaleComponent(
      BASE_COMPONENT.loadAcSource,
      CIRCUIT_COMPONENT_SCALE.loadAcSource,
    ),
    COMPONENT_OFFSET.loadAcSource,
  ),
  lamp: offsetComponent(
    scaleComponent(BASE_COMPONENT.lamp, CIRCUIT_COMPONENT_SCALE.lamp),
    COMPONENT_OFFSET.lamp,
  ),
} as const;

const NODE = {
  dcReferenceTop: scalePointFromCenter(
    COMPONENT.dcReference,
    SYMBOL_POINT.dcSourceTop,
    SYMBOL_CENTER.dcSource,
    150,
    160,
  ),
  dcReferenceBottom: scalePointFromCenter(
    COMPONENT.dcReference,
    SYMBOL_POINT.dcSourceBottom,
    SYMBOL_CENTER.dcSource,
    150,
    160,
  ),
  switchLeft: scalePointFromCenter(
    COMPONENT.switch,
    SYMBOL_POINT.switchLeft,
    SYMBOL_CENTER.switch,
    240,
    110,
  ),
  switchRight: scalePointFromCenter(
    COMPONENT.switch,
    SYMBOL_POINT.switchRight,
    SYMBOL_CENTER.switch,
    240,
    110,
  ),
  transistorBase: scalePointFromCenter(
    COMPONENT.transistor,
    SYMBOL_POINT.transistorBase,
    SYMBOL_CENTER.transistor,
    60,
    60,
  ),
  transistorCollector: scalePointFromCenter(
    COMPONENT.transistor,
    SYMBOL_POINT.transistorCollector,
    SYMBOL_CENTER.transistor,
    60,
    60,
  ),
  transistorEmitter: scalePointFromCenter(
    COMPONENT.transistor,
    SYMBOL_POINT.transistorEmitter,
    SYMBOL_CENTER.transistor,
    60,
    60,
  ),
  relayResistorTop: rotate90PointFromCenter(
    COMPONENT.relayResistor,
    SYMBOL_POINT.resistorTop,
    SYMBOL_CENTER.resistor,
    50,
    20,
  ),
  relayResistorBottom: rotate90PointFromCenter(
    COMPONENT.relayResistor,
    SYMBOL_POINT.resistorBottom,
    SYMBOL_CENTER.resistor,
    50,
    20,
  ),
  relayCoilTop: scalePointFromCenter(
    COMPONENT.relay,
    SYMBOL_POINT.relayCoilTop,
    { x: 130, y: 90 },
    260,
    180,
  ),
  relayCoilBottom: scalePointFromCenter(
    COMPONENT.relay,
    SYMBOL_POINT.relayCoilBottom,
    { x: 130, y: 90 },
    260,
    180,
  ),
  relayCommon: scalePointFromCenter(
    COMPONENT.relay,
    SYMBOL_POINT.relayCommon,
    { x: 130, y: 90 },
    260,
    180,
  ),
  relayThrowTop: scalePointFromCenter(
    COMPONENT.relay,
    SYMBOL_POINT.relayThrowTop,
    { x: 130, y: 90 },
    260,
    180,
  ),
  relayThrowBottom: scalePointFromCenter(
    COMPONENT.relay,
    SYMBOL_POINT.relayThrowBottom,
    { x: 130, y: 90 },
    260,
    180,
  ),
  loadAcTop: scalePointFromCenter(
    COMPONENT.loadAcSource,
    SYMBOL_POINT.acSourceTop,
    SYMBOL_CENTER.acSource,
    320,
    560,
  ),
  loadAcBottom: scalePointFromCenter(
    COMPONENT.loadAcSource,
    SYMBOL_POINT.acSourceBottom,
    SYMBOL_CENTER.acSource,
    320,
    560,
  ),
  lampTop: scalePointFromCenter(
    COMPONENT.lamp,
    SYMBOL_POINT.lampTop,
    SYMBOL_CENTER.lamp,
    20,
    50,
  ),
  lampBottom: scalePointFromCenter(
    COMPONENT.lamp,
    SYMBOL_POINT.lampBottom,
    SYMBOL_CENTER.lamp,
    20,
    50,
  ),
} as const;

const TERMINAL_LABEL_TO_NODE = {
  "VDC+": NODE.dcReferenceTop,
  "VDC-": NODE.dcReferenceBottom,
  "SW-L": NODE.switchLeft,
  "SW-R": NODE.switchRight,
  "Q1-B": NODE.transistorBase,
  "Q1-C": NODE.transistorCollector,
  "Q1-E": NODE.transistorEmitter,
  "R1-T": NODE.relayResistorTop,
  "R1-B": NODE.relayResistorBottom,
  "RLY-A1": NODE.relayCoilTop,
  "RLY-A2": NODE.relayCoilBottom,
  "RLY-T": NODE.relayThrowTop,
  "RLY-C": NODE.relayCommon,
  "RLY-B": NODE.relayThrowBottom,
  "V3-T": NODE.loadAcTop,
  "V3-B": NODE.loadAcBottom,
  "L1-T": NODE.lampTop,
  "L1-B": NODE.lampBottom,
} as const;

type TerminalLabel = keyof typeof TERMINAL_LABEL_TO_NODE;
type ConnectionPair = readonly [TerminalLabel, TerminalLabel];
type ConnectionKey = keyof typeof WIRE_ROUTE_CONFIG;

const CONNECTION_TABLE = {
  vdcToCollector: ["VDC+", "Q1-C"],
  vdcMinusToRelayA2: ["VDC-", "RLY-A2"],
  topRailToSwitchLeft: ["VDC+", "SW-L"],
  switchRightToBase: ["SW-R", "Q1-B"],
  switchRightToResistorTop: ["SW-R", "R1-T"],
  resistorBottomToBottomRail: ["R1-B", "VDC-"],
  emitterToRelayA1: ["Q1-E", "RLY-A1"],
  loadAcTopToRelayTop: ["V3-T", "RLY-T"],
  loadAcBottomToLampTop: ["V3-B", "L1-T"],
  relayBottomToLampBottom: ["RLY-B", "L1-B"],
} as const satisfies Record<ConnectionKey, ConnectionPair>;

function buildWirePoints(connectionKey: ConnectionKey): Point[] {
  const [startLabel, endLabel] = CONNECTION_TABLE[connectionKey];
  const start = TERMINAL_LABEL_TO_NODE[startLabel];
  const end = TERMINAL_LABEL_TO_NODE[endLabel];
  const route = WIRE_ROUTE_CONFIG[connectionKey];

  switch (route.kind) {
    case "top-bridge": {
      const railY = Math.min(start.y, end.y) + route.topRailY;

      return [
        { x: start.x + route.startX, y: start.y + route.startY },
        { x: start.x + route.startX, y: railY },
        { x: end.x + route.endX, y: railY },
        { x: end.x + route.endX, y: end.y + route.endY },
      ];
    }
    case "bottom-bridge": {
      const railY = Math.max(start.y, end.y) + route.bottomRailY;

      return [
        { x: start.x + route.startX, y: start.y + route.startY },
        { x: start.x + route.startX, y: railY },
        { x: end.x + route.endX, y: railY },
        { x: end.x + route.endX, y: end.y + route.endY },
      ];
    }
    case "top-tap": {
      const railY = Math.min(start.y, end.y) + route.topRailY;
      const tapX = end.x + route.railTapX;

      return [
        { x: tapX, y: railY },
        { x: tapX, y: end.y + route.endY },
        { x: end.x + route.endX, y: end.y + route.endY },
      ];
    }
    case "bottom-drop": {
      const railY = Math.max(start.y, end.y) + route.bottomRailY;

      return [
        { x: start.x + route.startX, y: start.y + route.startY },
        { x: start.x + route.endX, y: railY },
      ];
    }
    case "hv":
      return [
        { x: start.x + route.startX, y: start.y + route.startY },
        { x: end.x + route.endX, y: start.y + route.startY },
        { x: end.x + route.endX, y: end.y + route.endY },
      ];
    case "vh":
      return [
        { x: start.x + route.startX, y: start.y + route.startY },
        { x: start.x + route.startX, y: end.y + route.endY },
        { x: end.x + route.endX, y: end.y + route.endY },
      ];
    case "elbow-x":
      return [
        { x: start.x + route.startX, y: start.y + route.startY },
        { x: end.x + route.elbowX, y: start.y + route.startY },
        { x: end.x + route.elbowX, y: end.y + route.endY },
        { x: end.x + route.endX, y: end.y + route.endY },
      ];
  }
}

const CONNECTION_KEYS = Object.keys(CONNECTION_TABLE) as ConnectionKey[];

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  segments: CONNECTION_KEYS.map((key) => {
    const points = buildWirePoints(key);

    return {
      key,
      labels: CONNECTION_TABLE[key],
      points,
      d: pathD(points),
    };
  }),
} as const;

function getWireSegment(key: ConnectionKey) {
  return WIRE.segments.find((segment) => segment.key === key);
}

function LabelText({
  x,
  y,
  text,
  anchor = "start",
  color = STYLE.label,
}: {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
  color?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize="12"
      fontWeight="700"
      textAnchor={anchor}
    >
      {text}
    </text>
  );
}

function DebugTerminalDot({
  point,
  label,
  offset,
}: {
  point: Point;
  label: string;
  offset: Offset;
}) {
  if (!SHOW_DEBUG_TERMINAL_DOTS) return null;

  const dotPoint = offsetPoint(point, offset);

  return (
    <g>
      <circle
        cx={dotPoint.x}
        cy={dotPoint.y}
        r={5}
        fill={STYLE.debugTerminal}
        stroke={STYLE.debugTerminalStroke}
        strokeWidth={2}
      />
      <text
        x={dotPoint.x + 9}
        y={dotPoint.y - 10}
        fill={STYLE.debugTerminal}
        fontSize="11"
        fontWeight="700"
      >
        {label}
      </text>
    </g>
  );
}

function FlowDots({
  points,
  active,
  color,
  duration,
  radius,
  count,
  stagger,
}: {
  points: readonly Point[];
  active: boolean;
  color: string;
  duration: string;
  radius: number;
  count: number;
  stagger: number;
}) {
  if (!active || points.length < 2 || count <= 0) return null;

  const d = pathD(points);

  return (
    <g aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <circle key={`${d}-${index}`} r={radius} fill={color} opacity={0.95}>
          <animateMotion
            dur={duration}
            repeatCount="indefinite"
            begin={`${(index * stagger).toFixed(2)}s`}
            path={d}
          />
        </circle>
      ))}
    </g>
  );
}

function segmentPath(start: Point, end: Point): Point[] {
  return [start, end];
}

function pathForFlowMode(
  points: readonly Point[],
  flowMode: RelayCurrentFlowMode,
): Point[] {
  return flowMode === "electron" ? [...points].reverse() : [...points];
}

function renderFlowSet({
  segments,
  active,
  flowMode,
  color,
  duration,
  radius,
  count,
  stagger,
}: {
  segments: readonly (readonly Point[])[];
  active: boolean;
  flowMode: RelayCurrentFlowMode;
  color: string;
  duration: string;
  radius: number;
  count: number;
  stagger: number;
}) {
  if (!active) return null;

  return segments.map((segment, index) => (
    <FlowDots
      key={`${index}-${segment.length}`}
      points={pathForFlowMode(segment, flowMode)}
      active={active}
      color={color}
      duration={duration}
      radius={radius}
      count={count}
      stagger={stagger}
    />
  ));
}

function SymbolCard({
  x,
  y,
  width,
  height,
  rotation = 0,
  title,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  title: string;
  children: ReactNode;
}) {
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotation} ${centerX} ${centerY})`}
    >
      <g transform="translate(16 16)">{children}</g>
      <LabelText x={width / 2} y={height + 16} text={title} anchor="middle" />
    </g>
  );
}

function ACSourceBlock({
  component,
  label,
}: {
  component: PositionedComponentBox;
  label: string;
}) {
  return (
    <SymbolCard
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      rotation={component.rotation}
      title={label}
    >
      <g
        transform={`translate(${INDIVIDUAL_SYMBOL_SIZE.loadAcSource.offsetX} ${INDIVIDUAL_SYMBOL_SIZE.loadAcSource.offsetY})`}
      >
        <ACVoltageSourceSymbol
          width={INDIVIDUAL_SYMBOL_SIZE.loadAcSource.width}
          height={INDIVIDUAL_SYMBOL_SIZE.loadAcSource.height}
        />
      </g>
    </SymbolCard>
  );
}

function DCReferenceBlock({
  component,
}: {
  component: PositionedComponentBox;
}) {
  return (
    <SymbolCard
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      rotation={component.rotation}
      title={LABEL.dcReference}
    >
      <g transform="translate(10 4)">
        <DCVoltageSourceV1Symbol
          width={component.width - 50}
          height={component.height - 44}
        />
      </g>
    </SymbolCard>
  );
}

function SwitchBlock({
  component,
  switchClosed,
  onToggle,
}: {
  component: PositionedComponentBox;
  switchClosed: boolean;
  onToggle: () => void;
}) {
  return (
    <SymbolCard
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      rotation={component.rotation}
      title={LABEL.switch}
    >
      <g
        transform="translate(2 18)"
        role="button"
        aria-label={switchClosed ? "Turn switch off" : "Turn switch on"}
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <SPSTSwitchSymbol
          width={component.width - 36}
          height={component.height - 64}
          switchClosed={switchClosed}
        />
      </g>
    </SymbolCard>
  );
}

function TransistorBlock({ component }: { component: PositionedComponentBox }) {
  return (
    <SymbolCard
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      rotation={component.rotation}
      title={LABEL.transistor}
    >
      <g transform="translate(18 4)">
        <NPNTransistorSymbol
          width={component.width - 54}
          height={component.height - 34}
        />
      </g>
    </SymbolCard>
  );
}

function VerticalResistorBlock({
  component,
  label,
}: {
  component: PositionedComponentBox;
  label: string;
}) {
  return (
    <SymbolCard
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      rotation={component.rotation}
      title={label}
    >
      <g
        transform={`translate(${component.width / 2} ${component.height / 2 - 4}) rotate(90) translate(-30 -14)`}
      >
        <ResistorSymbol width={84} height={40} showTerminalLabels={false} />
      </g>
    </SymbolCard>
  );
}

function RelayBlock({
  component,
  contactClosedToNo,
  relayContactLabel,
}: {
  component: PositionedComponentBox;
  contactClosedToNo: boolean;
  relayContactLabel: string;
}) {
  return (
    <SymbolCard
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      rotation={component.rotation}
      title={LABEL.relay}
    >
      <g transform="translate(8 22)">
        <SPDTSymbol
          width={component.width - 44}
          height={component.height - 74}
          relayEnergized={contactClosedToNo}
          showContactLabels
          activeStroke={STYLE.relayActive}
          idleStroke={STYLE.relayIdle}
        />
        <rect
          x={8}
          y={2}
          width={56}
          height={16}
          rx={8}
          fill={contactClosedToNo ? "#dcfce7" : "#e2e8f0"}
        />
        <text
          x={36}
          y={14}
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={contactClosedToNo ? STYLE.relayActive : STYLE.relayIdle}
        >
          {relayContactLabel}
        </text>
      </g>
    </SymbolCard>
  );
}

function LampBlock({
  component,
  lampOn,
}: {
  component: PositionedComponentBox;
  lampOn: boolean;
}) {
  return (
    <SymbolCard
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      rotation={component.rotation}
      title={LABEL.lamp}
    >
      <svg width={component.width - 30} height={component.height - 46}>
        {lampOn ? (
          <circle cx={40} cy={47} r={28} fill={STYLE.lampGlow} opacity={0.35} />
        ) : null}
        <g transform="translate(26 12) scale(1.45)">
          <PilotLight standalone={false} label={LABEL.lamp} />
        </g>
      </svg>
    </SymbolCard>
  );
}

function WireLayer() {
  return (
    <g aria-label="connection wires">
      {WIRE.segments.map((segment) => (
        <path
          key={segment.key}
          d={segment.d}
          fill="none"
          stroke={STYLE.wire}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function FlowLayer({
  switchClosed,
  flowMode,
  flowSpeed,
  coilCurrentMa,
  coilPathActive,
  loadPathActive,
  lampOn,
}: {
  switchClosed: boolean;
  flowMode: RelayCurrentFlowMode;
  flowSpeed: number;
  coilCurrentMa: number;
  coilPathActive: boolean;
  loadPathActive: boolean;
  lampOn: boolean;
}) {
  const switchInputWire = getWireSegment("topRailToSwitchLeft")?.points ?? [];
  const switchToBaseWire = getWireSegment("switchRightToBase")?.points ?? [];
  const switchToResistorWire =
    getWireSegment("switchRightToResistorTop")?.points ?? [];
  const resistorReturnWire =
    getWireSegment("resistorBottomToBottomRail")?.points ?? [];
  const collectorFeedWire = getWireSegment("vdcToCollector")?.points ?? [];
  const emitterToRelayWire = getWireSegment("emitterToRelayA1")?.points ?? [];
  const relayReturnWire = getWireSegment("vdcMinusToRelayA2")?.points ?? [];
  const acToRelayWire = getWireSegment("loadAcTopToRelayTop")?.points ?? [];
  const relayToLampWire =
    getWireSegment("relayBottomToLampBottom")?.points ?? [];
  const lampToAcWire = getWireSegment("loadAcBottomToLampTop")?.points ?? [];

  const switchBridgePath = segmentPath(NODE.switchLeft, NODE.switchRight);
  const controlInputSegments = [switchInputWire] as const;
  const controlSwitchSegments = [switchBridgePath] as const;
  const baseDriveSegments = [switchToBaseWire] as const;
  const resistorBiasSegments = [
    switchToResistorWire,
    [...resistorReturnWire].reverse(),
  ] as const;
  const coilSegments = [
    collectorFeedWire,
    emitterToRelayWire,
    [...relayReturnWire].reverse(),
  ] as const;
  const loadSegments = [
    acToRelayWire,
    relayToLampWire,
    [...lampToAcWire].reverse(),
  ] as const;
  const visual = buildRelayFlowVisualState({
    flowSpeed,
    coilCurrentMa,
    lampOn,
    coilPathActive,
    loadPathActive,
  });
  const flowColor =
    flowMode === "electron" ? STYLE.electronFlow : STYLE.conventionalFlow;

  return (
    <g aria-label="current flow">
      {renderFlowSet({
        segments: controlInputSegments,
        active: switchClosed,
        flowMode,
        color: flowColor,
        duration: visual.coilDuration,
        radius: Math.max(3.2, visual.coilRadius - 0.55),
        count: 3,
        stagger: visual.pulseGap,
      })}
      {renderFlowSet({
        segments: controlSwitchSegments,
        active: switchClosed,
        flowMode,
        color: flowColor,
        duration: visual.coilDuration,
        radius: Math.max(3.2, visual.coilRadius - 0.4),
        count: 2,
        stagger: visual.pulseGap,
      })}
      {renderFlowSet({
        segments: baseDriveSegments,
        active: switchClosed,
        flowMode,
        color: flowColor,
        duration: visual.coilDuration,
        radius: Math.max(3.2, visual.coilRadius - 0.5),
        count: 3,
        stagger: visual.pulseGap,
      })}
      {renderFlowSet({
        segments: resistorBiasSegments,
        active: switchClosed,
        flowMode,
        color: flowColor,
        duration: visual.coilDuration,
        radius: Math.max(3, visual.coilRadius - 0.7),
        count: 2,
        stagger: visual.pulseGap,
      })}
      {renderFlowSet({
        segments: coilSegments,
        active: coilPathActive,
        flowMode,
        color: flowColor,
        duration: visual.coilDuration,
        radius: visual.coilRadius,
        count: Math.max(2, Math.ceil(visual.coilPulseCount / 3)),
        stagger: visual.pulseGap,
      })}
      {renderFlowSet({
        segments: loadSegments.filter((segment) => segment.length >= 2),
        active: loadPathActive,
        flowMode,
        color: flowColor,
        duration: visual.loadDuration,
        radius: visual.loadRadius,
        count: Math.max(2, Math.ceil(visual.loadPulseCount / 3)),
        stagger: visual.pulseGap,
      })}
    </g>
  );
}

function NodeLayer() {
  if (!SHOW_DEBUG_TERMINAL_DOTS) return null;

  return (
    <g>
      <DebugTerminalDot
        point={NODE.dcReferenceTop}
        label="VDC+"
        offset={DEBUG_TERMINAL_OFFSET.dcReferenceTop}
      />
      <DebugTerminalDot
        point={NODE.dcReferenceBottom}
        label="VDC-"
        offset={DEBUG_TERMINAL_OFFSET.dcReferenceBottom}
      />
      <DebugTerminalDot
        point={NODE.switchLeft}
        label="SW-L"
        offset={DEBUG_TERMINAL_OFFSET.switchLeft}
      />
      <DebugTerminalDot
        point={NODE.switchRight}
        label="SW-R"
        offset={DEBUG_TERMINAL_OFFSET.switchRight}
      />
      <DebugTerminalDot
        point={NODE.transistorBase}
        label="Q1-B"
        offset={DEBUG_TERMINAL_OFFSET.transistorBase}
      />
      <DebugTerminalDot
        point={NODE.transistorCollector}
        label="Q1-C"
        offset={DEBUG_TERMINAL_OFFSET.transistorCollector}
      />
      <DebugTerminalDot
        point={NODE.transistorEmitter}
        label="Q1-E"
        offset={DEBUG_TERMINAL_OFFSET.transistorEmitter}
      />
      <DebugTerminalDot
        point={NODE.relayResistorTop}
        label="R1-T"
        offset={DEBUG_TERMINAL_OFFSET.relayResistorTop}
      />
      <DebugTerminalDot
        point={NODE.relayResistorBottom}
        label="R1-B"
        offset={DEBUG_TERMINAL_OFFSET.relayResistorBottom}
      />
      <DebugTerminalDot
        point={NODE.relayCoilTop}
        label="RLY-A1"
        offset={DEBUG_TERMINAL_OFFSET.relayCoilTop}
      />
      <DebugTerminalDot
        point={NODE.relayCoilBottom}
        label="RLY-A2"
        offset={DEBUG_TERMINAL_OFFSET.relayCoilBottom}
      />
      <DebugTerminalDot
        point={NODE.relayThrowTop}
        label="RLY-T"
        offset={DEBUG_TERMINAL_OFFSET.relayThrowTop}
      />
      <DebugTerminalDot
        point={NODE.relayCommon}
        label="RLY-C"
        offset={DEBUG_TERMINAL_OFFSET.relayCommon}
      />
      <DebugTerminalDot
        point={NODE.relayThrowBottom}
        label="RLY-B"
        offset={DEBUG_TERMINAL_OFFSET.relayThrowBottom}
      />
      <DebugTerminalDot
        point={NODE.loadAcTop}
        label="V3-T"
        offset={DEBUG_TERMINAL_OFFSET.loadAcTop}
      />
      <DebugTerminalDot
        point={NODE.loadAcBottom}
        label="V3-B"
        offset={DEBUG_TERMINAL_OFFSET.loadAcBottom}
      />
      <DebugTerminalDot
        point={NODE.lampTop}
        label="L1-T"
        offset={DEBUG_TERMINAL_OFFSET.lampTop}
      />
      <DebugTerminalDot
        point={NODE.lampBottom}
        label="L1-B"
        offset={DEBUG_TERMINAL_OFFSET.lampBottom}
      />
    </g>
  );
}

export default function TransistorDrivingRelay({
  dcVoltage,
  acVoltage,
  baseResistorOhms,
  flowSpeed,
  switchClosed,
  flowMode,
  baseCurrentMa,
  coilCurrentMa,
  transistorOn,
  relayEnergized,
  contactClosedToNo,
  lampOn,
  coilPathActive,
  loadPathActive,
  relayContactLabel,
  onToggleSwitch,
}: TransistorDrivingRelayProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Relay Driver Circuit View
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-900">
            Transistor Driving Relay Simulation
          </h3>
        </div>
        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${
            relayEnergized
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {relayEnergized ? "RELAY ON" : "RELAY OFF"}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white">
        <svg
          width={VIEW_BOX.width}
          height={VIEW_BOX.height}
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          preserveAspectRatio="xMidYMin meet"
          role="img"
          aria-label={LABEL.canvas}
          style={{
            display: "block",
            width: "100%",
            maxWidth: `${VIEW_BOX.width}px`,
            height: "auto",
            margin: "0 auto",
          }}
        >
          <BackgroundPixelGred
            width={VIEW_BOX.width}
            height={VIEW_BOX.height}
            backgroundColor={STYLE.background}
            minor={20}
            major={100}
            showLabels
            showBorder
            borderColor={STYLE.boardBorder}
            borderStrokeWidth={1}
          />

          <g transform={buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE)}>
            <rect
              x={18}
              y={18}
              width={VIEW_BOX.width - 36}
              height={VIEW_BOX.height - 36}
              rx={22}
              fill="none"
              stroke={STYLE.boardBorder}
              strokeWidth={2}
            />

            <WireLayer />
            <FlowLayer
              switchClosed={switchClosed}
              flowMode={flowMode}
              flowSpeed={flowSpeed}
              coilCurrentMa={coilCurrentMa}
              coilPathActive={coilPathActive}
              loadPathActive={loadPathActive}
              lampOn={lampOn}
            />

            <DCReferenceBlock component={COMPONENT.dcReference} />
            <SwitchBlock
              component={COMPONENT.switch}
              switchClosed={switchClosed}
              onToggle={onToggleSwitch}
            />
            <TransistorBlock component={COMPONENT.transistor} />
            <VerticalResistorBlock
              component={COMPONENT.relayResistor}
              label={LABEL.relayResistor}
            />
            <RelayBlock
              component={COMPONENT.relay}
              contactClosedToNo={contactClosedToNo}
              relayContactLabel={relayContactLabel}
            />
            <ACSourceBlock
              component={COMPONENT.loadAcSource}
              label={LABEL.loadAcSource}
            />
            <LampBlock component={COMPONENT.lamp} lampOn={lampOn} />
            <NodeLayer />

            <LabelText
              x={34}
              y={VIEW_BOX.height - 26}
              text={`DC ${dcVoltage.toFixed(1)}V | AC ${acVoltage.toFixed(1)}V | R1 ${baseResistorOhms.toFixed(0)} Ohm | Base ${baseCurrentMa.toFixed(2)}mA | Coil ${coilCurrentMa.toFixed(2)}mA | ${contactClosedToNo ? "COM->NO" : "COM REST"} | ${transistorOn ? "Q1 ON" : "Q1 OFF"} | Flow ${flowSpeed.toFixed(1)}x | ${flowMode}`}
              color={STYLE.muted}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
