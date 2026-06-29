"use client";

import React from "react";

type Point = { x: number; y: number };
type Size = { width: number; height: number };
type ViewBox = { minX: number; minY: number; width: number; height: number };

type TuneTransform = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  scale: number;
  rotation: number;
};

type RectPart = TuneTransform & {
  rx?: number;
  ry?: number;
};

type TerminalKey = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

type SvgIds = ReturnType<typeof createSvgIds>;

export type SSR40DAProps = {
  className?: string;
  width?: number | string;
  height?: number | string;

  componentScale?: number;
  canvasScale?: number;
  wireScale?: number;

  componentOffset?: Partial<Point>;
  wireOffset?: Partial<Point>;
  debugTerminalOffset?: Partial<Point>;

  showDebugTerminals?: boolean;
};

/* =========================================================
   REQUIRED GLOBAL TUNING CONTROLS
========================================================= */

export const CIRCUIT_COMPONENT_SCALE = 1;
export const BASE_WIRE_WIDTH = 5;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const COMPONENT_OFFSET: Point = { x: 0, y: 0 };
export const WIRE_OFFSET: Point = { x: 0, y: 0 };
export const DEBUG_TERMINAL_OFFSET: Point = { x: 0, y: 0 };

export const SHOW_DEBUG_TERMINAL_DOTS = false;

/* =========================================================
   REQUIRED SECTIONS
========================================================= */

export const VIEW_BOX: ViewBox = {
  minX: 0,
  minY: 0,
  width: 720,
  height: 920,
};

export const SCALE = {
  canvas: CIRCUIT_CANVAS_SCALE,
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  baseWireWidth: BASE_WIRE_WIDTH,
  componentOffset: COMPONENT_OFFSET,
  wireOffset: WIRE_OFFSET,
  debugTerminalOffset: DEBUG_TERMINAL_OFFSET,
};

export const BASE_COMPONENT = {
  root: {
    x: 0,
    y: 0,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  bodySide: {
    x: 642,
    y: 50,
    width: 36,
    height: 830,
    topSkew: 22,
    bottomSkew: 30,
    scale: 1,
    rotation: 0,
  },

  bodyFront: {
    x: 70,
    y: 42,
    width: 572,
    height: 838,
    rx: 18,
    scale: 1,
    rotation: 0,
  },

  frontHighlight: {
    x: 88,
    y: 60,
    width: 542,
    height: 802,
    scale: 1,
    rotation: 0,
  },

  topMount: {
    x: 302,
    y: 40,
    width: 116,
    height: 150,
    neckHeight: 98,
    hole: { x: 360, y: 95, radius: 30 },
    scale: 1,
    rotation: 0,
  },

  bottomMount: {
    x: 302,
    y: 730,
    width: 116,
    height: 152,
    sideDrop: 52,
    hole: { x: 360, y: 836, radius: 30 },
    scale: 1,
    rotation: 0,
  },

  terminalPocket: {
    width: 160,
    height: 160,
    rx: 13,
    innerInset: 18,
    innerRx: 8,
    scale: 1,
    rotation: 0,
    screw: {
      centerOffset: { x: 80, y: 80 },
      terminalPlateSize: 106,
      screwOuterRadius: 45,
      screwInnerRadius: 38,
      slotArmLength: 28,
      slotArmWidth: 16,
      slotRound: 8,
      scale: 1,
      rotation: 0,
    },
    positions: {
      topLeft: { x: 95, y: 62, scale: 1, rotation: 0 },
      topRight: { x: 465, y: 62, scale: 1, rotation: 0 },
      bottomLeft: { x: 95, y: 720, scale: 1, rotation: 0 },
      bottomRight: { x: 465, y: 720, scale: 1, rotation: 0 },
    } satisfies Record<TerminalKey, Omit<TuneTransform, "width" | "height">>,
  },

  labelPanel: {
    x: 106,
    y: 230,
    width: 508,
    height: 548,
    corner: 12,
    bottomShelfY: 705,
    bottomStepY: 778,
    leftShelfEndX: 250,
    rightShelfStartX: 470,
    leftStepX: 270,
    rightStepX: 450,
    scale: 1,
    rotation: 0,
  },

  topGroove: {
    outerLeftX: 218,
    outerRightX: 502,
    innerLeftX: 302,
    innerRightX: 418,
    topY: 42,
    lowerY: 177,
    bottomY: 245,
    centerX: 360,
    cupBottomY: 205,
    scale: 1,
    rotation: 0,
  },

  topGrooveStroke: {
    leftX: 302,
    rightX: 418,
    topY: 50,
    neckBottomY: 125,
    cupBottomY: 205,
    centerX: 360,
    scale: 1,
    rotation: 0,
  },

  bottomGroove: {
    centerX: 360,
    darkY: 775,
    darkControlY: 690,
    darkLeftX: 255,
    darkRightX: 465,
    lightLeftX: 286,
    lightRightX: 434,
    lightControlY: 720,
    scale: 1,
    rotation: 0,
  },

  led: {
    x: 562,
    y: 628,
    outerRadius: 32,
    innerRadius: 23,
    highlight: { x: 552, y: 616, radius: 8 },
    scale: 1,
    rotation: 0,
  },

  baseShadow: {
    x1: 103,
    y1: 870,
    cx: 360,
    cy: 900,
    x2: 617,
    y2: 870,
    scale: 1,
    rotation: 0,
  },
};

export const COMPONENT = {
  ...BASE_COMPONENT,
  root: {
    ...BASE_COMPONENT.root,
    x: COMPONENT_OFFSET.x,
    y: COMPONENT_OFFSET.y,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },
};

export const NODE = {
  terminalCenters: {
    topLeft: { x: 175, y: 142 },
    topRight: { x: 545, y: 142 },
    bottomLeft: { x: 175, y: 800 },
    bottomRight: { x: 545, y: 800 },
  } satisfies Record<TerminalKey, Point>,

  terminalWireReference: {
    output1: { x: 168, y: 350 },
    output2: { x: 552, y: 350 },
    input3: { x: 168, y: 752 },
    input4: { x: 552, y: 752 },
  },

  mountHoles: {
    top: BASE_COMPONENT.topMount.hole,
    bottom: BASE_COMPONENT.bottomMount.hole,
  },

  led: {
    center: { x: BASE_COMPONENT.led.x, y: BASE_COMPONENT.led.y },
  },

  debug: {
    radius: 5,
    strokeWidth: 2,
  },
};

export const WIRE = {
  stroke: {
    color: "#f2f2f2",
    width: BASE_WIRE_WIDTH,
    lineCap: "square" as const,
    lineJoin: "miter" as const,
  },

  segments: {
    outputLeftBracket: [
      { from: { x: 142, y: 320 }, to: { x: 142, y: 350 } },
      { from: { x: 142, y: 350 }, to: { x: 285, y: 350 } },
    ],

    outputRightBracket: [
      { from: { x: 578, y: 320 }, to: { x: 578, y: 350 } },
      { from: { x: 578, y: 350 }, to: { x: 435, y: 350 } },
    ],

    modelTopDivider: [{ from: { x: 180, y: 438 }, to: { x: 540, y: 438 } }],

    modelBottomDivider: [{ from: { x: 180, y: 606 }, to: { x: 540, y: 606 } }],

    inputLeftBracket: [
      { from: { x: 245, y: 708 }, to: { x: 245, y: 680 } },
      { from: { x: 245, y: 680 }, to: { x: 302, y: 680 } },
    ],

    inputRightBracket: [
      { from: { x: 475, y: 708 }, to: { x: 475, y: 680 } },
      { from: { x: 475, y: 680 }, to: { x: 418, y: 680 } },
    ],
  },
};

export const PATH = {
  bodySide: (c = BASE_COMPONENT.bodySide) => `
    M ${c.x} ${c.y}
    L ${c.x + c.width} ${c.y + c.topSkew}
    L ${c.x + c.width} ${c.y + c.height - c.bottomSkew}
    L ${c.x} ${c.y + c.height}
    Z
  `,

  topMount: (c = BASE_COMPONENT.topMount) => {
    const centerX = c.x + c.width / 2;
    return `
      M ${c.x} ${c.y}
      L ${c.x + c.width} ${c.y}
      L ${c.x + c.width} ${c.y + c.neckHeight}
      Q ${c.x + c.width} ${c.y + c.height} ${centerX} ${c.y + c.height}
      Q ${c.x} ${c.y + c.height} ${c.x} ${c.y + c.neckHeight}
      Z
    `;
  },

  bottomMount: (c = BASE_COMPONENT.bottomMount) => {
    const centerX = c.x + c.width / 2;
    return `
      M ${c.x} ${c.y + c.sideDrop}
      Q ${c.x} ${c.y} ${centerX} ${c.y}
      Q ${c.x + c.width} ${c.y} ${c.x + c.width} ${c.y + c.sideDrop}
      L ${c.x + c.width} ${c.y + c.height}
      L ${c.x} ${c.y + c.height}
      Z
    `;
  },

  labelPanel: (c = BASE_COMPONENT.labelPanel) => `
    M ${c.x + c.corner} ${c.y}
    L ${c.x + c.width - c.corner} ${c.y}
    Q ${c.x + c.width} ${c.y} ${c.x + c.width} ${c.y + c.corner}
    L ${c.x + c.width} ${c.bottomShelfY - c.corner}
    Q ${c.x + c.width} ${c.bottomShelfY} ${c.x + c.width - c.corner} ${c.bottomShelfY}
    L ${c.rightShelfStartX} ${c.bottomShelfY}
    Q ${c.rightStepX} ${c.bottomShelfY} ${c.rightStepX} ${c.bottomShelfY + 20}
    L ${c.rightStepX} ${c.bottomStepY - 18}
    Q ${c.rightStepX} ${c.bottomStepY} ${c.rightStepX - 18} ${c.bottomStepY}
    L ${c.leftStepX + 18} ${c.bottomStepY}
    Q ${c.leftStepX} ${c.bottomStepY} ${c.leftStepX} ${c.bottomStepY - 18}
    L ${c.leftStepX} ${c.bottomShelfY + 20}
    Q ${c.leftStepX} ${c.bottomShelfY} ${c.leftShelfEndX} ${c.bottomShelfY}
    L ${c.x + c.corner} ${c.bottomShelfY}
    Q ${c.x} ${c.bottomShelfY} ${c.x} ${c.bottomShelfY - c.corner}
    L ${c.x} ${c.y + c.corner}
    Q ${c.x} ${c.y} ${c.x + c.corner} ${c.y}
    Z
  `,

  topGroove: (c = BASE_COMPONENT.topGroove) => `
    M ${c.outerLeftX} ${c.topY}
    L ${c.innerLeftX} ${c.topY}
    L ${c.innerLeftX} 122
    Q ${c.innerLeftX} ${c.cupBottomY} ${c.centerX} ${c.cupBottomY}
    Q ${c.innerRightX} ${c.cupBottomY} ${c.innerRightX} 122
    L ${c.innerRightX} ${c.topY}
    L ${c.outerRightX} ${c.topY}
    L ${c.outerRightX} 162
    Q ${c.outerRightX} ${c.lowerY} ${c.outerRightX - 14} ${c.lowerY}
    L 432 ${c.lowerY}
    Q 410 ${c.bottomY} ${c.centerX} ${c.bottomY}
    Q 310 ${c.bottomY} 288 ${c.lowerY}
    L 232 ${c.lowerY}
    Q ${c.outerLeftX} ${c.lowerY} ${c.outerLeftX} 162
    Z
  `,

  topGrooveStroke: (c = BASE_COMPONENT.topGrooveStroke) => `
    M ${c.leftX} ${c.topY}
    L ${c.leftX} ${c.neckBottomY}
    Q ${c.leftX} ${c.cupBottomY} ${c.centerX} ${c.cupBottomY}
    Q ${c.rightX} ${c.cupBottomY} ${c.rightX} ${c.neckBottomY}
    L ${c.rightX} ${c.topY}
  `,

  bottomGrooveDark: (c = BASE_COMPONENT.bottomGroove) => `
    M ${c.darkLeftX} ${c.darkY}
    Q 280 ${c.darkControlY} ${c.centerX} ${c.darkControlY}
    Q 440 ${c.darkControlY} ${c.darkRightX} ${c.darkY}
  `,

  bottomGrooveLight: (c = BASE_COMPONENT.bottomGroove) => `
    M ${c.lightLeftX} ${c.darkY}
    Q 302 ${c.lightControlY} ${c.centerX} ${c.lightControlY}
    Q 418 ${c.lightControlY} ${c.lightRightX} ${c.darkY}
  `,

  baseShadow: (c = BASE_COMPONENT.baseShadow) => `
    M ${c.x1} ${c.y1}
    Q ${c.cx} ${c.cy} ${c.x2} ${c.y2}
  `,
};

export const LABEL = {
  style: {
    fontFamily: "Arial, Helvetica, sans-serif",
    fill: "#f2f2f2",
    stroke: "#111111",
    strokeWidth: 2,
    paintOrder: "stroke" as const,
    letterSpacing: 0.5,
  },

  items: [
    {
      key: "outputTerminal1",
      text: "1",
      x: 168,
      y: 292,
      size: 58,
      weight: 700,
    },
    {
      key: "outputTerminal2",
      text: "2",
      x: 552,
      y: 292,
      size: 58,
      weight: 700,
    },

    {
      key: "outputVoltage",
      text: "24 ~ 380VAC",
      x: 360,
      y: 310,
      size: 38,
      weight: 700,
    },
    { key: "output", text: "OUTPUT", x: 360, y: 356, size: 36, weight: 700 },
    { key: "current", text: "40A", x: 360, y: 406, size: 42, weight: 700 },

    { key: "model", text: "SSR-40DA", x: 360, y: 510, size: 62, weight: 800 },
    {
      key: "relayName",
      text: "SOLID STATE RELAY",
      x: 360,
      y: 572,
      size: 41,
      weight: 800,
    },

    {
      key: "inputPlusCenter",
      text: "+",
      x: 360,
      y: 656,
      size: 50,
      weight: 800,
    },
    { key: "input", text: "INPUT", x: 360, y: 708, size: 42, weight: 800 },

    {
      key: "inputTerminal3",
      text: "= 3",
      x: 168,
      y: 752,
      size: 52,
      weight: 700,
    },
    {
      key: "inputVoltage",
      text: "3 ~ 32VDC",
      x: 360,
      y: 758,
      size: 42,
      weight: 800,
    },
    { key: "inputTerminal4", text: "4", x: 552, y: 752, size: 52, weight: 700 },
    { key: "inputPlusRight", text: "+", x: 610, y: 732, size: 50, weight: 800 },
  ],
};

/* =========================================================
   HELPERS
========================================================= */

const addPoint = (a: Point, b?: Partial<Point>): Point => ({
  x: a.x + (b?.x ?? 0),
  y: a.y + (b?.y ?? 0),
});

const transformOf = ({
  x,
  y,
  scale,
  rotation,
  origin,
}: {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  origin?: Point;
}) => {
  const rotate = rotation
    ? ` rotate(${rotation} ${origin?.x ?? 0} ${origin?.y ?? 0})`
    : "";
  const scaleValue =
    scale === undefined || scale === 1 ? "" : ` scale(${scale})`;
  return `translate(${x ?? 0} ${y ?? 0})${rotate}${scaleValue}`;
};

const createSvgIds = (seed: string) => ({
  bodyFront: `${seed}-bodyFront`,
  bodySide: `${seed}-bodySide`,
  panel: `${seed}-panel`,
  terminalMetal: `${seed}-terminalMetal`,
  screwHead: `${seed}-screwHead`,
  mountMetal: `${seed}-mountMetal`,
  ledRed: `${seed}-ledRed`,
  softShadow: `${seed}-softShadow`,
  textShadow: `${seed}-textShadow`,
});

const paint = (id: string) => `url(#${id})`;

const createRuntimeScale = (props: SSR40DAProps) => ({
  canvasScale: props.canvasScale ?? SCALE.canvas,
  componentScale: props.componentScale ?? SCALE.component,
  wireScale: props.wireScale ?? SCALE.wire,
  componentOffset: addPoint(SCALE.componentOffset, props.componentOffset),
  wireOffset: addPoint(SCALE.wireOffset, props.wireOffset),
  debugTerminalOffset: addPoint(
    SCALE.debugTerminalOffset,
    props.debugTerminalOffset,
  ),
});

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

const SvgDefs = ({ ids }: { ids: SvgIds }) => (
  <defs>
    <linearGradient id={ids.bodyFront} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#222222" />
      <stop offset="45%" stopColor="#111111" />
      <stop offset="100%" stopColor="#050505" />
    </linearGradient>

    <linearGradient id={ids.bodySide} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#3b3b3b" />
      <stop offset="100%" stopColor="#b8b8b8" />
    </linearGradient>

    <linearGradient id={ids.panel} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#202020" />
      <stop offset="100%" stopColor="#111111" />
    </linearGradient>

    <linearGradient id={ids.terminalMetal} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#e8e0d2" />
      <stop offset="45%" stopColor="#7e776d" />
      <stop offset="100%" stopColor="#eee7da" />
    </linearGradient>

    <radialGradient id={ids.screwHead} cx="35%" cy="28%" r="70%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="45%" stopColor="#c8c0b2" />
      <stop offset="100%" stopColor="#6d655b" />
    </radialGradient>

    <linearGradient id={ids.mountMetal} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f3eee4" />
      <stop offset="40%" stopColor="#8d8377" />
      <stop offset="100%" stopColor="#ded7cd" />
    </linearGradient>

    <radialGradient id={ids.ledRed} cx="35%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#ff6969" />
      <stop offset="55%" stopColor="#b00000" />
      <stop offset="100%" stopColor="#430000" />
    </radialGradient>

    <filter id={ids.softShadow} x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow
        dx="14"
        dy="18"
        stdDeviation="14"
        floodColor="#000000"
        floodOpacity="0.55"
      />
    </filter>

    <filter id={ids.textShadow} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="1"
        dy="2"
        stdDeviation="1"
        floodColor="#000000"
        floodOpacity="0.75"
      />
    </filter>
  </defs>
);

const SvgWireSegment = ({
  from,
  to,
  offset,
  strokeWidth,
}: {
  from: Point;
  to: Point;
  offset: Point;
  strokeWidth: number;
}) => {
  const a = addPoint(from, offset);
  const b = addPoint(to, offset);

  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={WIRE.stroke.color}
      strokeWidth={strokeWidth}
      strokeLinecap={WIRE.stroke.lineCap}
    />
  );
};

const SvgWireGroup = ({
  segments,
  offset,
  strokeWidth,
}: {
  segments: readonly { from: Point; to: Point }[];
  offset: Point;
  strokeWidth: number;
}) => (
  <g>
    {segments.map((segment, index) => (
      <SvgWireSegment
        key={`${segment.from.x}-${segment.from.y}-${segment.to.x}-${segment.to.y}-${index}`}
        from={segment.from}
        to={segment.to}
        offset={offset}
        strokeWidth={strokeWidth}
      />
    ))}
  </g>
);

const SvgLabel = ({
  text,
  x,
  y,
  size,
  weight,
  anchor = "middle",
}: {
  text: string;
  x: number;
  y: number;
  size: number;
  weight: number;
  anchor?: "start" | "middle" | "end";
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fontFamily={LABEL.style.fontFamily}
    fontSize={size}
    fontWeight={weight}
    fill={LABEL.style.fill}
    stroke={LABEL.style.stroke}
    strokeWidth={LABEL.style.strokeWidth}
    paintOrder={LABEL.style.paintOrder}
    letterSpacing={LABEL.style.letterSpacing}
  >
    {text}
  </text>
);

const MountHole = ({
  x,
  y,
  radius,
}: {
  x: number;
  y: number;
  radius: number;
}) => (
  <circle
    cx={x}
    cy={y}
    r={radius}
    fill="#ffffff"
    stroke="#4a443b"
    strokeWidth={5}
  />
);

const MetalMount = ({ ids, type }: { ids: SvgIds; type: "top" | "bottom" }) => {
  const config =
    type === "top" ? BASE_COMPONENT.topMount : BASE_COMPONENT.bottomMount;
  const hole = config.hole;

  return (
    <g
      transform={transformOf({
        x: 0,
        y: 0,
        scale: config.scale,
        rotation: config.rotation,
        origin: hole,
      })}
    >
      <path
        d={
          type === "top"
            ? PATH.topMount(BASE_COMPONENT.topMount)
            : PATH.bottomMount(BASE_COMPONENT.bottomMount)
        }
        fill={paint(ids.mountMetal)}
        stroke="#3c3935"
        strokeWidth={4}
        filter={`url(#${ids.softShadow})`}
      />
      <MountHole x={hole.x} y={hole.y} radius={hole.radius} />
    </g>
  );
};

const ScrewSlot = ({
  cx,
  cy,
  armLength,
  armWidth,
  round,
}: {
  cx: number;
  cy: number;
  armLength: number;
  armWidth: number;
  round: number;
}) => (
  <path
    d={`
      M ${cx - armWidth / 2} ${cy - armLength}
      Q ${cx} ${cy - armLength - round / 2} ${cx + armWidth / 2} ${cy - armLength}
      L ${cx + armWidth / 2} ${cy - armWidth / 2}
      L ${cx + armLength} ${cy - armWidth / 2}
      Q ${cx + armLength + round / 2} ${cy} ${cx + armLength} ${cy + armWidth / 2}
      L ${cx + armWidth / 2} ${cy + armWidth / 2}
      L ${cx + armWidth / 2} ${cy + armLength}
      Q ${cx} ${cy + armLength + round / 2} ${cx - armWidth / 2} ${cy + armLength}
      L ${cx - armWidth / 2} ${cy + armWidth / 2}
      L ${cx - armLength} ${cy + armWidth / 2}
      Q ${cx - armLength - round / 2} ${cy} ${cx - armLength} ${cy - armWidth / 2}
      L ${cx - armWidth / 2} ${cy - armWidth / 2}
      Z
    `}
    fill="#34312c"
    opacity={0.9}
  />
);

const Screw = ({ ids, cx, cy }: { ids: SvgIds; cx: number; cy: number }) => {
  const screw = BASE_COMPONENT.terminalPocket.screw;
  const plateSize = screw.terminalPlateSize;

  return (
    <g
      transform={transformOf({
        scale: screw.scale,
        rotation: screw.rotation,
        origin: { x: cx, y: cy },
      })}
    >
      <rect
        x={cx - plateSize / 2}
        y={cy - plateSize / 2}
        width={plateSize}
        height={plateSize}
        rx={8}
        fill={paint(ids.terminalMetal)}
        stroke="#111111"
        strokeWidth={5}
      />

      <circle
        cx={cx}
        cy={cy}
        r={screw.screwOuterRadius}
        fill="#d7d1c5"
        stroke="#151515"
        strokeWidth={5}
      />

      <circle
        cx={cx}
        cy={cy}
        r={screw.screwInnerRadius}
        fill={paint(ids.screwHead)}
        stroke="#5b554c"
        strokeWidth={2}
      />

      <ScrewSlot
        cx={cx}
        cy={cy}
        armLength={screw.slotArmLength}
        armWidth={screw.slotArmWidth}
        round={screw.slotRound}
      />

      <path
        d={`M ${cx - 31} ${cy - 31} Q ${cx - 5} ${cy - 45} ${cx + 25} ${cy - 26}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth={4}
        opacity={0.45}
      />
    </g>
  );
};

const TerminalPocket = ({
  ids,
  part,
}: {
  ids: SvgIds;
  part: Omit<TuneTransform, "width" | "height">;
}) => {
  const terminal = BASE_COMPONENT.terminalPocket;
  const screwCenter = {
    x: part.x + terminal.screw.centerOffset.x,
    y: part.y + terminal.screw.centerOffset.y,
  };

  return (
    <g
      transform={transformOf({
        scale: part.scale,
        rotation: part.rotation,
        origin: screwCenter,
      })}
    >
      <rect
        x={part.x}
        y={part.y}
        width={terminal.width}
        height={terminal.height}
        rx={terminal.rx}
        fill="#050505"
        stroke="#232323"
        strokeWidth={4}
      />

      <rect
        x={part.x + terminal.innerInset}
        y={part.y + terminal.innerInset}
        width={terminal.width - terminal.innerInset * 2}
        height={terminal.height - terminal.innerInset * 2}
        rx={terminal.innerRx}
        fill="#0d0d0d"
      />

      <Screw ids={ids} cx={screwCenter.x} cy={screwCenter.y} />
    </g>
  );
};

const BodySide = ({ ids }: { ids: SvgIds }) => (
  <path d={PATH.bodySide()} fill={paint(ids.bodySide)} opacity={0.92} />
);

const MainBody = ({ ids }: { ids: SvgIds }) => {
  const body = BASE_COMPONENT.bodyFront;

  return (
    <rect
      x={body.x}
      y={body.y}
      width={body.width}
      height={body.height}
      rx={body.rx}
      fill={paint(ids.bodyFront)}
      stroke="#2e2e2e"
      strokeWidth={4}
      filter={`url(#${ids.softShadow})`}
    />
  );
};

const MoldedGrooves = () => (
  <g>
    <path d={PATH.topGroove()} fill="#080808" opacity={0.72} />

    <path
      d={PATH.topGrooveStroke()}
      fill="none"
      stroke="#313131"
      strokeWidth={8}
    />

    <path
      d={PATH.bottomGrooveDark()}
      fill="none"
      stroke="#050505"
      strokeWidth={24}
      opacity={0.8}
    />

    <path
      d={PATH.bottomGrooveLight()}
      fill="none"
      stroke="#353535"
      strokeWidth={8}
      opacity={0.7}
    />
  </g>
);

const LabelPanel = ({ ids }: { ids: SvgIds }) => (
  <path
    d={PATH.labelPanel()}
    fill={paint(ids.panel)}
    stroke="#343434"
    strokeWidth={5}
  />
);

const IndicatorLed = ({ ids }: { ids: SvgIds }) => {
  const led = BASE_COMPONENT.led;

  return (
    <g
      transform={transformOf({
        scale: led.scale,
        rotation: led.rotation,
        origin: { x: led.x, y: led.y },
      })}
    >
      <circle
        cx={led.x}
        cy={led.y}
        r={led.outerRadius}
        fill="#050505"
        stroke="#151515"
        strokeWidth={4}
      />
      <circle
        cx={led.x}
        cy={led.y}
        r={led.innerRadius}
        fill={paint(ids.ledRed)}
        stroke="#230000"
        strokeWidth={3}
      />
      <circle
        cx={led.highlight.x}
        cy={led.highlight.y}
        r={led.highlight.radius}
        fill="#ff8b8b"
        opacity={0.65}
      />
    </g>
  );
};

const FrontHighlight = () => {
  const highlight = BASE_COMPONENT.frontHighlight;

  return (
    <rect
      x={highlight.x}
      y={highlight.y}
      width={highlight.width}
      height={highlight.height}
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      opacity={0.08}
    />
  );
};

const BaseShadow = () => (
  <path
    d={PATH.baseShadow()}
    fill="none"
    stroke="#000000"
    strokeWidth={10}
    opacity={0.25}
  />
);

const RelayLabels = ({ ids }: { ids: SvgIds }) => (
  <g filter={`url(#${ids.textShadow})`}>
    {LABEL.items.map((item) => (
      <SvgLabel
        key={item.key}
        text={item.text}
        x={item.x}
        y={item.y}
        size={item.size}
        weight={item.weight}
      />
    ))}
  </g>
);

const RelayWires = ({
  offset,
  strokeWidth,
}: {
  offset: Point;
  strokeWidth: number;
}) => (
  <g>
    {Object.entries(WIRE.segments).map(([key, segments]) => (
      <SvgWireGroup
        key={key}
        segments={segments}
        offset={offset}
        strokeWidth={strokeWidth}
      />
    ))}
  </g>
);

const DebugTerminalDots = ({
  show,
  offset,
}: {
  show: boolean;
  offset: Point;
}) => {
  if (!show) return null;

  const allNodes = [
    ...Object.entries(NODE.terminalCenters).map(([key, point]) => ({
      key: `terminal-${key}`,
      point,
      fill: "#00aaff",
    })),
    ...Object.entries(NODE.terminalWireReference).map(([key, point]) => ({
      key: `wire-${key}`,
      point,
      fill: "#ffbb00",
    })),
    {
      key: "led-center",
      point: NODE.led.center,
      fill: "#ff3344",
    },
    {
      key: "mount-top",
      point: { x: NODE.mountHoles.top.x, y: NODE.mountHoles.top.y },
      fill: "#35d07f",
    },
    {
      key: "mount-bottom",
      point: { x: NODE.mountHoles.bottom.x, y: NODE.mountHoles.bottom.y },
      fill: "#35d07f",
    },
  ];

  return (
    <g opacity={0.85} pointerEvents="none">
      {allNodes.map(({ key, point, fill }) => {
        const p = addPoint(point, offset);
        return (
          <circle
            key={key}
            cx={p.x}
            cy={p.y}
            r={NODE.debug.radius}
            fill={fill}
            stroke="#ffffff"
            strokeWidth={NODE.debug.strokeWidth}
          />
        );
      })}
    </g>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SSR40DA({
  className = "",
  width = "100%",
  height = "auto",
  componentScale,
  canvasScale,
  wireScale,
  componentOffset,
  wireOffset,
  debugTerminalOffset,
  showDebugTerminals = SHOW_DEBUG_TERMINAL_DOTS,
}: SSR40DAProps) {
  const rawId = React.useId().replace(/:/g, "");
  const ids = createSvgIds(`ssr40da-${rawId}`);

  const runtime = createRuntimeScale({
    componentScale,
    canvasScale,
    wireScale,
    componentOffset,
    wireOffset,
    debugTerminalOffset,
  });

  const wireStrokeWidth = BASE_WIRE_WIDTH * runtime.wireScale;

  return (
    <div
      className={`inline-flex items-center justify-center bg-transparent ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox={`${VIEW_BOX.minX} ${VIEW_BOX.minY} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SSR-40DA Solid State Relay"
        className="h-auto w-full max-w-full"
        style={{
          transform: `scale(${runtime.canvasScale})`,
          transformOrigin: "center",
        }}
      >
        <SvgDefs ids={ids} />

        <g
          transform={transformOf({
            x: runtime.componentOffset.x,
            y: runtime.componentOffset.y,
            scale: runtime.componentScale,
            rotation: COMPONENT.root.rotation,
            origin: {
              x: VIEW_BOX.width / 2,
              y: VIEW_BOX.height / 2,
            },
          })}
        >
          <BodySide ids={ids} />

          <MetalMount ids={ids} type="top" />
          <MetalMount ids={ids} type="bottom" />

          <MainBody ids={ids} />
          <MoldedGrooves />

          <TerminalPocket
            ids={ids}
            part={BASE_COMPONENT.terminalPocket.positions.topLeft}
          />
          <TerminalPocket
            ids={ids}
            part={BASE_COMPONENT.terminalPocket.positions.topRight}
          />
          <TerminalPocket
            ids={ids}
            part={BASE_COMPONENT.terminalPocket.positions.bottomLeft}
          />
          <TerminalPocket
            ids={ids}
            part={BASE_COMPONENT.terminalPocket.positions.bottomRight}
          />

          <LabelPanel ids={ids} />

          <RelayWires
            offset={runtime.wireOffset}
            strokeWidth={wireStrokeWidth}
          />

          <RelayLabels ids={ids} />
          <IndicatorLed ids={ids} />

          <FrontHighlight />
          <BaseShadow />

          <DebugTerminalDots
            show={showDebugTerminals}
            offset={runtime.debugTerminalOffset}
          />
        </g>
      </svg>
    </div>
  );
}
