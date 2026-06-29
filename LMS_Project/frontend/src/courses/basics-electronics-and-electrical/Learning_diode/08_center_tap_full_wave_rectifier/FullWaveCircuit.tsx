"use client";

import {
  ACVoltageSourceSymbol as LibraryACVoltageSourceSymbol,
  DiodeSymbol as LibraryDiodeSymbol,
  LEDSymbol as LibraryLedSymbol,
} from "@/src/library";

import { ElectronFlow } from "./ElectronFlow";
import type { WavePoint } from "./types";

const VIEW_BOX = "0 0 760 460";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 460;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  d1: 1,
  d2: 1,
  led: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#16a34a",
  inactive: "#94a3b8",
  active: "#16a34a",
  d1: "#2563eb",
  d2: "#f97316",
  ledGlow: "#facc15",
  danger: "#ef4444",
  electron: "#0ea5e9",
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

function getWireStroke(active: boolean) {
  return active ? STYLE.active : STYLE.wire;
}

const BASE_COMPONENT = {
  source: {
    x: 48,
    y: 175,
    width: 84,
    height: 110,
    rotate: 0,
  },

  d1: {
    x: 255,
    y: 77,
    width: 155,
    height: 66,
    rotate: 0,
  },

  led: {
    x: 265,
    y: 200,
    width: 150,
    height: 76,
    rotate: 180,
  },

  d2: {
    x: 255,
    y: 317,
    width: 155,
    height: 66,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  d1: scaleComponent(BASE_COMPONENT.d1, CIRCUIT_COMPONENT_SCALE.d1),
  d2: scaleComponent(BASE_COMPONENT.d2, CIRCUIT_COMPONENT_SCALE.d2),
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
} as const;

const NODE = {
  sourceTop: { x: 90, y: 110 },
  sourceMid: { x: 90, y: 230 },
  sourceBottom: { x: 90, y: 350 },

  d1Anode: { x: 280, y: 110 },
  d1Cathode: { x: 400, y: 110 },

  d2Anode: { x: 280, y: 350 },
  d2Cathode: { x: 400, y: 350 },

  ledLeft: { x: 380, y: 230 },
  ledRight: { x: 290, y: 230 },

  rightTop: { x: 650, y: 110 },
  rightMid: { x: 650, y: 230 },
  rightBottom: { x: 650, y: 350 },

  sourceSymbolCenter: pointOnComponent(COMPONENT.source, 0.5, 0.5),
  d1Center: pointOnComponent(COMPONENT.d1, 0.5, 0.5),
  d2Center: pointOnComponent(COMPONENT.d2, 0.5, 0.5),
  ledCenter: pointOnComponent(COMPONENT.led, 0.5, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  d1Input: [NODE.sourceTop, { x: NODE.d1Anode.x + 10, y: NODE.d1Anode.y }],
  d1OutputToLed: [
    { x: NODE.d1Cathode.x - 30, y: NODE.d1Cathode.y },
    NODE.rightTop,
    NODE.rightMid,
    { x: NODE.ledLeft.x - 10, y: NODE.ledLeft.y },
  ],

  d2Input: [NODE.sourceBottom, { x: NODE.d2Anode.x + 10, y: NODE.d2Anode.y }],
  d2OutputToLed: [
    { x: NODE.d2Cathode.x - 30, y: NODE.d2Cathode.y },
    NODE.rightBottom,
    NODE.rightMid,
  ],

  ledReturn: [{ x: NODE.ledRight.x + 10, y: NODE.ledRight.y }, NODE.sourceMid],

  sourceCenterLine: [NODE.sourceTop, NODE.sourceBottom],
} as const;

const LABEL = {
  title: { x: 34, y: 36 },
  subtitle: { x: 34, y: 60 },
  source: { x: 90, y: 160 },
  vf: { x: 255, y: 160 },
  statusBox: { x: 46, y: 405, width: 668, height: 34 },
  statusText: { x: 380, y: 427 },
} as const;

const D1_FLOW_PATH: Point[] = [
  NODE.sourceTop,
  NODE.d1Anode,
  NODE.d1Cathode,
  NODE.rightTop,
  NODE.rightMid,
  NODE.ledLeft,
  NODE.ledRight,
  NODE.sourceMid,
];

const D2_FLOW_PATH: Point[] = [
  NODE.sourceBottom,
  NODE.d2Anode,
  NODE.d2Cathode,
  NODE.rightBottom,
  NODE.rightMid,
  NODE.ledLeft,
  NODE.ledRight,
  NODE.sourceMid,
];

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

function WirePath({
  points,
  active,
}: {
  points: readonly Point[];
  active: boolean;
}) {
  return (
    <path
      d={pathD(points)}
      fill="none"
      stroke={getWireStroke(active)}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={active ? 1 : 0.75}
    />
  );
}

function NodeDot({ x, y, active = false }: Point & { active?: boolean }) {
  return (
    <circle
      cx={x}
      cy={y}
      r="5"
      fill={active ? STYLE.active : STYLE.text}
      opacity={active ? 1 : 0.9}
    />
  );
}

function AcSource() {
  return (
    <g>
      <text
        x={LABEL.source.x}
        y={LABEL.source.y}
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        fill={STYLE.text}
      >
        AC Source
      </text>

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
  component,
  label,
  active,
  activeColor,
}: {
  component: ComponentBox;
  label: "D1" | "D2";
  active: boolean;
  activeColor: string;
}) {
  return (
    <g>
      {active && (
        <circle
          cx={component.x + component.width / 2}
          cy={component.y + component.height / 2}
          r="42"
          fill={activeColor}
          opacity="0.16"
        />
      )}

      <g
        transform={`translate(${component.x} ${component.y}) rotate(${component.rotate} ${component.width / 2} ${component.height / 2})`}
        opacity={active ? 1 : 0.6}
      >
        <LibraryDiodeSymbol
          width={component.width}
          height={component.height}
          label={`${label} rectifier diode`}
        />
      </g>

      <text
        x={component.x + component.width / 2}
        y={component.y - 12}
        textAnchor="middle"
        fontSize="14"
        fontWeight="900"
        fill={active ? STYLE.active : STYLE.text}
      >
        {label}
      </text>
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

  return (
    <g>
      {on && !blown && (
        <>
          <circle
            cx={NODE.ledCenter.x}
            cy={NODE.ledCenter.y}
            r={36 + level * 26}
            fill={STYLE.ledGlow}
            opacity={0.12 + level * 0.25}
          />
          <circle
            cx={NODE.ledCenter.x}
            cy={NODE.ledCenter.y}
            r={13 + level * 8}
            fill="#fde68a"
            opacity="0.65"
          />
        </>
      )}

      {blown && (
        <circle
          cx={NODE.ledCenter.x}
          cy={NODE.ledCenter.y}
          r="46"
          fill="none"
          stroke={STYLE.danger}
          strokeWidth="2"
          strokeDasharray="6 6"
        />
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
    </g>
  );
}

export function FullWaveCircuit({
  point,
  diodeDrop,
}: {
  point: WavePoint;
  diodeDrop: number;
}) {
  const d1Active = point.activeDiode === "D1";
  const d2Active = point.activeDiode === "D2";
  const ledActive = point.ledOn && !point.ledBlown;

  const electronColor = point.ledBlown
    ? STYLE.danger
    : d1Active
      ? STYLE.d1
      : d2Active
        ? STYLE.d2
        : STYLE.inactive;

  const label = point.ledBlown
    ? "LED overcurrent risk"
    : d1Active
      ? "Positive half-cycle: D1 conducts through the LED load"
      : d2Active
        ? "Negative half-cycle: D2 conducts through the LED load"
        : "No diode conducting at this instant";

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
      <svg
        viewBox={VIEW_BOX}
        className="h-auto min-h-[460px] w-full"
        role="img"
        aria-label="Full-wave rectifier circuit"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="760" height="460" fill="#ffffff" />

        <g transform={canvasTransform}>
          <text
            x={LABEL.title.x}
            y={LABEL.title.y}
            fontSize="20"
            fontWeight="900"
            fill={STYLE.text}
          >
            Full-Wave Rectifier Circuit
          </text>

          <text
            x={LABEL.subtitle.x}
            y={LABEL.subtitle.y}
            fontSize="13"
            fontWeight="800"
            fill={STYLE.muted}
          >
            D1 conducts on one half-cycle, D2 conducts on the opposite
            half-cycle, LED output remains same polarity.
          </text>

          <WirePath points={WIRE.d1Input} active={d1Active} />
          <WirePath points={WIRE.d1OutputToLed} active={d1Active} />

          <WirePath points={WIRE.d2Input} active={d2Active} />
          <WirePath points={WIRE.d2OutputToLed} active={d2Active} />

          <WirePath points={WIRE.ledReturn} active={ledActive} />
          <WirePath
            points={WIRE.sourceCenterLine}
            active={d1Active || d2Active}
          />

          <NodeDot {...NODE.rightTop} active={d1Active} />
          <NodeDot {...NODE.rightMid} active={ledActive} />
          <NodeDot {...NODE.rightBottom} active={d2Active} />

          <AcSource />

          <RectifierDiode
            component={COMPONENT.d1}
            label="D1"
            active={d1Active}
            activeColor={STYLE.d1}
          />

          <LedLoad
            on={point.ledOn}
            blown={point.ledBlown}
            intensity={point.ledIntensity}
          />

          <RectifierDiode
            component={COMPONENT.d2}
            label="D2"
            active={d2Active}
            activeColor={STYLE.d2}
          />

          <ElectronFlow
            active={d1Active}
            path={D1_FLOW_PATH}
            color={electronColor}
            count={point.ledBlown ? 6 : 5}
          />

          <ElectronFlow
            active={d2Active}
            path={D2_FLOW_PATH}
            color={electronColor}
            count={point.ledBlown ? 6 : 5}
          />

          <text
            x={LABEL.vf.x}
            y={LABEL.vf.y}
            fontSize="12"
            fontWeight="900"
            fill={STYLE.muted}
          >
            Vf ≈ {diodeDrop.toFixed(2)}V
          </text>

          <rect
            x={LABEL.statusBox.x}
            y={LABEL.statusBox.y}
            width={LABEL.statusBox.width}
            height={LABEL.statusBox.height}
            rx="14"
            fill={ledActive ? "#dcfce7" : "#f1f5f9"}
            stroke={ledActive ? "#22c55e" : "#cbd5e1"}
          />

          <text
            x={LABEL.statusText.x}
            y={LABEL.statusText.y}
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            fill={ledActive ? "#15803d" : STYLE.muted}
          >
            {label} · Vout: {point.vout.toFixed(2)}V · I_LED:{" "}
            {(point.current * 1000).toFixed(2)}mA
          </text>
        </g>
      </svg>
    </div>
  );
}
