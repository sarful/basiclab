"use client";

import React from "react";

type CircuitProps = {
  className?: string;
  showDebug?: boolean;
};

/* =========================================================
   SHARED SCALE CONSTANTS
========================================================= */
const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 11;

/* =========================================================
   SHARED POSITION TUNING
========================================================= */
const COMPONENT_OFFSET = { x: 0, y: 0 };
const WIRE_OFFSET = { x: 0, y: 0 };
const DEBUG_TERMINAL_OFFSET = { x: 0, y: 0 };

const DEBUG = false;

/* =========================================================
   SHARED WIRE
========================================================= */
const WIRE = {
  stroke: "#000000",
  gold: "#c8942e",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  cap: "round" as const,
  join: "round" as const,
};

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */
function WireSegment({
  d,
  stroke = WIRE.stroke,
  width = WIRE.width,
  cap = WIRE.cap,
}: {
  d: string;
  stroke?: string;
  width?: number;
  cap?: "round" | "butt" | "square";
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap={cap}
      strokeLinejoin={WIRE.join}
    />
  );
}

function DebugTerminalDot({
  x,
  y,
  label,
}: {
  x: number;
  y: number;
  label: string;
}) {
  return (
    <g transform={`translate(${DEBUG_TERMINAL_OFFSET.x}, ${DEBUG_TERMINAL_OFFSET.y})`}>
      <circle cx={x} cy={y} r={6} fill="red" />
      <text x={x + 10} y={y - 10} fontSize={14} fill="red" fontFamily="Arial">
        {label}
      </text>
    </g>
  );
}

/* =========================================================
   TUNNEL DIODE SYMBOL
========================================================= */

/* ===================== VIEW_BOX ===================== */
const SYMBOL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 876,
  H: 235,
};

/* ===================== BASE_COMPONENT ===================== */
const SYMBOL_BASE_COMPONENT = {
  centerX: 438 + COMPONENT_OFFSET.x,
  centerY: 116 + COMPONENT_OFFSET.y,

  triangleLeftX: 360 + COMPONENT_OFFSET.x,
  triangleTopY: 28 + COMPONENT_OFFSET.y,
  triangleBottomY: 205 + COMPONENT_OFFSET.y,
  triangleTipX: 504 + COMPONENT_OFFSET.x,

  cathodeX: 504 + COMPONENT_OFFSET.x,
  cathodeTopY: 29 + COMPONENT_OFFSET.y,
  cathodeBottomY: 205 + COMPONENT_OFFSET.y,
};

/* ===================== COMPONENT ===================== */
const SYMBOL_COMPONENT = {
  triangle: {
    points: `
      ${SYMBOL_BASE_COMPONENT.triangleLeftX},${SYMBOL_BASE_COMPONENT.triangleTopY}
      ${SYMBOL_BASE_COMPONENT.triangleTipX},${SYMBOL_BASE_COMPONENT.centerY}
      ${SYMBOL_BASE_COMPONENT.triangleLeftX},${SYMBOL_BASE_COMPONENT.triangleBottomY}
    `,
  },

  tunnelBar: {
    main: `M ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTopY}
           L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottomY}`,

    topHook: `M ${SYMBOL_BASE_COMPONENT.cathodeX - 33} ${SYMBOL_BASE_COMPONENT.cathodeTopY}
              L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTopY}
              L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTopY + 38}`,

    bottomHook: `M ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottomY - 38}
                 L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottomY}
                 L ${SYMBOL_BASE_COMPONENT.cathodeX - 33} ${SYMBOL_BASE_COMPONENT.cathodeBottomY}`,
  },
};

/* ===================== NODE ===================== */
const SYMBOL_NODE = {
  anodeTerminal: { x: 107 + WIRE_OFFSET.x, y: 116 + WIRE_OFFSET.y },
  anodeJoin: { x: 360 + WIRE_OFFSET.x, y: 116 + WIRE_OFFSET.y },
  cathodeJoin: { x: 504 + WIRE_OFFSET.x, y: 116 + WIRE_OFFSET.y },
  cathodeTerminal: { x: 765 + WIRE_OFFSET.x, y: 116 + WIRE_OFFSET.y },
};

/* ===================== PATH ===================== */
const SYMBOL_PATH = {
  anodeWire: `M ${SYMBOL_NODE.anodeTerminal.x} ${SYMBOL_NODE.anodeTerminal.y} L ${SYMBOL_NODE.anodeJoin.x} ${SYMBOL_NODE.anodeJoin.y}`,
  cathodeWire: `M ${SYMBOL_NODE.cathodeJoin.x} ${SYMBOL_NODE.cathodeJoin.y} L ${SYMBOL_NODE.cathodeTerminal.x} ${SYMBOL_NODE.cathodeTerminal.y}`,
};

/* ===================== LABEL ===================== */
const SYMBOL_LABEL = {
  anode: { text: "Anode", x: 120, y: 76 },
  anodeSign: { text: "+", x: 147, y: 166 },
  cathode: { text: "Cathode", x: 710, y: 76 },
  cathodeSign: { text: "−", x: 711, y: 166 },
};

function TunnelSymbolLabels() {
  return (
    <g fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
      <text x={SYMBOL_LABEL.anode.x} y={SYMBOL_LABEL.anode.y} fontSize={58} textAnchor="middle">
        {SYMBOL_LABEL.anode.text}
      </text>

      <text x={SYMBOL_LABEL.anodeSign.x} y={SYMBOL_LABEL.anodeSign.y} fontSize={56} textAnchor="middle">
        {SYMBOL_LABEL.anodeSign.text}
      </text>

      <text x={SYMBOL_LABEL.cathode.x} y={SYMBOL_LABEL.cathode.y} fontSize={58} textAnchor="middle">
        {SYMBOL_LABEL.cathode.text}
      </text>

      <text x={SYMBOL_LABEL.cathodeSign.x} y={SYMBOL_LABEL.cathodeSign.y} fontSize={58} textAnchor="middle">
        {SYMBOL_LABEL.cathodeSign.text}
      </text>
    </g>
  );
}

function TunnelTriangle() {
  return (
    <polygon
      points={SYMBOL_COMPONENT.triangle.points}
      fill="none"
      stroke="#000000"
      strokeWidth={13}
      strokeLinejoin="round"
      strokeLinecap="round"
      transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}
    />
  );
}

function TunnelCathodeBar() {
  return (
    <g
      fill="none"
      stroke="#000000"
      strokeWidth={13}
      strokeLinecap="round"
      strokeLinejoin="round"
      transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}
    >
      <path d={SYMBOL_COMPONENT.tunnelBar.topHook} />
      <path d={SYMBOL_COMPONENT.tunnelBar.main} />
      <path d={SYMBOL_COMPONENT.tunnelBar.bottomHook} />
    </g>
  );
}

export function TunnelDiodeSymbol({
  className = "",
  showDebug = DEBUG,
}: CircuitProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white ${className}`}
      style={{
        transform: `scale(${CIRCUIT_CANVAS_SCALE})`,
        transformOrigin: "center",
      }}
    >
      <svg
        viewBox={`${SYMBOL_VIEW_BOX.X} ${SYMBOL_VIEW_BOX.Y} ${SYMBOL_VIEW_BOX.W} ${SYMBOL_VIEW_BOX.H}`}
        className="h-auto w-full max-w-[876px]"
        role="img"
        aria-label="Tunnel diode symbol"
        shapeRendering="geometricPrecision"
      >
        <rect width={SYMBOL_VIEW_BOX.W} height={SYMBOL_VIEW_BOX.H} fill="#ffffff" />

        <WireSegment d={SYMBOL_PATH.anodeWire} width={13} />
        <WireSegment d={SYMBOL_PATH.cathodeWire} width={13} />

        <TunnelTriangle />
        <TunnelCathodeBar />
        <TunnelSymbolLabels />

        {showDebug && (
          <>
            <DebugTerminalDot x={SYMBOL_NODE.anodeTerminal.x} y={SYMBOL_NODE.anodeTerminal.y} label="ANODE" />
            <DebugTerminalDot x={SYMBOL_NODE.anodeJoin.x} y={SYMBOL_NODE.anodeJoin.y} label="ANODE_JOIN" />
            <DebugTerminalDot x={SYMBOL_NODE.cathodeJoin.x} y={SYMBOL_NODE.cathodeJoin.y} label="CATHODE_JOIN" />
            <DebugTerminalDot x={SYMBOL_NODE.cathodeTerminal.x} y={SYMBOL_NODE.cathodeTerminal.y} label="CATHODE" />
          </>
        )}
      </svg>
    </div>
  );
}

/* =========================================================
   TUNNEL DIODE PHYSICAL COMPONENT
========================================================= */

/* ===================== VIEW_BOX ===================== */
const PHYSICAL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 876,
  H: 205,
};

/* ===================== BASE_COMPONENT ===================== */
const PHYSICAL_BASE_COMPONENT = {
  centerX: 438 + COMPONENT_OFFSET.x,
  centerY: 103 + COMPONENT_OFFSET.y,

  bodyX: 360 + COMPONENT_OFFSET.x,
  bodyY: 30 + COMPONENT_OFFSET.y,
  bodyW: 176,
  bodyH: 158,

  rimX: 343 + COMPONENT_OFFSET.x,
  rimY: 18 + COMPONENT_OFFSET.y,
  rimW: 41,
  rimH: 185,
};

/* ===================== COMPONENT ===================== */
const PHYSICAL_COMPONENT = {
  lead: {
    y: 113 + WIRE_OFFSET.y,
    leftX1: 118 + WIRE_OFFSET.x,
    leftX2: 360 + WIRE_OFFSET.x,
    rightX1: 536 + WIRE_OFFSET.x,
    rightX2: 757 + WIRE_OFFSET.x,
    width: 34,
  },

  body: {
    x: PHYSICAL_BASE_COMPONENT.bodyX,
    y: PHYSICAL_BASE_COMPONENT.bodyY,
    w: PHYSICAL_BASE_COMPONENT.bodyW,
    h: PHYSICAL_BASE_COMPONENT.bodyH,
    rx: 28,
  },

  leftRim: {
    x: PHYSICAL_BASE_COMPONENT.rimX,
    y: PHYSICAL_BASE_COMPONENT.rimY,
    w: PHYSICAL_BASE_COMPONENT.rimW,
    h: PHYSICAL_BASE_COMPONENT.rimH,
    rx: 20,
  },

  rightNeck: {
    x: 518 + COMPONENT_OFFSET.x,
    y: 87 + COMPONENT_OFFSET.y,
    w: 28,
    h: 53,
    rx: 16,
  },

  blackMarks: {
    top: `M 413 58 C 445 53, 478 56, 493 64 L 489 85 C 458 79, 430 78, 406 83 Z`,
    middle: `M 421 98 C 451 91, 486 92, 507 105 C 493 128, 457 132, 414 124 C 407 115, 411 105, 421 98 Z`,
    bottom: `M 417 148 C 446 154, 477 157, 501 145 C 495 169, 455 180, 413 165 C 405 159, 407 152, 417 148 Z`,
  },
};

/* ===================== NODE ===================== */
const PHYSICAL_NODE = {
  anodeTerminal: { x: PHYSICAL_COMPONENT.lead.leftX1, y: PHYSICAL_COMPONENT.lead.y },
  anodeBodyJoin: { x: PHYSICAL_COMPONENT.lead.leftX2, y: PHYSICAL_COMPONENT.lead.y },
  cathodeBodyJoin: { x: PHYSICAL_COMPONENT.lead.rightX1, y: PHYSICAL_COMPONENT.lead.y },
  cathodeTerminal: { x: PHYSICAL_COMPONENT.lead.rightX2, y: PHYSICAL_COMPONENT.lead.y },
};

/* ===================== PATH ===================== */
const PHYSICAL_PATH = {
  leftLead: `M ${PHYSICAL_COMPONENT.lead.leftX1} ${PHYSICAL_COMPONENT.lead.y} L ${PHYSICAL_COMPONENT.lead.leftX2} ${PHYSICAL_COMPONENT.lead.y}`,
  rightLead: `M ${PHYSICAL_COMPONENT.lead.rightX1} ${PHYSICAL_COMPONENT.lead.y} L ${PHYSICAL_COMPONENT.lead.rightX2} ${PHYSICAL_COMPONENT.lead.y}`,
};

/* ===================== LABEL ===================== */
const PHYSICAL_LABEL = {
  name: "Tunnel Diode Physical Component",
  x: PHYSICAL_VIEW_BOX.W / 2,
  y: PHYSICAL_VIEW_BOX.H - 8,
};

function TunnelGoldDefs() {
  return (
    <defs>
      <linearGradient id="tunnelLeadGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff2a7" />
        <stop offset="24%" stopColor="#e4b94f" />
        <stop offset="52%" stopColor="#9c6717" />
        <stop offset="76%" stopColor="#f3ce67" />
        <stop offset="100%" stopColor="#7a4b10" />
      </linearGradient>

      <radialGradient id="tunnelBodyGold" cx="48%" cy="38%" r="74%">
        <stop offset="0%" stopColor="#fff6b8" />
        <stop offset="28%" stopColor="#e6b74e" />
        <stop offset="57%" stopColor="#a86b16" />
        <stop offset="82%" stopColor="#744811" />
        <stop offset="100%" stopColor="#2b1b09" />
      </radialGradient>

      <linearGradient id="tunnelRimGold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6b3d0d" />
        <stop offset="22%" stopColor="#f5d878" />
        <stop offset="55%" stopColor="#b57a20" />
        <stop offset="100%" stopColor="#4b2c0b" />
      </linearGradient>
    </defs>
  );
}

function TunnelPhysicalLeads() {
  return (
    <g>
      <WireSegment
        d={PHYSICAL_PATH.leftLead}
        stroke="url(#tunnelLeadGold)"
        width={PHYSICAL_COMPONENT.lead.width}
        cap="butt"
      />
      <WireSegment
        d={PHYSICAL_PATH.rightLead}
        stroke="url(#tunnelLeadGold)"
        width={PHYSICAL_COMPONENT.lead.width}
        cap="butt"
      />

      <path d="M 118 101 L 360 101" stroke="#fff0a0" strokeWidth={4} opacity={0.75} />
      <path d="M 536 101 L 757 101" stroke="#fff0a0" strokeWidth={4} opacity={0.75} />

      <path d="M 118 127 L 360 127" stroke="#6f430e" strokeWidth={3} opacity={0.45} />
      <path d="M 536 127 L 757 127" stroke="#6f430e" strokeWidth={3} opacity={0.45} />
    </g>
  );
}

function TunnelPhysicalBody() {
  return (
    <g transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}>
      <rect
        x={PHYSICAL_COMPONENT.body.x}
        y={PHYSICAL_COMPONENT.body.y}
        width={PHYSICAL_COMPONENT.body.w}
        height={PHYSICAL_COMPONENT.body.h}
        rx={PHYSICAL_COMPONENT.body.rx}
        fill="url(#tunnelBodyGold)"
      />

      <rect
        x={PHYSICAL_COMPONENT.leftRim.x}
        y={PHYSICAL_COMPONENT.leftRim.y}
        width={PHYSICAL_COMPONENT.leftRim.w}
        height={PHYSICAL_COMPONENT.leftRim.h}
        rx={PHYSICAL_COMPONENT.leftRim.rx}
        fill="url(#tunnelRimGold)"
      />

      <rect
        x={PHYSICAL_COMPONENT.rightNeck.x}
        y={PHYSICAL_COMPONENT.rightNeck.y}
        width={PHYSICAL_COMPONENT.rightNeck.w}
        height={PHYSICAL_COMPONENT.rightNeck.h}
        rx={PHYSICAL_COMPONENT.rightNeck.rx}
        fill="url(#tunnelBodyGold)"
      />

      <path d={PHYSICAL_COMPONENT.blackMarks.top} fill="#17110a" opacity={0.92} />
      <path d={PHYSICAL_COMPONENT.blackMarks.middle} fill="#17110a" opacity={0.92} />
      <path d={PHYSICAL_COMPONENT.blackMarks.bottom} fill="#17110a" opacity={0.9} />

      <path
        d="M 377 43 C 410 26, 482 32, 519 52"
        fill="none"
        stroke="#ffe890"
        strokeWidth={9}
        opacity={0.42}
      />

      <path
        d="M 361 54 C 350 92, 350 140, 365 180"
        fill="none"
        stroke="#fff0a7"
        strokeWidth={7}
        opacity={0.42}
      />

      <path
        d="M 525 46 C 541 85, 543 137, 526 176"
        fill="none"
        stroke="#3d2609"
        strokeWidth={6}
        opacity={0.48}
      />
    </g>
  );
}

export function TunnelDiodePhysicalComponent({
  className = "",
  showDebug = DEBUG,
}: CircuitProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white ${className}`}
      style={{
        transform: `scale(${CIRCUIT_CANVAS_SCALE})`,
        transformOrigin: "center",
      }}
    >
      <svg
        viewBox={`${PHYSICAL_VIEW_BOX.X} ${PHYSICAL_VIEW_BOX.Y} ${PHYSICAL_VIEW_BOX.W} ${PHYSICAL_VIEW_BOX.H}`}
        className="h-auto w-full max-w-[876px]"
        role="img"
        aria-label="Tunnel diode physical component"
        shapeRendering="geometricPrecision"
      >
        <TunnelGoldDefs />
        <rect width={PHYSICAL_VIEW_BOX.W} height={PHYSICAL_VIEW_BOX.H} fill="#ffffff" />

        <TunnelPhysicalLeads />
        <TunnelPhysicalBody />

        {showDebug && (
          <>
            <DebugTerminalDot x={PHYSICAL_NODE.anodeTerminal.x} y={PHYSICAL_NODE.anodeTerminal.y} label="ANODE" />
            <DebugTerminalDot x={PHYSICAL_NODE.anodeBodyJoin.x} y={PHYSICAL_NODE.anodeBodyJoin.y} label="BODY_START" />
            <DebugTerminalDot x={PHYSICAL_NODE.cathodeBodyJoin.x} y={PHYSICAL_NODE.cathodeBodyJoin.y} label="BODY_END" />
            <DebugTerminalDot x={PHYSICAL_NODE.cathodeTerminal.x} y={PHYSICAL_NODE.cathodeTerminal.y} label="CATHODE" />
          </>
        )}
      </svg>
    </div>
  );
}

/* =========================================================
   DEFAULT PREVIEW WRAPPER
========================================================= */
export default function TunnelDiodeLibraryPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-5 bg-white p-4">
      <TunnelDiodeSymbol />
      <TunnelDiodePhysicalComponent />
    </div>
  );
}