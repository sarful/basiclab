"use client";

import { motion } from "framer-motion";

import type { FixedTypeVisualProps } from "./types";

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
  text: "#334155",
  muted: "#64748b",
  stroke: "#111827",
  heat: "#f97316",
  carbon: "#1f2937",
  channelOne: "#334155",
  channelTwo: "#475569",
  electron: "#0ea5e9",
  noise: "#38bdf8",
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

  carbonCore: {
    x: 225,
    y: 132,
    width: 325,
    height: 70,
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
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const PATH = {
  carbonLayer:
    "M225 165 C245 132 288 143 318 151 C350 160 378 136 414 148 C452 160 490 138 535 164 C550 173 540 195 515 196 C474 198 438 181 398 187 C360 193 322 178 288 190 C255 202 225 190 225 165Z",

  channelOne:
    "M235 164 C265 145 285 182 318 163 C352 144 374 184 408 164 C442 145 470 181 502 162 C520 152 530 158 540 166",

  channelTwo:
    "M238 182 C270 198 300 154 334 176 C366 196 392 148 426 170 C458 190 488 158 525 178",

  electronFlow:
    "M232 166 C262 148 292 184 322 164 C352 144 382 186 412 164 C442 145 474 184 506 164 C520 156 532 160 544 166",
} as const;

const LABEL = {
  aria: "Carbon fixed resistor visual showing carbon mixture fixed resistive element",
  title: { x: 380, y: 157 },
  subtitle: { x: 380, y: 176 },
} as const;

const CARBON_PARTICLES: CarbonParticle[] = [
  { x: 235, y: 145, r: 2.2, o: 0.42 },
  { x: 258, y: 172, r: 1.6, o: 0.34 },
  { x: 286, y: 151, r: 2.6, o: 0.48 },
  { x: 322, y: 178, r: 1.8, o: 0.36 },
  { x: 350, y: 145, r: 2.1, o: 0.44 },
  { x: 382, y: 172, r: 1.5, o: 0.32 },
  { x: 414, y: 150, r: 2.5, o: 0.46 },
  { x: 448, y: 180, r: 1.7, o: 0.35 },
  { x: 482, y: 148, r: 2.3, o: 0.43 },
  { x: 516, y: 170, r: 1.6, o: 0.33 },
  { x: 270, y: 160, r: 1.2, o: 0.28 },
  { x: 305, y: 166, r: 1.4, o: 0.3 },
  { x: 338, y: 158, r: 1.1, o: 0.26 },
  { x: 370, y: 184, r: 1.3, o: 0.29 },
  { x: 402, y: 142, r: 1.5, o: 0.31 },
  { x: 436, y: 165, r: 1.2, o: 0.27 },
  { x: 470, y: 176, r: 1.4, o: 0.3 },
  { x: 505, y: 156, r: 1.2, o: 0.27 },
];

const COLOR_BANDS = [
  { x: 245, color: "#ef4444" },
  { x: 300, color: "#111827" },
  { x: 355, color: "#f59e0b" },
  { x: 500, color: "#d4af37" },
] as const;

function HeatGlow() {
  return (
    <motion.rect
      x={COMPONENT.resistorBody.x - 8}
      y={COMPONENT.resistorBody.y - 8}
      width={COMPONENT.resistorBody.width + 16}
      height={COMPONENT.resistorBody.height + 16}
      rx={(COMPONENT.resistorBody.height + 16) / 2}
      fill={STYLE.heat}
      opacity="0.12"
      animate={{ opacity: [0.06, 0.14, 0.06] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ResistorBody({
  bodyColor,
  layerColor,
}: {
  bodyColor: string;
  layerColor: string;
}) {
  return (
    <g>
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

      <path d={PATH.carbonLayer} fill={layerColor} opacity="0.18" />
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
        strokeDasharray="7 9"
        opacity="0.28"
      />

      <path
        d={PATH.channelTwo}
        fill="none"
        stroke={STYLE.channelTwo}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 10"
        opacity="0.2"
      />
    </g>
  );
}

function CarbonGranules() {
  return (
    <g>
      {CARBON_PARTICLES.map((particle, index) => (
        <circle
          key={`carbon-fixed-particle-${index}`}
          cx={particle.x}
          cy={particle.y}
          r={particle.r}
          fill={STYLE.carbon}
          opacity={particle.o}
        />
      ))}
    </g>
  );
}

function ElectronFlowPath() {
  return (
    <motion.path
      d={PATH.electronFlow}
      fill="none"
      stroke={STYLE.electron}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="4 16"
      opacity="0.6"
      animate={{ strokeDashoffset: [0, -44] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
    />
  );
}

function NoiseDots() {
  return (
    <motion.g
      animate={{ opacity: [0.18, 0.75, 0.18] }}
      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle
        cx="292"
        cy="150"
        r="2.4"
        fill="#e0f2fe"
        stroke={STYLE.noise}
        strokeWidth="1"
      />
      <circle
        cx="402"
        cy="178"
        r="2.4"
        fill="#e0f2fe"
        stroke={STYLE.noise}
        strokeWidth="1"
      />
      <circle
        cx="492"
        cy="154"
        r="2.4"
        fill="#e0f2fe"
        stroke={STYLE.noise}
        strokeWidth="1"
      />
    </motion.g>
  );
}

function ColorBands() {
  return (
    <g>
      {COLOR_BANDS.map((band, index) => (
        <rect
          key={`carbon-fixed-band-${index}`}
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
        CARBON MIX RESISTIVE ELEMENT
      </text>

      <text
        x={LABEL.subtitle.x}
        y={LABEL.subtitle.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="10"
      >
        Low cost • fixed value • higher noise
      </text>
    </g>
  );
}

export function CarbonFixedResistorVisual({ type }: FixedTypeVisualProps) {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <g aria-label={LABEL.aria} transform={canvasTransform}>
      <HeatGlow />

      <ResistorBody bodyColor={type.bodyColor} layerColor={type.layerColor} />

      <ConductiveChannels />

      <CarbonGranules />

      <ElectronFlowPath />

      <NoiseDots />

      <TextLabels />

      <ColorBands />
    </g>
  );
}
