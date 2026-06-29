"use client";

import React from "react";

/* =========================================================
   GLOBAL CONFIG (TUNING SYSTEM)
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;

const BASE_WIRE_WIDTH = 6;

const COMPONENT_OFFSET = { x: 0, y: 0 };
const WIRE_OFFSET = { x: 0, y: 0 };
const DEBUG_TERMINAL_OFFSET = { x: 0, y: 0 };

const DEBUG = false;

/* =========================================================
   REUSABLE WIRE COMPONENT
========================================================= */

const WIRE = {
  stroke: "#000",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  cap: "butt" as const,
  join: "miter" as const,
};

function WireSegment({
  d,
  stroke = WIRE.stroke,
  width = WIRE.width,
  opacity = 1,
}: {
  d: string;
  stroke?: string;
  width?: number;
  opacity?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap={WIRE.cap}
      strokeLinejoin={WIRE.join}
      opacity={opacity}
    />
  );
}

function DebugDot({
  x,
  y,
  label,
}: {
  x: number;
  y: number;
  label: string;
}) {
  return (
    <g transform={`translate(${DEBUG_TERMINAL_OFFSET.x},${DEBUG_TERMINAL_OFFSET.y})`}>
      <circle cx={x} cy={y} r={5} fill="red" />
      <text x={x + 6} y={y - 6} fontSize={10} fill="red">
        {label}
      </text>
    </g>
  );
}

/* =========================================================
   =========================================================
   1. SYMBOL SECTION
   =========================================================
========================================================= */

const SYMBOL_VIEW_BOX = {
  x: 0,
  y: 0,
  w: 420,
  h: 140,
};

/* ================= BASE COMPONENT ================= */

const SYMBOL_BASE = {
  centerY: 70,

  triLeft: 140,
  triTop: 25,
  triBottom: 115,
  triTip: 240,

  cathodeX: 255,
  cathodeTop: 25,
  cathodeBottom: 115,
};

/* ================= COMPONENT ================= */

const SYMBOL_COMPONENT = {
  triangle: `
    M ${SYMBOL_BASE.triLeft} ${SYMBOL_BASE.triTop}
    L ${SYMBOL_BASE.triTip} ${SYMBOL_BASE.centerY}
    L ${SYMBOL_BASE.triLeft} ${SYMBOL_BASE.triBottom}
    Z
  `,

  cathodeBar: `
    M ${SYMBOL_BASE.cathodeX} ${SYMBOL_BASE.cathodeTop}
    L ${SYMBOL_BASE.cathodeX} ${SYMBOL_BASE.cathodeBottom}
  `,
};

/* ================= NODE ================= */

const SYMBOL_NODE = {
  anode: { x: 40, y: 70 },
  join: { x: 140, y: 70 },
  cathodeJoin: { x: 255, y: 70 },
  cathode: { x: 380, y: 70 },
};

/* ================= PATH ================= */

const SYMBOL_PATH = {
  anodeWire: `M ${SYMBOL_NODE.anode.x} ${SYMBOL_NODE.anode.y} L ${SYMBOL_NODE.join.x} ${SYMBOL_NODE.join.y}`,
  cathodeWire: `M ${SYMBOL_NODE.cathodeJoin.x} ${SYMBOL_NODE.cathodeJoin.y} L ${SYMBOL_NODE.cathode.x} ${SYMBOL_NODE.cathode.y}`,
};

/* ================= LABEL ================= */

const SYMBOL_LABEL = {
  anode: { text: "Anode (+)", x: 40, y: 40 },
  cathode: { text: "Cathode (-)", x: 360, y: 40 },
};

/* ================= SYMBOL COMPONENT ================= */

function DiodeSymbol() {
  return (
    <g fill="none" stroke="#000" strokeWidth={6}>
      <path d={SYMBOL_COMPONENT.triangle} fill="#000" />
      <path d={SYMBOL_COMPONENT.cathodeBar} />
    </g>
  );
}

function SymbolLabels() {
  return (
    <g fontSize={18} fontFamily="Arial" fill="#000">
      <text x={SYMBOL_LABEL.anode.x} y={SYMBOL_LABEL.anode.y}>
        {SYMBOL_LABEL.anode.text}
      </text>
      <text x={SYMBOL_LABEL.cathode.x} y={SYMBOL_LABEL.cathode.y}>
        {SYMBOL_LABEL.cathode.text}
      </text>
    </g>
  );
}

/* ================= SYMBOL EXPORT ================= */

export function DiodeSymbolComponent({
  showDebug = DEBUG,
}: {
  showDebug?: boolean;
}) {
  return (
    <svg viewBox={`0 0 ${SYMBOL_VIEW_BOX.w} ${SYMBOL_VIEW_BOX.h}`}>
      <WireSegment d={SYMBOL_PATH.anodeWire} />
      <WireSegment d={SYMBOL_PATH.cathodeWire} />

      <DiodeSymbol />
      <SymbolLabels />

      {showDebug && (
        <>
          <DebugDot x={SYMBOL_NODE.anode.x} y={SYMBOL_NODE.anode.y} label="A" />
          <DebugDot x={SYMBOL_NODE.join.x} y={SYMBOL_NODE.join.y} label="J" />
          <DebugDot x={SYMBOL_NODE.cathode.x} y={SYMBOL_NODE.cathode.y} label="C" />
        </>
      )}
    </svg>
  );
}

/* =========================================================
   =========================================================
   2. PHYSICAL COMPONENT SECTION
   =========================================================
========================================================= */

const PHYSICAL_VIEW_BOX = {
  x: 0,
  y: 0,
  w: 420,
  h: 160,
};

/* ================= BASE ================= */

const PHYSICAL_BASE = {
  bodyX: 150,
  bodyY: 45,
  bodyW: 120,
  bodyH: 70,

  bandX: 235,
};

/* ================= COMPONENT ================= */

const PHYSICAL_COMPONENT = {
  body: {
    x: PHYSICAL_BASE.bodyX,
    y: PHYSICAL_BASE.bodyY,
    w: PHYSICAL_BASE.bodyW,
    h: PHYSICAL_BASE.bodyH,
  },

  band: {
    x: PHYSICAL_BASE.bandX,
    y: PHYSICAL_BASE.bodyY,
    w: 10,
    h: PHYSICAL_BASE.bodyH,
  },
};

/* ================= NODE ================= */

const PHYSICAL_NODE = {
  anode: { x: 60, y: 80 },
  leftJoin: { x: 150, y: 80 },
  rightJoin: { x: 270, y: 80 },
  cathode: { x: 360, y: 80 },
};

/* ================= PATH ================= */

const PHYSICAL_PATH = {
  leftWire: `M ${PHYSICAL_NODE.anode.x} ${PHYSICAL_NODE.anode.y} L ${PHYSICAL_NODE.leftJoin.x} ${PHYSICAL_NODE.leftJoin.y}`,
  rightWire: `M ${PHYSICAL_NODE.rightJoin.x} ${PHYSICAL_NODE.rightJoin.y} L ${PHYSICAL_NODE.cathode.x} ${PHYSICAL_NODE.cathode.y}`,
};

/* ================= LABEL ================= */

const PHYSICAL_LABEL = {
  title: { text: "Generic Diode Physical", x: 210, y: 150 },
};

/* ================= PHYSICAL BODY ================= */

function PhysicalBody() {
  return (
    <g>
      <rect
        x={PHYSICAL_COMPONENT.body.x}
        y={PHYSICAL_COMPONENT.body.y}
        width={PHYSICAL_COMPONENT.body.w}
        height={PHYSICAL_COMPONENT.body.h}
        fill="#111"
      />

      {/* Cathode band */}
      <rect
        x={PHYSICAL_COMPONENT.band.x}
        y={PHYSICAL_COMPONENT.band.y}
        width={PHYSICAL_COMPONENT.band.w}
        height={PHYSICAL_COMPONENT.band.h}
        fill="#aaa"
      />
    </g>
  );
}

/* ================= EXPORT PHYSICAL ================= */

export function DiodePhysicalComponent({
  showDebug = DEBUG,
}: {
  showDebug?: boolean;
}) {
  return (
    <svg viewBox={`0 0 ${PHYSICAL_VIEW_BOX.w} ${PHYSICAL_VIEW_BOX.h}`}>
      <WireSegment d={PHYSICAL_PATH.leftWire} />
      <WireSegment d={PHYSICAL_PATH.rightWire} />

      <PhysicalBody />

      <text
        x={PHYSICAL_LABEL.title.x}
        y={PHYSICAL_LABEL.title.y}
        fontSize={14}
        textAnchor="middle"
        fontFamily="Arial"
      >
        {PHYSICAL_LABEL.title.text}
      </text>

      {showDebug && (
        <>
          <DebugDot x={PHYSICAL_NODE.anode.x} y={PHYSICAL_NODE.anode.y} label="A" />
          <DebugDot x={PHYSICAL_NODE.leftJoin.x} y={PHYSICAL_NODE.leftJoin.y} label="L" />
          <DebugDot x={PHYSICAL_NODE.rightJoin.x} y={PHYSICAL_NODE.rightJoin.y} label="R" />
          <DebugDot x={PHYSICAL_NODE.cathode.x} y={PHYSICAL_NODE.cathode.y} label="C" />
        </>
      )}
    </svg>
  );
}

/* =========================================================
   LIBRARY WRAPPER
========================================================= */

export default function DiodeLibrary() {
  return (
    <div className="flex flex-col items-center gap-6 bg-white p-4">
      <DiodeSymbolComponent />
      <DiodePhysicalComponent />
    </div>
  );
}