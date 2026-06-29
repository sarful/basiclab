"use client";

import { motion } from "framer-motion";

import type { ResistorTypeVisualProps } from "./types";

const VIEW_BOX = "0 0 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  body: 1,
  housing: 1,
  track: 1,
  wiper: 1,
  terminals: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#334155",
  stroke: "#111827",
  body: "#f8fafc",
  housing: "#ede9fe",
  housingStroke: "#c4b5fd",
  baseTrack: "#6b7280",
  remainingTrack: "#94a3b8",
  tick: "#312e81",
  current: "#38bdf8",
  terminal: "#f97316",
  glow: "#a78bfa",
  muted: "#64748b",
  purple: "#7c3aed",
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

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

const BASE_COMPONENT = {
  body: {
    x: 220,
    y: 118,
    width: 320,
    height: 70,
    rotate: 0,
  },

  housing: {
    x: 238,
    y: 133,
    width: 284,
    height: 40,
    rotate: 0,
  },

  track: {
    x: 250,
    y: 145,
    width: 260,
    height: 16,
    rotate: 0,
  },

  wiper: {
    x: 250,
    y: 66,
    width: 260,
    height: 87,
    rotate: 0,
  },

  terminals: {
    x: 250,
    y: 188,
    width: 260,
    height: 40,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  body: scaleComponent(BASE_COMPONENT.body, CIRCUIT_COMPONENT_SCALE.body),
  housing: scaleComponent(
    BASE_COMPONENT.housing,
    CIRCUIT_COMPONENT_SCALE.housing,
  ),
  track: scaleComponent(BASE_COMPONENT.track, CIRCUIT_COMPONENT_SCALE.track),
  wiper: scaleComponent(BASE_COMPONENT.wiper, CIRCUIT_COMPONENT_SCALE.wiper),
  terminals: scaleComponent(
    BASE_COMPONENT.terminals,
    CIRCUIT_COMPONENT_SCALE.terminals,
  ),
} as const;

const NODE = {
  bodyCenter: pointOnComponent(COMPONENT.body, 0.5, 0.5),

  trackLeft: { x: 250, y: 153 },
  trackRight: { x: 510, y: 153 },

  wiperTop: { y: 92 },
  wiperKnob: { y: 86 },
  wiperOutputTop: { y: 70 },
  wiperOutputDot: { y: 66 },

  terminalY1: 188,
  terminalY2: 207,
  terminalDotY: 211,
  terminalLabelY: 228,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const LABEL = {
  aria: "Potentiometer visual showing adjustable wiper, resistive track, and voltage divider behavior",
  r1: { x: 300, y: 202 },
  r2: { x: 460, y: 202 },
  summary: { x: 380, y: 247 },
} as const;

const TERMINALS = [
  { x: 250, label: "A" },
  { x: 380, label: "W" },
  { x: 510, label: "B" },
] as const;

function HeatGlow({ glowOpacity }: { glowOpacity: number }) {
  return (
    <motion.rect
      x={COMPONENT.body.x - 6}
      y={COMPONENT.body.y - 10}
      width={COMPONENT.body.width + 12}
      height={COMPONENT.body.height + 24}
      rx="42"
      fill={STYLE.glow}
      opacity={glowOpacity}
      animate={{
        opacity: [glowOpacity * 0.5, glowOpacity, glowOpacity * 0.5],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
        stroke={STYLE.stroke}
        strokeWidth={WIRE.width}
      />

      <rect
        x={COMPONENT.housing.x}
        y={COMPONENT.housing.y}
        width={COMPONENT.housing.width}
        height={COMPONENT.housing.height}
        rx={COMPONENT.housing.height / 2}
        fill={STYLE.housing}
        stroke={STYLE.housingStroke}
        strokeWidth="2"
      />
    </g>
  );
}

function ResistiveTrack({
  selectedColor,
  wiperX,
}: {
  selectedColor: string;
  wiperX: number;
}) {
  return (
    <g>
      <line
        x1={NODE.trackLeft.x}
        y1={NODE.trackLeft.y}
        x2={NODE.trackRight.x}
        y2={NODE.trackRight.y}
        stroke={STYLE.baseTrack}
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.4"
      />

      <motion.line
        x1={NODE.trackLeft.x}
        y1={NODE.trackLeft.y}
        x2={wiperX}
        y2={NODE.trackLeft.y}
        stroke={selectedColor}
        strokeWidth="16"
        strokeLinecap="round"
        animate={{ opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <line
        x1={wiperX}
        y1={NODE.trackLeft.y}
        x2={NODE.trackRight.x}
        y2={NODE.trackLeft.y}
        stroke={STYLE.remainingTrack}
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.45"
      />
    </g>
  );
}

function TrackTexture() {
  return (
    <g>
      {Array.from({ length: 13 }).map((_, index) => {
        const tickX = NODE.trackLeft.x + index * (260 / 12);

        return (
          <line
            key={`pot-track-tick-${index}`}
            x1={tickX}
            y1="143"
            x2={tickX}
            y2="163"
            stroke={STYLE.tick}
            strokeWidth="1.5"
            opacity="0.28"
          />
        );
      })}
    </g>
  );
}

function WiperContact({
  wiperX,
  selectedColor,
}: {
  wiperX: number;
  selectedColor: string;
}) {
  return (
    <g>
      <motion.line
        x1={wiperX}
        y1={NODE.wiperTop.y}
        x2={wiperX}
        y2={NODE.trackLeft.y}
        stroke={STYLE.stroke}
        strokeWidth="5"
        strokeLinecap="round"
        animate={{ y1: [92, 88, 92] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.circle
        cx={wiperX}
        cy={NODE.wiperKnob.y}
        r="17"
        fill={selectedColor}
        stroke={STYLE.stroke}
        strokeWidth="3"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <line
        x1={wiperX}
        y1="78"
        x2={wiperX + 8}
        y2="86"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <line
        x1={wiperX}
        y1="103"
        x2={wiperX}
        y2={NODE.wiperOutputTop.y}
        stroke={STYLE.stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle
        cx={wiperX}
        cy={NODE.wiperOutputDot.y}
        r="5"
        fill={STYLE.current}
        stroke={STYLE.stroke}
        strokeWidth="2"
      />
    </g>
  );
}

function ActiveCurrentPath({ wiperX }: { wiperX: number }) {
  return (
    <motion.path
      d={`M${NODE.trackLeft.x} ${NODE.trackLeft.y} H${wiperX}`}
      fill="none"
      stroke={STYLE.current}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="4 14"
      opacity="0.85"
      animate={{ strokeDashoffset: [0, -36] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
    />
  );
}

function TerminalPins() {
  return (
    <g>
      {TERMINALS.map((terminal) => (
        <g key={`pot-terminal-${terminal.label}`}>
          <line
            x1={terminal.x}
            y1={NODE.terminalY1}
            x2={terminal.x}
            y2={NODE.terminalY2}
            stroke={STYLE.stroke}
            strokeWidth="4"
            strokeLinecap="round"
          />

          <circle
            cx={terminal.x}
            cy={NODE.terminalDotY}
            r="5"
            fill={STYLE.terminal}
            stroke={STYLE.stroke}
            strokeWidth="2"
          />

          <text
            x={terminal.x}
            y={NODE.terminalLabelY}
            textAnchor="middle"
            fill={STYLE.text}
            fontSize="11"
            fontWeight="800"
          >
            {terminal.label}
          </text>
        </g>
      ))}
    </g>
  );
}

function EducationalLabels({
  leftPercent,
  rightPercent,
}: {
  leftPercent: number;
  rightPercent: number;
}) {
  return (
    <g>
      <text
        x={LABEL.r1.x}
        y={LABEL.r1.y}
        textAnchor="middle"
        fill={STYLE.purple}
        fontSize="11"
        fontWeight="800"
      >
        R1 {leftPercent}%
      </text>

      <text
        x={LABEL.r2.x}
        y={LABEL.r2.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="11"
        fontWeight="800"
      >
        R2 {rightPercent}%
      </text>

      <text
        x={LABEL.summary.x}
        y={LABEL.summary.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="13"
        fontWeight="800"
      >
        Wiper Position: {leftPercent}% • Adjustable Voltage Divider
      </text>
    </g>
  );
}

export function PotentiometerVisual({
  selected,
  controlValue,
  heat,
}: ResistorTypeVisualProps) {
  const position = clampPercent(controlValue);
  const wiperX = NODE.trackLeft.x + (position / 100) * 260;

  const leftPercent = Math.round(position);
  const rightPercent = 100 - leftPercent;

  const safeHeat = Math.max(0, Math.min(1, heat));
  const glowOpacity = 0.04 + safeHeat * 0.14;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <g aria-label={LABEL.aria} transform={canvasTransform}>
      <HeatGlow glowOpacity={glowOpacity} />

      <PotentiometerBody />

      <ResistiveTrack selectedColor={selected.color} wiperX={wiperX} />

      <TrackTexture />

      <WiperContact wiperX={wiperX} selectedColor={selected.color} />

      <ActiveCurrentPath wiperX={wiperX} />

      <TerminalPins />

      <EducationalLabels
        leftPercent={leftPercent}
        rightPercent={rightPercent}
      />
    </g>
  );
}
