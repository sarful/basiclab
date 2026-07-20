"use client";

import React from "react";

/* =========================================================
   78L05 VOLTAGE REGULATOR SYMBOL
   Single File: React / Next.js / TypeScript / TailwindCSS
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

export type TerminalKey = "input" | "ground" | "output";

type WireSegment = {
  id: string;
  from: Point;
  to: Point;
};

type OffsetMap = Record<TerminalKey, Point>;

/* =========================================================
   GLOBAL TUNE CONTROLS
========================================================= */

export const CIRCUIT_COMPONENT_SCALE = 1;
export const BASE_WIRE_WIDTH = 4;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 420,
  h: 260,
};

export const SCALE = {
  canvas: CIRCUIT_CANVAS_SCALE,
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
};

/* =========================================================
   OFFSET CONTROLS
   এখানে left/right/up/down tune করো
========================================================= */

export const COMPONENT_OFFSET = {
  canvas: { x: 0, y: 0 },
  wholeComponent: { x: 0, y: 0 },

  body: { x: 0, y: 0 },
  topStep: { x: 0, y: 0 },
  chipText: { x: 0, y: 0 },

  terminalNumbers: {
    input: { x: 0, y: 0 },
    ground: { x: 0, y: 0 },
    output: { x: 0, y: 0 },
  },

  terminalLabels: {
    input: { x: 0, y: 0 },
    ground: { x: 0, y: 0 },
    output: { x: 0, y: 0 },
  },
};

export const WIRE_OFFSET = {
  all: { x: 0, y: 0 },

  input: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  ground: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },

  output: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },
};

export const DEBUG_TERMINAL_OFFSET: OffsetMap = {
  input: { x: 0, y: 0 },
  ground: { x: 0, y: 0 },
  output: { x: 0, y: 0 },
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
  body: {
    x: 142,
    y: 55,
    w: 136,
    h: 72,
  },

  topStep: {
    x: 162,
    y: 22,
    w: 96,
    h: 33,
  },

  chipText: {
    x: 210,
    y: 96,
  },

  wireAnchors: {
    inputStart: { x: 88, y: 91 },
    inputEnd: { x: 142, y: 91 },

    outputStart: { x: 278, y: 91 },
    outputEnd: { x: 332, y: 91 },

    groundStart: { x: 210, y: 127 },
    groundEnd: { x: 210, y: 166 },
  },

  terminalNumbers: {
    input: { x: 63, y: 84 },
    ground: { x: 210, y: 200 },
    output: { x: 360, y: 84 },
  },

  terminalLabels: {
    input: { x: 70, y: 121 },
    ground: { x: 210, y: 235 },
    output: { x: 350, y: 121 },
  },
};

/* =========================================================
   STYLE CONSTANTS
========================================================= */

export const NODE = {
  terminalRadius: 5,
  jointRadius: 4,
  debugRadius: 4.5,
  strokeWidth: 1.5,
  fill: "#ffffff",
  stroke: "#111111",
};

export const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  color: "#111111",
  lineCap: "square" as const,
};

export const PATH = {
  bodyStroke: "#111111",
  bodyFill: "#ffffff",
  strokeWidth: 4,
};

export const LABEL = {
  fontFamily: `"Times New Roman", Times, serif`,

  chip: {
    fontSize: 24,
    fontWeight: 700,
    fill: "#111111",
  },

  number: {
    fontSize: 32,
    fontWeight: 500,
    fill: "#111111",
  },

  terminal: {
    fontSize: 25,
    fontWeight: 700,
    fill: "#111111",
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

const withGlobalWireOffset = (point: Point): Point => {
  return addPoint(point, WIRE_OFFSET.all);
};

/* =========================================================
   COMPUTED COMPONENT
========================================================= */

export const COMPONENT = {
  body: addBox(BASE_COMPONENT.body, COMPONENT_OFFSET.body),

  topStep: addBox(BASE_COMPONENT.topStep, COMPONENT_OFFSET.topStep),

  chipText: addPoint(BASE_COMPONENT.chipText, COMPONENT_OFFSET.chipText),

  terminalNumbers: {
    input: addPoint(
      BASE_COMPONENT.terminalNumbers.input,
      COMPONENT_OFFSET.terminalNumbers.input,
    ),
    ground: addPoint(
      BASE_COMPONENT.terminalNumbers.ground,
      COMPONENT_OFFSET.terminalNumbers.ground,
    ),
    output: addPoint(
      BASE_COMPONENT.terminalNumbers.output,
      COMPONENT_OFFSET.terminalNumbers.output,
    ),
  },

  terminalLabels: {
    input: addPoint(
      BASE_COMPONENT.terminalLabels.input,
      COMPONENT_OFFSET.terminalLabels.input,
    ),
    ground: addPoint(
      BASE_COMPONENT.terminalLabels.ground,
      COMPONENT_OFFSET.terminalLabels.ground,
    ),
    output: addPoint(
      BASE_COMPONENT.terminalLabels.output,
      COMPONENT_OFFSET.terminalLabels.output,
    ),
  },
};

/* =========================================================
   STRUCTURED WIRE SEGMENTS
========================================================= */

export const createWireSegments = (): Record<TerminalKey, WireSegment[]> => ({
  input: [
    {
      id: "input-horizontal-wire",
      from: withGlobalWireOffset(
        addPoint(BASE_COMPONENT.wireAnchors.inputStart, WIRE_OFFSET.input.start),
      ),
      to: withGlobalWireOffset(
        addPoint(BASE_COMPONENT.wireAnchors.inputEnd, WIRE_OFFSET.input.end),
      ),
    },
  ],

  output: [
    {
      id: "output-horizontal-wire",
      from: withGlobalWireOffset(
        addPoint(BASE_COMPONENT.wireAnchors.outputStart, WIRE_OFFSET.output.start),
      ),
      to: withGlobalWireOffset(
        addPoint(BASE_COMPONENT.wireAnchors.outputEnd, WIRE_OFFSET.output.end),
      ),
    },
  ],

  ground: [
    {
      id: "ground-vertical-wire",
      from: withGlobalWireOffset(
        addPoint(BASE_COMPONENT.wireAnchors.groundStart, WIRE_OFFSET.ground.start),
      ),
      to: withGlobalWireOffset(
        addPoint(BASE_COMPONENT.wireAnchors.groundEnd, WIRE_OFFSET.ground.end),
      ),
    },
  ],
});

const getUniquePoints = (segments: WireSegment[]): Point[] => {
  const points = new Map<string, Point>();

  segments.forEach((segment) => {
    points.set(`${segment.from.x}-${segment.from.y}`, segment.from);
    points.set(`${segment.to.x}-${segment.to.y}`, segment.to);
  });

  return [...points.values()];
};

const createCurrentDotPath = (segments: WireSegment[], reverse = false) => {
  if (segments.length === 0) return "";

  const points = reverse
    ? [
        segments[segments.length - 1].to,
        ...segments
          .slice()
          .reverse()
          .map((segment) => segment.from),
      ]
    : [segments[0].from, ...segments.map((segment) => segment.to)];

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
};

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function SvgDefs() {
  return (
    <defs>
      <filter id="symbolSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="1"
          stdDeviation="0.5"
          floodColor="#000000"
          floodOpacity="0.12"
        />
      </filter>
    </defs>
  );
}

function CanvasBackground() {
  return (
    <rect
      x={VIEW_BOX.x}
      y={VIEW_BOX.y}
      width={VIEW_BOX.w}
      height={VIEW_BOX.h}
      fill="#ffffff"
    />
  );
}

function RegulatorBody() {
  const body = COMPONENT.body;
  const step = COMPONENT.topStep;

  return (
    <g filter="url(#symbolSoftShadow)">
      {/* Main rectangle */}
      <rect
        x={body.x}
        y={body.y}
        width={body.w}
        height={body.h}
        fill={PATH.bodyFill}
        stroke={PATH.bodyStroke}
        strokeWidth={PATH.strokeWidth}
      />

      {/* Top raised step */}
      <path
        d={`
          M ${step.x} ${body.y}
          V ${step.y}
          H ${step.x + step.w}
          V ${body.y}
        `}
        fill="none"
        stroke={PATH.bodyStroke}
        strokeWidth={PATH.strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </g>
  );
}

function ChipText({ pinoutLabel }: { pinoutLabel: string }) {
  return (
    <text
      x={COMPONENT.chipText.x}
      y={COMPONENT.chipText.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={LABEL.fontFamily}
      fontSize={LABEL.chip.fontSize}
      fontWeight={LABEL.chip.fontWeight}
      fill={LABEL.chip.fill}
    >
      {pinoutLabel}
    </text>
  );
}

function StructuredWire({
  active = false,
  terminal,
}: {
  active?: boolean;
  terminal: TerminalKey;
}) {
  const wireGroups = createWireSegments();
  const segments = wireGroups[terminal];
  const currentPath = createCurrentDotPath(segments, terminal === "output");

  return (
    <g>
      {active &&
        segments.map((segment) => (
          <line
            key={`${segment.id}-active`}
            x1={segment.from.x}
            y1={segment.from.y}
            x2={segment.to.x}
            y2={segment.to.y}
            stroke="#14b8a6"
            strokeWidth={WIRE.width + 8}
            strokeLinecap={WIRE.lineCap}
            opacity={0.22}
          />
        ))}

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
        />
      ))}

      {DEBUG.showWireJoints &&
        getUniquePoints(segments).map((point, index) => (
          <circle
            key={`${terminal}-wire-joint-${index}`}
            cx={point.x}
            cy={point.y}
            r={NODE.jointRadius}
            fill={NODE.fill}
            stroke={NODE.stroke}
            strokeWidth={NODE.strokeWidth}
          />
        ))}

      {active &&
        Array.from({ length: 3 }).map((_, index) => (
          <circle
            key={`${terminal}-current-dot-${index}`}
            r={4.4}
            fill="#14b8a6"
            stroke="#ffffff"
            strokeWidth={1.5}
          >
            <animateMotion
              dur="1.35s"
              path={currentPath}
              begin={`${index * 0.45}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="1.35s"
              begin={`${index * 0.45}s`}
              repeatCount="indefinite"
            />
          </circle>
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
      {getUniquePoints(segments).map((point, index) => {
        const p = addPoint(point, offset);

        return (
          <circle
            key={`${terminal}-debug-terminal-dot-${index}`}
            cx={p.x}
            cy={p.y}
            r={NODE.debugRadius}
            fill="#ffffff"
            stroke="#ef4444"
            strokeWidth={1.5}
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

function TerminalNumber({
  active = false,
  terminal,
  value,
}: {
  active?: boolean;
  terminal: TerminalKey;
  value: string;
}) {
  const point = COMPONENT.terminalNumbers[terminal];

  return (
    <text
      x={point.x}
      y={point.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={LABEL.fontFamily}
      fontSize={LABEL.number.fontSize}
      fontWeight={LABEL.number.fontWeight}
      fill={active ? "#0f766e" : LABEL.number.fill}
    >
      {value}
    </text>
  );
}

function TerminalLabel({
  active = false,
  terminal,
  label,
}: {
  active?: boolean;
  terminal: TerminalKey;
  label: string;
}) {
  const point = COMPONENT.terminalLabels[terminal];

  return (
    <text
      x={point.x}
      y={point.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={LABEL.fontFamily}
      fontSize={LABEL.terminal.fontSize}
      fontWeight={LABEL.terminal.fontWeight}
      fill={active ? "#0f766e" : LABEL.terminal.fill}
    >
      {label}
    </text>
  );
}

function TerminalBlock({
  active = false,
  terminal,
  number,
  label,
}: {
  active?: boolean;
  terminal: TerminalKey;
  number: string;
  label: string;
}) {
  const point = COMPONENT.terminalNumbers[terminal];

  return (
    <g>
      {active && <circle cx={point.x} cy={point.y} r={28} fill="#ccfbf1" />}
      <StructuredWire terminal={terminal} active={active} />
      <DebugTerminalDots terminal={terminal} />
      <TerminalNumber terminal={terminal} value={number} active={active} />
      <TerminalLabel terminal={terminal} label={label} active={active} />
    </g>
  );
}

function RegulatorSymbolCore({
  activeTerminals,
  pinoutLabel,
}: {
  activeTerminals: readonly TerminalKey[];
  pinoutLabel: string;
}) {
  return (
    <g
      transform={`
        translate(${COMPONENT_OFFSET.wholeComponent.x} ${COMPONENT_OFFSET.wholeComponent.y})
        scale(${SCALE.component})
      `}
    >
      <TerminalBlock
        terminal="input"
        number="1"
        label="Input"
        active={activeTerminals.includes("input")}
      />
      <TerminalBlock
        terminal="output"
        number="3"
        label="Output"
        active={activeTerminals.includes("output")}
      />
      <TerminalBlock
        terminal="ground"
        number="2"
        label="Ground"
        active={activeTerminals.includes("ground")}
      />

      <RegulatorBody />
      <ChipText pinoutLabel={pinoutLabel} />
    </g>
  );
}

/* =========================================================
   REUSABLE LIBRARY COMPONENT
========================================================= */

export function VoltageRegulator78L05SymbolSvg({
  activeTerminals = [],
  className = "",
  pinoutLabel = "78L05",
}: {
  activeTerminals?: readonly TerminalKey[];
  className?: string;
  pinoutLabel?: string;
}) {
  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
      role="img"
      aria-label="78L05 voltage regulator symbol with input, ground, and output terminals"
      className={className}
    >
      <SvgDefs />
      <CanvasBackground />

      <g
        transform={`
          translate(${COMPONENT_OFFSET.canvas.x} ${COMPONENT_OFFSET.canvas.y})
          scale(${SCALE.canvas})
        `}
      >
        <RegulatorSymbolCore
          activeTerminals={activeTerminals}
          pinoutLabel={pinoutLabel}
        />
      </g>
    </svg>
  );
}

/* =========================================================
   NEXT.JS PAGE DEFAULT EXPORT
========================================================= */

export default function VoltageRegulator78L05Page() {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center p-6">
      <VoltageRegulator78L05SymbolSvg className="w-full max-w-[520px] h-auto" />
    </main>
  );
}
