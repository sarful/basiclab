"use client";

import React from "react";

/* =========================================================
   GLOBAL TUNING SYSTEM
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;

const BASE_WIRE_WIDTH = 4;

const COMPONENT_OFFSET = { x: 0, y: 0 };
const WIRE_OFFSET = { x: 0, y: 0 };
const DEBUG_TERMINAL_OFFSET = { x: 0, y: 0 };

const DEBUG = false;

/* =========================================================
   REUSABLE WIRE + DEBUG BLOCKS
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
   VIEW BOX
========================================================= */

const VIEW_BOX = {
  w: 420,
  h: 200,
};

/* =========================================================
   BASE COMPONENT (GEOMETRY CORE)
========================================================= */

const BASE = {
  centerY: 100,

  triLeft: 150,
  triTop: 60,
  triBottom: 140,
  triTip: 255,

  cathodeX: 270,
  cathodeTop: 60,
  cathodeBottom: 140,

  arrow1: {
    x1: 290,
    y1: 60,
    x2: 320,
    y2: 30,
  },

  arrow2: {
    x1: 310,
    y1: 80,
    x2: 340,
    y2: 50,
  },
};

/* =========================================================
   COMPONENT SHAPES
========================================================= */

const COMPONENT = {
  triangle: `
    M ${BASE.triLeft} ${BASE.triTop}
    L ${BASE.triTip} ${BASE.centerY}
    L ${BASE.triLeft} ${BASE.triBottom}
    Z
  `,

  cathodeBar: `
    M ${BASE.cathodeX} ${BASE.cathodeTop}
    L ${BASE.cathodeX} ${BASE.cathodeBottom}
  `,
};

/* =========================================================
   NODE SYSTEM
========================================================= */

const NODE = {
  anode: { x: 60, y: 100 },
  join: { x: 150, y: 100 },
  tip: { x: 255, y: 100 },
  cathodeJoin: { x: 270, y: 100 },
  cathode: { x: 380, y: 100 },
};

/* =========================================================
   PATH SYSTEM
========================================================= */

const PATH = {
  anodeWire: `M ${NODE.anode.x} ${NODE.anode.y} L ${NODE.join.x} ${NODE.join.y}`,
  cathodeWire: `M ${NODE.cathodeJoin.x} ${NODE.cathodeJoin.y} L ${NODE.cathode.x} ${NODE.cathode.y}`,
};

/* =========================================================
   LABEL SYSTEM
========================================================= */

const LABEL = {
  anode: { text: "Anode", x: 60, y: 40 },
  cathode: { text: "Cathode", x: 370, y: 40 },
  title: { text: "Photodiode", x: 200, y: 190 },
};

/* =========================================================
   SYMBOL BLOCK
========================================================= */

function PhotodiodeBody() {
  return (
    <g
      fill="none"
      stroke="#000"
      strokeWidth={5}
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      <path d={COMPONENT.triangle} fill="#000" />
      <path d={COMPONENT.cathodeBar} />

      {/* Incident light arrows */}
      <line
        x1={BASE.arrow1.x1}
        y1={BASE.arrow1.y1}
        x2={BASE.arrow1.x2}
        y2={BASE.arrow1.y2}
        stroke="#000"
        strokeWidth={3}
      />

      <line
        x1={BASE.arrow2.x1}
        y1={BASE.arrow2.y1}
        x2={BASE.arrow2.x2}
        y2={BASE.arrow2.y2}
        stroke="#000"
        strokeWidth={3}
      />

      {/* arrow heads */}
      <polygon points="320,30 312,35 318,42" fill="#000" />
      <polygon points="340,50 332,55 338,62" fill="#000" />
    </g>
  );
}

/* =========================================================
   LABEL BLOCK
========================================================= */

function PhotodiodeLabels() {
  return (
    <g fontFamily="Arial" fill="#000" fontWeight={700}>
      <text x={LABEL.anode.x} y={LABEL.anode.y}>
        {LABEL.anode.text}
      </text>

      <text x={LABEL.cathode.x} y={LABEL.cathode.y}>
        {LABEL.cathode.text}
      </text>

      <text x={LABEL.title.x} y={LABEL.title.y} textAnchor="middle">
        {LABEL.title.text}
      </text>
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export function PhotodiodeSymbol({
  showDebug = DEBUG,
}: {
  showDebug?: boolean;
}) {
  return (
    <svg viewBox={`0 0 ${VIEW_BOX.w} ${VIEW_BOX.h}`}>
      <rect width="100%" height="100%" fill="#fff" />

      {/* wires */}
      <WireSegment d={PATH.anodeWire} />
      <WireSegment d={PATH.cathodeWire} />

      {/* body */}
      <PhotodiodeBody />

      {/* labels */}
      <PhotodiodeLabels />

      {/* debug */}
      {showDebug && (
        <>
          <DebugDot x={NODE.anode.x} y={NODE.anode.y} label="A" />
          <DebugDot x={NODE.join.x} y={NODE.join.y} label="J" />
          <DebugDot x={NODE.tip.x} y={NODE.tip.y} label="TIP" />
          <DebugDot x={NODE.cathode.x} y={NODE.cathode.y} label="C" />
        </>
      )}
    </svg>
  );
}

/* =========================================================
   WRAPPER
========================================================= */

export default function PhotodiodeLibraryPreview() {
  return (
    <div className="flex flex-col items-center gap-6 bg-white p-4">
      <PhotodiodeSymbol />
    </div>
  );
}