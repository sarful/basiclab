// components/Relay3D.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

/* =========================
   TYPES
========================= */
type XY = { x: number; y: number };

type Segment = {
  id: string;
  from: XY;
  to: XY;
  dashed?: boolean;
  color?: string;
  width?: number;
  opacity?: number;
};

type TerminalId = "NC" | "A1" | "COM" | "NO" | "A2";

type Relay3DProps = {
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

/* =========================
   VIEW_BOX
========================= */
const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 430,
  h: 470,
};

/* =========================
   SCALE
========================= */
const SCALE = {
  CIRCUIT_COMPONENT_SCALE: 1,
  CIRCUIT_CANVAS_SCALE: 1,
  CIRCUIT_WIRE_SCALE: 1,
  CURRENT_DOT_SCALE: 1,
};

/* =========================
   REQUIRED CONTROL VARIABLES
========================= */
const BASE_WIRE_WIDTH = 4;

const CIRCUIT_COMPONENT_SCALE = SCALE.CIRCUIT_COMPONENT_SCALE;
const CIRCUIT_CANVAS_SCALE = SCALE.CIRCUIT_CANVAS_SCALE;
const CIRCUIT_WIRE_SCALE = SCALE.CIRCUIT_WIRE_SCALE;

const COMPONENT_OFFSET = {
  body: { x: 0, y: 0 },
  nc: { x: 0, y: 0 },
  a1: { x: 0, y: 0 },
  com: { x: 0, y: 0 },
  no: { x: 0, y: 0 },
  a2: { x: 0, y: 0 },
  labels: { x: 0, y: 0 },
  internalWires: { x: 0, y: 0 },
};

const WIRE_OFFSET = {
  body: { x: 0, y: 0 },
  terminal: { x: 0, y: 0 },
  internal: { x: 0, y: 0 },
};

const DEBUG_TERMINAL_OFFSET = {
  x: 0,
  y: 0,
};

/* =========================
   STYLE CONSTANTS
========================= */
const COLOR = {
  black: "#050505",
  white: "#ffffff",
  muted: "#9ca3af",
  bodyFill: "#ffffff",
  coilActive: "#2563eb",
  contactActive: "#16a34a",
  warning: "#f59e0b",
  softGreen: "#dcfce7",
  softBlue: "#dbeafe",
  debug: "#ef4444",
};

/* =========================
   NODE
========================= */
const NODE = {
  r: 4,
  fill: COLOR.black,

  body: {
    topLeft: { x: 18, y: 190 },
    topBack: { x: 210, y: 84 },
    topRight: { x: 392, y: 150 },
    topFront: { x: 188, y: 258 },
    leftBottom: { x: 26, y: 402 },
    frontBottom: { x: 196, y: 460 },
    rightBottom: { x: 396, y: 327 },
  },

  terminal: {
    NC: { x: 60, y: 125 },
    A1: { x: 188, y: 48 },
    COM: { x: 277, y: 58 },
    NO: { x: 200, y: 170 },
    A2: { x: 330, y: 102 },
  },
};

/* =========================
   WIRE
========================= */
const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  activeWidth: 5 * CIRCUIT_WIRE_SCALE,
  color: COLOR.black,
  dash: "8 8",

  bodySegments: [
    {
      id: "top-left-edge",
      from: NODE.body.topLeft,
      to: NODE.body.topBack,
    },
    {
      id: "top-right-edge",
      from: NODE.body.topBack,
      to: NODE.body.topRight,
    },
    {
      id: "top-front-left-edge",
      from: NODE.body.topLeft,
      to: NODE.body.topFront,
    },
    {
      id: "top-front-right-edge",
      from: NODE.body.topFront,
      to: NODE.body.topRight,
    },
    {
      id: "left-vertical-edge",
      from: NODE.body.topLeft,
      to: NODE.body.leftBottom,
    },
    {
      id: "left-bottom-edge",
      from: NODE.body.leftBottom,
      to: NODE.body.frontBottom,
    },
    {
      id: "front-vertical-edge",
      from: NODE.body.topFront,
      to: NODE.body.frontBottom,
    },
    {
      id: "right-bottom-edge",
      from: NODE.body.frontBottom,
      to: NODE.body.rightBottom,
    },
    {
      id: "right-vertical-edge",
      from: NODE.body.topRight,
      to: NODE.body.rightBottom,
    },
  ] satisfies Segment[],
};

/* =========================
   PATH
========================= */
const PATH = {
  stroke: COLOR.black,
  fill: COLOR.white,
  strokeWidth: BASE_WIRE_WIDTH,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,

  body: {
    top: "M 18 190 L 210 84 L 392 150 L 188 258 Z",
    left: "M 18 190 L 188 258 L 196 460 L 26 402 Z",
    right: "M 188 258 L 392 150 L 396 327 L 196 460 Z",
    frontEdge: "M 188 258 L 196 460",
    topEdge: "M 18 190 L 188 258 L 392 150",
  },
};

/* =========================
   LABEL
========================= */
const LABEL = {
  className: "fill-black text-[31px] font-semibold select-none",
  smallClassName: "fill-black text-[15px] font-bold select-none",

  terminal: {
    NC: { x: 33, y: 111, text: "NC" },
    A1: { x: 166, y: 41, text: "A1" },
    COM: { x: 235, y: 50, text: "COM" },
    NO: { x: 174, y: 162, text: "NO" },
    A2: { x: 314, y: 89, text: "A2" },
  },
};

/* =========================
   BASE_COMPONENT
========================= */
const BASE_COMPONENT = {
  body: {
    top: PATH.body.top,
    left: PATH.body.left,
    right: PATH.body.right,
    frontEdge: PATH.body.frontEdge,
    topEdge: PATH.body.topEdge,
    x: 0,
    y: 0,
    width: 430,
    height: 470,
    scale: 1,
    rotation: 0,
  },

  terminals: {
    NC: { x: NODE.terminal.NC.x, y: NODE.terminal.NC.y, h: 58 },
    A1: { x: NODE.terminal.A1.x, y: NODE.terminal.A1.y, h: 58 },
    COM: { x: NODE.terminal.COM.x, y: NODE.terminal.COM.y, h: 58 },
    NO: { x: NODE.terminal.NO.x, y: NODE.terminal.NO.y, h: 62 },
    A2: { x: NODE.terminal.A2.x, y: NODE.terminal.A2.y, h: 58 },
  },
};

/* =========================
   COMPONENT
========================= */
const COMPONENT = {
  body: {
    x: BASE_COMPONENT.body.x,
    y: BASE_COMPONENT.body.y,
    width: BASE_COMPONENT.body.width,
    height: BASE_COMPONENT.body.height,
    scale: BASE_COMPONENT.body.scale,
    rotation: BASE_COMPONENT.body.rotation,
  },

  terminals: {
    NC: {
      x: BASE_COMPONENT.terminals.NC.x,
      y: BASE_COMPONENT.terminals.NC.y,
      width: 12,
      height: BASE_COMPONENT.terminals.NC.h,
      scale: 1,
      rotation: 0,
    },
    A1: {
      x: BASE_COMPONENT.terminals.A1.x,
      y: BASE_COMPONENT.terminals.A1.y,
      width: 12,
      height: BASE_COMPONENT.terminals.A1.h,
      scale: 1,
      rotation: 0,
    },
    COM: {
      x: BASE_COMPONENT.terminals.COM.x,
      y: BASE_COMPONENT.terminals.COM.y,
      width: 12,
      height: BASE_COMPONENT.terminals.COM.h,
      scale: 1,
      rotation: 0,
    },
    NO: {
      x: BASE_COMPONENT.terminals.NO.x,
      y: BASE_COMPONENT.terminals.NO.y,
      width: 12,
      height: BASE_COMPONENT.terminals.NO.h,
      scale: 1,
      rotation: 0,
    },
    A2: {
      x: BASE_COMPONENT.terminals.A2.x,
      y: BASE_COMPONENT.terminals.A2.y,
      width: 12,
      height: BASE_COMPONENT.terminals.A2.h,
      scale: 1,
      rotation: 0,
    },
  },
};

/* =========================
   TIMELINE
========================= */
const TIMELINE_STEPS = [
  "Power condition selected",
  "A1/A2 coil state updated",
  "Armature moves internally",
  "COM contact changes path",
  "Relay output state confirmed",
];

/* =========================
   HELPERS
========================= */
function move(p: XY, o: XY): XY {
  return { x: p.x + o.x, y: p.y + o.y };
}

function terminalTop(id: TerminalId): XY {
  const base = BASE_COMPONENT.terminals[id];
  return { x: base.x, y: base.y };
}

function terminalBottom(id: TerminalId): XY {
  const base = BASE_COMPONENT.terminals[id];
  return { x: base.x, y: base.y + base.h };
}

function createPath(points: XY[]): string {
  return points
    .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
}

/* =========================
   REUSABLE SVG: WIRE SEGMENT
========================= */
function WireSegment({
  from,
  to,
  dashed = false,
  color = WIRE.color,
  width = WIRE.width,
  opacity = 1,
}: Omit<Segment, "id">) {
  const a = move(from, WIRE_OFFSET.internal);
  const b = move(to, WIRE_OFFSET.internal);

  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? WIRE.dash : undefined}
      opacity={opacity}
    />
  );
}

/* =========================
   REUSABLE SVG: CURRENT DOT FLOW
========================= */
function CurrentDots({
  path,
  active,
  show,
  speed,
  count = 4,
  radius = 4,
  color = COLOR.contactActive,
  opacity = 0.95,
}: {
  path: string;
  active: boolean;
  show: boolean;
  speed: number;
  count?: number;
  radius?: number;
  color?: string;
  opacity?: number;
}) {
  if (!active || !show) return null;

  const safeSpeed = Math.max(0.3, speed);
  const duration = Math.max(0.75, 2.8 / safeSpeed);

  return (
    <g pointerEvents="none">
      {Array.from({ length: count }).map((_, index) => (
        <circle
          key={`${path}-${index}`}
          r={radius * SCALE.CURRENT_DOT_SCALE}
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
   REUSABLE SVG: DEBUG DOT
========================= */
function DebugDot({
  at,
  label,
  show,
}: {
  at: XY;
  label: string;
  show: boolean;
}) {
  if (!show) return null;

  const p = move(at, DEBUG_TERMINAL_OFFSET);

  return (
    <g pointerEvents="none">
      <circle cx={p.x} cy={p.y} r={NODE.r} fill={NODE.fill} />
      <text
        x={p.x + 7}
        y={p.y - 7}
        className="fill-black text-[11px] font-semibold"
      >
        {label}
      </text>
    </g>
  );
}

/* =========================
   REUSABLE SVG: LABEL TEXT
========================= */
function LabelText({
  x,
  y,
  active = false,
  muted = false,
  children,
}: {
  x: number;
  y: number;
  active?: boolean;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      className={LABEL.className}
      fill={active ? COLOR.contactActive : muted ? COLOR.muted : COLOR.black}
    >
      {children}
    </text>
  );
}

/* =========================
   REUSABLE SVG: RELAY BODY
========================= */
function RelayBody() {
  return (
    <g
      transform={`translate(${COMPONENT_OFFSET.body.x}, ${COMPONENT_OFFSET.body.y})`}
    >
      <path d={BASE_COMPONENT.body.top} {...PATH} />
      <path d={BASE_COMPONENT.body.left} {...PATH} />
      <path d={BASE_COMPONENT.body.right} {...PATH} />

      <path
        d={BASE_COMPONENT.body.frontEdge}
        fill="none"
        stroke="black"
        strokeWidth={BASE_WIRE_WIDTH}
      />

      <path
        d={BASE_COMPONENT.body.topEdge}
        fill="none"
        stroke="black"
        strokeWidth={BASE_WIRE_WIDTH}
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG: TERMINAL
========================= */
function Terminal({
  id,
  base,
  offset,
  active = false,
  muted = false,
  showDebug = false,
}: {
  id: TerminalId;
  base: { x: number; y: number; h: number };
  offset: XY;
  active?: boolean;
  muted?: boolean;
  showDebug?: boolean;
}) {
  const x = base.x + offset.x + WIRE_OFFSET.terminal.x;
  const y = base.y + offset.y + WIRE_OFFSET.terminal.y;
  const h = base.h;

  const stroke = active
    ? COLOR.contactActive
    : muted
      ? COLOR.muted
      : COLOR.black;
  const fill = active ? COLOR.softGreen : COLOR.white;

  return (
    <g>
      <rect
        x={x - 6}
        y={y}
        width={12}
        height={h}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={active ? 5 : 4}
      />

      <line
        x1={x}
        y1={y + 5}
        x2={x}
        y2={y + h - 5}
        stroke={stroke}
        strokeWidth={3}
      />

      <DebugDot at={{ x, y }} label={id} show={showDebug} />
    </g>
  );
}

/* =========================
   REUSABLE SVG: INTERNAL RELAY PATH
========================= */
function InternalRelayPaths({
  energized,
  speed,
  showCurrentDots,
}: {
  energized: boolean;
  speed: number;
  showCurrentDots: boolean;
}) {
  const comPoint = terminalBottom("COM");
  const ncPoint = terminalBottom("NC");
  const noPoint = terminalBottom("NO");
  const a1Point = terminalBottom("A1");
  const a2Point = terminalBottom("A2");

  const coilMidA: XY = { x: 240, y: 150 };
  const coilMidB: XY = { x: 300, y: 150 };

  const contactPath = energized
    ? createPath([comPoint, { x: 258, y: 190 }, noPoint])
    : createPath([comPoint, { x: 230, y: 188 }, ncPoint]);

  const coilPath = createPath([a1Point, coilMidA, coilMidB, a2Point]);

  return (
    <g
      transform={`translate(${COMPONENT_OFFSET.internalWires.x}, ${COMPONENT_OFFSET.internalWires.y})`}
    >
      {/* Coil path A1 -> A2 */}
      <path
        d={coilPath}
        fill="none"
        stroke={energized ? COLOR.coilActive : COLOR.black}
        strokeWidth={energized ? WIRE.activeWidth : WIRE.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 7"
        opacity={0.95}
      />

      {/* Contact path COM -> NC/NO */}
      <path
        d={contactPath}
        fill="none"
        stroke={COLOR.contactActive}
        strokeWidth={WIRE.activeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
      />

      {/* Open terminal hint */}
      <path
        d={
          energized
            ? createPath([comPoint, { x: 230, y: 188 }, ncPoint])
            : createPath([comPoint, { x: 258, y: 190 }, noPoint])
        }
        fill="none"
        stroke={COLOR.muted}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 8"
        opacity={0.45}
      />

      <CurrentDots
        path={coilPath}
        active={energized}
        show={showCurrentDots}
        speed={speed}
        count={4}
        radius={3.6}
        color={COLOR.coilActive}
        opacity={0.9}
      />

      <CurrentDots
        path={contactPath}
        active={showCurrentDots}
        show={showCurrentDots}
        speed={speed}
        count={5}
        radius={3.8}
        color={COLOR.contactActive}
        opacity={0.95}
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG: STRUCTURED BODY WIRES
========================= */
function StructuredWireSegments() {
  return (
    <g opacity={0}>
      {WIRE.bodySegments.map((s: Segment) => (
        <WireSegment
          key={s.id}
          from={move(s.from, WIRE_OFFSET.body)}
          to={move(s.to, WIRE_OFFSET.body)}
          dashed={s.dashed}
          color={s.color}
          width={s.width}
          opacity={s.opacity}
        />
      ))}

      <WireSegment
        from={NODE.body.topFront}
        to={NODE.body.frontBottom}
        dashed
        color={WIRE.color}
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG: RELAY TERMINALS
========================= */
function RelayTerminals({
  energized,
  showDebug,
}: {
  energized: boolean;
  showDebug: boolean;
}) {
  const t = BASE_COMPONENT.terminals;

  return (
    <g>
      <Terminal
        id="NC"
        base={t.NC}
        offset={COMPONENT_OFFSET.nc}
        active={!energized}
        muted={energized}
        showDebug={showDebug}
      />

      <Terminal
        id="A1"
        base={t.A1}
        offset={COMPONENT_OFFSET.a1}
        active={energized}
        showDebug={showDebug}
      />

      <Terminal
        id="COM"
        base={t.COM}
        offset={COMPONENT_OFFSET.com}
        active
        showDebug={showDebug}
      />

      <Terminal
        id="NO"
        base={t.NO}
        offset={COMPONENT_OFFSET.no}
        active={energized}
        muted={!energized}
        showDebug={showDebug}
      />

      <Terminal
        id="A2"
        base={t.A2}
        offset={COMPONENT_OFFSET.a2}
        active={energized}
        showDebug={showDebug}
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG: RELAY LABELS
========================= */
function RelayLabels({ energized }: { energized: boolean }) {
  return (
    <g
      transform={`translate(${COMPONENT_OFFSET.labels.x}, ${COMPONENT_OFFSET.labels.y})`}
    >
      <LabelText
        x={LABEL.terminal.NC.x}
        y={LABEL.terminal.NC.y}
        active={!energized}
        muted={energized}
      >
        NC
      </LabelText>

      <LabelText
        x={LABEL.terminal.A1.x}
        y={LABEL.terminal.A1.y}
        active={energized}
      >
        A1
      </LabelText>

      <LabelText x={LABEL.terminal.COM.x} y={LABEL.terminal.COM.y} active>
        COM
      </LabelText>

      <LabelText
        x={LABEL.terminal.NO.x}
        y={LABEL.terminal.NO.y}
        active={energized}
        muted={!energized}
      >
        NO
      </LabelText>

      <LabelText
        x={LABEL.terminal.A2.x}
        y={LABEL.terminal.A2.y}
        active={energized}
      >
        A2
      </LabelText>
    </g>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function Relay3D({
  className = "",
  title = "Interactive 3D relay with COM NO NC A1 A2",
  initialPowered = false,
  autoStart = false,
  simulationSpeed = 1,
  showControls = true,
  showTimeline = true,
  showCurrentDots: showCurrentDotsProp = true,
  showDebugTerminals = false,
}: Relay3DProps) {
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

  const status = useMemo(() => {
    if (energized) {
      return {
        title: "POWER ON CONDITION",
        badge: "POWER ON",
        path: "COM → NO",
        coil: "A1/A2 coil energized",
        closed: "COM connected to NO",
        open: "NC open",
        detail: "COM terminal is connected to NO terminal.",
      };
    }

    return {
      title: "POWER OFF CONDITION",
      badge: "POWER OFF",
      path: "COM → NC",
      coil: "A1/A2 coil de-energized",
      closed: "COM connected to NC",
      open: "NO open",
      detail: "COM terminal is connected to NC terminal.",
    };
  }, [energized]);

  const activeStepText =
    simulationStep > 0
      ? TIMELINE_STEPS[simulationStep - 1]
      : "Power OFF condition selected";

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
      <div className="w-full overflow-x-auto bg-white p-4">
        <svg
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
          className="h-auto w-full max-w-[430px]"
          role="img"
          aria-label={title}
          style={{
            transform: `scale(${CIRCUIT_CANVAS_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <title>{title}</title>

          <g transform={`scale(${CIRCUIT_COMPONENT_SCALE})`}>
            <RelayLabels energized={energized} />
            <RelayBody />

            <InternalRelayPaths
              energized={energized}
              speed={speed}
              showCurrentDots={showCurrentDots}
            />

            <RelayTerminals
              energized={energized}
              showDebug={showDebugTerminals}
            />

            <StructuredWireSegments />
          </g>
        </svg>
      </div>

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

                <p className="mt-1 text-xs font-medium text-neutral-500">
                  {status.detail}
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
                COM → NC CLOSED
              </p>

              <p className="text-xs font-semibold text-neutral-500">NO OPEN</p>
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
                COM → NO CLOSED
              </p>

              <p className="text-xs font-semibold text-neutral-500">NC OPEN</p>
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
