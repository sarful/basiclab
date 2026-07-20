"use client";

import { useEffect, useMemo, useState } from "react";

/* =========================
   TYPES / INTERFACES
========================= */
type Point = { x: number; y: number };
type PolygonData = Point[];

type TransformControl = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
};

type ComponentControls = {
  body: TransformControl;
  topFace: TransformControl;
  frontFace: TransformControl;
  leftFace: TransformControl;
  labelGroup: TransformControl;
  schematic: TransformControl;
  leftPin: TransformControl;
  rightPin: TransformControl;
  planes: Record<string, PolygonData>;
};

type WireSegment = {
  id: string;
  from: Point;
  to: Point;
  width?: number;
  stroke?: string;
  dash?: string;
  opacity?: number;
};

type SvgTextItem = {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  weight: number;
  rotation: number;
  letterSpacing?: number;
};

type RelayPinItem = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  rotation: number;
  scale: number;
};

type SongleRelaySketchSvgProps = {
  className?: string;
  title?: string;
  initialPowered?: boolean;
  autoStart?: boolean;
  simulationSpeed?: number;
  showControls?: boolean;
  showTimeline?: boolean;
  showCurrentDots?: boolean;
  showDebugTerminals?: boolean;
};

type CurrentDotsProps = {
  path: string;
  active: boolean;
  show: boolean;
  speed: number;
  count?: number;
  radius?: number;
  color?: string;
  opacity?: number;
};

/* =========================
   VIEW_BOX
========================= */
const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1602,
  height: 982,
};

/* =========================
   REQUIRED GLOBAL TUNING CONTROLS
========================= */
const SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const COMPONENT_OFFSET: Point = { x: 0, y: 0 };
const WIRE_OFFSET: Point = { x: 0, y: 0 };
const DEBUG_TERMINAL_OFFSET: Point = { x: 0, y: 0 };

/* =========================
   COLOR / STYLE CONSTANTS
========================= */
const STYLE = {
  black: "#050505",
  white: "#ffffff",
  faceWhite: "url(#faceWhite)",
  sideWhite: "url(#sideWhite)",
  muted: "#6b7280",
  debug: "#ff0055",
  coilActive: "#2563eb",
  contactActive: "#16a34a",
  activeSoft: "#dcfce7",
  warning: "#f59e0b",
};

/* =========================
   BASE_COMPONENT
========================= */
const BASE_COMPONENT = {
  canvas: {
    x: 0,
    y: 0,
    width: 1602,
    height: 982,
    scale: SCALE,
    rotation: 0,
  },

  shadow: {
    cx: 875,
    cy: 940,
    rx: 650,
    ry: 48,
    opacity: 0.12,
  },

  relayGroup: {
    x: COMPONENT_OFFSET.x,
    y: COMPONENT_OFFSET.y,
    width: 1602,
    height: 982,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  schematic: {
    x: 760,
    y: 520,
    width: 420,
    height: 245,
    scale: 1,
    rotation: -14.4,
  },
};

/* =========================
   COMPONENT
   All major parts have x/y/width/height/scale/rotation controls
========================= */
const COMPONENT: ComponentControls = {
  body: {
    x: 0,
    y: 0,
    width: 1042,
    height: 920,
    scale: 1,
    rotation: 0,
  },

  topFace: {
    x: 294,
    y: 3,
    width: 1034,
    height: 545,
    scale: 1,
    rotation: 0,
  },

  frontFace: {
    x: 575,
    y: 354,
    width: 753,
    height: 565,
    scale: 1,
    rotation: 0,
  },

  leftFace: {
    x: 290,
    y: 158,
    width: 286,
    height: 761,
    scale: 1,
    rotation: 0,
  },

  labelGroup: {
    x: 390,
    y: 90,
    width: 760,
    height: 470,
    scale: 1,
    rotation: -14.4,
  },

  schematic: BASE_COMPONENT.schematic,

  leftPin: {
    x: 663,
    y: 884,
    width: 31,
    height: 95,
    scale: 1,
    rotation: 0,
  },

  rightPin: {
    x: 1201,
    y: 769,
    width: 31,
    height: 86,
    scale: 1,
    rotation: 0,
  },

  planes: {
    top: [
      { x: 294, y: 158 },
      { x: 1044, y: 3 },
      { x: 1328, y: 354 },
      { x: 576, y: 548 },
    ],

    front: [
      { x: 576, y: 548 },
      { x: 1328, y: 354 },
      { x: 1326, y: 746 },
      { x: 575, y: 919 },
    ],

    left: [
      { x: 294, y: 158 },
      { x: 576, y: 548 },
      { x: 575, y: 919 },
      { x: 290, y: 586 },
    ],

    topInner: [
      { x: 307, y: 170 },
      { x: 1032, y: 22 },
      { x: 1299, y: 351 },
      { x: 573, y: 531 },
    ],
  },
};

/* =========================
   NODE
   Relay body, pin, and schematic reference points
========================= */
const NODE = {
  topLeft: { x: 294, y: 158 },
  topBack: { x: 1044, y: 3 },
  topRight: { x: 1328, y: 354 },
  topFront: { x: 576, y: 548 },
  frontBottomLeft: { x: 575, y: 919 },
  frontBottomRight: { x: 1326, y: 746 },
  leftBottom: { x: 290, y: 586 },

  pinLeft: { x: 670, y: 890 },
  pinRight: { x: 1208, y: 772 },

  A1: {
    x: BASE_COMPONENT.schematic.x + 30,
    y: BASE_COMPONENT.schematic.y + 38,
  },
  A2: {
    x: BASE_COMPONENT.schematic.x + 30,
    y: BASE_COMPONENT.schematic.y + 160,
  },

  coilTop: {
    x: BASE_COMPONENT.schematic.x + 30,
    y: BASE_COMPONENT.schematic.y + 70,
  },
  coilBottom: {
    x: BASE_COMPONENT.schematic.x + 30,
    y: BASE_COMPONENT.schematic.y + 128,
  },

  COM: {
    x: BASE_COMPONENT.schematic.x + 170,
    y: BASE_COMPONENT.schematic.y + 72,
  },
  COM_POINT: {
    x: BASE_COMPONENT.schematic.x + 195,
    y: BASE_COMPONENT.schematic.y + 130,
  },

  NO: {
    x: BASE_COMPONENT.schematic.x + 310,
    y: BASE_COMPONENT.schematic.y + 92,
  },
  NC: {
    x: BASE_COMPONENT.schematic.x + 310,
    y: BASE_COMPONENT.schematic.y + 168,
  },

  NO_STUB_END: {
    x: BASE_COMPONENT.schematic.x + 354,
    y: BASE_COMPONENT.schematic.y + 92,
  },
  NC_STUB_END: {
    x: BASE_COMPONENT.schematic.x + 354,
    y: BASE_COMPONENT.schematic.y + 168,
  },

  mechLinkStart: {
    x: BASE_COMPONENT.schematic.x + 70,
    y: BASE_COMPONENT.schematic.y + 105,
  },
  mechLinkEnd: {
    x: BASE_COMPONENT.schematic.x + 150,
    y: BASE_COMPONENT.schematic.y + 105,
  },
};

/* =========================
   WIRE
   Structured wire segments
========================= */
const WIRE = {
  stroke: STYLE.black,
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  bodySegments: [
    { id: "top-front-edge", from: NODE.topFront, to: NODE.topRight, width: 5 },
    { id: "top-left-edge", from: NODE.topLeft, to: NODE.topFront, width: 5 },
    { id: "top-back-edge", from: NODE.topLeft, to: NODE.topBack, width: 5 },
    { id: "top-right-edge", from: NODE.topBack, to: NODE.topRight, width: 5 },
    {
      id: "front-right-edge",
      from: NODE.topRight,
      to: NODE.frontBottomRight,
      width: 5,
    },
    {
      id: "front-bottom-edge",
      from: NODE.frontBottomRight,
      to: NODE.frontBottomLeft,
      width: 5,
    },
    {
      id: "front-left-edge",
      from: NODE.topFront,
      to: NODE.frontBottomLeft,
      width: 5,
    },
    { id: "left-back-edge", from: NODE.topLeft, to: NODE.leftBottom, width: 5 },
    {
      id: "left-bottom-edge",
      from: NODE.leftBottom,
      to: NODE.frontBottomLeft,
      width: 5,
    },
  ] satisfies WireSegment[],

  schematic: {
    coilA1ToCoil: {
      id: "a1-to-coil",
      from: NODE.A1,
      to: NODE.coilTop,
      width: 3,
    },

    coilToA2: {
      id: "coil-to-a2",
      from: NODE.coilBottom,
      to: NODE.A2,
      width: 3,
    },

    mechanicalLink: {
      id: "mechanical-link",
      from: NODE.mechLinkStart,
      to: NODE.mechLinkEnd,
      width: 3,
      dash: "9 8",
    },

    comDown: {
      id: "com-down",
      from: NODE.COM,
      to: { x: NODE.COM.x, y: NODE.COM_POINT.y - 28 },
      width: 3,
    },

    comToPoint: {
      id: "com-to-point",
      from: { x: NODE.COM.x, y: NODE.COM_POINT.y - 28 },
      to: NODE.COM_POINT,
      width: 3,
    },

    noStub: {
      id: "no-stub",
      from: NODE.NO,
      to: NODE.NO_STUB_END,
      width: 3,
    },

    ncStub: {
      id: "nc-stub",
      from: NODE.NC,
      to: NODE.NC_STUB_END,
      width: 3,
    },
  } satisfies Record<string, WireSegment>,
};

/* =========================
   PATH
   Logo paths and current flow paths
========================= */
const PATH = {
  songleLogoBars: [
    "M420 153 L582 121 L574 149 L424 179 Z",
    "M414 195 L574 163 L565 191 L416 220 Z",
    "M407 237 L563 205 L553 233 L410 260 Z",
  ],

  cqcOuter:
    "M456 258 C518 246 590 270 607 314 C625 361 573 397 499 391 C425 385 380 344 403 302 C413 282 431 266 456 258 Z",

  cqcInner:
    "M475 303 C508 294 556 306 565 329 C574 353 540 367 499 361 C456 355 434 333 448 315 C454 309 463 305 475 303 Z",

  warningOuter: "M690 224 L782 302 L661 323 Z",
  warningInner: "M704 247 L756 292 L686 305 Z",

  ulMark:
    "M873 164 L935 150 L988 207 L946 219 L919 191 L901 195 L928 225 L889 233 L836 178 Z",

  topCircle:
    "M991 39 C1030 26 1074 34 1094 58 C1116 85 1100 114 1061 124 C1021 134 979 123 961 98 C943 73 954 51 991 39 Z",

  coilCurrent: `M ${NODE.A1.x} ${NODE.A1.y} L ${NODE.coilTop.x} ${NODE.coilTop.y} L ${NODE.coilBottom.x} ${NODE.coilBottom.y} L ${NODE.A2.x} ${NODE.A2.y}`,

  offContactCurrent: `M ${NODE.COM.x} ${NODE.COM.y} L ${NODE.COM.x} ${NODE.COM_POINT.y - 28} L ${NODE.COM_POINT.x} ${NODE.COM_POINT.y} L ${NODE.NC.x} ${NODE.NC.y} L ${NODE.NC_STUB_END.x} ${NODE.NC_STUB_END.y}`,

  onContactCurrent: `M ${NODE.COM.x} ${NODE.COM.y} L ${NODE.COM.x} ${NODE.COM_POINT.y - 28} L ${NODE.COM_POINT.x} ${NODE.COM_POINT.y} L ${NODE.NO.x} ${NODE.NO.y} L ${NODE.NO_STUB_END.x} ${NODE.NO_STUB_END.y}`,
};

/* =========================
   LABEL
========================= */
const LABEL = {
  color: "#000000",
  rotation: -14.4,
  scale: 1,

  items: [
    {
      id: "songle",
      text: "SONGLE",
      x: 620,
      y: 155,
      size: 58,
      weight: 800,
      rotation: -14.4,
      letterSpacing: 1,
    },
    {
      id: "registered",
      text: "®",
      x: 585,
      y: 206,
      size: 38,
      weight: 700,
      rotation: -14.4,
    },
    {
      id: "nine",
      text: "9",
      x: 1084,
      y: 154,
      size: 62,
      weight: 800,
      rotation: -14.4,
    },
    {
      id: "us",
      text: "US",
      x: 1105,
      y: 209,
      size: 43,
      weight: 800,
      rotation: -14.4,
    },
    {
      id: "c",
      text: "C",
      x: 862,
      y: 274,
      size: 52,
      weight: 800,
      rotation: -14.4,
    },
    {
      id: "cqc-text",
      text: "CQC",
      x: 465,
      y: 338,
      size: 49,
      weight: 800,
      rotation: -14.4,
    },
    {
      id: "left-rating-1",
      text: "10A 250VAC",
      x: 520,
      y: 420,
      size: 46,
      weight: 800,
      rotation: -14.4,
    },
    {
      id: "left-rating-2",
      text: "10A 30VDC",
      x: 536,
      y: 470,
      size: 46,
      weight: 800,
      rotation: -14.4,
    },
    {
      id: "right-rating-1",
      text: "10A 125VAC",
      x: 890,
      y: 326,
      size: 47,
      weight: 800,
      rotation: -14.4,
    },
    {
      id: "right-rating-2",
      text: "10A 28VDC",
      x: 906,
      y: 379,
      size: 47,
      weight: 800,
      rotation: -14.4,
    },
    {
      id: "model",
      text: "SRD-12VDC-SL-C",
      x: 600,
      y: 515,
      size: 70,
      weight: 800,
      rotation: -14.4,
      letterSpacing: 1,
    },
  ] satisfies SvgTextItem[],

  terminal: {
    A1: { text: "A1", x: NODE.A1.x - 32, y: NODE.A1.y - 8 },
    A2: { text: "A2", x: NODE.A2.x - 36, y: NODE.A2.y + 34 },

    COM: { text: "COM", x: NODE.COM.x - 40, y: NODE.COM.y - 16 },
    NO: { text: "NO", x: NODE.NO_STUB_END.x + 10, y: NODE.NO_STUB_END.y + 8 },
    NC: { text: "NC", x: NODE.NC_STUB_END.x + 10, y: NODE.NC_STUB_END.y + 8 },

    COM_NUMBER: { text: "11", x: NODE.COM.x - 8, y: NODE.COM.y - 28 },
    NO_NUMBER: {
      text: "14",
      x: NODE.NO_STUB_END.x + 10,
      y: NODE.NO_STUB_END.y + 34,
    },
    NC_NUMBER: {
      text: "12",
      x: NODE.NC_STUB_END.x + 10,
      y: NODE.NC_STUB_END.y + 34,
    },
  },
};

/* =========================
   PIN
========================= */
const PIN = {
  items: [
    {
      id: "left-pin",
      x: COMPONENT.leftPin.x,
      y: COMPONENT.leftPin.y,
      w: COMPONENT.leftPin.width,
      h: COMPONENT.leftPin.height,
      rx: 15,
      rotation: COMPONENT.leftPin.rotation,
      scale: COMPONENT.leftPin.scale,
    },
    {
      id: "right-pin",
      x: COMPONENT.rightPin.x,
      y: COMPONENT.rightPin.y,
      w: COMPONENT.rightPin.width,
      h: COMPONENT.rightPin.height,
      rx: 15,
      rotation: COMPONENT.rightPin.rotation,
      scale: COMPONENT.rightPin.scale,
    },
  ] satisfies RelayPinItem[],
};

/* =========================
   TIMELINE
========================= */
const TIMELINE_STEPS = [
  "Power condition selected",
  "Coil state updated",
  "Armature contact moves",
  "COM changes contact path",
  "Relay output state confirmed",
];

/* =========================
   HELPER FUNCTIONS
========================= */
function toPoints(points: PolygonData) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

function applyOffset(point: Point, offset: Point): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

/* =========================
   REUSABLE SVG BLOCK: POLYGON
========================= */
function PolygonShape({
  points,
  fill,
  stroke = "#000",
  strokeWidth = 5,
}: {
  points: PolygonData;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <polygon
      points={toPoints(points)}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  );
}

/* =========================
   REUSABLE SVG BLOCK: WIRE LINE
========================= */
function WireLine({
  segment,
  stroke = WIRE.stroke,
  strokeWidth,
}: {
  segment: WireSegment;
  stroke?: string;
  strokeWidth?: number;
}) {
  const from = applyOffset(segment.from, WIRE_OFFSET);
  const to = applyOffset(segment.to, WIRE_OFFSET);

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={stroke}
      strokeWidth={strokeWidth ?? segment.width ?? WIRE.width}
      strokeDasharray={segment.dash}
      strokeLinecap="round"
      opacity={segment.opacity ?? 1}
    />
  );
}

/* =========================
   REUSABLE SVG BLOCK: TERMINAL
========================= */
function TerminalDot({
  point,
  stroke,
  strokeWidth = 3,
  fill = "#ffffff",
  radius = 8,
}: {
  point: Point;
  stroke: string;
  strokeWidth?: number;
  fill?: string;
  radius?: number;
}) {
  return (
    <circle
      cx={point.x}
      cy={point.y}
      r={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

/* =========================
   REUSABLE SVG BLOCK: LABEL TEXT
========================= */
function LabelText({ item }: { item: SvgTextItem }) {
  return (
    <text
      x={item.x}
      y={item.y}
      fill={LABEL.color}
      fontSize={item.size}
      fontWeight={item.weight}
      fontFamily="Arial, Helvetica, sans-serif"
      letterSpacing={item.letterSpacing ?? 0}
      transform={`rotate(${item.rotation} ${item.x} ${item.y}) scale(${LABEL.scale})`}
    >
      {item.text}
    </text>
  );
}

/* =========================
   REUSABLE SVG BLOCK: RELAY PIN
========================= */
function RelayPin({ item }: { item: RelayPinItem }) {
  return (
    <g
      transform={`rotate(${item.rotation} ${item.x} ${item.y}) scale(${item.scale})`}
    >
      <rect
        x={item.x}
        y={item.y}
        width={item.w}
        height={item.h}
        rx={item.rx}
        fill="#ffffff"
        stroke="#000"
        strokeWidth={5}
      />

      <line
        x1={item.x + item.w * 0.5}
        y1={item.y}
        x2={item.x + item.w * 0.5}
        y2={item.y + item.h - 10}
        stroke="#000"
        strokeWidth={3}
        opacity={0.35}
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG BLOCK: CERTIFICATION SYMBOLS
========================= */
function CertificationSymbols() {
  return (
    <g>
      {PATH.songleLogoBars.map((d) => (
        <path key={d} d={d} fill="#000" />
      ))}

      <path d={PATH.cqcOuter} fill="none" stroke="#000" strokeWidth={6} />
      <path
        d={PATH.warningOuter}
        fill="none"
        stroke="#000"
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <path
        d={PATH.warningInner}
        fill="none"
        stroke="#000"
        strokeWidth={5}
        strokeLinejoin="round"
      />

      <path d={PATH.ulMark} fill="#000" />
      <path d={PATH.topCircle} fill="none" stroke="#000" strokeWidth={5} />
    </g>
  );
}

/* =========================
   REUSABLE SVG BLOCK: CURRENT DOT FLOW
========================= */
function CurrentDots({
  path,
  active,
  show,
  speed,
  count = 5,
  radius = 5,
  color = STYLE.contactActive,
  opacity = 0.95,
}: CurrentDotsProps) {
  if (!active || !show) return null;

  const safeSpeed = Math.max(0.3, speed);
  const duration = Math.max(0.7, 3 / safeSpeed);

  return (
    <g pointerEvents="none">
      {Array.from({ length: count }).map((_, index) => (
        <circle
          key={`${path}-${index}`}
          r={radius}
          fill={color}
          opacity={opacity}
        >
          <animateMotion
            dur={`${duration}s`}
            repeatCount="indefinite"
            begin={`${(-duration / count) * index}s`}
            path={path}
          />
        </circle>
      ))}
    </g>
  );
}

/* =========================
   REUSABLE SVG BLOCK: RELAY BODY
========================= */
function RelayBody() {
  return (
    <>
      <ellipse
        cx={BASE_COMPONENT.shadow.cx}
        cy={BASE_COMPONENT.shadow.cy}
        rx={BASE_COMPONENT.shadow.rx}
        ry={BASE_COMPONENT.shadow.ry}
        fill="#000"
        opacity={BASE_COMPONENT.shadow.opacity}
        filter="url(#softShadow)"
      />

      {PIN.items.map((item) => (
        <RelayPin key={item.id} item={item} />
      ))}

      <PolygonShape points={COMPONENT.planes.left} fill="url(#sideWhite)" />
      <PolygonShape points={COMPONENT.planes.front} fill="url(#faceWhite)" />
      <PolygonShape points={COMPONENT.planes.top} fill="#ffffff" />
      <PolygonShape
        points={COMPONENT.planes.topInner}
        fill="none"
        stroke="#000"
        strokeWidth={4}
      />

      {WIRE.bodySegments.map((segment) => (
        <WireLine key={segment.id} segment={segment} />
      ))}

      <CertificationSymbols />

      {LABEL.items.map((item) => (
        <LabelText key={item.id} item={item} />
      ))}
    </>
  );
}

/* =========================
   REUSABLE SVG BLOCK: COM / NO / NC / A1 / A2 SCHEMATIC
========================= */
function RelayContactSchematic({
  energized,
  speed,
  showCurrentDots,
}: {
  energized: boolean;
  speed: number;
  showCurrentDots: boolean;
}) {
  const coilStroke = energized ? STYLE.coilActive : STYLE.black;
  const activeContactStroke = STYLE.contactActive;
  const noStroke = energized ? STYLE.contactActive : STYLE.black;
  const ncStroke = energized ? STYLE.muted : STYLE.contactActive;
  const movingEnd = energized ? NODE.NO : NODE.NC;
  const activeContactPath = energized
    ? PATH.onContactCurrent
    : PATH.offContactCurrent;

  return (
    <g
      transform={`rotate(${BASE_COMPONENT.schematic.rotation} ${
        BASE_COMPONENT.schematic.x + BASE_COMPONENT.schematic.width / 2
      } ${BASE_COMPONENT.schematic.y + BASE_COMPONENT.schematic.height / 2})`}
    >
      {/* A1 / A2 coil terminals */}
      <text
        x={LABEL.terminal.A1.x}
        y={LABEL.terminal.A1.y}
        fill={coilStroke}
        fontSize={24}
        fontWeight={800}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {LABEL.terminal.A1.text}
      </text>

      <TerminalDot
        point={NODE.A1}
        stroke={coilStroke}
        strokeWidth={energized ? 5 : 3}
        radius={8}
      />

      <WireLine
        segment={WIRE.schematic.coilA1ToCoil}
        stroke={coilStroke}
        strokeWidth={energized ? 5 : 3}
      />

      <rect
        x={NODE.coilTop.x - 14}
        y={NODE.coilTop.y}
        width={28}
        height={58}
        rx={4}
        fill={energized ? "#dbeafe" : "#ffffff"}
        stroke={coilStroke}
        strokeWidth={energized ? 5 : 3}
      />

      <WireLine
        segment={WIRE.schematic.coilToA2}
        stroke={coilStroke}
        strokeWidth={energized ? 5 : 3}
      />

      <TerminalDot
        point={NODE.A2}
        stroke={coilStroke}
        strokeWidth={energized ? 5 : 3}
        radius={8}
      />

      <text
        x={LABEL.terminal.A2.x}
        y={LABEL.terminal.A2.y}
        fill={coilStroke}
        fontSize={24}
        fontWeight={800}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {LABEL.terminal.A2.text}
      </text>

      {/* Mechanical link from coil to contact */}
      <WireLine
        segment={WIRE.schematic.mechanicalLink}
        stroke={energized ? STYLE.warning : STYLE.black}
        strokeWidth={energized ? 5 : 3}
      />

      {/* COM terminal */}
      <text
        x={LABEL.terminal.COM.x}
        y={LABEL.terminal.COM.y}
        fill={activeContactStroke}
        fontSize={22}
        fontWeight={900}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {LABEL.terminal.COM.text}
      </text>

      <text
        x={LABEL.terminal.COM_NUMBER.x}
        y={LABEL.terminal.COM_NUMBER.y}
        fill={activeContactStroke}
        fontSize={22}
        fontWeight={900}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {LABEL.terminal.COM_NUMBER.text}
      </text>

      <TerminalDot
        point={NODE.COM}
        stroke={activeContactStroke}
        strokeWidth={5}
        radius={8}
      />

      <WireLine
        segment={WIRE.schematic.comDown}
        stroke={activeContactStroke}
        strokeWidth={5}
      />

      <WireLine
        segment={WIRE.schematic.comToPoint}
        stroke={activeContactStroke}
        strokeWidth={5}
      />

      <TerminalDot
        point={NODE.COM_POINT}
        stroke={activeContactStroke}
        strokeWidth={5}
        radius={8}
      />

      {/* Moving contact arm */}
      <line
        x1={NODE.COM_POINT.x}
        y1={NODE.COM_POINT.y}
        x2={movingEnd.x}
        y2={movingEnd.y}
        stroke={activeContactStroke}
        strokeWidth={5}
        strokeLinecap="round"
        style={{ transition: "all 450ms ease-in-out" }}
      />

      {/* NO terminal */}
      <TerminalDot
        point={NODE.NO}
        stroke={noStroke}
        strokeWidth={energized ? 5 : 3}
        radius={8}
      />

      <WireLine
        segment={WIRE.schematic.noStub}
        stroke={noStroke}
        strokeWidth={energized ? 5 : 3}
      />

      <text
        x={LABEL.terminal.NO.x}
        y={LABEL.terminal.NO.y}
        fill={noStroke}
        fontSize={22}
        fontWeight={900}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {LABEL.terminal.NO.text}
      </text>

      <text
        x={LABEL.terminal.NO_NUMBER.x}
        y={LABEL.terminal.NO_NUMBER.y}
        fill={noStroke}
        fontSize={18}
        fontWeight={900}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {LABEL.terminal.NO_NUMBER.text}
      </text>

      {/* NC terminal */}
      <TerminalDot
        point={NODE.NC}
        stroke={ncStroke}
        strokeWidth={!energized ? 5 : 3}
        radius={8}
      />

      <WireLine
        segment={WIRE.schematic.ncStub}
        stroke={ncStroke}
        strokeWidth={!energized ? 5 : 3}
      />

      <text
        x={LABEL.terminal.NC.x}
        y={LABEL.terminal.NC.y}
        fill={ncStroke}
        fontSize={22}
        fontWeight={900}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {LABEL.terminal.NC.text}
      </text>

      <text
        x={LABEL.terminal.NC_NUMBER.x}
        y={LABEL.terminal.NC_NUMBER.y}
        fill={ncStroke}
        fontSize={18}
        fontWeight={900}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {LABEL.terminal.NC_NUMBER.text}
      </text>

      {/* Current dots */}
      <CurrentDots
        path={PATH.coilCurrent}
        active={energized}
        show={showCurrentDots}
        speed={speed}
        count={4}
        radius={4.5}
        color={STYLE.coilActive}
      />

      <CurrentDots
        path={activeContactPath}
        active={showCurrentDots}
        show={showCurrentDots}
        speed={speed}
        count={5}
        radius={4.8}
        color={STYLE.contactActive}
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG BLOCK: DEBUG LAYER
========================= */
function DebugLayer({ show }: { show: boolean }) {
  if (!show) return null;

  const debugNodes = {
    A1: NODE.A1,
    A2: NODE.A2,
    COM: NODE.COM,
    COM_POINT: NODE.COM_POINT,
    NO: NODE.NO,
    NC: NODE.NC,
  };

  return (
    <g pointerEvents="none">
      {Object.values(COMPONENT.planes).map((polygon, index) => {
        if (!Array.isArray(polygon)) return null;

        return (
          <polygon
            key={index}
            points={toPoints(polygon)}
            fill="none"
            stroke="#ff00aa"
            strokeWidth={2}
            strokeDasharray="10 8"
          />
        );
      })}

      {Object.entries(debugNodes).map(([key, point]) => (
        <g key={key}>
          <circle
            cx={point.x + DEBUG_TERMINAL_OFFSET.x}
            cy={point.y + DEBUG_TERMINAL_OFFSET.y}
            r={8}
            fill={STYLE.debug}
            stroke="#000"
            strokeWidth={2}
          />

          <text
            x={point.x + DEBUG_TERMINAL_OFFSET.x + 12}
            y={point.y + DEBUG_TERMINAL_OFFSET.y - 10}
            fontSize={18}
            fill={STYLE.debug}
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight={800}
          >
            {key}
          </text>
        </g>
      ))}
    </g>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function SongleRelaySketchSvg({
  className = "",
  title = "Interactive Songle relay sketch with COM, NO, NC, A1, A2 control panel",
  initialPowered = false,
  autoStart = false,
  simulationSpeed = 1,
  showControls = true,
  showTimeline = true,
  showCurrentDots: showCurrentDotsProp = true,
  showDebugTerminals = false,
}: SongleRelaySketchSvgProps) {
  const [isPowered, setIsPowered] = useState(initialPowered);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [simulationStep, setSimulationStep] = useState(initialPowered ? 1 : 0);
  const [timelineProgress, setTimelineProgress] = useState(
    initialPowered ? 20 : 0,
  );
  const [speed, setSpeed] = useState(simulationSpeed);
  const [showCurrentDots, setShowCurrentDots] = useState(showCurrentDotsProp);

  useEffect(() => {
    setIsPowered(initialPowered);
    setIsRunning(initialPowered ? autoStart : false);
    setSimulationStep(initialPowered ? 1 : 0);
    setTimelineProgress(initialPowered ? 20 : 0);
  }, [initialPowered, autoStart]);

  useEffect(() => {
    setSpeed(simulationSpeed);
  }, [simulationSpeed]);

  useEffect(() => {
    setShowCurrentDots(showCurrentDotsProp);
  }, [showCurrentDotsProp]);

  const energized = isPowered;

  const activeStepText =
    simulationStep > 0
      ? TIMELINE_STEPS[simulationStep - 1]
      : "Power OFF condition selected";

  const status = useMemo(() => {
    if (energized) {
      return {
        title: "POWER ON CONDITION",
        coil: "A1/A2 coil energized",
        path: "COM → NO",
        closed: "COM 11 connected to NO 14",
        open: "NC 12 open",
        badge: "POWER ON",
      };
    }

    return {
      title: "POWER OFF CONDITION",
      coil: "A1/A2 coil de-energized",
      path: "COM → NC",
      closed: "COM 11 connected to NC 12",
      open: "NO 14 open",
      badge: "POWER OFF",
    };
  }, [energized]);

  const setPowerCondition = (powered: boolean) => {
    setIsPowered(powered);

    if (powered) {
      setSimulationStep(1);
      setTimelineProgress(20);
      return;
    }

    setIsRunning(false);
    setSimulationStep(0);
    setTimelineProgress(0);
  };

  const resetSimulation = () => {
    setIsPowered(initialPowered);
    setIsRunning(autoStart);
    setSimulationStep(initialPowered ? 1 : 0);
    setTimelineProgress(initialPowered ? 20 : 0);
    setSpeed(simulationSpeed);
    setShowCurrentDots(showCurrentDotsProp);
  };

  useEffect(() => {
    if (!isRunning || !isPowered) {
      if (!isPowered) {
        setSimulationStep(0);
        setTimelineProgress(0);
      }

      return;
    }

    const safeSpeed = Math.max(0.25, speed);
    const intervalMs = Math.max(450, 1100 / safeSpeed);

    const timer = window.setInterval(() => {
      setSimulationStep((previousStep) => {
        const nextStep =
          previousStep >= TIMELINE_STEPS.length ? 1 : previousStep + 1;
        setTimelineProgress((nextStep / TIMELINE_STEPS.length) * 100);
        return nextStep;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isRunning, isPowered, speed]);

  return (
    <div className={`w-full ${className}`}>
      {/* =========================
          SVG RELAY DRAWING
      ========================= */}
      <div className="flex w-full items-center justify-center bg-white">
        <svg
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          width="100%"
          height="100%"
          role="img"
          aria-label={title}
          style={{
            display: "block",
            transform: `scale(${SCALE * CIRCUIT_CANVAS_SCALE})`,
            transformOrigin: "center",
          }}
        >
          <title>{title}</title>

          {/* =========================
              SVG DEFS
          ========================= */}
          <defs>
            <linearGradient id="faceWhite" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f6f6f6" />
            </linearGradient>

            <linearGradient id="sideWhite" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ededed" />
            </linearGradient>

            <filter
              id="softShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          <g
            transform={`translate(${BASE_COMPONENT.relayGroup.x} ${BASE_COMPONENT.relayGroup.y}) scale(${BASE_COMPONENT.relayGroup.scale}) rotate(${BASE_COMPONENT.relayGroup.rotation})`}
          >
            <RelayBody />

            <RelayContactSchematic
              energized={energized}
              speed={speed}
              showCurrentDots={showCurrentDots}
            />

            <DebugLayer show={showDebugTerminals} />
          </g>
        </svg>
      </div>

      {/* =========================
          TIMELINE
      ========================= */}
      {showTimeline && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-neutral-900">
              {activeStepText}
            </p>

            <p className="text-xs font-medium text-neutral-500">
              Step {simulationStep || 0} / {TIMELINE_STEPS.length}
            </p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${timelineProgress}%` }}
            />
          </div>

          <div className="mt-3 grid gap-2 text-xs text-neutral-600 sm:grid-cols-5">
            {TIMELINE_STEPS.map((step, index) => {
              const active = simulationStep === index + 1;
              const completed = simulationStep > index + 1;

              return (
                <div
                  key={step}
                  className={[
                    "rounded-lg border px-2 py-2 text-center transition",
                    active
                      ? "border-amber-400 bg-amber-50 font-bold text-amber-700"
                      : completed
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-neutral-200 bg-neutral-50",
                  ].join(" ")}
                >
                  {step}
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-sm font-medium text-neutral-800">
            {status.closed}, {status.open}
          </p>
        </div>
      )}

      {/* =========================
          CONTROL PANEL
      ========================= */}
      {showControls && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
          <div
            className={[
              "mb-4 rounded-xl border p-4 transition",
              energized
                ? "border-green-300 bg-green-50"
                : "border-neutral-300 bg-white",
            ].join(" ")}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className={[
                    "text-xs font-black uppercase tracking-wide",
                    energized ? "text-green-700" : "text-neutral-500",
                  ].join(" ")}
                >
                  {status.title}
                </p>

                <h3 className="mt-1 text-lg font-black text-neutral-900">
                  {status.path}
                </h3>

                <p className="mt-1 text-sm font-semibold text-neutral-700">
                  {status.coil} · {status.closed} · {status.open}
                </p>
              </div>

              <span
                className={[
                  "inline-flex rounded-full px-4 py-2 text-sm font-black text-white",
                  energized ? "bg-green-600" : "bg-neutral-800",
                ].join(" ")}
              >
                {status.badge}
              </span>
            </div>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPowerCondition(false)}
              className={[
                "rounded-xl border p-3 text-left transition",
                !energized
                  ? "border-green-400 bg-green-50 ring-2 ring-green-100"
                  : "border-neutral-200 bg-white opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              <p className="text-sm font-black text-neutral-900">
                Power OFF Condition
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-700">
                A1/A2 coil OFF
              </p>
              <p className="mt-2 text-sm font-black text-green-700">
                COM 11 → NC 12 CLOSED
              </p>
              <p className="text-xs font-semibold text-neutral-500">
                NO 14 OPEN
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPowerCondition(true)}
              className={[
                "rounded-xl border p-3 text-left transition",
                energized
                  ? "border-green-400 bg-green-50 ring-2 ring-green-100"
                  : "border-neutral-200 bg-white opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              <p className="text-sm font-black text-neutral-900">
                Power ON Condition
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-700">
                A1/A2 coil ON
              </p>
              <p className="mt-2 text-sm font-black text-green-700">
                COM 11 → NO 14 CLOSED
              </p>
              <p className="text-xs font-semibold text-neutral-500">
                NC 12 OPEN
              </p>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPowerCondition(!isPowered)}
              className={[
                "rounded-lg px-4 py-2 text-sm font-black text-white transition",
                isPowered
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700",
              ].join(" ")}
            >
              {isPowered ? "Turn Power OFF" : "Turn Power ON"}
            </button>

            <button
              type="button"
              onClick={() => setIsRunning((value) => !value)}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-black text-white transition hover:bg-neutral-700"
            >
              {isRunning ? "Stop Simulation" : "Start Simulation"}
            </button>

            <button
              type="button"
              onClick={resetSimulation}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-black text-neutral-800 transition hover:bg-neutral-100"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => setShowCurrentDots((value) => !value)}
              className={[
                "rounded-lg border px-4 py-2 text-sm font-black transition",
                showCurrentDots
                  ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100",
              ].join(" ")}
            >
              {showCurrentDots ? "Hide Current Dots" : "Show Current Dots"}
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <label
              className="text-sm font-black text-neutral-800"
              htmlFor="relay-speed"
            >
              Speed
            </label>

            <input
              id="relay-speed"
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="w-full accent-amber-500 sm:max-w-xs"
            />

            <span className="text-sm font-bold text-neutral-600">
              {speed.toFixed(1)}x
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
