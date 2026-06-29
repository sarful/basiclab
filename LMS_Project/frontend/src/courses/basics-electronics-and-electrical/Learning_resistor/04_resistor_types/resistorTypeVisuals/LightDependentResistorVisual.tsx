"use client";

import { motion } from "framer-motion";

import type { ResistorTypeVisualProps } from "./types";

const VIEW_BOX = "0 0 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistorBody: 1,
  sensorWindow: 1,
  activeMaterial: 1,
  colorBands: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#334155",
  stroke: "#111827",
  body: "#fde68a",
  sensor: "#fefce8",
  light: "#facc15",
  lightRay: "#eab308",
  track: "#854d0e",
  current: "#38bdf8",
  carrier: "#e0f2fe",
  carrierStroke: "#0ea5e9",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

type LightRay = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
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

  sensorWindow: {
    x: 222,
    y: 134,
    width: 316,
    height: 52,
    rotate: 0,
  },

  activeMaterial: {
    x: 232,
    y: 142,
    width: 296,
    height: 36,
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
  sensorWindow: scaleComponent(
    BASE_COMPONENT.sensorWindow,
    CIRCUIT_COMPONENT_SCALE.sensorWindow,
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
  sensorCenter: pointOnComponent(COMPONENT.sensorWindow, 0.5, 0.5),

  markerLeft: { x: 224, y: 119 },
  markerRight: { x: 536, y: 201 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const PATH = {
  cadmiumTracks: [
    "M238 160 C252 132 274 188 288 160",
    "M288 160 C302 132 324 188 338 160",
    "M338 160 C352 132 374 188 388 160",
    "M388 160 C402 132 424 188 438 160",
    "M438 160 C452 132 474 188 488 160",
    "M488 160 C502 132 524 188 538 160",
  ],

  currentFlow: "M235 160 H540",
} as const;

const LIGHT_RAYS: LightRay[] = [
  { x1: 270, y1: 62, x2: 322, y2: 116, delay: 0 },
  { x1: 350, y1: 52, x2: 376, y2: 116, delay: 0.15 },
  { x1: 430, y1: 52, x2: 414, y2: 116, delay: 0.3 },
  { x1: 510, y1: 62, x2: 466, y2: 116, delay: 0.45 },
];

const COLOR_BANDS = [
  { x: 245, color: "#ef4444" },
  { x: 300, color: "#111827" },
  { x: 355, color: "#f59e0b" },
  { x: 500, color: "#d4af37" },
] as const;

const LABEL = {
  aria: "Light dependent resistor visual showing light-sensitive resistance change",
  status: { x: 380, y: 218 },
} as const;

function LightAura({ glowOpacity }: { glowOpacity: number }) {
  return (
    <motion.rect
      x={COMPONENT.resistorBody.x - 6}
      y={COMPONENT.resistorBody.y - 7}
      width={COMPONENT.resistorBody.width + 12}
      height={COMPONENT.resistorBody.height + 14}
      rx={(COMPONENT.resistorBody.height + 14) / 2}
      fill={STYLE.light}
      opacity={glowOpacity}
      animate={{
        opacity: [glowOpacity * 0.55, glowOpacity, glowOpacity * 0.55],
      }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function LdrBody({
  selectedColor,
  activeOpacity,
}: {
  selectedColor: string;
  activeOpacity: number;
}) {
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
        x={COMPONENT.sensorWindow.x}
        y={COMPONENT.sensorWindow.y}
        width={COMPONENT.sensorWindow.width}
        height={COMPONENT.sensorWindow.height}
        rx={COMPONENT.sensorWindow.height / 2}
        fill={STYLE.sensor}
        stroke={selectedColor}
        strokeWidth="2"
        strokeDasharray="6 6"
      />

      <rect
        x={COMPONENT.activeMaterial.x}
        y={COMPONENT.activeMaterial.y}
        width={COMPONENT.activeMaterial.width}
        height={COMPONENT.activeMaterial.height}
        rx={COMPONENT.activeMaterial.height / 2}
        fill={selectedColor}
        opacity={activeOpacity}
      />
    </g>
  );
}

function CadmiumTrack() {
  return (
    <g>
      {PATH.cadmiumTracks.map((path, index) => (
        <path
          key={`ldr-track-${index}`}
          d={path}
          fill="none"
          stroke={STYLE.track}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
      ))}
    </g>
  );
}

function LightBeams({ lightStrength }: { lightStrength: number }) {
  return (
    <motion.g
      opacity={0.25 + lightStrength * 0.75}
      animate={{
        opacity: [
          0.25 + lightStrength * 0.45,
          0.45 + lightStrength * 0.55,
          0.25 + lightStrength * 0.45,
        ],
      }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
    >
      {LIGHT_RAYS.map((ray, index) => (
        <motion.line
          key={`ldr-light-ray-${index}`}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke={STYLE.lightRay}
          strokeWidth={3 + lightStrength * 3}
          strokeLinecap="round"
          animate={{ y2: [ray.y2 - 3, ray.y2 + 3, ray.y2 - 3] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: ray.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.g>
  );
}

function CurrentPath({
  lightPercent,
  lightStrength,
  flowSpeed,
}: {
  lightPercent: number;
  lightStrength: number;
  flowSpeed: number;
}) {
  return (
    <motion.path
      d={PATH.currentFlow}
      fill="none"
      stroke={STYLE.current}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray={lightPercent > 55 ? "5 12" : "4 22"}
      opacity={0.45 + lightStrength * 0.45}
      animate={{ strokeDashoffset: [0, -46] }}
      transition={{ duration: flowSpeed, repeat: Infinity, ease: "linear" }}
    />
  );
}

function ChargeCarriers({ lightStrength }: { lightStrength: number }) {
  return (
    <g>
      {Array.from({ length: 8 }).map((_, index) => {
        const x = 250 + index * 36;

        return (
          <motion.circle
            key={`ldr-carrier-${index}`}
            cx={x}
            cy={160 + (index % 2 === 0 ? -8 : 8)}
            r={2 + lightStrength * 1.4}
            fill={STYLE.carrier}
            stroke={STYLE.carrierStroke}
            strokeWidth="1"
            opacity={0.2 + lightStrength * 0.65}
            animate={{
              opacity: [
                0.2 + lightStrength * 0.35,
                0.65 + lightStrength * 0.35,
                0.2 + lightStrength * 0.35,
              ],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.08,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </g>
  );
}

function ColorBands() {
  return (
    <g>
      {COLOR_BANDS.map((band, index) => (
        <rect
          key={`ldr-band-${index}`}
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

function SensorMarkers() {
  return (
    <g>
      <circle
        cx={NODE.markerLeft.x}
        cy={NODE.markerLeft.y}
        r="4"
        fill={STYLE.lightRay}
        opacity="0.9"
      />
      <circle
        cx={NODE.markerRight.x}
        cy={NODE.markerRight.y}
        r="4"
        fill={STYLE.lightRay}
        opacity="0.9"
      />
    </g>
  );
}

export function LightDependentResistorVisual({
  selected,
  environmentValue,
  heat,
}: ResistorTypeVisualProps) {
  const lightPercent = clampValue(environmentValue, 0, 100);
  const safeHeat = clampValue(heat, 0, 1);

  const lightStrength = lightPercent / 100;
  const resistancePercent = Math.round(100 - lightPercent * 0.85);
  const flowSpeed = lightPercent > 70 ? 0.8 : lightPercent > 35 ? 1.25 : 1.9;
  const glowOpacity = 0.08 + lightStrength * 0.35 + safeHeat * 0.08;
  const activeOpacity = 0.18 + lightStrength * 0.38;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <g aria-label={LABEL.aria} transform={canvasTransform}>
      <LightAura glowOpacity={glowOpacity} />

      <LdrBody selectedColor={selected.color} activeOpacity={activeOpacity} />

      <CadmiumTrack />

      <LightBeams lightStrength={lightStrength} />

      <CurrentPath
        lightPercent={lightPercent}
        lightStrength={lightStrength}
        flowSpeed={flowSpeed}
      />

      <ChargeCarriers lightStrength={lightStrength} />

      <text
        x={LABEL.status.x}
        y={LABEL.status.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="12"
        fontWeight="800"
      >
        Light: {lightPercent}% • Resistance: ~{resistancePercent}%
      </text>

      <ColorBands />

      <SensorMarkers />
    </g>
  );
}
