"use client";

import { motion } from "framer-motion";

import type { ResistorTypeVisualProps } from "./types";

const VIEW_BOX = "0 0 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistorBody: 1,
  ceramicCore: 1,
  coil: 1,
  colorBands: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  stroke: "#111827",
  bodyCool: "#f2c879",
  bodyHot: "#f6b76a",
  ceramic: "#fef3c7",
  coreShadow: "#92400e",
  coilBase: "#7c2d12",
  coilHighlight: "#fed7aa",
  current: "#38bdf8",
  heatAura: "#fb923c",
  heatRed: "#ef4444",
  heatOrange: "#f97316",
  marker: "#f97316",
} as const;

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

type CoilTurn = {
  x1: number;
  c1: number;
  c2: number;
  x2: number;
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
    x: 190,
    y: 115,
    width: 380,
    height: 90,
    rotate: 0,
  },

  ceramicCore: {
    x: 222,
    y: 134,
    width: 316,
    height: 52,
    rotate: 0,
  },

  coil: {
    x: 232,
    y: 122,
    width: 312,
    height: 76,
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
  ceramicCore: scaleComponent(
    BASE_COMPONENT.ceramicCore,
    CIRCUIT_COMPONENT_SCALE.ceramicCore,
  ),
  coil: scaleComponent(BASE_COMPONENT.coil, CIRCUIT_COMPONENT_SCALE.coil),
  colorBands: scaleComponent(
    BASE_COMPONENT.colorBands,
    CIRCUIT_COMPONENT_SCALE.colorBands,
  ),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const NODE = {
  markerLeft: { x: 224, y: 119 },
  markerRight: { x: 536, y: 201 },
} as const;

const PATH = {
  coil: "M232 160 C248 122 264 198 280 160 C296 122 312 198 328 160 C344 122 360 198 376 160 C392 122 408 198 424 160 C440 122 456 198 472 160 C488 122 504 198 520 160 C528 142 536 148 544 160",

  coreShadow: "M230 171 C280 190 330 178 380 178 C430 178 485 190 530 170",

  heatWaves: [
    { d: "M295 106 C282 88 308 78 295 60", stroke: STYLE.heatRed },
    { d: "M380 106 C367 88 393 78 380 60", stroke: STYLE.heatOrange },
    { d: "M465 106 C452 88 478 78 465 60", stroke: STYLE.heatRed },
  ],
} as const;

const COIL_TURNS: CoilTurn[] = [
  { x1: 236, c1: 248, c2: 264, x2: 276 },
  { x1: 276, c1: 288, c2: 304, x2: 316 },
  { x1: 316, c1: 328, c2: 344, x2: 356 },
  { x1: 356, c1: 368, c2: 384, x2: 396 },
  { x1: 396, c1: 408, c2: 424, x2: 436 },
  { x1: 436, c1: 448, c2: 464, x2: 476 },
  { x1: 476, c1: 488, c2: 504, x2: 516 },
  { x1: 516, c1: 524, c2: 532, x2: 540 },
];

const COLOR_BANDS = [
  { x: 245, color: "#ef4444" },
  { x: 300, color: "#111827" },
  { x: 355, color: "#f59e0b" },
  { x: 500, color: "#d4af37" },
] as const;

const LABEL = {
  aria: "Wire wound resistor visual showing resistive wire coil, high power handling, and heat dissipation",
} as const;

function HeatAura({ glowOpacity }: { glowOpacity: number }) {
  return (
    <motion.rect
      x={COMPONENT.resistorBody.x - 9}
      y={COMPONENT.resistorBody.y - 9}
      width={COMPONENT.resistorBody.width + 18}
      height={COMPONENT.resistorBody.height + 18}
      rx={(COMPONENT.resistorBody.height + 18) / 2}
      fill={STYLE.heatAura}
      opacity={glowOpacity}
      animate={{
        opacity: [glowOpacity * 0.55, glowOpacity, glowOpacity * 0.55],
      }}
      transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ResistorBody({
  bodyTint,
  ceramicOpacity,
}: {
  bodyTint: string;
  ceramicOpacity: number;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.resistorBody.x}
        y={COMPONENT.resistorBody.y}
        width={COMPONENT.resistorBody.width}
        height={COMPONENT.resistorBody.height}
        rx={COMPONENT.resistorBody.height / 2}
        fill={bodyTint}
        stroke={STYLE.stroke}
        strokeWidth={WIRE.width}
      />

      <rect
        x={COMPONENT.ceramicCore.x}
        y={COMPONENT.ceramicCore.y}
        width={COMPONENT.ceramicCore.width}
        height={COMPONENT.ceramicCore.height}
        rx={COMPONENT.ceramicCore.height / 2}
        fill={STYLE.ceramic}
        opacity={ceramicOpacity}
      />

      <path
        d={PATH.coreShadow}
        fill="none"
        stroke={STYLE.coreShadow}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.13"
      />
    </g>
  );
}

function WireCoil({
  selectedColor,
  safeHeat,
}: {
  selectedColor: string;
  safeHeat: number;
}) {
  return (
    <g>
      <path
        d={PATH.coil}
        fill="none"
        stroke={STYLE.coilBase}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.28"
      />

      <motion.path
        d={PATH.coil}
        fill="none"
        stroke={selectedColor}
        strokeWidth="6"
        strokeLinecap="round"
        animate={{
          strokeWidth: safeHeat > 0.55 ? [6, 7.2, 6] : 6,
          opacity: safeHeat > 0.55 ? [0.8, 1, 0.8] : 0.9,
        }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />

      {COIL_TURNS.map((turn, index) => (
        <path
          key={`wire-turn-highlight-${index}`}
          d={`M${turn.x1} 160 C${turn.c1} 126 ${turn.c2} 194 ${turn.x2} 160`}
          fill="none"
          stroke={STYLE.coilHighlight}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
      ))}
    </g>
  );
}

function CurrentPath() {
  return (
    <motion.path
      d={PATH.coil}
      fill="none"
      stroke={STYLE.current}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="4 22"
      opacity="0.85"
      animate={{ strokeDashoffset: [0, -120] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
    />
  );
}

function HeatWaves({ safeHeat }: { safeHeat: number }) {
  return (
    <motion.g
      opacity={0.25 + safeHeat * 0.65}
      animate={{
        y: [0, -5, 0],
        opacity: [
          0.25 + safeHeat * 0.45,
          0.45 + safeHeat * 0.55,
          0.25 + safeHeat * 0.45,
        ],
      }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {PATH.heatWaves.map((wave, index) => (
        <path
          key={`wire-wound-heat-wave-${index}`}
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

function ThermalMarkers() {
  return (
    <g>
      <circle
        cx={NODE.markerLeft.x}
        cy={NODE.markerLeft.y}
        r="4"
        fill={STYLE.marker}
        opacity="0.85"
      />
      <circle
        cx={NODE.markerRight.x}
        cy={NODE.markerRight.y}
        r="4"
        fill={STYLE.marker}
        opacity="0.85"
      />
    </g>
  );
}

export function WireWoundResistorVisual({
  selected,
  heat,
}: ResistorTypeVisualProps) {
  const safeHeat = clamp01(heat);

  const glowOpacity = 0.08 + safeHeat * 0.34;
  const bodyTint = safeHeat > 0.6 ? STYLE.bodyHot : STYLE.bodyCool;
  const ceramicOpacity = 0.85 - safeHeat * 0.15;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <motion.g
      aria-label={LABEL.aria}
      transform={canvasTransform}
      animate={{ scale: safeHeat > 0.55 ? [1, 1.012, 1] : 1 }}
      transition={{ repeat: Infinity, duration: 1.25, ease: "easeInOut" }}
    >
      <HeatAura glowOpacity={glowOpacity} />

      <ResistorBody bodyTint={bodyTint} ceramicOpacity={ceramicOpacity} />

      <WireCoil selectedColor={selected.color} safeHeat={safeHeat} />

      <CurrentPath />

      <HeatWaves safeHeat={safeHeat} />

      <ColorBands />

      <ThermalMarkers />
    </motion.g>
  );
}
