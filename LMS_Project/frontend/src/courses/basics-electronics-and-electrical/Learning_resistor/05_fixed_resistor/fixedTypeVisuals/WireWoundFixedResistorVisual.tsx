"use client";

import { motion } from "framer-motion";

import type { FixedTypeVisualProps } from "./types";

const VIEW_BOX = "0 0 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistorBody: 1,
  ceramicCore: 1,
  colorBands: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#9a3412",
  muted: "#64748b",
  stroke: "#111827",
  heatGlow: "#fb923c",
  ceramic: "#fef3c7",
  shadow: "#92400e",
  coilBase: "#7c2d12",
  coilHighlight: "#fed7aa",
  current: "#38bdf8",
  heatRed: "#ef4444",
  heatOrange: "#f97316",
} as const;

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
    x: 180,
    y: 108,
    width: 400,
    height: 114,
    rotate: 0,
  },

  ceramicCore: {
    x: 225,
    y: 135,
    width: 310,
    height: 58,
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
  ceramicCore: scaleComponent(
    BASE_COMPONENT.ceramicCore,
    CIRCUIT_COMPONENT_SCALE.ceramicCore,
  ),
  colorBands: scaleComponent(
    BASE_COMPONENT.colorBands,
    CIRCUIT_COMPONENT_SCALE.colorBands,
  ),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const PATH = {
  internalShadow: "M235 182 C290 198 345 182 400 182 C455 182 505 196 530 182",

  winding:
    "M245 165 C260 122 280 208 300 165 C320 122 340 208 360 165 C380 122 400 208 420 165 C440 122 460 208 480 165 C500 122 520 208 540 165",

  heatWaves: [
    "M295 100 C280 78 310 68 295 48",
    "M380 100 C365 78 395 68 380 48",
    "M465 100 C450 78 480 68 465 48",
  ],
} as const;

const LABEL = {
  aria: "Wire wound fixed resistor showing high power coil construction",
  title: { x: 380, y: 157 },
  subtitle: { x: 380, y: 176 },
} as const;

const COIL_SEGMENTS = [
  { x1: 245, c1: 258, c2: 272, x2: 285 },
  { x1: 285, c1: 298, c2: 312, x2: 325 },
  { x1: 325, c1: 338, c2: 352, x2: 365 },
  { x1: 365, c1: 378, c2: 392, x2: 405 },
  { x1: 405, c1: 418, c2: 432, x2: 445 },
  { x1: 445, c1: 458, c2: 472, x2: 485 },
  { x1: 485, c1: 498, c2: 512, x2: 525 },
  { x1: 525, c1: 532, c2: 538, x2: 545 },
] as const;

const COLOR_BANDS = [
  { x: 245, color: "#ef4444" },
  { x: 300, color: "#111827" },
  { x: 355, color: "#f59e0b" },
  { x: 500, color: "#d4af37" },
] as const;

function HeatGlow({ glowOpacity }: { glowOpacity: number }) {
  return (
    <motion.rect
      x={COMPONENT.resistorBody.x - 10}
      y={COMPONENT.resistorBody.y - 10}
      width={COMPONENT.resistorBody.width + 20}
      height={COMPONENT.resistorBody.height + 20}
      rx={(COMPONENT.resistorBody.height + 20) / 2}
      fill={STYLE.heatGlow}
      opacity={glowOpacity}
      animate={{
        opacity: [glowOpacity * 0.5, glowOpacity, glowOpacity * 0.5],
      }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
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

function CeramicCore() {
  return (
    <g>
      <rect
        x={COMPONENT.ceramicCore.x}
        y={COMPONENT.ceramicCore.y}
        width={COMPONENT.ceramicCore.width}
        height={COMPONENT.ceramicCore.height}
        rx={COMPONENT.ceramicCore.height / 2}
        fill={STYLE.ceramic}
        opacity="0.9"
      />

      <path
        d={PATH.internalShadow}
        fill="none"
        stroke={STYLE.shadow}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.15"
      />
    </g>
  );
}

function Winding({
  layerColor,
  safeHeat,
}: {
  layerColor: string;
  safeHeat: number;
}) {
  return (
    <g>
      <path
        d={PATH.winding}
        fill="none"
        stroke={STYLE.coilBase}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.3"
      />

      <motion.path
        d={PATH.winding}
        fill="none"
        stroke={layerColor}
        strokeWidth="6"
        strokeLinecap="round"
        animate={{
          opacity: safeHeat > 0.55 ? [0.85, 1, 0.85] : 0.9,
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />

      {COIL_SEGMENTS.map((segment, index) => (
        <path
          key={`coil-highlight-${index}`}
          d={`M${segment.x1} 165 C${segment.c1} 130 ${segment.c2} 200 ${segment.x2} 165`}
          fill="none"
          stroke={STYLE.coilHighlight}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
      ))}

      <motion.path
        d={PATH.winding}
        fill="none"
        stroke={STYLE.current}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 22"
        opacity="0.85"
        animate={{ strokeDashoffset: [0, -120] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      />
    </g>
  );
}

function HeatWaves({ safeHeat }: { safeHeat: number }) {
  return (
    <motion.g
      opacity={0.25 + safeHeat * 0.7}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {PATH.heatWaves.map((path, index) => (
        <path
          key={`wire-wound-heat-${index}`}
          d={path}
          stroke={index === 1 ? STYLE.heatOrange : STYLE.heatRed}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
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
        HIGH POWER WIRE-WOUND COIL
      </text>

      <text
        x={LABEL.subtitle.x}
        y={LABEL.subtitle.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="10"
      >
        High power • thermal stability • heat dissipation
      </text>
    </g>
  );
}

function ColorBands() {
  return (
    <g>
      {COLOR_BANDS.map((band, index) => (
        <rect
          key={`wire-wound-band-${index}`}
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

function PowerMarkers() {
  return (
    <g>
      <circle cx="222" cy="118" r="4" fill={STYLE.heatOrange} opacity="0.9" />
      <circle cx="538" cy="212" r="4" fill={STYLE.heatOrange} opacity="0.9" />
    </g>
  );
}

export function WireWoundFixedResistorVisual({
  type,
  heatLevel,
}: FixedTypeVisualProps) {
  const safeHeat = clamp01(heatLevel);
  const glowOpacity = 0.08 + safeHeat * 0.35;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <motion.g
      aria-label={LABEL.aria}
      transform={canvasTransform}
      animate={{
        scale: safeHeat > 0.55 ? [1, 1.015, 1] : 1,
      }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <HeatGlow glowOpacity={glowOpacity} />

      <ResistorBody bodyColor={type.bodyColor} />

      <CeramicCore />

      <Winding layerColor={type.layerColor} safeHeat={safeHeat} />

      <HeatWaves safeHeat={safeHeat} />

      <TextLabels />

      <ColorBands />

      <PowerMarkers />
    </motion.g>
  );
}
