"use client";

import { motion } from "framer-motion";

import type { ResistorTypeVisualProps } from "./types";

const VIEW_BOX = "0 0 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistorBody: 1,
  activeMaterial: 1,
  colorBands: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#334155",
  stroke: "#111827",
  hotGlow: "#ef4444",
  warm: "#fdba74",
  hot: "#fca5a5",
  cool: "#bae6fd",
  coldDot: "#075985",
  hotDot: "#991b1b",
  current: "#0ea5e9",
  heatRed: "#ef4444",
  heatOrange: "#f97316",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

type ThermalDot = Point & {
  r: number;
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

function clampValue(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

const BASE_COMPONENT = {
  resistorBody: {
    x: 190,
    y: 115,
    width: 380,
    height: 90,
    rotate: 0,
  },

  activeMaterial: {
    x: 222,
    y: 134,
    width: 316,
    height: 52,
    rotate: 0,
  },

  colorBands: {
    x: 245,
    y: 115,
    width: 268,
    height: 90,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  resistorBody: scaleComponent(
    BASE_COMPONENT.resistorBody,
    CIRCUIT_COMPONENT_SCALE.resistorBody,
  ),
  activeMaterial: scaleComponent(
    BASE_COMPONENT.activeMaterial,
    CIRCUIT_COMPONENT_SCALE.activeMaterial,
  ),
  colorBands: scaleComponent(
    BASE_COMPONENT.colorBands,
    CIRCUIT_COMPONENT_SCALE.colorBands,
  ),
} as const;

const NODE = {
  bodyCenter: pointOnComponent(COMPONENT.resistorBody, 0.5, 0.5),
  materialCenter: pointOnComponent(COMPONENT.activeMaterial, 0.5, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const PATH = {
  highTempCurrent:
    "M235 160 C270 150 300 170 335 158 C370 146 405 174 440 158 C475 144 510 166 535 158",

  lowTempCurrent:
    "M235 160 C260 130 290 190 320 160 C350 130 380 190 410 160 C440 130 470 190 500 160 C515 145 525 150 535 160",

  heatWaves: [
    {
      d: "M300 104 C286 82 314 74 300 52",
      stroke: STYLE.heatRed,
    },
    {
      d: "M380 104 C366 82 394 74 380 52",
      stroke: STYLE.heatOrange,
    },
    {
      d: "M460 104 C446 82 474 74 460 52",
      stroke: STYLE.heatRed,
    },
  ],
} as const;

const LABEL = {
  aria: "Thermistor visual showing temperature-sensitive resistance change",
  status: { x: 380, y: 218 },
} as const;

const THERMAL_DOTS: ThermalDot[] = [
  { x: 242, y: 146, r: 2 },
  { x: 278, y: 174, r: 1.6 },
  { x: 318, y: 150, r: 2.2 },
  { x: 355, y: 176, r: 1.5 },
  { x: 394, y: 145, r: 2 },
  { x: 432, y: 172, r: 1.7 },
  { x: 472, y: 150, r: 2.3 },
  { x: 512, y: 174, r: 1.5 },
];

const COLOR_BANDS = [
  { x: 245, color: "#ef4444" },
  { x: 300, color: "#111827" },
  { x: 355, color: "#f59e0b" },
  { x: 500, color: "#d4af37" },
] as const;

function TemperatureGlow({ glowOpacity }: { glowOpacity: number }) {
  return (
    <motion.rect
      x={COMPONENT.resistorBody.x - 6}
      y={COMPONENT.resistorBody.y - 6}
      width={COMPONENT.resistorBody.width + 12}
      height={COMPONENT.resistorBody.height + 12}
      rx={(COMPONENT.resistorBody.height + 12) / 2}
      fill={STYLE.hotGlow}
      opacity={glowOpacity}
      animate={{
        opacity: [glowOpacity * 0.5, glowOpacity, glowOpacity * 0.5],
      }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ThermistorBody({
  bodyFill,
  selectedColor,
  safeHeat,
}: {
  bodyFill: string;
  selectedColor: string;
  safeHeat: number;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.resistorBody.x}
        y={COMPONENT.resistorBody.y}
        width={COMPONENT.resistorBody.width}
        height={COMPONENT.resistorBody.height}
        rx={COMPONENT.resistorBody.height / 2}
        fill={bodyFill}
        stroke={STYLE.stroke}
        strokeWidth={WIRE.width}
      />

      <rect
        x={COMPONENT.activeMaterial.x}
        y={COMPONENT.activeMaterial.y}
        width={COMPONENT.activeMaterial.width}
        height={COMPONENT.activeMaterial.height}
        rx={COMPONENT.activeMaterial.height / 2}
        fill={selectedColor}
        opacity={0.12 + safeHeat * 0.22}
        stroke={selectedColor}
        strokeWidth="2"
        strokeDasharray="6 6"
      />
    </g>
  );
}

function ThermalParticles({
  temperaturePercent,
  safeHeat,
}: {
  temperaturePercent: number;
  safeHeat: number;
}) {
  return (
    <g>
      {THERMAL_DOTS.map((dot, index) => (
        <motion.circle
          key={`thermal-dot-${index}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.r + safeHeat * 1.2}
          fill={temperaturePercent > 50 ? STYLE.hotDot : STYLE.coldDot}
          opacity={0.28 + safeHeat * 0.38}
          animate={{ opacity: [0.25, 0.65, 0.25] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  );
}

function ResistanceCurrentPath({
  temperaturePercent,
  flowSpeed,
}: {
  temperaturePercent: number;
  flowSpeed: number;
}) {
  return (
    <motion.path
      d={temperaturePercent > 60 ? PATH.highTempCurrent : PATH.lowTempCurrent}
      fill="none"
      stroke={STYLE.current}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="5 15"
      opacity="0.82"
      animate={{ strokeDashoffset: [0, -48] }}
      transition={{ duration: flowSpeed, repeat: Infinity, ease: "linear" }}
    />
  );
}

function HeatWaves({ safeHeat }: { safeHeat: number }) {
  return (
    <motion.g
      opacity={0.25 + safeHeat * 0.7}
      animate={{
        y: [0, -6, 0],
        opacity: [
          0.25 + safeHeat * 0.35,
          0.55 + safeHeat * 0.45,
          0.25 + safeHeat * 0.35,
        ],
      }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
    >
      {PATH.heatWaves.map((wave, index) => (
        <path
          key={`thermistor-heat-wave-${index}`}
          d={wave.d}
          stroke={wave.stroke}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </motion.g>
  );
}

function ColorBands() {
  return (
    <g>
      {COLOR_BANDS.map((band, index) => (
        <rect
          key={`thermistor-band-${index}`}
          x={band.x}
          y={COMPONENT.colorBands.y}
          width="13"
          height={COMPONENT.colorBands.height}
          fill={band.color}
        />
      ))}
    </g>
  );
}

function StatusLabel({
  temperaturePercent,
  resistancePercent,
}: {
  temperaturePercent: number;
  resistancePercent: number;
}) {
  return (
    <text
      x={LABEL.status.x}
      y={LABEL.status.y}
      textAnchor="middle"
      fill={STYLE.text}
      fontSize="12"
      fontWeight="800"
    >
      Temperature: {temperaturePercent}% • NTC Resistance: ~{resistancePercent}%
    </text>
  );
}

export function ThermistorVisual({
  selected,
  environmentValue,
  heat,
}: ResistorTypeVisualProps) {
  const temperaturePercent = clampValue(environmentValue, 0, 100);
  const safeHeat = clampValue(Math.max(heat, temperaturePercent / 100), 0, 1);

  const bodyFill =
    temperaturePercent > 70
      ? STYLE.hot
      : temperaturePercent > 40
        ? STYLE.warm
        : STYLE.cool;

  const resistancePercent = Math.round(100 - temperaturePercent * 0.7);

  const flowSpeed =
    temperaturePercent > 65 ? 0.9 : temperaturePercent > 35 ? 1.25 : 1.75;

  const glowOpacity = 0.08 + safeHeat * 0.32;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <g aria-label={LABEL.aria} transform={canvasTransform}>
      <TemperatureGlow glowOpacity={glowOpacity} />

      <ThermistorBody
        bodyFill={bodyFill}
        selectedColor={selected.color}
        safeHeat={safeHeat}
      />

      <ThermalParticles
        temperaturePercent={temperaturePercent}
        safeHeat={safeHeat}
      />

      <ResistanceCurrentPath
        temperaturePercent={temperaturePercent}
        flowSpeed={flowSpeed}
      />

      <HeatWaves safeHeat={safeHeat} />

      <StatusLabel
        temperaturePercent={temperaturePercent}
        resistancePercent={resistancePercent}
      />

      <ColorBands />
    </g>
  );
}
