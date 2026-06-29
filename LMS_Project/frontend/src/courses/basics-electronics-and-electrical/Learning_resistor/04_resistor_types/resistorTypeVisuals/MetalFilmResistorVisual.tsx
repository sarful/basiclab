"use client";

import { motion } from "framer-motion";

import type { ResistorTypeVisualProps } from "./types";

const VIEW_BOX = "0 0 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistorBody: 1,
  ceramicBase: 1,
  filmLayer: 1,
  colorBands: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  body: "#dbeafe",
  ceramic: "#eff6ff",
  stroke: "#111827",
  glow: "#60a5fa",
  trim: "#1d4ed8",
  current: "#0ea5e9",
  dot: "#38bdf8",
  dotStroke: "#e0f2fe",
  marker: "#2563eb",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

type FilmSegment = {
  x: number;
  y: number;
  width: number;
  opacity: number;
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

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

const BASE_COMPONENT = {
  resistorBody: {
    x: 190,
    y: 115,
    width: 380,
    height: 90,
    rotate: 0,
  },

  ceramicBase: {
    x: 222,
    y: 134,
    width: 316,
    height: 52,
    rotate: 0,
  },

  filmLayer: {
    x: 230,
    y: 143,
    width: 300,
    height: 34,
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
  ceramicBase: scaleComponent(
    BASE_COMPONENT.ceramicBase,
    CIRCUIT_COMPONENT_SCALE.ceramicBase,
  ),
  filmLayer: scaleComponent(
    BASE_COMPONENT.filmLayer,
    CIRCUIT_COMPONENT_SCALE.filmLayer,
  ),
  colorBands: scaleComponent(
    BASE_COMPONENT.colorBands,
    CIRCUIT_COMPONENT_SCALE.colorBands,
  ),
} as const;

const NODE = {
  bodyCenter: pointOnComponent(COMPONENT.resistorBody, 0.5, 0.5),
  filmCenter: pointOnComponent(COMPONENT.filmLayer, 0.5, 0.5),

  precisionDots: [
    { x: 265, y: 160 },
    { x: 335, y: 160 },
    { x: 405, y: 160 },
    { x: 475, y: 160 },
  ],

  markerLeft: { x: 222, y: 118 },
  markerRight: { x: 535, y: 202 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const PATH = {
  trimmingSpiral:
    "M235 160 C252 140 270 180 288 160 C306 140 324 180 342 160 C360 140 378 180 396 160 C414 140 432 180 450 160 C468 140 486 180 504 160 C516 148 525 152 533 160",

  currentFlow: "M232 160 H536",
} as const;

const LABEL = {
  aria: "Metal film resistor visual showing precise stable film layer and smooth current path",
} as const;

const FILM_SEGMENTS: FilmSegment[] = [
  { x: 232, y: 143, width: 28, opacity: 0.22 },
  { x: 266, y: 143, width: 31, opacity: 0.28 },
  { x: 303, y: 143, width: 26, opacity: 0.24 },
  { x: 335, y: 143, width: 34, opacity: 0.3 },
  { x: 375, y: 143, width: 30, opacity: 0.24 },
  { x: 411, y: 143, width: 28, opacity: 0.29 },
  { x: 445, y: 143, width: 33, opacity: 0.25 },
  { x: 484, y: 143, width: 31, opacity: 0.28 },
];

const COLOR_BANDS = [
  { x: 245, color: "#8b5a2b" },
  { x: 300, color: "#111827" },
  { x: 355, color: "#ef4444" },
  { x: 500, color: "#d4af37" },
] as const;

function HeatGlow({ glowOpacity }: { glowOpacity: number }) {
  return (
    <motion.rect
      x={COMPONENT.resistorBody.x - 6}
      y={COMPONENT.resistorBody.y - 6}
      width={COMPONENT.resistorBody.width + 12}
      height={COMPONENT.resistorBody.height + 12}
      rx={(COMPONENT.resistorBody.height + 12) / 2}
      fill={STYLE.glow}
      opacity={glowOpacity}
      animate={{
        opacity: [glowOpacity * 0.55, glowOpacity, glowOpacity * 0.55],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ResistorBody() {
  return (
    <g>
      <rect
        x={COMPONENT.resistorBody.x}
        y={COMPONENT.resistorBody.y}
        width={COMPONENT.resistorBody.width}
        height={COMPONENT.resistorBody.height}
        rx={COMPONENT.resistorBody.height / 2}
        fill={STYLE.body}
        stroke={STYLE.stroke}
        strokeWidth={WIRE.width}
      />

      <rect
        x={COMPONENT.ceramicBase.x}
        y={COMPONENT.ceramicBase.y}
        width={COMPONENT.ceramicBase.width}
        height={COMPONENT.ceramicBase.height}
        rx={COMPONENT.ceramicBase.height / 2}
        fill={STYLE.ceramic}
        opacity="0.95"
      />
    </g>
  );
}

function MetalFilmLayer({ selectedColor }: { selectedColor: string }) {
  return (
    <g>
      <rect
        x={COMPONENT.filmLayer.x}
        y={COMPONENT.filmLayer.y}
        width={COMPONENT.filmLayer.width}
        height={COMPONENT.filmLayer.height}
        rx={COMPONENT.filmLayer.height / 2}
        fill={selectedColor}
        opacity="0.14"
        stroke={selectedColor}
        strokeWidth="2"
      />

      {FILM_SEGMENTS.map((segment, index) => (
        <rect
          key={`metal-film-segment-${index}`}
          x={segment.x}
          y={segment.y}
          width={segment.width}
          height={COMPONENT.filmLayer.height}
          rx="8"
          fill={selectedColor}
          opacity={segment.opacity}
        />
      ))}
    </g>
  );
}

function TrimmingSpiral() {
  return (
    <path
      d={PATH.trimmingSpiral}
      fill="none"
      stroke={STYLE.trim}
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.72"
    />
  );
}

function SmoothCurrentPath() {
  return (
    <motion.path
      d={PATH.currentFlow}
      fill="none"
      stroke={STYLE.current}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="5 16"
      opacity="0.75"
      animate={{ strokeDashoffset: [0, -42] }}
      transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }}
    />
  );
}

function PrecisionDots() {
  return (
    <g>
      {NODE.precisionDots.map((dot, index) => (
        <circle
          key={`metal-film-precision-dot-${index}`}
          cx={dot.x}
          cy={dot.y}
          r="3"
          fill={STYLE.dot}
          stroke={STYLE.dotStroke}
          strokeWidth="1.2"
        />
      ))}
    </g>
  );
}

function ColorBands() {
  return (
    <g>
      {COLOR_BANDS.map((band, index) => (
        <rect
          key={`metal-film-band-${index}`}
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

function PrecisionMarkers() {
  return (
    <g>
      <circle
        cx={NODE.markerLeft.x}
        cy={NODE.markerLeft.y}
        r="3.5"
        fill={STYLE.marker}
        opacity="0.85"
      />
      <circle
        cx={NODE.markerRight.x}
        cy={NODE.markerRight.y}
        r="3.5"
        fill={STYLE.marker}
        opacity="0.85"
      />
    </g>
  );
}

export function MetalFilmResistorVisual({
  selected,
  heat,
}: ResistorTypeVisualProps) {
  const safeHeat = clamp01(heat);
  const glowOpacity = 0.04 + safeHeat * 0.16;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <g aria-label={LABEL.aria} transform={canvasTransform}>
      <HeatGlow glowOpacity={glowOpacity} />

      <ResistorBody />

      <MetalFilmLayer selectedColor={selected.color} />

      <TrimmingSpiral />

      <SmoothCurrentPath />

      <PrecisionDots />

      <ColorBands />

      <PrecisionMarkers />
    </g>
  );
}
