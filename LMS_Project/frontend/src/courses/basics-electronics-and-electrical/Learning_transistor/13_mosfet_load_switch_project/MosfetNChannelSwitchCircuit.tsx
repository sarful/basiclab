"use client";

import {
  BackgroundPixelGred,
  BatterySymbol,
  LEDSymbol,
  NChannelMosfetSymbol,
  ResistorSymbol,
  SPSTSwitchSymbol,
} from "@/src/library";

import {
  buildNmosFlowPaths,
  buildNmosFlowVisualState,
  joinWireSegments,
} from "./electronFlowLogic";
import type { NmosCurrentFlowMode } from "./simulationTypes";

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
  switch: SCALE.component,
  gateResistor: SCALE.component,
  ledResistor: SCALE.component,
  led: SCALE.component,
  mosfet: SCALE.component,
} as const;

const BASE_WIRE_WIDTH = 1.6;
const CIRCUIT_WIRE_SCALE = SCALE.wire;
const CIRCUIT_CANVAS_SCALE = SCALE.canvas;
const SHOW_DEBUG_TERMINAL_DOTS = true;

const COMPONENT_OFFSET = {
  source: { x: 0, y: 40 },
  switch: { x: -6, y: -4 },
  gateResistor: { x: 8, y: 0 },
  ledResistor: { x: 18, y: 0 },
  led: { x: 10, y: 0 },
  mosfet: { x: -4, y: 0 },
} as const satisfies Record<string, Offset>;

const WIRE_OFFSET = {
  sourcePositiveDrop: { x: 0, y: 0 },
  positiveRail: { x: 0, y: 0 },
  sourceNegativeDrop: { x: 0, y: 0 },
  negativeRail: { x: 0, y: 0 },
  mosfetSourceReturn: { x: 0, y: 0 },
  sourceToLedResistor: { x: 0, y: 0 },
  ledResistorToLed: { x: 0, y: 0 },
  ledToMosfetDrain: { x: 0, y: 0 },
  positiveRailToSwitch: { x: 0, y: 0 },
  switchToGateNode: { x: 0, y: 0 },
  gateNodeToMosfet: { x: 0, y: 0 },
  gateNodeToGateResistor: { x: 0, y: 0 },
  gateResistorToNegative: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const DEBUG_TERMINAL_OFFSET = {
  sourcePositiveTerminal: { x: 0, y: 10 },
  sourceNegativeTerminal: { x: 0, y: -20 },
  switchTop: { x: 0, y: 0 },
  switchBottom: { x: 0, y: 0 },
  gateResistorTop: { x: -24, y: 25 },
  gateResistorBottom: { x: -25, y: 25 },
  ledResistorTop: { x: -25, y: 25 },
  ledResistorBottom: { x: -25, y: 23 },
  ledTop: { x: -18, y: 20 },
  ledBottom: { x: -18, y: 18 },
  mosfetGate: { x: 25, y: 25 },
  mosfetDrain: { x: 25, y: 25 },
  mosfetSource: { x: 25, y: 25 },
  gateNode: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const LED_GLOW_OFFSET = {
  x: 0,
  y: 0,
} as const satisfies Offset;

const STYLE = {
  background: "#ffffff",
  boardBorder: "#dbe3ef",
  wire: "#111827",
  label: "#0f172a",
  ledGlow: "#f59e0b",
  debugTerminal: "#ef4444",
  debugTerminalStroke: "#ffffff",
} as const;

const LABEL = {
  source: "VDD",
  switch: "SW1",
  gateResistor: "RPD",
  ledResistor: "RLED",
  led: "LED",
  mosfet: "Q1",
  canvas: "MOSFET N channel switch circuit",
  workspace: "MOSFET N channel switch circuit workspace",
} as const;

const BASE_COMPONENT = {
  source: { x: 66, y: 212, width: 112, height: 150 },
  switch: { x: 290, y: 110, width: 72, height: 132 },
  gateResistor: { x: 300, y: 395, width: 72, height: 134 },
  ledResistor: { x: 610, y: 58, width: 72, height: 124 },
  led: { x: 610, y: 188, width: 72, height: 106 },
  mosfet: { x: 535, y: 305, width: 124, height: 170 },
} as const satisfies Record<string, ComponentBox>;

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

type MosfetNChannelSwitchCircuitProps = {
  batteryVoltage: number;
  rpdOhms: number;
  rLedOhms: number;
  flowSpeed: number;
  switchClosed: boolean;
  flowMode: NmosCurrentFlowMode;
  gateVoltage: number;
  sourceVoltage: number;
  drainVoltage: number;
  vgs: number;
  loadCurrentMa: number;
  gatePathActive: boolean;
  loadPathActive: boolean;
  isNmosOn: boolean;
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

function offsetPoint(point: Point, offset: Offset): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function offsetPoints(points: readonly Point[], offset: Offset) {
  return points.map((point) => offsetPoint(point, offset));
}

function debugTerminalPoint(point: Point, offset: Offset) {
  return SHOW_DEBUG_TERMINAL_DOTS ? offsetPoint(point, offset) : point;
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

function buildCircuitGeometry() {
  const component = {
    source: offsetComponent(
      scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
      COMPONENT_OFFSET.source,
    ),
    switch: offsetComponent(
      scaleComponent(BASE_COMPONENT.switch, CIRCUIT_COMPONENT_SCALE.switch),
      COMPONENT_OFFSET.switch,
    ),
    gateResistor: offsetComponent(
      scaleComponent(
        BASE_COMPONENT.gateResistor,
        CIRCUIT_COMPONENT_SCALE.gateResistor,
      ),
      COMPONENT_OFFSET.gateResistor,
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

  const symbolScale = {
    switch:
      Math.min(component.switch.width / 110, component.switch.height / 240) *
      1.08,
    gateResistor:
      Math.min(
        component.gateResistor.width / 41,
        component.gateResistor.height / 71,
      ) * 1.32,
    ledResistor:
      Math.min(
        component.ledResistor.width / 41,
        component.ledResistor.height / 71,
      ) * 1.32,
    led: Math.min(component.led.width / 51, component.led.height / 71) * 1.18,
    mosfet:
      Math.min(component.mosfet.width / 61, component.mosfet.height / 71) * 1.2,
  } as const;

  const sourcePositiveTerminal = pointOnComponent(
    component.source,
    0.5,
    24 / component.source.height,
  );

  const sourceNegativeTerminal = pointOnComponent(
    component.source,
    0.5,
    125 / component.source.height,
  );

  const switchTop = rotate90ScaledPointFromCenter(
    component.switch,
    SYMBOL_POINT.switchLeftTerminal,
    SYMBOL_CENTER.switch,
    symbolScale.switch,
  );

  const switchBottom = rotate90ScaledPointFromCenter(
    component.switch,
    SYMBOL_POINT.switchRightTerminal,
    SYMBOL_CENTER.switch,
    symbolScale.switch,
  );

  const gateResistorTop = rotate90ScaledPointFromCenter(
    component.gateResistor,
    SYMBOL_POINT.resistorLeft,
    SYMBOL_CENTER.resistor,
    symbolScale.gateResistor,
  );

  const gateResistorBottom = rotate90ScaledPointFromCenter(
    component.gateResistor,
    SYMBOL_POINT.resistorRight,
    SYMBOL_CENTER.resistor,
    symbolScale.gateResistor,
  );

  const ledResistorTop = rotate90ScaledPointFromCenter(
    component.ledResistor,
    SYMBOL_POINT.resistorLeft,
    SYMBOL_CENTER.resistor,
    symbolScale.ledResistor,
  );

  const ledResistorBottom = rotate90ScaledPointFromCenter(
    component.ledResistor,
    SYMBOL_POINT.resistorRight,
    SYMBOL_CENTER.resistor,
    symbolScale.ledResistor,
  );

  const ledTop = rotate90ScaledPointFromCenter(
    component.led,
    SYMBOL_POINT.ledAnode,
    SYMBOL_CENTER.led,
    symbolScale.led,
  );

  const ledBottom = rotate90ScaledPointFromCenter(
    component.led,
    SYMBOL_POINT.ledCathode,
    SYMBOL_CENTER.led,
    symbolScale.led,
  );

  const mosfetGate = scalePointFromCenter(
    component.mosfet,
    SYMBOL_POINT.mosfetGate,
    SYMBOL_CENTER.mosfet,
    symbolScale.mosfet,
  );

  const mosfetDrain = scalePointFromCenter(
    component.mosfet,
    SYMBOL_POINT.mosfetDrain,
    SYMBOL_CENTER.mosfet,
    symbolScale.mosfet,
  );

  const mosfetSource = scalePointFromCenter(
    component.mosfet,
    SYMBOL_POINT.mosfetSource,
    SYMBOL_CENTER.mosfet,
    symbolScale.mosfet,
  );

  const node = {
    positiveRailY: 96,
    negativeRailY: 580,
    sourcePositiveTerminal,
    sourceNegativeTerminal,
    switchTop,
    switchBottom,
    gateResistorTop,
    gateResistorBottom,
    ledResistorTop,
    ledResistorBottom,
    ledTop,
    ledBottom,
    mosfetGate,
    mosfetDrain,
    mosfetSource,
    gateNode: {
      x: gateResistorTop.x,
      y: mosfetGate.y,
    },
  } as const;

  const wireBase = {
    width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
    sourcePositiveDrop: [
      node.sourcePositiveTerminal,
      { x: node.sourcePositiveTerminal.x, y: node.positiveRailY },
    ],
    positiveRail: [
      { x: node.sourcePositiveTerminal.x, y: node.positiveRailY },
      { x: node.ledResistorTop.x, y: node.positiveRailY },
    ],
    sourceNegativeDrop: [
      node.sourceNegativeTerminal,
      { x: node.sourceNegativeTerminal.x, y: node.negativeRailY },
    ],
    negativeRail: [
      { x: node.sourceNegativeTerminal.x, y: node.negativeRailY },
      { x: node.mosfetSource.x, y: node.negativeRailY },
    ],
    mosfetSourceReturn: [
      node.mosfetSource,
      { x: node.mosfetSource.x, y: node.negativeRailY },
    ],
    sourceToLedResistor: [
      { x: node.ledResistorTop.x, y: node.positiveRailY },
      node.ledResistorTop,
    ],
    ledResistorToLed: [node.ledResistorBottom, node.ledTop],
    ledToMosfetDrain: [node.ledBottom, node.mosfetDrain],
    positiveRailToSwitch: [
      { x: node.switchTop.x, y: node.positiveRailY },
      node.switchTop,
    ],
    switchToGateNode: [
      node.switchBottom,
      { x: node.switchBottom.x, y: node.gateNode.y },
      node.gateNode,
    ],
    gateNodeToMosfet: [node.gateNode, node.mosfetGate],
    gateNodeToGateResistor: [
      node.gateNode,
      { x: node.gateResistorTop.x, y: node.gateNode.y },
      node.gateResistorTop,
    ],
    gateResistorToNegative: [
      node.gateResistorBottom,
      { x: node.gateResistorBottom.x, y: node.negativeRailY },
    ],
  } as const;

  const wire = {
    width: wireBase.width,
    sourcePositiveDrop: offsetPoints(
      wireBase.sourcePositiveDrop,
      WIRE_OFFSET.sourcePositiveDrop,
    ),
    positiveRail: offsetPoints(wireBase.positiveRail, WIRE_OFFSET.positiveRail),
    sourceNegativeDrop: offsetPoints(
      wireBase.sourceNegativeDrop,
      WIRE_OFFSET.sourceNegativeDrop,
    ),
    negativeRail: offsetPoints(wireBase.negativeRail, WIRE_OFFSET.negativeRail),
    mosfetSourceReturn: offsetPoints(
      wireBase.mosfetSourceReturn,
      WIRE_OFFSET.mosfetSourceReturn,
    ),
    sourceToLedResistor: offsetPoints(
      wireBase.sourceToLedResistor,
      WIRE_OFFSET.sourceToLedResistor,
    ),
    ledResistorToLed: offsetPoints(
      wireBase.ledResistorToLed,
      WIRE_OFFSET.ledResistorToLed,
    ),
    ledToMosfetDrain: offsetPoints(
      wireBase.ledToMosfetDrain,
      WIRE_OFFSET.ledToMosfetDrain,
    ),
    positiveRailToSwitch: offsetPoints(
      wireBase.positiveRailToSwitch,
      WIRE_OFFSET.positiveRailToSwitch,
    ),
    switchToGateNode: offsetPoints(
      wireBase.switchToGateNode,
      WIRE_OFFSET.switchToGateNode,
    ),
    gateNodeToMosfet: offsetPoints(
      wireBase.gateNodeToMosfet,
      WIRE_OFFSET.gateNodeToMosfet,
    ),
    gateNodeToGateResistor: offsetPoints(
      wireBase.gateNodeToGateResistor,
      WIRE_OFFSET.gateNodeToGateResistor,
    ),
    gateResistorToNegative: offsetPoints(
      wireBase.gateResistorToNegative,
      WIRE_OFFSET.gateResistorToNegative,
    ),
  } as const;

  const path = {
    sourcePositiveDrop: pathD(wire.sourcePositiveDrop),
    positiveRail: pathD(wire.positiveRail),
    sourceNegativeDrop: pathD(wire.sourceNegativeDrop),
    negativeRail: pathD(wire.negativeRail),
    mosfetSourceReturn: pathD(wire.mosfetSourceReturn),
    sourceToLedResistor: pathD(wire.sourceToLedResistor),
    ledResistorToLed: pathD(wire.ledResistorToLed),
    ledToMosfetDrain: pathD(wire.ledToMosfetDrain),
    positiveRailToSwitch: pathD(wire.positiveRailToSwitch),
    switchToGateNode: pathD(wire.switchToGateNode),
    gateNodeToMosfet: pathD(wire.gateNodeToMosfet),
    gateNodeToGateResistor: pathD(wire.gateNodeToGateResistor),
    gateResistorToNegative: pathD(wire.gateResistorToNegative),
  } as const;

  return { component, symbolScale, node, wire, path } as const;
}

type CircuitGeometry = ReturnType<typeof buildCircuitGeometry>;

function WirePath({ d, width }: { d: string; width: number }) {
  return (
    <path
      d={d}
      stroke={STYLE.wire}
      strokeWidth={width}
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
  width,
  opacity = 0.18,
}: {
  d: string;
  active: boolean;
  color: string;
  width: number;
  opacity?: number;
}) {
  if (!active) return null;

  return (
    <path
      d={d}
      stroke={color}
      strokeWidth={width + 3}
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
  if (!SHOW_DEBUG_TERMINAL_DOTS) return null;

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

function SourceBlock({
  batteryVoltage,
  component,
}: {
  batteryVoltage: number;
  component: ComponentBox;
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
      <BatterySymbol
        width={component.width}
        height={component.height}
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

function SwitchBlock({
  switchClosed,
  component,
  scale,
}: {
  switchClosed: boolean;
  component: ComponentBox;
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
        transform={`translate(${component.width / 2} ${component.height / 2}) rotate(90) scale(${scale}) translate(-120 -55)`}
      >
        <SPSTSwitchSymbol
          width={240}
          height={110}
          label={LABEL.switch}
          switchClosed={switchClosed}
        />
      </g>
      <LabelText x={component.width / 2 + 14} y={32} text={LABEL.switch} />
    </svg>
  );
}

function LedBlock({
  isLedOn,
  rLedOhms,
  loadCurrentMa,
  component,
  scale,
}: {
  isLedOn: boolean;
  rLedOhms: number;
  loadCurrentMa: number;
  component: ComponentBox;
  scale: number;
}) {
  const glowStrength = Math.min(Math.max(loadCurrentMa / 4, 0), 1);
  const ledGlowCenterX = component.width * 0.46 + LED_GLOW_OFFSET.x - 15;
  const ledGlowCenterY = component.height * 0.5 + LED_GLOW_OFFSET.y + 15;

  return (
    <svg
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      viewBox={`0 0 ${component.width} ${component.height}`}
      overflow="visible"
    >
      {isLedOn ? (
        <g>
          <circle
            cx={ledGlowCenterX}
            cy={ledGlowCenterY}
            r={component.width * 0.34}
            fill={`rgba(245, 158, 11, ${0.14 * glowStrength})`}
          />
          <circle
            cx={ledGlowCenterX}
            cy={ledGlowCenterY}
            r={component.width * 0.22}
            fill={`rgba(250, 204, 21, ${0.22 * glowStrength})`}
          />
          <circle
            cx={ledGlowCenterX}
            cy={ledGlowCenterY}
            r={component.width * 0.12}
            fill={`rgba(254, 240, 138, ${0.45 * glowStrength})`}
          />
        </g>
      ) : null}
      <g
        transform={`translate(${component.width / 2} ${component.height / 2}) rotate(90) scale(${scale}) translate(-25.5 -20.5)`}
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
        x={component.width / 2 + 24}
        y={component.height / 2}
        text={`${LABEL.led} ${isLedOn ? "ON" : "OFF"}`}
      />
      <LabelText
        x={component.width / 2 + 24}
        y={component.height / 2 + 16}
        text={`${rLedOhms.toFixed(0)} Ohm`}
      />
    </svg>
  );
}

function MosfetBlock({
  isNmosOn,
  vgs,
  component,
  scale,
}: {
  isNmosOn: boolean;
  vgs: number;
  component: ComponentBox;
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
        transform={`translate(${component.width / 2} ${component.height / 2}) scale(${scale}) translate(-20.5 -25.5)`}
      >
        <NChannelMosfetSymbol width={61} height={71} label={LABEL.mosfet} />
      </g>
      <LabelText
        x={component.width * 0.76}
        y={component.height * 0.28}
        text={`${LABEL.mosfet} ${isNmosOn ? "ON" : "OFF"}`}
      />
      <LabelText
        x={component.width * 0.76}
        y={component.height * 0.42}
        text={`VGS ${vgs.toFixed(2)}V`}
      />
    </svg>
  );
}

function resolveCircuitGeometry(geometry: CircuitGeometry) {
  const sourcePositiveTerminal = debugTerminalPoint(
    geometry.node.sourcePositiveTerminal,
    DEBUG_TERMINAL_OFFSET.sourcePositiveTerminal,
  );
  const sourceNegativeTerminal = debugTerminalPoint(
    geometry.node.sourceNegativeTerminal,
    DEBUG_TERMINAL_OFFSET.sourceNegativeTerminal,
  );
  const switchTop = debugTerminalPoint(
    geometry.node.switchTop,
    DEBUG_TERMINAL_OFFSET.switchTop,
  );
  const switchBottom = debugTerminalPoint(
    geometry.node.switchBottom,
    DEBUG_TERMINAL_OFFSET.switchBottom,
  );
  const gateResistorTop = debugTerminalPoint(
    geometry.node.gateResistorTop,
    DEBUG_TERMINAL_OFFSET.gateResistorTop,
  );
  const gateResistorBottom = debugTerminalPoint(
    geometry.node.gateResistorBottom,
    DEBUG_TERMINAL_OFFSET.gateResistorBottom,
  );
  const ledResistorTop = debugTerminalPoint(
    geometry.node.ledResistorTop,
    DEBUG_TERMINAL_OFFSET.ledResistorTop,
  );
  const ledResistorBottom = debugTerminalPoint(
    geometry.node.ledResistorBottom,
    DEBUG_TERMINAL_OFFSET.ledResistorBottom,
  );
  const ledTop = debugTerminalPoint(
    geometry.node.ledTop,
    DEBUG_TERMINAL_OFFSET.ledTop,
  );
  const ledBottom = debugTerminalPoint(
    geometry.node.ledBottom,
    DEBUG_TERMINAL_OFFSET.ledBottom,
  );
  const mosfetGate = debugTerminalPoint(
    geometry.node.mosfetGate,
    DEBUG_TERMINAL_OFFSET.mosfetGate,
  );
  const mosfetDrain = debugTerminalPoint(
    geometry.node.mosfetDrain,
    DEBUG_TERMINAL_OFFSET.mosfetDrain,
  );
  const mosfetSource = debugTerminalPoint(
    geometry.node.mosfetSource,
    DEBUG_TERMINAL_OFFSET.mosfetSource,
  );
  const gateNode = {
    x: gateResistorBottom.x,
    y: mosfetGate.y,
  };

  const sourcePositiveDropSegments: Point[] = [
    sourcePositiveTerminal,
    { x: sourcePositiveTerminal.x, y: geometry.node.positiveRailY },
  ];
  const positiveRailSegments: Point[] = [
    { x: sourcePositiveTerminal.x, y: geometry.node.positiveRailY },
    { x: ledResistorTop.x, y: geometry.node.positiveRailY },
  ];
  const sourceNegativeDropSegments: Point[] = [
    sourceNegativeTerminal,
    { x: sourceNegativeTerminal.x, y: geometry.node.negativeRailY },
  ];
  const negativeRailSegments: Point[] = [
    { x: sourceNegativeTerminal.x, y: geometry.node.negativeRailY },
    { x: mosfetSource.x, y: geometry.node.negativeRailY },
  ];
  const mosfetSourceReturnSegments: Point[] = [
    mosfetSource,
    { x: mosfetSource.x, y: geometry.node.negativeRailY },
  ];
  const sourceToLedResistorSegments: Point[] = [
    { x: ledResistorTop.x, y: geometry.node.positiveRailY },
    ledResistorTop,
  ];
  const ledResistorToLedSegments: Point[] = [ledResistorBottom, ledTop];
  const ledToMosfetDrainSegments: Point[] = [ledBottom, mosfetDrain];
  const positiveRailToSwitchSegments: Point[] = [
    { x: switchTop.x, y: geometry.node.positiveRailY },
    switchTop,
  ];
  const switchToGateNodeSegments: Point[] = [
    switchBottom,
    { x: switchBottom.x, y: gateNode.y },
    gateNode,
  ];
  const gateNodeToMosfetSegments: Point[] = [gateNode, mosfetGate];
  const gateNodeToGateResistorSegments: Point[] = [
    gateNode,
    { x: gateResistorTop.x, y: gateNode.y },
    gateResistorTop,
  ];
  const gateResistorToNegativeSegments: Point[] = [
    gateResistorBottom,
    { x: gateResistorBottom.x, y: geometry.node.negativeRailY },
  ];

  return {
    terminals: {
      sourcePositiveTerminal,
      sourceNegativeTerminal,
      switchTop,
      switchBottom,
      gateResistorTop,
      gateResistorBottom,
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
      sourcePositiveDropSegments,
      positiveRailSegments,
      sourceNegativeDropSegments,
      negativeRailSegments,
      mosfetSourceReturnSegments,
      sourceToLedResistorSegments,
      ledResistorToLedSegments,
      ledToMosfetDrainSegments,
      positiveRailToSwitchSegments,
      switchToGateNodeSegments,
      gateNodeToMosfetSegments,
      gateNodeToGateResistorSegments,
      gateResistorToNegativeSegments,
    },
  };
}

function WireLayer({ geometry }: { geometry: CircuitGeometry }) {
  const { segments } = resolveCircuitGeometry(geometry);

  return (
    <g>
      <WirePath
        d={pathD(segments.sourcePositiveDropSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.positiveRailSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.sourceNegativeDropSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.negativeRailSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.mosfetSourceReturnSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.sourceToLedResistorSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.ledResistorToLedSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.ledToMosfetDrainSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.positiveRailToSwitchSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.switchToGateNodeSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.gateNodeToMosfetSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.gateNodeToGateResistorSegments)}
        width={geometry.wire.width}
      />
      <WirePath
        d={pathD(segments.gateResistorToNegativeSegments)}
        width={geometry.wire.width}
      />
    </g>
  );
}

function NodeLayer({ node }: { node: CircuitGeometry["node"] }) {
  if (!SHOW_DEBUG_TERMINAL_DOTS) return null;

  return (
    <g>
      <DebugTerminalDot
        point={node.sourcePositiveTerminal}
        label="VDD+"
        offset={DEBUG_TERMINAL_OFFSET.sourcePositiveTerminal}
      />
      <DebugTerminalDot
        point={node.sourceNegativeTerminal}
        label="VDD-"
        offset={DEBUG_TERMINAL_OFFSET.sourceNegativeTerminal}
      />
      <DebugTerminalDot
        point={node.switchTop}
        label="SW-T"
        offset={DEBUG_TERMINAL_OFFSET.switchTop}
      />
      <DebugTerminalDot
        point={node.switchBottom}
        label="SW-B"
        offset={DEBUG_TERMINAL_OFFSET.switchBottom}
      />
      <DebugTerminalDot
        point={node.gateResistorTop}
        label="RPD-T"
        offset={DEBUG_TERMINAL_OFFSET.gateResistorTop}
      />
      <DebugTerminalDot
        point={node.gateResistorBottom}
        label="RPD-B"
        offset={DEBUG_TERMINAL_OFFSET.gateResistorBottom}
      />
      <DebugTerminalDot
        point={node.ledResistorTop}
        label="RLED-T"
        offset={DEBUG_TERMINAL_OFFSET.ledResistorTop}
      />
      <DebugTerminalDot
        point={node.ledResistorBottom}
        label="RLED-B"
        offset={DEBUG_TERMINAL_OFFSET.ledResistorBottom}
      />
      <DebugTerminalDot
        point={node.ledTop}
        label="LED-T"
        offset={DEBUG_TERMINAL_OFFSET.ledTop}
      />
      <DebugTerminalDot
        point={node.ledBottom}
        label="LED-B"
        offset={DEBUG_TERMINAL_OFFSET.ledBottom}
      />
      <DebugTerminalDot
        point={node.mosfetGate}
        label="G"
        offset={DEBUG_TERMINAL_OFFSET.mosfetGate}
      />
      <DebugTerminalDot
        point={node.mosfetDrain}
        label="D"
        offset={DEBUG_TERMINAL_OFFSET.mosfetDrain}
      />
      <DebugTerminalDot
        point={node.mosfetSource}
        label="S"
        offset={DEBUG_TERMINAL_OFFSET.mosfetSource}
      />
    </g>
  );
}

function CurrentFlowLayer({
  flowMode,
  flowSpeed,
  loadCurrentMa,
  loadPathActive,
  geometry,
}: Pick<
  MosfetNChannelSwitchCircuitProps,
  "flowMode" | "flowSpeed" | "loadCurrentMa" | "loadPathActive"
> & { geometry: CircuitGeometry }) {
  const { segments } = resolveCircuitGeometry(geometry);
  const { loadPath } = buildNmosFlowPaths(
    {
      loadPath: joinWireSegments(
        segments.sourcePositiveDropSegments,
        segments.positiveRailSegments,
        segments.sourceToLedResistorSegments,
        segments.ledResistorToLedSegments,
        segments.ledToMosfetDrainSegments,
        segments.mosfetSourceReturnSegments,
        [...segments.negativeRailSegments].reverse(),
        [...segments.sourceNegativeDropSegments].reverse(),
      ),
    },
    flowMode,
  );

  const visuals = buildNmosFlowVisualState({
    flowSpeed,
    loadCurrentMa,
    loadPathActive,
  });

  const loadPathData = pathD(loadPath);
  const loadFlowColor = flowMode === "electron" ? "#f59e0b" : "#ef4444";

  return (
    <g>
      <CurrentPathHighlight
        d={loadPathData}
        active={loadPathActive}
        color={loadFlowColor}
        width={geometry.wire.width}
        opacity={visuals.loadHighlightOpacity}
      />
      {Array.from({ length: visuals.loadPulseCount }, (_, index) => (
        <CurrentPulse
          key={`load-${index}`}
          d={loadPathData}
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

function CircuitLayer({
  batteryVoltage,
  flowMode,
  flowSpeed,
  rpdOhms,
  rLedOhms,
  switchClosed,
  vgs,
  loadCurrentMa,
  loadPathActive,
  isNmosOn,
  isLedOn,
}: Pick<
  MosfetNChannelSwitchCircuitProps,
  | "batteryVoltage"
  | "flowMode"
  | "flowSpeed"
  | "rpdOhms"
  | "rLedOhms"
  | "switchClosed"
  | "vgs"
  | "loadCurrentMa"
  | "loadPathActive"
  | "isNmosOn"
  | "isLedOn"
>) {
  const geometry = buildCircuitGeometry();

  return (
    <g>
      <SourceBlock
        batteryVoltage={batteryVoltage}
        component={geometry.component.source}
      />
      <SwitchBlock
        switchClosed={switchClosed}
        component={geometry.component.switch}
        scale={geometry.symbolScale.switch}
      />
      <VerticalResistorBlock
        component={geometry.component.gateResistor}
        label={LABEL.gateResistor}
        scale={geometry.symbolScale.gateResistor}
      />
      <VerticalResistorBlock
        component={geometry.component.ledResistor}
        label={LABEL.ledResistor}
        scale={geometry.symbolScale.ledResistor}
      />
      <LedBlock
        isLedOn={isLedOn}
        rLedOhms={rLedOhms}
        loadCurrentMa={loadCurrentMa}
        component={geometry.component.led}
        scale={geometry.symbolScale.led}
      />
      <MosfetBlock
        isNmosOn={isNmosOn}
        vgs={vgs}
        component={geometry.component.mosfet}
        scale={geometry.symbolScale.mosfet}
      />
      <WireLayer geometry={geometry} />
      <CurrentFlowLayer
        flowMode={flowMode}
        flowSpeed={flowSpeed}
        loadCurrentMa={loadCurrentMa}
        loadPathActive={loadPathActive}
        geometry={geometry}
      />
      <NodeLayer node={geometry.node} />
      <LabelText
        x={320}
        y={636}
        text={`Gate ${switchClosed ? "HIGH" : "LOW"} | RPD ${rpdOhms.toFixed(0)} Ohm | Flow ${flowSpeed.toFixed(1)}x`}
        anchor="middle"
      />
    </g>
  );
}

export default function MosfetNChannelSwitchCircuit({
  batteryVoltage,
  rpdOhms,
  rLedOhms,
  flowSpeed,
  switchClosed,
  flowMode,
  gateVoltage,
  sourceVoltage,
  drainVoltage,
  vgs,
  loadCurrentMa,
  gatePathActive: _gatePathActive,
  loadPathActive,
  isNmosOn,
  isLedOn,
}: MosfetNChannelSwitchCircuitProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            NMOS Circuit View
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-900">
            MOSFET N Channel Switch Circuit
          </h3>
        </div>
        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${
            isNmosOn
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {isNmosOn ? "Load Active" : "Load Idle"}
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

            <CircuitLayer
              batteryVoltage={batteryVoltage}
              flowMode={flowMode}
              flowSpeed={flowSpeed}
              rpdOhms={rpdOhms}
              rLedOhms={rLedOhms}
              switchClosed={switchClosed}
              vgs={vgs}
              loadCurrentMa={loadCurrentMa}
              loadPathActive={loadPathActive}
              isNmosOn={isNmosOn}
              isLedOn={isLedOn}
            />

            <LabelText
              x={VIEW_BOX.width - 18}
              y={VIEW_BOX.height - 22}
              text={`Gate ${gateVoltage.toFixed(2)}V | Source ${sourceVoltage.toFixed(2)}V | Drain ${drainVoltage.toFixed(2)}V | Load ${loadCurrentMa.toFixed(2)}mA`}
              anchor="end"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
