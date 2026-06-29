"use client";

import React from "react";

type CircuitComponentProps = {
  className?: string;
  showDebug?: boolean;
};

/* =========================================================
   SHARED SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 4;

/* =========================================================
   SHARED POSITION/OFFSET CONTROLS
========================================================= */

const COMPONENT_OFFSET = {
  x: 0,
  y: 0,
};

const WIRE_OFFSET = {
  x: 0,
  y: 0,
};

const DEBUG_TERMINAL_OFFSET = {
  x: 0,
  y: 0,
};

const DEBUG = false;

/* =========================================================
   SHARED WIRE CONFIGURATION
========================================================= */

const WIRE = {
  stroke: "#111111",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  cap: "butt" as const,
  join: "miter" as const,
};

/* =========================================================
   SHARED REUSABLE SVG BLOCKS
========================================================= */

type WireSegmentProps = {
  d: string;
  stroke?: string;
  width?: number;
  cap?: "butt" | "round" | "square";
  opacity?: number;
};

function WireSegment({
  d,
  stroke = WIRE.stroke,
  width = WIRE.width,
  cap = WIRE.cap,
  opacity = 1,
}: WireSegmentProps) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap={cap}
      strokeLinejoin={WIRE.join}
      opacity={opacity}
    />
  );
}

type DebugTerminalDotProps = {
  x: number;
  y: number;
  label: string;
};

function DebugTerminalDot({
  x,
  y,
  label,
}: DebugTerminalDotProps) {
  return (
    <g
      transform={`translate(
        ${DEBUG_TERMINAL_OFFSET.x},
        ${DEBUG_TERMINAL_OFFSET.y}
      )`}
      pointerEvents="none"
    >
      <circle cx={x} cy={y} r={5} fill="#ff0000" />

      <line
        x1={x - 8}
        y1={y}
        x2={x + 8}
        y2={y}
        stroke="#ff0000"
        strokeWidth={1}
      />

      <line
        x1={x}
        y1={y - 8}
        x2={x}
        y2={y + 8}
        stroke="#ff0000"
        strokeWidth={1}
      />

      <text
        x={x + 9}
        y={y - 9}
        fill="#ff0000"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={11}
        fontWeight={700}
      >
        {label}
      </text>
    </g>
  );
}

type TerminalProps = {
  x: number;
  y: number;
  radius?: number;
  fill?: string;
};

function Terminal({
  x,
  y,
  radius = 4,
  fill = WIRE.stroke,
}: TerminalProps) {
  return <circle cx={x} cy={y} r={radius} fill={fill} />;
}

/* =========================================================
   LED SYMBOL ARCHITECTURE
========================================================= */

/* ===================== VIEW_BOX ===================== */

const SYMBOL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 410,
  H: 305,
};

/* ===================== SCALE ===================== */

const SYMBOL_SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

/* ===================== BASE_COMPONENT ===================== */

const SYMBOL_BASE_COMPONENT = {
  centerX: 218 + COMPONENT_OFFSET.x,
  centerY: 151 + COMPONENT_OFFSET.y,

  circleCenterX: 218 + COMPONENT_OFFSET.x,
  circleCenterY: 151 + COMPONENT_OFFSET.y,
  circleRadius: 80,

  triangleLeftX: 177 + COMPONENT_OFFSET.x,
  triangleTopY: 105 + COMPONENT_OFFSET.y,
  triangleBottomY: 199 + COMPONENT_OFFSET.y,
  triangleTipX: 259 + COMPONENT_OFFSET.x,

  cathodeX: 260 + COMPONENT_OFFSET.x,
  cathodeTopY: 102 + COMPONENT_OFFSET.y,
  cathodeBottomY: 201 + COMPONENT_OFFSET.y,
};

/* ===================== COMPONENT ===================== */

const SYMBOL_COMPONENT = {
  enclosure: {
    cx: SYMBOL_BASE_COMPONENT.circleCenterX,
    cy: SYMBOL_BASE_COMPONENT.circleCenterY,
    r: SYMBOL_BASE_COMPONENT.circleRadius,
    strokeWidth: 4,
  },

  triangle: {
    points: `
      ${SYMBOL_BASE_COMPONENT.triangleLeftX},
      ${SYMBOL_BASE_COMPONENT.triangleTopY}

      ${SYMBOL_BASE_COMPONENT.triangleTipX},
      ${SYMBOL_BASE_COMPONENT.centerY}

      ${SYMBOL_BASE_COMPONENT.triangleLeftX},
      ${SYMBOL_BASE_COMPONENT.triangleBottomY}
    `,
    strokeWidth: 4,
  },

  cathodeBar: {
    x1: SYMBOL_BASE_COMPONENT.cathodeX,
    y1: SYMBOL_BASE_COMPONENT.cathodeTopY,
    x2: SYMBOL_BASE_COMPONENT.cathodeX,
    y2: SYMBOL_BASE_COMPONENT.cathodeBottomY,
    strokeWidth: 4,
  },

  lightArrowOne: {
    shaft: {
      x1: 260 + COMPONENT_OFFSET.x,
      y1: 69 + COMPONENT_OFFSET.y,
      x2: 291 + COMPONENT_OFFSET.x,
      y2: 34 + COMPONENT_OFFSET.y,
    },
    head: `
      M ${291 + COMPONENT_OFFSET.x} ${34 + COMPONENT_OFFSET.y}
      L ${282 + COMPONENT_OFFSET.x} ${38 + COMPONENT_OFFSET.y}
      L ${287 + COMPONENT_OFFSET.x} ${47 + COMPONENT_OFFSET.y}
      Z
    `,
  },

  lightArrowTwo: {
    shaft: {
      x1: 284 + COMPONENT_OFFSET.x,
      y1: 88 + COMPONENT_OFFSET.y,
      x2: 315 + COMPONENT_OFFSET.x,
      y2: 54 + COMPONENT_OFFSET.y,
    },
    head: `
      M ${315 + COMPONENT_OFFSET.x} ${54 + COMPONENT_OFFSET.y}
      L ${305 + COMPONENT_OFFSET.x} ${58 + COMPONENT_OFFSET.y}
      L ${311 + COMPONENT_OFFSET.x} ${67 + COMPONENT_OFFSET.y}
      Z
    `,
  },
};

/* ===================== NODE ===================== */

const SYMBOL_NODE = {
  anodeTerminal: {
    x: 90 + WIRE_OFFSET.x,
    y: 151 + WIRE_OFFSET.y,
  },

  anodeCircleEntry: {
    x: 138 + WIRE_OFFSET.x,
    y: 151 + WIRE_OFFSET.y,
  },

  triangleBaseJoin: {
    x: 177 + WIRE_OFFSET.x,
    y: 151 + WIRE_OFFSET.y,
  },

  diodeJunction: {
    x: 260 + WIRE_OFFSET.x,
    y: 151 + WIRE_OFFSET.y,
  },

  cathodeCircleExit: {
    x: 298 + WIRE_OFFSET.x,
    y: 151 + WIRE_OFFSET.y,
  },

  cathodeTerminal: {
    x: 347 + WIRE_OFFSET.x,
    y: 151 + WIRE_OFFSET.y,
  },

  lightArrowOneStart: {
    x: SYMBOL_COMPONENT.lightArrowOne.shaft.x1,
    y: SYMBOL_COMPONENT.lightArrowOne.shaft.y1,
  },

  lightArrowOneEnd: {
    x: SYMBOL_COMPONENT.lightArrowOne.shaft.x2,
    y: SYMBOL_COMPONENT.lightArrowOne.shaft.y2,
  },

  lightArrowTwoStart: {
    x: SYMBOL_COMPONENT.lightArrowTwo.shaft.x1,
    y: SYMBOL_COMPONENT.lightArrowTwo.shaft.y1,
  },

  lightArrowTwoEnd: {
    x: SYMBOL_COMPONENT.lightArrowTwo.shaft.x2,
    y: SYMBOL_COMPONENT.lightArrowTwo.shaft.y2,
  },
};

/* ===================== PATH ===================== */

const SYMBOL_PATH = {
  anodeWire: `
    M ${SYMBOL_NODE.anodeTerminal.x} ${SYMBOL_NODE.anodeTerminal.y}
    L ${SYMBOL_NODE.diodeJunction.x} ${SYMBOL_NODE.diodeJunction.y}
  `,

  cathodeWire: `
    M ${SYMBOL_NODE.diodeJunction.x} ${SYMBOL_NODE.diodeJunction.y}
    L ${SYMBOL_NODE.cathodeTerminal.x} ${SYMBOL_NODE.cathodeTerminal.y}
  `,

  lightArrowOne: `
    M ${SYMBOL_COMPONENT.lightArrowOne.shaft.x1}
      ${SYMBOL_COMPONENT.lightArrowOne.shaft.y1}
    L ${SYMBOL_COMPONENT.lightArrowOne.shaft.x2}
      ${SYMBOL_COMPONENT.lightArrowOne.shaft.y2}
  `,

  lightArrowTwo: `
    M ${SYMBOL_COMPONENT.lightArrowTwo.shaft.x1}
      ${SYMBOL_COMPONENT.lightArrowTwo.shaft.y1}
    L ${SYMBOL_COMPONENT.lightArrowTwo.shaft.x2}
      ${SYMBOL_COMPONENT.lightArrowTwo.shaft.y2}
  `,
};

/* ===================== LABEL ===================== */

const SYMBOL_LABEL = {
  anode: {
    text: "ANODE",
    x: 82,
    y: 139,
    fontSize: 24,
  },

  cathode: {
    text: "CATHODE",
    x: 353,
    y: 139,
    fontSize: 24,
  },
};

/* ===================== SYMBOL REUSABLE BLOCKS ===================== */

function LedSymbolLabels() {
  return (
    <g
      fill="#111111"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight={500}
    >
      <text
        x={SYMBOL_LABEL.anode.x}
        y={SYMBOL_LABEL.anode.y}
        textAnchor="middle"
        fontSize={SYMBOL_LABEL.anode.fontSize}
      >
        {SYMBOL_LABEL.anode.text}
      </text>

      <text
        x={SYMBOL_LABEL.cathode.x}
        y={SYMBOL_LABEL.cathode.y}
        textAnchor="middle"
        fontSize={SYMBOL_LABEL.cathode.fontSize}
      >
        {SYMBOL_LABEL.cathode.text}
      </text>
    </g>
  );
}

function LedSymbolEnclosure() {
  return (
    <circle
      cx={SYMBOL_COMPONENT.enclosure.cx}
      cy={SYMBOL_COMPONENT.enclosure.cy}
      r={SYMBOL_COMPONENT.enclosure.r}
      fill="none"
      stroke="#111111"
      strokeWidth={SYMBOL_COMPONENT.enclosure.strokeWidth}
    />
  );
}

function LedDiodeBody() {
  return (
    <g
      transform={`
        translate(
          ${SYMBOL_BASE_COMPONENT.centerX},
          ${SYMBOL_BASE_COMPONENT.centerY}
        )
        scale(${SYMBOL_SCALE.component})
        translate(
          ${-SYMBOL_BASE_COMPONENT.centerX},
          ${-SYMBOL_BASE_COMPONENT.centerY}
        )
      `}
      fill="none"
      stroke="#111111"
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      <polygon
        points={SYMBOL_COMPONENT.triangle.points}
        strokeWidth={SYMBOL_COMPONENT.triangle.strokeWidth}
      />

      <line
        x1={SYMBOL_COMPONENT.cathodeBar.x1}
        y1={SYMBOL_COMPONENT.cathodeBar.y1}
        x2={SYMBOL_COMPONENT.cathodeBar.x2}
        y2={SYMBOL_COMPONENT.cathodeBar.y2}
        strokeWidth={SYMBOL_COMPONENT.cathodeBar.strokeWidth}
      />
    </g>
  );
}

function LedLightArrows() {
  return (
    <g
      fill="#000000"
      stroke="#000000"
      strokeWidth={5}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d={SYMBOL_PATH.lightArrowOne} />
      <path
        d={SYMBOL_COMPONENT.lightArrowOne.head}
        strokeWidth={1}
      />

      <path d={SYMBOL_PATH.lightArrowTwo} />
      <path
        d={SYMBOL_COMPONENT.lightArrowTwo.head}
        strokeWidth={1}
      />
    </g>
  );
}

/* =========================================================
   LED SYMBOL COMPONENT
========================================================= */

export function LedDiodeSymbol({
  className = "",
  showDebug = DEBUG,
}: CircuitComponentProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white ${className}`}
      style={{
        transform: `scale(${SYMBOL_SCALE.canvas})`,
        transformOrigin: "center center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`
          ${SYMBOL_VIEW_BOX.X}
          ${SYMBOL_VIEW_BOX.Y}
          ${SYMBOL_VIEW_BOX.W}
          ${SYMBOL_VIEW_BOX.H}
        `}
        className="block h-auto w-full max-w-[410px]"
        role="img"
        aria-label="Light-emitting diode circuit symbol"
        shapeRendering="geometricPrecision"
      >
        <rect
          x={SYMBOL_VIEW_BOX.X}
          y={SYMBOL_VIEW_BOX.Y}
          width={SYMBOL_VIEW_BOX.W}
          height={SYMBOL_VIEW_BOX.H}
          fill="#ffffff"
        />

        <LedSymbolLabels />

        <WireSegment
          d={SYMBOL_PATH.anodeWire}
          width={WIRE.width}
        />

        <WireSegment
          d={SYMBOL_PATH.cathodeWire}
          width={WIRE.width}
        />

        <LedSymbolEnclosure />
        <LedDiodeBody />
        <LedLightArrows />

        {showDebug && (
          <>
            <DebugTerminalDot
              x={SYMBOL_NODE.anodeTerminal.x}
              y={SYMBOL_NODE.anodeTerminal.y}
              label="ANODE"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.anodeCircleEntry.x}
              y={SYMBOL_NODE.anodeCircleEntry.y}
              label="CIRCLE_ENTRY"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.triangleBaseJoin.x}
              y={SYMBOL_NODE.triangleBaseJoin.y}
              label="TRIANGLE_BASE"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.diodeJunction.x}
              y={SYMBOL_NODE.diodeJunction.y}
              label="JUNCTION"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.cathodeCircleExit.x}
              y={SYMBOL_NODE.cathodeCircleExit.y}
              label="CIRCLE_EXIT"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.cathodeTerminal.x}
              y={SYMBOL_NODE.cathodeTerminal.y}
              label="CATHODE"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.lightArrowOneStart.x}
              y={SYMBOL_NODE.lightArrowOneStart.y}
              label="ARROW_1_START"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.lightArrowOneEnd.x}
              y={SYMBOL_NODE.lightArrowOneEnd.y}
              label="ARROW_1_END"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.lightArrowTwoStart.x}
              y={SYMBOL_NODE.lightArrowTwoStart.y}
              label="ARROW_2_START"
            />

            <DebugTerminalDot
              x={SYMBOL_NODE.lightArrowTwoEnd.x}
              y={SYMBOL_NODE.lightArrowTwoEnd.y}
              label="ARROW_2_END"
            />
          </>
        )}
      </svg>
    </div>
  );
}

/* =========================================================
   LED PHYSICAL COMPONENT ARCHITECTURE
========================================================= */

/* ===================== VIEW_BOX ===================== */

const PHYSICAL_VIEW_BOX = {
  X: 0,
  Y: 0,
  W: 225,
  H: 305,
};

/* ===================== SCALE ===================== */

const PHYSICAL_SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

/* ===================== BASE_COMPONENT ===================== */

const PHYSICAL_BASE_COMPONENT = {
  centerX: 113 + COMPONENT_OFFSET.x,
  centerY: 118 + COMPONENT_OFFSET.y,

  domeCenterX: 113 + COMPONENT_OFFSET.x,
  domeTopY: 10 + COMPONENT_OFFSET.y,
  domeWidth: 74,
  domeHeight: 131,

  flangeCenterX: 113 + COMPONENT_OFFSET.x,
  flangeY: 111 + COMPONENT_OFFSET.y,
  flangeWidth: 111,
  flangeHeight: 28,

  leftLeadX: 91 + COMPONENT_OFFSET.x,
  rightLeadX: 136 + COMPONENT_OFFSET.x,

  leftLeadTopY: 131 + COMPONENT_OFFSET.y,
  leftLeadBottomY: 253 + COMPONENT_OFFSET.y,

  rightLeadTopY: 131 + COMPONENT_OFFSET.y,
  rightLeadBottomY: 292 + COMPONENT_OFFSET.y,
};

/* ===================== COMPONENT ===================== */

const PHYSICAL_COMPONENT = {
  dome: {
    x: PHYSICAL_BASE_COMPONENT.domeCenterX -
      PHYSICAL_BASE_COMPONENT.domeWidth / 2,

    y: PHYSICAL_BASE_COMPONENT.domeTopY,

    w: PHYSICAL_BASE_COMPONENT.domeWidth,
    h: PHYSICAL_BASE_COMPONENT.domeHeight,

    rx: PHYSICAL_BASE_COMPONENT.domeWidth / 2,
  },

  flange: {
    x: PHYSICAL_BASE_COMPONENT.flangeCenterX -
      PHYSICAL_BASE_COMPONENT.flangeWidth / 2,

    y: PHYSICAL_BASE_COMPONENT.flangeY,

    w: PHYSICAL_BASE_COMPONENT.flangeWidth,
    h: PHYSICAL_BASE_COMPONENT.flangeHeight,

    rx: 10,
  },

  innerAnvil: {
    x: 84 + COMPONENT_OFFSET.x,
    y: 78 + COMPONENT_OFFSET.y,
    w: 24,
    h: 61,
    rx: 3,
  },

  innerPost: {
    x: 120 + COMPONENT_OFFSET.x,
    y: 77 + COMPONENT_OFFSET.y,
    w: 20,
    h: 64,
    rx: 3,
  },

  ledChip: {
    x: 99 + COMPONENT_OFFSET.x,
    y: 101 + COMPONENT_OFFSET.y,
    w: 25,
    h: 10,
    rx: 2,
  },

  bondWire: {
    d: `
      M ${107 + COMPONENT_OFFSET.x} ${99 + COMPONENT_OFFSET.y}
      C ${112 + COMPONENT_OFFSET.x} ${85 + COMPONENT_OFFSET.y},
        ${122 + COMPONENT_OFFSET.x} ${85 + COMPONENT_OFFSET.y},
        ${128 + COMPONENT_OFFSET.x} ${96 + COMPONENT_OFFSET.y}
    `,
  },

  highlightMain: {
    x: 105 + COMPONENT_OFFSET.x,
    y: 13 + COMPONENT_OFFSET.y,
    w: 10,
    h: 95,
    rx: 5,
  },

  highlightSide: {
    x: 77 + COMPONENT_OFFSET.x,
    y: 29 + COMPONENT_OFFSET.y,
    w: 8,
    h: 69,
    rx: 4,
  },
};

/* ===================== NODE ===================== */

const PHYSICAL_NODE = {
  anodeBodyJoin: {
    x: PHYSICAL_BASE_COMPONENT.leftLeadX,
    y: PHYSICAL_BASE_COMPONENT.leftLeadTopY,
  },

  anodeTerminal: {
    x: PHYSICAL_BASE_COMPONENT.leftLeadX,
    y: PHYSICAL_BASE_COMPONENT.leftLeadBottomY,
  },

  cathodeBodyJoin: {
    x: PHYSICAL_BASE_COMPONENT.rightLeadX,
    y: PHYSICAL_BASE_COMPONENT.rightLeadTopY,
  },

  cathodeTerminal: {
    x: PHYSICAL_BASE_COMPONENT.rightLeadX,
    y: PHYSICAL_BASE_COMPONENT.rightLeadBottomY,
  },

  ledChipCenter: {
    x: PHYSICAL_COMPONENT.ledChip.x +
      PHYSICAL_COMPONENT.ledChip.w / 2,

    y: PHYSICAL_COMPONENT.ledChip.y +
      PHYSICAL_COMPONENT.ledChip.h / 2,
  },

  bondWireStart: {
    x: 107 + COMPONENT_OFFSET.x,
    y: 99 + COMPONENT_OFFSET.y,
  },

  bondWireEnd: {
    x: 128 + COMPONENT_OFFSET.x,
    y: 96 + COMPONENT_OFFSET.y,
  },
};

/* ===================== PATH ===================== */

const PHYSICAL_PATH = {
  anodeLead: `
    M ${PHYSICAL_NODE.anodeBodyJoin.x}
      ${PHYSICAL_NODE.anodeBodyJoin.y}

    L ${PHYSICAL_NODE.anodeTerminal.x}
      ${PHYSICAL_NODE.anodeTerminal.y}
  `,

  cathodeLead: `
    M ${PHYSICAL_NODE.cathodeBodyJoin.x}
      ${PHYSICAL_NODE.cathodeBodyJoin.y}

    L ${PHYSICAL_NODE.cathodeTerminal.x}
      ${PHYSICAL_NODE.cathodeTerminal.y}
  `,

  bondWire: PHYSICAL_COMPONENT.bondWire.d,
};

/* ===================== LABEL ===================== */

const PHYSICAL_LABEL = {
  title: {
    text: "LED Physical Component",
    x: PHYSICAL_VIEW_BOX.W / 2,
    y: PHYSICAL_VIEW_BOX.H - 5,
    fontSize: 14,
  },
};

/* ===================== PHYSICAL REUSABLE BLOCKS ===================== */

function LedPhysicalDefs() {
  return (
    <defs>
      <linearGradient
        id="ledBodyGradient"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop offset="0%" stopColor="#ff1f2c" />
        <stop offset="35%" stopColor="#ff3e36" />
        <stop offset="65%" stopColor="#ff493a" />
        <stop offset="100%" stopColor="#e91d2c" />
      </linearGradient>

      <linearGradient
        id="ledFlangeGradient"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="0%" stopColor="#ff4f4b" />
        <stop offset="50%" stopColor="#f9333c" />
        <stop offset="100%" stopColor="#d82131" />
      </linearGradient>

      <linearGradient
        id="ledLeadGradient"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop offset="0%" stopColor="#babbb0" />
        <stop offset="32%" stopColor="#e8e8df" />
        <stop offset="60%" stopColor="#98998e" />
        <stop offset="100%" stopColor="#d7d8cd" />
      </linearGradient>

      <linearGradient
        id="ledInternalMetalGradient"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop offset="0%" stopColor="#a60f14" />
        <stop offset="50%" stopColor="#dd161b" />
        <stop offset="100%" stopColor="#9d0c12" />
      </linearGradient>

      <filter
        id="ledSoftShadow"
        x="-30%"
        y="-30%"
        width="160%"
        height="160%"
      >
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
  );
}

function LedPhysicalLeads() {
  return (
    <g>
      <WireSegment
        d={PHYSICAL_PATH.anodeLead}
        stroke="#a4a59b"
        width={11}
        cap="round"
      />

      <WireSegment
        d={PHYSICAL_PATH.anodeLead}
        stroke="url(#ledLeadGradient)"
        width={7}
        cap="round"
      />

      <WireSegment
        d={PHYSICAL_PATH.cathodeLead}
        stroke="#a4a59b"
        width={11}
        cap="round"
      />

      <WireSegment
        d={PHYSICAL_PATH.cathodeLead}
        stroke="url(#ledLeadGradient)"
        width={7}
        cap="round"
      />
    </g>
  );
}

function LedInternalStructure() {
  return (
    <g opacity={0.55}>
      <rect
        x={PHYSICAL_COMPONENT.innerAnvil.x}
        y={PHYSICAL_COMPONENT.innerAnvil.y}
        width={PHYSICAL_COMPONENT.innerAnvil.w}
        height={PHYSICAL_COMPONENT.innerAnvil.h}
        rx={PHYSICAL_COMPONENT.innerAnvil.rx}
        fill="url(#ledInternalMetalGradient)"
      />

      <rect
        x={PHYSICAL_COMPONENT.innerPost.x}
        y={PHYSICAL_COMPONENT.innerPost.y}
        width={PHYSICAL_COMPONENT.innerPost.w}
        height={PHYSICAL_COMPONENT.innerPost.h}
        rx={PHYSICAL_COMPONENT.innerPost.rx}
        fill="url(#ledInternalMetalGradient)"
      />

      <rect
        x={PHYSICAL_COMPONENT.ledChip.x}
        y={PHYSICAL_COMPONENT.ledChip.y}
        width={PHYSICAL_COMPONENT.ledChip.w}
        height={PHYSICAL_COMPONENT.ledChip.h}
        rx={PHYSICAL_COMPONENT.ledChip.rx}
        fill="#a6000b"
      />

      <path
        d={PHYSICAL_PATH.bondWire}
        fill="none"
        stroke="#ba1118"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

function LedPhysicalBody() {
  return (
    <g
      transform={`
        translate(
          ${PHYSICAL_BASE_COMPONENT.centerX},
          ${PHYSICAL_BASE_COMPONENT.centerY}
        )
        scale(${PHYSICAL_SCALE.component})
        translate(
          ${-PHYSICAL_BASE_COMPONENT.centerX},
          ${-PHYSICAL_BASE_COMPONENT.centerY}
        )
      `}
    >
      <rect
        x={PHYSICAL_COMPONENT.dome.x}
        y={PHYSICAL_COMPONENT.dome.y}
        width={PHYSICAL_COMPONENT.dome.w}
        height={PHYSICAL_COMPONENT.dome.h}
        rx={PHYSICAL_COMPONENT.dome.rx}
        fill="url(#ledBodyGradient)"
        opacity={0.88}
      />

      <LedInternalStructure />

      <rect
        x={PHYSICAL_COMPONENT.flange.x}
        y={PHYSICAL_COMPONENT.flange.y}
        width={PHYSICAL_COMPONENT.flange.w}
        height={PHYSICAL_COMPONENT.flange.h}
        rx={PHYSICAL_COMPONENT.flange.rx}
        fill="url(#ledFlangeGradient)"
        opacity={0.96}
      />

      <rect
        x={PHYSICAL_COMPONENT.highlightMain.x}
        y={PHYSICAL_COMPONENT.highlightMain.y}
        width={PHYSICAL_COMPONENT.highlightMain.w}
        height={PHYSICAL_COMPONENT.highlightMain.h}
        rx={PHYSICAL_COMPONENT.highlightMain.rx}
        fill="#ffffff"
        opacity={0.16}
      />

      <rect
        x={PHYSICAL_COMPONENT.highlightSide.x}
        y={PHYSICAL_COMPONENT.highlightSide.y}
        width={PHYSICAL_COMPONENT.highlightSide.w}
        height={PHYSICAL_COMPONENT.highlightSide.h}
        rx={PHYSICAL_COMPONENT.highlightSide.rx}
        fill="#ffffff"
        opacity={0.1}
      />

      <ellipse
        cx={PHYSICAL_BASE_COMPONENT.domeCenterX}
        cy={PHYSICAL_BASE_COMPONENT.domeTopY + 22}
        rx={28}
        ry={14}
        fill="#ff8874"
        opacity={0.2}
      />
    </g>
  );
}

/* =========================================================
   LED PHYSICAL COMPONENT
========================================================= */

export function LedPhysicalComponent({
  className = "",
  showDebug = DEBUG,
}: CircuitComponentProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white ${className}`}
      style={{
        transform: `scale(${PHYSICAL_SCALE.canvas})`,
        transformOrigin: "center center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`
          ${PHYSICAL_VIEW_BOX.X}
          ${PHYSICAL_VIEW_BOX.Y}
          ${PHYSICAL_VIEW_BOX.W}
          ${PHYSICAL_VIEW_BOX.H}
        `}
        className="block h-auto w-full max-w-[225px]"
        role="img"
        aria-label="Red light-emitting diode physical component"
        shapeRendering="geometricPrecision"
      >
        <LedPhysicalDefs />

        <rect
          x={PHYSICAL_VIEW_BOX.X}
          y={PHYSICAL_VIEW_BOX.Y}
          width={PHYSICAL_VIEW_BOX.W}
          height={PHYSICAL_VIEW_BOX.H}
          fill="#ffffff"
        />

        <LedPhysicalLeads />
        <LedPhysicalBody />

        {showDebug && (
          <>
            <DebugTerminalDot
              x={PHYSICAL_NODE.anodeBodyJoin.x}
              y={PHYSICAL_NODE.anodeBodyJoin.y}
              label="ANODE_BODY"
            />

            <DebugTerminalDot
              x={PHYSICAL_NODE.anodeTerminal.x}
              y={PHYSICAL_NODE.anodeTerminal.y}
              label="ANODE_TERMINAL"
            />

            <DebugTerminalDot
              x={PHYSICAL_NODE.cathodeBodyJoin.x}
              y={PHYSICAL_NODE.cathodeBodyJoin.y}
              label="CATHODE_BODY"
            />

            <DebugTerminalDot
              x={PHYSICAL_NODE.cathodeTerminal.x}
              y={PHYSICAL_NODE.cathodeTerminal.y}
              label="CATHODE_TERMINAL"
            />

            <DebugTerminalDot
              x={PHYSICAL_NODE.ledChipCenter.x}
              y={PHYSICAL_NODE.ledChipCenter.y}
              label="LED_CHIP"
            />

            <DebugTerminalDot
              x={PHYSICAL_NODE.bondWireStart.x}
              y={PHYSICAL_NODE.bondWireStart.y}
              label="BOND_START"
            />

            <DebugTerminalDot
              x={PHYSICAL_NODE.bondWireEnd.x}
              y={PHYSICAL_NODE.bondWireEnd.y}
              label="BOND_END"
            />
          </>
        )}
      </svg>
    </div>
  );
}

/* =========================================================
   OPTIONAL COMBINED LIBRARY PREVIEW
========================================================= */

export default function LedDiodeLibraryPreview() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-10 bg-white p-6">
      <LedDiodeSymbol className="w-full max-w-[410px]" />

      <LedPhysicalComponent className="w-full max-w-[225px]" />
    </div>
  );
}