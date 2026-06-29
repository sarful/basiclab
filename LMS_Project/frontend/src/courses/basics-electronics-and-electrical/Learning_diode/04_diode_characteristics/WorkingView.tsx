"use client";

import { motion } from "framer-motion";

import {
  BatterySymbol,
  getScaledBatteryLayout,
  getScaledDiodeLayout,
  getScaledLedLayout,
  LedSymbol,
  ScaledDiodeSymbol,
} from "../01_what_is_diode/CircuitPieces";
import { LedProfessionalGlow } from "../01_what_is_diode/LedProfessionalGlow";

import { getWorkingState } from "./logic";
import type { BiasMode } from "./types";

const VIEW_BOX = "0 0 760 330";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 330;

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
  activePositiveWire: "#dc2626",
  activeNegativeWire: "#111827",
  inactiveWire: "#94a3b8",
  currentDot: "#f97316",
  active: "#16a34a",
  danger: "#dc2626",
} as const;

const FLOW_STYLE = {
  minRadius: 3,
  maxRadiusBoost: 1.5,
  minDuration: 1.6,
  baseDuration: 5,
  speedBoost: 2.8,
  delays: [0, 0.7, 1.4, 2.1, 2.8],
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

const LABEL = {
  battery: { x: 95, y: 42 },
  currentPath: { x: 320, y: 40 },
  ledStatus: { x: 658, y: 96 },
} as const;

const STATUS_BADGE = {
  x: 245,
  y: 278,
  width: 270,
  height: 34,
  radius: 12,
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

  const opacity = 0.45 + level * 0.45;
  const radius = FLOW_STYLE.minRadius + level * FLOW_STYLE.maxRadiusBoost;

  const flowPoints = [
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

  return (
    <g aria-label="Conventional current flow">
      {FLOW_STYLE.delays.map((delay) => (
        <motion.circle
          key={delay}
          r={radius}
          fill={STYLE.currentDot}
          stroke="#ffffff"
          strokeWidth="1.3"
          initial={{
            cx: NODE.batteryTop.x,
            cy: NODE.batteryTop.y,
            opacity: 0,
          }}
          animate={{
            cx: flowPoints.map((point) => point.x),
            cy: flowPoints.map((point) => point.y),
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

function BlockedMark({
  isReverse,
  voltage,
}: {
  isReverse: boolean;
  voltage: number;
}) {
  const title = isReverse ? "REVERSE BLOCKED" : "BELOW 0.7V";
  const detail = isReverse
    ? "Reverse bias blocks the main current path"
    : `${voltage.toFixed(1)}V is below turn-on voltage`;

  return (
    <g>
      <rect
        x="238"
        y="28"
        width="210"
        height="92"
        rx="16"
        fill="#fee2e2"
        stroke={STYLE.danger}
        strokeWidth="2"
      />

      <line
        x1="300"
        y1="48"
        x2="350"
        y2="98"
        stroke={STYLE.danger}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="350"
        y1="48"
        x2="300"
        y2="98"
        stroke={STYLE.danger}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <text
        x="350"
        y="67"
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        fill={STYLE.danger}
      >
        {title}
      </text>

      <text
        x="350"
        y="89"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#7f1d1d"
      >
        {detail}
      </text>
    </g>
  );
}

export function WorkingView({
  bias,
  voltage,
}: {
  bias: BiasMode;
  voltage: number;
}) {
  const state = getWorkingState(bias, voltage);
  const isActive = state.isConducting;
  const intensity = clamp01(state.intensity);

  const positiveWireColor = isActive
    ? STYLE.activePositiveWire
    : STYLE.inactiveWire;

  const negativeWireColor = isActive
    ? STYLE.activeNegativeWire
    : STYLE.inactiveWire;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
      <svg
        viewBox={VIEW_BOX}
        className="h-auto min-h-[330px] w-full"
        role="img"
        aria-label="Diode working circuit view"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="760" height="330" fill="#ffffff" />

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

          <CurrentFlowDots active={isActive} intensity={intensity} />

          <BatterySymbol
            bias={bias}
            voltage={voltage}
            scale={CIRCUIT_COMPONENT_SCALE.battery}
          />

          <ScaledDiodeSymbol scale={CIRCUIT_COMPONENT_SCALE.diode} />

          <LedProfessionalGlow
            active={isActive}
            intensity={intensity}
            topTerminal={NODE.ledTop}
            bottomTerminal={NODE.ledBottom}
            gradientId="working-led-glow"
          />

          <LedSymbol
            active={isActive}
            brightness={intensity}
            scale={CIRCUIT_COMPONENT_SCALE.led}
          />

          {!isActive && (
            <BlockedMark isReverse={bias === "reverse"} voltage={voltage} />
          )}

          <rect
            x={STATUS_BADGE.x}
            y={STATUS_BADGE.y}
            width={STATUS_BADGE.width}
            height={STATUS_BADGE.height}
            rx={STATUS_BADGE.radius}
            fill={isActive ? "#dcfce7" : "#fee2e2"}
            stroke={isActive ? "#22c55e" : "#ef4444"}
          />

          <text
            x={STATUS_BADGE.x + STATUS_BADGE.width / 2}
            y={STATUS_BADGE.y + 22}
            textAnchor="middle"
            fontSize="15"
            fontWeight="900"
            fill={isActive ? "#15803d" : STYLE.danger}
          >
            I ≈ {state.currentMA.toFixed(1)} mA ·{" "}
            {isActive ? "CONDUCTING" : "BLOCKED"}
          </text>
        </g>
      </svg>
    </div>
  );
}
