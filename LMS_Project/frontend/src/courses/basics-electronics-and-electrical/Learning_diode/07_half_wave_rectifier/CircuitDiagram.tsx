"use client";

import {
  ACVoltageSourceSymbol as LibraryACVoltageSourceSymbol,
  DiodeSymbol as LibraryDiodeSymbol,
  LEDSymbol as LibraryLedSymbol,
  ResistorSymbol as LibraryResistorSymbol,
} from "@/src/library";

import type { WavePoint } from "./types";

const VIEW_BOX = "0 0 760 420";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 420;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  diode: 1,
  resistor: 1,
  led: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#94a3b8",
  wire: "#111827",
  active: "#16a34a",
  recovery: "#f97316",
  danger: "#ef4444",
  ledGlow: "#facc15",
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

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

function getWireStroke(active: boolean, recovery: boolean) {
  if (recovery) return STYLE.recovery;
  return active ? STYLE.active : STYLE.wire;
}

const BASE_COMPONENT = {
  source: {
    x: 48,
    y: 160,
    width: 84,
    height: 110,
    rotate: 0,
  },

  diode: {
    x: 230,
    y: 81,
    width: 140,
    height: 66,
    rotate: 0,
  },

  resistor: {
    x: 560,
    y: 135,
    width: 110,
    height: 54,
    rotate: 90,
  },

  led: {
    x: 567,
    y: 220,
    width: 110,
    height: 76,
    rotate: 90,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  diode: scaleComponent(BASE_COMPONENT.diode, CIRCUIT_COMPONENT_SCALE.diode),
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
  ),
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
} as const;

const NODE = {
  sourceTop: { x: 90, y: 162 },
  sourceBottom: { x: 90, y: 268 },
  wireCorner: { x: 90, y: 114 },

  diodeAnode: { x: 250, y: 114 },
  diodeCathode: { x: 370, y: 114 },

  resistorInput: { x: 615, y: 114 },
  resistorTop: { x: 615, y: 145 },
  resistorBottom: { x: 615, y: 190 },

  ledTop: { x: 615, y: 205 },
  ledBottom: { x: 615, y: 315 },
  ledBottomTail: { x: 615, y: 345 },

  sourceCenter: pointOnComponent(COMPONENT.source, 0.5, 0.5),
  diodeCenter: pointOnComponent(COMPONENT.diode, 0.5, 0.5),
  resistorCenter: pointOnComponent(COMPONENT.resistor, 0.5, 0.5),
  ledCenter: pointOnComponent(COMPONENT.led, 0.5, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  forwardPath: [
    NODE.sourceTop,
    NODE.wireCorner,
    { x: NODE.diodeAnode.x + 10, y: NODE.diodeAnode.y },
  ],

  diodeToResistor: [
    { x: NODE.diodeCathode.x - 30, y: NODE.diodeCathode.y },
    NODE.resistorInput,
    NODE.resistorTop,
  ],

  resistorToLed: [
    { x: NODE.resistorBottom.x, y: NODE.resistorBottom.y - 10 },
    { x: NODE.ledTop.x, y: NODE.ledTop.y + 15 },
  ],

  ledToBottomTail: [
    { x: NODE.ledBottom.x, y: NODE.ledBottom.y - 20 },
    NODE.ledBottomTail,
  ],

  returnPath: [
    NODE.ledBottomTail,
    { x: NODE.sourceBottom.x, y: NODE.ledBottomTail.y },
    NODE.sourceBottom,
  ],
} as const;

function WirePath({
  points,
  active,
  recovery,
}: {
  points: readonly Point[];
  active: boolean;
  recovery: boolean;
}) {
  return (
    <path
      d={pathD(points)}
      fill="none"
      stroke={getWireStroke(active, recovery)}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={active || recovery ? 1 : 0.78}
    />
  );
}

function AcSource() {
  return (
    <g>
      <g
        transform={`translate(${COMPONENT.source.x} ${COMPONENT.source.y}) rotate(${COMPONENT.source.rotate} ${COMPONENT.source.width / 2} ${COMPONENT.source.height / 2})`}
      >
        <LibraryACVoltageSourceSymbol
          width={COMPONENT.source.width}
          height={COMPONENT.source.height}
          label="AC voltage source"
        />
      </g>
    </g>
  );
}

function RectifierDiode({
  conducting,
  reverseRecovery,
}: {
  conducting: boolean;
  reverseRecovery: boolean;
}) {
  const accent = reverseRecovery
    ? STYLE.recovery
    : conducting
      ? STYLE.active
      : STYLE.muted;

  return (
    <g>
      {(conducting || reverseRecovery) && (
        <circle
          cx={NODE.diodeCenter.x}
          cy={NODE.diodeCenter.y}
          r={Math.max(22, COMPONENT.diode.width * 0.26)}
          fill={accent}
          opacity={conducting ? 0.18 : 0.14}
        />
      )}

      <g
        transform={`translate(${COMPONENT.diode.x} ${COMPONENT.diode.y}) rotate(${COMPONENT.diode.rotate} ${COMPONENT.diode.width / 2} ${COMPONENT.diode.height / 2})`}
      >
        <LibraryDiodeSymbol
          width={COMPONENT.diode.width}
          height={COMPONENT.diode.height}
          label="Rectifier diode"
        />
      </g>

      {(conducting || reverseRecovery) && (
        <path
          d={`M${NODE.diodeAnode.x + COMPONENT.diode.width * 0.14} ${
            NODE.diodeAnode.y
          } H${NODE.diodeCathode.x - COMPONENT.diode.width * 0.27}`}
          fill="none"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
      )}
    </g>
  );
}

function LoadResistor() {
  return (
    <g
      transform={`translate(${COMPONENT.resistor.x} ${COMPONENT.resistor.y}) rotate(${COMPONENT.resistor.rotate} ${COMPONENT.resistor.width / 2} ${COMPONENT.resistor.height / 2})`}
    >
      <LibraryResistorSymbol
        width={COMPONENT.resistor.width}
        height={COMPONENT.resistor.height}
        label="Load resistor"
      />
    </g>
  );
}

function LedLoad({
  on,
  blown,
  intensity,
}: {
  on: boolean;
  blown: boolean;
  intensity: number;
}) {
  const level = clamp01(intensity);
  const centerX = NODE.ledTop.x;
  const centerY = (NODE.ledTop.y + NODE.ledBottom.y) / 2;

  return (
    <g>
      {on && !blown && (
        <>
          <circle
            cx={centerX}
            cy={centerY}
            r={36 + level * 24}
            fill={STYLE.ledGlow}
            opacity={0.12 + level * 0.22}
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={13 + level * 7}
            fill="#fde68a"
            opacity="0.65"
          />
        </>
      )}

      <g
        transform={`translate(${COMPONENT.led.x} ${COMPONENT.led.y}) rotate(${COMPONENT.led.rotate} ${COMPONENT.led.width / 2} ${COMPONENT.led.height / 2})`}
      >
        <LibraryLedSymbol
          width={COMPONENT.led.width}
          height={COMPONENT.led.height}
          label="LED load"
        />
      </g>

      {blown && (
        <circle
          cx={centerX}
          cy={centerY}
          r="42"
          fill="none"
          stroke={STYLE.danger}
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      )}
    </g>
  );
}

export function CircuitDiagram({
  point,
}: {
  point: WavePoint;
  diodeDrop: number;
}) {
  const conducting = point.conducting;
  const reverseRecovery = point.reverseRecovery;
  const loadActive = point.ledOn || reverseRecovery || conducting;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
      <svg
        viewBox={VIEW_BOX}
        className="h-auto min-h-[420px] w-full"
        role="img"
        aria-label="Half-wave rectifier symbol-only circuit"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="760" height="420" fill="#ffffff" />

        <g transform={canvasTransform}>
          <WirePath
            points={WIRE.forwardPath}
            active={conducting}
            recovery={reverseRecovery}
          />

          <WirePath
            points={WIRE.diodeToResistor}
            active={conducting}
            recovery={reverseRecovery}
          />

          <WirePath
            points={WIRE.resistorToLed}
            active={loadActive}
            recovery={reverseRecovery}
          />

          <WirePath
            points={WIRE.ledToBottomTail}
            active={loadActive}
            recovery={reverseRecovery}
          />

          <WirePath
            points={WIRE.returnPath}
            active={loadActive}
            recovery={reverseRecovery}
          />

          <AcSource />

          <RectifierDiode
            conducting={conducting}
            reverseRecovery={reverseRecovery}
          />

          <LoadResistor />

          <LedLoad
            on={point.ledOn}
            blown={point.ledBlown}
            intensity={point.ledIntensity}
          />
        </g>
      </svg>
    </div>
  );
}
