"use client";

import React from "react";

type CircuitProps = {
  className?: string;
  showDebug?: boolean;
};

/* ===================== SHARED SCALE CONSTANTS ===================== */
const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 10;

/* ===================== SHARED POSITION TUNING ===================== */
const COMPONENT_OFFSET = { x: 0, y: 0 };
const WIRE_OFFSET = { x: 0, y: 0 };
const DEBUG_TERMINAL_OFFSET = { x: 0, y: 0 };

const DEBUG = false;

/* ===================== SHARED WIRE ===================== */
const WIRE = {
  stroke: "#000000",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  cap: "round" as const,
  join: "round" as const,
};

/* ===================== REUSABLE SVG BLOCKS ===================== */
function WireSegment({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={WIRE.stroke}
      strokeWidth={WIRE.width}
      strokeLinecap={WIRE.cap}
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
   SCHOTTKY DIODE SYMBOL
========================================================= */

/* ===================== VIEW_BOX ===================== */
const SYMBOL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 900,
  H: 260,
};

/* ===================== BASE_COMPONENT ===================== */
const SYMBOL_BASE_COMPONENT = {
  centerX: 450 + COMPONENT_OFFSET.x,
  centerY: 130 + COMPONENT_OFFSET.y,

  triangleLeftX: 360 + COMPONENT_OFFSET.x,
  triangleTopY: 45 + COMPONENT_OFFSET.y,
  triangleBottomY: 215 + COMPONENT_OFFSET.y,
  triangleTipX: 520 + COMPONENT_OFFSET.x,

  cathodeX: 520 + COMPONENT_OFFSET.x,
  cathodeTopY: 55 + COMPONENT_OFFSET.y,
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

  schottkyBar: {
    main: `M ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTopY}
           L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottomY}`,

    topStep: `M ${SYMBOL_BASE_COMPONENT.cathodeX - 35} ${SYMBOL_BASE_COMPONENT.cathodeTopY}
              L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTopY}
              L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTopY + 35}`,

    bottomStep: `M ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottomY - 35}
                 L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottomY}
                 L ${SYMBOL_BASE_COMPONENT.cathodeX + 35} ${SYMBOL_BASE_COMPONENT.cathodeBottomY}`,
  },
};

/* ===================== NODE ===================== */
const SYMBOL_NODE = {
  anodeTerminal: { x: 175 + WIRE_OFFSET.x, y: 130 + WIRE_OFFSET.y },
  anodeJoin: { x: 360 + WIRE_OFFSET.x, y: 130 + WIRE_OFFSET.y },
  cathodeJoin: { x: 520 + WIRE_OFFSET.x, y: 130 + WIRE_OFFSET.y },
  cathodeTerminal: { x: 725 + WIRE_OFFSET.x, y: 130 + WIRE_OFFSET.y },
};

/* ===================== PATH ===================== */
const SYMBOL_PATH = {
  anodeWire: `M ${SYMBOL_NODE.anodeTerminal.x} ${SYMBOL_NODE.anodeTerminal.y} L ${SYMBOL_NODE.anodeJoin.x} ${SYMBOL_NODE.anodeJoin.y}`,
  cathodeWire: `M ${SYMBOL_NODE.cathodeJoin.x} ${SYMBOL_NODE.cathodeJoin.y} L ${SYMBOL_NODE.cathodeTerminal.x} ${SYMBOL_NODE.cathodeTerminal.y}`,
};

/* ===================== LABEL ===================== */
const SYMBOL_LABEL = {
  anode: { text: "Anode", sub: "(+)", x: 95, y: 118 },
  cathode: { text: "Cathode", sub: "(-)", x: 805, y: 118 },
};

function SchottkyTriangle() {
  return (
    <polygon
      points={SYMBOL_COMPONENT.triangle.points}
      fill="#000000"
      stroke="#000000"
      strokeWidth={WIRE.width}
      strokeLinejoin="round"
      transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}
    />
  );
}

function SchottkyCathodeBar() {
  return (
    <g
      fill="none"
      stroke="#000000"
      strokeWidth={WIRE.width}
      strokeLinecap="square"
      strokeLinejoin="miter"
      transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}
    >
      <path d={SYMBOL_COMPONENT.schottkyBar.topStep} />
      <path d={SYMBOL_COMPONENT.schottkyBar.main} />
      <path d={SYMBOL_COMPONENT.schottkyBar.bottomStep} />
    </g>
  );
}

function SymbolLabels() {
  return (
    <g fontFamily="Arial, Helvetica, sans-serif" fontWeight={700} fill="#000000">
      <text x={SYMBOL_LABEL.anode.x} y={SYMBOL_LABEL.anode.y} textAnchor="middle" fontSize={30}>
        {SYMBOL_LABEL.anode.text}
      </text>
      <text x={SYMBOL_LABEL.anode.x} y={SYMBOL_LABEL.anode.y + 34} textAnchor="middle" fontSize={30}>
        {SYMBOL_LABEL.anode.sub}
      </text>

      <text x={SYMBOL_LABEL.cathode.x} y={SYMBOL_LABEL.cathode.y} textAnchor="middle" fontSize={30}>
        {SYMBOL_LABEL.cathode.text}
      </text>
      <text x={SYMBOL_LABEL.cathode.x} y={SYMBOL_LABEL.cathode.y + 34} textAnchor="middle" fontSize={30}>
        {SYMBOL_LABEL.cathode.sub}
      </text>
    </g>
  );
}

export function SchottkyDiodeSymbol({
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
        className="h-auto w-full max-w-[900px]"
        role="img"
        aria-label="Schottky diode symbol"
        shapeRendering="geometricPrecision"
      >
        <rect width={SYMBOL_VIEW_BOX.W} height={SYMBOL_VIEW_BOX.H} fill="#ffffff" />

        <WireSegment d={SYMBOL_PATH.anodeWire} />
        <WireSegment d={SYMBOL_PATH.cathodeWire} />

        <circle cx={SYMBOL_NODE.anodeTerminal.x} cy={SYMBOL_NODE.anodeTerminal.y} r={9} fill="#000000" />
        <circle cx={SYMBOL_NODE.cathodeTerminal.x} cy={SYMBOL_NODE.cathodeTerminal.y} r={9} fill="#000000" />

        <SchottkyTriangle />
        <SchottkyCathodeBar />
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
   SCHOTTKY DIODE PHYSICAL COMPONENT
========================================================= */

/* ===================== VIEW_BOX ===================== */
const PHYSICAL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 900,
  H: 230,
};

/* ===================== BASE_COMPONENT ===================== */
const PHYSICAL_BASE_COMPONENT = {
  centerX: 450 + COMPONENT_OFFSET.x,
  centerY: 112 + COMPONENT_OFFSET.y,
  bodyX: 320 + COMPONENT_OFFSET.x,
  bodyY: 58 + COMPONENT_OFFSET.y,
  bodyW: 260,
  bodyH: 98,
};

/* ===================== COMPONENT ===================== */
const PHYSICAL_COMPONENT = {
  body: {
    x: PHYSICAL_BASE_COMPONENT.bodyX,
    y: PHYSICAL_BASE_COMPONENT.bodyY,
    w: PHYSICAL_BASE_COMPONENT.bodyW,
    h: PHYSICAL_BASE_COMPONENT.bodyH,
    fill: "#1d1d1d",
  },

  bodyHighlight: {
    x: PHYSICAL_BASE_COMPONENT.bodyX + 22,
    y: PHYSICAL_BASE_COMPONENT.bodyY + 14,
    w: PHYSICAL_BASE_COMPONENT.bodyW - 44,
    h: 18,
    fill: "#3a3a3a",
  },

  cathodeBand: {
    x: 510 + COMPONENT_OFFSET.x,
    y: 58 + COMPONENT_OFFSET.y,
    w: 28,
    h: 98,
    fill: "#d8d8d8",
  },

  marking: {
    text: "BAT54",
    x: 430 + COMPONENT_OFFSET.x,
    y: 121 + COMPONENT_OFFSET.y,
  },
};

/* ===================== NODE ===================== */
const PHYSICAL_NODE = {
  anodeWireStart: { x: 175 + WIRE_OFFSET.x, y: 112 + WIRE_OFFSET.y },
  anodeBodyJoin: { x: 320 + WIRE_OFFSET.x, y: 112 + WIRE_OFFSET.y },
  cathodeBodyJoin: { x: 580 + WIRE_OFFSET.x, y: 112 + WIRE_OFFSET.y },
  cathodeWireEnd: { x: 725 + WIRE_OFFSET.x, y: 112 + WIRE_OFFSET.y },
};

/* ===================== PATH ===================== */
const PHYSICAL_PATH = {
  anodeWire: `M ${PHYSICAL_NODE.anodeWireStart.x} ${PHYSICAL_NODE.anodeWireStart.y} L ${PHYSICAL_NODE.anodeBodyJoin.x} ${PHYSICAL_NODE.anodeBodyJoin.y}`,
  cathodeWire: `M ${PHYSICAL_NODE.cathodeBodyJoin.x} ${PHYSICAL_NODE.cathodeBodyJoin.y} L ${PHYSICAL_NODE.cathodeWireEnd.x} ${PHYSICAL_NODE.cathodeWireEnd.y}`,
};

/* ===================== LABEL ===================== */
const PHYSICAL_LABEL = {
  anode: { text: "Anode", sub: "(+)", x: 88, y: 92 },
  cathode: { text: "Cathode", sub: "(-)", x: 810, y: 92 },
};

function PhysicalLabels() {
  return (
    <g fontFamily="Arial, Helvetica, sans-serif" fontWeight={700} fill="#000000">
      <text x={PHYSICAL_LABEL.anode.x} y={PHYSICAL_LABEL.anode.y} textAnchor="middle" fontSize={30}>
        {PHYSICAL_LABEL.anode.text}
      </text>
      <text x={PHYSICAL_LABEL.anode.x} y={PHYSICAL_LABEL.anode.y + 34} textAnchor="middle" fontSize={30}>
        {PHYSICAL_LABEL.anode.sub}
      </text>

      <text x={PHYSICAL_LABEL.cathode.x} y={PHYSICAL_LABEL.cathode.y} textAnchor="middle" fontSize={30}>
        {PHYSICAL_LABEL.cathode.text}
      </text>
      <text x={PHYSICAL_LABEL.cathode.x} y={PHYSICAL_LABEL.cathode.y + 34} textAnchor="middle" fontSize={30}>
        {PHYSICAL_LABEL.cathode.sub}
      </text>
    </g>
  );
}

function SchottkyPhysicalBody() {
  return (
    <g transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}>
      <rect
        x={PHYSICAL_COMPONENT.body.x}
        y={PHYSICAL_COMPONENT.body.y}
        width={PHYSICAL_COMPONENT.body.w}
        height={PHYSICAL_COMPONENT.body.h}
        rx={4}
        fill={PHYSICAL_COMPONENT.body.fill}
      />

      <rect
        x={PHYSICAL_COMPONENT.bodyHighlight.x}
        y={PHYSICAL_COMPONENT.bodyHighlight.y}
        width={PHYSICAL_COMPONENT.bodyHighlight.w}
        height={PHYSICAL_COMPONENT.bodyHighlight.h}
        rx={5}
        fill={PHYSICAL_COMPONENT.bodyHighlight.fill}
        opacity={0.65}
      />

      <rect
        x={PHYSICAL_COMPONENT.cathodeBand.x}
        y={PHYSICAL_COMPONENT.cathodeBand.y}
        width={PHYSICAL_COMPONENT.cathodeBand.w}
        height={PHYSICAL_COMPONENT.cathodeBand.h}
        fill={PHYSICAL_COMPONENT.cathodeBand.fill}
      />

      <text
        x={PHYSICAL_COMPONENT.marking.x}
        y={PHYSICAL_COMPONENT.marking.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={24}
        fontWeight={700}
        fill="#6f6f6f"
      >
        {PHYSICAL_COMPONENT.marking.text}
      </text>
    </g>
  );
}

export function SchottkyDiodePhysicalComponent({
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
        className="h-auto w-full max-w-[900px]"
        role="img"
        aria-label="Schottky diode physical component"
        shapeRendering="geometricPrecision"
      >
        <rect width={PHYSICAL_VIEW_BOX.W} height={PHYSICAL_VIEW_BOX.H} fill="#ffffff" />

        <WireSegment d={PHYSICAL_PATH.anodeWire} />
        <WireSegment d={PHYSICAL_PATH.cathodeWire} />

        <SchottkyPhysicalBody />
        <PhysicalLabels />

        {showDebug && (
          <>
            <DebugTerminalDot x={PHYSICAL_NODE.anodeWireStart.x} y={PHYSICAL_NODE.anodeWireStart.y} label="ANODE" />
            <DebugTerminalDot x={PHYSICAL_NODE.anodeBodyJoin.x} y={PHYSICAL_NODE.anodeBodyJoin.y} label="BODY_START" />
            <DebugTerminalDot x={PHYSICAL_NODE.cathodeBodyJoin.x} y={PHYSICAL_NODE.cathodeBodyJoin.y} label="BODY_END" />
            <DebugTerminalDot x={PHYSICAL_NODE.cathodeWireEnd.x} y={PHYSICAL_NODE.cathodeWireEnd.y} label="CATHODE" />
          </>
        )}
      </svg>
    </div>
  );
}

/* =========================================================
   OPTIONAL PREVIEW WRAPPER
========================================================= */

export default function SchottkyDiodeLibraryPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-6 bg-white p-4">
      <SchottkyDiodeSymbol />
      <SchottkyDiodePhysicalComponent />
    </div>
  );
}