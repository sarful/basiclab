"use client";

import React from "react";

type CircuitProps = {
  className?: string;
  showDebug?: boolean;
};

/* =========================================================
   SHARED ARCHITECTURE
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 10;

const COMPONENT_OFFSET = { x: 0, y: 0 };
const WIRE_OFFSET = { x: 0, y: 0 };
const DEBUG_TERMINAL_OFFSET = { x: 0, y: 0 };

const DEBUG = false;

const WIRE = {
  stroke: "#ff5a00",
  black: "#111111",
  gold: "#c9973a",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  cap: "butt" as const,
  join: "miter" as const,
};

function WireSegment({
  d,
  stroke = WIRE.stroke,
  width = WIRE.width,
  cap = WIRE.cap,
}: {
  d: string;
  stroke?: string;
  width?: number;
  cap?: "butt" | "round" | "square";
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
   BACKWARD DIODE SYMBOL
========================================================= */

const SYMBOL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 590,
  H: 165,
};

const SYMBOL_BASE_COMPONENT = {
  centerX: 295 + COMPONENT_OFFSET.x,
  centerY: 80 + COMPONENT_OFFSET.y,

  triangleLeftX: 230 + COMPONENT_OFFSET.x,
  triangleTopY: 26 + COMPONENT_OFFSET.y,
  triangleBottomY: 135 + COMPONENT_OFFSET.y,
  triangleTipX: 335 + COMPONENT_OFFSET.x,

  barX: 335 + COMPONENT_OFFSET.x,
  barTopY: 25 + COMPONENT_OFFSET.y,
  barBottomY: 136 + COMPONENT_OFFSET.y,
};

const SYMBOL_COMPONENT = {
  triangle: {
    points: `
      ${SYMBOL_BASE_COMPONENT.triangleLeftX},${SYMBOL_BASE_COMPONENT.triangleTopY}
      ${SYMBOL_BASE_COMPONENT.triangleTipX},${SYMBOL_BASE_COMPONENT.centerY}
      ${SYMBOL_BASE_COMPONENT.triangleLeftX},${SYMBOL_BASE_COMPONENT.triangleBottomY}
    `,
    fill: "#ff5a00",
  },

  backwardBar: {
    main: `M ${SYMBOL_BASE_COMPONENT.barX} ${SYMBOL_BASE_COMPONENT.barTopY}
           L ${SYMBOL_BASE_COMPONENT.barX} ${SYMBOL_BASE_COMPONENT.barBottomY}`,

    topCap: `M ${SYMBOL_BASE_COMPONENT.barX - 20} ${SYMBOL_BASE_COMPONENT.barTopY}
             L ${SYMBOL_BASE_COMPONENT.barX + 20} ${SYMBOL_BASE_COMPONENT.barTopY}`,

    bottomCap: `M ${SYMBOL_BASE_COMPONENT.barX - 20} ${SYMBOL_BASE_COMPONENT.barBottomY}
                L ${SYMBOL_BASE_COMPONENT.barX + 20} ${SYMBOL_BASE_COMPONENT.barBottomY}`,
  },
};

const SYMBOL_NODE = {
  anodeTerminal: { x: 78 + WIRE_OFFSET.x, y: 80 + WIRE_OFFSET.y },
  anodeJoin: { x: 230 + WIRE_OFFSET.x, y: 80 + WIRE_OFFSET.y },
  cathodeJoin: { x: 335 + WIRE_OFFSET.x, y: 80 + WIRE_OFFSET.y },
  cathodeTerminal: { x: 514 + WIRE_OFFSET.x, y: 80 + WIRE_OFFSET.y },
};

const SYMBOL_PATH = {
  anodeWire: `M ${SYMBOL_NODE.anodeTerminal.x} ${SYMBOL_NODE.anodeTerminal.y} L ${SYMBOL_NODE.anodeJoin.x} ${SYMBOL_NODE.anodeJoin.y}`,
  cathodeWire: `M ${SYMBOL_NODE.cathodeJoin.x} ${SYMBOL_NODE.cathodeJoin.y} L ${SYMBOL_NODE.cathodeTerminal.x} ${SYMBOL_NODE.cathodeTerminal.y}`,
};

const SYMBOL_LABEL = {
  plus: { text: "+", x: 52, y: 91 },
  minus: { text: "−", x: 540, y: 91 },
  anode: { text: "ANODE", x: 118, y: 66 },
  cathode: { text: "CATHODE", x: 464, y: 66 },
};

function SymbolLabels() {
  return (
    <g fontFamily="Arial, Helvetica, sans-serif" fontWeight={800}>
      <text x={SYMBOL_LABEL.plus.x} y={SYMBOL_LABEL.plus.y} fontSize={34} fill="red" textAnchor="middle">
        {SYMBOL_LABEL.plus.text}
      </text>

      <text x={SYMBOL_LABEL.minus.x} y={SYMBOL_LABEL.minus.y} fontSize={36} fill="#111111" textAnchor="middle">
        {SYMBOL_LABEL.minus.text}
      </text>

      <text x={SYMBOL_LABEL.anode.x} y={SYMBOL_LABEL.anode.y} fontSize={22} fill="#111111" textAnchor="middle">
        {SYMBOL_LABEL.anode.text}
      </text>

      <text x={SYMBOL_LABEL.cathode.x} y={SYMBOL_LABEL.cathode.y} fontSize={22} fill="#111111" textAnchor="middle">
        {SYMBOL_LABEL.cathode.text}
      </text>
    </g>
  );
}

function BackwardDiodeTriangle() {
  return (
    <polygon
      points={SYMBOL_COMPONENT.triangle.points}
      fill={SYMBOL_COMPONENT.triangle.fill}
      stroke={SYMBOL_COMPONENT.triangle.fill}
      strokeWidth={2}
      transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}
    />
  );
}

function BackwardDiodeBar() {
  return (
    <g
      fill="none"
      stroke="#ff5a00"
      strokeWidth={9}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}
    >
      <path d={SYMBOL_COMPONENT.backwardBar.topCap} />
      <path d={SYMBOL_COMPONENT.backwardBar.main} />
      <path d={SYMBOL_COMPONENT.backwardBar.bottomCap} />
    </g>
  );
}

export function BackwardDiodeSymbol({
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
        className="h-auto w-full max-w-[590px]"
        role="img"
        aria-label="Backward diode symbol"
        shapeRendering="geometricPrecision"
      >
        <rect width={SYMBOL_VIEW_BOX.W} height={SYMBOL_VIEW_BOX.H} fill="#ffffff" />

        <WireSegment d={SYMBOL_PATH.anodeWire} />
        <WireSegment d={SYMBOL_PATH.cathodeWire} />

        <BackwardDiodeTriangle />
        <BackwardDiodeBar />
        <SymbolLabels />

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
   BACKWARD DIODE PHYSICAL COMPONENT
========================================================= */

const PHYSICAL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 590,
  H: 160,
};

const PHYSICAL_BASE_COMPONENT = {
  centerX: 294 + COMPONENT_OFFSET.x,
  centerY: 78 + COMPONENT_OFFSET.y,

  bodyX: 225 + COMPONENT_OFFSET.x,
  bodyY: 30 + COMPONENT_OFFSET.y,
  bodyW: 140,
  bodyH: 96,
};

const PHYSICAL_COMPONENT = {
  lead: {
    y: 80 + WIRE_OFFSET.y,
    leftX1: 78 + WIRE_OFFSET.x,
    leftX2: 230 + WIRE_OFFSET.x,
    rightX1: 360 + WIRE_OFFSET.x,
    rightX2: 514 + WIRE_OFFSET.x,
    width: 22,
  },

  neck: {
    leftX: 212 + COMPONENT_OFFSET.x,
    rightX: 352 + COMPONENT_OFFSET.x,
    y: 67 + COMPONENT_OFFSET.y,
    w: 28,
    h: 26,
  },

  body: {
    x: PHYSICAL_BASE_COMPONENT.bodyX,
    y: PHYSICAL_BASE_COMPONENT.bodyY,
    w: PHYSICAL_BASE_COMPONENT.bodyW,
    h: PHYSICAL_BASE_COMPONENT.bodyH,
    rx: 24,
  },

  cathodeRim: {
    x: 352 + COMPONENT_OFFSET.x,
    y: 25 + COMPONENT_OFFSET.y,
    w: 18,
    h: 106,
    rx: 8,
  },

  marks: {
    topArrow: `M 287 48 C 315 45, 325 50, 327 62`,
    middleOval: { x: 262, y: 69, w: 64, h: 24 },
    bottomLeftOval: { x: 246, y: 104, w: 35, h: 14 },
    bottomRightOval: { x: 292, y: 104, w: 36, h: 14 },
  },
};

const PHYSICAL_NODE = {
  anodeTerminal: { x: PHYSICAL_COMPONENT.lead.leftX1, y: PHYSICAL_COMPONENT.lead.y },
  anodeBodyJoin: { x: PHYSICAL_COMPONENT.lead.leftX2, y: PHYSICAL_COMPONENT.lead.y },
  cathodeBodyJoin: { x: PHYSICAL_COMPONENT.lead.rightX1, y: PHYSICAL_COMPONENT.lead.y },
  cathodeTerminal: { x: PHYSICAL_COMPONENT.lead.rightX2, y: PHYSICAL_COMPONENT.lead.y },
};

const PHYSICAL_PATH = {
  leftLead: `M ${PHYSICAL_COMPONENT.lead.leftX1} ${PHYSICAL_COMPONENT.lead.y} L ${PHYSICAL_COMPONENT.lead.leftX2} ${PHYSICAL_COMPONENT.lead.y}`,
  rightLead: `M ${PHYSICAL_COMPONENT.lead.rightX1} ${PHYSICAL_COMPONENT.lead.y} L ${PHYSICAL_COMPONENT.lead.rightX2} ${PHYSICAL_COMPONENT.lead.y}`,
};

function GoldDefs() {
  return (
    <defs>
      <linearGradient id="goldLead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f7d77a" />
        <stop offset="35%" stopColor="#c99532" />
        <stop offset="70%" stopColor="#f5cf70" />
        <stop offset="100%" stopColor="#9d6a20" />
      </linearGradient>

      <radialGradient id="goldBody" cx="45%" cy="38%" r="70%">
        <stop offset="0%" stopColor="#fff0b0" />
        <stop offset="38%" stopColor="#d4a34a" />
        <stop offset="72%" stopColor="#a36a20" />
        <stop offset="100%" stopColor="#6c4315" />
      </radialGradient>

      <linearGradient id="darkRim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#e0b45d" />
        <stop offset="45%" stopColor="#6b4218" />
        <stop offset="100%" stopColor="#1a130b" />
      </linearGradient>
    </defs>
  );
}

function PhysicalLeads() {
  return (
    <g>
      <WireSegment
        d={PHYSICAL_PATH.leftLead}
        stroke="url(#goldLead)"
        width={PHYSICAL_COMPONENT.lead.width}
        cap="butt"
      />
      <WireSegment
        d={PHYSICAL_PATH.rightLead}
        stroke="url(#goldLead)"
        width={PHYSICAL_COMPONENT.lead.width}
        cap="butt"
      />

      <path d="M 78 74 L 230 74" stroke="#ffe79b" strokeWidth={3} />
      <path d="M 360 74 L 514 74" stroke="#ffe79b" strokeWidth={3} />
    </g>
  );
}

function BackwardPhysicalBody() {
  return (
    <g transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}>
      <rect
        x={PHYSICAL_COMPONENT.neck.leftX}
        y={PHYSICAL_COMPONENT.neck.y}
        width={PHYSICAL_COMPONENT.neck.w}
        height={PHYSICAL_COMPONENT.neck.h}
        fill="url(#goldBody)"
      />

      <rect
        x={PHYSICAL_COMPONENT.body.x}
        y={PHYSICAL_COMPONENT.body.y}
        width={PHYSICAL_COMPONENT.body.w}
        height={PHYSICAL_COMPONENT.body.h}
        rx={PHYSICAL_COMPONENT.body.rx}
        fill="url(#goldBody)"
      />

      <rect
        x={PHYSICAL_COMPONENT.cathodeRim.x}
        y={PHYSICAL_COMPONENT.cathodeRim.y}
        width={PHYSICAL_COMPONENT.cathodeRim.w}
        height={PHYSICAL_COMPONENT.cathodeRim.h}
        rx={PHYSICAL_COMPONENT.cathodeRim.rx}
        fill="url(#darkRim)"
      />

      <path
        d={PHYSICAL_COMPONENT.marks.topArrow}
        fill="none"
        stroke="#4a2c10"
        strokeWidth={5}
        strokeLinecap="round"
      />

      <ellipse
        cx={PHYSICAL_COMPONENT.marks.middleOval.x + PHYSICAL_COMPONENT.marks.middleOval.w / 2}
        cy={PHYSICAL_COMPONENT.marks.middleOval.y + PHYSICAL_COMPONENT.marks.middleOval.h / 2}
        rx={PHYSICAL_COMPONENT.marks.middleOval.w / 2}
        ry={PHYSICAL_COMPONENT.marks.middleOval.h / 2}
        fill="none"
        stroke="#5a3511"
        strokeWidth={5}
      />

      <ellipse
        cx={PHYSICAL_COMPONENT.marks.bottomLeftOval.x + PHYSICAL_COMPONENT.marks.bottomLeftOval.w / 2}
        cy={PHYSICAL_COMPONENT.marks.bottomLeftOval.y + PHYSICAL_COMPONENT.marks.bottomLeftOval.h / 2}
        rx={PHYSICAL_COMPONENT.marks.bottomLeftOval.w / 2}
        ry={PHYSICAL_COMPONENT.marks.bottomLeftOval.h / 2}
        fill="none"
        stroke="#5a3511"
        strokeWidth={4}
      />

      <ellipse
        cx={PHYSICAL_COMPONENT.marks.bottomRightOval.x + PHYSICAL_COMPONENT.marks.bottomRightOval.w / 2}
        cy={PHYSICAL_COMPONENT.marks.bottomRightOval.y + PHYSICAL_COMPONENT.marks.bottomRightOval.h / 2}
        rx={PHYSICAL_COMPONENT.marks.bottomRightOval.w / 2}
        ry={PHYSICAL_COMPONENT.marks.bottomRightOval.h / 2}
        fill="none"
        stroke="#5a3511"
        strokeWidth={4}
      />

      <path
        d="M 238 42 C 260 33, 315 30, 350 39"
        stroke="#ffe89c"
        strokeWidth={7}
        fill="none"
        opacity={0.55}
      />
    </g>
  );
}

export function BackwardDiodePhysicalComponent({
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
        className="h-auto w-full max-w-[590px]"
        role="img"
        aria-label="Backward diode physical component"
        shapeRendering="geometricPrecision"
      >
        <GoldDefs />
        <rect width={PHYSICAL_VIEW_BOX.W} height={PHYSICAL_VIEW_BOX.H} fill="#ffffff" />

        <PhysicalLeads />
        <BackwardPhysicalBody />

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

export default function BackwardDiodeLibraryPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-5 bg-white p-4">
      <BackwardDiodeSymbol />
      <BackwardDiodePhysicalComponent />
    </div>
  );
}