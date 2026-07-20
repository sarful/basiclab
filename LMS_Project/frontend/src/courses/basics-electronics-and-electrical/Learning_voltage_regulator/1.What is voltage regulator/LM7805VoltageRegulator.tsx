// LM7805VoltageRegulator.tsx
"use client";

import React from "react";

/* =========================================================
   TUNE AREA
   সব adjustment এখানে করো: scale, offset, wire, node, label
========================================================= */

type Point = {
  x: number;
  y: number;
};

type Box = Point & {
  w: number;
  h: number;
};

export type TerminalKey = "in" | "gnd" | "out";

type WireSegment = {
  id: string;
  from: Point;
  to: Point;
};

export const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 420,
  h: 860,
};

export const CIRCUIT_COMPONENT_SCALE = 1;
export const BASE_WIRE_WIDTH = 3;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const SCALE = {
  circuitCanvas: CIRCUIT_CANVAS_SCALE,
  circuitComponent: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
};

export const COMPONENT_OFFSET = {
  canvas: { x: 0, y: 0 },

  wholeRegulator: { x: 0, y: 0 },

  metalTab: { x: 0, y: 0 },
  mountingHole: { x: 0, y: 0 },

  plasticBody: { x: 0, y: 0 },
  plasticBodyMarkDot: { x: 0, y: 0 },

  textGroup: { x: 0, y: 0 },

  leads: {
    in: { x: 0, y: 0 },
    gnd: { x: 0, y: 0 },
    out: { x: 0, y: 0 },
  },
};

export const WIRE_OFFSET = {
  all: { x: 0, y: 0 },

  in: {
    start: { x: 0, y: 0 },
    wire: { x: -38, y: 0 },
    label: { x: -58, y: 0 },
  },

  gnd: {
    start: { x: 0, y: 0 },
    wire: { x: 0, y: 0 },
    label: { x: 0, y: 0 },
  },

  out: {
    start: { x: 0, y: 0 },
    wire: { x: 38, y: 0 },
    label: { x: 58, y: 0 },
  },
};

export const DEBUG_TERMINAL_OFFSET = {
  in: { x: 0, y: 0 },
  gnd: { x: 0, y: 0 },
  out: { x: 0, y: 0 },
};

export const DEBUG = {
  showTerminalDots: true,
  showWireJoints: true,
  showDebugNames: false,
};

export const BASE_COMPONENT = {
  metalTab: {
    x: 85,
    y: 24,
    w: 250,
    h: 220,
    cut: 28,
  },

  mountingHole: {
    cx: 210,
    cy: 100,
    r: 44,
  },

  plasticBody: {
    x: 70,
    y: 205,
    w: 280,
    h: 250,
    r: 8,
  },

  plasticBodyMarkDot: {
    cx: 104,
    cy: 386,
    r: 20,
  },

  textGroup: {
    x: 210,
    y: 315,
  },

  lead: {
    y: 440,
    w: 38,
    h: 320,
    shoulderY: 74,
    neckW: 23,
    tipW: 10,
  },

  leadCenterX: {
    in: 110,
    gnd: 210,
    out: 310,
  },

  terminal: {
    labelY: 795,
    labelW: 76,
    labelH: 38,
    wireDrop: 28,
    gapBeforeLabel: 8,
  },
};

export const NODE = {
  terminalRadius: 5,
  jointRadius: 3.5,
  debugRadius: 4,
  debugStrokeWidth: 1.5,
  stroke: "#ffffff",
};

export const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  radius: 999,
  colors: {
    in: "#0ea5e9",
    gnd: "#22c55e",
    out: "#ef4444",
  },
};

export const LABEL = {
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",

  bodyText: {
    fill: "#d8d8d8",
    letterSpacing: 2,
  },

  terminalText: {
    fill: "#ffffff",
    fontSize: 21,
    fontWeight: 700,
  },
};

export const PATH = {
  colors: {
    metalStroke: "#8b8b8b",
    bodyStroke: "#050505",
    leadStroke: "#888888",
  },

  shadows: {
    body: "url(#bodyShadow)",
    metal: "url(#metalShadow)",
    lead: "url(#leadShadow)",
  },
};

/* =========================================================
   HELPER FUNCTIONS
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

const terminalColor = (key: TerminalKey) => WIRE.colors[key];

const createMetalTabPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  cut: number,
) => {
  return `
    M ${x + cut} ${y}
    H ${x + w - cut}
    L ${x + w} ${y + cut}
    V ${y + h}
    H ${x}
    V ${y + cut}
    Z
  `;
};

const createLeadPath = (
  cx: number,
  y: number,
  w: number,
  h: number,
  shoulderY: number,
  neckW: number,
  tipW: number,
) => {
  const half = w / 2;
  const neckHalf = neckW / 2;
  const tipHalf = tipW / 2;

  const sy = y + shoulderY;
  const neckStartY = sy + 24;
  const tipY = y + h;

  return `
    M ${cx - half} ${y}
    H ${cx + half}
    V ${sy}
    L ${cx + neckHalf} ${neckStartY}
    V ${tipY - 14}
    L ${cx + tipHalf} ${tipY}
    H ${cx - tipHalf}
    L ${cx - neckHalf} ${tipY - 14}
    V ${neckStartY}
    L ${cx - half} ${sy}
    Z
  `;
};

const getLeadBottomPoint = (key: TerminalKey): Point => {
  const lead = COMPONENT.leads[key];

  return {
    x: lead.cx,
    y: lead.y + lead.h,
  };
};

const createWireSegments = (key: TerminalKey): WireSegment[] => {
  const leadEnd = getLeadBottomPoint(key);
  const terminal = COMPONENT.terminal[key];

  const start = addPoint(
    {
      x: leadEnd.x,
      y: leadEnd.y,
    },
    WIRE_OFFSET[key].start,
  );

  const end = {
    x: terminal.labelCenter.x,
    y: terminal.label.y - BASE_COMPONENT.terminal.gapBeforeLabel,
  };

  const bendY = start.y + BASE_COMPONENT.terminal.wireDrop;

  const offset = addPoint(WIRE_OFFSET.all, WIRE_OFFSET[key].wire);

  const p1 = addPoint(start, offset);
  const p2 = addPoint({ x: start.x, y: bendY }, offset);
  const p3 = addPoint({ x: end.x, y: bendY }, offset);
  const p4 = addPoint(end, offset);

  return [
    {
      id: `${key}-vertical-drop`,
      from: p1,
      to: p2,
    },
    {
      id: `${key}-horizontal-run`,
      from: p2,
      to: p3,
    },
    {
      id: `${key}-vertical-to-label`,
      from: p3,
      to: p4,
    },
  ];
};

const uniquePoints = (segments: WireSegment[]) => {
  const map = new Map<string, Point>();

  segments.forEach((segment) => {
    const a = `${segment.from.x}-${segment.from.y}`;
    const b = `${segment.to.x}-${segment.to.y}`;

    map.set(a, segment.from);
    map.set(b, segment.to);
  });

  return [...map.values()];
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
   COMPUTED COMPONENT CONSTANTS
========================================================= */

export const COMPONENT = {
  metalTab: addBox(
    {
      x: BASE_COMPONENT.metalTab.x,
      y: BASE_COMPONENT.metalTab.y,
      w: BASE_COMPONENT.metalTab.w,
      h: BASE_COMPONENT.metalTab.h,
    },
    COMPONENT_OFFSET.metalTab,
  ),

  mountingHole: addPoint(
    {
      x: BASE_COMPONENT.mountingHole.cx,
      y: BASE_COMPONENT.mountingHole.cy,
    },
    COMPONENT_OFFSET.mountingHole,
  ),

  plasticBody: addBox(
    {
      x: BASE_COMPONENT.plasticBody.x,
      y: BASE_COMPONENT.plasticBody.y,
      w: BASE_COMPONENT.plasticBody.w,
      h: BASE_COMPONENT.plasticBody.h,
    },
    COMPONENT_OFFSET.plasticBody,
  ),

  plasticBodyMarkDot: addPoint(
    {
      x: BASE_COMPONENT.plasticBodyMarkDot.cx,
      y: BASE_COMPONENT.plasticBodyMarkDot.cy,
    },
    COMPONENT_OFFSET.plasticBodyMarkDot,
  ),

  textGroup: addPoint(
    {
      x: BASE_COMPONENT.textGroup.x,
      y: BASE_COMPONENT.textGroup.y,
    },
    COMPONENT_OFFSET.textGroup,
  ),

  leads: {
    in: {
      cx:
        BASE_COMPONENT.leadCenterX.in +
        COMPONENT_OFFSET.leads.in.x,
      y: BASE_COMPONENT.lead.y + COMPONENT_OFFSET.leads.in.y,
      w: BASE_COMPONENT.lead.w,
      h: BASE_COMPONENT.lead.h,
    },

    gnd: {
      cx:
        BASE_COMPONENT.leadCenterX.gnd +
        COMPONENT_OFFSET.leads.gnd.x,
      y: BASE_COMPONENT.lead.y + COMPONENT_OFFSET.leads.gnd.y,
      w: BASE_COMPONENT.lead.w,
      h: BASE_COMPONENT.lead.h,
    },

    out: {
      cx:
        BASE_COMPONENT.leadCenterX.out +
        COMPONENT_OFFSET.leads.out.x,
      y: BASE_COMPONENT.lead.y + COMPONENT_OFFSET.leads.out.y,
      w: BASE_COMPONENT.lead.w,
      h: BASE_COMPONENT.lead.h,
    },
  },

  terminal: {
    in: {
      label: {
        x:
          BASE_COMPONENT.leadCenterX.in -
          BASE_COMPONENT.terminal.labelW / 2 +
          WIRE_OFFSET.in.label.x,
        y: BASE_COMPONENT.terminal.labelY + WIRE_OFFSET.in.label.y,
        w: BASE_COMPONENT.terminal.labelW,
        h: BASE_COMPONENT.terminal.labelH,
      },
      labelCenter: {
        x: BASE_COMPONENT.leadCenterX.in + WIRE_OFFSET.in.label.x,
        y:
          BASE_COMPONENT.terminal.labelY +
          BASE_COMPONENT.terminal.labelH / 2 +
          WIRE_OFFSET.in.label.y,
      },
    },

    gnd: {
      label: {
        x:
          BASE_COMPONENT.leadCenterX.gnd -
          BASE_COMPONENT.terminal.labelW / 2 +
          WIRE_OFFSET.gnd.label.x,
        y: BASE_COMPONENT.terminal.labelY + WIRE_OFFSET.gnd.label.y,
        w: BASE_COMPONENT.terminal.labelW,
        h: BASE_COMPONENT.terminal.labelH,
      },
      labelCenter: {
        x: BASE_COMPONENT.leadCenterX.gnd + WIRE_OFFSET.gnd.label.x,
        y:
          BASE_COMPONENT.terminal.labelY +
          BASE_COMPONENT.terminal.labelH / 2 +
          WIRE_OFFSET.gnd.label.y,
      },
    },

    out: {
      label: {
        x:
          BASE_COMPONENT.leadCenterX.out -
          BASE_COMPONENT.terminal.labelW / 2 +
          WIRE_OFFSET.out.label.x,
        y: BASE_COMPONENT.terminal.labelY + WIRE_OFFSET.out.label.y,
        w: BASE_COMPONENT.terminal.labelW,
        h: BASE_COMPONENT.terminal.labelH,
      },
      labelCenter: {
        x: BASE_COMPONENT.leadCenterX.out + WIRE_OFFSET.out.label.x,
        y:
          BASE_COMPONENT.terminal.labelY +
          BASE_COMPONENT.terminal.labelH / 2 +
          WIRE_OFFSET.out.label.y,
      },
    },
  },
};

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function SvgDefs() {
  return (
    <defs>
      <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#cfcfcf" />
        <stop offset="70%" stopColor="#f7f7f7" />
        <stop offset="100%" stopColor="#b7b7b7" />
      </linearGradient>

      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a3a3a" />
        <stop offset="35%" stopColor="#151515" />
        <stop offset="100%" stopColor="#050505" />
      </linearGradient>

      <linearGradient id="leadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8e8e8e" />
        <stop offset="25%" stopColor="#eeeeee" />
        <stop offset="55%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>

      <filter id="metalShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
      </filter>

      <filter id="bodyShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.35" />
      </filter>

      <filter id="leadShadow" x="-30%" y="-20%" width="160%" height="150%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.22" />
      </filter>

      <pattern id="metalTexture" width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.7" fill="#ffffff" opacity="0.45" />
        <circle cx="7" cy="5" r="0.65" fill="#000000" opacity="0.12" />
      </pattern>

      <pattern id="plasticTexture" width="7" height="7" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.55" fill="#ffffff" opacity="0.18" />
        <circle cx="5" cy="4" r="0.45" fill="#000000" opacity="0.28" />
      </pattern>
    </defs>
  );
}

function WhiteCanvas() {
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

function MetalTab() {
  const tab = COMPONENT.metalTab;

  return (
    <g filter={PATH.shadows.metal}>
      <path
        d={createMetalTabPath(
          tab.x,
          tab.y,
          tab.w,
          tab.h,
          BASE_COMPONENT.metalTab.cut,
        )}
        fill="url(#metalGradient)"
        stroke={PATH.colors.metalStroke}
        strokeWidth={1.4}
      />

      <path
        d={createMetalTabPath(
          tab.x,
          tab.y,
          tab.w,
          tab.h,
          BASE_COMPONENT.metalTab.cut,
        )}
        fill="url(#metalTexture)"
        opacity={0.45}
      />
    </g>
  );
}

function MountingHole() {
  const hole = COMPONENT.mountingHole;

  return (
    <g>
      <circle
        cx={hole.x}
        cy={hole.y}
        r={BASE_COMPONENT.mountingHole.r + 3}
        fill="#7c7c7c"
        opacity={0.9}
      />

      <circle
        cx={hole.x}
        cy={hole.y}
        r={BASE_COMPONENT.mountingHole.r}
        fill="#ffffff"
      />

      <circle
        cx={hole.x}
        cy={hole.y}
        r={BASE_COMPONENT.mountingHole.r - 1}
        fill="none"
        stroke="#525252"
        strokeWidth={1.2}
        opacity={0.6}
      />
    </g>
  );
}

function PlasticBody() {
  const body = COMPONENT.plasticBody;
  const dot = COMPONENT.plasticBodyMarkDot;

  return (
    <g filter={PATH.shadows.body}>
      <rect
        x={body.x}
        y={body.y}
        width={body.w}
        height={body.h}
        rx={BASE_COMPONENT.plasticBody.r}
        fill="url(#bodyGradient)"
        stroke={PATH.colors.bodyStroke}
        strokeWidth={1.5}
      />

      <rect
        x={body.x}
        y={body.y}
        width={body.w}
        height={body.h}
        rx={BASE_COMPONENT.plasticBody.r}
        fill="url(#plasticTexture)"
        opacity={0.38}
      />

      <rect
        x={body.x}
        y={body.y}
        width={body.w}
        height={13}
        rx={BASE_COMPONENT.plasticBody.r}
        fill="#ffffff"
        opacity={0.08}
      />

      <rect
        x={body.x}
        y={body.y + body.h - 16}
        width={body.w}
        height={16}
        rx={BASE_COMPONENT.plasticBody.r}
        fill="#000000"
        opacity={0.35}
      />

      <circle
        cx={dot.x}
        cy={dot.y}
        r={BASE_COMPONENT.plasticBodyMarkDot.r}
        fill="#060606"
        stroke="#1f1f1f"
        strokeWidth={2}
      />
    </g>
  );
}

function BodyText({
  outputLabel,
  packageLabel,
}: {
  outputLabel: string;
  packageLabel: string;
}) {
  const text = COMPONENT.textGroup;

  return (
    <g
      fontFamily={LABEL.fontFamily}
      textAnchor="middle"
      fill={LABEL.bodyText.fill}
      style={{ letterSpacing: LABEL.bodyText.letterSpacing }}
    >
      <text
        x={text.x}
        y={text.y}
        fontSize={47}
        fontWeight={300}
      >
        {packageLabel}
      </text>

      <text
        x={text.x}
        y={text.y + 76}
        fontSize={37}
        fontWeight={300}
      >
        {outputLabel}  1.0A
      </text>

      <text
        x={text.x}
        y={text.y + 142}
        fontSize={34}
        fontWeight={300}
      >
        2218
      </text>
    </g>
  );
}

function Lead({
  active = false,
  terminal,
}: {
  active?: boolean;
  terminal: TerminalKey;
}) {
  const lead = COMPONENT.leads[terminal];
  const color = terminalColor(terminal);
  const leadStartY = lead.y + 18;
  const leadEndY = lead.y + lead.h - 22;
  const currentPath =
    terminal === "in"
      ? `M ${lead.cx} ${leadEndY} L ${lead.cx} ${leadStartY}`
      : `M ${lead.cx} ${leadStartY} L ${lead.cx} ${leadEndY}`;

  return (
    <g filter={PATH.shadows.lead}>
      {active && (
        <line
          x1={lead.cx}
          y1={leadStartY}
          x2={lead.cx}
          y2={leadEndY}
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
          opacity={0.18}
        />
      )}

      <path
        d={createLeadPath(
          lead.cx,
          lead.y,
          lead.w,
          lead.h,
          BASE_COMPONENT.lead.shoulderY,
          BASE_COMPONENT.lead.neckW,
          BASE_COMPONENT.lead.tipW,
        )}
        fill="url(#leadGradient)"
        stroke={PATH.colors.leadStroke}
        strokeWidth={1.3}
      />

      <path
        d={createLeadPath(
          lead.cx,
          lead.y,
          lead.w,
          lead.h,
          BASE_COMPONENT.lead.shoulderY,
          BASE_COMPONENT.lead.neckW,
          BASE_COMPONENT.lead.tipW,
        )}
        fill="url(#metalTexture)"
        opacity={0.22}
      />

      {active &&
        Array.from({ length: 4 }).map((_, index) => (
          <circle
            key={`${terminal}-lead-current-dot-${index}`}
            r={5.4}
            fill={color}
            stroke="#ffffff"
            strokeWidth={1.8}
          >
            <animateMotion
              dur="1.6s"
              path={currentPath}
              begin={`${index * 0.4}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="1.6s"
              begin={`${index * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
    </g>
  );
}

function StructuredWire({
  active = false,
  terminal,
}: {
  active?: boolean;
  terminal: TerminalKey;
}) {
  const segments = createWireSegments(terminal);
  const color = terminalColor(terminal);
  const currentPath = createCurrentDotPath(segments, terminal === "in");

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
            stroke={color}
            strokeWidth={WIRE.width + 10}
            strokeLinecap="round"
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
          stroke={color}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
        />
      ))}

      {DEBUG.showWireJoints &&
        uniquePoints(segments).map((point, index) => (
          <circle
            key={`${terminal}-joint-${index}`}
            cx={point.x}
            cy={point.y}
            r={NODE.jointRadius}
            fill={color}
            stroke={NODE.stroke}
            strokeWidth={1}
          />
        ))}

      {active &&
        Array.from({ length: 3 }).map((_, index) => (
          <circle
            key={`${terminal}-current-dot-${index}`}
            r={4.6}
            fill={color}
            stroke="#ffffff"
            strokeWidth={1.6}
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

  const segments = createWireSegments(terminal);
  const color = terminalColor(terminal);
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
            fill="#ffffff"
            stroke={color}
            strokeWidth={NODE.debugStrokeWidth}
          />
        );
      })}

      {DEBUG.showDebugNames && (
        <text
          x={segments[0].from.x + 9}
          y={segments[0].from.y - 9}
          fontSize={12}
          fontFamily={LABEL.fontFamily}
          fill={color}
        >
          {terminal.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function TerminalLabel({
  active = false,
  terminal,
}: {
  active?: boolean;
  terminal: TerminalKey;
}) {
  const box = COMPONENT.terminal[terminal].label;
  const color = terminalColor(terminal);
  const label = terminal.toUpperCase();

  return (
    <g fontFamily={LABEL.fontFamily}>
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={8}
        fill="#ffffff"
        stroke={color}
        strokeWidth={active ? 4 : 2}
      />

      {active && (
        <rect
          x={box.x - 8}
          y={box.y - 8}
          width={box.w + 16}
          height={box.h + 16}
          rx={12}
          fill={color}
          opacity={0.14}
        />
      )}

      <text
        x={box.x + box.w / 2}
        y={box.y + box.h / 2 + 8}
        textAnchor="middle"
        fontSize={LABEL.terminalText.fontSize}
        fontWeight={LABEL.terminalText.fontWeight}
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

function TerminalNumber({ terminal }: { terminal: TerminalKey }) {
  const box = COMPONENT.terminal[terminal].label;
  const color = terminalColor(terminal);
  const number = terminal === "in" ? "1" : terminal === "gnd" ? "2" : "3";

  return (
    <text
      x={box.x + box.w / 2}
      y={box.y - 13}
      textAnchor="middle"
      fontFamily={LABEL.fontFamily}
      fontSize={19}
      fontWeight={800}
      fill={color}
    >
      {number}
    </text>
  );
}

function TerminalBlock({
  active = false,
  terminal,
}: {
  active?: boolean;
  terminal: TerminalKey;
}) {
  return (
    <g>
      <StructuredWire terminal={terminal} active={active} />
      <DebugTerminalDots terminal={terminal} />
      <TerminalNumber terminal={terminal} />
      <TerminalLabel terminal={terminal} active={active} />
    </g>
  );
}

function VoltageRegulatorCore({
  activeTerminals,
  outputLabel,
  packageLabel,
}: {
  activeTerminals: readonly TerminalKey[];
  outputLabel: string;
  packageLabel: string;
}) {
  return (
    <g
      transform={`
        translate(${COMPONENT_OFFSET.wholeRegulator.x} ${COMPONENT_OFFSET.wholeRegulator.y})
        scale(${SCALE.circuitComponent})
      `}
    >
      <MetalTab />
      <MountingHole />
      <PlasticBody />

      <Lead terminal="in" active={activeTerminals.includes("in")} />
      <Lead terminal="gnd" active={activeTerminals.includes("gnd")} />
      <Lead terminal="out" active={activeTerminals.includes("out")} />

      <BodyText packageLabel={packageLabel} outputLabel={outputLabel} />

      <TerminalBlock terminal="in" active={activeTerminals.includes("in")} />
      <TerminalBlock terminal="gnd" active={activeTerminals.includes("gnd")} />
      <TerminalBlock terminal="out" active={activeTerminals.includes("out")} />
    </g>
  );
}

/* =========================================================
   MAIN REUSABLE COMPONENT
========================================================= */

export function LM7805VoltageRegulatorSvg({
  activeTerminals = [],
  className = "",
  outputLabel = "5.0V",
  packageLabel = "LM7805",
}: {
  activeTerminals?: readonly TerminalKey[];
  className?: string;
  outputLabel?: string;
  packageLabel?: string;
}) {
  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
      role="img"
      aria-label="LM7805 voltage regulator component with IN, GND, and OUT terminals"
      className={className}
    >
      <SvgDefs />
      <WhiteCanvas />

      <g
        transform={`
          translate(${COMPONENT_OFFSET.canvas.x} ${COMPONENT_OFFSET.canvas.y})
          scale(${SCALE.circuitCanvas})
        `}
      >
        <VoltageRegulatorCore
          activeTerminals={activeTerminals}
          outputLabel={outputLabel}
          packageLabel={packageLabel}
        />
      </g>
    </svg>
  );
}

/* =========================================================
   NEXT.JS PAGE / SINGLE FILE DEFAULT EXPORT
========================================================= */

export default function LM7805VoltageRegulatorPage() {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center p-6">
      <LM7805VoltageRegulatorSvg className="w-full max-w-[420px] h-auto" />
    </main>
  );
}
