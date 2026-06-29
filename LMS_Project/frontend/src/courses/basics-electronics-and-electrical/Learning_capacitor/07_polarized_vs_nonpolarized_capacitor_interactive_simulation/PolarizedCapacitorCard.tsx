"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

type PolarizedCapacitorCardProps = {
  voltage: number;
  reverse: boolean;
};

const VIEW_BOX = "0 0 720 360";
const VIEW_BOX_WIDTH = 720;
const VIEW_BOX_HEIGHT = 360;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  capacitorCan: 1,
  warning: 1,
} as const;

const BASE_WIRE_WIDTH = 8;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  wire: "#53657d",
  sourceBody: "#0f172a",
  positive: "#f97316",
  negative: "#38bdf8",
  electron: "#0ea5e9",
  danger: "#ef4444",
  conventional: "#ef4444",
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
    y: 165,
    width: 80,
    height: 85,
    rotate: 0,
  },

  capacitorCan: {
    x: 250,
    y: 110,
    width: 270,
    height: 180,
    rotate: 0,
  },

  warning: {
    x: 350,
    y: 42,
    width: 70,
    height: 68,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  capacitorCan: scaleComponent(
    BASE_COMPONENT.capacitorCan,
    CIRCUIT_COMPONENT_SCALE.capacitorCan,
  ),
  warning: scaleComponent(
    BASE_COMPONENT.warning,
    CIRCUIT_COMPONENT_SCALE.warning,
  ),
} as const;

const NODE = {
  sourcePositive: { x: 120, y: 205 },
  sourceNegative: { x: 80, y: 250 },

  canLeft: pointOnComponent(COMPONENT.capacitorCan, 0, 0.5278),
  canRight: pointOnComponent(COMPONENT.capacitorCan, 1, 0.5278),
  canCenter: pointOnComponent(COMPONENT.capacitorCan, 0.5, 0.5),

  leftLeadEnd: { x: 205, y: 205 },
  rightLeadEnd: { x: 560, y: 205 },

  returnRight: { x: 650, y: 300 },
  returnLeft: { x: 80, y: 300 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  positiveSupply: [NODE.sourcePositive, NODE.canLeft],
  negativeReturn: [
    NODE.canRight,
    { x: 650, y: NODE.canRight.y },
    NODE.returnRight,
    NODE.returnLeft,
    NODE.sourceNegative,
  ],

  positiveLead: [NODE.canLeft, NODE.leftLeadEnd],
  negativeLead: [NODE.canRight, NODE.rightLeadEnd],
} as const;

const PATH = {
  conventionalCurrent: pathD([NODE.sourcePositive, NODE.canLeft]),
  electronFlow: pathD([
    NODE.sourceNegative,
    NODE.returnLeft,
    NODE.returnRight,
    { x: 650, y: NODE.canRight.y },
    NODE.canRight,
  ]),
} as const;

const LABEL = {
  titleStatusY: 325,

  sourceDc: { x: 80, y: 198 },
  sourceVoltage: { x: 80, y: 225 },
  sourcePlus: { x: 124, y: 160 },
  sourceMinus: { x: 78, y: 245 },

  positiveLead: { x: 205, y: 192 },
  negativeStripe: { x: 565, y: 192 },

  capacitance: { x: 385, y: 188 },
  voltageRating: { x: 385, y: 220 },

  conventionalText: { x: 260, y: 145 },
  electronText: { x: 540, y: 145 },

  warningText: { x: 385, y: 110 },
} as const;

function WirePath({
  points,
  stroke = STYLE.wire,
  width = WIRE.width,
}: {
  points: readonly Point[];
  stroke?: string;
  width?: number;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={stroke}
      strokeWidth={width}
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
        rx="15"
        fill={STYLE.sourceBody}
      />

      <text
        x={LABEL.sourceDc.x}
        y={LABEL.sourceDc.y}
        textAnchor="middle"
        fill="white"
        fontSize="15"
        fontWeight="800"
      >
        DC
      </text>

      <text
        x={LABEL.sourceVoltage.x}
        y={LABEL.sourceVoltage.y}
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="13"
        fontWeight="800"
      >
        {voltage.toFixed(1)}V
      </text>

      <text
        x={LABEL.sourcePlus.x}
        y={LABEL.sourcePlus.y}
        fill={STYLE.positive}
        fontSize="17"
        fontWeight="900"
      >
        +
      </text>

      <text
        x={LABEL.sourceMinus.x}
        y={LABEL.sourceMinus.y}
        fill={STYLE.negative}
        fontSize="17"
        fontWeight="900"
      >
        −
      </text>
    </g>
  );
}

function CapacitorCan({ svgId, danger }: { svgId: string; danger: boolean }) {
  return (
    <motion.g
      filter={`url(#${svgId}-glow)`}
      animate={danger ? { x: [0, 2, -2, 0] } : { opacity: [0.94, 1, 0.94] }}
      transition={{ repeat: Infinity, duration: danger ? 0.2 : 1.4 }}
    >
      <rect
        x={COMPONENT.capacitorCan.x}
        y={COMPONENT.capacitorCan.y}
        width={COMPONENT.capacitorCan.width}
        height={COMPONENT.capacitorCan.height}
        rx="32"
        fill={`url(#${svgId}-can)`}
        stroke={danger ? STYLE.danger : "#111827"}
        strokeWidth="4"
      />

      <ellipse
        cx={NODE.canLeft.x}
        cy={NODE.canCenter.y}
        rx="28"
        ry="90"
        fill="#cbd5e1"
        stroke="#334155"
        strokeWidth="4"
      />

      <ellipse
        cx={NODE.canRight.x}
        cy={NODE.canCenter.y}
        rx="28"
        ry="90"
        fill="#94a3b8"
        stroke="#334155"
        strokeWidth="4"
      />

      <rect
        x={COMPONENT.capacitorCan.x + 215}
        y={COMPONENT.capacitorCan.y + 8}
        width="36"
        height={COMPONENT.capacitorCan.height - 16}
        rx="8"
        fill="#111827"
      />

      {Array.from({ length: 8 }).map((_, index) => (
        <text
          key={`minus-${index}`}
          x={COMPONENT.capacitorCan.x + 233}
          y={COMPONENT.capacitorCan.y + 26 + index * 18}
          textAnchor="middle"
          fill="white"
          fontSize="15"
          fontWeight="900"
        >
          −
        </text>
      ))}

      <text
        x={LABEL.capacitance.x}
        y={LABEL.capacitance.y}
        textAnchor="middle"
        fill="#111827"
        fontSize="30"
        fontWeight="900"
      >
        100 µF
      </text>

      <text
        x={LABEL.voltageRating.x}
        y={LABEL.voltageRating.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="16"
        fontWeight="800"
      >
        25V Rated
      </text>
    </motion.g>
  );
}

function LeadLabels() {
  return (
    <g>
      <WirePath points={WIRE.positiveLead} stroke={STYLE.positive} width={7} />
      <WirePath points={WIRE.negativeLead} stroke={STYLE.negative} width={7} />

      <text
        x={LABEL.positiveLead.x}
        y={LABEL.positiveLead.y}
        textAnchor="middle"
        fill={STYLE.positive}
        fontSize="13"
        fontWeight="900"
      >
        + Lead
      </text>

      <text
        x={LABEL.negativeStripe.x}
        y={LABEL.negativeStripe.y}
        textAnchor="middle"
        fill="#0284c7"
        fontSize="13"
        fontWeight="900"
      >
        − Stripe
      </text>
    </g>
  );
}

function ParticleFlow({
  particles,
  currentParticles,
}: {
  particles: number[];
  currentParticles: number[];
}) {
  return (
    <g>
      {currentParticles.map((index) => (
        <circle
          key={`conventional-current-${index}`}
          r="3.4"
          fill={STYLE.conventional}
          stroke="#fee2e2"
          strokeWidth="1.1"
        >
          <animateMotion
            dur="1.6s"
            repeatCount="indefinite"
            path={PATH.conventionalCurrent}
            begin={`${index * 0.18}s`}
          />
        </circle>
      ))}

      {particles.map((index) => (
        <circle
          key={`electron-flow-${index}`}
          r="3.5"
          fill={STYLE.electron}
          stroke="#e0f2fe"
          strokeWidth="1.2"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={PATH.electronFlow}
            begin={`${index * 0.12}s`}
          />
        </circle>
      ))}
    </g>
  );
}

function WarningMark({ reverse }: { reverse: boolean }) {
  return (
    <motion.g>
      <motion.circle
        cx={NODE.canCenter.x}
        cy={NODE.canCenter.y}
        r="118"
        fill="none"
        stroke={STYLE.danger}
        strokeWidth="5"
        animate={{
          opacity: [0.15, 0.85, 0.15],
          scale: [0.95, 1.04, 0.95],
        }}
        transition={{ repeat: Infinity, duration: 1 }}
      />

      <motion.g
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        <polygon points="385,42 420,95 350,95" fill={STYLE.danger} />

        <text
          x="385"
          y="84"
          textAnchor="middle"
          fill="white"
          fontSize="28"
          fontWeight="900"
        >
          !
        </text>

        <text
          x={LABEL.warningText.x}
          y={LABEL.warningText.y}
          textAnchor="middle"
          fill={STYLE.danger}
          fontSize="12"
          fontWeight="900"
        >
          {reverse
            ? "Reverse polarity can damage capacitor"
            : "Voltage exceeds 25V rating"}
        </text>
      </motion.g>
    </motion.g>
  );
}

export function PolarizedCapacitorCard({
  voltage,
  reverse,
}: PolarizedCapacitorCardProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeVoltage = Number.isFinite(voltage) ? voltage : 0;
  const overVoltage = safeVoltage > 25;
  const danger = reverse || overVoltage;

  const particleCount = danger ? 0 : 10;

  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => index),
    [particleCount],
  );

  const currentParticles = particles.slice(0, 6);
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Polarized Capacitor</h2>
          <p className="text-xs text-slate-600">
            Electrolytic capacitor — polarity must be correct.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            danger ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {danger ? "Danger" : "Correct Connection"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg viewBox={VIEW_BOX} className="w-full">
          <defs>
            <linearGradient id={`${svgId}-can`} x1="0" x2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="18%" stopColor="#f8fafc" />
              <stop offset="55%" stopColor={danger ? "#fee2e2" : "#e2e8f0"} />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <filter
              id={`${svgId}-glow`}
              x="-45%"
              y="-55%"
              width="190%"
              height="210%"
            >
              <feGaussianBlur stdDeviation={danger ? 10 : 4} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={canvasTransform}>
            <SourceBlock voltage={safeVoltage} />

            <WirePath points={WIRE.positiveSupply} />
            <WirePath points={WIRE.negativeReturn} />

            <CapacitorCan svgId={svgId} danger={danger} />

            <LeadLabels />

            {!danger && (
              <ParticleFlow
                particles={particles}
                currentParticles={currentParticles}
              />
            )}

            {danger && <WarningMark reverse={reverse} />}

            <text
              x={LABEL.conventionalText.x}
              y={LABEL.conventionalText.y}
              textAnchor="middle"
              fill={STYLE.conventional}
              fontSize="12"
              fontWeight="900"
            >
              Conventional current: + → + plate
            </text>

            <text
              x={LABEL.electronText.x}
              y={LABEL.electronText.y}
              textAnchor="middle"
              fill={STYLE.electron}
              fontSize="12"
              fontWeight="900"
            >
              Electron flow: − → − plate
            </text>

            <text
              x={NODE.canCenter.x}
              y={LABEL.titleStatusY}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="12"
              fontWeight="800"
            >
              {danger
                ? "Wrong condition: stop flow and check polarity or voltage rating"
                : "Correct: capacitor charges; no electron crosses the dielectric"}
            </text>
          </g>
        </svg>
      </div>

      <div
        className={`mt-3 rounded-2xl p-4 text-sm ring-1 ${
          danger
            ? "bg-red-50 text-red-700 ring-red-100"
            : "bg-orange-50 text-slate-700 ring-orange-100"
        }`}
      >
        <p
          className={`font-semibold ${
            danger ? "text-red-700" : "text-orange-700"
          }`}
        >
          {danger ? "Danger Rule" : "Main Rule"}
        </p>

        <p className="mt-1">
          {danger
            ? "Do not reverse polarity or exceed the voltage rating of an electrolytic capacitor."
            : "In conventional-current method, current enters the positive plate; electrons collect on the negative plate."}
        </p>
      </div>
    </div>
  );
}
