"use client";

import React from "react";

/* =========================================================
   7805 VOLTAGE REGULATOR CIRCUIT SVG
   React / Next.js / TypeScript / TailwindCSS
   Single File Component

   Added:
   - Relevant DC input voltage source: 7.5V–35V DC
   - Relevant regulated output: +5V DC output with load
   - All schematic colors changed to black
========================================================= */

/* =========================================================
   TYPES
========================================================= */

type Point = {
  x: number;
  y: number;
};

type WireSegment = {
  id: string;
  from: Point;
  to: Point;
};

type TerminalKey =
  | "sourceTopLead"
  | "sourceBottomLead"
  | "inputBus"
  | "outputBus"
  | "groundBus"
  | "inputPin"
  | "groundPin"
  | "outputPin"
  | "leftCapTop"
  | "leftCapBottom"
  | "rightCapTop"
  | "rightCapBottom"
  | "outputLoadTop"
  | "outputLoadBottom";

export type LinearCurrentStage = 0 | 1 | 2 | 3;

/* =========================================================
   GLOBAL CONSTANTS
========================================================= */

export const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 590,
  h: 390,
};

export const CIRCUIT_COMPONENT_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;
export const CIRCUIT_WIRE_SCALE = 1;
export const BASE_WIRE_WIDTH = 3;

export const SCALE = {
  canvas: CIRCUIT_CANVAS_SCALE,
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
};

/* =========================================================
   OFFSET CONTROLS
========================================================= */

export const COMPONENT_OFFSET = {
  canvas: { x: 0, y: 0 },
  wholeCircuit: { x: 0, y: 0 },

  voltageSource: { x: 0, y: 0 },
  voltageSourceLabel: { x: 0, y: 0 },
  voltageSourceValue: { x: 0, y: 0 },

  regulatorSymbol: { x: 0, y: 0 },

  outputLoad: { x: 0, y: 0 },
  outputLabel: { x: 0, y: 0 },
  outputValue: { x: 0, y: 0 },
  loadLabel: { x: 0, y: 0 },

  vinLabel: { x: 0, y: 0 },
  voutLabel: { x: 0, y: 0 },

  leftCapLabel: { x: 0, y: 0 },
  rightCapLabel: { x: 0, y: 0 },
};

export const WIRE_OFFSET: Record<TerminalKey, Point> = {
  sourceTopLead: { x: 0, y: 0 },
  sourceBottomLead: { x: 0, y: 0 },

  inputBus: { x: 0, y: 0 },
  outputBus: { x: 0, y: 0 },
  groundBus: { x: 0, y: 0 },

  inputPin: { x: 0, y: 0 },
  groundPin: { x: 0, y: 0 },
  outputPin: { x: 0, y: 0 },

  leftCapTop: { x: 0, y: 0 },
  leftCapBottom: { x: 0, y: 0 },
  rightCapTop: { x: 0, y: 0 },
  rightCapBottom: { x: 0, y: 0 },

  outputLoadTop: { x: 0, y: 0 },
  outputLoadBottom: { x: 0, y: 0 },
};

export const DEBUG_TERMINAL_OFFSET: Record<TerminalKey, Point> = {
  sourceTopLead: { x: 0, y: 0 },
  sourceBottomLead: { x: 0, y: 0 },

  inputBus: { x: 0, y: 0 },
  outputBus: { x: 0, y: 0 },
  groundBus: { x: 0, y: 0 },

  inputPin: { x: 0, y: 0 },
  groundPin: { x: 0, y: 0 },
  outputPin: { x: 0, y: 0 },

  leftCapTop: { x: 0, y: 0 },
  leftCapBottom: { x: 0, y: 0 },
  rightCapTop: { x: 0, y: 0 },
  rightCapBottom: { x: 0, y: 0 },

  outputLoadTop: { x: 0, y: 0 },
  outputLoadBottom: { x: 0, y: 0 },
};

export const DEBUG = {
  showTerminalDots: false,
  showWireJoints: false,
  showTerminalNames: false,
};

/* =========================================================
   BASE COMPONENT POSITIONS
========================================================= */

export const BASE_COMPONENT = {
  voltageSource: {
    center: { x: 70, y: 262 },
    r: 32,

    topTerminal: { x: 70, y: 191 },
    bottomTerminal: { x: 70, y: 333 },

    label: { x: 70, y: 125 },
    value: { x: 70, y: 366 },
  },

  regulatorSymbol: {
    x: 236,
    y: 82,
    w: 92,
    h: 74,

    pins: {
      input: {
        x: 264,
        yTop: 156,
        yBus: 191,
      },
      ground: {
        x: 282,
        yTop: 156,
        yBus: 333,
      },
      output: {
        x: 300,
        yTop: 156,
        yBus: 191,
      },
    },

    text: {
      title: { x: 282, y: 106 },
      pin1: { x: 254, y: 136 },
      pin2: { x: 282, y: 136 },
      pin3: { x: 310, y: 136 },
    },
  },

  output: {
    topTerminal: { x: 522, y: 191 },
    bottomTerminal: { x: 522, y: 333 },

    load: {
      x: 522,
      yTop: 218,
      yBottom: 306,
      zigzagWidth: 18,
      zigzagSteps: 7,
    },

    label: { x: 522, y: 125 },
    value: { x: 522, y: 366 },
    loadLabel: { x: 552, y: 262 },
  },

  nodes: {
    inputBranchTop: { x: 158, y: 191 },
    inputBranchBottom: { x: 158, y: 333 },

    groundCenter: { x: 282, y: 333 },

    outputBranchTop: { x: 422, y: 191 },
    outputBranchBottom: { x: 422, y: 333 },
  },

  capacitor: {
    left: {
      x: 158,
      yTopPlate: 257,
      yBottomPlate: 272,
      plateW: 36,
    },
    right: {
      x: 422,
      yTopPlate: 257,
      yBottomPlate: 272,
      plateW: 36,
    },
  },

  labels: {
    vin: { x: 120, y: 172 },
    vout: { x: 465, y: 172 },

    leftCap: { x: 197, y: 242 },
    rightCap: { x: 458, y: 242 },
  },
};

/* =========================================================
   STYLE CONSTANTS
========================================================= */

export const NODE = {
  junctionRadius: 5,
  debugRadius: 4,
};

export const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  color: "#111111",
};

export const PATH = {
  stroke: "#111111",
  fill: "#ffffff",

  regulatorSymbol: {
    fill: "#ffffff",
    stroke: "#111111",
    strokeWidth: 3,
  },

  capacitor: {
    stroke: "#111111",
    strokeWidth: 3,
  },

  voltageSource: {
    stroke: "#111111",
    strokeWidth: 3,
    fill: "#ffffff",
  },

  load: {
    stroke: "#111111",
    strokeWidth: 3,
  },
};

export const LABEL = {
  fontFamily:
    "Arial, Helvetica, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

  main: {
    fill: "#111111",
    fontSize: 22,
    fontWeight: 700,
  },

  small: {
    fill: "#111111",
    fontSize: 15,
    fontWeight: 700,
  },

  voltage: {
    fill: "#111111",
    fontSize: 28,
    fontWeight: 600,
  },

  plusMinus: {
    fill: "#111111",
    fontSize: 26,
    fontWeight: 700,
  },

  regulatorTitle: {
    fill: "#111111",
    fontSize: 22,
    fontWeight: 700,
  },

  regulatorPin: {
    fill: "#111111",
    fontSize: 22,
    fontWeight: 700,
  },

  cap: {
    fill: "#111111",
    fontSize: 15,
    fontWeight: 700,
  },
};

/* =========================================================
   HELPERS
========================================================= */

const addPoint = (p: Point, o: Point): Point => ({
  x: p.x + o.x,
  y: p.y + o.y,
});

const getUniquePoints = (segments: WireSegment[]): Point[] => {
  const map = new Map<string, Point>();

  segments.forEach((s) => {
    map.set(`${s.from.x}-${s.from.y}`, s.from);
    map.set(`${s.to.x}-${s.to.y}`, s.to);
  });

  return [...map.values()];
};

const createZigzagPath = ({
  x,
  yTop,
  yBottom,
  width,
  steps,
}: {
  x: number;
  yTop: number;
  yBottom: number;
  width: number;
  steps: number;
}) => {
  const stepHeight = (yBottom - yTop) / steps;
  let d = `M ${x} ${yTop}`;

  for (let i = 1; i <= steps; i++) {
    const y = yTop + i * stepHeight;
    const zigzagX = i % 2 === 0 ? x - width / 2 : x + width / 2;
    d += ` L ${zigzagX} ${y}`;
  }

  d += ` L ${x} ${yBottom}`;
  return d;
};

/* =========================================================
   WIRE SEGMENTS
========================================================= */

export const createWireSegments = (): Record<TerminalKey, WireSegment[]> => {
  const vs = BASE_COMPONENT.voltageSource;
  const n = BASE_COMPONENT.nodes;
  const r = BASE_COMPONENT.regulatorSymbol;
  const c = BASE_COMPONENT.capacitor;
  const out = BASE_COMPONENT.output;

  return {
    sourceTopLead: [
      {
        id: "source-top-lead",
        from: addPoint(vs.topTerminal, WIRE_OFFSET.sourceTopLead),
        to: addPoint(
          { x: vs.center.x, y: vs.center.y - vs.r },
          WIRE_OFFSET.sourceTopLead,
        ),
      },
    ],

    sourceBottomLead: [
      {
        id: "source-bottom-lead",
        from: addPoint(
          { x: vs.center.x, y: vs.center.y + vs.r },
          WIRE_OFFSET.sourceBottomLead,
        ),
        to: addPoint(vs.bottomTerminal, WIRE_OFFSET.sourceBottomLead),
      },
    ],

    inputBus: [
      {
        id: "input-bus",
        from: addPoint(vs.topTerminal, WIRE_OFFSET.inputBus),
        to: addPoint(
          { x: r.pins.input.x, y: r.pins.input.yBus },
          WIRE_OFFSET.inputBus,
        ),
      },
    ],

    outputBus: [
      {
        id: "output-bus",
        from: addPoint(
          { x: r.pins.output.x, y: r.pins.output.yBus },
          WIRE_OFFSET.outputBus,
        ),
        to: addPoint(out.topTerminal, WIRE_OFFSET.outputBus),
      },
    ],

    groundBus: [
      {
        id: "ground-bus",
        from: addPoint(vs.bottomTerminal, WIRE_OFFSET.groundBus),
        to: addPoint(out.bottomTerminal, WIRE_OFFSET.groundBus),
      },
    ],

    inputPin: [
      {
        id: "input-pin-wire",
        from: addPoint(
          { x: r.pins.input.x, y: r.pins.input.yTop },
          WIRE_OFFSET.inputPin,
        ),
        to: addPoint(
          { x: r.pins.input.x, y: r.pins.input.yBus },
          WIRE_OFFSET.inputPin,
        ),
      },
    ],

    groundPin: [
      {
        id: "ground-pin-wire",
        from: addPoint(
          { x: r.pins.ground.x, y: r.pins.ground.yTop },
          WIRE_OFFSET.groundPin,
        ),
        to: addPoint(
          { x: r.pins.ground.x, y: r.pins.ground.yBus },
          WIRE_OFFSET.groundPin,
        ),
      },
    ],

    outputPin: [
      {
        id: "output-pin-wire",
        from: addPoint(
          { x: r.pins.output.x, y: r.pins.output.yTop },
          WIRE_OFFSET.outputPin,
        ),
        to: addPoint(
          { x: r.pins.output.x, y: r.pins.output.yBus },
          WIRE_OFFSET.outputPin,
        ),
      },
    ],

    leftCapTop: [
      {
        id: "left-cap-top-wire",
        from: addPoint({ x: c.left.x, y: 191 }, WIRE_OFFSET.leftCapTop),
        to: addPoint(
          { x: c.left.x, y: c.left.yTopPlate },
          WIRE_OFFSET.leftCapTop,
        ),
      },
    ],

    leftCapBottom: [
      {
        id: "left-cap-bottom-wire",
        from: addPoint(
          { x: c.left.x, y: c.left.yBottomPlate },
          WIRE_OFFSET.leftCapBottom,
        ),
        to: addPoint({ x: c.left.x, y: 333 }, WIRE_OFFSET.leftCapBottom),
      },
    ],

    rightCapTop: [
      {
        id: "right-cap-top-wire",
        from: addPoint({ x: c.right.x, y: 191 }, WIRE_OFFSET.rightCapTop),
        to: addPoint(
          { x: c.right.x, y: c.right.yTopPlate },
          WIRE_OFFSET.rightCapTop,
        ),
      },
    ],

    rightCapBottom: [
      {
        id: "right-cap-bottom-wire",
        from: addPoint(
          { x: c.right.x, y: c.right.yBottomPlate },
          WIRE_OFFSET.rightCapBottom,
        ),
        to: addPoint({ x: c.right.x, y: 333 }, WIRE_OFFSET.rightCapBottom),
      },
    ],

    outputLoadTop: [
      {
        id: "output-load-top-wire",
        from: addPoint(out.topTerminal, WIRE_OFFSET.outputLoadTop),
        to: addPoint(
          { x: out.load.x, y: out.load.yTop },
          WIRE_OFFSET.outputLoadTop,
        ),
      },
    ],

    outputLoadBottom: [
      {
        id: "output-load-bottom-wire",
        from: addPoint(
          { x: out.load.x, y: out.load.yBottom },
          WIRE_OFFSET.outputLoadBottom,
        ),
        to: addPoint(out.bottomTerminal, WIRE_OFFSET.outputLoadBottom),
      },
    ],
  };
};

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function Canvas() {
  return (
    <rect
      x={VIEW_BOX.x}
      y={VIEW_BOX.y}
      width={VIEW_BOX.w}
      height={VIEW_BOX.h}
      fill="#ffffff"
    />
  );
}

function WireBlock({ terminal }: { terminal: TerminalKey }) {
  const segments = createWireSegments()[terminal];

  return (
    <g>
      {segments.map((s) => (
        <line
          key={s.id}
          x1={s.from.x}
          y1={s.from.y}
          x2={s.to.x}
          y2={s.to.y}
          stroke={WIRE.color}
          strokeWidth={WIRE.width}
          strokeLinecap="square"
        />
      ))}

      {DEBUG.showWireJoints &&
        getUniquePoints(segments).map((p, i) => (
          <circle
            key={`${terminal}-debug-${i}`}
            cx={p.x + DEBUG_TERMINAL_OFFSET[terminal].x}
            cy={p.y + DEBUG_TERMINAL_OFFSET[terminal].y}
            r={NODE.debugRadius}
            fill="#ffffff"
            stroke="#111111"
            strokeWidth={1.5}
          />
        ))}
    </g>
  );
}

function JunctionDot({ x, y }: Point) {
  return <circle cx={x} cy={y} r={NODE.junctionRadius} fill={WIRE.color} />;
}

function pointsToPath(points: Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function CurrentFlowDots({
  color,
  delayStep = 0.55,
  duration = 2.6,
  id,
  points,
}: {
  color: string;
  delayStep?: number;
  duration?: number;
  id: string;
  points: Point[];
}) {
  return (
    <g>
      {[0, 1, 2].map((dot) => (
        <circle
          key={`${id}-dot-${dot}`}
          r={4.5}
          fill={color}
          opacity={0.9}
          stroke="#ffffff"
          strokeWidth={1.25}
        >
          <animateMotion
            begin={`${dot * delayStep}s`}
            dur={`${duration}s`}
            path={pointsToPath(points)}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            begin={`${dot * delayStep}s`}
            dur={`${duration}s`}
            repeatCount="indefinite"
            values="0.2;0.95;0.95;0.2"
          />
        </circle>
      ))}
    </g>
  );
}

function LinearCurrentFlow({ stage }: { stage: LinearCurrentStage }) {
  if (stage === 0) return null;

  const vs = BASE_COMPONENT.voltageSource;
  const r = BASE_COMPONENT.regulatorSymbol;
  const c = BASE_COMPONENT.capacitor;
  const out = BASE_COMPONENT.output;
  const n = BASE_COMPONENT.nodes;

  const inputPath = [
    vs.topTerminal,
    n.inputBranchTop,
    { x: r.pins.input.x, y: r.pins.input.yBus },
    { x: r.pins.input.x, y: r.pins.input.yTop },
  ];
  const inputCapChargePath = [
    n.inputBranchTop,
    { x: c.left.x, y: c.left.yTopPlate },
    { x: c.left.x, y: c.left.yBottomPlate },
    n.inputBranchBottom,
  ];
  const internalRegulationPath = [
    { x: r.pins.input.x, y: r.pins.input.yTop },
    { x: r.pins.input.x + 18, y: r.y + 38 },
    { x: r.pins.output.x - 18, y: r.y + 38 },
    { x: r.pins.output.x, y: r.pins.output.yTop },
  ];
  const groundReferencePath = [
    { x: r.pins.ground.x, y: r.pins.ground.yTop },
    { x: r.pins.ground.x, y: r.pins.ground.yBus },
    n.groundCenter,
  ];
  const outputPath = [
    { x: r.pins.output.x, y: r.pins.output.yTop },
    { x: r.pins.output.x, y: r.pins.output.yBus },
    n.outputBranchTop,
    out.topTerminal,
    { x: out.load.x, y: out.load.yTop },
  ];
  const groundReturnPath = [
    { x: out.load.x, y: out.load.yBottom },
    out.bottomTerminal,
    vs.bottomTerminal,
  ];

  return (
    <g aria-label="Animated linear regulator current flow dots">
      <CurrentFlowDots color="#ef4444" id="linear-input-current" points={inputPath} />
      <CurrentFlowDots
        color="#f97316"
        delayStep={0.7}
        duration={3}
        id="linear-input-cap-current"
        points={inputCapChargePath}
      />
      {stage >= 2 && (
        <>
          <CurrentFlowDots
            color="#facc15"
            delayStep={0.5}
            duration={2.7}
            id="linear-internal-current"
            points={internalRegulationPath}
          />
          <CurrentFlowDots
            color="#22c55e"
            delayStep={0.6}
            duration={2.9}
            id="linear-ground-reference-current"
            points={groundReferencePath}
          />
        </>
      )}
      {stage >= 3 && (
        <>
          <CurrentFlowDots
            color="#0ea5e9"
            delayStep={0.48}
            duration={2.8}
            id="linear-output-current"
            points={outputPath}
          />
          <CurrentFlowDots
            color="#38bdf8"
            delayStep={0.65}
            duration={3.1}
            id="linear-ground-current"
            points={groundReturnPath}
          />
        </>
      )}
    </g>
  );
}

function Capacitor({
  side,
  label,
}: {
  side: "left" | "right";
  label: string;
}) {
  const cap = BASE_COMPONENT.capacitor[side];
  const labelPoint =
    side === "left"
      ? addPoint(BASE_COMPONENT.labels.leftCap, COMPONENT_OFFSET.leftCapLabel)
      : addPoint(BASE_COMPONENT.labels.rightCap, COMPONENT_OFFSET.rightCapLabel);

  return (
    <g>
      <line
        x1={cap.x - cap.plateW / 2}
        y1={cap.yTopPlate}
        x2={cap.x + cap.plateW / 2}
        y2={cap.yTopPlate}
        stroke={PATH.capacitor.stroke}
        strokeWidth={PATH.capacitor.strokeWidth}
      />

      <line
        x1={cap.x - cap.plateW / 2}
        y1={cap.yBottomPlate}
        x2={cap.x + cap.plateW / 2}
        y2={cap.yBottomPlate}
        stroke={PATH.capacitor.stroke}
        strokeWidth={PATH.capacitor.strokeWidth}
      />

      <text
        x={labelPoint.x}
        y={labelPoint.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.cap.fontSize}
        fontWeight={LABEL.cap.fontWeight}
        fill={LABEL.cap.fill}
      >
        {label}
      </text>
    </g>
  );
}

function VoltageRegulatorSymbol({
  regulatorLabel = "7805",
}: {
  regulatorLabel?: string;
}) {
  const r = BASE_COMPONENT.regulatorSymbol;
  const offset = COMPONENT_OFFSET.regulatorSymbol;

  const box = {
    x: r.x + offset.x,
    y: r.y + offset.y,
    w: r.w,
    h: r.h,
  };

  const title = addPoint(r.text.title, offset);
  const pin1 = addPoint(r.text.pin1, offset);
  const pin2 = addPoint(r.text.pin2, offset);
  const pin3 = addPoint(r.text.pin3, offset);

  return (
    <g>
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        fill={PATH.regulatorSymbol.fill}
        stroke={PATH.regulatorSymbol.stroke}
        strokeWidth={PATH.regulatorSymbol.strokeWidth}
      />

      <text
        x={title.x}
        y={title.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.regulatorTitle.fontSize}
        fontWeight={LABEL.regulatorTitle.fontWeight}
        fill={LABEL.regulatorTitle.fill}
      >
        {regulatorLabel}
      </text>

      <text
        x={pin1.x}
        y={pin1.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.regulatorPin.fontSize}
        fontWeight={LABEL.regulatorPin.fontWeight}
        fill={LABEL.regulatorPin.fill}
      >
        1
      </text>

      <text
        x={pin2.x}
        y={pin2.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.regulatorPin.fontSize}
        fontWeight={LABEL.regulatorPin.fontWeight}
        fill={LABEL.regulatorPin.fill}
      >
        2
      </text>

      <text
        x={pin3.x}
        y={pin3.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.regulatorPin.fontSize}
        fontWeight={LABEL.regulatorPin.fontWeight}
        fill={LABEL.regulatorPin.fill}
      >
        3
      </text>

      <text
        x={box.x + 16}
        y={box.y + box.h + 18}
        textAnchor="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={11}
        fontWeight={700}
        fill="#111111"
      >
        IN
      </text>

      <text
        x={box.x + box.w / 2}
        y={box.y + box.h + 18}
        textAnchor="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={11}
        fontWeight={700}
        fill="#111111"
      >
        GND
      </text>

      <text
        x={box.x + box.w - 16}
        y={box.y + box.h + 18}
        textAnchor="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={11}
        fontWeight={700}
        fill="#111111"
      >
        OUT
      </text>
    </g>
  );
}

function VoltageSourceSymbol({
  inputRangeLabel = "7.5V-35V DC",
}: {
  inputRangeLabel?: string;
}) {
  const source = BASE_COMPONENT.voltageSource;
  const center = addPoint(source.center, COMPONENT_OFFSET.voltageSource);
  const label = addPoint(source.label, COMPONENT_OFFSET.voltageSourceLabel);
  const value = addPoint(source.value, COMPONENT_OFFSET.voltageSourceValue);

  return (
    <g>
      <circle
        cx={center.x}
        cy={center.y}
        r={source.r}
        fill={PATH.voltageSource.fill}
        stroke={PATH.voltageSource.stroke}
        strokeWidth={PATH.voltageSource.strokeWidth}
      />

      <text
        x={center.x}
        y={center.y - 12}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.plusMinus.fontSize}
        fontWeight={LABEL.plusMinus.fontWeight}
        fill={LABEL.plusMinus.fill}
      >
        +
      </text>

      <text
        x={center.x}
        y={center.y + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.plusMinus.fontSize}
        fontWeight={LABEL.plusMinus.fontWeight}
        fill={LABEL.plusMinus.fill}
      >
        -
      </text>

      <text
        x={label.x}
        y={label.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.main.fontSize}
        fontWeight={LABEL.main.fontWeight}
        fill={LABEL.main.fill}
      >
        DC Source
      </text>

      <text
        x={value.x}
        y={value.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.small.fontSize}
        fontWeight={LABEL.small.fontWeight}
        fill={LABEL.small.fill}
      >
        {inputRangeLabel}
      </text>
    </g>
  );
}

function OutputLoadSymbol({
  outputVoltageLabel = "+5V DC",
}: {
  outputVoltageLabel?: string;
}) {
  const out = BASE_COMPONENT.output;
  const load = out.load;
  const offset = COMPONENT_OFFSET.outputLoad;

  const x = load.x + offset.x;
  const yTop = load.yTop + offset.y;
  const yBottom = load.yBottom + offset.y;

  const label = addPoint(out.label, COMPONENT_OFFSET.outputLabel);
  const value = addPoint(out.value, COMPONENT_OFFSET.outputValue);
  const loadLabel = addPoint(out.loadLabel, COMPONENT_OFFSET.loadLabel);

  return (
    <g>
      <path
        d={createZigzagPath({
          x,
          yTop,
          yBottom,
          width: load.zigzagWidth,
          steps: load.zigzagSteps,
        })}
        fill="none"
        stroke={PATH.load.stroke}
        strokeWidth={PATH.load.strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <text
        x={label.x}
        y={label.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.main.fontSize}
        fontWeight={LABEL.main.fontWeight}
        fill={LABEL.main.fill}
      >
        Regulated Output
      </text>

      <text
        x={value.x}
        y={value.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.small.fontSize}
        fontWeight={LABEL.small.fontWeight}
        fill={LABEL.small.fill}
      >
        {outputVoltageLabel}
      </text>

      <text
        x={loadLabel.x}
        y={loadLabel.y}
        textAnchor="start"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.small.fontSize}
        fontWeight={LABEL.small.fontWeight}
        fill={LABEL.small.fill}
      >
        Load
      </text>
    </g>
  );
}

function VoltageLabels({
  inputVoltageLabel = "VIN",
  outputVoltageLabel = "VOUT",
}: {
  inputVoltageLabel?: string;
  outputVoltageLabel?: string;
}) {
  const vin = addPoint(BASE_COMPONENT.labels.vin, COMPONENT_OFFSET.vinLabel);
  const vout = addPoint(BASE_COMPONENT.labels.vout, COMPONENT_OFFSET.voutLabel);

  return (
    <g
      fontFamily={LABEL.fontFamily}
      fontSize={LABEL.voltage.fontSize}
      fontWeight={LABEL.voltage.fontWeight}
      fill={LABEL.voltage.fill}
    >
      <text x={vin.x} y={vin.y} textAnchor="middle">
        {inputVoltageLabel}
      </text>

      <text x={vout.x} y={vout.y} textAnchor="middle">
        {outputVoltageLabel}
      </text>
    </g>
  );
}

function CircuitCore({
  currentStage = 0,
  inputRangeLabel = "7.5V-35V DC",
  inputVoltageLabel = "VIN",
  outputVoltageLabel = "VOUT",
  regulatorLabel = "7805",
}: {
  currentStage?: LinearCurrentStage;
  inputRangeLabel?: string;
  inputVoltageLabel?: string;
  outputVoltageLabel?: string;
  regulatorLabel?: string;
}) {
  const n = BASE_COMPONENT.nodes;
  const vs = BASE_COMPONENT.voltageSource;
  const out = BASE_COMPONENT.output;

  return (
    <g
      transform={`
        translate(${COMPONENT_OFFSET.wholeCircuit.x} ${COMPONENT_OFFSET.wholeCircuit.y})
        scale(${SCALE.component})
      `}
    >
      <WireBlock terminal="sourceTopLead" />
      <WireBlock terminal="sourceBottomLead" />

      <WireBlock terminal="inputBus" />
      <WireBlock terminal="outputBus" />
      <WireBlock terminal="groundBus" />

      <WireBlock terminal="inputPin" />
      <WireBlock terminal="groundPin" />
      <WireBlock terminal="outputPin" />

      <WireBlock terminal="leftCapTop" />
      <WireBlock terminal="leftCapBottom" />
      <WireBlock terminal="rightCapTop" />
      <WireBlock terminal="rightCapBottom" />

      <WireBlock terminal="outputLoadTop" />
      <WireBlock terminal="outputLoadBottom" />

      <Capacitor side="left" label="0.33µF" />
      <Capacitor side="right" label="0.1µF" />

      <JunctionDot {...vs.topTerminal} />
      <JunctionDot {...vs.bottomTerminal} />

      <JunctionDot {...n.inputBranchTop} />
      <JunctionDot {...n.inputBranchBottom} />
      <JunctionDot {...n.groundCenter} />
      <JunctionDot {...n.outputBranchTop} />
      <JunctionDot {...n.outputBranchBottom} />

      <JunctionDot {...out.topTerminal} />
      <JunctionDot {...out.bottomTerminal} />

      <VoltageSourceSymbol inputRangeLabel={inputRangeLabel} />
      <VoltageRegulatorSymbol regulatorLabel={regulatorLabel} />
      <OutputLoadSymbol outputVoltageLabel={outputVoltageLabel} />
      <VoltageLabels
        inputVoltageLabel={inputVoltageLabel}
        outputVoltageLabel={outputVoltageLabel}
      />
      <LinearCurrentFlow stage={currentStage} />
    </g>
  );
}

/* =========================================================
   REUSABLE COMPONENT
========================================================= */

export function Regulator7805CircuitSvg({
  className = "",
  currentStage = 0,
  inputRangeLabel = "7.5V-35V DC",
  inputVoltageLabel = "VIN",
  outputVoltageLabel = "VOUT",
  regulatorLabel = "7805",
}: {
  className?: string;
  currentStage?: LinearCurrentStage;
  inputRangeLabel?: string;
  inputVoltageLabel?: string;
  outputVoltageLabel?: string;
  regulatorLabel?: string;
}) {
  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
      role="img"
      aria-label="7805 voltage regulator circuit with DC voltage source and regulated 5V output"
      className={className}
    >
      <Canvas />

      <g
        transform={`
          translate(${COMPONENT_OFFSET.canvas.x} ${COMPONENT_OFFSET.canvas.y})
          scale(${SCALE.canvas})
        `}
      >
        <CircuitCore
          currentStage={currentStage}
          inputRangeLabel={inputRangeLabel}
          inputVoltageLabel={inputVoltageLabel}
          outputVoltageLabel={outputVoltageLabel}
          regulatorLabel={regulatorLabel}
        />
      </g>
    </svg>
  );
}

/* =========================================================
   NEXT.JS PAGE DEFAULT EXPORT
========================================================= */

export default function Regulator7805CircuitPage() {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <Regulator7805CircuitSvg
        className="w-full max-w-[590px] h-auto"
        currentStage={3}
        inputVoltageLabel="VIN 12.0V"
        outputVoltageLabel="VOUT 5.00V"
        regulatorLabel="7805"
      />
    </main>
  );
}
