"use client";

import { motion } from "framer-motion";

import type { ResistorTypeVisualProps } from "./types";

const VIEW_BOX = "0 0 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistorBody: 1,
  carbonCore: 1,
  colorBands: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  bodyCool: "#f2c879",
  bodyHot: "#f4b96a",
  stroke: "#111827",
  carbon: "#1f2937",
  channelOne: "#334155",
  channelTwo: "#475569",
  electron: "#0ea5e9",
  noise: "#38bdf8",
  heat: "#f97316",
  badge: "#92400e",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

type CarbonParticle = Point & {
  r: number;
  o: number;
};

type NoiseSpark = Point & {
  d: number;
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

  carbonCore: {
    x: 225,
    y: 128,
    width: 318,
    height: 72,
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
  carbonCore: scaleComponent(
    BASE_COMPONENT.carbonCore,
    CIRCUIT_COMPONENT_SCALE.carbonCore,
  ),
  colorBands: scaleComponent(
    BASE_COMPONENT.colorBands,
    CIRCUIT_COMPONENT_SCALE.colorBands,
  ),
} as const;

const NODE = {
  bodyCenter: pointOnComponent(COMPONENT.resistorBody, 0.5, 0.5),
  bodyLeft: pointOnComponent(COMPONENT.resistorBody, 0, 0.5),
  bodyRight: pointOnComponent(COMPONENT.resistorBody, 1, 0.5),

  badgeLeft: { x: 222, y: 118 },
  badgeRight: { x: 535, y: 202 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const PATH = {
  unevenBinder:
    "M225 160 C238 128 281 134 310 141 C345 150 374 127 410 138 C448 149 492 132 533 154 C546 162 543 183 525 188 C482 200 444 179 404 186 C365 193 332 178 298 185 C264 192 229 188 225 160Z",

  binderShade:
    "M240 154 C270 133 305 155 334 148 C377 138 417 153 458 145 C490 139 522 145 537 164",

  channelOne:
    "M230 158 C258 148 278 171 305 160 C334 148 350 176 378 160 C406 143 433 172 462 158 C486 147 509 164 535 156",

  channelTwo:
    "M235 174 C265 188 288 154 315 169 C350 188 370 146 400 164 C430 181 454 150 486 166 C506 176 520 171 540 163",

  electronHint:
    "M235 160 C265 145 285 177 315 158 C345 140 366 178 395 160 C425 145 450 176 480 158 C505 146 520 166 545 158",
} as const;

const LABEL = {
  aria: "Carbon composition resistor visual showing granular carbon mixture, noise, and lower precision",
} as const;

const CARBON_PARTICLES: CarbonParticle[] = [
  { x: 228, y: 142, r: 2.4, o: 0.45 },
  { x: 242, y: 170, r: 1.8, o: 0.38 },
  { x: 265, y: 132, r: 2.2, o: 0.5 },
  { x: 284, y: 178, r: 1.5, o: 0.35 },
  { x: 306, y: 148, r: 2.8, o: 0.48 },
  { x: 332, y: 166, r: 1.9, o: 0.42 },
  { x: 352, y: 138, r: 1.6, o: 0.35 },
  { x: 374, y: 180, r: 2.4, o: 0.46 },
  { x: 398, y: 145, r: 1.7, o: 0.36 },
  { x: 420, y: 171, r: 2.7, o: 0.5 },
  { x: 446, y: 136, r: 1.8, o: 0.4 },
  { x: 468, y: 184, r: 2.1, o: 0.44 },
  { x: 492, y: 150, r: 2.6, o: 0.48 },
  { x: 516, y: 170, r: 1.5, o: 0.34 },
  { x: 535, y: 143, r: 2.2, o: 0.43 },
  { x: 252, y: 154, r: 1.2, o: 0.28 },
  { x: 292, y: 160, r: 1.4, o: 0.3 },
  { x: 318, y: 182, r: 1.1, o: 0.25 },
  { x: 360, y: 156, r: 1.3, o: 0.32 },
  { x: 392, y: 176, r: 1.2, o: 0.28 },
  { x: 430, y: 154, r: 1.5, o: 0.31 },
  { x: 456, y: 166, r: 1.1, o: 0.27 },
  { x: 486, y: 180, r: 1.3, o: 0.32 },
  { x: 522, y: 160, r: 1.2, o: 0.28 },
];

const NOISE_SPARKS: NoiseSpark[] = [
  { x: 275, y: 145, d: 0 },
  { x: 340, y: 175, d: 0.35 },
  { x: 410, y: 150, d: 0.7 },
  { x: 485, y: 170, d: 1.05 },
];

const COLOR_BANDS = [
  { x: 245, color: "#ef4444" },
  { x: 300, color: "#111827" },
  { x: 355, color: "#f59e0b" },
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
      fill={STYLE.heat}
      opacity={glowOpacity}
      animate={{
        opacity: [glowOpacity * 0.65, glowOpacity, glowOpacity * 0.65],
      }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ResistorBody({
  bodyTint,
  selectedColor,
}: {
  bodyTint: string;
  selectedColor: string;
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

      <path d={PATH.unevenBinder} fill={selectedColor} opacity="0.18" />

      <path
        d={PATH.binderShade}
        fill="none"
        stroke="#6b4f2a"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.16"
      />
    </g>
  );
}

function ConductiveChannels() {
  return (
    <g>
      <path
        d={PATH.channelOne}
        fill="none"
        stroke={STYLE.channelOne}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 8"
        opacity="0.26"
      />

      <path
        d={PATH.channelTwo}
        fill="none"
        stroke={STYLE.channelTwo}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 9"
        opacity="0.2"
      />
    </g>
  );
}

function CarbonGranules({
  particleOpacityBoost,
}: {
  particleOpacityBoost: number;
}) {
  return (
    <g>
      {CARBON_PARTICLES.map((particle, index) => (
        <circle
          key={`carbon-particle-${index}`}
          cx={particle.x}
          cy={particle.y}
          r={particle.r}
          fill={STYLE.carbon}
          opacity={Math.min(0.72, particle.o * particleOpacityBoost)}
        />
      ))}
    </g>
  );
}

function NoiseSparks() {
  return (
    <g>
      {NOISE_SPARKS.map((spark, index) => (
        <motion.circle
          key={`carbon-noise-${index}`}
          cx={spark.x}
          cy={spark.y}
          r="2.4"
          fill="#e0f2fe"
          stroke={STYLE.noise}
          strokeWidth="1"
          initial={{ opacity: 0.15, scale: 0.8 }}
          animate={{
            opacity: [0.12, 0.85, 0.18],
            scale: [0.8, 1.25, 0.85],
          }}
          transition={{
            duration: 1.25,
            repeat: Infinity,
            delay: spark.d,
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  );
}

function ElectronHintPath() {
  return (
    <motion.path
      d={PATH.electronHint}
      fill="none"
      stroke={STYLE.electron}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="3 14"
      opacity="0.55"
      animate={{ strokeDashoffset: [0, -34] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
    />
  );
}

function ColorBands() {
  return (
    <g>
      {COLOR_BANDS.map((band, index) => (
        <rect
          key={`carbon-band-${index}`}
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

function VisualBadges() {
  return (
    <g opacity="0.9">
      <circle
        cx={NODE.badgeLeft.x}
        cy={NODE.badgeLeft.y}
        r="4"
        fill={STYLE.badge}
      />
      <circle
        cx={NODE.badgeRight.x}
        cy={NODE.badgeRight.y}
        r="4"
        fill={STYLE.badge}
      />
    </g>
  );
}

export function CarbonCompositionResistorVisual({
  selected,
  heat,
}: ResistorTypeVisualProps) {
  const safeHeat = clamp01(heat);

  const bodyTint = safeHeat > 0.55 ? STYLE.bodyHot : STYLE.bodyCool;
  const glowOpacity = 0.08 + safeHeat * 0.22;
  const particleOpacityBoost = 1 + safeHeat * 0.55;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <g aria-label={LABEL.aria} transform={canvasTransform}>
      <HeatGlow glowOpacity={glowOpacity} />
      <ResistorBody bodyTint={bodyTint} selectedColor={selected.color} />
      <ConductiveChannels />
      <CarbonGranules particleOpacityBoost={particleOpacityBoost} />
      <NoiseSparks />
      <ElectronHintPath />
      <ColorBands />
      <VisualBadges />
    </g>
  );
}
