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
const BASE_WIRE_WIDTH = 5;

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
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  cap: "butt" as const,
  join: "miter" as const,
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
      <circle cx={x} cy={y} r={4} fill="red" />
      <text x={x + 7} y={y - 7} fontSize={10} fill="red" fontFamily="Arial">
        {label}
      </text>
    </g>
  );
}

/* =========================================================
   PIN DIODE SYMBOL
========================================================= */

const SYMBOL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 411,
  H: 125,
};

const SYMBOL_BASE_COMPONENT = {
  centerY: 59 + COMPONENT_OFFSET.y,

  triangleLeftX: 133 + COMPONENT_OFFSET.x,
  triangleTopY: 20 + COMPONENT_OFFSET.y,
  triangleBottomY: 97 + COMPONENT_OFFSET.y,
  triangleTipX: 218 + COMPONENT_OFFSET.x,

  intrinsicApexX: 209 + COMPONENT_OFFSET.x,
  intrinsicApexY: 16 + COMPONENT_OFFSET.y,
  intrinsicLeftBaseX: 190 + COMPONENT_OFFSET.x,
  intrinsicLeftBaseY: 38 + COMPONENT_OFFSET.y,
  intrinsicRightBaseX: 247 + COMPONENT_OFFSET.x,
  intrinsicRightBaseY: 59 + COMPONENT_OFFSET.y,

  cathodeX: 258 + COMPONENT_OFFSET.x,
  cathodeTopY: 17 + COMPONENT_OFFSET.y,
  cathodeBottomY: 101 + COMPONENT_OFFSET.y,
};

const SYMBOL_COMPONENT = {
  triangle: {
    points: `
      ${SYMBOL_BASE_COMPONENT.triangleLeftX},${SYMBOL_BASE_COMPONENT.triangleTopY}
      ${SYMBOL_BASE_COMPONENT.triangleTipX},${SYMBOL_BASE_COMPONENT.centerY}
      ${SYMBOL_BASE_COMPONENT.triangleLeftX},${SYMBOL_BASE_COMPONENT.triangleBottomY}
    `,
  },

  intrinsicLayer: {
    path: `
      M ${SYMBOL_BASE_COMPONENT.intrinsicLeftBaseX} ${SYMBOL_BASE_COMPONENT.intrinsicLeftBaseY}
      L ${SYMBOL_BASE_COMPONENT.intrinsicApexX} ${SYMBOL_BASE_COMPONENT.intrinsicApexY}
      L ${SYMBOL_BASE_COMPONENT.intrinsicRightBaseX} ${SYMBOL_BASE_COMPONENT.centerY}
      L ${SYMBOL_BASE_COMPONENT.triangleTipX} ${SYMBOL_BASE_COMPONENT.centerY}
      Z
    `,
  },

  cathodeBar: {
    d: `
      M ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTopY}
      L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottomY}
    `,
  },
};

const SYMBOL_NODE = {
  anodeTerminal: { x: 40 + WIRE_OFFSET.x, y: 59 + WIRE_OFFSET.y },
  anodeJoin: { x: 133 + WIRE_OFFSET.x, y: 59 + WIRE_OFFSET.y },
  diodeTip: { x: 218 + WIRE_OFFSET.x, y: 59 + WIRE_OFFSET.y },
  cathodeJoin: { x: 258 + WIRE_OFFSET.x, y: 59 + WIRE_OFFSET.y },
  cathodeTerminal: { x: 371 + WIRE_OFFSET.x, y: 59 + WIRE_OFFSET.y },
};

const SYMBOL_PATH = {
  anodeWire: `M ${SYMBOL_NODE.anodeTerminal.x} ${SYMBOL_NODE.anodeTerminal.y} L ${SYMBOL_NODE.anodeJoin.x} ${SYMBOL_NODE.anodeJoin.y}`,
  cathodeWire: `M ${SYMBOL_NODE.diodeTip.x} ${SYMBOL_NODE.diodeTip.y} L ${SYMBOL_NODE.cathodeTerminal.x} ${SYMBOL_NODE.cathodeTerminal.y}`,
};

const SYMBOL_LABEL = {
  plus: { text: "+", x: 20, y: 67 },
  minus: { text: "−", x: 389, y: 66 },
  anode: { text: "ANODE", x: 72, y: 48 },
  cathode: { text: "CATHODE", x: 332, y: 48 },
};

function PinSymbolLabels() {
  return (
    <g fontFamily="Arial, Helvetica, sans-serif" fontWeight={800}>
      <text x={SYMBOL_LABEL.plus.x} y={SYMBOL_LABEL.plus.y} fontSize={24} fill="red" textAnchor="middle">
        {SYMBOL_LABEL.plus.text}
      </text>
      <text x={SYMBOL_LABEL.minus.x} y={SYMBOL_LABEL.minus.y} fontSize={28} fill="#000000" textAnchor="middle">
        {SYMBOL_LABEL.minus.text}
      </text>
      <text x={SYMBOL_LABEL.anode.x} y={SYMBOL_LABEL.anode.y} fontSize={16} fill="#000000" textAnchor="middle">
        {SYMBOL_LABEL.anode.text}
      </text>
      <text x={SYMBOL_LABEL.cathode.x} y={SYMBOL_LABEL.cathode.y} fontSize={16} fill="#000000" textAnchor="middle">
        {SYMBOL_LABEL.cathode.text}
      </text>
    </g>
  );
}

function PinSymbolBody() {
  return (
    <g
      fill="none"
      stroke="#000000"
      strokeWidth={5}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}
    >
      <polygon points={SYMBOL_COMPONENT.triangle.points} />
      <path d={SYMBOL_COMPONENT.intrinsicLayer.path} />
      <path d={SYMBOL_COMPONENT.cathodeBar.d} />
    </g>
  );
}

export function PinDiodeSymbol({
  className = "",
  showDebug = DEBUG,
}: CircuitProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white ${className}`}
      style={{ transform: `scale(${CIRCUIT_CANVAS_SCALE})`, transformOrigin: "center" }}
    >
      <svg
        viewBox={`${SYMBOL_VIEW_BOX.X} ${SYMBOL_VIEW_BOX.Y} ${SYMBOL_VIEW_BOX.W} ${SYMBOL_VIEW_BOX.H}`}
        className="h-auto w-full max-w-[411px]"
        role="img"
        aria-label="PIN diode symbol"
        shapeRendering="geometricPrecision"
      >
        <rect width={SYMBOL_VIEW_BOX.W} height={SYMBOL_VIEW_BOX.H} fill="#ffffff" />

        <WireSegment d={SYMBOL_PATH.anodeWire} />
        <WireSegment d={SYMBOL_PATH.cathodeWire} />

        <PinSymbolBody />
        <PinSymbolLabels />

        {showDebug && (
          <>
            <DebugTerminalDot x={SYMBOL_NODE.anodeTerminal.x} y={SYMBOL_NODE.anodeTerminal.y} label="ANODE" />
            <DebugTerminalDot x={SYMBOL_NODE.anodeJoin.x} y={SYMBOL_NODE.anodeJoin.y} label="P_JOIN" />
            <DebugTerminalDot x={SYMBOL_NODE.diodeTip.x} y={SYMBOL_NODE.diodeTip.y} label="TIP" />
            <DebugTerminalDot x={SYMBOL_NODE.cathodeJoin.x} y={SYMBOL_NODE.cathodeJoin.y} label="N_BAR" />
            <DebugTerminalDot x={SYMBOL_NODE.cathodeTerminal.x} y={SYMBOL_NODE.cathodeTerminal.y} label="CATHODE" />
          </>
        )}
      </svg>
    </div>
  );
}

/* =========================================================
   PIN DIODE PHYSICAL COMPONENT
========================================================= */

const PHYSICAL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 411,
  H: 135,
};

const PHYSICAL_BASE_COMPONENT = {
  centerX: 198 + COMPONENT_OFFSET.x,
  centerY: 76 + COMPONENT_OFFSET.y,

  bodyX: 111 + COMPONENT_OFFSET.x,
  bodyY: 37 + COMPONENT_OFFSET.y,
  bodyW: 172,
  bodyH: 73,
  rx: 20,
};

const PHYSICAL_COMPONENT = {
  lead: {
    y: 75 + WIRE_OFFSET.y,
    leftX1: 40 + WIRE_OFFSET.x,
    leftX2: 112 + WIRE_OFFSET.x,
    rightX1: 282 + WIRE_OFFSET.x,
    rightX2: 371 + WIRE_OFFSET.x,
    outerWidth: 8,
    innerWidth: 4,
  },

  body: {
    x: PHYSICAL_BASE_COMPONENT.bodyX,
    y: PHYSICAL_BASE_COMPONENT.bodyY,
    w: PHYSICAL_BASE_COMPONENT.bodyW,
    h: PHYSICAL_BASE_COMPONENT.bodyH,
    rx: PHYSICAL_BASE_COMPONENT.rx,
  },

  pRegion: {
    x: 112 + COMPONENT_OFFSET.x,
    y: 37 + COMPONENT_OFFSET.y,
    w: 82,
    h: 73,
    rxLeft: 20,
  },

  iRegion: {
    x: 193 + COMPONENT_OFFSET.x,
    y: 37 + COMPONENT_OFFSET.y,
    w: 32,
    h: 73,
  },

  nRegion: {
    x: 224 + COMPONENT_OFFSET.x,
    y: 37 + COMPONENT_OFFSET.y,
    w: 58,
    h: 73,
    rxRight: 20,
  },
};

const PHYSICAL_NODE = {
  anodeTerminal: { x: PHYSICAL_COMPONENT.lead.leftX1, y: PHYSICAL_COMPONENT.lead.y },
  anodeBodyJoin: { x: PHYSICAL_COMPONENT.lead.leftX2, y: PHYSICAL_COMPONENT.lead.y },
  pCenter: { x: 153, y: 75 },
  iCenter: { x: 209, y: 75 },
  nCenter: { x: 251, y: 75 },
  cathodeBodyJoin: { x: PHYSICAL_COMPONENT.lead.rightX1, y: PHYSICAL_COMPONENT.lead.y },
  cathodeTerminal: { x: PHYSICAL_COMPONENT.lead.rightX2, y: PHYSICAL_COMPONENT.lead.y },
};

const PHYSICAL_PATH = {
  leftLead: `M ${PHYSICAL_COMPONENT.lead.leftX1} ${PHYSICAL_COMPONENT.lead.y} L ${PHYSICAL_COMPONENT.lead.leftX2} ${PHYSICAL_COMPONENT.lead.y}`,
  rightLead: `M ${PHYSICAL_COMPONENT.lead.rightX1} ${PHYSICAL_COMPONENT.lead.y} L ${PHYSICAL_COMPONENT.lead.rightX2} ${PHYSICAL_COMPONENT.lead.y}`,
};

const PHYSICAL_LABEL = {
  plus: { text: "+", x: 21, y: 82 },
  minus: { text: "−", x: 389, y: 82 },
  anode: { text: "ANODE", x: 73, y: 67 },
  cathode: { text: "CATHODE", x: 332, y: 67 },

  pTop: { text: "P", x: 147, y: 10 },
  pRegionTop: { text: "Region", x: 147, y: 27 },

  iTop: { text: "intrinsic", x: 202, y: 10 },
  iRegionTop: { text: "Region", x: 202, y: 27 },

  nTop: { text: "n", x: 251, y: 10 },
  nRegionTop: { text: "Region", x: 251, y: 27 },

  pInside: { text: "p", x: 163, y: 79 },
  iInside: { text: "i", x: 210, y: 79 },
  nInside: { text: "n", x: 252, y: 79 },
};

function PinPhysicalDefs() {
  return (
    <defs>
      <linearGradient id="pinLeadMetal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#8f8f8f" />
        <stop offset="65%" stopColor="#dcdcdc" />
        <stop offset="100%" stopColor="#4f4f4f" />
      </linearGradient>

      <linearGradient id="pinDarkRegion" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#111111" />
        <stop offset="45%" stopColor="#d7d7d7" />
        <stop offset="100%" stopColor="#111111" />
      </linearGradient>

      <linearGradient id="pinBlackRegion" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#080808" />
        <stop offset="55%" stopColor="#9d9d9d" />
        <stop offset="100%" stopColor="#080808" />
      </linearGradient>

      <linearGradient id="pinWhiteRegion" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f5f5f5" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#d7d7d7" />
      </linearGradient>

      <clipPath id="pinBodyClip">
        <rect
          x={PHYSICAL_COMPONENT.body.x}
          y={PHYSICAL_COMPONENT.body.y}
          width={PHYSICAL_COMPONENT.body.w}
          height={PHYSICAL_COMPONENT.body.h}
          rx={PHYSICAL_COMPONENT.body.rx}
        />
      </clipPath>
    </defs>
  );
}

function PinPhysicalLabels() {
  return (
    <g fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
      <text x={PHYSICAL_LABEL.plus.x} y={PHYSICAL_LABEL.plus.y} fontSize={24} fontWeight={800} fill="red" textAnchor="middle">
        {PHYSICAL_LABEL.plus.text}
      </text>
      <text x={PHYSICAL_LABEL.minus.x} y={PHYSICAL_LABEL.minus.y} fontSize={28} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.minus.text}
      </text>

      <text x={PHYSICAL_LABEL.anode.x} y={PHYSICAL_LABEL.anode.y} fontSize={18} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.anode.text}
      </text>
      <text x={PHYSICAL_LABEL.cathode.x} y={PHYSICAL_LABEL.cathode.y} fontSize={18} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.cathode.text}
      </text>

      <text x={PHYSICAL_LABEL.pTop.x} y={PHYSICAL_LABEL.pTop.y} fontSize={11} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.pTop.text}
      </text>
      <text x={PHYSICAL_LABEL.pRegionTop.x} y={PHYSICAL_LABEL.pRegionTop.y} fontSize={10} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.pRegionTop.text}
      </text>

      <text x={PHYSICAL_LABEL.iTop.x} y={PHYSICAL_LABEL.iTop.y} fontSize={10} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.iTop.text}
      </text>
      <text x={PHYSICAL_LABEL.iRegionTop.x} y={PHYSICAL_LABEL.iRegionTop.y} fontSize={10} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.iRegionTop.text}
      </text>

      <text x={PHYSICAL_LABEL.nTop.x} y={PHYSICAL_LABEL.nTop.y} fontSize={11} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.nTop.text}
      </text>
      <text x={PHYSICAL_LABEL.nRegionTop.x} y={PHYSICAL_LABEL.nRegionTop.y} fontSize={10} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.nRegionTop.text}
      </text>

      <text x={PHYSICAL_LABEL.pInside.x} y={PHYSICAL_LABEL.pInside.y} fontSize={23} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.pInside.text}
      </text>
      <text x={PHYSICAL_LABEL.iInside.x} y={PHYSICAL_LABEL.iInside.y} fontSize={23} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.iInside.text}
      </text>
      <text x={PHYSICAL_LABEL.nInside.x} y={PHYSICAL_LABEL.nInside.y} fontSize={23} fontWeight={800} textAnchor="middle">
        {PHYSICAL_LABEL.nInside.text}
      </text>
    </g>
  );
}

function PinPhysicalBody() {
  return (
    <g transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}>
      <g clipPath="url(#pinBodyClip)">
        <rect
          x={PHYSICAL_COMPONENT.pRegion.x}
          y={PHYSICAL_COMPONENT.pRegion.y}
          width={PHYSICAL_COMPONENT.pRegion.w}
          height={PHYSICAL_COMPONENT.pRegion.h}
          fill="url(#pinBlackRegion)"
        />

        <rect
          x={PHYSICAL_COMPONENT.iRegion.x}
          y={PHYSICAL_COMPONENT.iRegion.y}
          width={PHYSICAL_COMPONENT.iRegion.w}
          height={PHYSICAL_COMPONENT.iRegion.h}
          fill="url(#pinWhiteRegion)"
        />

        <rect
          x={PHYSICAL_COMPONENT.nRegion.x}
          y={PHYSICAL_COMPONENT.nRegion.y}
          width={PHYSICAL_COMPONENT.nRegion.w}
          height={PHYSICAL_COMPONENT.nRegion.h}
          fill="url(#pinBlackRegion)"
        />

        <path
          d="M 113 43 C 145 36, 247 36, 282 43"
          stroke="#ffffff"
          strokeWidth={6}
          opacity={0.28}
          fill="none"
        />

        <path
          d="M 113 101 C 145 110, 247 110, 282 101"
          stroke="#000000"
          strokeWidth={5}
          opacity={0.35}
          fill="none"
        />
      </g>

      <rect
        x={PHYSICAL_COMPONENT.body.x}
        y={PHYSICAL_COMPONENT.body.y}
        width={PHYSICAL_COMPONENT.body.w}
        height={PHYSICAL_COMPONENT.body.h}
        rx={PHYSICAL_COMPONENT.body.rx}
        fill="none"
        stroke="#000000"
        strokeWidth={2}
      />

      <line x1="193" y1="38" x2="193" y2="109" stroke="#000000" strokeWidth={2} />
      <line x1="225" y1="38" x2="225" y2="109" stroke="#000000" strokeWidth={2} />
    </g>
  );
}

function PinPhysicalLeads() {
  return (
    <g>
      <WireSegment d={PHYSICAL_PATH.leftLead} stroke="#000000" width={PHYSICAL_COMPONENT.lead.outerWidth} />
      <WireSegment d={PHYSICAL_PATH.rightLead} stroke="#000000" width={PHYSICAL_COMPONENT.lead.outerWidth} />

      <WireSegment d={PHYSICAL_PATH.leftLead} stroke="url(#pinLeadMetal)" width={PHYSICAL_COMPONENT.lead.innerWidth} />
      <WireSegment d={PHYSICAL_PATH.rightLead} stroke="url(#pinLeadMetal)" width={PHYSICAL_COMPONENT.lead.innerWidth} />
    </g>
  );
}

export function PinDiodePhysicalComponent({
  className = "",
  showDebug = DEBUG,
}: CircuitProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white ${className}`}
      style={{ transform: `scale(${CIRCUIT_CANVAS_SCALE})`, transformOrigin: "center" }}
    >
      <svg
        viewBox={`${PHYSICAL_VIEW_BOX.X} ${PHYSICAL_VIEW_BOX.Y} ${PHYSICAL_VIEW_BOX.W} ${PHYSICAL_VIEW_BOX.H}`}
        className="h-auto w-full max-w-[411px]"
        role="img"
        aria-label="PIN diode physical component"
        shapeRendering="geometricPrecision"
      >
        <PinPhysicalDefs />
        <rect width={PHYSICAL_VIEW_BOX.W} height={PHYSICAL_VIEW_BOX.H} fill="#ffffff" />

        <PinPhysicalLabels />
        <PinPhysicalLeads />
        <PinPhysicalBody />

        {showDebug && (
          <>
            <DebugTerminalDot x={PHYSICAL_NODE.anodeTerminal.x} y={PHYSICAL_NODE.anodeTerminal.y} label="ANODE" />
            <DebugTerminalDot x={PHYSICAL_NODE.anodeBodyJoin.x} y={PHYSICAL_NODE.anodeBodyJoin.y} label="P_START" />
            <DebugTerminalDot x={PHYSICAL_NODE.pCenter.x} y={PHYSICAL_NODE.pCenter.y} label="P" />
            <DebugTerminalDot x={PHYSICAL_NODE.iCenter.x} y={PHYSICAL_NODE.iCenter.y} label="I" />
            <DebugTerminalDot x={PHYSICAL_NODE.nCenter.x} y={PHYSICAL_NODE.nCenter.y} label="N" />
            <DebugTerminalDot x={PHYSICAL_NODE.cathodeBodyJoin.x} y={PHYSICAL_NODE.cathodeBodyJoin.y} label="N_END" />
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
export default function PinDiodeLibraryPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-4 bg-white p-4">
      <PinDiodeSymbol />
      <PinDiodePhysicalComponent />
    </div>
  );
}