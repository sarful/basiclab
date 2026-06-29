"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { clamp, formatNumber, formatResistance } from "./logic";
import type { ThermistorMode } from "./types";

type ThermistorVisualProps = {
  mode: ThermistorMode;
  temperature: number;
  resistance: number;
  voltage: number;
};

const VIEW_BOX = "0 0 780 390";
const VIEW_BOX_WIDTH = 780;
const VIEW_BOX_HEIGHT = 390;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  thermistor: 1,
  fan: 1,
  tempBar: 1,
  currentBar: 1,
  heatBar: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#334155",
  muted: "#64748b",
  wire: "#64748b",
  source: "#0f172a",
  current: "#22c55e",
  currentStroke: "#dcfce7",
  ntc: "#2563eb",
  ptc: "#f97316",
  heat: "#f97316",
  danger: "#ef4444",
  fan: "#0891b2",
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

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  source: {
    x: 40,
    y: 120,
    width: 92,
    height: 92,
    rotate: 0,
  },

  thermistor: {
    x: 300,
    y: 130,
    width: 130,
    height: 72,
    rotate: 0,
  },

  fan: {
    x: 615,
    y: 82,
    width: 90,
    height: 90,
    rotate: 0,
  },

  tempBar: {
    x: 135,
    y: 330,
    width: 150,
    height: 9,
    rotate: 0,
  },

  currentBar: {
    x: 315,
    y: 330,
    width: 150,
    height: 9,
    rotate: 0,
  },

  heatBar: {
    x: 495,
    y: 330,
    width: 150,
    height: 9,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  thermistor: scaleComponent(
    BASE_COMPONENT.thermistor,
    CIRCUIT_COMPONENT_SCALE.thermistor,
  ),
  fan: scaleComponent(BASE_COMPONENT.fan, CIRCUIT_COMPONENT_SCALE.fan),
  tempBar: scaleComponent(
    BASE_COMPONENT.tempBar,
    CIRCUIT_COMPONENT_SCALE.tempBar,
  ),
  currentBar: scaleComponent(
    BASE_COMPONENT.currentBar,
    CIRCUIT_COMPONENT_SCALE.currentBar,
  ),
  heatBar: scaleComponent(
    BASE_COMPONENT.heatBar,
    CIRCUIT_COMPONENT_SCALE.heatBar,
  ),
} as const;

const NODE = {
  sourcePositive: { x: 132, y: 166 },
  sourceNegative: { x: 86, y: 212 },

  thermistorLeftWire: { x: 224, y: 166 },
  thermistorLeft: pointOnComponent(COMPONENT.thermistor, 0, 0.5),
  thermistorRight: pointOnComponent(COMPONENT.thermistor, 1, 0.5),
  thermistorRightWire: { x: 502, y: 166 },

  returnRightTop: { x: 650, y: 166 },
  returnRightBottom: { x: 650, y: 252 },
  returnLeftBottom: { x: 86, y: 252 },

  fanCenter: { x: 660, y: 127 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  sourceToThermistor: [NODE.sourcePositive, NODE.thermistorLeftWire],
  thermistorLeftLead: [NODE.thermistorLeftWire, NODE.thermistorLeft],
  thermistorRightLead: [NODE.thermistorRight, NODE.thermistorRightWire],

  returnPath: [
    NODE.thermistorRightWire,
    NODE.returnRightTop,
    NODE.returnRightBottom,
    NODE.returnLeftBottom,
    NODE.sourceNegative,
  ],
} as const;

const PATH = {
  currentFlow: pathD([
    NODE.sourcePositive,
    NODE.thermistorLeftWire,
    NODE.thermistorLeft,
    NODE.thermistorRight,
    NODE.thermistorRightWire,
    NODE.returnRightTop,
    NODE.returnRightBottom,
    NODE.returnLeftBottom,
    NODE.sourceNegative,
  ]),

  thermistorSlash: "M288 216 L440 105",
  thermistorArrow: "M420 108 H440 V130",

  heatWaves: [
    "M318 112 C302 88 334 78 318 54",
    "M370 106 C354 82 386 72 370 48",
    "M422 112 C406 88 438 78 422 54",
  ],
} as const;

const LABEL = {
  title: { x: 390, y: 28 },
  subtitle: { x: 390, y: 48 },

  sourcePlus: { x: 86, y: 150 },
  sourceDc: { x: 86, y: 168 },
  sourceVoltage: { x: 86, y: 190 },
  sourceMinus: { x: 86, y: 207 },

  thermistorMode: { x: 392, y: 114 },
  currentIn: { x: 180, y: 142 },
  currentOut: { x: 575, y: 142 },
  symbolTitle: { x: 365, y: 238 },
  valueText: { x: 365, y: 263 },
} as const;

function WirePath({
  points,
  flowLevel,
}: {
  points: readonly Point[];
  flowLevel: number;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width + flowLevel * 4}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function SourceBlock({ voltage }: { voltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.source.x}
        y={COMPONENT.source.y}
        width={COMPONENT.source.width}
        height={COMPONENT.source.height}
        rx="14"
        fill={STYLE.source}
        stroke="#94a3b8"
        strokeWidth="3"
      />

      <text
        x={LABEL.sourcePlus.x}
        y={LABEL.sourcePlus.y}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="900"
      >
        +
      </text>
      <text
        x={LABEL.sourceDc.x}
        y={LABEL.sourceDc.y}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="16"
        fontWeight="900"
      >
        DC
      </text>
      <text
        x={LABEL.sourceVoltage.x}
        y={LABEL.sourceVoltage.y}
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="14"
        fontWeight="900"
      >
        {formatNumber(voltage, 1)}V
      </text>
      <text
        x={LABEL.sourceMinus.x}
        y={LABEL.sourceMinus.y}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="900"
      >
        −
      </text>
    </g>
  );
}

function HeatGlow({ heatLevel }: { heatLevel: number }) {
  return (
    <motion.rect
      x={COMPONENT.thermistor.x - 14}
      y={COMPONENT.thermistor.y - 14}
      width={COMPONENT.thermistor.width + 42}
      height={COMPONENT.thermistor.height + 32}
      rx="16"
      fill={STYLE.heat}
      opacity={0.08 + heatLevel * 0.25}
      animate={{
        opacity: [
          0.05 + heatLevel * 0.15,
          0.1 + heatLevel * 0.3,
          0.05 + heatLevel * 0.15,
        ],
      }}
      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ThermistorSymbol({
  mode,
  modeColor,
  safeTemperature,
}: {
  mode: ThermistorMode;
  modeColor: string;
  safeTemperature: number;
}) {
  return (
    <motion.g
      animate={{ scale: safeTemperature > 85 ? [1, 1.018, 1] : 1 }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      <WirePath points={WIRE.thermistorLeftLead} flowLevel={0.25} />
      <WirePath points={WIRE.thermistorRightLead} flowLevel={0.25} />

      <rect
        x={COMPONENT.thermistor.x}
        y={COMPONENT.thermistor.y}
        width={COMPONENT.thermistor.width}
        height={COMPONENT.thermistor.height}
        fill="#ffffff"
        stroke="#111827"
        strokeWidth="4"
      />

      <path
        d={PATH.thermistorSlash}
        stroke={modeColor}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d={PATH.thermistorArrow}
        stroke={modeColor}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x={LABEL.thermistorMode.x}
        y={LABEL.thermistorMode.y}
        fill={modeColor}
        fontSize="14"
        fontWeight="900"
      >
        {mode.toUpperCase()}
      </text>
    </motion.g>
  );
}

function HeatWaves({ tempLevel }: { tempLevel: number }) {
  return (
    <motion.g
      opacity={0.25 + tempLevel * 0.7}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
    >
      {PATH.heatWaves.map((path, index) => (
        <path
          key={`thermistor-heat-${index}`}
          d={path}
          stroke={index === 1 ? STYLE.heat : STYLE.danger}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </motion.g>
  );
}

function ParticleFlow({
  particles,
  particleCount,
  currentSpeed,
}: {
  particles: number[];
  particleCount: number;
  currentSpeed: number;
}) {
  return (
    <g>
      {particles.map((index) => (
        <motion.circle
          key={`conventional-current-${particleCount}-${index}`}
          r="4"
          fill={STYLE.current}
          stroke={STYLE.currentStroke}
          strokeWidth="1.5"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: currentSpeed,
            repeat: Infinity,
            ease: "linear",
            delay: index * (currentSpeed / particleCount),
          }}
          style={{ offsetPath: `path('${PATH.currentFlow}')` }}
        />
      ))}
    </g>
  );
}

function FanResponse({
  fanLevel,
  fanStatus,
}: {
  fanLevel: number;
  fanStatus: string;
}) {
  return (
    <g transform={`translate(${COMPONENT.fan.x} ${COMPONENT.fan.y})`}>
      <circle
        cx="45"
        cy="45"
        r="38"
        fill="#ecfeff"
        stroke={STYLE.fan}
        strokeWidth="3"
      />

      <motion.path
        d="M45 45 L45 14 M45 45 L75 45 M45 45 L26 73"
        stroke={STYLE.fan}
        strokeWidth="5"
        strokeLinecap="round"
        animate={{ rotate: fanLevel > 0 ? 360 : 0 }}
        transition={{
          repeat: fanLevel > 0 ? Infinity : 0,
          duration: fanLevel === 0 ? 1 : Math.max(0.35, 1.6 - fanLevel),
          ease: "linear",
        }}
        style={{ transformOrigin: "45px 45px" }}
      />

      <text
        x="45"
        y="-20"
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="12"
        fontWeight="800"
      >
        Fan Response
      </text>

      <text x="45" y="-3" textAnchor="middle" fill={STYLE.muted} fontSize="10">
        {fanStatus}
      </text>
    </g>
  );
}

function LevelBar({
  component,
  title,
  value,
  color,
}: {
  component: ComponentBox;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <g transform={`translate(${component.x} ${component.y - 12})`}>
      <text x="0" y="0" fill={STYLE.text} fontSize="12" fontWeight="800">
        {title}
      </text>

      <rect
        x="0"
        y="12"
        width={component.width}
        height={component.height}
        rx="5"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="12"
        height={component.height}
        rx="5"
        fill={color}
        animate={{ width: component.width * value }}
      />
    </g>
  );
}

export function ThermistorVisual({
  mode,
  temperature,
  resistance,
  voltage,
}: ThermistorVisualProps) {
  const safeTemperature = clamp(temperature, 0, 120);
  const safeResistance = Math.max(resistance, 1);
  const safeVoltage = Math.max(voltage, 0);

  const current = safeVoltage / safeResistance;
  const tempLevel = clamp(safeTemperature / 120, 0, 1);
  const flowLevel = clamp(current / 0.02, 0.08, 1);

  const heatLevel =
    mode === "ntc"
      ? tempLevel
      : clamp(tempLevel * 0.85 + (1 - flowLevel) * 0.25, 0.08, 1);

  const particleCount = Math.min(Math.max(Math.round(flowLevel * 20), 5), 24);
  const currentSpeed = Math.max(0.55, 2.5 - flowLevel * 1.55);

  const fanLevel =
    safeTemperature < 40
      ? 0
      : safeTemperature < 60
        ? 0.35
        : safeTemperature < 85
          ? 0.65
          : 1;

  const fanStatus =
    fanLevel === 0
      ? "Off / Standby"
      : fanLevel < 0.5
        ? "Low Speed Cooling"
        : fanLevel < 0.9
          ? "Medium Speed Cooling"
          : "High Speed Cooling";

  const modeColor = mode === "ntc" ? STYLE.ntc : STYLE.ptc;

  const modeText =
    mode === "ntc"
      ? "NTC: Temperature ↑ → Resistance ↓ → Current ↑"
      : "PTC: Temperature ↑ → Resistance ↑ → Current ↓";

  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => index),
    [particleCount],
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Thermistor Behavior Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            Change temperature and observe resistance, conventional current,
            heat, and fan response.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            mode === "ntc"
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {mode.toUpperCase()} MODE
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[780px] sm:w-full"
          role="img"
          aria-label="Thermistor circuit showing conventional current flow"
        >
          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="14"
              fontWeight="900"
            >
              {modeText}
            </text>

            <text
              x={LABEL.subtitle.x}
              y={LABEL.subtitle.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="11"
              fontWeight="600"
            >
              Conventional current flows from positive terminal to negative
              terminal
            </text>

            <SourceBlock voltage={safeVoltage} />

            <WirePath points={WIRE.sourceToThermistor} flowLevel={flowLevel} />
            <WirePath points={WIRE.returnPath} flowLevel={flowLevel} />

            <HeatGlow heatLevel={heatLevel} />

            <ThermistorSymbol
              mode={mode}
              modeColor={modeColor}
              safeTemperature={safeTemperature}
            />

            <HeatWaves tempLevel={tempLevel} />

            <ParticleFlow
              particles={particles}
              particleCount={particleCount}
              currentSpeed={currentSpeed}
            />

            <FanResponse fanLevel={fanLevel} fanStatus={fanStatus} />

            <text
              x={LABEL.currentIn.x}
              y={LABEL.currentIn.y}
              textAnchor="middle"
              fill={STYLE.current}
              fontSize="12"
              fontWeight="800"
            >
              Conventional Current
            </text>

            <text
              x={LABEL.currentOut.x}
              y={LABEL.currentOut.y}
              textAnchor="middle"
              fill={STYLE.current}
              fontSize="12"
              fontWeight="800"
            >
              Current Output
            </text>

            <text
              x={LABEL.symbolTitle.x}
              y={LABEL.symbolTitle.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="13"
              fontWeight="900"
            >
              Real Thermistor Symbol
            </text>

            <text
              x={LABEL.valueText.x}
              y={LABEL.valueText.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="12"
              fontWeight="700"
            >
              R = {formatResistance(safeResistance)} • I ={" "}
              {formatNumber(current * 1000, 2)} mA
            </text>

            <LevelBar
              component={COMPONENT.tempBar}
              title="Temperature"
              value={tempLevel}
              color={STYLE.danger}
            />

            <LevelBar
              component={COMPONENT.currentBar}
              title="Conventional Current"
              value={flowLevel}
              color={STYLE.current}
            />

            <LevelBar
              component={COMPONENT.heatBar}
              title="Heat Stress"
              value={heatLevel}
              color={STYLE.heat}
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
