"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { clamp, formatNumber, formatResistance } from "./logic";
import type { Mode } from "./types";

type PotentiometerVisualProps = {
  mode: Mode;
  supplyVoltage: number;
  totalResistance: number;
  wiperPercent: number;
  terminal1Voltage: number;
  terminal3Voltage: number;
  wiperVoltage: number;
};

const VIEW_BOX = "0 0 780 360";
const VIEW_BOX_WIDTH = 780;
const VIEW_BOX_HEIGHT = 360;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  body: 1,
  track: 1,
  levelBar: 1,
} as const;

const BASE_WIRE_WIDTH = 7;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#334155",
  muted: "#475569",
  wire: "#64748b",
  trackBase: "#94a3b8",
  activeTrack: "#8b5cf6",
  body: "#f8fafc",
  chamber: "#f5f3ff",
  chamberStroke: "#c4b5fd",
  electron: "#0ea5e9",
  terminal1: "#2563eb",
  terminal3: "#16a34a",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

function scaleComponent(component: ComponentBox, scale: number): ComponentBox {
  const width = component.width * scale;
  const height = component.height * scale;

  return {
    ...component,
    x: component.x - (width - component.width) / 2,
    y: component.y - (height - component.height) / 2,
    width,
    height,
  };
}

function pointOnComponent(
  component: ComponentBox,
  xRatio: number,
  yRatio: number,
): Point {
  return {
    x: component.x + component.width * xRatio,
    y: component.y + component.height * yRatio,
  };
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  body: {
    x: 180,
    y: 125,
    width: 420,
    height: 86,
    rotate: 0,
  },

  track: {
    x: 220,
    y: 168,
    width: 300,
    height: 18,
    rotate: 0,
  },

  levelBar: {
    x: 110,
    y: 304,
    width: 560,
    height: 12,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  body: scaleComponent(BASE_COMPONENT.body, CIRCUIT_COMPONENT_SCALE.body),
  track: scaleComponent(BASE_COMPONENT.track, CIRCUIT_COMPONENT_SCALE.track),
  levelBar: scaleComponent(
    BASE_COMPONENT.levelBar,
    CIRCUIT_COMPONENT_SCALE.levelBar,
  ),
} as const;

const NODE = {
  terminal1: { x: 90, y: 168 },
  terminal3: { x: 690, y: 168 },

  trackLeft: pointOnComponent(COMPONENT.track, 0, 0),
  trackRight: pointOnComponent(COMPONENT.track, 1, 0),

  wiperTop: (wiperX: number): Point => ({ x: wiperX, y: 38 }),
  wiperKnob: (wiperX: number): Point => ({ x: wiperX, y: 68 }),
  wiperContact: (wiperX: number): Point => ({ x: wiperX, y: 168 }),

  leftLeadEnd: { x: 220, y: 168 },
  rightLeadStart: { x: 520, y: 168 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  terminal1Wire: [NODE.leftLeadEnd, NODE.terminal1],
  terminal3Wire: [NODE.rightLeadStart, NODE.terminal3],

  wiperWire: (wiperX: number): Point[] => [
    NODE.wiperKnob(wiperX),
    NODE.wiperTop(wiperX),
  ],
} as const;

const LABEL = {
  title: { x: 390, y: 28 },

  terminal1: { x: 220, y: 240 },
  terminal1Voltage: { x: 220, y: 257 },

  terminal3: { x: 520, y: 240 },
  terminal3Voltage: { x: 520, y: 257 },

  wiperVoltage: { y: 27 },

  r1: { x: 300, y: 205 },
  r2: { x: 445, y: 205 },

  levelTitle: { x: 0, y: 0 },
  current: { x: 0, y: 52 },
  totalResistance: { x: 190, y: 52 },
  wiperPercent: { x: 390, y: 52 },
} as const;

function WirePath({
  points,
  width = WIRE.width,
}: {
  points: readonly Point[];
  width?: number;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function PotentiometerBody() {
  return (
    <g>
      <rect
        x={COMPONENT.body.x}
        y={COMPONENT.body.y}
        width={COMPONENT.body.width}
        height={COMPONENT.body.height}
        rx={COMPONENT.body.height / 2}
        fill={STYLE.body}
        stroke="#111827"
        strokeWidth="3"
      />

      <rect
        x="210"
        y="145"
        width="330"
        height="46"
        rx="23"
        fill={STYLE.chamber}
        stroke={STYLE.chamberStroke}
        strokeWidth="2"
      />

      <line
        x1="220"
        y1="168"
        x2="520"
        y2="168"
        stroke={STYLE.trackBase}
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.55"
      />
    </g>
  );
}

function ActiveTrack({ wiperX }: { wiperX: number }) {
  return (
    <motion.line
      x1="220"
      y1="168"
      x2={wiperX}
      y2="168"
      stroke={STYLE.activeTrack}
      strokeWidth="18"
      strokeLinecap="round"
      animate={{ opacity: [0.65, 0.95, 0.65] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function TrackTicks() {
  return (
    <g>
      {Array.from({ length: 13 }).map((_, index) => {
        const tickX = 220 + index * 25;

        return (
          <line
            key={`track-tick-${index}`}
            x1={tickX}
            y1="154"
            x2={tickX}
            y2="182"
            stroke="#4c1d95"
            strokeWidth="1.4"
            opacity="0.28"
          />
        );
      })}
    </g>
  );
}

function Wiper({ wiperX }: { wiperX: number }) {
  return (
    <g>
      <motion.line
        x1={wiperX}
        y1="76"
        x2={wiperX}
        y2="168"
        stroke="#111827"
        strokeWidth="5"
        strokeLinecap="round"
        animate={{ y1: [76, 70, 76] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.circle
        cx={wiperX}
        cy="68"
        r="19"
        fill={STYLE.activeTrack}
        stroke="#111827"
        strokeWidth="3"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <text
        x={wiperX}
        y="73"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="900"
      >
        W
      </text>
    </g>
  );
}

function Terminals({ wiperX }: { wiperX: number }) {
  return (
    <g>
      <WirePath points={WIRE.terminal1Wire} />
      <WirePath points={WIRE.terminal3Wire} />
      <WirePath points={WIRE.wiperWire(wiperX)} />

      <circle
        cx={NODE.terminal1.x}
        cy={NODE.terminal1.y}
        r="7"
        fill={STYLE.terminal1}
      />
      <circle
        cx={NODE.terminal3.x}
        cy={NODE.terminal3.y}
        r="7"
        fill={STYLE.terminal3}
      />
      <circle cx={wiperX} cy="38" r="7" fill={STYLE.activeTrack} />
    </g>
  );
}

function ParticleFlow({
  mode,
  particles,
  electronSpeed,
  particleCount,
  wiperX,
}: {
  mode: Mode;
  particles: number[];
  electronSpeed: number;
  particleCount: number;
  wiperX: number;
}) {
  const offsetPath =
    mode === "voltageDivider"
      ? "path('M90 168 H220 H520 H690')"
      : `path('M90 168 H${wiperX}')`;

  return (
    <g>
      {particles.map((index) => (
        <motion.circle
          key={`pot-electron-${particleCount}-${index}`}
          r="4"
          fill={STYLE.electron}
          stroke="#e0f2fe"
          strokeWidth="1.5"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: electronSpeed,
            repeat: Infinity,
            ease: "linear",
            delay: index * (electronSpeed / particleCount),
          }}
          style={{ offsetPath }}
        />
      ))}
    </g>
  );
}

function LevelBar({
  mode,
  outputLevel,
  flowLevel,
  currentValue,
  totalResistance,
  position,
}: {
  mode: Mode;
  outputLevel: number;
  flowLevel: number;
  currentValue: number;
  totalResistance: number;
  position: number;
}) {
  return (
    <g
      transform={`translate(${COMPONENT.levelBar.x} ${COMPONENT.levelBar.y - 14})`}
    >
      <text
        x={LABEL.levelTitle.x}
        y={LABEL.levelTitle.y}
        fill={STYLE.text}
        fontSize="12"
        fontWeight="800"
      >
        {mode === "voltageDivider"
          ? "Output Voltage Level"
          : "Current Flow Level"}
      </text>

      <rect
        x="0"
        y="14"
        width={COMPONENT.levelBar.width}
        height={COMPONENT.levelBar.height}
        rx="6"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="14"
        height={COMPONENT.levelBar.height}
        rx="6"
        fill={STYLE.activeTrack}
        animate={{
          width:
            COMPONENT.levelBar.width *
            (mode === "voltageDivider" ? outputLevel : flowLevel),
        }}
        transition={{ duration: 0.35 }}
      />

      <text
        x={LABEL.current.x}
        y={LABEL.current.y}
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="700"
      >
        Current: {formatNumber(currentValue * 1000, 2)} mA
      </text>

      <text
        x={LABEL.totalResistance.x}
        y={LABEL.totalResistance.y}
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="700"
      >
        Total R: {formatResistance(totalResistance)}
      </text>

      <text
        x={LABEL.wiperPercent.x}
        y={LABEL.wiperPercent.y}
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="700"
      >
        Wiper: {formatNumber(position, 0)}%
      </text>
    </g>
  );
}

export function PotentiometerVisual({
  mode,
  supplyVoltage,
  totalResistance,
  wiperPercent,
  terminal1Voltage,
  terminal3Voltage,
  wiperVoltage,
}: PotentiometerVisualProps) {
  const position = clamp(wiperPercent, 0, 100);
  const ratio = position / 100;

  const rLeft = totalResistance * ratio;
  const rRight = totalResistance * (1 - ratio);
  const activeResistance = Math.max(rLeft, 1);

  const dividerCurrent = supplyVoltage / Math.max(totalResistance, 1);
  const rheostatCurrent = supplyVoltage / activeResistance;

  const flowLevel =
    mode === "voltageDivider"
      ? clamp(dividerCurrent / 0.01, 0.12, 1)
      : clamp(rheostatCurrent / 0.05, 0.08, 1);

  const outputLevel = clamp(wiperVoltage / Math.max(supplyVoltage, 1), 0, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 20), 5), 24);
  const electronSpeed = Math.max(0.55, 2.3 - flowLevel * 1.5);

  const wiperX = 220 + ratio * 300;

  const currentValue =
    mode === "voltageDivider" ? dividerCurrent : rheostatCurrent;

  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => index),
    [particleCount],
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Potentiometer Live Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            Move the wiper to see resistance, current, and output voltage
            change.
          </p>
        </div>

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          {mode === "voltageDivider"
            ? "3-PIN VOLTAGE DIVIDER"
            : "2-PIN RHEOSTAT"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[780px] sm:w-full"
          role="img"
          aria-label="Interactive potentiometer visualization"
        >
          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="14"
              fontWeight="800"
            >
              {mode === "voltageDivider"
                ? "Voltage Divider: R1 and R2 change, total resistance stays fixed"
                : "Rheostat: active resistance changes, so current changes"}
            </text>

            <PotentiometerBody />
            <ActiveTrack wiperX={wiperX} />
            <TrackTicks />
            <Wiper wiperX={wiperX} />
            <Terminals wiperX={wiperX} />

            <text
              x={LABEL.terminal1.x}
              y={LABEL.terminal1.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="12"
              fontWeight="800"
            >
              Terminal 1
            </text>

            <text
              x={LABEL.terminal1Voltage.x}
              y={LABEL.terminal1Voltage.y}
              textAnchor="middle"
              fill={STYLE.terminal1}
              fontSize="12"
              fontWeight="900"
            >
              {formatNumber(terminal1Voltage, 2)}V
            </text>

            <text
              x={LABEL.terminal3.x}
              y={LABEL.terminal3.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="12"
              fontWeight="800"
            >
              Terminal 3
            </text>

            <text
              x={LABEL.terminal3Voltage.x}
              y={LABEL.terminal3Voltage.y}
              textAnchor="middle"
              fill={STYLE.terminal3}
              fontSize="12"
              fontWeight="900"
            >
              {formatNumber(terminal3Voltage, 2)}V
            </text>

            <text
              x={wiperX}
              y={LABEL.wiperVoltage.y}
              textAnchor="middle"
              fill={STYLE.activeTrack}
              fontSize="12"
              fontWeight="900"
            >
              Wiper {formatNumber(wiperVoltage, 2)}V
            </text>

            <text
              x={LABEL.r1.x}
              y={LABEL.r1.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="11"
              fontWeight="700"
            >
              R1 = {formatResistance(rLeft)}
            </text>

            <text
              x={LABEL.r2.x}
              y={LABEL.r2.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="11"
              fontWeight="700"
            >
              R2 = {formatResistance(rRight)}
            </text>

            <ParticleFlow
              mode={mode}
              particles={particles}
              electronSpeed={electronSpeed}
              particleCount={particleCount}
              wiperX={wiperX}
            />

            <LevelBar
              mode={mode}
              outputLevel={outputLevel}
              flowLevel={flowLevel}
              currentValue={currentValue}
              totalResistance={totalResistance}
              position={position}
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
