"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";

/* ============================================================================
  OptocouplerSketch.tsx

  Updated features:
  - Preserves hand-drawn pencil sketch style.
  - Preserves pin labels, package body, external pins, LED diode section,
    optical arrows, and phototransistor section.
  - Adds showDebugPaths.
  - Adds showLegend.
  - Improves current-dot alignment using COMPONENT_OFFSET + WIRE_OFFSET
    + DOT_PATH_OFFSET.
  - Adds active terminal highlighting.
  - Keeps clean component-library architecture.
============================================================================ */

/* ============================================================================
  Types
============================================================================ */

type XY = { x: number; y: number };

type SimulationStep = 0 | 1 | 2 | 3;
type ControlMode = "onOff" | "timeline";

type SvgIds = {
  pencilWobble: string;
  softPaper: string;
  lightHatch: string;
  denseHatch: string;
  bodyShade: string;
  metalShade: string;
  arrowHead: string;
};

type OptocouplerSketchProps = {
  className?: string;
  showBackground?: boolean;
  showControls?: boolean;
  showTimeline?: boolean;
  showCurrentDots?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  showDebugTerminals?: boolean;
  showDebugPaths?: boolean;
  autoStart?: boolean;
  initialRunning?: boolean;
  simulationSpeed?: number;
};

/* ============================================================================
  VIEW_BOX
============================================================================ */

const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 1536,
  h: 1152,
};

/* ============================================================================
  COLORS
============================================================================ */

const COLORS = {
  paper: "#ffffff",
  ink: "#111111",
  graphite: "#5f5f5f",
  graphiteLight: "#9a9a9a",
  graphiteDark: "#252525",
  fillLight: "#fafafa",
  fillSoft: "#eeeeee",
  fillMetal: "#e5e5e5",

  inputCurrent: "#ef4444",
  inputCurrentSoft: "#fecaca",
  inputCurrentDark: "#991b1b",

  ledCurrent: "#f59e0b",
  ledCurrentSoft: "#fde68a",
  ledCurrentDark: "#92400e",

  lightBeam: "#facc15",
  lightBeamSoft: "#fef3c7",

  outputCurrent: "#10b981",
  outputCurrentSoft: "#bbf7d0",
  outputCurrentDark: "#065f46",

  activeGreen: "#dcfce7",
  activeRed: "#fee2e2",
  activeAmber: "#fef3c7",
  activeYellow: "#fef9c3",

  debug: "#dc2626",
  debugText: "#991b1b",

  debugAnode: "#ef4444",
  debugLed: "#f59e0b",
  debugCathode: "#fb7185",
  debugCollector: "#10b981",
  debugEmitter: "#065f46",
};

/* ============================================================================
  STROKE
============================================================================ */

const STROKE = {
  outer: 6,
  main: 4,
  inner: 3,
  fine: 1.6,
  symbol: 4,
  arrow: 3.5,
  debugPath: 2.4,
};

/* ============================================================================
  SCALE
============================================================================ */

const SCALE = {
  CIRCUIT_COMPONENT_SCALE: 1,
  CIRCUIT_CANVAS_SCALE: 1,
  CIRCUIT_WIRE_SCALE: 1,
  CURRENT_DOT_SCALE: 1,
};

/* ============================================================================
  COMPONENT_OFFSET

  Manual adjustment guide:
  x positive = move right
  x negative = move left
  y positive = move down
  y negative = move up
============================================================================ */

const COMPONENT_OFFSET = {
  body: { x: 0, y: 0 },
  pins: { x: 0, y: 0 },
  labels: { x: 0, y: 0 },
  diode: { x: 0, y: 0 },
  transistor: { x: 0, y: 0 },
  arrows: { x: 0, y: 0 },
  texture: { x: 0, y: 0 },
  currentDots: { x: 0, y: 0 },
  debugTerminals: { x: 0, y: 0 },
  debugPaths: { x: 0, y: 0 },
} satisfies Record<string, XY>;

/* ============================================================================
  WIRE_OFFSET

  Manual adjustment guide:
  x positive = move right
  x negative = move left
  y positive = move down
  y negative = move up

  Important:
  Dot paths automatically include matching WIRE_OFFSET values through
  DOT_PATH_WIRE_OFFSET_KEY, then DOT_PATH_OFFSET is applied as extra fine tuning.
============================================================================ */

const WIRE_OFFSET = {
  anodeWire: { x: 0, y: 0 },
  cathodeWire: { x: 0, y: 0 },
  collectorWire: { x: 0, y: 0 },
  emitterWire: { x: 0, y: 0 },
} satisfies Record<string, XY>;

/* ============================================================================
  DOT_PATH_OFFSET

  Manual adjustment guide:
  x positive = move dot path right
  x negative = move dot path left
  y positive = move dot path down
  y negative = move dot path up

  These are fine-tuning offsets only.
  Matching COMPONENT_OFFSET and WIRE_OFFSET values are applied automatically.
============================================================================ */

const DOT_PATH_OFFSET = {
  anodePath: { x: 0, y: 0 },
  ledPath: { x: 0, y: 0 },
  cathodePath: { x: 0, y: 0 },
  collectorPath: { x: 0, y: 0 },
  emitterPath: { x: 0, y: 0 },
} satisfies Record<string, XY>;

type DotPathKey = keyof typeof DOT_PATH_OFFSET;

/* ============================================================================
  DEBUG_TERMINAL_OFFSET

  Manual adjustment guide:
  x positive = move right
  x negative = move left
  y positive = move down
  y negative = move up
============================================================================ */

const DEBUG_TERMINAL_OFFSET = {
  pin1Anode: { x: 0, y: 0 },
  pin2Cathode: { x: 0, y: 0 },
  pin4Collector: { x: 0, y: 0 },
  pin3Emitter: { x: 0, y: 0 },
  ledTop: { x: 0, y: 0 },
  ledBottom: { x: 0, y: 0 },
  collectorNode: { x: 0, y: 0 },
  emitterNode: { x: 0, y: 0 },
} satisfies Record<string, XY>;

type DebugTerminalKey = keyof typeof DEBUG_TERMINAL_OFFSET;

/* ============================================================================
  NODE
============================================================================ */

const NODE = {
  pin1Anode: { x: 414, y: 353 },
  pin2Cathode: { x: 414, y: 811 },
  pin4Collector: { x: 1123, y: 353 },
  pin3Emitter: { x: 1123, y: 811 },

  ledTop: { x: 606, y: 476 },
  ledBottom: { x: 606, y: 688 },

  collectorNode: { x: 914, y: 548 },
  emitterNode: { x: 914, y: 620 },
} satisfies Record<DebugTerminalKey, XY>;

/* ============================================================================
  PATH
============================================================================ */

const PATH = {
  currentDot: {
    // Pin 1 Anode → LED top
    anodePath: "M414 353 L606 353 L606 476",

    // LED top → LED bottom
    ledPath: "M606 476 L606 536 L606 628 L606 688",

    // LED bottom → Pin 2 Cathode
    cathodePath: "M606 688 L606 811 L414 811",

    // Pin 4 Collector → phototransistor collector
    collectorPath: "M1123 353 L989 353 L989 481 L914 548",

    // Phototransistor emitter → Pin 3 Emitter
    emitterPath: "M914 620 L989 681 L989 811 L1123 811",
  } satisfies Record<DotPathKey, string>,

  wire: {
    anodeWire: "M414 353 L606 353 L606 535",
    cathodeWire: "M414 811 L606 811 L606 628",
    collectorWire: "M1123 353 L989 353 L989 481 L914 548",
    emitterWire: "M1123 811 L989 811 L989 681 L914 620",
  },

  terminalGlow: {
    pin1: "M250 308 L430 308 L430 394 L250 394 Z",
    pin2: "M250 766 L430 766 L430 852 L250 852 Z",
    pin4: "M1106 308 L1288 308 L1288 394 L1106 394 Z",
    pin3: "M1106 766 L1288 766 L1288 852 L1106 852 Z",
  },

  debugLabelPosition: {
    anodePath: { x: 465, y: 325 },
    ledPath: { x: 620, y: 720 },
    cathodePath: { x: 455, y: 850 },
    collectorPath: { x: 980, y: 326 },
    emitterPath: { x: 950, y: 855 },
  } satisfies Record<DotPathKey, XY>,
};

/* ============================================================================
  Dot-path alignment maps

  These keep animated dots aligned when COMPONENT_OFFSET or WIRE_OFFSET changes.
============================================================================ */

const DOT_PATH_COMPONENT_OFFSET_KEY = {
  anodePath: "diode",
  ledPath: "diode",
  cathodePath: "diode",
  collectorPath: "transistor",
  emitterPath: "transistor",
} satisfies Record<DotPathKey, keyof typeof COMPONENT_OFFSET>;

const DOT_PATH_WIRE_OFFSET_KEY = {
  anodePath: "anodeWire",
  ledPath: null,
  cathodePath: "cathodeWire",
  collectorPath: "collectorWire",
  emitterPath: "emitterWire",
} satisfies Record<DotPathKey, keyof typeof WIRE_OFFSET | null>;

const DEBUG_TERMINAL_COMPONENT_OFFSET_KEY = {
  pin1Anode: "pins",
  pin2Cathode: "pins",
  pin4Collector: "pins",
  pin3Emitter: "pins",
  ledTop: "diode",
  ledBottom: "diode",
  collectorNode: "transistor",
  emitterNode: "transistor",
} satisfies Record<DebugTerminalKey, keyof typeof COMPONENT_OFFSET>;

/* ============================================================================
  SIMULATION
============================================================================ */

const SIMULATION = {
  cycleDurationMs: 5200,
  minSpeed: 0.4,
  maxSpeed: 3,
  speedStep: 0.1,
  defaultSpeed: 1,
  steps: [
    {
      id: 0,
      name: "Step 1: Input current flows from Pin 1 and returns to Pin 2",
      shortName: "Input",
    },
    {
      id: 1,
      name: "Step 2: LED turns ON",
      shortName: "LED ON",
    },
    {
      id: 2,
      name: "Step 3: Light crosses to phototransistor",
      shortName: "Light",
    },
    {
      id: 3,
      name: "Step 4: Phototransistor turns ON and output current flows",
      shortName: "Output",
    },
  ] as const,
};

/* ============================================================================
  ANIMATION
============================================================================ */

const ANIMATION = {
  inputDotCount: 5,
  ledDotCount: 4,
  outputDotCount: 5,
  dotDurationBaseSec: 1.35,
  lightPulseBaseSec: 1.15,
};

/* ============================================================================
  CONTROL_STYLE
============================================================================ */

const CONTROL_STYLE = {
  wrapper:
    "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100",
  row: "grid gap-3",
  button:
    "rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-black text-neutral-800 transition hover:bg-neutral-100 active:scale-[0.98]",
  buttonActive:
    "rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-black text-white transition hover:bg-neutral-800 active:scale-[0.98]",
  buttonDanger:
    "rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-black text-neutral-700 transition hover:bg-red-50 hover:text-red-700 active:scale-[0.98]",
  speedWrapper: "flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3",
  range: "h-2 w-full cursor-pointer accent-neutral-900",
  label: "text-sm font-black text-neutral-700",
  stepBadge:
    "rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-black text-neutral-700",

  timelineWrapper:
    "mb-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm",
  timelineTop:
    "mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
  timelineText: "text-sm font-medium text-neutral-800",
  timelineState:
    "rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700",
  timelineTrack: "relative h-3 overflow-hidden rounded-full bg-neutral-200",
  timelineFill: "h-full rounded-full transition-[width]",
  markerRow: "mt-3 grid grid-cols-4 gap-2",
  marker:
    "flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-center text-[11px] font-medium text-neutral-500",
  markerActive:
    "flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center text-[11px] font-medium",
  markerDot: "h-2 w-2 rounded-full bg-current",

  legend:
    "mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-neutral-200 bg-white p-3 text-xs font-medium text-neutral-700 shadow-sm sm:grid-cols-4",
  legendItem: "flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2",
};

/* ============================================================================
  Helper functions
============================================================================ */

function move(offset: XY) {
  return `translate(${offset.x} ${offset.y})`;
}

function addXY(...points: XY[]) {
  return points.reduce(
    (total, point) => ({
      x: total.x + point.x,
      y: total.y + point.y,
    }),
    { x: 0, y: 0 }
  );
}

function safeSpeed(value: number) {
  if (!Number.isFinite(value)) return SIMULATION.defaultSpeed;
  return Math.max(SIMULATION.minSpeed, Math.min(SIMULATION.maxSpeed, value));
}

function animationDuration(baseSeconds: number, speed: number) {
  return `${baseSeconds / safeSpeed(speed)}s`;
}

function toStep(value: number): SimulationStep {
  return Math.max(0, Math.min(3, Math.floor(value))) as SimulationStep;
}

function stepColor(step: SimulationStep) {
  if (step === 0) return COLORS.inputCurrent;
  if (step === 1) return COLORS.ledCurrent;
  if (step === 2) return COLORS.lightBeam;
  return COLORS.outputCurrent;
}

function createSvgIds(baseId: string): SvgIds {
  return {
    pencilWobble: `${baseId}-pencilWobble`,
    softPaper: `${baseId}-softPaper`,
    lightHatch: `${baseId}-lightHatch`,
    denseHatch: `${baseId}-denseHatch`,
    bodyShade: `${baseId}-bodyShade`,
    metalShade: `${baseId}-metalShade`,
    arrowHead: `${baseId}-arrowHead`,
  };
}

function urlOf(id: string) {
  return `url(#${id})`;
}

function dotPathTransform(pathKey: DotPathKey) {
  const componentKey = DOT_PATH_COMPONENT_OFFSET_KEY[pathKey];
  const wireKey = DOT_PATH_WIRE_OFFSET_KEY[pathKey];

  const offset = addXY(
    COMPONENT_OFFSET.currentDots,
    COMPONENT_OFFSET[componentKey],
    wireKey ? WIRE_OFFSET[wireKey] : { x: 0, y: 0 },
    DOT_PATH_OFFSET[pathKey]
  );

  return `translate(${offset.x} ${offset.y}) scale(${SCALE.CURRENT_DOT_SCALE})`;
}

function debugTerminalPoint(key: DebugTerminalKey) {
  const componentKey = DEBUG_TERMINAL_COMPONENT_OFFSET_KEY[key];

  return addXY(
    NODE[key],
    COMPONENT_OFFSET.debugTerminals,
    COMPONENT_OFFSET[componentKey],
    DEBUG_TERMINAL_OFFSET[key]
  );
}

/* ============================================================================
  SVG defs
============================================================================ */

function SvgDefs({ ids }: { ids: SvgIds }) {
  return (
    <defs>
      <filter id={ids.pencilWobble} x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.018"
          numOctaves="2"
          seed="10"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="1.05"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter id={ids.softPaper} x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.045"
          numOctaves="3"
          seed="4"
          result="paperNoise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="paperNoise"
          scale="0.35"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <pattern
        id={ids.lightHatch}
        patternUnits="userSpaceOnUse"
        width="16"
        height="16"
        patternTransform="rotate(21)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="16"
          stroke="#666666"
          strokeWidth="1.1"
          opacity="0.23"
        />
      </pattern>

      <pattern
        id={ids.denseHatch}
        patternUnits="userSpaceOnUse"
        width="12"
        height="12"
        patternTransform="rotate(20)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="12"
          stroke="#444444"
          strokeWidth="1.5"
          opacity="0.32"
        />
      </pattern>

      <linearGradient id={ids.bodyShade} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="48%" stopColor="#f7f7f7" />
        <stop offset="100%" stopColor="#e2e2e2" />
      </linearGradient>

      <linearGradient id={ids.metalShade} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f7f7f7" />
        <stop offset="40%" stopColor="#cfcfcf" />
        <stop offset="70%" stopColor="#eeeeee" />
        <stop offset="100%" stopColor="#bdbdbd" />
      </linearGradient>

      <marker
        id={ids.arrowHead}
        viewBox="0 0 12 12"
        refX="10.5"
        refY="6"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <path d="M0 0 L12 6 L0 12 Z" fill="#111111" />
      </marker>
    </defs>
  );
}

/* ============================================================================
  Reusable SVG primitives
============================================================================ */

function SketchPath({
  d,
  ids,
  strokeWidth = STROKE.main,
  fill = "none",
  markerEnd,
  opacity = 1,
  stroke = COLORS.ink,
}: {
  d: string;
  ids: SvgIds;
  strokeWidth?: number;
  fill?: string;
  markerEnd?: string;
  opacity?: number;
  stroke?: string;
}) {
  return (
    <g filter={urlOf(ids.pencilWobble)} opacity={opacity}>
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={markerEnd}
      />
      <path
        d={d}
        fill="none"
        stroke={COLORS.graphite}
        strokeWidth={Math.max(0.8, strokeWidth * 0.32)}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.35}
        transform="translate(1.5 -1)"
      />
      <path
        d={d}
        fill="none"
        stroke={COLORS.graphiteLight}
        strokeWidth={Math.max(0.6, strokeWidth * 0.16)}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.35}
        transform="translate(-1 1)"
      />
    </g>
  );
}

function ActiveGlowPath({
  d,
  color,
  active,
  speed,
  opacity = 0.35,
  strokeWidth = 10,
}: {
  d: string;
  color: string;
  active: boolean;
  speed: number;
  opacity?: number;
  strokeWidth?: number;
}) {
  if (!active) return null;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    >
      <animate
        attributeName="opacity"
        values={`${opacity * 0.45};${opacity};${opacity * 0.45}`}
        dur={animationDuration(1.2, speed)}
        repeatCount="indefinite"
      />
    </path>
  );
}

function ActiveGlowShape({
  d,
  color,
  active,
  speed,
  opacity = 0.35,
}: {
  d: string;
  color: string;
  active: boolean;
  speed: number;
  opacity?: number;
}) {
  if (!active) return null;

  return (
    <path d={d} fill={color} opacity={opacity}>
      <animate
        attributeName="opacity"
        values={`${opacity * 0.45};${opacity};${opacity * 0.45}`}
        dur={animationDuration(1.25, speed)}
        repeatCount="indefinite"
      />
    </path>
  );
}

function LabelText({
  x,
  y,
  children,
  anchor = "start",
  fill = COLORS.ink,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  fill?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize="46"
      fontWeight="400"
      fill={fill}
    >
      {children}
    </text>
  );
}

/* ============================================================================
  SVG blocks
============================================================================ */

function ExternalPins({
  ids,
  inputTerminalActive,
  outputTerminalActive,
  speed,
}: {
  ids: SvgIds;
  inputTerminalActive: boolean;
  outputTerminalActive: boolean;
  speed: number;
}) {
  return (
    <g transform={move(COMPONENT_OFFSET.pins)} filter={urlOf(ids.pencilWobble)}>
      <ActiveGlowShape
        d={PATH.terminalGlow.pin1}
        color={COLORS.inputCurrent}
        active={inputTerminalActive}
        speed={speed}
        opacity={0.28}
      />
      <ActiveGlowShape
        d={PATH.terminalGlow.pin2}
        color={COLORS.inputCurrent}
        active={inputTerminalActive}
        speed={speed}
        opacity={0.24}
      />
      <ActiveGlowShape
        d={PATH.terminalGlow.pin4}
        color={COLORS.outputCurrent}
        active={outputTerminalActive}
        speed={speed}
        opacity={0.28}
      />
      <ActiveGlowShape
        d={PATH.terminalGlow.pin3}
        color={COLORS.outputCurrent}
        active={outputTerminalActive}
        speed={speed}
        opacity={0.24}
      />

      <rect
        x="338"
        y="324"
        width="76"
        height="58"
        fill={urlOf(ids.metalShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
      />
      <path
        d="M261 341 L338 341 L338 366 L261 366 Z"
        fill={urlOf(ids.metalShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
        strokeLinejoin="round"
      />

      <rect
        x="338"
        y="782"
        width="76"
        height="58"
        fill={urlOf(ids.metalShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
      />
      <path
        d="M261 799 L338 799 L338 824 L261 824 Z"
        fill={urlOf(ids.metalShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
        strokeLinejoin="round"
      />

      <rect
        x="1123"
        y="324"
        width="76"
        height="58"
        fill={urlOf(ids.metalShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
      />
      <path
        d="M1199 341 L1276 341 L1276 366 L1199 366 Z"
        fill={urlOf(ids.metalShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
        strokeLinejoin="round"
      />

      <rect
        x="1123"
        y="782"
        width="76"
        height="58"
        fill={urlOf(ids.metalShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
      />
      <path
        d="M1199 799 L1276 799 L1276 824 L1199 824 Z"
        fill={urlOf(ids.metalShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
        strokeLinejoin="round"
      />

      <path d="M350 334 L402 324" stroke={COLORS.graphite} strokeWidth="1" opacity="0.35" />
      <path d="M350 368 L410 350" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />
      <path d="M350 794 L402 784" stroke={COLORS.graphite} strokeWidth="1" opacity="0.35" />
      <path d="M350 828 L410 810" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />

      <path d="M1135 334 L1188 324" stroke={COLORS.graphite} strokeWidth="1" opacity="0.35" />
      <path d="M1135 368 L1195 350" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />
      <path d="M1135 794 L1188 784" stroke={COLORS.graphite} strokeWidth="1" opacity="0.35" />
      <path d="M1135 828 L1195 810" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />
    </g>
  );
}

function MainBody({ ids }: { ids: SvgIds }) {
  return (
    <g transform={move(COMPONENT_OFFSET.body)}>
      <rect
        x="415"
        y="230"
        width="706"
        height="690"
        rx="45"
        ry="45"
        fill={urlOf(ids.bodyShade)}
        stroke={COLORS.ink}
        strokeWidth={STROKE.outer}
        filter={urlOf(ids.pencilWobble)}
      />

      <rect
        x="438"
        y="254"
        width="660"
        height="642"
        rx="34"
        ry="34"
        fill={COLORS.paper}
        stroke={COLORS.ink}
        strokeWidth={STROKE.inner}
        filter={urlOf(ids.pencilWobble)}
      />

      <rect
        x="420"
        y="236"
        width="696"
        height="678"
        rx="42"
        ry="42"
        fill={urlOf(ids.lightHatch)}
        opacity="0.55"
        pointerEvents="none"
      />

      <rect
        x="438"
        y="254"
        width="660"
        height="642"
        rx="34"
        ry="34"
        fill={COLORS.paper}
        stroke={COLORS.ink}
        strokeWidth={STROKE.inner}
        filter={urlOf(ids.pencilWobble)}
      />

      <path
        d="M720 230 Q720 292 768 292 Q816 292 816 230 Z"
        fill="#f4f4f4"
        stroke={COLORS.ink}
        strokeWidth={STROKE.main}
        filter={urlOf(ids.pencilWobble)}
      />
      <path
        d="M727 240 Q737 280 768 283 Q798 280 808 240"
        fill="none"
        stroke={COLORS.graphite}
        strokeWidth={STROKE.fine}
        opacity="0.55"
      />

      <path
        d="M455 270 C610 260 925 260 1080 270"
        stroke={COLORS.graphite}
        strokeWidth={1}
        opacity={0.18}
        fill="none"
      />
      <path
        d="M455 878 C610 890 925 890 1080 878"
        stroke={COLORS.graphite}
        strokeWidth={1}
        opacity={0.18}
        fill="none"
      />
    </g>
  );
}

function LedDiodeSection({
  ids,
  inputActive,
  ledActive,
  speed,
}: {
  ids: SvgIds;
  inputActive: boolean;
  ledActive: boolean;
  speed: number;
}) {
  return (
    <g transform={move(COMPONENT_OFFSET.diode)}>
      <g transform={move(WIRE_OFFSET.anodeWire)}>
        <ActiveGlowPath
          d={PATH.wire.anodeWire}
          color={COLORS.inputCurrent}
          active={inputActive}
          speed={speed}
        />
        <SketchPath
          ids={ids}
          d={PATH.wire.anodeWire}
          strokeWidth={STROKE.symbol * SCALE.CIRCUIT_WIRE_SCALE}
        />
      </g>

      <g transform={move(WIRE_OFFSET.cathodeWire)}>
        <ActiveGlowPath
          d={PATH.wire.cathodeWire}
          color={COLORS.inputCurrent}
          active={inputActive}
          speed={speed}
          opacity={0.3}
        />
        <SketchPath
          ids={ids}
          d={PATH.wire.cathodeWire}
          strokeWidth={STROKE.symbol * SCALE.CIRCUIT_WIRE_SCALE}
        />
      </g>

      {ledActive && (
        <circle cx="606" cy="582" r="115" fill={COLORS.ledCurrentSoft} opacity="0.42">
          <animate
            attributeName="opacity"
            values="0.2;0.48;0.2"
            dur={animationDuration(1.3, speed)}
            repeatCount="indefinite"
          />
        </circle>
      )}

      <g filter={urlOf(ids.pencilWobble)}>
        <path
          d="M556 536 L656 536 L606 628 Z"
          fill={ledActive ? COLORS.activeAmber : urlOf(ids.denseHatch)}
          stroke={COLORS.ink}
          strokeWidth={STROKE.symbol}
          strokeLinejoin="round"
        />
        <path
          d="M556 628 L656 628"
          stroke={COLORS.ink}
          strokeWidth={STROKE.symbol}
          strokeLinecap="round"
        />
        <path
          d="M606 628 L606 688"
          stroke={COLORS.ink}
          strokeWidth={STROKE.symbol}
          strokeLinecap="round"
        />
        <path
          d="M606 476 L606 536"
          stroke={COLORS.ink}
          strokeWidth={STROKE.symbol}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function OpticalArrows({
  ids,
  active,
  speed,
}: {
  ids: SvgIds;
  active: boolean;
  speed: number;
}) {
  const arrows = [
    { d: "M704 536 L811 536", delay: 0 },
    { d: "M704 586 L811 586", delay: 0.12 },
    { d: "M704 636 L811 636", delay: 0.24 },
  ];

  return (
    <g transform={move(COMPONENT_OFFSET.arrows)}>
      {active &&
        arrows.map((arrow) => (
          <path
            key={`glow-${arrow.d}`}
            d={arrow.d}
            fill="none"
            stroke={COLORS.lightBeam}
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.4}
            markerEnd={urlOf(ids.arrowHead)}
          >
            <animate
              attributeName="opacity"
              values="0.12;0.52;0.12"
              dur={animationDuration(ANIMATION.lightPulseBaseSec, speed)}
              begin={`${arrow.delay}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}

      {arrows.map((arrow) => (
        <SketchPath
          key={arrow.d}
          ids={ids}
          d={arrow.d}
          stroke={active ? COLORS.lightBeam : COLORS.ink}
          strokeWidth={active ? STROKE.arrow + 1.2 : STROKE.arrow}
          markerEnd={urlOf(ids.arrowHead)}
        />
      ))}
    </g>
  );
}

function TransistorSection({
  ids,
  outputActive,
  speed,
}: {
  ids: SvgIds;
  outputActive: boolean;
  speed: number;
}) {
  return (
    <g transform={move(COMPONENT_OFFSET.transistor)}>
      <g transform={move(WIRE_OFFSET.collectorWire)}>
        <ActiveGlowPath
          d={PATH.wire.collectorWire}
          color={COLORS.outputCurrent}
          active={outputActive}
          speed={speed}
        />
        <SketchPath
          ids={ids}
          d={PATH.wire.collectorWire}
          strokeWidth={STROKE.symbol * SCALE.CIRCUIT_WIRE_SCALE}
        />
      </g>

      <g transform={move(WIRE_OFFSET.emitterWire)}>
        <ActiveGlowPath
          d={PATH.wire.emitterWire}
          color={COLORS.outputCurrentDark}
          active={outputActive}
          speed={speed}
          opacity={0.32}
        />
        <SketchPath
          ids={ids}
          d={PATH.wire.emitterWire}
          strokeWidth={STROKE.symbol * SCALE.CIRCUIT_WIRE_SCALE}
        />
      </g>

      {outputActive && (
        <ellipse cx="930" cy="596" rx="95" ry="145" fill={COLORS.activeGreen} opacity="0.45">
          <animate
            attributeName="opacity"
            values="0.18;0.48;0.18"
            dur={animationDuration(1.25, speed)}
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      <g filter={urlOf(ids.pencilWobble)}>
        <path
          d="M900 523 L914 523 L914 665 L900 665 Z"
          fill={outputActive ? COLORS.activeGreen : urlOf(ids.denseHatch)}
          stroke={COLORS.ink}
          strokeWidth={STROKE.inner}
          strokeLinejoin="round"
        />

        <path
          d="M914 548 L990 482"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={STROKE.symbol}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M914 620 L990 682"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={STROKE.symbol}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M958 651 L1001 685 L950 672 Z"
          fill={outputActive ? COLORS.outputCurrent : urlOf(ids.denseHatch)}
          stroke={COLORS.ink}
          strokeWidth={STROKE.inner}
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

function PinLabels({
  ids,
  showLabels,
}: {
  ids: SvgIds;
  showLabels: boolean;
}) {
  if (!showLabels) return null;

  return (
    <g transform={move(COMPONENT_OFFSET.labels)}>
      <LabelText x={104} y={276}>Pin 1</LabelText>
      <LabelText x={92} y={338}>Anode</LabelText>
      <SketchPath
        ids={ids}
        d="M254 319 L323 319"
        strokeWidth={STROKE.arrow}
        markerEnd={urlOf(ids.arrowHead)}
      />

      <LabelText x={104} y={801}>Pin 2</LabelText>
      <LabelText x={74} y={863}>Cathode</LabelText>
      <SketchPath
        ids={ids}
        d="M254 820 L323 820"
        strokeWidth={STROKE.arrow}
        markerEnd={urlOf(ids.arrowHead)}
      />

      <LabelText x={1322} y={276}>Pin 4</LabelText>
      <LabelText x={1300} y={338}>Collector</LabelText>
      <SketchPath
        ids={ids}
        d="M1288 319 L1220 319"
        strokeWidth={STROKE.arrow}
        markerEnd={urlOf(ids.arrowHead)}
      />

      <LabelText x={1322} y={801}>Pin 3</LabelText>
      <LabelText x={1300} y={863}>Emitter</LabelText>
      <SketchPath
        ids={ids}
        d="M1288 820 L1220 820"
        strokeWidth={STROKE.arrow}
        markerEnd={urlOf(ids.arrowHead)}
      />
    </g>
  );
}

function ExtraPencilMarks({ ids }: { ids: SvgIds }) {
  return (
    <g transform={move(COMPONENT_OFFSET.texture)} filter={urlOf(ids.softPaper)} opacity={0.55}>
      <path d="M430 245 C580 225 950 228 1102 244" stroke={COLORS.graphite} strokeWidth="1.3" fill="none" opacity="0.25" />
      <path d="M428 900 C600 925 940 922 1104 900" stroke={COLORS.graphite} strokeWidth="1.3" fill="none" opacity="0.22" />
      <path d="M450 265 L430 890" stroke={COLORS.graphite} strokeWidth="1" opacity="0.16" />
      <path d="M1086 265 L1105 890" stroke={COLORS.graphite} strokeWidth="1" opacity="0.16" />

      <path d="M476 292 C615 280 910 280 1058 292" stroke={COLORS.graphite} strokeWidth="1" fill="none" opacity="0.1" />
      <path d="M475 870 C620 882 905 882 1058 870" stroke={COLORS.graphite} strokeWidth="1" fill="none" opacity="0.1" />

      <path d="M350 330 L398 316" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />
      <path d="M350 806 L398 792" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />
      <path d="M1136 330 L1184 316" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />
      <path d="M1136 806 L1184 792" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />

      <path d="M575 545 L636 536" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />
      <path d="M905 535 L913 660" stroke={COLORS.graphite} strokeWidth="1" opacity="0.25" />
    </g>
  );
}

function AnimatedDots({
  active,
  pathKey,
  color,
  glowColor,
  count,
  speed,
  radius = 8,
  glowOpacity = 0.22,
}: {
  active: boolean;
  pathKey: DotPathKey;
  color: string;
  glowColor: string;
  count: number;
  speed: number;
  radius?: number;
  glowOpacity?: number;
}) {
  if (!active) return null;

  const pathD = PATH.currentDot[pathKey];
  const duration = ANIMATION.dotDurationBaseSec / safeSpeed(speed);
  const delayStep = duration / count;

  return (
    <g transform={dotPathTransform(pathKey)} pointerEvents="none">
      {Array.from({ length: count }).map((_, index) => (
        <g key={`${pathKey}-${index}`}>
          <circle r={radius + 7} fill={glowColor} opacity={glowOpacity}>
            <animateMotion
              path={pathD}
              dur={`${duration}s`}
              begin={`${index * delayStep}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle r={radius} fill={color} stroke={COLORS.paper} strokeWidth="2" opacity="0.96">
            <animateMotion
              path={pathD}
              dur={`${duration}s`}
              begin={`${index * delayStep}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </g>
  );
}

function CurrentDotLayer({
  showCurrentDots,
  step,
  isInputOn,
  isRunning,
  speed,
}: {
  showCurrentDots: boolean;
  step: SimulationStep;
  isInputOn: boolean;
  isRunning: boolean;
  speed: number;
}) {
  if (!showCurrentDots || !isInputOn || !isRunning) return null;

  const inputActive = step === 0;
  const ledActive = step === 1;
  const outputActive = step === 3;

  return (
    <g>
      <AnimatedDots
        active={inputActive}
        pathKey="anodePath"
        color={COLORS.inputCurrent}
        glowColor={COLORS.inputCurrentSoft}
        count={ANIMATION.inputDotCount}
        speed={speed}
      />

      <AnimatedDots
        active={inputActive}
        pathKey="cathodePath"
        color={COLORS.inputCurrentDark}
        glowColor={COLORS.inputCurrentSoft}
        count={ANIMATION.inputDotCount}
        speed={speed}
        radius={7}
      />

      <AnimatedDots
        active={ledActive}
        pathKey="ledPath"
        color={COLORS.ledCurrent}
        glowColor={COLORS.ledCurrentSoft}
        count={ANIMATION.ledDotCount}
        speed={speed}
        radius={7}
        glowOpacity={0.28}
      />

      <AnimatedDots
        active={outputActive}
        pathKey="collectorPath"
        color={COLORS.outputCurrent}
        glowColor={COLORS.outputCurrentSoft}
        count={ANIMATION.outputDotCount}
        speed={speed}
      />

      <AnimatedDots
        active={outputActive}
        pathKey="emitterPath"
        color={COLORS.outputCurrentDark}
        glowColor={COLORS.outputCurrentSoft}
        count={ANIMATION.outputDotCount}
        speed={speed}
        radius={7}
        glowOpacity={0.18}
      />
    </g>
  );
}

function DebugPathLayer({
  showDebugPaths,
}: {
  showDebugPaths: boolean;
}) {
  if (!showDebugPaths) return null;

  const paths: Array<{
    key: DotPathKey;
    label: string;
    color: string;
  }> = [
    { key: "anodePath", label: "anodePath", color: COLORS.debugAnode },
    { key: "ledPath", label: "ledPath", color: COLORS.debugLed },
    { key: "cathodePath", label: "cathodePath", color: COLORS.debugCathode },
    { key: "collectorPath", label: "collectorPath", color: COLORS.debugCollector },
    { key: "emitterPath", label: "emitterPath", color: COLORS.debugEmitter },
  ];

  return (
    <g transform={move(COMPONENT_OFFSET.debugPaths)} pointerEvents="none">
      {paths.map((item) => {
        const labelPoint = PATH.debugLabelPosition[item.key];

        return (
          <g key={item.key} transform={dotPathTransform(item.key)}>
            <path
              d={PATH.currentDot[item.key]}
              fill="none"
              stroke={item.color}
              strokeWidth={STROKE.debugPath}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="10 8"
              opacity={0.72}
            />
            <circle cx={labelPoint.x} cy={labelPoint.y - 8} r={5} fill={item.color} />
            <text
              x={labelPoint.x + 10}
              y={labelPoint.y}
              fontSize={18}
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight={700}
              fill={item.color}
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function DebugTerminalLayer({
  showDebugTerminals,
}: {
  showDebugTerminals: boolean;
}) {
  if (!showDebugTerminals) return null;

  const points: Array<{
    key: DebugTerminalKey;
    label: string;
  }> = [
    { key: "pin1Anode", label: "Pin 1 Anode" },
    { key: "pin2Cathode", label: "Pin 2 Cathode" },
    { key: "pin4Collector", label: "Pin 4 Collector" },
    { key: "pin3Emitter", label: "Pin 3 Emitter" },
    { key: "ledTop", label: "LED Top" },
    { key: "ledBottom", label: "LED Bottom" },
    { key: "collectorNode", label: "Collector Node" },
    { key: "emitterNode", label: "Emitter Node" },
  ];

  return (
    <g fontFamily="Arial, Helvetica, sans-serif" pointerEvents="none">
      {points.map((item) => {
        const point = debugTerminalPoint(item.key);

        return (
          <g key={item.key}>
            <circle cx={point.x} cy={point.y} r={8} fill={COLORS.debug} stroke={COLORS.paper} strokeWidth={3} />
            <text x={point.x + 12} y={point.y - 10} fontSize={18} fill={COLORS.debugText} fontWeight={700}>
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ============================================================================
  UI blocks
============================================================================ */

function LegendBlock({ showLegend }: { showLegend: boolean }) {
  if (!showLegend) return null;

  const items = [
    { label: "Red = input current", color: COLORS.inputCurrent },
    { label: "Amber = LED ON", color: COLORS.ledCurrent },
    { label: "Yellow = light transfer", color: COLORS.lightBeam },
    { label: "Green = output current", color: COLORS.outputCurrent },
  ];

  return (
    <div className={CONTROL_STYLE.legend}>
      {items.map((item) => (
        <div key={item.label} className={CONTROL_STYLE.legendItem}>
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function TimelineBar({
  showTimeline,
  timelineProgress,
  step,
  isInputOn,
}: {
  showTimeline: boolean;
  timelineProgress: number;
  step: SimulationStep;
  isInputOn: boolean;
}) {
  if (!showTimeline) return null;

  return (
    <div className={CONTROL_STYLE.timelineWrapper}>
      <div className={CONTROL_STYLE.timelineTop}>
        <div className={CONTROL_STYLE.timelineText}>
          {isInputOn ? SIMULATION.steps[step].name : "Input OFF: no current flow"}
        </div>

        <div className={CONTROL_STYLE.timelineState}>
          {isInputOn ? `Active: ${SIMULATION.steps[step].shortName}` : "OFF state"}
        </div>
      </div>

      <div className={CONTROL_STYLE.timelineTrack}>
        <div
          className={CONTROL_STYLE.timelineFill}
          style={{
            width: `${Math.round(timelineProgress * 100)}%`,
            background: isInputOn ? stepColor(step) : COLORS.ink,
          }}
        />
      </div>

      <div className={CONTROL_STYLE.markerRow}>
        {SIMULATION.steps.map((item) => {
          const isActive = isInputOn && step === item.id;
          const color = stepColor(item.id);

          return (
            <div
              key={item.id}
              className={isActive ? CONTROL_STYLE.markerActive : CONTROL_STYLE.marker}
              style={
                isActive
                  ? {
                      background: color,
                      borderColor: color,
                      color: item.id === 1 || item.id === 2 ? "#422006" : COLORS.paper,
                    }
                  : undefined
              }
            >
              <span className={CONTROL_STYLE.markerDot} />
              <span>{item.shortName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ControlPanel({
  showControls,
  controlMode,
  isRunning,
  isInputOn,
  speed,
  step,
  onControlModeChange,
  onToggleRunning,
  onToggleInput,
  onReset,
  onSpeedChange,
}: {
  showControls: boolean;
  controlMode: ControlMode;
  isRunning: boolean;
  isInputOn: boolean;
  speed: number;
  step: SimulationStep;
  onControlModeChange: (mode: ControlMode) => void;
  onToggleRunning: () => void;
  onToggleInput: () => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
}) {
  if (!showControls) return null;

  const activeStepColor = stepColor(step);

  return (
    <div className={CONTROL_STYLE.wrapper}>
      <div className="mb-4 rounded-2xl bg-slate-950 p-4 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
          Control Panel
        </p>
        <h3 className="mt-2 text-lg font-black">Optocoupler Pins</h3>
      </div>

      <div className={CONTROL_STYLE.row}>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Mode Select
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onControlModeChange("onOff")}
              className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                controlMode === "onOff"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              ON/OFF Mode
            </button>
            <button
              type="button"
              onClick={() => onControlModeChange("timeline")}
              className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                controlMode === "timeline"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Timeline Mode
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleRunning}
          className={isRunning ? CONTROL_STYLE.buttonActive : CONTROL_STYLE.button}
          aria-pressed={isRunning}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          type="button"
          onClick={onToggleInput}
          className={isInputOn ? CONTROL_STYLE.buttonActive : CONTROL_STYLE.button}
          aria-pressed={isInputOn}
          style={
            isInputOn
              ? {
                  background: COLORS.inputCurrent,
                  borderColor: COLORS.inputCurrent,
                }
              : undefined
          }
        >
          {isInputOn ? "Input ON" : "Input OFF"}
        </button>

        <button type="button" onClick={onReset} className={CONTROL_STYLE.buttonDanger}>
          Reset
        </button>

        <div
          className={CONTROL_STYLE.stepBadge}
          style={
            isInputOn
              ? {
                  borderColor: activeStepColor,
                  background: `${activeStepColor}22`,
                }
              : undefined
          }
        >
          {isInputOn ? SIMULATION.steps[step].name : "Input OFF"}
        </div>

        <label className={CONTROL_STYLE.speedWrapper}>
          <span className={CONTROL_STYLE.label}>Speed</span>
          <input
            type="range"
            min={SIMULATION.minSpeed}
            max={SIMULATION.maxSpeed}
            step={SIMULATION.speedStep}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.currentTarget.value))}
            className={CONTROL_STYLE.range}
          />
          <span className="text-sm font-black text-neutral-700">
            {speed.toFixed(1)}x
          </span>
        </label>
      </div>
    </div>
  );
}

/* ============================================================================
  Main component
============================================================================ */

export default function OptocouplerSketch({
  className = "",
  showBackground = true,
  showControls = true,
  showTimeline = true,
  showCurrentDots = true,
  showLabels = true,
  showLegend = true,
  showDebugTerminals = false,
  showDebugPaths = false,
  autoStart = false,
  initialRunning = false,
  simulationSpeed = SIMULATION.defaultSpeed,
}: OptocouplerSketchProps) {
  const reactId = useId();

  const safeBaseId = useMemo(
    () => `common-optocoupler-pins-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [reactId]
  );

  const ids = useMemo(() => createSvgIds(safeBaseId), [safeBaseId]);

  const [isRunning, setIsRunning] = useState<boolean>(() => autoStart || initialRunning);
  const [isInputOn, setIsInputOn] = useState<boolean>(() => autoStart || initialRunning);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>(0);
  const [timelineProgress, setTimelineProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(() => safeSpeed(simulationSpeed));
  const [controlMode, setControlMode] = useState<ControlMode>("onOff");

  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    progressRef.current = timelineProgress;
  }, [timelineProgress]);

  useEffect(() => {
    setSpeed(safeSpeed(simulationSpeed));
  }, [simulationSpeed]);

  useEffect(() => {
    if (!isInputOn) {
      setTimelineProgress(0);
      setSimulationStep(0);
      progressRef.current = 0;
    }
  }, [isInputOn]);

  useEffect(() => {
    if (!isRunning || !isInputOn) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const duration = SIMULATION.cycleDurationMs / safeSpeed(speed);
    const startTime = performance.now() - progressRef.current * duration;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = (((elapsed % duration) + duration) % duration) / duration;
      const nextStep = toStep(progress * SIMULATION.steps.length);

      setTimelineProgress(progress);
      setSimulationStep(nextStep);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isRunning, isInputOn, speed]);

  const isTimelinePreviewActive = controlMode === "timeline" && isInputOn;
  const isVisualActive = isRunning || isTimelinePreviewActive;
  const inputWireActive = isInputOn && isVisualActive && simulationStep === 0;
  const ledActive = isInputOn && isVisualActive && simulationStep === 1;
  const lightActive = isInputOn && isVisualActive && simulationStep === 2;
  const outputActive = isInputOn && isVisualActive && simulationStep === 3;

  const handleToggleRunning = () => {
    setControlMode("onOff");
    setIsRunning((current) => {
      const nextValue = !current;

      if (nextValue && !isInputOn) {
        setIsInputOn(true);
      }

      return nextValue;
    });
  };

  const handleToggleInput = () => {
    setControlMode("onOff");
    setIsInputOn((current) => !current);
  };

  const handleReset = () => {
    setControlMode("onOff");
    setIsRunning(false);
    setIsInputOn(false);
    setSimulationStep(0);
    setTimelineProgress(0);
    progressRef.current = 0;
  };

  const handleSpeedChange = (value: number) => {
    setSpeed(safeSpeed(value));
  };

  const handleControlModeChange = (nextMode: ControlMode) => {
    setControlMode(nextMode);

    if (nextMode === "timeline") {
      const nextProgress = Math.min(0.999, Math.max(0, progressRef.current));
      const nextStep = toStep(nextProgress * SIMULATION.steps.length);

      setIsRunning(false);
      setIsInputOn(true);
      setTimelineProgress(nextProgress);
      setSimulationStep(nextStep);
    }
  };

  const handleTimeCursorChange = (nextCursor: number) => {
    const nextProgress = Math.min(0.999, Math.max(0, nextCursor));
    const nextStep = toStep(nextProgress * SIMULATION.steps.length);

    setControlMode("timeline");
    setIsRunning(false);
    setIsInputOn(true);
    setTimelineProgress(nextProgress);
    setSimulationStep(nextStep);
    progressRef.current = nextProgress;
  };

  return (
    <div
      className={`grid w-full gap-5 xl:grid-cols-[340px_minmax(0,1fr)] ${className}`}
    >
      <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
        <ControlPanel
          showControls={showControls}
          controlMode={controlMode}
          isRunning={isRunning}
          isInputOn={isInputOn}
          speed={speed}
          step={simulationStep}
          onControlModeChange={handleControlModeChange}
          onToggleRunning={handleToggleRunning}
          onToggleInput={handleToggleInput}
          onReset={handleReset}
          onSpeedChange={handleSpeedChange}
        />
      </aside>

      <div className="min-w-0 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        {showTimeline && (
          <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Time Cursor / Switching Preview
                </h2>
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
              onChange={(event) => handleTimeCursorChange(Number(event.target.value))}
              className="w-full accent-green-700"
              aria-label="Time Cursor / Switching Preview"
            />
          </section>
        )}

        <TimelineBar
          showTimeline={showTimeline}
          timelineProgress={timelineProgress}
          step={simulationStep}
          isInputOn={isInputOn}
        />

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-inner">
          <svg
            viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
            className="h-auto w-full"
            role="img"
            aria-label="Interactive optocoupler pin diagram with current flow animation"
            xmlns="http://www.w3.org/2000/svg"
          >
            <SvgDefs ids={ids} />

            {showBackground && (
              <rect
                x={VIEW_BOX.x}
                y={VIEW_BOX.y}
                width={VIEW_BOX.w}
                height={VIEW_BOX.h}
                fill={COLORS.paper}
              />
            )}

            <g
              transform={`scale(${SCALE.CIRCUIT_CANVAS_SCALE * SCALE.CIRCUIT_COMPONENT_SCALE})`}
            >
              <PinLabels ids={ids} showLabels={showLabels} />

              <ExternalPins
                ids={ids}
                inputTerminalActive={inputWireActive}
                outputTerminalActive={outputActive}
                speed={speed}
              />

              <MainBody ids={ids} />

              <LedDiodeSection
                ids={ids}
                inputActive={inputWireActive}
                ledActive={ledActive}
                speed={speed}
              />

              <OpticalArrows ids={ids} active={lightActive} speed={speed} />

              <TransistorSection
                ids={ids}
                outputActive={outputActive}
                speed={speed}
              />

              <DebugPathLayer showDebugPaths={showDebugPaths} />

              <CurrentDotLayer
                showCurrentDots={showCurrentDots}
                step={simulationStep}
                isInputOn={isInputOn}
                isRunning={isVisualActive}
                speed={speed}
              />

              <DebugTerminalLayer showDebugTerminals={showDebugTerminals} />

              <ExtraPencilMarks ids={ids} />
            </g>
          </svg>
        </div>

        <LegendBlock showLegend={showLegend} />
      </div>
    </div>
  );
}
