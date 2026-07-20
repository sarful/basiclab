"use client";

import React from "react";

/* =========================================================
   LM317 ADJUSTABLE VOLTAGE REGULATOR CIRCUIT SVG
   React / Next.js / TypeScript / TailwindCSS
   Single File Component
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
  | "outputPin"
  | "adjustPin"
  | "inputCapTop"
  | "inputCapBottom"
  | "outputCapTop"
  | "outputCapBottom"
  | "r1Top"
  | "r1Bottom"
  | "r2Top"
  | "r2Bottom"
  | "outputLoadTop"
  | "outputLoadBottom";

export type CurrentFlowStage = 0 | 1 | 2 | 3;

const MIN_R2_OHMS = 120;
const MAX_R2_OHMS = 2200;

function normalizeR2(value: number) {
  return Math.min(
    1,
    Math.max(0, (value - MIN_R2_OHMS) / (MAX_R2_OHMS - MIN_R2_OHMS)),
  );
}

/* =========================================================
   GLOBAL CONSTANTS
========================================================= */

export const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 760,
  h: 540,
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

  // Extra top margin added to stop title cropping
  wholeCircuit: { x: 0, y: 30 },

  voltageSource: { x: 0, y: 0 },
  voltageSourceLabel: { x: 0, y: 0 },
  voltageSourceValue: { x: 0, y: 0 },

  regulatorSymbol: { x: 0, y: 0 },

  inputCapLabel: { x: 0, y: 0 },
  outputCapLabel: { x: 0, y: 0 },

  r1Label: { x: 0, y: 0 },
  r2Label: { x: 0, y: 0 },

  outputLoad: { x: 0, y: 0 },
  outputLabel: { x: 0, y: 0 },
  outputValue: { x: 0, y: 0 },
  loadLabel: { x: 0, y: 0 },

  vinLabel: { x: 0, y: 0 },
  voutLabel: { x: 0, y: 0 },
  formulaLabel: { x: 0, y: 0 },
};

export const WIRE_OFFSET: Record<TerminalKey, Point> = {
  sourceTopLead: { x: 0, y: 0 },
  sourceBottomLead: { x: 0, y: 0 },

  inputBus: { x: 0, y: 0 },
  outputBus: { x: 0, y: 0 },
  groundBus: { x: 0, y: 0 },

  inputPin: { x: 0, y: 0 },
  outputPin: { x: 0, y: 0 },
  adjustPin: { x: 0, y: 0 },

  inputCapTop: { x: 0, y: 0 },
  inputCapBottom: { x: 0, y: 0 },

  outputCapTop: { x: 0, y: 0 },
  outputCapBottom: { x: 0, y: 0 },

  r1Top: { x: 0, y: 0 },
  r1Bottom: { x: 0, y: 0 },

  r2Top: { x: 0, y: 0 },
  r2Bottom: { x: 0, y: 0 },

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
  outputPin: { x: 0, y: 0 },
  adjustPin: { x: 0, y: 0 },

  inputCapTop: { x: 0, y: 0 },
  inputCapBottom: { x: 0, y: 0 },

  outputCapTop: { x: 0, y: 0 },
  outputCapBottom: { x: 0, y: 0 },

  r1Top: { x: 0, y: 0 },
  r1Bottom: { x: 0, y: 0 },

  r2Top: { x: 0, y: 0 },
  r2Bottom: { x: 0, y: 0 },

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
    center: { x: 70, y: 260 },
    r: 32,

    topTerminal: { x: 70, y: 160 },
    bottomTerminal: { x: 70, y: 400 },

    label: { x: 70, y: 70 },
    value: { x: 70, y: 435 },
  },

  regulatorSymbol: {
    x: 265,
    y: 95,
    w: 120,
    h: 82,

    pins: {
      input: {
        x: 285,
        yTop: 177,
        yBus: 160,
      },
      output: {
        x: 365,
        yTop: 177,
        yBus: 160,
      },
      adjust: {
        x: 325,
        yTop: 177,
        yBus: 260,
      },
    },

    text: {
      title: { x: 325, y: 122 },
      input: { x: 285, y: 154 },
      adjust: { x: 325, y: 154 },
      output: { x: 365, y: 154 },
    },
  },

  nodes: {
    inputBranchTop: { x: 160, y: 160 },
    inputBranchBottom: { x: 160, y: 400 },

    outputBranchTop: { x: 455, y: 160 },
    outputBranchBottom: { x: 455, y: 400 },

    adjustNode: { x: 325, y: 260 },
    r1TopNode: { x: 405, y: 160 },

    groundCenter: { x: 325, y: 400 },
  },

  capacitor: {
    input: {
      x: 160,
      yTopPlate: 250,
      yBottomPlate: 265,
      plateW: 36,
    },

    output: {
      x: 455,
      yTopPlate: 250,
      yBottomPlate: 265,
      plateW: 36,
    },
  },

  resistor: {
    r1: {
      x: 405,
      yTop: 185,
      yBottom: 240,
      zigzagWidth: 18,
      zigzagSteps: 6,
    },

    r2: {
      x: 325,
      yTop: 285,
      yBottom: 370,
      zigzagWidth: 18,
      zigzagSteps: 8,
      arrowStart: { x: 355, y: 315 },
      arrowEnd: { x: 335, y: 340 },
    },
  },

  output: {
    topTerminal: { x: 610, y: 160 },
    bottomTerminal: { x: 610, y: 400 },

    load: {
      x: 610,
      yTop: 215,
      yBottom: 345,
      zigzagWidth: 18,
      zigzagSteps: 9,
    },

    label: { x: 610, y: 70 },
    value: { x: 610, y: 435 },
    loadLabel: { x: 640, y: 280 },
  },

  labels: {
    vin: { x: 115, y: 138 },
    vout: { x: 530, y: 138 },

    inputCap: { x: 200, y: 242 },
    outputCap: { x: 495, y: 242 },

    // Small R1 label added because formula uses R1
    r1: { x: 430, y: 210 },
    r2: { x: 270, y: 325 },

    formula: { x: 330, y: 455 },
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

  resistor: {
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
    fontSize: 27,
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
    fontSize: 12,
    fontWeight: 700,
  },

  cap: {
    fill: "#111111",
    fontSize: 15,
    fontWeight: 700,
  },

  formula: {
    fill: "#111111",
    fontSize: 16,
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

  for (let i = 1; i <= steps; i += 1) {
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
  const r = BASE_COMPONENT.regulatorSymbol;
  const c = BASE_COMPONENT.capacitor;
  const res = BASE_COMPONENT.resistor;
  const out = BASE_COMPONENT.output;
  const n = BASE_COMPONENT.nodes;

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
        id: "output-bus-regulator-to-output",
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
          { x: r.pins.input.x, y: r.pins.input.yBus },
          WIRE_OFFSET.inputPin,
        ),
        to: addPoint(
          { x: r.pins.input.x, y: r.pins.input.yTop },
          WIRE_OFFSET.inputPin,
        ),
      },
    ],

    outputPin: [
      {
        id: "output-pin-wire",
        from: addPoint(
          { x: r.pins.output.x, y: r.pins.output.yBus },
          WIRE_OFFSET.outputPin,
        ),
        to: addPoint(
          { x: r.pins.output.x, y: r.pins.output.yTop },
          WIRE_OFFSET.outputPin,
        ),
      },
    ],

    adjustPin: [
      {
        id: "adjust-pin-wire",
        from: addPoint(
          { x: r.pins.adjust.x, y: r.pins.adjust.yTop },
          WIRE_OFFSET.adjustPin,
        ),
        to: addPoint(
          { x: r.pins.adjust.x, y: r.pins.adjust.yBus },
          WIRE_OFFSET.adjustPin,
        ),
      },
    ],

    inputCapTop: [
      {
        id: "input-cap-top-wire",
        from: addPoint({ x: c.input.x, y: 160 }, WIRE_OFFSET.inputCapTop),
        to: addPoint(
          { x: c.input.x, y: c.input.yTopPlate },
          WIRE_OFFSET.inputCapTop,
        ),
      },
    ],

    inputCapBottom: [
      {
        id: "input-cap-bottom-wire",
        from: addPoint(
          { x: c.input.x, y: c.input.yBottomPlate },
          WIRE_OFFSET.inputCapBottom,
        ),
        to: addPoint({ x: c.input.x, y: 400 }, WIRE_OFFSET.inputCapBottom),
      },
    ],

    outputCapTop: [
      {
        id: "output-cap-top-wire",
        from: addPoint({ x: c.output.x, y: 160 }, WIRE_OFFSET.outputCapTop),
        to: addPoint(
          { x: c.output.x, y: c.output.yTopPlate },
          WIRE_OFFSET.outputCapTop,
        ),
      },
    ],

    outputCapBottom: [
      {
        id: "output-cap-bottom-wire",
        from: addPoint(
          { x: c.output.x, y: c.output.yBottomPlate },
          WIRE_OFFSET.outputCapBottom,
        ),
        to: addPoint({ x: c.output.x, y: 400 }, WIRE_OFFSET.outputCapBottom),
      },
    ],

    r1Top: [
      {
        id: "r1-top-wire",
        from: addPoint({ x: res.r1.x, y: 160 }, WIRE_OFFSET.r1Top),
        to: addPoint({ x: res.r1.x, y: res.r1.yTop }, WIRE_OFFSET.r1Top),
      },
    ],

    r1Bottom: [
      {
        id: "r1-bottom-diagonal-wire",
        from: addPoint({ x: res.r1.x, y: res.r1.yBottom }, WIRE_OFFSET.r1Bottom),
        to: addPoint(n.adjustNode, WIRE_OFFSET.r1Bottom),
      },
    ],

    r2Top: [
      {
        id: "r2-top-wire",
        from: addPoint(n.adjustNode, WIRE_OFFSET.r2Top),
        to: addPoint({ x: res.r2.x, y: res.r2.yTop }, WIRE_OFFSET.r2Top),
      },
    ],

    r2Bottom: [
      {
        id: "r2-bottom-wire",
        from: addPoint(
          { x: res.r2.x, y: res.r2.yBottom },
          WIRE_OFFSET.r2Bottom,
        ),
        to: addPoint({ x: res.r2.x, y: 400 }, WIRE_OFFSET.r2Bottom),
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
  const path = pointsToPath(points);

  return (
    <g>
      {[0, 1, 2].map((dot) => (
        <circle
          key={`${id}-current-dot-${dot}`}
          r={5}
          fill={color}
          opacity={0.9}
          stroke="#ffffff"
          strokeWidth={1.5}
        >
          <animateMotion
            begin={`${dot * delayStep}s`}
            dur={`${duration}s`}
            path={path}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.2;0.95;0.95;0.2"
            dur={`${duration}s`}
            begin={`${dot * delayStep}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

function RegulatorCurrentFlow({ stage }: { stage: CurrentFlowStage }) {
  if (stage === 0) return null;

  const vs = BASE_COMPONENT.voltageSource;
  const r = BASE_COMPONENT.regulatorSymbol;
  const res = BASE_COMPONENT.resistor;
  const out = BASE_COMPONENT.output;
  const n = BASE_COMPONENT.nodes;

  const inputPath = [
    vs.topTerminal,
    n.inputBranchTop,
    { x: r.pins.input.x, y: r.pins.input.yBus },
    { x: r.pins.input.x, y: r.pins.input.yTop },
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
    n.groundCenter,
    vs.bottomTerminal,
  ];
  const adjustPath = [
    { x: res.r1.x, y: res.r1.yBottom },
    n.adjustNode,
    { x: res.r2.x, y: res.r2.yTop },
    { x: res.r2.x, y: res.r2.yBottom },
    { x: res.r2.x, y: 400 },
    n.groundCenter,
  ];

  return (
    <g aria-label="Animated current flow dots">
      <CurrentFlowDots color="#ef4444" id="input-current" points={inputPath} />
      {stage >= 2 && (
        <CurrentFlowDots
          color="#22c55e"
          delayStep={0.6}
          duration={3}
          id="adjust-current"
          points={adjustPath}
        />
      )}
      {stage >= 3 && (
        <>
          <CurrentFlowDots
            color="#0ea5e9"
            delayStep={0.48}
            duration={2.8}
            id="output-current"
            points={outputPath}
          />
          <CurrentFlowDots
            color="#38bdf8"
            delayStep={0.65}
            duration={3.1}
            id="ground-return-current"
            points={groundReturnPath}
          />
        </>
      )}
    </g>
  );
}

function Capacitor({
  type,
  label,
}: {
  type: "input" | "output";
  label: string;
}) {
  const cap = BASE_COMPONENT.capacitor[type];
  const labelPoint =
    type === "input"
      ? addPoint(BASE_COMPONENT.labels.inputCap, COMPONENT_OFFSET.inputCapLabel)
      : addPoint(BASE_COMPONENT.labels.outputCap, COMPONENT_OFFSET.outputCapLabel);

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

function Resistor({
  type,
  label,
  adjustable = false,
  r2Ohms = 1000,
}: {
  type: "r1" | "r2";
  label?: string;
  adjustable?: boolean;
  r2Ohms?: number;
}) {
  const resistor = BASE_COMPONENT.resistor[type];
  const r2Position = normalizeR2(r2Ohms);
  const dynamicArrowEnd =
    adjustable && type === "r2"
      ? {
          x: resistor.x + 10,
          y: resistor.yTop + 12 + r2Position * (resistor.yBottom - resistor.yTop - 24),
        }
      : "arrowEnd" in resistor
        ? resistor.arrowEnd
        : null;
  const dynamicArrowStart = dynamicArrowEnd
    ? {
        x: dynamicArrowEnd.x + 24,
        y: dynamicArrowEnd.y - 28,
      }
    : null;
  const labelPoint =
    type === "r1"
      ? addPoint(BASE_COMPONENT.labels.r1, COMPONENT_OFFSET.r1Label)
      : addPoint(BASE_COMPONENT.labels.r2, COMPONENT_OFFSET.r2Label);

  return (
    <g>
      <path
        d={createZigzagPath({
          x: resistor.x,
          yTop: resistor.yTop,
          yBottom: resistor.yBottom,
          width: resistor.zigzagWidth,
          steps: resistor.zigzagSteps,
        })}
        fill="none"
        stroke={PATH.resistor.stroke}
        strokeWidth={PATH.resistor.strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {adjustable && dynamicArrowStart && dynamicArrowEnd && (
        <g>
          <line
            x1={dynamicArrowStart.x}
            y1={dynamicArrowStart.y}
            x2={dynamicArrowEnd.x}
            y2={dynamicArrowEnd.y}
            stroke={PATH.resistor.stroke}
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          <path
            d={`
              M ${dynamicArrowEnd.x} ${dynamicArrowEnd.y}
              L ${dynamicArrowEnd.x + 9} ${dynamicArrowEnd.y - 2}
              L ${dynamicArrowEnd.x + 2} ${dynamicArrowEnd.y - 9}
              Z
            `}
            fill={PATH.resistor.stroke}
          />
        </g>
      )}

      {label && (
        <text
          x={labelPoint.x}
          y={labelPoint.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily={LABEL.fontFamily}
          fontSize={LABEL.small.fontSize}
          fontWeight={LABEL.small.fontWeight}
          fill={LABEL.small.fill}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function VoltageRegulatorSymbol({
  regulatorLabel = "LM317",
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
  const input = addPoint(r.text.input, offset);
  const adjust = addPoint(r.text.adjust, offset);
  const output = addPoint(r.text.output, offset);

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
        x={input.x}
        y={input.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.regulatorPin.fontSize}
        fontWeight={LABEL.regulatorPin.fontWeight}
        fill={LABEL.regulatorPin.fill}
      >
        IN
      </text>

      <text
        x={adjust.x}
        y={adjust.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.regulatorPin.fontSize}
        fontWeight={LABEL.regulatorPin.fontWeight}
        fill={LABEL.regulatorPin.fill}
      >
        ADJ
      </text>

      <text
        x={output.x}
        y={output.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.regulatorPin.fontSize}
        fontWeight={LABEL.regulatorPin.fontWeight}
        fill={LABEL.regulatorPin.fill}
      >
        OUT
      </text>
    </g>
  );
}

function VoltageSourceSymbol() {
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
        VIN DC
      </text>
    </g>
  );
}

function OutputLoadSymbol({
  outputVoltageLabel = "VOUT Adjustable",
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
        Adjustable Output
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

function FormulaLabel() {
  const point = addPoint(BASE_COMPONENT.labels.formula, COMPONENT_OFFSET.formulaLabel);

  return (
    <text
      x={point.x}
      y={point.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={LABEL.fontFamily}
      fontSize={LABEL.formula.fontSize}
      fontWeight={LABEL.formula.fontWeight}
      fill={LABEL.formula.fill}
    >
      VOUT = 1.25 x (1 + R2 / R1)
    </text>
  );
}

function CircuitCore({
  currentStage = 0,
  inputVoltageLabel = "VIN",
  outputVoltageLabel = "VOUT Adjustable",
  r2Ohms = 1000,
  regulatorLabel = "LM317",
}: {
  currentStage?: CurrentFlowStage;
  inputVoltageLabel?: string;
  outputVoltageLabel?: string;
  r2Ohms?: number;
  regulatorLabel?: string;
}) {
  const vs = BASE_COMPONENT.voltageSource;
  const n = BASE_COMPONENT.nodes;
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
      <WireBlock terminal="outputPin" />
      <WireBlock terminal="adjustPin" />

      <WireBlock terminal="inputCapTop" />
      <WireBlock terminal="inputCapBottom" />

      <WireBlock terminal="outputCapTop" />
      <WireBlock terminal="outputCapBottom" />

      <WireBlock terminal="r1Top" />
      <WireBlock terminal="r1Bottom" />
      <WireBlock terminal="r2Top" />
      <WireBlock terminal="r2Bottom" />

      <WireBlock terminal="outputLoadTop" />
      <WireBlock terminal="outputLoadBottom" />

      <Capacitor type="input" label="0.1µF" />
      <Capacitor type="output" label="1µF" />

      <Resistor type="r1" label="R1" />
      <Resistor type="r2" label="R2 ADJ" adjustable r2Ohms={r2Ohms} />

      <JunctionDot {...vs.topTerminal} />
      <JunctionDot {...vs.bottomTerminal} />

      <JunctionDot {...n.inputBranchTop} />
      <JunctionDot {...n.inputBranchBottom} />
      <JunctionDot {...n.outputBranchTop} />
      <JunctionDot {...n.outputBranchBottom} />
      <JunctionDot {...n.adjustNode} />
      <JunctionDot {...n.r1TopNode} />
      <JunctionDot {...n.groundCenter} />

      <JunctionDot {...out.topTerminal} />
      <JunctionDot {...out.bottomTerminal} />

      <VoltageSourceSymbol />
      <VoltageRegulatorSymbol regulatorLabel={regulatorLabel} />
      <OutputLoadSymbol outputVoltageLabel={outputVoltageLabel} />
      <VoltageLabels
        inputVoltageLabel={inputVoltageLabel}
        outputVoltageLabel={outputVoltageLabel}
      />
      <FormulaLabel />
      <RegulatorCurrentFlow stage={currentStage} />
    </g>
  );
}

/* =========================================================
   REUSABLE COMPONENT
========================================================= */

export function AdjustableRegulatorLM317CircuitSvg({
  className = "",
  currentStage = 0,
  inputVoltageLabel = "VIN",
  outputVoltageLabel = "VOUT Adjustable",
  r2Ohms = 1000,
  regulatorLabel = "LM317",
}: {
  className?: string;
  currentStage?: CurrentFlowStage;
  inputVoltageLabel?: string;
  outputVoltageLabel?: string;
  r2Ohms?: number;
  regulatorLabel?: string;
}) {
  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
      role="img"
      aria-label={`${regulatorLabel} adjustable voltage regulator circuit with resistor divider and adjustable output`}
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
          inputVoltageLabel={inputVoltageLabel}
          outputVoltageLabel={outputVoltageLabel}
          r2Ohms={r2Ohms}
          regulatorLabel={regulatorLabel}
        />
      </g>
    </svg>
  );
}

/* =========================================================
   NEXT.JS PAGE DEFAULT EXPORT
========================================================= */

export default function AdjustableRegulatorLM317CircuitPage() {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <AdjustableRegulatorLM317CircuitSvg
        className="w-full max-w-[760px] h-auto"
        currentStage={3}
        inputVoltageLabel="VIN 12.0V"
        outputVoltageLabel="VOUT 6.46V"
        r2Ohms={1000}
        regulatorLabel="LM317"
      />
    </main>
  );
}
