"use client";

import React from "react";

/* =========================================================
   GLOBAL SCALE SYSTEM
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
   REUSABLE CORE BLOCKS
========================================================= */

const WIRE = {
  stroke: "#0a8f6a",
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
   BASE COMPONENT
========================================================= */

const BASE = {
  centerY: 100,

  triLeft: 150,
  triTop: 60,
  triBottom: 140,
  triTip: 250,

  cathodeX: 265,
  cathodeTop: 60,
  cathodeBottom: 140,

  thermalLabelX: 210,
  thermalLabelY: 150,
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
  junction: { x: 255, y: 100 },
  cathode: { x: 380, y: 100 },
};

/* =========================================================
   PATH SYSTEM
========================================================= */

const PATH = {
  anodeWire: `M ${NODE.anode.x} ${NODE.anode.y} L ${NODE.join.x} ${NODE.join.y}`,
  cathodeWire: `M ${NODE.junction.x} ${NODE.junction.y} L ${NODE.cathode.x} ${NODE.cathode.y}`,
};

/* =========================================================
   LABEL SYSTEM
========================================================= */

const LABEL = {
  anode: { text: "+ (Anode)", x: 70, y: 45 },
  cathode: { text: "- (Cathode)", x: 350, y: 45 },
  thermal: { text: "t°", x: BASE.thermalLabelX, y: BASE.thermalLabelY },
  title: { text: "Thermal diode", x: 200, y: 185 },
};

/* =========================================================
   SYMBOL BLOCK
========================================================= */

function ThermalDiodeBody() {
  return (
    <g
      fill="none"
      stroke="#0a8f6a"
      strokeWidth={5}
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      {/* diode triangle */}
      <path d={COMPONENT.triangle} fill="#0a8f6a" />

      {/* cathode bar */}
      <path d={COMPONENT.cathodeBar} />

      {/* thermal symbol (t°) line under junction */}
      <text
        x={LABEL.thermal.x}
        y={LABEL.thermal.y}
        fontSize={18}
        fill="#0a8f6a"
        fontWeight={700}
      >
        {LABEL.thermal.text}
      </text>
    </g>
  );
}

/* =========================================================
   LABEL BLOCK
========================================================= */

function ThermalLabels() {
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

export function ThermalDiodeSymbol({
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
      <ThermalDiodeBody />

      {/* labels */}
      <ThermalLabels />

      {/* debug system */}
      {showDebug && (
        <>
          <DebugDot x={NODE.anode.x} y={NODE.anode.y} label="A" />
          <DebugDot x={NODE.join.x} y={NODE.join.y} label="J" />
          <DebugDot x={NODE.cathode.x} y={NODE.cathode.y} label="C" />
        </>
      )}
    </svg>
  );
}

/* =========================================================
   WRAPPER LIBRARY PREVIEW
========================================================= */

export default function ThermalDiodeLibrary() {
  return (
    <div className="flex flex-col items-center gap-6 bg-white p-4">
      <ThermalDiodeSymbol />
    </div>
  );
}