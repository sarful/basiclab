"use client";

import React from "react";

/* =========================================================
   7805 VOLTAGE REGULATOR CIRCUIT
   React / Next.js / TypeScript / TailwindCSS
   Single-file reusable SVG component
========================================================= */

/* =========================================================
   TYPES
========================================================= */

type Point = {
  x: number;
  y: number;
};

type Box = Point & {
  w: number;
  h: number;
};

type TerminalKey =
  | "input"
  | "pin1"
  | "pin2"
  | "pin3"
  | "output"
  | "leftCap"
  | "rightCap"
  | "leftGround"
  | "rightGround";

type WireSegment = {
  id: string;
  from: Point;
  to: Point;
};

/* =========================================================
   GLOBAL SCALE / VIEWBOX CONSTANTS
========================================================= */

export const CIRCUIT_COMPONENT_SCALE = 1;
export const BASE_WIRE_WIDTH = 3;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 532,
  h: 532,
};

export const SCALE = {
  canvas: CIRCUIT_CANVAS_SCALE,
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
};

/* =========================================================
   OFFSET CONTROLS
   left/right/up/down tune করার জন্য এখানে value change করো
========================================================= */

export const COMPONENT_OFFSET = {
  canvas: { x: 0, y: 0 },
  wholeCircuit: { x: 0, y: 0 },

  regulator: { x: 0, y: 0 },

  pinNumbers: {
    pin1: { x: 0, y: 0 },
    pin2: { x: 0, y: 0 },
    pin3: { x: 0, y: 0 },
  },

  labels: {
    title7805: { x: 0, y: 0 },
    inputVoltage: { x: 0, y: 0 },
    inputText: { x: 0, y: 0 },
    outputVoltage: { x: 0, y: 0 },
    outputText: { x: 0, y: 0 },
    outputSmallText: { x: 0, y: 0 },
    leftCapValue: { x: 0, y: 0 },
    rightCapValue: { x: 0, y: 0 },
    leftGroundText: { x: 0, y: 0 },
    rightGroundText: { x: 0, y: 0 },
  },

  capacitors: {
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  },

  grounds: {
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  },

  nodes: {
    outputDot: { x: 0, y: 0 },
  },
};

export const WIRE_OFFSET: Record<
  TerminalKey,
  {
    all: Point;
    start: Point;
    end: Point;
  }
> = {
  input: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  pin1: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  pin2: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  pin3: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  output: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  leftCap: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  rightCap: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  leftGround: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  rightGround: {
    all: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },
};

export const DEBUG_TERMINAL_OFFSET: Record<TerminalKey, Point> = {
  input: { x: 0, y: 0 },
  pin1: { x: 0, y: 0 },
  pin2: { x: 0, y: 0 },
  pin3: { x: 0, y: 0 },
  output: { x: 0, y: 0 },
  leftCap: { x: 0, y: 0 },
  rightCap: { x: 0, y: 0 },
  leftGround: { x: 0, y: 0 },
  rightGround: { x: 0, y: 0 },
};

export const DEBUG = {
  showTerminalDots: true,
  showWireJoints: true,
  showTerminalNames: false,
};

/* =========================================================
   BASE COMPONENT GEOMETRY
========================================================= */

export const BASE_COMPONENT = {
  canvas: {
    background: "#ffffff",
  },

  regulator: {
    x: 180,
    y: 130,
    w: 132,
    h: 132,
  },

  pinNumbers: {
    pin1: { x: 199, y: 197 },
    pin2: { x: 247, y: 247 },
    pin3: { x: 294, y: 197 },
  },

  labels: {
    title7805: { x: 246, y: 153 },

    inputVoltage: { x: 72, y: 222 },
    inputText: { x: 64, y: 276 },

    outputVoltage: { x: 458, y: 198 },
    outputText: { x: 461, y: 224 },
    outputSmallText: { x: 448, y: 276 },

    leftCapValue: { x: 122, y: 299 },
    rightCapValue: { x: 361, y: 299 },

    leftGroundText: { x: 93, y: 397 },
    rightGroundText: { x: 396, y: 397 },
  },

  wires: {
    inputMain: {
      start: { x: 100, y: 196 },
      end: { x: 180, y: 196 },
    },

    leftCapDown: {
      start: { x: 135, y: 196 },
      end: { x: 135, y: 350 },
    },

    pin2Ground: {
      start: { x: 247, y: 262 },
      end: { x: 247, y: 350 },
    },

    pin3Output: {
      start: { x: 312, y: 196 },
      end: { x: 400, y: 196 },
    },

    rightCapDown: {
      start: { x: 350, y: 196 },
      end: { x: 350, y: 350 },
    },

    bottomGroundBus: {
      start: { x: 94, y: 350 },
      end: { x: 397, y: 350 },
    },
  },

  capacitors: {
    left: {
      x: 135,
      y: 282,
      plateW: 24,
      plateGap: 10,
    },

    right: {
      x: 350,
      y: 282,
      plateW: 24,
      plateGap: 10,
    },
  },

  grounds: {
    left: {
      x: 95,
      y: 350,
      w1: 18,
      w2: 12,
      w3: 6,
      gap: 6,
    },

    right: {
      x: 397,
      y: 350,
      w1: 18,
      w2: 12,
      w3: 6,
      gap: 6,
    },
  },

  nodes: {
    outputDot: {
      x: 400,
      y: 196,
      r: 5,
    },
  },
};

/* =========================================================
   STYLE CONSTANTS
========================================================= */

export const NODE = {
  debugRadius: 4,
  jointRadius: 3.5,
  terminalRadius: 5,

  outputDotRadius: BASE_COMPONENT.nodes.outputDot.r,

  fill: "#111111",
  debugFill: "#ffffff",
  debugStroke: "#ef4444",
  debugStrokeWidth: 1.5,
};

export const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  color: "#111111",
  lineCap: "square" as const,
  lineJoin: "miter" as const,
};

export const PATH = {
  regulator: {
    fill: "#e8e8e5",
    stroke: "#111111",
    strokeWidth: 3,
  },

  capacitor: {
    stroke: "#111111",
    strokeWidth: 3,
  },

  ground: {
    stroke: "#111111",
    strokeWidth: 3,
  },
};

export const LABEL = {
  fontFamily:
    "Arial, Helvetica, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

  regulatorText: {
    fontSize: 30,
    fontWeight: 700,
    fill: "#111111",
  },

  pinNumber: {
    fontSize: 33,
    fontWeight: 700,
    fill: "#111111",
  },

  red: {
    fontSize: 22,
    fontWeight: 700,
    fill: "#e3342f",
  },

  green: {
    fontSize: 22,
    fontWeight: 700,
    fill: "#159447",
  },

  capacitor: {
    fontSize: 22,
    fontWeight: 700,
    fill: "#151154",
  },

  ground: {
    fontSize: 22,
    fontWeight: 700,
    fill: "#202020",
  },

  debug: {
    fontSize: 11,
    fontWeight: 700,
    fill: "#dc2626",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const addPoint = (point: Point, offset: Point): Point => ({
  x: point.x + offset.x,
  y: point.y + offset.y,
});

const addBox = (box: Box, offset: Point): Box => ({
  ...box,
  x: box.x + offset.x,
  y: box.y + offset.y,
});

const applyWireOffset = (
  point: Point,
  terminal: TerminalKey,
  endType: "start" | "end",
): Point => {
  return addPoint(
    addPoint(point, WIRE_OFFSET[terminal].all),
    WIRE_OFFSET[terminal][endType],
  );
};

const uniquePoints = (segments: WireSegment[]): Point[] => {
  const map = new Map<string, Point>();

  segments.forEach((segment) => {
    map.set(`${segment.from.x}-${segment.from.y}`, segment.from);
    map.set(`${segment.to.x}-${segment.to.y}`, segment.to);
  });

  return [...map.values()];
};

/* =========================================================
   COMPUTED COMPONENT CONSTANTS
========================================================= */

export const COMPONENT = {
  regulator: addBox(BASE_COMPONENT.regulator, COMPONENT_OFFSET.regulator),

  pinNumbers: {
    pin1: addPoint(BASE_COMPONENT.pinNumbers.pin1, COMPONENT_OFFSET.pinNumbers.pin1),
    pin2: addPoint(BASE_COMPONENT.pinNumbers.pin2, COMPONENT_OFFSET.pinNumbers.pin2),
    pin3: addPoint(BASE_COMPONENT.pinNumbers.pin3, COMPONENT_OFFSET.pinNumbers.pin3),
  },

  labels: {
    title7805: addPoint(
      BASE_COMPONENT.labels.title7805,
      COMPONENT_OFFSET.labels.title7805,
    ),

    inputVoltage: addPoint(
      BASE_COMPONENT.labels.inputVoltage,
      COMPONENT_OFFSET.labels.inputVoltage,
    ),

    inputText: addPoint(
      BASE_COMPONENT.labels.inputText,
      COMPONENT_OFFSET.labels.inputText,
    ),

    outputVoltage: addPoint(
      BASE_COMPONENT.labels.outputVoltage,
      COMPONENT_OFFSET.labels.outputVoltage,
    ),

    outputText: addPoint(
      BASE_COMPONENT.labels.outputText,
      COMPONENT_OFFSET.labels.outputText,
    ),

    outputSmallText: addPoint(
      BASE_COMPONENT.labels.outputSmallText,
      COMPONENT_OFFSET.labels.outputSmallText,
    ),

    leftCapValue: addPoint(
      BASE_COMPONENT.labels.leftCapValue,
      COMPONENT_OFFSET.labels.leftCapValue,
    ),

    rightCapValue: addPoint(
      BASE_COMPONENT.labels.rightCapValue,
      COMPONENT_OFFSET.labels.rightCapValue,
    ),

    leftGroundText: addPoint(
      BASE_COMPONENT.labels.leftGroundText,
      COMPONENT_OFFSET.labels.leftGroundText,
    ),

    rightGroundText: addPoint(
      BASE_COMPONENT.labels.rightGroundText,
      COMPONENT_OFFSET.labels.rightGroundText,
    ),
  },

  capacitors: {
    left: addPoint(BASE_COMPONENT.capacitors.left, COMPONENT_OFFSET.capacitors.left),
    right: addPoint(BASE_COMPONENT.capacitors.right, COMPONENT_OFFSET.capacitors.right),
  },

  grounds: {
    left: addPoint(BASE_COMPONENT.grounds.left, COMPONENT_OFFSET.grounds.left),
    right: addPoint(BASE_COMPONENT.grounds.right, COMPONENT_OFFSET.grounds.right),
  },

  nodes: {
    outputDot: addPoint(
      BASE_COMPONENT.nodes.outputDot,
      COMPONENT_OFFSET.nodes.outputDot,
    ),
  },
};

/* =========================================================
   STRUCTURED WIRE SEGMENTS
   Capacitor wire split করা হয়েছে:
   wire capacitor plate-এর ভিতর দিয়ে যাবে না
========================================================= */

export const createWireSegments = (): Record<TerminalKey, WireSegment[]> => ({
  input: [
    {
      id: "input-main-horizontal-wire",
      from: applyWireOffset(BASE_COMPONENT.wires.inputMain.start, "input", "start"),
      to: applyWireOffset(BASE_COMPONENT.wires.inputMain.end, "input", "end"),
    },
  ],

  pin1: [
    {
      id: "pin1-input-to-regulator",
      from: applyWireOffset(BASE_COMPONENT.wires.inputMain.start, "pin1", "start"),
      to: applyWireOffset(BASE_COMPONENT.wires.inputMain.end, "pin1", "end"),
    },
  ],

  leftCap: [
    {
      id: "left-cap-top-wire",
      from: applyWireOffset(BASE_COMPONENT.wires.leftCapDown.start, "leftCap", "start"),
      to: applyWireOffset(
        {
          x: BASE_COMPONENT.capacitors.left.x,
          y:
            BASE_COMPONENT.capacitors.left.y -
            BASE_COMPONENT.capacitors.left.plateGap / 2,
        },
        "leftCap",
        "end",
      ),
    },
    {
      id: "left-cap-bottom-wire",
      from: applyWireOffset(
        {
          x: BASE_COMPONENT.capacitors.left.x,
          y:
            BASE_COMPONENT.capacitors.left.y +
            BASE_COMPONENT.capacitors.left.plateGap / 2,
        },
        "leftCap",
        "start",
      ),
      to: applyWireOffset(BASE_COMPONENT.wires.leftCapDown.end, "leftCap", "end"),
    },
  ],

  pin2: [
    {
      id: "pin2-ground-vertical-wire",
      from: applyWireOffset(BASE_COMPONENT.wires.pin2Ground.start, "pin2", "start"),
      to: applyWireOffset(BASE_COMPONENT.wires.pin2Ground.end, "pin2", "end"),
    },
  ],

  pin3: [
    {
      id: "pin3-output-horizontal-wire",
      from: applyWireOffset(BASE_COMPONENT.wires.pin3Output.start, "pin3", "start"),
      to: applyWireOffset(BASE_COMPONENT.wires.pin3Output.end, "pin3", "end"),
    },
  ],

  output: [
    {
      id: "output-wire",
      from: applyWireOffset(BASE_COMPONENT.wires.pin3Output.start, "output", "start"),
      to: applyWireOffset(BASE_COMPONENT.wires.pin3Output.end, "output", "end"),
    },
  ],

  rightCap: [
    {
      id: "right-cap-top-wire",
      from: applyWireOffset(BASE_COMPONENT.wires.rightCapDown.start, "rightCap", "start"),
      to: applyWireOffset(
        {
          x: BASE_COMPONENT.capacitors.right.x,
          y:
            BASE_COMPONENT.capacitors.right.y -
            BASE_COMPONENT.capacitors.right.plateGap / 2,
        },
        "rightCap",
        "end",
      ),
    },
    {
      id: "right-cap-bottom-wire",
      from: applyWireOffset(
        {
          x: BASE_COMPONENT.capacitors.right.x,
          y:
            BASE_COMPONENT.capacitors.right.y +
            BASE_COMPONENT.capacitors.right.plateGap / 2,
        },
        "rightCap",
        "start",
      ),
      to: applyWireOffset(BASE_COMPONENT.wires.rightCapDown.end, "rightCap", "end"),
    },
  ],

  leftGround: [
    {
      id: "bottom-ground-bus",
      from: applyWireOffset(
        BASE_COMPONENT.wires.bottomGroundBus.start,
        "leftGround",
        "start",
      ),
      to: applyWireOffset(
        BASE_COMPONENT.wires.bottomGroundBus.end,
        "leftGround",
        "end",
      ),
    },
  ],

  rightGround: [
    {
      id: "bottom-ground-bus-right-reference",
      from: applyWireOffset(
        BASE_COMPONENT.wires.bottomGroundBus.start,
        "rightGround",
        "start",
      ),
      to: applyWireOffset(
        BASE_COMPONENT.wires.bottomGroundBus.end,
        "rightGround",
        "end",
      ),
    },
  ],
});

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function SvgDefs() {
  return (
    <defs>
      <filter id="softSymbolShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow
          dx="0"
          dy="1"
          stdDeviation="0.5"
          floodColor="#000000"
          floodOpacity="0.16"
        />
      </filter>
    </defs>
  );
}

function CircuitCanvas() {
  return (
    <rect
      x={VIEW_BOX.x}
      y={VIEW_BOX.y}
      width={VIEW_BOX.w}
      height={VIEW_BOX.h}
      fill={BASE_COMPONENT.canvas.background}
    />
  );
}

function TextLabel({
  x,
  y,
  children,
  fill,
  fontSize,
  fontWeight,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  fill: string;
  fontSize: number;
  fontWeight: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontFamily={LABEL.fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fill={fill}
    >
      {children}
    </text>
  );
}

function RegulatorBlock() {
  const box = COMPONENT.regulator;

  return (
    <g filter="url(#softSymbolShadow)">
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        fill={PATH.regulator.fill}
        stroke={PATH.regulator.stroke}
        strokeWidth={PATH.regulator.strokeWidth}
      />

      <TextLabel
        x={COMPONENT.labels.title7805.x}
        y={COMPONENT.labels.title7805.y}
        fill={LABEL.regulatorText.fill}
        fontSize={LABEL.regulatorText.fontSize}
        fontWeight={LABEL.regulatorText.fontWeight}
      >
        7805
      </TextLabel>

      <TextLabel
        x={COMPONENT.pinNumbers.pin1.x}
        y={COMPONENT.pinNumbers.pin1.y}
        fill={LABEL.pinNumber.fill}
        fontSize={LABEL.pinNumber.fontSize}
        fontWeight={LABEL.pinNumber.fontWeight}
      >
        1
      </TextLabel>

      <TextLabel
        x={COMPONENT.pinNumbers.pin2.x}
        y={COMPONENT.pinNumbers.pin2.y}
        fill={LABEL.pinNumber.fill}
        fontSize={LABEL.pinNumber.fontSize}
        fontWeight={LABEL.pinNumber.fontWeight}
      >
        2
      </TextLabel>

      <TextLabel
        x={COMPONENT.pinNumbers.pin3.x}
        y={COMPONENT.pinNumbers.pin3.y}
        fill={LABEL.pinNumber.fill}
        fontSize={LABEL.pinNumber.fontSize}
        fontWeight={LABEL.pinNumber.fontWeight}
      >
        3
      </TextLabel>
    </g>
  );
}

function StructuredWire({ terminal }: { terminal: TerminalKey }) {
  const segments = createWireSegments()[terminal];

  return (
    <g>
      {segments.map((segment) => (
        <line
          key={segment.id}
          x1={segment.from.x}
          y1={segment.from.y}
          x2={segment.to.x}
          y2={segment.to.y}
          stroke={WIRE.color}
          strokeWidth={WIRE.width}
          strokeLinecap={WIRE.lineCap}
          strokeLinejoin={WIRE.lineJoin}
        />
      ))}

      {DEBUG.showWireJoints &&
        uniquePoints(segments).map((point, index) => (
          <circle
            key={`${terminal}-joint-${index}`}
            cx={point.x}
            cy={point.y}
            r={NODE.jointRadius}
            fill={NODE.debugFill}
            stroke={NODE.debugStroke}
            strokeWidth={NODE.debugStrokeWidth}
          />
        ))}
    </g>
  );
}

function DebugTerminalDots({ terminal }: { terminal: TerminalKey }) {
  if (!DEBUG.showTerminalDots) return null;

  const segments = createWireSegments()[terminal];
  const offset = DEBUG_TERMINAL_OFFSET[terminal];

  return (
    <g>
      {uniquePoints(segments).map((point, index) => {
        const p = addPoint(point, offset);

        return (
          <circle
            key={`${terminal}-debug-dot-${index}`}
            cx={p.x}
            cy={p.y}
            r={NODE.debugRadius}
            fill={NODE.debugFill}
            stroke={NODE.debugStroke}
            strokeWidth={NODE.debugStrokeWidth}
          />
        );
      })}

      {DEBUG.showTerminalNames && (
        <text
          x={segments[0].from.x + 8}
          y={segments[0].from.y - 8}
          fontFamily={LABEL.fontFamily}
          fontSize={LABEL.debug.fontSize}
          fontWeight={LABEL.debug.fontWeight}
          fill={LABEL.debug.fill}
        >
          {terminal.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function WireBlock({ terminal }: { terminal: TerminalKey }) {
  return (
    <g>
      <StructuredWire terminal={terminal} />
      <DebugTerminalDots terminal={terminal} />
    </g>
  );
}

function Capacitor({
  side,
  label,
}: {
  side: "left" | "right";
  label: string;
}) {
  const cap = COMPONENT.capacitors[side];
  const base = BASE_COMPONENT.capacitors[side];

  const y1 = cap.y - base.plateGap / 2;
  const y2 = cap.y + base.plateGap / 2;

  return (
    <g>
      <line
        x1={cap.x - base.plateW / 2}
        y1={y1}
        x2={cap.x + base.plateW / 2}
        y2={y1}
        stroke={PATH.capacitor.stroke}
        strokeWidth={PATH.capacitor.strokeWidth}
      />

      <line
        x1={cap.x - base.plateW / 2}
        y1={y2}
        x2={cap.x + base.plateW / 2}
        y2={y2}
        stroke={PATH.capacitor.stroke}
        strokeWidth={PATH.capacitor.strokeWidth}
      />

      <TextLabel
        x={
          side === "left"
            ? COMPONENT.labels.leftCapValue.x
            : COMPONENT.labels.rightCapValue.x
        }
        y={
          side === "left"
            ? COMPONENT.labels.leftCapValue.y
            : COMPONENT.labels.rightCapValue.y
        }
        anchor={side === "left" ? "end" : "start"}
        fill={LABEL.capacitor.fill}
        fontSize={LABEL.capacitor.fontSize}
        fontWeight={LABEL.capacitor.fontWeight}
      >
        {label}
      </TextLabel>
    </g>
  );
}

function GroundSymbol({ side }: { side: "left" | "right" }) {
  const ground = COMPONENT.grounds[side];
  const base = BASE_COMPONENT.grounds[side];

  return (
    <g>
      <line
        x1={ground.x}
        y1={ground.y}
        x2={ground.x}
        y2={ground.y + 10}
        stroke={PATH.ground.stroke}
        strokeWidth={PATH.ground.strokeWidth}
      />

      <line
        x1={ground.x - base.w1 / 2}
        y1={ground.y + 10}
        x2={ground.x + base.w1 / 2}
        y2={ground.y + 10}
        stroke={PATH.ground.stroke}
        strokeWidth={PATH.ground.strokeWidth}
      />

      <line
        x1={ground.x - base.w2 / 2}
        y1={ground.y + 10 + base.gap}
        x2={ground.x + base.w2 / 2}
        y2={ground.y + 10 + base.gap}
        stroke={PATH.ground.stroke}
        strokeWidth={PATH.ground.strokeWidth}
      />

      <line
        x1={ground.x - base.w3 / 2}
        y1={ground.y + 10 + base.gap * 2}
        x2={ground.x + base.w3 / 2}
        y2={ground.y + 10 + base.gap * 2}
        stroke={PATH.ground.stroke}
        strokeWidth={PATH.ground.strokeWidth}
      />

      <TextLabel
        x={
          side === "left"
            ? COMPONENT.labels.leftGroundText.x
            : COMPONENT.labels.rightGroundText.x
        }
        y={
          side === "left"
            ? COMPONENT.labels.leftGroundText.y
            : COMPONENT.labels.rightGroundText.y
        }
        fill={LABEL.ground.fill}
        fontSize={LABEL.ground.fontSize}
        fontWeight={LABEL.ground.fontWeight}
      >
        Ground
      </TextLabel>
    </g>
  );
}

function OutputNodeDot() {
  const dot = COMPONENT.nodes.outputDot;

  return (
    <circle
      cx={dot.x}
      cy={dot.y}
      r={NODE.outputDotRadius}
      fill={NODE.fill}
    />
  );
}

function CircuitLabels() {
  return (
    <g>
      <TextLabel
        x={COMPONENT.labels.inputVoltage.x}
        y={COMPONENT.labels.inputVoltage.y}
        anchor="middle"
        fill={LABEL.red.fill}
        fontSize={LABEL.red.fontSize}
        fontWeight={LABEL.red.fontWeight}
      >
        +7.5V~35V
      </TextLabel>

      <TextLabel
        x={COMPONENT.labels.inputText.x}
        y={COMPONENT.labels.inputText.y}
        anchor="middle"
        fill={LABEL.red.fill}
        fontSize={LABEL.red.fontSize}
        fontWeight={LABEL.red.fontWeight}
      >
        IN
      </TextLabel>

      <TextLabel
        x={COMPONENT.labels.outputVoltage.x}
        y={COMPONENT.labels.outputVoltage.y}
        anchor="middle"
        fill={LABEL.green.fill}
        fontSize={LABEL.green.fontSize}
        fontWeight={LABEL.green.fontWeight}
      >
        +5V
      </TextLabel>

      <TextLabel
        x={COMPONENT.labels.outputText.x}
        y={COMPONENT.labels.outputText.y}
        anchor="middle"
        fill={LABEL.green.fill}
        fontSize={LABEL.green.fontSize}
        fontWeight={LABEL.green.fontWeight}
      >
        Regulated
      </TextLabel>

      <TextLabel
        x={COMPONENT.labels.outputSmallText.x}
        y={COMPONENT.labels.outputSmallText.y}
        anchor="middle"
        fill={LABEL.green.fill}
        fontSize={LABEL.green.fontSize}
        fontWeight={LABEL.green.fontWeight}
      >
        Out
      </TextLabel>
    </g>
  );
}

function CircuitCore() {
  return (
    <g
      transform={`
        translate(${COMPONENT_OFFSET.wholeCircuit.x} ${COMPONENT_OFFSET.wholeCircuit.y})
        scale(${SCALE.component})
      `}
    >
      <WireBlock terminal="input" />
      <WireBlock terminal="leftCap" />
      <WireBlock terminal="pin2" />
      <WireBlock terminal="pin3" />
      <WireBlock terminal="rightCap" />
      <WireBlock terminal="leftGround" />

      <Capacitor side="left" label=".1uF" />
      <Capacitor side="right" label=".1uF" />

      <GroundSymbol side="left" />
      <GroundSymbol side="right" />

      <OutputNodeDot />
      <RegulatorBlock />
      <CircuitLabels />
    </g>
  );
}

/* =========================================================
   REUSABLE LIBRARY COMPONENT
========================================================= */

export function Regulator7805CircuitSvg({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
      role="img"
      aria-label="7805 voltage regulator circuit with input capacitor, output capacitor, and ground terminals"
      className={className}
    >
      <SvgDefs />
      <CircuitCanvas />

      <g
        transform={`
          translate(${COMPONENT_OFFSET.canvas.x} ${COMPONENT_OFFSET.canvas.y})
          scale(${SCALE.canvas})
        `}
      >
        <CircuitCore />
      </g>
    </svg>
  );
}

/* =========================================================
   NEXT.JS PAGE DEFAULT EXPORT
========================================================= */

export default function Regulator7805CircuitPage() {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <Regulator7805CircuitSvg className="w-full max-w-[532px] h-auto" />
    </main>
  );
}