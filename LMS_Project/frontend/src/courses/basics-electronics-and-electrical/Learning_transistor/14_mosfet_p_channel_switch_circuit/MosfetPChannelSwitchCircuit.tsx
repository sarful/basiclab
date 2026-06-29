"use client";

import {
  BackgroundPixelGred,
  BatterySymbol,
  LEDSymbol,
  PChannelMosfetSymbol,
  ResistorSymbol,
  SPSTSwitchSymbol,
} from "@/src/library";
import {
  buildPmosFlowPaths,
  buildPmosFlowVisualState,
  joinWireSegments,
} from "./electronFlowLogic";
import type { PmosCurrentFlowMode } from "./simulationTypes";

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type LocalPoint = {
  x: number;
  y: number;
};

type Offset = {
  x: number;
  y: number;
};

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 760,
  height: 700,
} as const;

const SCALE = {
  component: 1,
  wire: 1,
  canvas: 1,
} as const;

const CIRCUIT_COMPONENT_SCALE = {
  source: SCALE.component,
  gateResistor: SCALE.component,
  switch: SCALE.component,
  ledResistor: SCALE.component,
  led: SCALE.component,
  mosfet: SCALE.component,
} as const;

const COMPONENT_OFFSET = {
  source: { x: 0, y: 40 },
  gateResistor: { x: 40, y: 50 },
  switch: { x: -20, y: 50 },
  ledResistor: { x: 19, y: 0 },
  led: { x: 10, y: 0 },
  mosfet: { x: -3, y: 0 },
} as const satisfies Record<string, Offset>;

const LED_GLOW_OFFSET = {
  x: 0,
  y: 0,
} as const satisfies Offset;

const BASE_WIRE_WIDTH = 1.6;
const CIRCUIT_WIRE_SCALE = SCALE.wire;
const CIRCUIT_CANVAS_SCALE = SCALE.canvas;
const SHOW_DEBUG_TERMINAL_DOTS = true;
const DEBUG_TERMINAL_OFFSET = {
  sourcePositiveTerminal: { x: 0, y: 10 },
  sourceNegativeTerminal: { x: 0, y: -20 },
  gateResistorTop: { x: -24, y: 25 },
  gateResistorBottom: { x: -25, y: 25 },
  switchTop: { x: 0, y: 0 },
  switchBottom: { x: 0, y: 0 },
  ledResistorTop: { x: -25, y: 25 },
  ledResistorBottom: { x: -25, y: 23 },
  ledTop: { x: -18, y: 20 },
  ledBottom: { x: -18, y: 18 },
  mosfetGate: { x: 25, y: 25 },
  mosfetDrain: { x: 25, y: 25 },
  mosfetSource: { x: 25, y: 25 },
} as const satisfies Record<string, Offset>;

const WIRE_OFFSET = {
  sourcePositiveDrop: { x: 0, y: 0 },
  positiveRail: { x: 0, y: 0 },
  sourceNegativeDrop: { x: 0, y: 0 },
  negativeRail: { x: 25, y: 0 },
  mosfetSourceReturn: { x: 25, y: 0 },
  ledResistorFeed: { x: 0, y: 0 },
  ledResistorToLed: { x: 0, y: 0 },
  ledToMosfetDrain: { x: 0, y: 0 },
  gatePositiveFeed: { x: -20, y: 0 },
  gateResistorToNode: { x: -25, y: 0 },
  gateNodeToMosfet: { x: 10, y: 0 },
  switchToGateNode: { x: 0, y: 0 },
  switchToNegativeRail: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const STYLE = {
  background: "#ffffff",
  boardBorder: "#dbe3ef",
  wire: "#111827",
  wireSoft: "#334155",
  symbol: "#111827",
  label: "#0f172a",
  ledGlow: "#f59e0b",
  nodeFill: "#ffffff",
  debugTerminal: "#ef4444",
  debugTerminalStroke: "#ffffff",
} as const;

const SYMBOL_MASK = {
  resistorLeft: { x: -8, y: -4, width: 18, height: 16 },
  resistorRight: { x: 42, y: -4, width: 18, height: 16 },
  ledLeft: { x: -8, y: 8, width: 18, height: 16 },
  ledRight: { x: 42, y: 8, width: 18, height: 16 },
} as const;

const SYMBOL_CENTER = {
  resistor: { x: 25.5, y: 10.5 },
  led: { x: 25.5, y: 20.5 },
  mosfet: { x: 20.5, y: 25.5 },
  switch: { x: 120, y: 55 },
} as const satisfies Record<string, LocalPoint>;

const SYMBOL_POINT = {
  resistorLeft: { x: 0, y: 10 },
  resistorRight: { x: 50, y: 10 },
  ledAnode: { x: 0, y: 19.992 },
  ledCathode: { x: 50, y: 19.992 },
  mosfetGate: { x: 0, y: 30 },
  mosfetDrain: { x: 30, y: 0 },
  mosfetSource: { x: 30, y: 50 },
  switchLeftTerminal: { x: 71, y: 56 },
  switchRightTerminal: { x: 170, y: 57 },
} as const satisfies Record<string, LocalPoint>;

const LABEL = {
  source: "VDD",
  gateResistor: "RPU",
  switch: "SW1",
  ledResistor: "RLED",
  led: "LED",
  mosfet: "Q1",
  canvas: "MOSFET P channel switch circuit",
  workspace: "MOSFET P channel switch circuit workspace",
} as const;

type MosfetPChannelSwitchCircuitProps = {
  batteryVoltage: number;
  rpuOhms: number;
  rLedOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: PmosCurrentFlowMode;
  gateVoltage: number;
  sourceVoltage: number;
  drainVoltage: number;
  vgs: number;
  loadCurrentMa: number;
  gatePathActive: boolean;
  loadPathActive: boolean;
  isPmosOn: boolean;
  isLedOn: boolean;
};

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
  offset: Offset,
): ComponentBox {
  return {
    ...component,
    x: component.x + offset.x,
    y: component.y + offset.y,
  };
}

function pointOnComponent(
  component: ComponentBox,
  xRatio: number,
  yRatio: number,
): Point {
  return {
    x: component.x + component.width * xRatio,
    y: component.y + component.height * yRatio,
  };
}

function scalePointFromCenter(
  component: ComponentBox,
  point: LocalPoint,
  center: LocalPoint,
  scale: number,
): Point {
  return {
    x: component.x + component.width / 2 + (point.x - center.x) * scale,
    y: component.y + component.height / 2 + (point.y - center.y) * scale,
  };
}

function offsetPoint(point: Point, offset: Offset): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function offsetPoints(points: readonly Point[], offset: Offset) {
  return points.map((point) => offsetPoint(point, offset));
}

function debugTerminalPoint(
  point: Point,
  offset: Offset,
  enabled = SHOW_DEBUG_TERMINAL_DOTS,
) {
  return enabled ? offsetPoint(point, offset) : point;
}

function rotate90ScaledPointFromCenter(
  component: ComponentBox,
  point: LocalPoint,
  center: LocalPoint,
  scale: number,
): Point {
  const offsetX = (point.x - center.x) * scale;
  const offsetY = (point.y - center.y) * scale;

  return {
    x: component.x + component.width / 2 - offsetY,
    y: component.y + component.height / 2 + offsetX,
  };
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

const BASE_COMPONENT = {
  source: { x: 66, y: 212, width: 112, height: 150 },
  gateResistor: { x: 322, y: 118, width: 72, height: 134 },
  switch: { x: 322, y: 398, width: 72, height: 132 },
  ledResistor: { x: 610, y: 58, width: 72, height: 124 },
  led: { x: 610, y: 188, width: 72, height: 106 },
  mosfet: { x: 535, y: 305, width: 124, height: 170 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: offsetComponent(
    scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
    COMPONENT_OFFSET.source,
  ),
  gateResistor: offsetComponent(
    scaleComponent(
      BASE_COMPONENT.gateResistor,
      CIRCUIT_COMPONENT_SCALE.gateResistor,
    ),
    COMPONENT_OFFSET.gateResistor,
  ),
  switch: offsetComponent(
    scaleComponent(BASE_COMPONENT.switch, CIRCUIT_COMPONENT_SCALE.switch),
    COMPONENT_OFFSET.switch,
  ),
  ledResistor: offsetComponent(
    scaleComponent(
      BASE_COMPONENT.ledResistor,
      CIRCUIT_COMPONENT_SCALE.ledResistor,
    ),
    COMPONENT_OFFSET.ledResistor,
  ),
  led: offsetComponent(
    scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
    COMPONENT_OFFSET.led,
  ),
  mosfet: offsetComponent(
    scaleComponent(BASE_COMPONENT.mosfet, CIRCUIT_COMPONENT_SCALE.mosfet),
    COMPONENT_OFFSET.mosfet,
  ),
} as const;

const SYMBOL_SCALE = {
  resistor:
    Math.min(
      COMPONENT.gateResistor.width / 41,
      COMPONENT.gateResistor.height / 71,
    ) * 1.32,
  ledResistor:
    Math.min(
      COMPONENT.ledResistor.width / 41,
      COMPONENT.ledResistor.height / 71,
    ) * 1.32,
  led: Math.min(COMPONENT.led.width / 51, COMPONENT.led.height / 71) * 1.18,
  mosfet:
    Math.min(COMPONENT.mosfet.width / 61, COMPONENT.mosfet.height / 71) * 1.2,
  switch:
    Math.min(COMPONENT.switch.width / 110, COMPONENT.switch.height / 240) *
    1.08,
} as const;

const NODE = {
  positiveRailY: 96,
  negativeRailY: 580,

  sourcePositiveTerminal: pointOnComponent(
    COMPONENT.source,
    0.5,
    24 / COMPONENT.source.height,
  ),
  sourceNegativeTerminal: pointOnComponent(
    COMPONENT.source,
    0.5,
    125 / COMPONENT.source.height,
  ),

  gateResistorTop: rotate90ScaledPointFromCenter(
    COMPONENT.gateResistor,
    SYMBOL_POINT.resistorLeft,
    SYMBOL_CENTER.resistor,
    SYMBOL_SCALE.resistor,
  ),
  gateResistorBottom: rotate90ScaledPointFromCenter(
    COMPONENT.gateResistor,
    SYMBOL_POINT.resistorRight,
    SYMBOL_CENTER.resistor,
    SYMBOL_SCALE.resistor,
  ),

  switchTop: rotate90ScaledPointFromCenter(
    COMPONENT.switch,
    SYMBOL_POINT.switchLeftTerminal,
    SYMBOL_CENTER.switch,
    SYMBOL_SCALE.switch,
  ),
  switchBottom: rotate90ScaledPointFromCenter(
    COMPONENT.switch,
    SYMBOL_POINT.switchRightTerminal,
    SYMBOL_CENTER.switch,
    SYMBOL_SCALE.switch,
  ),

  ledResistorTop: rotate90ScaledPointFromCenter(
    COMPONENT.ledResistor,
    SYMBOL_POINT.resistorLeft,
    SYMBOL_CENTER.resistor,
    SYMBOL_SCALE.ledResistor,
  ),
  ledResistorBottom: rotate90ScaledPointFromCenter(
    COMPONENT.ledResistor,
    SYMBOL_POINT.resistorRight,
    SYMBOL_CENTER.resistor,
    SYMBOL_SCALE.ledResistor,
  ),

  ledTop: rotate90ScaledPointFromCenter(
    COMPONENT.led,
    SYMBOL_POINT.ledAnode,
    SYMBOL_CENTER.led,
    SYMBOL_SCALE.led,
  ),
  ledBottom: rotate90ScaledPointFromCenter(
    COMPONENT.led,
    SYMBOL_POINT.ledCathode,
    SYMBOL_CENTER.led,
    SYMBOL_SCALE.led,
  ),

  mosfetGate: scalePointFromCenter(
    COMPONENT.mosfet,
    SYMBOL_POINT.mosfetGate,
    SYMBOL_CENTER.mosfet,
    SYMBOL_SCALE.mosfet,
  ),
  mosfetDrain: scalePointFromCenter(
    COMPONENT.mosfet,
    SYMBOL_POINT.mosfetDrain,
    SYMBOL_CENTER.mosfet,
    SYMBOL_SCALE.mosfet,
  ),
  mosfetSource: scalePointFromCenter(
    COMPONENT.mosfet,
    SYMBOL_POINT.mosfetSource,
    SYMBOL_CENTER.mosfet,
    SYMBOL_SCALE.mosfet,
  ),

  gateNode: {
    x: 488,
    y: scalePointFromCenter(
      COMPONENT.mosfet,
      SYMBOL_POINT.mosfetGate,
      SYMBOL_CENTER.mosfet,
      SYMBOL_SCALE.mosfet,
    ).y,
  },
} as const;

const WIRE_BASE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  sourcePositiveDrop: [
    NODE.sourcePositiveTerminal,
    { x: NODE.sourcePositiveTerminal.x, y: NODE.positiveRailY },
  ],
  positiveRail: [
    { x: NODE.sourcePositiveTerminal.x, y: NODE.positiveRailY },
    { x: NODE.ledResistorTop.x, y: NODE.positiveRailY },
  ],
  sourceNegativeDrop: [
    NODE.sourceNegativeTerminal,
    { x: NODE.sourceNegativeTerminal.x, y: NODE.negativeRailY },
  ],
  negativeRail: [
    { x: NODE.sourceNegativeTerminal.x, y: NODE.negativeRailY },
    { x: NODE.mosfetSource.x, y: NODE.negativeRailY },
  ],
  mosfetSourceReturn: [
    NODE.mosfetSource,
    { x: NODE.mosfetSource.x, y: NODE.negativeRailY },
  ],
  ledResistorFeed: [
    { x: NODE.ledResistorTop.x, y: NODE.positiveRailY },
    NODE.ledResistorTop,
  ],
  ledResistorToLed: [NODE.ledResistorBottom, NODE.ledTop],
  ledToMosfetDrain: [NODE.ledBottom, NODE.mosfetDrain],
  gatePositiveFeed: [
    { x: NODE.gateResistorTop.x, y: NODE.positiveRailY },
    NODE.gateResistorTop,
  ],
  gateResistorToNode: [
    NODE.gateResistorBottom,
    { x: NODE.gateResistorBottom.x, y: NODE.gateNode.y },
    NODE.gateNode,
  ],
  gateNodeToMosfet: [NODE.gateNode, NODE.mosfetGate],
  switchToGateNode: [
    NODE.switchTop,
    { x: NODE.switchTop.x, y: NODE.gateNode.y },
    NODE.gateNode,
  ],
  switchToNegativeRail: [
    NODE.switchBottom,
    { x: NODE.switchBottom.x, y: NODE.negativeRailY },
  ],
} as const;

const WIRE = {
  width: WIRE_BASE.width,
  sourcePositiveDrop: offsetPoints(
    WIRE_BASE.sourcePositiveDrop,
    WIRE_OFFSET.sourcePositiveDrop,
  ),
  positiveRail: offsetPoints(WIRE_BASE.positiveRail, WIRE_OFFSET.positiveRail),
  sourceNegativeDrop: offsetPoints(
    WIRE_BASE.sourceNegativeDrop,
    WIRE_OFFSET.sourceNegativeDrop,
  ),
  negativeRail: offsetPoints(WIRE_BASE.negativeRail, WIRE_OFFSET.negativeRail),
  mosfetSourceReturn: offsetPoints(
    WIRE_BASE.mosfetSourceReturn,
    WIRE_OFFSET.mosfetSourceReturn,
  ),
  ledResistorFeed: offsetPoints(
    WIRE_BASE.ledResistorFeed,
    WIRE_OFFSET.ledResistorFeed,
  ),
  ledResistorToLed: offsetPoints(
    WIRE_BASE.ledResistorToLed,
    WIRE_OFFSET.ledResistorToLed,
  ),
  ledToMosfetDrain: offsetPoints(
    WIRE_BASE.ledToMosfetDrain,
    WIRE_OFFSET.ledToMosfetDrain,
  ),
  gatePositiveFeed: offsetPoints(
    WIRE_BASE.gatePositiveFeed,
    WIRE_OFFSET.gatePositiveFeed,
  ),
  gateResistorToNode: offsetPoints(
    WIRE_BASE.gateResistorToNode,
    WIRE_OFFSET.gateResistorToNode,
  ),
  gateNodeToMosfet: offsetPoints(
    WIRE_BASE.gateNodeToMosfet,
    WIRE_OFFSET.gateNodeToMosfet,
  ),
  switchToGateNode: offsetPoints(
    WIRE_BASE.switchToGateNode,
    WIRE_OFFSET.switchToGateNode,
  ),
  switchToNegativeRail: offsetPoints(
    WIRE_BASE.switchToNegativeRail,
    WIRE_OFFSET.switchToNegativeRail,
  ),
} as const;

const PATH = {
  sourcePositiveDrop: pathD(WIRE.sourcePositiveDrop),
  positiveRail: pathD(WIRE.positiveRail),
  sourceNegativeDrop: pathD(WIRE.sourceNegativeDrop),
  negativeRail: pathD(WIRE.negativeRail),
  mosfetSourceReturn: pathD(WIRE.mosfetSourceReturn),
  ledResistorFeed: pathD(WIRE.ledResistorFeed),
  ledResistorToLed: pathD(WIRE.ledResistorToLed),
  ledToMosfetDrain: pathD(WIRE.ledToMosfetDrain),
  gatePositiveFeed: pathD(WIRE.gatePositiveFeed),
  gateResistorToNode: pathD(WIRE.gateResistorToNode),
  gateNodeToMosfet: pathD(WIRE.gateNodeToMosfet),
  switchToGateNode: pathD(WIRE.switchToGateNode),
  switchToNegativeRail: pathD(WIRE.switchToNegativeRail),
} as const;

function WirePath({ d }: { d: string }) {
  return (
    <path
      d={d}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function CurrentPathHighlight({
  d,
  active,
  color,
  opacity = 0.18,
}: {
  d: string;
  active: boolean;
  color: string;
  opacity?: number;
}) {
  if (!active) return null;

  return (
    <path
      d={d}
      stroke={color}
      strokeWidth={WIRE.width + 3}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
}

function CurrentPulse({
  d,
  active,
  color,
  delay,
  duration,
  radius,
}: {
  d: string;
  active: boolean;
  color: string;
  delay: string;
  duration: string;
  radius: number;
}) {
  if (!active) return null;

  return (
    <circle cx={0} cy={0} r={radius} fill={color} opacity={0}>
      <animateMotion
        dur={duration}
        begin={delay}
        repeatCount="indefinite"
        path={d}
      />
      <animate
        attributeName="opacity"
        values="0;0.88;0.88;0"
        keyTimes="0;0.08;0.9;1"
        dur={duration}
        begin={delay}
        repeatCount="indefinite"
      />
    </circle>
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
  if (!SHOW_DEBUG_TERMINAL_DOTS) {
    return null;
  }

  const dotPoint = offsetPoint(point, offset);

  return (
    <g>
      <circle
        cx={dotPoint.x}
        cy={dotPoint.y}
        r={4.5}
        fill={STYLE.debugTerminal}
        stroke={STYLE.debugTerminalStroke}
        strokeWidth={1.5}
      />
      <text
        x={dotPoint.x + 8}
        y={dotPoint.y - 8}
        fill={STYLE.debugTerminal}
        fontSize="10"
        fontWeight="700"
      >
        {label}
      </text>
    </g>
  );
}

function LabelText({
  x,
  y,
  text,
  anchor = "start",
}: {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={STYLE.label}
      fontSize="12"
      fontWeight="700"
      textAnchor={anchor}
    >
      {text}
    </text>
  );
}

function SourceBlock({ batteryVoltage }: { batteryVoltage: number }) {
  return (
    <svg
      x={COMPONENT.source.x}
      y={COMPONENT.source.y}
      width={COMPONENT.source.width}
      height={COMPONENT.source.height}
      viewBox={`0 0 ${COMPONENT.source.width} ${COMPONENT.source.height}`}
      overflow="visible"
    >
      <BatterySymbol
        width={COMPONENT.source.width}
        height={COMPONENT.source.height}
        label={`${LABEL.source} ${batteryVoltage.toFixed(1)}V`}
      />
    </svg>
  );
}

function VerticalResistorBlock({
  component,
  label,
  scale,
}: {
  component: ComponentBox;
  label: string;
  scale: number;
}) {
  return (
    <svg
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      viewBox={`0 0 ${component.width} ${component.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${component.width / 2} ${component.height / 2}) rotate(90) scale(${scale}) translate(-25.5 -10.5)`}
      >
        <ResistorSymbol width={71} height={41} label={label} />
        <rect
          x={SYMBOL_MASK.resistorLeft.x}
          y={SYMBOL_MASK.resistorLeft.y}
          width={SYMBOL_MASK.resistorLeft.width}
          height={SYMBOL_MASK.resistorLeft.height}
          fill={STYLE.background}
          stroke="none"
        />
        <rect
          x={SYMBOL_MASK.resistorRight.x}
          y={SYMBOL_MASK.resistorRight.y}
          width={SYMBOL_MASK.resistorRight.width}
          height={SYMBOL_MASK.resistorRight.height}
          fill={STYLE.background}
          stroke="none"
        />
      </g>
      <LabelText
        x={component.width / 2 + 22}
        y={component.height / 2 + 2}
        text={label}
      />
    </svg>
  );
}

function SwitchBlock({ switchClosed }: { switchClosed: boolean }) {
  return (
    <svg
      x={COMPONENT.switch.x}
      y={COMPONENT.switch.y}
      width={COMPONENT.switch.width}
      height={COMPONENT.switch.height}
      viewBox={`0 0 ${COMPONENT.switch.width} ${COMPONENT.switch.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.switch.width / 2} ${COMPONENT.switch.height / 2}) rotate(90) scale(${SYMBOL_SCALE.switch}) translate(-120 -55)`}
      >
        <SPSTSwitchSymbol
          width={240}
          height={110}
          label={LABEL.switch}
          switchClosed={switchClosed}
        />
      </g>
      <LabelText
        x={COMPONENT.switch.width / 2 + 14}
        y={32}
        text={LABEL.switch}
      />
    </svg>
  );
}

function LedBlock({
  isLedOn,
  rLedOhms,
  loadCurrentMa,
}: {
  isLedOn: boolean;
  rLedOhms: number;
  loadCurrentMa: number;
}) {
  const glowStrength = Math.min(Math.max(loadCurrentMa / 4, 0), 1);
  const ledGlowCenterX = COMPONENT.led.width * 0.46 + LED_GLOW_OFFSET.x - 15;
  const ledGlowCenterY = COMPONENT.led.height * 0.5 + LED_GLOW_OFFSET.y + 15;

  return (
    <svg
      x={COMPONENT.led.x}
      y={COMPONENT.led.y}
      width={COMPONENT.led.width}
      height={COMPONENT.led.height}
      viewBox={`0 0 ${COMPONENT.led.width} ${COMPONENT.led.height}`}
      overflow="visible"
    >
      {isLedOn ? (
        <g>
          <circle
            cx={ledGlowCenterX}
            cy={ledGlowCenterY}
            r={COMPONENT.led.width * 0.34}
            fill={`rgba(245, 158, 11, ${0.14 * glowStrength})`}
          />
          <circle
            cx={ledGlowCenterX}
            cy={ledGlowCenterY}
            r={COMPONENT.led.width * 0.22}
            fill={`rgba(250, 204, 21, ${0.22 * glowStrength})`}
          />
          <circle
            cx={ledGlowCenterX}
            cy={ledGlowCenterY}
            r={COMPONENT.led.width * 0.12}
            fill={`rgba(254, 240, 138, ${0.45 * glowStrength})`}
          />
        </g>
      ) : null}
      <g
        transform={`translate(${COMPONENT.led.width / 2} ${COMPONENT.led.height / 2}) rotate(90) scale(${SYMBOL_SCALE.led}) translate(-25.5 -20.5)`}
      >
        <LEDSymbol width={71} height={51} label={LABEL.led} />
        <rect
          x={SYMBOL_MASK.ledLeft.x}
          y={SYMBOL_MASK.ledLeft.y}
          width={SYMBOL_MASK.ledLeft.width}
          height={SYMBOL_MASK.ledLeft.height}
          fill={STYLE.background}
          stroke="none"
        />
        <rect
          x={SYMBOL_MASK.ledRight.x}
          y={SYMBOL_MASK.ledRight.y}
          width={SYMBOL_MASK.ledRight.width}
          height={SYMBOL_MASK.ledRight.height}
          fill={STYLE.background}
          stroke="none"
        />
      </g>
      <LabelText
        x={COMPONENT.led.width / 2 + 24}
        y={COMPONENT.led.height / 2}
        text={`${LABEL.led} ${isLedOn ? "ON" : "OFF"}`}
      />
      <LabelText
        x={COMPONENT.led.width / 2 + 24}
        y={COMPONENT.led.height / 2 + 16}
        text={`${rLedOhms.toFixed(0)}Ω`}
      />
    </svg>
  );
}

function MosfetBlock({ isPmosOn, vgs }: { isPmosOn: boolean; vgs: number }) {
  return (
    <svg
      x={COMPONENT.mosfet.x}
      y={COMPONENT.mosfet.y}
      width={COMPONENT.mosfet.width}
      height={COMPONENT.mosfet.height}
      viewBox={`0 0 ${COMPONENT.mosfet.width} ${COMPONENT.mosfet.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.mosfet.width / 2} ${COMPONENT.mosfet.height / 2}) scale(${SYMBOL_SCALE.mosfet}) translate(-20.5 -25.5)`}
      >
        <PChannelMosfetSymbol width={61} height={71} label={LABEL.mosfet} />
      </g>
      <LabelText
        x={COMPONENT.mosfet.width * 0.76}
        y={COMPONENT.mosfet.height * 0.28}
        text={`${LABEL.mosfet} ${isPmosOn ? "ON" : "OFF"}`}
      />
      <LabelText
        x={COMPONENT.mosfet.width * 0.76}
        y={COMPONENT.mosfet.height * 0.42}
        text={`VGS ${vgs.toFixed(2)}V`}
      />
    </svg>
  );
}

function resolveCircuitGeometry() {
  const sourcePositiveTerminal = debugTerminalPoint(
    NODE.sourcePositiveTerminal,
    DEBUG_TERMINAL_OFFSET.sourcePositiveTerminal,
  );
  const sourceNegativeTerminal = debugTerminalPoint(
    NODE.sourceNegativeTerminal,
    DEBUG_TERMINAL_OFFSET.sourceNegativeTerminal,
  );
  const gateResistorTop = debugTerminalPoint(
    NODE.gateResistorTop,
    DEBUG_TERMINAL_OFFSET.gateResistorTop,
  );
  const gateResistorBottom = debugTerminalPoint(
    NODE.gateResistorBottom,
    DEBUG_TERMINAL_OFFSET.gateResistorBottom,
  );
  const switchTop = debugTerminalPoint(
    NODE.switchTop,
    DEBUG_TERMINAL_OFFSET.switchTop,
  );
  const switchBottom = debugTerminalPoint(
    NODE.switchBottom,
    DEBUG_TERMINAL_OFFSET.switchBottom,
  );
  const ledResistorTop = debugTerminalPoint(
    NODE.ledResistorTop,
    DEBUG_TERMINAL_OFFSET.ledResistorTop,
  );
  const ledResistorBottom = debugTerminalPoint(
    NODE.ledResistorBottom,
    DEBUG_TERMINAL_OFFSET.ledResistorBottom,
  );
  const ledTop = debugTerminalPoint(NODE.ledTop, DEBUG_TERMINAL_OFFSET.ledTop);
  const ledBottom = debugTerminalPoint(
    NODE.ledBottom,
    DEBUG_TERMINAL_OFFSET.ledBottom,
  );
  const mosfetGate = debugTerminalPoint(
    NODE.mosfetGate,
    DEBUG_TERMINAL_OFFSET.mosfetGate,
  );
  const mosfetDrain = debugTerminalPoint(
    NODE.mosfetDrain,
    DEBUG_TERMINAL_OFFSET.mosfetDrain,
  );
  const mosfetSource = debugTerminalPoint(
    NODE.mosfetSource,
    DEBUG_TERMINAL_OFFSET.mosfetSource,
  );
  const gateNode = {
    x: NODE.gateNode.x,
    y: mosfetGate.y,
  };

  const sourceToPullUpSegments: Point[] = [
    sourcePositiveTerminal,
    { x: sourcePositiveTerminal.x, y: NODE.positiveRailY },
    { x: gateResistorTop.x, y: NODE.positiveRailY },
    gateResistorTop,
  ];
  const pullUpToGateNodeSegments: Point[] = [
    gateResistorBottom,
    { x: gateResistorBottom.x, y: gateNode.y },
    gateNode,
  ];
  const gateNodeToMosfetSegments: Point[] = [gateNode, mosfetGate];
  const gateNodeToSwitchSegments: Point[] = [
    gateNode,
    { x: switchTop.x, y: gateNode.y },
    switchTop,
  ];
  const sourceToLedResistorSegments: Point[] = [
    { x: sourcePositiveTerminal.x, y: NODE.positiveRailY },
    { x: ledResistorTop.x, y: NODE.positiveRailY },
    ledResistorTop,
  ];
  const sourceNegativeSegments: Point[] = [
    sourceNegativeTerminal,
    { x: sourceNegativeTerminal.x, y: NODE.negativeRailY },
  ];
  const negativeRailSegments: Point[] = [
    { x: sourceNegativeTerminal.x, y: NODE.negativeRailY },
    { x: mosfetSource.x, y: NODE.negativeRailY },
    mosfetSource,
  ];
  const switchToNegativeRailSegments: Point[] = [
    switchBottom,
    { x: switchBottom.x, y: NODE.negativeRailY },
    { x: sourceNegativeTerminal.x, y: NODE.negativeRailY },
    sourceNegativeTerminal,
  ];
  const ledResistorToLedSegments: Point[] = [ledResistorBottom, ledTop];
  const ledToMosfetDrainSegments: Point[] = [ledBottom, mosfetDrain];

  return {
    terminals: {
      sourcePositiveTerminal,
      sourceNegativeTerminal,
      gateResistorTop,
      gateResistorBottom,
      switchTop,
      switchBottom,
      ledResistorTop,
      ledResistorBottom,
      ledTop,
      ledBottom,
      mosfetGate,
      mosfetDrain,
      mosfetSource,
      gateNode,
    },
    segments: {
      sourceToPullUpSegments,
      pullUpToGateNodeSegments,
      gateNodeToMosfetSegments,
      gateNodeToSwitchSegments,
      sourceToLedResistorSegments,
      sourceNegativeSegments,
      negativeRailSegments,
      switchToNegativeRailSegments,
      ledResistorToLedSegments,
      ledToMosfetDrainSegments,
    },
  };
}

function WireLayer() {
  const { segments } = resolveCircuitGeometry();

  return (
    <g>
      <WirePath d={pathD(segments.sourceToPullUpSegments)} />
      <WirePath d={pathD(segments.pullUpToGateNodeSegments)} />
      <WirePath d={pathD(segments.gateNodeToMosfetSegments)} />
      <WirePath d={pathD(segments.gateNodeToSwitchSegments)} />
      <WirePath d={pathD(segments.sourceToLedResistorSegments)} />
      <WirePath d={pathD(segments.sourceNegativeSegments)} />
      <WirePath d={pathD(segments.negativeRailSegments)} />
      <WirePath d={pathD(segments.switchToNegativeRailSegments)} />
      <WirePath d={pathD(segments.ledResistorToLedSegments)} />
      <WirePath d={pathD(segments.ledToMosfetDrainSegments)} />
    </g>
  );
}

function CurrentFlowLayer({
  flowMode,
  flowSpeed,
  loadCurrentMa,
  loadPathActive,
}: Pick<
  MosfetPChannelSwitchCircuitProps,
  "flowMode" | "flowSpeed" | "loadCurrentMa" | "loadPathActive"
>) {
  const { segments } = resolveCircuitGeometry();
  const batteryPositiveFlowSegments = [
    segments.sourceToPullUpSegments[0],
    segments.sourceToPullUpSegments[1],
  ];
  const batteryNegativeFlowSegments = [
    ...segments.sourceNegativeSegments,
  ].reverse();

  const { loadPath } = buildPmosFlowPaths(
    {
      gatePath: [],
      loadPath: joinWireSegments(
        batteryPositiveFlowSegments,
        segments.sourceToLedResistorSegments,
        segments.ledResistorToLedSegments,
        segments.ledToMosfetDrainSegments,
        [...segments.negativeRailSegments].reverse(),
        batteryNegativeFlowSegments,
      ),
    },
    flowMode,
  );
  const visuals = buildPmosFlowVisualState({
    flowSpeed,
    loadCurrentMa,
    loadPathActive,
  });
  const loadD = pathD(loadPath);
  const loadFlowColor = flowMode === "electron" ? "#f59e0b" : "#ef4444";

  return (
    <g>
      <CurrentPathHighlight
        d={loadD}
        active={loadPathActive}
        color={loadFlowColor}
        opacity={visuals.loadHighlightOpacity}
      />
      {Array.from({ length: visuals.loadPulseCount }, (_, index) => (
        <CurrentPulse
          key={`load-${index}`}
          d={loadD}
          active={loadPathActive}
          color={loadFlowColor}
          delay={`${(index * visuals.loadStagger).toFixed(2)}s`}
          duration={visuals.loadDuration}
          radius={visuals.loadRadius}
        />
      ))}
    </g>
  );
}

function NodeLayer() {
  if (!SHOW_DEBUG_TERMINAL_DOTS) {
    return null;
  }

  return (
    <g>
      <DebugTerminalDot
        point={NODE.sourcePositiveTerminal}
        label="VDD+"
        offset={DEBUG_TERMINAL_OFFSET.sourcePositiveTerminal}
      />
      <DebugTerminalDot
        point={NODE.sourceNegativeTerminal}
        label="VDD-"
        offset={DEBUG_TERMINAL_OFFSET.sourceNegativeTerminal}
      />
      <DebugTerminalDot
        point={NODE.gateResistorTop}
        label="RPU-T"
        offset={DEBUG_TERMINAL_OFFSET.gateResistorTop}
      />
      <DebugTerminalDot
        point={NODE.gateResistorBottom}
        label="RPU-B"
        offset={DEBUG_TERMINAL_OFFSET.gateResistorBottom}
      />
      <DebugTerminalDot
        point={NODE.switchTop}
        label="SW-T"
        offset={DEBUG_TERMINAL_OFFSET.switchTop}
      />
      <DebugTerminalDot
        point={NODE.switchBottom}
        label="SW-B"
        offset={DEBUG_TERMINAL_OFFSET.switchBottom}
      />
      <DebugTerminalDot
        point={NODE.ledResistorTop}
        label="RLED-T"
        offset={DEBUG_TERMINAL_OFFSET.ledResistorTop}
      />
      <DebugTerminalDot
        point={NODE.ledResistorBottom}
        label="RLED-B"
        offset={DEBUG_TERMINAL_OFFSET.ledResistorBottom}
      />
      <DebugTerminalDot
        point={NODE.ledTop}
        label="LED-T"
        offset={DEBUG_TERMINAL_OFFSET.ledTop}
      />
      <DebugTerminalDot
        point={NODE.ledBottom}
        label="LED-B"
        offset={DEBUG_TERMINAL_OFFSET.ledBottom}
      />
      <DebugTerminalDot
        point={NODE.mosfetGate}
        label="G"
        offset={DEBUG_TERMINAL_OFFSET.mosfetGate}
      />
      <DebugTerminalDot
        point={NODE.mosfetDrain}
        label="D"
        offset={DEBUG_TERMINAL_OFFSET.mosfetDrain}
      />
      <DebugTerminalDot
        point={NODE.mosfetSource}
        label="S"
        offset={DEBUG_TERMINAL_OFFSET.mosfetSource}
      />
    </g>
  );
}

function CircuitLayer({
  batteryVoltage,
  flowMode,
  flowSpeed,
  rLedOhms,
  switchClosed,
  vgs,
  loadCurrentMa,
  loadPathActive,
  isPmosOn,
  isLedOn,
}: Pick<
  MosfetPChannelSwitchCircuitProps,
  | "batteryVoltage"
  | "flowMode"
  | "flowSpeed"
  | "rLedOhms"
  | "switchClosed"
  | "vgs"
  | "loadCurrentMa"
  | "loadPathActive"
  | "isPmosOn"
  | "isLedOn"
>) {
  return (
    <g>
      <SourceBlock batteryVoltage={batteryVoltage} />
      <VerticalResistorBlock
        component={COMPONENT.gateResistor}
        label={LABEL.gateResistor}
        scale={SYMBOL_SCALE.resistor}
      />
      <VerticalResistorBlock
        component={COMPONENT.ledResistor}
        label={LABEL.ledResistor}
        scale={SYMBOL_SCALE.ledResistor}
      />
      <SwitchBlock switchClosed={switchClosed} />
      <LedBlock
        isLedOn={isLedOn}
        rLedOhms={rLedOhms}
        loadCurrentMa={loadCurrentMa}
      />
      <MosfetBlock isPmosOn={isPmosOn} vgs={vgs} />
      <WireLayer />
      <CurrentFlowLayer
        flowMode={flowMode}
        flowSpeed={flowSpeed}
        loadCurrentMa={loadCurrentMa}
        loadPathActive={loadPathActive}
      />
      <NodeLayer />
    </g>
  );
}

export default function MosfetPChannelSwitchCircuit({
  batteryVoltage,
  rpuOhms,
  rLedOhms,
  flowSpeed,
  switchClosed,
  flowMode,
  gateVoltage,
  sourceVoltage,
  drainVoltage,
  vgs,
  loadCurrentMa,
  loadPathActive,
  isPmosOn,
  isLedOn,
}: MosfetPChannelSwitchCircuitProps) {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div
      aria-label={LABEL.workspace}
      style={{
        background: STYLE.background,
        borderRadius: 24,
        border: `1px solid ${STYLE.boardBorder}`,
        padding: 16,
        minHeight: VIEW_BOX.height,
        width: "100%",
      }}
    >
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

        <g transform={canvasTransform}>
          <CircuitLayer
            batteryVoltage={batteryVoltage}
            flowMode={flowMode}
            flowSpeed={flowSpeed}
            rLedOhms={rLedOhms}
            switchClosed={switchClosed}
            vgs={vgs}
            loadCurrentMa={loadCurrentMa}
            loadPathActive={loadPathActive}
            isPmosOn={isPmosOn}
            isLedOn={isLedOn}
          />
          <text x={560} y={650} fill="#0f172a" fontSize="12" fontWeight="700">
            {`Gate ${gateVoltage.toFixed(2)}V | Source ${sourceVoltage.toFixed(
              2,
            )}V | Drain ${drainVoltage.toFixed(2)}V`}
          </text>
          <text x={560} y={670} fill="#475569" fontSize="11" fontWeight="600">
            {`RPU ${rpuOhms.toFixed(0)} Ohm | Flow ${flowSpeed.toFixed(1)}x | ${
              flowMode === "electron" ? "Electron" : "Conventional"
            } | Load ${loadCurrentMa.toFixed(2)}mA`}
          </text>
        </g>
      </svg>
    </div>
  );
}
