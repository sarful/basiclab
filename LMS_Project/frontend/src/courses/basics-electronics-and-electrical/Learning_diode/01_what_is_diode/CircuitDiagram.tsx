"use client";

import { motion } from "framer-motion";
import {
  BatterySymbol,
  getScaledBatteryLayout,
  getScaledDiodeLayout,
  getScaledLedLayout,
  LedSymbol,
  ScaledDiodeSymbol,
} from "./CircuitPieces";
import { DiodeJunctionState } from "./DiodeJunctionState";
import { LedProfessionalGlow } from "./LedProfessionalGlow";
import { getBlockedState, getLedState } from "./logic";
import type { BiasMode } from "./types";

const VIEW_BOX = "0 0 760 465";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 465;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 2,
  diode: 2,
  led: 2,
} as const;

const BASE_WIRE_WIDTH = 2.25;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  positiveWire: "#dc2626",
  negativeWire: "#111827",
  inactiveWire: "#94a3b8",
  currentDot: "#f97316",
  active: "#16a34a",
  danger: "#dc2626",
} as const;

const FLOW_STYLE = {
  minRadius: 4,
  minDuration: 1.5,
  baseDuration: 4.8,
  speedBoost: 2.6,
  delays: [0, 0.7, 1.4, 2.1],
} as const;

const DIODE_JUNCTION_STATE_PLACEMENT = {
  left: 100,
  right: 0,
  top: 150,
  bottom: 0,
} as const;

type Point = { x: number; y: number };

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

const LAYOUT = {
  battery: getScaledBatteryLayout(CIRCUIT_COMPONENT_SCALE.battery),
  diode: getScaledDiodeLayout(CIRCUIT_COMPONENT_SCALE.diode),
  led: getScaledLedLayout(CIRCUIT_COMPONENT_SCALE.led),
} as const;

const NODE = {
  batteryTop: LAYOUT.battery.topTerminal,
  batteryBottom: LAYOUT.battery.bottomTerminal,

  diodeLeft: LAYOUT.diode.leftTerminal,
  diodeRight: LAYOUT.diode.rightTerminal,

  ledTop: LAYOUT.led.topTerminal,
  ledBottom: LAYOUT.led.bottomTerminal,

  topWireY: 70,
  bottomWireY: 245,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  positivePath: [
    NODE.batteryTop,
    { x: NODE.batteryTop.x, y: NODE.topWireY },
    { x: NODE.diodeLeft.x, y: NODE.topWireY },
    { x: NODE.diodeRight.x, y: NODE.topWireY },
    { x: NODE.ledTop.x, y: NODE.topWireY },
    NODE.ledTop,
  ],

  negativePath: [
    NODE.ledBottom,
    { x: NODE.ledBottom.x, y: NODE.bottomWireY },
    { x: NODE.batteryBottom.x, y: NODE.bottomWireY },
    NODE.batteryBottom,
  ],
} as const;

const FLOW_PATH: Point[] = [
  NODE.batteryTop,
  { x: NODE.batteryTop.x, y: NODE.topWireY },
  { x: NODE.diodeLeft.x, y: NODE.topWireY },
  { x: NODE.diodeRight.x, y: NODE.topWireY },
  { x: NODE.ledTop.x, y: NODE.topWireY },
  NODE.ledTop,
  NODE.ledBottom,
  { x: NODE.ledBottom.x, y: NODE.bottomWireY },
  { x: NODE.batteryBottom.x, y: NODE.bottomWireY },
  NODE.batteryBottom,
];

const LABEL = {
  battery: { x: 95, y: 42 },
  currentPath: { x: 335, y: 40 },
  ledStatus: { x: 658, y: 96 },
} as const;

const BLOCKED_BADGE = {
  x: 248,
  y: 28,
  width: 190,
  height: 92,
  radius: 14,
  centerX: 343,
} as const;

const LEGEND = {
  box: { x: 55, y: 402, width: 350, height: 48, radius: 16 },
  dot: { x: 88, y: 426 },
  text: { x: 108, y: 432 },
  status: { x: 660, y: 432 },
} as const;

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

function WirePath({
  points,
  stroke,
}: {
  points: readonly Point[];
  stroke: string;
}) {
  return (
    <path
      d={pathD(points)}
      fill="none"
      stroke={stroke}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function CurrentFlowDots({
  active,
  intensity,
}: {
  active: boolean;
  intensity: number;
}) {
  if (!active) return null;

  const level = clamp01(intensity);
  const duration = Math.max(
    FLOW_STYLE.minDuration,
    FLOW_STYLE.baseDuration - level * FLOW_STYLE.speedBoost,
  );
  const opacity = 0.42 + level * 0.42;

  return (
    <g aria-label="Voltage-driven charge flow along the conventional current path">
      {FLOW_STYLE.delays.map((delay) => (
        <motion.circle
          key={delay}
          r={FLOW_STYLE.minRadius}
          fill={STYLE.currentDot}
          stroke="#ffffff"
          strokeWidth="1.5"
          initial={{
            cx: NODE.batteryTop.x,
            cy: NODE.batteryTop.y,
            opacity: 0,
          }}
          animate={{
            cx: FLOW_PATH.map((point) => point.x),
            cy: FLOW_PATH.map((point) => point.y),
            opacity: [
              0,
              opacity,
              opacity,
              opacity,
              opacity,
              opacity,
              opacity,
              opacity,
              opacity,
              0,
            ],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </g>
  );
}

function BlockedIndicator({
  bias,
  voltage,
}: {
  bias: BiasMode;
  voltage: number;
}) {
  const blockedState = getBlockedState(bias, voltage);

  if (!blockedState) return null;

  return (
    <g>
      <rect
        x={BLOCKED_BADGE.x}
        y={BLOCKED_BADGE.y}
        width={BLOCKED_BADGE.width}
        height={BLOCKED_BADGE.height}
        rx={BLOCKED_BADGE.radius}
        fill="#fee2e2"
        stroke={STYLE.danger}
        strokeWidth="2"
      />

      <line
        x1="302"
        y1="48"
        x2="350"
        y2="96"
        stroke={STYLE.danger}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <line
        x1="350"
        y1="48"
        x2="302"
        y2="96"
        stroke={STYLE.danger}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <text
        x={BLOCKED_BADGE.centerX}
        y="67"
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        fill={STYLE.danger}
      >
        {blockedState.title}
      </text>

      <text
        x={BLOCKED_BADGE.centerX}
        y="88"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#7f1d1d"
      >
        {blockedState.detail}
      </text>
    </g>
  );
}

function Legend({ active }: { active: boolean }) {
  return (
    <g>
      <rect
        x={LEGEND.box.x}
        y={LEGEND.box.y}
        width={LEGEND.box.width}
        height={LEGEND.box.height}
        rx={LEGEND.box.radius}
        fill="#f8fafc"
        stroke="#e2e8f0"
      />

      <circle
        cx={LEGEND.dot.x}
        cy={LEGEND.dot.y}
        r="7"
        fill={STYLE.currentDot}
      />

      <text
        x={LEGEND.text.x}
        y={LEGEND.text.y}
        fontSize="16"
        fontWeight="800"
        fill="#334155"
      >
        Conventional current path: + to -
      </text>

      <text
        x={LEGEND.status.x}
        y={LEGEND.status.y}
        textAnchor="middle"
        fontSize="20"
        fontWeight="900"
        fill={active ? STYLE.active : STYLE.danger}
      >
        {active ? "CONDUCTING" : "BLOCKED"}
      </text>
    </g>
  );
}

export function CircuitDiagram({
  bias,
  voltage,
}: {
  bias: BiasMode;
  voltage: number;
}) {
  const led = getLedState(bias, voltage);
  const isActive = led.isConducting;

  const diodeJunctionStateOffsetX =
    DIODE_JUNCTION_STATE_PLACEMENT.right - DIODE_JUNCTION_STATE_PLACEMENT.left;

  const diodeJunctionStateOffsetY =
    DIODE_JUNCTION_STATE_PLACEMENT.bottom - DIODE_JUNCTION_STATE_PLACEMENT.top;

  const positiveWireColor = isActive ? STYLE.positiveWire : STYLE.inactiveWire;

  const negativeWireColor = isActive ? STYLE.negativeWire : STYLE.inactiveWire;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <svg
        viewBox={VIEW_BOX}
        className="h-auto min-h-[380px] w-full"
        role="img"
        aria-labelledby="diode-circuit-title diode-circuit-desc"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="diode-circuit-title">Diode LED circuit visualizer</title>
        <desc id="diode-circuit-desc">
          The voltage slider controls how strongly charge moves around the
          conventional current path through the diode and LED circuit.
        </desc>

        <rect width="760" height="465" fill="#ffffff" />

        <g transform={canvasTransform}>
          <text
            x={LABEL.battery.x}
            y={LABEL.battery.y}
            fontSize="16"
            fontWeight="900"
            fill={STYLE.danger}
          >
            Battery {bias === "forward" ? "+" : "-"}
          </text>

          <text
            x={LABEL.currentPath.x}
            y={LABEL.currentPath.y}
            fontSize="16"
            fontWeight="900"
            fill={STYLE.currentDot}
          >
            Conventional Current Path
          </text>

          <text
            x={LABEL.ledStatus.x}
            y={LABEL.ledStatus.y}
            textAnchor="middle"
            fontSize="17"
            fontWeight="900"
            fill={isActive ? STYLE.active : STYLE.muted}
          >
            LED {isActive ? "ON" : "OFF"}
          </text>

          <WirePath points={WIRE.positivePath} stroke={positiveWireColor} />
          <WirePath points={WIRE.negativePath} stroke={negativeWireColor} />

          <CurrentFlowDots active={isActive} intensity={led.currentLevel} />

          <LedProfessionalGlow
            active={isActive}
            intensity={led.currentLevel}
            topTerminal={NODE.ledTop}
            bottomTerminal={NODE.ledBottom}
            gradientId="lesson-one-led-glow"
          />

          <BatterySymbol
            bias={bias}
            voltage={voltage}
            scale={CIRCUIT_COMPONENT_SCALE.battery}
          />

          <ScaledDiodeSymbol scale={CIRCUIT_COMPONENT_SCALE.diode} />

          <LedSymbol
            active={isActive}
            brightness={led.currentLevel}
            scale={CIRCUIT_COMPONENT_SCALE.led}
          />

          <DiodeJunctionState
            bias={bias}
            active={isActive}
            currentLevel={led.currentLevel}
            offsetX={diodeJunctionStateOffsetX}
            offsetY={diodeJunctionStateOffsetY}
          />

          {!isActive && <BlockedIndicator bias={bias} voltage={voltage} />}

          <Legend active={isActive} />
        </g>
      </svg>
    </div>
  );
}
