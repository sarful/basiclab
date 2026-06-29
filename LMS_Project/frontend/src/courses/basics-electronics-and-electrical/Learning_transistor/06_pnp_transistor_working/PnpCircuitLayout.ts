"use client";

/* =========================================================
   TYPES
========================================================= */

export type Point = { x: number; y: number };

export type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

/* =========================================================
   SCALE CONTROLS
========================================================= */

export const CIRCUIT_COMPONENT_SCALE = 1;
export const BASE_WIRE_WIDTH = 1.7;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
} as const;

/* =========================================================
   VIEWBOX / CANVAS
========================================================= */

const BASE_LAYOUT = {
  width: 820,
  height: 720,
} as const;

export const VIEW_BOX = {
  x: 0,
  y: 0,
  width: BASE_LAYOUT.width * SCALE.canvas,
  height: BASE_LAYOUT.height * SCALE.canvas,
} as const;

export const VIEW_BOX_VALUE = `${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`;

/* =========================================================
   BASE SVG STYLE
========================================================= */

export const BASE_COMPONENT = {
  stroke: "#111827",
  strokeWidth: BASE_WIRE_WIDTH * SCALE.wire,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
} as const;

export const STYLE = {
  background: "#ffffff",
  boardBorder: "#dbe3ef",
  wire: "#111827",
  text: "#111827",
  node: "#111827",
  vcc: "#dc2626",
  ground: "#0f172a",
  basePulse: "#2563eb",
  loadPulse: "#f97316",
} as const;

/* =========================================================
   HELPERS
========================================================= */

export function clampValue(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function scaleComponentOffset(value: number) {
  return value * SCALE.component;
}

function scaleComponent(component: ComponentBox): ComponentBox {
  return {
    ...component,
    width: component.width * SCALE.component,
    height: component.height * SCALE.component,
  };
}

function pointOnComponent(
  component: ComponentBox,
  xOffset: number,
  yOffset: number,
): Point {
  return {
    x: component.x + scaleComponentOffset(xOffset),
    y: component.y + scaleComponentOffset(yOffset),
  };
}

function placeNearComponent(
  component: ComponentBox,
  xOffset = 0,
  yOffset = 0,
): Point {
  return {
    x: component.x + scaleComponentOffset(xOffset),
    y: component.y + scaleComponentOffset(yOffset),
  };
}

export function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

export function reversePath(points: readonly Point[]) {
  return [...points].reverse();
}

/* =========================================================
   ALIGNMENT CONTROL — EDIT HERE ONLY
========================================================= */

const ALIGN = {
  rail: {
    positiveY: 112,
    groundY: 590,
  },

  source: {
    x: 66,
    y: 220,
    width: 116,
    height: 156,
    rotate: 0,
    positiveTerminalX: 44,
    positiveTerminalY: 38,
    negativeTerminalX: 44,
    negativeTerminalY: 106,
    railStubX: 44,
  },

  pullUpResistor: {
    x: 340,
    y: 100,
    width: 150,
    height: 120,
    rotate: 90,
    terminal1X: 0,
    terminal1Y: 102,
    terminal2X: 0,
    terminal2Y: 162,
    labelNameX: 26,
    labelNameY: 62,
    labelValueX: 26,
    labelValueY: 86,
  },

  baseResistor: {
    x: 340,
    y: 290,
    width: 150,
    height: 120,
    rotate: 90,
    terminal1X: 0,
    terminal1Y: 102,
    terminal2X: 0,
    terminal2Y: 162,
    labelNameX: 28,
    labelNameY: 62,
    labelValueX: 28,
    labelValueY: 86,
  },

  button: {
    x: 360,
    y: 430,
    width: 150,
    height: 120,
    rotate: 90,
    terminal1X: 0,
    terminal1Y: 104,
    terminal2X: -21,
    terminal2Y: 100,
    baseWireGapY: 40,
  },

  led: {
    x: 678,
    y: 270,
    width: 130,
    height: 110,
    rotate: 90,
    topTerminalXFromRled: 0,
    topTerminalYFromLed: -30,
    bottomTerminalXFromRled: 0,
    bottomTerminalYFromLed: 82,
  },

  rLed: {
    x: 620,
    y: 410,
    width: 170,
    height: 130,
    rotate: 90,
    terminal1X: 0,
    terminal1Y: 110,
    terminal2X: 0,
    terminal2Y: 100,
    groundJoinXOffset: 0,
    groundJoinY: 590,
    labelNameX: 34,
    labelNameY: 64,
    labelValueX: 34,
    labelValueY: 88,
  },

  transistor: {
    x: 510,
    y: 215,
    width: 190,
    height: 210,
    rotate: 0,
    collectorX: 107,
    collectorY: 24,
    baseX: 34,
    baseY: 104,
    emitterX: 108,
    emitterY: 170,
    collectorChannelX: 110,
    collectorChannelY: 72,
    baseJunctionX: 82,
    baseJunctionY: 112,
    emitterChannelX: 110,
    emitterChannelY: 146,
  },

  // Emitter to LED anode wire control
  emitterToLedWire: {
    startOffsetX: 1,
    startOffsetY: 50,
    endOffsetX: 0,
    endOffsetY: 150,
    middleOffsetX: 0,
    middleOffsetY: 0,
  },

  label: {
    sourceVoltageX: 18,
    sourceVoltageY: 16,
    statusX: 58,
    statusY: 54,
    modeX: 230,
    modeY: 54,
    valuesX: 506,
    valuesY: 54,
    currentX: 58,
    currentY: 640,
  },
} as const;

/* =========================================================
   COMPONENT PLACEMENT
========================================================= */

const COMPONENT_LAYOUT = {
  source: {
    x: ALIGN.source.x,
    y: ALIGN.source.y,
    width: ALIGN.source.width,
    height: ALIGN.source.height,
    rotate: ALIGN.source.rotate,
  },

  pullUpResistor: {
    x: ALIGN.pullUpResistor.x,
    y: ALIGN.pullUpResistor.y,
    width: ALIGN.pullUpResistor.width,
    height: ALIGN.pullUpResistor.height,
    rotate: ALIGN.pullUpResistor.rotate,
  },

  baseResistor: {
    x: ALIGN.baseResistor.x,
    y: ALIGN.baseResistor.y,
    width: ALIGN.baseResistor.width,
    height: ALIGN.baseResistor.height,
    rotate: ALIGN.baseResistor.rotate,
  },

  button: {
    x: ALIGN.button.x,
    y: ALIGN.button.y,
    width: ALIGN.button.width,
    height: ALIGN.button.height,
    rotate: ALIGN.button.rotate,
  },

  led: {
    x: ALIGN.led.x,
    y: ALIGN.led.y,
    width: ALIGN.led.width,
    height: ALIGN.led.height,
    rotate: ALIGN.led.rotate,
  },

  ledResistor: {
    x: ALIGN.rLed.x,
    y: ALIGN.rLed.y,
    width: ALIGN.rLed.width,
    height: ALIGN.rLed.height,
    rotate: ALIGN.rLed.rotate,
  },

  transistor: {
    x: ALIGN.transistor.x,
    y: ALIGN.transistor.y,
    width: ALIGN.transistor.width,
    height: ALIGN.transistor.height,
    rotate: ALIGN.transistor.rotate,
  },
} as const;

export const COMPONENT = {
  source: scaleComponent(COMPONENT_LAYOUT.source),
  pullUpResistor: scaleComponent(COMPONENT_LAYOUT.pullUpResistor),
  baseResistor: scaleComponent(COMPONENT_LAYOUT.baseResistor),
  button: scaleComponent(COMPONENT_LAYOUT.button),
  led: scaleComponent(COMPONENT_LAYOUT.led),
  ledResistor: scaleComponent(COMPONENT_LAYOUT.ledResistor),
  transistor: scaleComponent(COMPONENT_LAYOUT.transistor),
} as const;

/* =========================================================
   PRE-CALCULATED POINTS
========================================================= */

const BUTTON_TERMINAL_1_POINT = pointOnComponent(
  COMPONENT.button,
  ALIGN.button.terminal1X,
  ALIGN.button.terminal1Y,
);

const BUTTON_TERMINAL_2_POINT = pointOnComponent(
  COMPONENT.button,
  ALIGN.button.terminal2X,
  ALIGN.button.terminal2Y,
);

const R_LED_TERMINAL_1_POINT = pointOnComponent(
  COMPONENT.ledResistor,
  ALIGN.rLed.terminal1X,
  ALIGN.rLed.terminal1Y,
);

const R_LED_TERMINAL_2_POINT = pointOnComponent(
  COMPONENT.ledResistor,
  ALIGN.rLed.terminal2X,
  ALIGN.rLed.terminal2Y,
);

/* =========================================================
   CIRCUIT NODES
========================================================= */

export const NODE = {
  positiveRailY: ALIGN.rail.positiveY,
  negativeRailY: ALIGN.rail.groundY,

  sourcePositiveTerminal: pointOnComponent(
    COMPONENT.source,
    ALIGN.source.positiveTerminalX,
    ALIGN.source.positiveTerminalY,
  ),

  sourceNegativeTerminal: pointOnComponent(
    COMPONENT.source,
    ALIGN.source.negativeTerminalX,
    ALIGN.source.negativeTerminalY,
  ),

  sourcePositiveRailStub: {
    x: pointOnComponent(COMPONENT.source, ALIGN.source.railStubX, 0).x,
    y: ALIGN.rail.positiveY,
  },

  transistorCollector: pointOnComponent(
    COMPONENT.transistor,
    ALIGN.transistor.collectorX,
    ALIGN.transistor.collectorY,
  ),

  transistorBase: pointOnComponent(
    COMPONENT.transistor,
    ALIGN.transistor.baseX,
    ALIGN.transistor.baseY,
  ),

  transistorEmitter: pointOnComponent(
    COMPONENT.transistor,
    ALIGN.transistor.emitterX,
    ALIGN.transistor.emitterY,
  ),

  collectorChannelPoint: pointOnComponent(
    COMPONENT.transistor,
    ALIGN.transistor.collectorChannelX,
    ALIGN.transistor.collectorChannelY,
  ),

  baseJunctionPoint: pointOnComponent(
    COMPONENT.transistor,
    ALIGN.transistor.baseJunctionX,
    ALIGN.transistor.baseJunctionY,
  ),

  emitterChannelPoint: pointOnComponent(
    COMPONENT.transistor,
    ALIGN.transistor.emitterChannelX,
    ALIGN.transistor.emitterChannelY,
  ),

  pullUpTerminal1: pointOnComponent(
    COMPONENT.pullUpResistor,
    ALIGN.pullUpResistor.terminal1X,
    ALIGN.pullUpResistor.terminal1Y,
  ),

  pullUpTerminal2: pointOnComponent(
    COMPONENT.pullUpResistor,
    ALIGN.pullUpResistor.terminal2X,
    ALIGN.pullUpResistor.terminal2Y,
  ),

  baseResistorTerminal1: pointOnComponent(
    COMPONENT.baseResistor,
    ALIGN.baseResistor.terminal1X,
    ALIGN.baseResistor.terminal1Y,
  ),

  baseResistorTerminal2: pointOnComponent(
    COMPONENT.baseResistor,
    ALIGN.baseResistor.terminal2X,
    ALIGN.baseResistor.terminal2Y,
  ),

  buttonTerminal1: BUTTON_TERMINAL_1_POINT,
  buttonTerminal2: BUTTON_TERMINAL_2_POINT,

  baseNode: {
    x: pointOnComponent(COMPONENT.baseResistor, 0, 0).x,
    y: pointOnComponent(COMPONENT.transistor, 0, ALIGN.transistor.baseY).y,
  },

  ledTopTerminal: {
    x:
      COMPONENT.ledResistor.x +
      scaleComponentOffset(ALIGN.led.topTerminalXFromRled),
    y: COMPONENT.led.y + scaleComponentOffset(ALIGN.led.topTerminalYFromLed),
  },

  ledBottomTerminal: {
    x:
      COMPONENT.ledResistor.x +
      scaleComponentOffset(ALIGN.led.bottomTerminalXFromRled),
    y: COMPONENT.led.y + scaleComponentOffset(ALIGN.led.bottomTerminalYFromLed),
  },

  ledResistorTerminal1: R_LED_TERMINAL_1_POINT,
  ledResistorTerminal2: R_LED_TERMINAL_2_POINT,

  groundFromSource: {
    x: pointOnComponent(COMPONENT.source, ALIGN.source.railStubX, 0).x,
    y: ALIGN.rail.groundY,
  },

  groundSwitchJoin: {
    x: BUTTON_TERMINAL_2_POINT.x,
    y: ALIGN.rail.groundY,
  },

  groundLoadJoin: {
    x:
      COMPONENT.ledResistor.x +
      scaleComponentOffset(ALIGN.rLed.groundJoinXOffset),
    y: ALIGN.rLed.groundJoinY,
  },
} as const;

/* =========================================================
   EXTRA WIRE POINTS
========================================================= */

const EMITTER_TO_LED_START = {
  x:
    NODE.transistorEmitter.x +
    scaleComponentOffset(ALIGN.emitterToLedWire.startOffsetX),
  y:
    NODE.transistorEmitter.y +
    scaleComponentOffset(ALIGN.emitterToLedWire.startOffsetY),
};

const EMITTER_TO_LED_END = {
  x:
    NODE.ledTopTerminal.x +
    scaleComponentOffset(ALIGN.emitterToLedWire.endOffsetX),
  y:
    NODE.ledTopTerminal.y +
    scaleComponentOffset(ALIGN.emitterToLedWire.endOffsetY),
};

const EMITTER_TO_LED_MIDDLE = {
  x:
    EMITTER_TO_LED_START.x +
    scaleComponentOffset(ALIGN.emitterToLedWire.middleOffsetX),
  y:
    EMITTER_TO_LED_END.y +
    scaleComponentOffset(ALIGN.emitterToLedWire.middleOffsetY),
};

/* =========================================================
   WIRES
========================================================= */

export const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.wire,

  sourcePositiveDrop: [
    NODE.sourcePositiveTerminal,
    NODE.sourcePositiveRailStub,
  ],

  positiveRailMain: [
    NODE.sourcePositiveRailStub,
    { x: NODE.pullUpTerminal1.x, y: NODE.positiveRailY },
    { x: NODE.transistorEmitter.x, y: NODE.positiveRailY },
  ],

  emitterToRail: [
    NODE.transistorEmitter,
    { x: NODE.transistorEmitter.x, y: NODE.positiveRailY },
  ],

  pullUpFeed: [
    NODE.pullUpTerminal1,
    { x: NODE.pullUpTerminal1.x, y: NODE.positiveRailY },
  ],

  pullUpToBaseNode: [
    NODE.pullUpTerminal2,
    { x: NODE.pullUpTerminal2.x, y: NODE.baseNode.y },
    NODE.baseNode,
  ],

  baseNodeToBase: [NODE.baseNode, NODE.transistorBase],

  baseNodeToBaseResistor: [NODE.baseNode, NODE.baseResistorTerminal1],

  baseResistorToSwitch: [
    NODE.baseResistorTerminal2,
    {
      x: NODE.baseResistorTerminal2.x,
      y: NODE.buttonTerminal1.y - ALIGN.button.baseWireGapY,
    },
  ],

  switchToGround: [NODE.buttonTerminal2, NODE.groundSwitchJoin],

  /* PNP load wire: Emitter to LED anode */
  emitterToLed: [
    EMITTER_TO_LED_START,
    EMITTER_TO_LED_MIDDLE,
    EMITTER_TO_LED_END,
  ],

  /* Kept for compatibility if old renderer still calls collectorToLed */
  collectorToLed: [
    EMITTER_TO_LED_START,
    EMITTER_TO_LED_MIDDLE,
    EMITTER_TO_LED_END,
  ],

  ledToResistor: [NODE.ledBottomTerminal, NODE.ledResistorTerminal1],

  resistorToGround: [NODE.ledResistorTerminal2, NODE.groundLoadJoin],

  sourceNegativeDrop: [NODE.sourceNegativeTerminal, NODE.groundFromSource],

  groundRail: [
    NODE.groundFromSource,
    NODE.groundSwitchJoin,
    NODE.groundLoadJoin,
  ],
} as const;

/* =========================================================
   VISIBLE / HIDDEN JUNCTION NODES
========================================================= */

export const JUNCTION_NODE = {
  sourceGround: NODE.groundFromSource,
  switchGround: NODE.groundSwitchJoin,
  loadGround: NODE.groundLoadJoin,
  sourcePositive: NODE.sourcePositiveRailStub,
} as const;

export const HIDDEN_NODE = {} as const;

/* =========================================================
   CURRENT FLOW PATHS
========================================================= */

export const PATH = {
  baseCurrent: [
    NODE.sourcePositiveTerminal,
    NODE.sourcePositiveRailStub,
    { x: NODE.transistorEmitter.x, y: NODE.positiveRailY },
    NODE.transistorEmitter,
    NODE.baseJunctionPoint,
    NODE.transistorBase,
    NODE.baseNode,
    ...WIRE.baseNodeToBaseResistor.slice(1),
    ...WIRE.baseResistorToSwitch.slice(1),
    NODE.buttonTerminal2,
    NODE.groundSwitchJoin,
    NODE.groundFromSource,
    NODE.sourceNegativeTerminal,
  ],

  loadCurrent: [
    NODE.sourcePositiveTerminal,
    NODE.sourcePositiveRailStub,
    { x: NODE.transistorEmitter.x, y: NODE.positiveRailY },
    NODE.transistorEmitter,
    ...WIRE.emitterToLed.slice(1),
    ...WIRE.ledToResistor.slice(1),
    ...WIRE.resistorToGround.slice(1),
    NODE.groundFromSource,
    NODE.sourceNegativeTerminal,
  ],
} as const;

/* =========================================================
   LABEL POSITIONS
========================================================= */

export const LABEL = {
  sourceVoltage: placeNearComponent(
    COMPONENT.source,
    ALIGN.label.sourceVoltageX,
    ALIGN.label.sourceVoltageY,
  ),

  rbName: placeNearComponent(
    COMPONENT.baseResistor,
    ALIGN.baseResistor.labelNameX,
    ALIGN.baseResistor.labelNameY,
  ),

  rbValue: placeNearComponent(
    COMPONENT.baseResistor,
    ALIGN.baseResistor.labelValueX,
    ALIGN.baseResistor.labelValueY,
  ),

  rpuName: placeNearComponent(
    COMPONENT.pullUpResistor,
    ALIGN.pullUpResistor.labelNameX,
    ALIGN.pullUpResistor.labelNameY,
  ),

  rpuValue: placeNearComponent(
    COMPONENT.pullUpResistor,
    ALIGN.pullUpResistor.labelValueX,
    ALIGN.pullUpResistor.labelValueY,
  ),

  rLedName: placeNearComponent(
    COMPONENT.ledResistor,
    ALIGN.rLed.labelNameX,
    ALIGN.rLed.labelNameY,
  ),

  rLedValue: placeNearComponent(
    COMPONENT.ledResistor,
    ALIGN.rLed.labelValueX,
    ALIGN.rLed.labelValueY,
  ),

  status: { x: ALIGN.label.statusX, y: ALIGN.label.statusY },
  mode: { x: ALIGN.label.modeX, y: ALIGN.label.modeY },
  values: { x: ALIGN.label.valuesX, y: ALIGN.label.valuesY },
  current: { x: ALIGN.label.currentX, y: ALIGN.label.currentY },

  vcc: {
    x: NODE.sourcePositiveRailStub.x - 22,
    y: NODE.positiveRailY - 12,
  },

  gnd: {
    x: NODE.groundFromSource.x - 22,
    y: NODE.negativeRailY + 28,
  },

  baseVoltage: {
    x: NODE.transistorBase.x - scaleComponentOffset(72),
    y: NODE.transistorBase.y - scaleComponentOffset(12),
  },

  collectorVoltage: {
    x: NODE.transistorCollector.x - scaleComponentOffset(18),
    y: NODE.transistorCollector.y - scaleComponentOffset(18),
  },

  emitterVoltage: {
    x: NODE.transistorEmitter.x - scaleComponentOffset(8),
    y: NODE.transistorEmitter.y + scaleComponentOffset(32),
  },
} as const;

/* =========================================================
   EXPORT MODEL
========================================================= */

export const PNP_CIRCUIT_MODEL = {
  SCALE,
  VIEW_BOX,
  VIEW_BOX_VALUE,
  BASE_COMPONENT,
  STYLE,
  COMPONENT,
  NODE,
  WIRE,
  PATH,
  LABEL,
  JUNCTION_NODE,
  HIDDEN_NODE,
} as const;
