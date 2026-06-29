"use client";

import { motion } from "framer-motion";

import type { FixedTypeVisualProps } from "./types";

const VIEW_BOX = "0 0 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistorBody: 1,
  ceramicSubstrate: 1,
  metalFilm: 1,
  colorBands: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#1e40af",
  muted: "#64748b",
  stroke: "#111827",
  glow: "#60a5fa",
  ceramic: "#eff6ff",
  trim: "#1d4ed8",
  current: "#0ea5e9",
  dot: "#38bdf8",
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

type PrecisionLayer = {
  x: number;
  y: number;
  w: number;
  o: number;
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

const BASE_COMPONENT = {
  resistorBody: {
    x: 180,
    y: 108,
    width: 400,
    height: 114,
    rotate: 0,
  },

  ceramicSubstrate: {
    x: 225,
    y: 135,
    width: 310,
    height: 58,
    rotate: 0,
  },

  metalFilm: {
    x: 235,
    y: 142,
    width: 290,
    height: 44,
    rotate: 0,
  },

  colorBands: {
    x: 245,
    y: 108,
    width: 268,
    height: 114,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  resistorBody: scaleComponent(
    BASE_COMPONENT.resistorBody,
    CIRCUIT_COMPONENT_SCALE.resistorBody,
  ),
  ceramicSubstrate: scaleComponent(
    BASE_COMPONENT.ceramicSubstrate,
    CIRCUIT_COMPONENT_SCALE.ceramicSubstrate,
  ),
  metalFilm: scaleComponent(
    BASE_COMPONENT.metalFilm,
    CIRCUIT_COMPONENT_SCALE.metalFilm,
  ),
  colorBands: scaleComponent(
    BASE_COMPONENT.colorBands,
    CIRCUIT_COMPONENT_SCALE.colorBands,
  ),
} as const;

const NODE = {
  bodyCenter: pointOnComponent(COMPONENT.resistorBody, 0.5, 0.5),
  markerLeft: { x: 222, y: 118 },
  markerRight: { x: 538, y: 212 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const PATH = {
  laserTrim:
    "M240 165 C255 145 270 185 285 165 C300 145 315 185 330 165 C345 145 360 185 375 165 C390 145 405 185 420 165 C435 145 450 185 465 165 C480 145 495 185 510 165 C520 155 528 158 535 165",

  currentFlow: "M235 165 H535",
} as const;

const LABEL = {
  aria: "Metal film fixed resistor showing precision film technology",
  title: { x: 380, y: 157 },
  subtitle: { x: 380, y: 176 },
} as const;

const PRECISION_LAYERS: PrecisionLayer[] = [
  { x: 236, y: 142, w: 26, o: 0.18 },
  { x: 268, y: 142, w: 28, o: 0.24 },
  { x: 302, y: 142, w: 24, o: 0.2 },
  { x: 332, y: 142, w: 30, o: 0.26 },
  { x: 368, y: 142, w: 28, o: 0.22 },
  { x: 402, y: 142, w: 26, o: 0.24 },
  { x: 434, y: 142, w: 30, o: 0.2 },
  { x: 470, y: 142, w: 28, o: 0.25 },
];

const PRECISION_DOTS: Point[] = [
  { x: 280, y: 165 },
  { x: 340, y: 165 },
  { x: 400, y: 165 },
  { x: 460, y: 165 },
];

const LOW_NOISE_DOTS: Point[] = [
  { x: 305, y: 150 },
  { x: 380, y: 180 },
  { x: 455, y: 150 },
];

const COLOR_BANDS = [
  { x: 245, color: "#8b5a2b" },
  { x: 300, color: "#111827" },
  { x: 355, color: "#ef4444" },
  { x: 500, color: "#d4af37" },
] as const;

function StabilityGlow() {
  return (
    <motion.rect
      x={COMPONENT.resistorBody.x - 8}
      y={COMPONENT.resistorBody.y - 8}
      width={COMPONENT.resistorBody.width + 16}
      height={COMPONENT.resistorBody.height + 16}
      rx={(COMPONENT.resistorBody.height + 16) / 2}
      fill={STYLE.glow}
      opacity="0.08"
      animate={{ opacity: [0.05, 0.11, 0.05] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ResistorBody({ bodyColor }: { bodyColor: string }) {
  return (
    <rect
      x={COMPONENT.resistorBody.x}
      y={COMPONENT.resistorBody.y}
      width={COMPONENT.resistorBody.width}
      height={COMPONENT.resistorBody.height}
      rx={COMPONENT.resistorBody.height / 2}
      fill={bodyColor}
      stroke={STYLE.stroke}
      strokeWidth={WIRE.width}
    />
  );
}

function CeramicSubstrate() {
  return (
    <rect
      x={COMPONENT.ceramicSubstrate.x}
      y={COMPONENT.ceramicSubstrate.y}
      width={COMPONENT.ceramicSubstrate.width}
      height={COMPONENT.ceramicSubstrate.height}
      rx={COMPONENT.ceramicSubstrate.height / 2}
      fill={STYLE.ceramic}
      opacity="0.95"
    />
  );
}

function MetalFilmLayer({ layerColor }: { layerColor: string }) {
  return (
    <g>
      <rect
        x={COMPONENT.metalFilm.x}
        y={COMPONENT.metalFilm.y}
        width={COMPONENT.metalFilm.width}
        height={COMPONENT.metalFilm.height}
        rx={COMPONENT.metalFilm.height / 2}
        fill={layerColor}
        opacity="0.12"
        stroke={layerColor}
        strokeWidth="2"
      />

      {PRECISION_LAYERS.map((layer, index) => (
        <rect
          key={`precision-layer-${index}`}
          x={layer.x}
          y={layer.y}
          width={layer.w}
          height={COMPONENT.metalFilm.height}
          rx="8"
          fill={layerColor}
          opacity={layer.o}
        />
      ))}
    </g>
  );
}

function LaserTrimSpiral() {
  return (
    <path
      d={PATH.laserTrim}
      fill="none"
      stroke={STYLE.trim}
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.8"
    />
  );
}

function StableCurrentPath() {
  return (
    <motion.path
      d={PATH.currentFlow}
      fill="none"
      stroke={STYLE.current}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="5 14"
      opacity="0.8"
      animate={{ strokeDashoffset: [0, -48] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function PrecisionIndicators() {
  return (
    <g>
      {PRECISION_DOTS.map((dot, index) => (
        <circle
          key={`precision-dot-${index}`}
          cx={dot.x}
          cy={dot.y}
          r="3"
          fill={STYLE.dot}
          stroke="#e0f2fe"
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

function LowNoiseIndicators() {
  return (
    <motion.g
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {LOW_NOISE_DOTS.map((dot, index) => (
        <circle
          key={`low-noise-dot-${index}`}
          cx={dot.x}
          cy={dot.y}
          r="2"
          fill="#dbeafe"
        />
      ))}
    </motion.g>
  );
}

function TextLabels() {
  return (
    <g>
      <text
        x={LABEL.title.x}
        y={LABEL.title.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="11"
        fontWeight="800"
      >
        PRECISION METAL FILM LAYER
      </text>

      <text
        x={LABEL.subtitle.x}
        y={LABEL.subtitle.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="10"
      >
        High accuracy • low noise • stable resistance
      </text>
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
        r="4"
        fill={STYLE.marker}
        opacity="0.9"
      />
      <circle
        cx={NODE.markerRight.x}
        cy={NODE.markerRight.y}
        r="4"
        fill={STYLE.marker}
        opacity="0.9"
      />
    </g>
  );
}

export function MetalFilmFixedResistorVisual({ type }: FixedTypeVisualProps) {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <g aria-label={LABEL.aria} transform={canvasTransform}>
      <StabilityGlow />

      <ResistorBody bodyColor={type.bodyColor} />

      <CeramicSubstrate />

      <MetalFilmLayer layerColor={type.layerColor} />

      <LaserTrimSpiral />

      <StableCurrentPath />

      <PrecisionIndicators />

      <LowNoiseIndicators />

      <TextLabels />

      <ColorBands />

      <PrecisionMarkers />
    </g>
  );
}
