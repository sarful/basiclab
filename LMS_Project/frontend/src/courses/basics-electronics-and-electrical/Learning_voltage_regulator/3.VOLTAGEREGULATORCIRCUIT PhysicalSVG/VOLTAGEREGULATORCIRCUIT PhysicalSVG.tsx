"use client";

import React from "react";

/* =========================================================
   7805 VOLTAGE REGULATOR CIRCUIT SVG
   React / Next.js / TypeScript / TailwindCSS
   Single File Component
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
  | "vinPositive"
  | "vinNegative"
  | "voutPositive"
  | "voutNegative"
  | "inputBus"
  | "outputBus"
  | "groundBus"
  | "inputPin"
  | "groundPin"
  | "outputPin"
  | "leftCapTop"
  | "leftCapBottom"
  | "rightCapTop"
  | "rightCapBottom";

export type PhysicalCurrentStage = 0 | 1 | 2 | 3;

/* =========================================================
   GLOBAL CONSTANTS
========================================================= */

export const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 570,
  h: 351,
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

  regulator: { x: 0, y: 0 },

  vinLabel: { x: 0, y: 0 },
  voutLabel: { x: 0, y: 0 },

  leftCap: { x: 0, y: 0 },
  rightCap: { x: 0, y: 0 },

  leftCapLabel: { x: 0, y: 0 },
  rightCapLabel: { x: 0, y: 0 },
};

export const WIRE_OFFSET: Record<TerminalKey, Point> = {
  vinPositive: { x: 0, y: 0 },
  vinNegative: { x: 0, y: 0 },
  voutPositive: { x: 0, y: 0 },
  voutNegative: { x: 0, y: 0 },

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
};

export const DEBUG_TERMINAL_OFFSET: Record<TerminalKey, Point> = {
  vinPositive: { x: 0, y: 0 },
  vinNegative: { x: 0, y: 0 },
  voutPositive: { x: 0, y: 0 },
  voutNegative: { x: 0, y: 0 },

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
  regulator: {
    tab: {
      x: 246,
      y: 6,
      w: 72,
      h: 50,
    },
    hole: {
      x: 282,
      y: 25,
      r: 10,
    },
    body: {
      x: 242,
      y: 55,
      w: 80,
      h: 48,
    },
    pins: {
      input: {
        x: 264,
        y1: 103,
        y2: 191,
      },
      ground: {
        x: 282,
        y1: 103,
        y2: 333,
      },
      output: {
        x: 300,
        y1: 103,
        y2: 191,
      },
    },
  },

  nodes: {
    vinTop: { x: 43, y: 191 },
    vinBottom: { x: 43, y: 333 },

    voutTop: { x: 522, y: 191 },
    voutBottom: { x: 522, y: 333 },

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
    vin: { x: 43, y: 268 },
    vout: { x: 526, y: 268 },

    leftCap: { x: 197, y: 242 },
    rightCap: { x: 458, y: 242 },
  },
};

/* =========================================================
   STYLE CONSTANTS
========================================================= */

export const NODE = {
  openRadius: 8,
  junctionRadius: 5,
  debugRadius: 4,
};

export const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  color: "#1d39d5",
  red: "#e11d1d",
  green: "#22c55e",
  black: "#111111",
};

export const PATH = {
  regulator: {
    tabFill: "#bfbfbf",
    tabStroke: "#b8b8b8",
    bodyFill: "#111111",
    bodyStroke: "#111111",
    pinFill: "#bfbfbf",
  },
  capacitor: {
    stroke: "#e11d1d",
    strokeWidth: 3,
  },
  arrow: {
    stroke: "#e11d1d",
    strokeWidth: 3,
  },
};

export const LABEL = {
  fontFamily:
    "Arial, Helvetica, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

  black: {
    fill: "#111111",
    fontSize: 31,
    fontWeight: 500,
  },

  plusMinus: {
    fill: "#111111",
    fontSize: 26,
    fontWeight: 700,
  },

  cap: {
    fill: "#22c55e",
    fontSize: 15,
    fontWeight: 700,
  },

  regulator: {
    fill: "#ffffff",
    fontSize: 22,
    fontWeight: 500,
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

/* =========================================================
   WIRE SEGMENTS
========================================================= */

export const createWireSegments = (): Record<TerminalKey, WireSegment[]> => {
  const n = BASE_COMPONENT.nodes;
  const r = BASE_COMPONENT.regulator;
  const c = BASE_COMPONENT.capacitor;

  return {
    vinPositive: [
      {
        id: "vin-positive-terminal",
        from: addPoint(n.vinTop, WIRE_OFFSET.vinPositive),
        to: addPoint({ x: 95, y: 191 }, WIRE_OFFSET.vinPositive),
      },
    ],

    vinNegative: [
      {
        id: "vin-negative-terminal",
        from: addPoint(n.vinBottom, WIRE_OFFSET.vinNegative),
        to: addPoint({ x: 95, y: 333 }, WIRE_OFFSET.vinNegative),
      },
    ],

    voutPositive: [
      {
        id: "vout-positive-terminal",
        from: addPoint({ x: 480, y: 191 }, WIRE_OFFSET.voutPositive),
        to: addPoint(n.voutTop, WIRE_OFFSET.voutPositive),
      },
    ],

    voutNegative: [
      {
        id: "vout-negative-terminal",
        from: addPoint({ x: 480, y: 333 }, WIRE_OFFSET.voutNegative),
        to: addPoint(n.voutBottom, WIRE_OFFSET.voutNegative),
      },
    ],

    inputBus: [
      {
        id: "input-bus",
        from: addPoint(n.vinTop, WIRE_OFFSET.inputBus),
        to: addPoint({ x: r.pins.input.x, y: 191 }, WIRE_OFFSET.inputBus),
      },
    ],

    outputBus: [
      {
        id: "output-bus",
        from: addPoint({ x: r.pins.output.x, y: 191 }, WIRE_OFFSET.outputBus),
        to: addPoint(n.voutTop, WIRE_OFFSET.outputBus),
      },
    ],

    groundBus: [
      {
        id: "ground-bus",
        from: addPoint(n.vinBottom, WIRE_OFFSET.groundBus),
        to: addPoint(n.voutBottom, WIRE_OFFSET.groundBus),
      },
    ],

    inputPin: [
      {
        id: "input-pin-wire",
        from: addPoint(
          { x: r.pins.input.x, y: r.pins.input.y1 },
          WIRE_OFFSET.inputPin,
        ),
        to: addPoint(
          { x: r.pins.input.x, y: r.pins.input.y2 },
          WIRE_OFFSET.inputPin,
        ),
      },
    ],

    groundPin: [
      {
        id: "ground-pin-wire",
        from: addPoint(
          { x: r.pins.ground.x, y: r.pins.ground.y1 },
          WIRE_OFFSET.groundPin,
        ),
        to: addPoint(
          { x: r.pins.ground.x, y: r.pins.ground.y2 },
          WIRE_OFFSET.groundPin,
        ),
      },
    ],

    outputPin: [
      {
        id: "output-pin-wire",
        from: addPoint(
          { x: r.pins.output.x, y: r.pins.output.y1 },
          WIRE_OFFSET.outputPin,
        ),
        to: addPoint(
          { x: r.pins.output.x, y: r.pins.output.y2 },
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
  };
};

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function SvgDefs() {
  return (
    <defs>
      <marker
        id="arrow-red"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={WIRE.red} />
      </marker>
    </defs>
  );
}

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
            stroke="#ef4444"
            strokeWidth={1.5}
          />
        ))}
    </g>
  );
}

function OpenTerminal({ x, y }: Point) {
  return (
    <circle
      cx={x}
      cy={y}
      r={NODE.openRadius}
      fill="#ffffff"
      stroke={WIRE.color}
      strokeWidth={3}
    />
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

function PhysicalCurrentFlow({ stage }: { stage: PhysicalCurrentStage }) {
  if (stage === 0) return null;

  const n = BASE_COMPONENT.nodes;
  const r = BASE_COMPONENT.regulator;
  const c = BASE_COMPONENT.capacitor;

  const inputPath = [
    n.vinTop,
    n.inputBranchTop,
    { x: r.pins.input.x, y: 191 },
    { x: r.pins.input.x, y: r.pins.input.y2 },
    { x: r.pins.input.x, y: r.pins.input.y1 },
  ];
  const inputCapPath = [
    n.inputBranchTop,
    { x: c.left.x, y: c.left.yTopPlate },
    { x: c.left.x, y: c.left.yBottomPlate },
    n.inputBranchBottom,
  ];
  const groundPath = [
    { x: r.pins.ground.x, y: r.pins.ground.y1 },
    { x: r.pins.ground.x, y: r.pins.ground.y2 },
    n.groundCenter,
    n.vinBottom,
  ];
  const outputPath = [
    { x: r.pins.output.x, y: r.pins.output.y1 },
    { x: r.pins.output.x, y: r.pins.output.y2 },
    { x: r.pins.output.x, y: 191 },
    n.outputBranchTop,
    n.voutTop,
  ];
  const outputCapReturnPath = [
    n.voutTop,
    n.outputBranchTop,
    { x: c.right.x, y: c.right.yTopPlate },
    { x: c.right.x, y: c.right.yBottomPlate },
    n.outputBranchBottom,
    n.voutBottom,
  ];

  return (
    <g aria-label="Animated physical regulator current flow dots">
      <CurrentFlowDots color="#ef4444" id="physical-input-current" points={inputPath} />
      <CurrentFlowDots
        color="#f97316"
        delayStep={0.7}
        duration={3}
        id="physical-input-cap-current"
        points={inputCapPath}
      />
      {stage >= 2 && (
        <CurrentFlowDots
          color="#22c55e"
          delayStep={0.6}
          duration={2.9}
          id="physical-ground-current"
          points={groundPath}
        />
      )}
      {stage >= 3 && (
        <>
          <CurrentFlowDots
            color="#0ea5e9"
            delayStep={0.48}
            duration={2.8}
            id="physical-output-current"
            points={outputPath}
          />
          <CurrentFlowDots
            color="#38bdf8"
            delayStep={0.65}
            duration={3.1}
            id="physical-output-cap-return-current"
            points={outputCapReturnPath}
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

function Regulator7805({
  regulatorLabel = "7805",
}: {
  regulatorLabel?: string;
}) {
  const r = BASE_COMPONENT.regulator;
  const offset = COMPONENT_OFFSET.regulator;

  const tab = {
    x: r.tab.x + offset.x,
    y: r.tab.y + offset.y,
    w: r.tab.w,
    h: r.tab.h,
  };

  const body = {
    x: r.body.x + offset.x,
    y: r.body.y + offset.y,
    w: r.body.w,
    h: r.body.h,
  };

  return (
    <g>
      <path
        d={`
          M ${tab.x + 12} ${tab.y}
          H ${tab.x + tab.w - 12}
          L ${tab.x + tab.w} ${tab.y + 18}
          V ${tab.y + tab.h}
          H ${tab.x}
          V ${tab.y + 18}
          Z
        `}
        fill={PATH.regulator.tabFill}
        stroke={PATH.regulator.tabStroke}
        strokeWidth={1}
      />

      <circle
        cx={r.hole.x + offset.x}
        cy={r.hole.y + offset.y}
        r={r.hole.r}
        fill="#ffffff"
      />

      <rect
        x={body.x}
        y={body.y}
        width={body.w}
        height={body.h}
        fill={PATH.regulator.bodyFill}
      />

      <text
        x={body.x + body.w / 2}
        y={body.y + 27}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.regulator.fontSize}
        fontWeight={LABEL.regulator.fontWeight}
        fill={LABEL.regulator.fill}
      >
        {regulatorLabel}
      </text>

      {["input", "ground", "output"].map((pin) => {
        const p = r.pins[pin as "input" | "ground" | "output"];

        return (
          <rect
            key={pin}
            x={p.x - 5 + offset.x}
            y={body.y + body.h}
            width={10}
            height={24}
            fill={PATH.regulator.pinFill}
          />
        );
      })}
    </g>
  );
}

function PlusMinusLabels() {
  return (
    <g
      fontFamily={LABEL.fontFamily}
      fontSize={LABEL.plusMinus.fontSize}
      fontWeight={LABEL.plusMinus.fontWeight}
      fill={LABEL.plusMinus.fill}
    >
      <text x={18} y={198} textAnchor="middle">
        +
      </text>
      <text x={18} y={340} textAnchor="middle">
        -
      </text>

      <text x={544} y={198} textAnchor="middle">
        +
      </text>
      <text x={544} y={340} textAnchor="middle">
        -
      </text>
    </g>
  );
}

function VoltageArrows() {
  return (
    <g stroke={WIRE.red} strokeWidth={3} fill="none" strokeLinecap="round">
      <line
        x1={43}
        y1={250}
        x2={43}
        y2={215}
        markerEnd="url(#arrow-red)"
      />
      <line
        x1={43}
        y1={282}
        x2={43}
        y2={317}
        markerEnd="url(#arrow-red)"
      />

      <line
        x1={522}
        y1={250}
        x2={522}
        y2={215}
        markerEnd="url(#arrow-red)"
      />
      <line
        x1={522}
        y1={282}
        x2={522}
        y2={317}
        markerEnd="url(#arrow-red)"
      />
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
      fontSize={LABEL.black.fontSize}
      fontWeight={LABEL.black.fontWeight}
      fill={LABEL.black.fill}
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
  inputVoltageLabel = "VIN",
  outputVoltageLabel = "VOUT",
  regulatorLabel = "7805",
}: {
  currentStage?: PhysicalCurrentStage;
  inputVoltageLabel?: string;
  outputVoltageLabel?: string;
  regulatorLabel?: string;
}) {
  const n = BASE_COMPONENT.nodes;

  return (
    <g
      transform={`
        translate(${COMPONENT_OFFSET.wholeCircuit.x} ${COMPONENT_OFFSET.wholeCircuit.y})
        scale(${SCALE.component})
      `}
    >
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

      <Capacitor side="left" label="0.33µF" />
      <Capacitor side="right" label="0.1µF" />

      <JunctionDot {...n.inputBranchTop} />
      <JunctionDot {...n.inputBranchBottom} />
      <JunctionDot {...n.groundCenter} />
      <JunctionDot {...n.outputBranchTop} />
      <JunctionDot {...n.outputBranchBottom} />

      <OpenTerminal {...n.vinTop} />
      <OpenTerminal {...n.vinBottom} />
      <OpenTerminal {...n.voutTop} />
      <OpenTerminal {...n.voutBottom} />

      <Regulator7805 regulatorLabel={regulatorLabel} />

      <PlusMinusLabels />
      <VoltageArrows />
      <VoltageLabels
        inputVoltageLabel={inputVoltageLabel}
        outputVoltageLabel={outputVoltageLabel}
      />
      <PhysicalCurrentFlow stage={currentStage} />
    </g>
  );
}

/* =========================================================
   REUSABLE COMPONENT
========================================================= */

export function Regulator7805CircuitSvg({
  className = "",
  currentStage = 0,
  inputVoltageLabel = "VIN",
  outputVoltageLabel = "VOUT",
  regulatorLabel = "7805",
}: {
  className?: string;
  currentStage?: PhysicalCurrentStage;
  inputVoltageLabel?: string;
  outputVoltageLabel?: string;
  regulatorLabel?: string;
}) {
  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
      role="img"
      aria-label="7805 voltage regulator circuit with input and output capacitors"
      className={className}
    >
      <SvgDefs />
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
        className="w-full max-w-[570px] h-auto"
        currentStage={3}
        inputVoltageLabel="VIN 12.0V"
        outputVoltageLabel="VOUT 5.00V"
        regulatorLabel="7805"
      />
    </main>
  );
}
