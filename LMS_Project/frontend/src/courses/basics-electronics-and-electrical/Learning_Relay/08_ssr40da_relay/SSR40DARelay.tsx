"use client";

import React from "react";

/* =========================================================
   VIEW_BOX + SCALE CONSTANTS
========================================================= */

export const VIEW_BOX = {
  x: 0,
  y: -25,
  width: 720,
  height: 580,
} as const;

export const SCALE = {
  CIRCUIT_COMPONENT_SCALE: 1,
  CIRCUIT_CANVAS_SCALE: 1,
  CIRCUIT_WIRE_SCALE: 1,
  BASE_WIRE_WIDTH: 2.4,
} as const;

export const COMPONENT_OFFSET = {
  x: 0,
  y: 0,
} as const;

export const WIRE_OFFSET = {
  x: 0,
  y: 0,
} as const;

export const DEBUG_TERMINAL_OFFSET = {
  x: 0,
  y: 70,
} as const;

/* =========================================================
   TYPES
========================================================= */

type Point = {
  x: number;
  y: number;
};

type Offset = Point;

type TerminalKey = "T1" | "T2" | "T3" | "T4";

type SSR40DARelayProps = {
  className?: string;
  width?: number | string;
  height?: number | string;

  componentScale?: number;
  canvasScale?: number;

  componentOffset?: Offset;
  wireOffset?: Offset;
  debugTerminalOffset?: Offset;

  showDebugTerminals?: boolean;
  showStructuredWires?: boolean;
};

/* =========================================================
   BASE_COMPONENT
========================================================= */

export const BASE_COMPONENT = {
  body: {
    points: [
      { x: 120, y: 20 },
      { x: 600, y: 20 },
      { x: 620, y: 455 },
      { x: 585, y: 500 },
      { x: 145, y: 500 },
      { x: 95, y: 455 },
      { x: 95, y: 60 },
    ],
    offset: { x: 0, y: 0 },
  },

  rightDepth: {
    points: [
      { x: 600, y: 20 },
      { x: 620, y: 455 },
      { x: 585, y: 500 },
      { x: 570, y: 65 },
    ],
    offset: { x: 0, y: 0 },
  },

  bottomMetalRail: {
    points: [
      { x: 170, y: 488 },
      { x: 555, y: 488 },
      { x: 535, y: 515 },
      { x: 190, y: 515 },
    ],
    offset: { x: 0, y: 0 },
  },

  cover: {
    points: [
      { x: 142, y: 35 },
      { x: 580, y: 35 },
      { x: 590, y: 462 },
      { x: 155, y: 462 },
      { x: 115, y: 430 },
      { x: 115, y: 70 },
    ],
    offset: { x: 0, y: 0 },
  },

  labelPlate: {
    x: 230,
    y: 135,
    width: 295,
    height: 260,
    rx: 4,
    skewTop: 10,
    skewBottom: -4,
    offset: { x: 0, y: 0 },
  },
} as const;

/* =========================================================
   COMPONENT
========================================================= */

export const COMPONENT = {
  terminalBlock: {
    width: 118,
    height: 92,
    rx: 16,
    screwRadius: 22,
    screwSlotWidth: 34,
    screwSlotHeight: 7,
    offset: { x: 0, y: 0 },
  },

  notch: {
    left: {
      x: 95,
      y: 260,
      radius: 45,
      offset: { x: 0, y: 0 },
    },
    bottom: {
      x: 382,
      y: 462,
      radius: 40,
      offset: { x: 0, y: 0 },
    },
  },

  led: {
    x: 500,
    y: 285,
    radius: 19,
    offset: { x: 0, y: 0 },
  },

  inputUnderline: {
    first: {
      x1: 310,
      y1: 302,
      x2: 420,
      y2: 302,
    },
    second: {
      x1: 335,
      y1: 330,
      x2: 395,
      y2: 330,
    },
  },

  terminal: {
    T1: { offset: { x: 0, y: 0 } },
    T2: { offset: { x: 0, y: 0 } },
    T3: { offset: { x: 0, y: 0 } },
    T4: { offset: { x: 0, y: 0 } },
  },

  textGroup: {
    offset: { x: 0, y: 0 },
  },
} as const;

/* =========================================================
   NODE
========================================================= */

export const NODE: Record<TerminalKey, Point & { number: string }> = {
  T1: { x: 205, y: 55, number: "1" },
  T2: { x: 505, y: 55, number: "2" },
  T3: { x: 505, y: 445, number: "3" },
  T4: { x: 205, y: 445, number: "4" },
};

/* =========================================================
   WIRE - STRUCTURED SEGMENTS
========================================================= */

export const WIRE = {
  AC_OUTPUT_LINE: {
    id: "ac-output-line",
    points: [
      { x: 205, y: 130 },
      { x: 280, y: 130 },
      { x: 312, y: 105 },
      { x: 345, y: 130 },
      { x: 506, y: 130 },
    ],
  },

  INPUT_MINUS_LINE: {
    id: "input-minus-line",
    points: [
      { x: 215, y: 350 },
      { x: 260, y: 350 },
      { x: 300, y: 350 },
    ],
  },

  INPUT_CENTER_LINE: {
    id: "input-center-line",
    points: [
      { x: 300, y: 350 },
      { x: 355, y: 350 },
      { x: 410, y: 350 },
    ],
  },

  INPUT_PLUS_LINE: {
    id: "input-plus-line",
    points: [
      { x: 410, y: 350 },
      { x: 455, y: 350 },
      { x: 505, y: 350 },
    ],
  },

  LED_SYMBOL_LINE: {
    id: "led-symbol-line",
    points: [
      { x: 450, y: 285 },
      { x: 475, y: 285 },
      { x: 525, y: 285 },
      { x: 560, y: 285 },
    ],
  },
} as const;

/* =========================================================
   PATH
========================================================= */

export const PATH = {
  acWave: {
    points: [
      { x: 176, y: 136 },
      { x: 190, y: 108 },
      { x: 220, y: 108 },
      { x: 246, y: 136 },
    ],
  },

  ledInnerDash: {
    points: [
      { x: 475, y: 285 },
      { x: 525, y: 285 },
    ],
  },

  inputSymbolVertical: {
    points: [
      { x: 465, y: 268 },
      { x: 465, y: 302 },
      { x: 535, y: 268 },
      { x: 535, y: 302 },
    ],
  },
} as const;

/* =========================================================
   LABEL
========================================================= */

export const LABEL = {
  terminalNumber: {
    T1: { x: 88, y: 90, fontSize: 22 },
    T2: { x: 632, y: 90, fontSize: 22 },
    T3: { x: 622, y: 390, fontSize: 22 },
    T4: { x: 76, y: 390, fontSize: 22 },
  },

  polarity: {
    plus: {
      text: "+",
      x: 590,
      y: 382,
      fontSize: 28,
    },
    minus: {
      text: "−",
      x: 130,
      y: 382,
      fontSize: 28,
    },
    t3: {
      text: "T3 / +",
      x: 528,
      y: 432,
      fontSize: 18,
    },
    t4: {
      text: "T4 / −",
      x: 224,
      y: 432,
      fontSize: 18,
    },
  },

  titleSmall: {
    text: "Solid State Relay",
    x: 305,
    y: 230,
    fontSize: 24,
  },

  titleMain: {
    text: "SSR-40 DA",
    x: 305,
    y: 285,
    fontSize: 42,
  },

  input: {
    text: "INPUT",
    x: 330,
    y: 315,
    fontSize: 19,
  },

  ampere: {
    text: "40A",
    x: 535,
    y: 270,
    fontSize: 22,
  },

  ce: {
    text: "CE",
    x: 455,
    y: 195,
    fontSize: 34,
  },

  acVoltage: {
    text: "24–380VAC",
    x: 350,
    y: 105,
    fontSize: 20,
  },

  dcVoltage: {
    text: "3 ~ 32VDC",
    x: 355,
    y: 365,
    fontSize: 18,
  },
} as const;

/* =========================================================
   HELPERS
========================================================= */

const addOffset = (p: Point, ...offsets: Offset[]): Point => ({
  x: p.x + offsets.reduce((sum, o) => sum + o.x, 0),
  y: p.y + offsets.reduce((sum, o) => sum + o.y, 0),
});

const pointsToPath = (points: readonly Point[], close = true): string => {
  const path = points
    .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return close ? `${path} Z` : path;
};

const offsetPoints = (points: readonly Point[], offset: Offset): Point[] => {
  return points.map((p) => addOffset(p, offset));
};

const wirePath = (points: readonly Point[], offset: Offset): string => {
  return pointsToPath(offsetPoints(points, offset), false);
};

const roundedLabelPlatePath = (): string => {
  const plate = BASE_COMPONENT.labelPlate;

  const x = plate.x + plate.offset.x;
  const y = plate.y + plate.offset.y;
  const w = plate.width;
  const h = plate.height;
  const r = plate.rx;
  const st = plate.skewTop;
  const sb = plate.skewBottom;

  return `
    M ${x + st + r} ${y}
    L ${x + w + st - r} ${y}
    Q ${x + w + st} ${y} ${x + w + st} ${y + r}
    L ${x + w + sb} ${y + h - r}
    Q ${x + w + sb} ${y + h} ${x + w + sb - r} ${y + h}
    L ${x + sb + r} ${y + h}
    Q ${x + sb} ${y + h} ${x + sb} ${y + h - r}
    L ${x + st} ${y + r}
    Q ${x + st} ${y} ${x + st + r} ${y}
    Z
  `;
};

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function LabelText({
  x,
  y,
  children,
  size = 16,
  weight = 600,
  rotate,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  weight?: number | string;
  rotate?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={size}
      fontWeight={weight}
      fill="#2a2a2a"
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      style={{ userSelect: "none" }}
    >
      {children}
    </text>
  );
}

function Screw({
  x,
  y,
  rotate = -22,
}: {
  x: number;
  y: number;
  rotate?: number;
}) {
  const slotW = COMPONENT.terminalBlock.screwSlotWidth;
  const slotH = COMPONENT.terminalBlock.screwSlotHeight;

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={COMPONENT.terminalBlock.screwRadius}
        fill="url(#screwGradient)"
        stroke="#8e8e8e"
        strokeWidth={2}
      />

      <circle
        cx={x}
        cy={y}
        r={13}
        fill="#eeeeee"
        stroke="#202020"
        strokeWidth={2}
      />

      <circle cx={x} cy={y} r={8} fill="#0f0f0f" />

      <rect
        x={x - slotW / 2}
        y={y - slotH / 2}
        width={slotW}
        height={slotH}
        rx={3}
        fill="#6f6f6f"
        opacity={0.75}
        transform={`rotate(${rotate} ${x} ${y})`}
      />
    </g>
  );
}

function TerminalBlock({ terminalKey }: { terminalKey: TerminalKey }) {
  const node = NODE[terminalKey];
  const terminalOffset = COMPONENT.terminal[terminalKey].offset;
  const common = COMPONENT.terminalBlock;

  const p = addOffset(node, common.offset, terminalOffset);

  const x = p.x - common.width / 2;
  const y = p.y - common.height / 2;

  const isBottom = terminalKey === "T3" || terminalKey === "T4";

  return (
    <g>
      <rect
        x={x + 7}
        y={y + 9}
        width={common.width}
        height={common.height}
        rx={common.rx}
        fill="#d7d7d7"
        opacity={0.45}
      />

      <rect
        x={x}
        y={y}
        width={common.width}
        height={common.height}
        rx={common.rx}
        fill="#f7f7f7"
        stroke="#d0d0d0"
        strokeWidth={2.5}
      />

      <rect
        x={x + 17}
        y={y + 13}
        width={common.width - 34}
        height={common.height - 26}
        rx={12}
        fill="#ffffff"
        opacity={0.78}
      />

      <Screw x={p.x} y={p.y} rotate={terminalKey === "T2" ? 18 : -24} />

      {isBottom && (
        <g>
          <rect
            x={p.x - 49}
            y={p.y + 44}
            width={98}
            height={27}
            rx={6}
            fill="#e7e7e7"
            stroke="#bababa"
            strokeWidth={1.5}
          />

          <rect
            x={p.x - 34}
            y={p.y + 53}
            width={68}
            height={9}
            rx={3}
            fill="#858585"
          />
        </g>
      )}
    </g>
  );
}

function StructuredWire({
  points,
  offset,
  width,
  dashed = false,
  opacity = 1,
}: {
  points: readonly Point[];
  offset: Offset;
  width: number;
  dashed?: boolean;
  opacity?: number;
}) {
  return (
    <path
      d={wirePath(points, offset)}
      fill="none"
      stroke="#202020"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "8 7" : undefined}
      opacity={opacity}
    />
  );
}

function DebugNode({
  x,
  y,
  label,
  offset,
}: {
  x: number;
  y: number;
  label: string;
  offset: Offset;
}) {
  const p = addOffset({ x, y }, offset);

  return (
    <g>
      <circle cx={p.x} cy={p.y} r={5.5} fill="#111111" />
      <circle
        cx={p.x}
        cy={p.y}
        r={11}
        fill="none"
        stroke="#111111"
        strokeWidth={1.5}
      />

      <LabelText x={p.x + 14} y={p.y - 10} size={13} weight={700}>
        {label}
      </LabelText>
    </g>
  );
}

function RelayBody() {
  return (
    <g>
      <path
        d={pointsToPath(offsetPoints(BASE_COMPONENT.bottomMetalRail.points, BASE_COMPONENT.bottomMetalRail.offset))}
        fill="#dcdcdc"
        stroke="#9f9f9f"
        strokeWidth={1.8}
      />

      <path
        d={pointsToPath(offsetPoints(BASE_COMPONENT.body.points, BASE_COMPONENT.body.offset))}
        fill="url(#bodyGradient)"
        stroke="#d5d5d5"
        strokeWidth={2.6}
      />

      <path
        d={pointsToPath(offsetPoints(BASE_COMPONENT.rightDepth.points, BASE_COMPONENT.rightDepth.offset))}
        fill="#d8d8d8"
        opacity={0.42}
        stroke="#c0c0c0"
        strokeWidth={1.4}
      />

      <path
        d={pointsToPath(offsetPoints(BASE_COMPONENT.cover.points, BASE_COMPONENT.cover.offset))}
        fill="url(#coverGradient)"
        stroke="#cfcfcf"
        strokeWidth={2.4}
        opacity={0.9}
      />

      <circle
        cx={COMPONENT.notch.left.x + COMPONENT.notch.left.offset.x}
        cy={COMPONENT.notch.left.y + COMPONENT.notch.left.offset.y}
        r={COMPONENT.notch.left.radius}
        fill="#ffffff"
        stroke="#d0d0d0"
        strokeWidth={2.5}
      />

      <circle
        cx={COMPONENT.notch.bottom.x + COMPONENT.notch.bottom.offset.x}
        cy={COMPONENT.notch.bottom.y + COMPONENT.notch.bottom.offset.y}
        r={COMPONENT.notch.bottom.radius}
        fill="#ffffff"
        stroke="#d0d0d0"
        strokeWidth={2.5}
      />

      <path
        d={roundedLabelPlatePath()}
        fill="#d8d8d8"
        stroke="#bdbdbd"
        strokeWidth={1.6}
        opacity={0.95}
      />
    </g>
  );
}

function PrintedCircuit({ wireOffset }: { wireOffset: Offset }) {
  const wireWidth = SCALE.BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE;

  return (
    <g>
      <StructuredWire
        points={WIRE.AC_OUTPUT_LINE.points}
        offset={wireOffset}
        width={wireWidth}
      />

      <path
        d={pointsToPath(PATH.acWave.points, false)}
        fill="none"
        stroke="#202020"
        strokeWidth={wireWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <StructuredWire
        points={WIRE.INPUT_MINUS_LINE.points}
        offset={wireOffset}
        width={wireWidth}
      />

      <StructuredWire
        points={WIRE.INPUT_CENTER_LINE.points}
        offset={wireOffset}
        width={wireWidth}
      />

      <StructuredWire
        points={WIRE.INPUT_PLUS_LINE.points}
        offset={wireOffset}
        width={wireWidth}
      />

      <StructuredWire
        points={WIRE.LED_SYMBOL_LINE.points}
        offset={wireOffset}
        width={wireWidth}
      />

      <circle
        cx={COMPONENT.led.x + COMPONENT.led.offset.x}
        cy={COMPONENT.led.y + COMPONENT.led.offset.y}
        r={COMPONENT.led.radius}
        fill="url(#ledGradient)"
        stroke="#202020"
        strokeWidth={2.2}
      />

      <path
        d={pointsToPath(PATH.ledInnerDash.points, false)}
        fill="none"
        stroke="#757575"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="9 8"
      />

      <path
        d={pointsToPath(PATH.inputSymbolVertical.points, false)}
        fill="none"
        stroke="#202020"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </g>
  );
}

function RelayLabels() {
  const offset = COMPONENT.textGroup.offset;

  return (
    <g transform={`translate(${offset.x} ${offset.y})`}>
      <LabelText
        x={LABEL.terminalNumber.T1.x}
        y={LABEL.terminalNumber.T1.y}
        size={LABEL.terminalNumber.T1.fontSize}
        weight={500}
      >
        1
      </LabelText>

      <LabelText
        x={LABEL.terminalNumber.T2.x}
        y={LABEL.terminalNumber.T2.y}
        size={LABEL.terminalNumber.T2.fontSize}
        weight={500}
      >
        2
      </LabelText>

      <LabelText
        x={LABEL.terminalNumber.T3.x}
        y={LABEL.terminalNumber.T3.y}
        size={LABEL.terminalNumber.T3.fontSize}
        weight={500}
      >
        3
      </LabelText>

      <LabelText
        x={LABEL.terminalNumber.T4.x}
        y={LABEL.terminalNumber.T4.y}
        size={LABEL.terminalNumber.T4.fontSize}
        weight={500}
      >
        4
      </LabelText>

      <LabelText
        x={LABEL.acVoltage.x}
        y={LABEL.acVoltage.y}
        size={LABEL.acVoltage.fontSize}
        weight={700}
        anchor="middle"
      >
        {LABEL.acVoltage.text}
      </LabelText>

      <LabelText
        x={LABEL.ce.x}
        y={LABEL.ce.y}
        size={LABEL.ce.fontSize}
        weight={800}
      >
        {LABEL.ce.text}
      </LabelText>

      <LabelText
        x={LABEL.titleSmall.x}
        y={LABEL.titleSmall.y}
        size={LABEL.titleSmall.fontSize}
        weight={700}
        anchor="middle"
      >
        {LABEL.titleSmall.text}
      </LabelText>

      <LabelText
        x={LABEL.titleMain.x}
        y={LABEL.titleMain.y}
        size={LABEL.titleMain.fontSize}
        weight={900}
        anchor="middle"
      >
        {LABEL.titleMain.text}
      </LabelText>

      <line
        x1={COMPONENT.inputUnderline.first.x1}
        y1={COMPONENT.inputUnderline.first.y1}
        x2={COMPONENT.inputUnderline.first.x2}
        y2={COMPONENT.inputUnderline.first.y2}
        stroke="#202020"
        strokeWidth={2}
        strokeLinecap="round"
      />

      <LabelText
        x={LABEL.input.x}
        y={LABEL.input.y}
        size={LABEL.input.fontSize}
        weight={900}
        anchor="middle"
      >
        {LABEL.input.text}
      </LabelText>

      <line
        x1={COMPONENT.inputUnderline.second.x1}
        y1={COMPONENT.inputUnderline.second.y1}
        x2={COMPONENT.inputUnderline.second.x2}
        y2={COMPONENT.inputUnderline.second.y2}
        stroke="#202020"
        strokeWidth={2}
        strokeLinecap="round"
      />

      <LabelText
        x={LABEL.ampere.x}
        y={LABEL.ampere.y}
        size={LABEL.ampere.fontSize}
        weight={800}
      >
        {LABEL.ampere.text}
      </LabelText>

      <LabelText
        x={LABEL.dcVoltage.x}
        y={LABEL.dcVoltage.y}
        size={LABEL.dcVoltage.fontSize}
        weight={700}
        anchor="middle"
      >
        {LABEL.dcVoltage.text}
      </LabelText>

      <LabelText
        x={LABEL.polarity.minus.x}
        y={LABEL.polarity.minus.y}
        size={LABEL.polarity.minus.fontSize}
        weight={700}
      >
        {LABEL.polarity.minus.text}
      </LabelText>

      <LabelText
        x={LABEL.polarity.plus.x}
        y={LABEL.polarity.plus.y}
        size={LABEL.polarity.plus.fontSize}
        weight={700}
      >
        {LABEL.polarity.plus.text}
      </LabelText>

      <LabelText
        x={LABEL.polarity.t4.x}
        y={LABEL.polarity.t4.y}
        size={LABEL.polarity.t4.fontSize}
        weight={800}
      >
        {LABEL.polarity.t4.text}
      </LabelText>

      <LabelText
        x={LABEL.polarity.t3.x}
        y={LABEL.polarity.t3.y}
        size={LABEL.polarity.t3.fontSize}
        weight={800}
      >
        {LABEL.polarity.t3.text}
      </LabelText>
    </g>
  );
}

function DebugLayer({
  debugTerminalOffset,
  wireOffset,
  showStructuredWires,
}: {
  debugTerminalOffset: Offset;
  wireOffset: Offset;
  showStructuredWires: boolean;
}) {
  const debugWireWidth = 1.5;

  return (
    <g pointerEvents="none">
      {showStructuredWires && (
        <g opacity={0.45}>
          {Object.values(WIRE).map((wire) => (
            <StructuredWire
              key={wire.id}
              points={wire.points}
              offset={wireOffset}
              width={debugWireWidth}
              dashed
            />
          ))}
        </g>
      )}

      <DebugNode
        x={NODE.T1.x}
        y={NODE.T1.y}
        label="T1 / AC"
        offset={debugTerminalOffset}
      />

      <DebugNode
        x={NODE.T2.x}
        y={NODE.T2.y}
        label="T2 / AC"
        offset={debugTerminalOffset}
      />

      <DebugNode
        x={NODE.T3.x}
        y={NODE.T3.y}
        label="T3 / +"
        offset={debugTerminalOffset}
      />

      <DebugNode
        x={NODE.T4.x}
        y={NODE.T4.y}
        label="T4 / −"
        offset={debugTerminalOffset}
      />
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SSR40DARelay({
  className = "",
  width = "100%",
  height = "auto",

  componentScale = SCALE.CIRCUIT_COMPONENT_SCALE,
  canvasScale = SCALE.CIRCUIT_CANVAS_SCALE,

  componentOffset = COMPONENT_OFFSET,
  wireOffset = WIRE_OFFSET,
  debugTerminalOffset = DEBUG_TERMINAL_OFFSET,

  showDebugTerminals = false,
  showStructuredWires = false,
}: SSR40DARelayProps) {
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SSR-40 DA Solid State Relay SVG component"
        className="max-w-full"
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f2f2f2" />
            <stop offset="100%" stopColor="#dfdfdf" />
          </linearGradient>

          <linearGradient id="coverGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#f0f0f0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d7d7d7" stopOpacity="0.82" />
          </linearGradient>

          <radialGradient id="screwGradient" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="42%" stopColor="#d0d0d0" />
            <stop offset="100%" stopColor="#8b8b8b" />
          </radialGradient>

          <radialGradient id="ledGradient" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="55%" stopColor="#b7b7b7" />
            <stop offset="100%" stopColor="#777777" />
          </radialGradient>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="10"
              floodColor="#000000"
              floodOpacity="0.17"
            />
          </filter>
        </defs>

        <g transform={`scale(${canvasScale})`}>
          <g
            filter="url(#softShadow)"
            transform={`
              translate(${componentOffset.x} ${componentOffset.y})
              scale(${componentScale})
            `}
          >
            <RelayBody />

            <TerminalBlock terminalKey="T1" />
            <TerminalBlock terminalKey="T2" />
            <TerminalBlock terminalKey="T4" />
            <TerminalBlock terminalKey="T3" />

            <PrintedCircuit wireOffset={wireOffset} />
            <RelayLabels />

            {showDebugTerminals && (
              <DebugLayer
                debugTerminalOffset={debugTerminalOffset}
                wireOffset={wireOffset}
                showStructuredWires={showStructuredWires}
              />
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}