"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import { clamp, formatCapacitance, formatNumber } from "./logic";
import type { PolarityMode } from "./types";

type ElectrolyticVisualProps = {
  capacitance: number;
  voltageRating: number;
  appliedVoltage: number;
  esr: number;
  rippleCurrent: number;
  polarity: PolarityMode;
};

const VIEW_BOX = "0 0 840 455";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 455;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  capacitorCan: 1,
  formulaPanel: 1,
  smoothingBar: 1,
} as const;

const BASE_WIRE_WIDTH = 8;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  panel: "#f8fafc",
  wire: "#53657d",
  positive: "#f97316",
  negative: "#38bdf8",
  electron: "#0ea5e9",
  smooth: "#22c55e",
  danger: "#ef4444",
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

function formatCurrent(value: number) {
  if (value >= 1) return `${formatNumber(value, 2)} A`;
  if (value >= 0.001) return `${formatNumber(value * 1000, 2)} mA`;
  return `${formatNumber(value * 1_000_000, 2)} µA`;
}

const BASE_COMPONENT = {
  source: {
    x: 55,
    y: 158,
    width: 100,
    height: 94,
    rotate: 0,
  },

  capacitorCan: {
    x: 292,
    y: 104,
    width: 256,
    height: 174,
    rotate: 0,
  },

  formulaPanel: {
    x: 274,
    y: 292,
    width: 292,
    height: 38,
    rotate: 0,
  },

  smoothingBar: {
    x: 150,
    y: 392,
    width: 540,
    height: 13,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  capacitorCan: scaleComponent(
    BASE_COMPONENT.capacitorCan,
    CIRCUIT_COMPONENT_SCALE.capacitorCan,
  ),
  formulaPanel: scaleComponent(
    BASE_COMPONENT.formulaPanel,
    CIRCUIT_COMPONENT_SCALE.formulaPanel,
  ),
  smoothingBar: scaleComponent(
    BASE_COMPONENT.smoothingBar,
    CIRCUIT_COMPONENT_SCALE.smoothingBar,
  ),
} as const;

const NODE = {
  sourceCenter: pointOnComponent(COMPONENT.source, 0.5, 0.5),
  sourcePositive: { x: 155, y: 185 },
  sourceNegative: { x: 105, y: 252 },

  canLeft: pointOnComponent(COMPONENT.capacitorCan, 0, 0.465),
  canRight: pointOnComponent(COMPONENT.capacitorCan, 1, 0.465),
  canCenter: pointOnComponent(COMPONENT.capacitorCan, 0.5, 0.5),

  leftLeadEnd: { x: 242, y: 185 },
  rightLeadEnd: { x: 596, y: 185 },

  returnRight: { x: 706, y: 335 },
  returnBottom: { x: 105, y: 335 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  sourceToPositiveLead: [NODE.sourcePositive, NODE.canLeft],
  negativeReturn: [
    NODE.canRight,
    NODE.returnRight,
    NODE.returnBottom,
    NODE.sourceNegative,
  ],

  positiveLead: [NODE.canLeft, NODE.leftLeadEnd],
  negativeLead: [NODE.canRight, NODE.rightLeadEnd],
} as const;

const PATH = {
  ripple: pathD([
    NODE.sourceNegative,
    NODE.returnBottom,
    NODE.returnRight,
    NODE.canRight,
  ]),
  smoothing: pathD([NODE.sourcePositive, NODE.canLeft]),
  reverse: pathD([
    NODE.sourceNegative,
    NODE.returnBottom,
    NODE.returnRight,
    NODE.canRight,
    NODE.canLeft,
  ]),
} as const;

const LABEL = {
  title: { x: 420, y: 42 },

  sourceDc: { x: 105, y: 194 },
  sourceVoltage: { x: 105, y: 220 },
  sourcePlus: { x: 158, y: 178 },
  sourceMinus: { x: 103, y: 258 },

  longLead: { x: 242, y: 174 },
  stripeLead: { x: 602, y: 174 },

  capacitance: { x: 420, y: 154 },
  rating: { x: 420, y: 188 },
  capType: { x: 420, y: 218 },
  esrRipple: { x: 420, y: 242 },

  positiveNote: { x: 220, y: 145 },
  negativeNote: { x: 645, y: 145 },

  formula: { x: 420, y: 317 },
  voltageInfo: { x: 420, y: 354 },
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
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function SourceBlock({
  svgId,
  appliedVoltage,
}: {
  svgId: string;
  appliedVoltage: number;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.source.x}
        y={COMPONENT.source.y}
        width={COMPONENT.source.width}
        height={COMPONENT.source.height}
        rx="16"
        fill="#0f172a"
        stroke="#94a3b8"
        strokeWidth="3"
        filter={`url(#${svgId}-shadow)`}
      />

      <text
        x={LABEL.sourceDc.x}
        y={LABEL.sourceDc.y}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="15"
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
        {formatNumber(appliedVoltage, 1)}V
      </text>

      <text
        x={LABEL.sourcePlus.x}
        y={LABEL.sourcePlus.y}
        fill={STYLE.positive}
        fontSize="18"
        fontWeight="900"
      >
        +
      </text>

      <text
        x={LABEL.sourceMinus.x}
        y={LABEL.sourceMinus.y}
        fill={STYLE.negative}
        fontSize="18"
        fontWeight="900"
      >
        −
      </text>
    </g>
  );
}

function ElectrolyticCan({
  svgId,
  reversePolarity,
  overVoltage,
  capacitance,
  voltageRating,
  esr,
  rippleCurrent,
}: {
  svgId: string;
  reversePolarity: boolean;
  overVoltage: boolean;
  capacitance: number;
  voltageRating: number;
  esr: number;
  rippleCurrent: number;
}) {
  return (
    <motion.g
      filter={`url(#${svgId}-glow)`}
      animate={
        reversePolarity || overVoltage
          ? { x: [0, 1.5, -1.5, 0] }
          : { opacity: [0.94, 1, 0.94] }
      }
      transition={{
        repeat: Infinity,
        duration: reversePolarity || overVoltage ? 0.2 : 1.4,
      }}
    >
      <rect
        x={COMPONENT.capacitorCan.x}
        y={COMPONENT.capacitorCan.y}
        width={COMPONENT.capacitorCan.width}
        height={COMPONENT.capacitorCan.height}
        rx="30"
        fill={`url(#${svgId}-can)`}
        stroke={reversePolarity || overVoltage ? STYLE.danger : "#111827"}
        strokeWidth="4"
      />

      <ellipse
        cx={COMPONENT.capacitorCan.x}
        cy={NODE.canCenter.y}
        rx="28"
        ry="87"
        fill="#e5e7eb"
        stroke="#334155"
        strokeWidth="4"
      />

      <ellipse
        cx={COMPONENT.capacitorCan.x + COMPONENT.capacitorCan.width}
        cy={NODE.canCenter.y}
        rx="28"
        ry="87"
        fill="#94a3b8"
        stroke="#334155"
        strokeWidth="4"
      />

      <rect
        x={COMPONENT.capacitorCan.x + 194}
        y={COMPONENT.capacitorCan.y + 8}
        width="36"
        height={COMPONENT.capacitorCan.height - 16}
        rx="10"
        fill="#1e293b"
        opacity="0.92"
      />

      {Array.from({ length: 7 }).map((_, index) => (
        <text
          key={`negative-stripe-${index}`}
          x={COMPONENT.capacitorCan.x + 212}
          y={COMPONENT.capacitorCan.y + 28 + index * 20}
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
        fontSize="31"
        fontWeight="900"
      >
        {formatCapacitance(capacitance)}
      </text>

      <text
        x={LABEL.rating.x}
        y={LABEL.rating.y}
        textAnchor="middle"
        fill="#111827"
        fontSize="16"
        fontWeight="900"
      >
        {formatNumber(voltageRating, 0)}V
      </text>

      <text
        x={LABEL.capType.x}
        y={LABEL.capType.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        Aluminum electrolytic capacitor
      </text>

      <text
        x={LABEL.esrRipple.x}
        y={LABEL.esrRipple.y}
        textAnchor="middle"
        fill="#7c3aed"
        fontSize="12"
        fontWeight="900"
      >
        ESR = {formatNumber(esr, 2)} Ω · Ripple ={" "}
        {formatNumber(rippleCurrent, 2)} A
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
        x={LABEL.longLead.x}
        y={LABEL.longLead.y}
        textAnchor="middle"
        fill={STYLE.positive}
        fontSize="14"
        fontWeight="900"
      >
        long + lead
      </text>

      <text
        x={LABEL.stripeLead.x}
        y={LABEL.stripeLead.y}
        textAnchor="middle"
        fill="#0284c7"
        fontSize="14"
        fontWeight="900"
      >
        stripe − side
      </text>
    </g>
  );
}

function ParticleFlow({
  particles,
  particleSpeed,
  particleCount,
  reversePolarity,
}: {
  particles: number[];
  particleSpeed: number;
  particleCount: number;
  reversePolarity: boolean;
}) {
  return (
    <g>
      {particles.map((index) => (
        <circle
          key={`ripple-flow-${index}`}
          r="3.4"
          fill={reversePolarity ? STYLE.danger : STYLE.electron}
          stroke={reversePolarity ? "#fee2e2" : "#e0f2fe"}
          strokeWidth="1.2"
        >
          <animateMotion
            dur={`${particleSpeed}s`}
            repeatCount="indefinite"
            path={reversePolarity ? PATH.reverse : PATH.ripple}
            begin={`${index * (particleSpeed / particleCount)}s`}
          />
        </circle>
      ))}

      {particles
        .slice(0, Math.max(3, Math.floor(particles.length / 2)))
        .map((index) => (
          <circle
            key={`smoothing-flow-${index}`}
            r="3.1"
            fill={STYLE.smooth}
            stroke="#dcfce7"
            strokeWidth="1.1"
          >
            <animateMotion
              dur={`${particleSpeed * 1.15}s`}
              repeatCount="indefinite"
              path={PATH.smoothing}
              begin={`${index * (particleSpeed / particleCount)}s`}
            />
          </circle>
        ))}
    </g>
  );
}

function WarningMark({
  reversePolarity,
  overVoltage,
}: {
  reversePolarity: boolean;
  overVoltage: boolean;
}) {
  if (!reversePolarity && !overVoltage) return null;

  return (
    <motion.g
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
    >
      <polygon points="420,56 454,110 386,110" fill={STYLE.danger} />

      <text
        x="420"
        y="98"
        textAnchor="middle"
        fill="white"
        fontSize="28"
        fontWeight="900"
      >
        !
      </text>

      <text
        x="420"
        y="128"
        textAnchor="middle"
        fill={STYLE.danger}
        fontSize="13"
        fontWeight="900"
      >
        {reversePolarity
          ? "Reverse polarity can damage the capacitor"
          : "Applied voltage exceeds the rating"}
      </text>
    </motion.g>
  );
}

function FormulaPanel({ svgId }: { svgId: string }) {
  return (
    <g filter={`url(#${svgId}-shadow)`}>
      <rect
        x={COMPONENT.formulaPanel.x}
        y={COMPONENT.formulaPanel.y}
        width={COMPONENT.formulaPanel.width}
        height={COMPONENT.formulaPanel.height}
        fill="#ffffff"
        opacity="0.97"
      />

      <text
        x={LABEL.formula.x}
        y={LABEL.formula.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="17"
        fontWeight="900"
      >
        Ripple heat = I² × ESR
      </text>

      <line
        x1="304"
        y1="325"
        x2="536"
        y2="325"
        stroke={STYLE.smooth}
        strokeWidth="2"
        opacity="0.45"
      />
    </g>
  );
}

function SmoothingBar({
  smoothingLevel,
  reversePolarity,
  overVoltage,
}: {
  smoothingLevel: number;
  reversePolarity: boolean;
  overVoltage: boolean;
}) {
  return (
    <g
      transform={`translate(${COMPONENT.smoothingBar.x} ${COMPONENT.smoothingBar.y})`}
    >
      <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
        Power Supply Ripple Smoothing
      </text>

      <rect
        x="0"
        y="8"
        width={COMPONENT.smoothingBar.width}
        height={COMPONENT.smoothingBar.height}
        rx="7"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="8"
        height={COMPONENT.smoothingBar.height}
        rx="7"
        fill={reversePolarity || overVoltage ? STYLE.danger : STYLE.smooth}
        animate={{ width: COMPONENT.smoothingBar.width * smoothingLevel }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      <text
        x={COMPONENT.smoothingBar.width}
        y="46"
        textAnchor="end"
        fill="#475569"
        fontSize="12"
        fontWeight="700"
      >
        Large C + low ESR = better bulk smoothing
      </text>
    </g>
  );
}

export function ElectrolyticVisual({
  capacitance,
  voltageRating,
  appliedVoltage,
  esr,
  rippleCurrent,
  polarity,
}: ElectrolyticVisualProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeCapacitance = Math.max(
    Number.isFinite(capacitance) ? capacitance : 0,
    0,
  );

  const safeVoltageRating = Math.max(
    Number.isFinite(voltageRating) ? voltageRating : 0,
    0.001,
  );

  const safeAppliedVoltage = Math.max(
    Number.isFinite(appliedVoltage) ? appliedVoltage : 0,
    0,
  );

  const safeEsr = Math.max(Number.isFinite(esr) ? esr : 0, 0.001);

  const safeRippleCurrent = Math.max(
    Number.isFinite(rippleCurrent) ? rippleCurrent : 0,
    0,
  );

  const voltageStress = clamp(safeAppliedVoltage / safeVoltageRating, 0, 1.4);
  const overVoltage = safeAppliedVoltage > safeVoltageRating;
  const lowMargin = voltageStress > 0.8 && !overVoltage;
  const reversePolarity = polarity === "reverse";
  const isSafe = polarity === "correct" && !overVoltage;

  const dangerLevel = reversePolarity
    ? 1
    : overVoltage
      ? 0.9
      : clamp((voltageStress - 0.8) / 0.2, 0, 1);

  const smoothingLevel = clamp(
    (safeCapacitance / 1000) * (1 / safeEsr) * 0.12,
    0.08,
    1,
  );

  const heatLevel = clamp(
    (safeRippleCurrent * safeRippleCurrent * safeEsr) / 2,
    0,
    1,
  );

  const particleCount = clamp(Math.round(smoothingLevel * 18), 4, 20);
  const particleSpeed = clamp(2.8 - smoothingLevel * 1.7, 0.65, 2.9);

  const canFill = reversePolarity
    ? "#fee2e2"
    : overVoltage
      ? "#ffedd5"
      : "#e2e8f0";

  const statusText = reversePolarity
    ? "REVERSE POLARITY"
    : overVoltage
      ? "OVER VOLTAGE"
      : lowMargin
        ? "LOW VOLTAGE MARGIN"
        : "SAFE OPERATING REGION";

  const statusClass =
    reversePolarity || overVoltage
      ? "bg-red-100 text-red-700"
      : lowMargin
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700";

  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => index),
    [particleCount],
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Electrolytic Capacitor Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Electrolytic capacitors are polarized, high-capacitance components
            used for power supply smoothing and bulk energy storage.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
        >
          {statusText}
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[840px] sm:w-full"
          role="img"
          aria-label="Professional electrolytic capacitor visualizer"
        >
          <defs>
            <linearGradient id={`${svgId}-can`} x1="0" x2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="18%" stopColor="#f8fafc" />
              <stop offset="42%" stopColor={canFill} />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <filter
              id={`${svgId}-shadow`}
              x="-40%"
              y="-60%"
              width="180%"
              height="220%"
            >
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="8"
                floodColor="#0f172a"
                floodOpacity="0.22"
              />
            </filter>

            <filter
              id={`${svgId}-glow`}
              x="-45%"
              y="-55%"
              width="190%"
              height="210%"
            >
              <feGaussianBlur
                stdDeviation={3 + (dangerLevel + heatLevel) * 8}
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="8" y="10" width="824" height="430" rx="20" fill="#f8fafc" />

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="900"
            >
              Polarized capacitor: long lead = positive · body stripe = negative
              · high C for ripple smoothing
            </text>

            <SourceBlock svgId={svgId} appliedVoltage={safeAppliedVoltage} />

            <WirePath points={WIRE.sourceToPositiveLead} />
            <WirePath points={WIRE.negativeReturn} />

            <ElectrolyticCan
              svgId={svgId}
              reversePolarity={reversePolarity}
              overVoltage={overVoltage}
              capacitance={safeCapacitance}
              voltageRating={safeVoltageRating}
              esr={safeEsr}
              rippleCurrent={safeRippleCurrent}
            />

            <LeadLabels />

            <text
              x={LABEL.positiveNote.x}
              y={LABEL.positiveNote.y}
              textAnchor="middle"
              fill={STYLE.positive}
              fontSize="12"
              fontWeight="900"
            >
              Positive supply → + lead
            </text>

            <text
              x={LABEL.negativeNote.x}
              y={LABEL.negativeNote.y}
              textAnchor="middle"
              fill="#0284c7"
              fontSize="12"
              fontWeight="900"
            >
              Negative stripe marks − terminal
            </text>

            <ParticleFlow
              particles={particles}
              particleSpeed={particleSpeed}
              particleCount={particleCount}
              reversePolarity={reversePolarity}
            />

            <WarningMark
              reversePolarity={reversePolarity}
              overVoltage={overVoltage}
            />

            <FormulaPanel svgId={svgId} />

            <text
              x={LABEL.voltageInfo.x}
              y={LABEL.voltageInfo.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="12"
              fontWeight="900"
            >
              Applied: {formatNumber(safeAppliedVoltage, 1)}V · Rating:{" "}
              {formatNumber(safeVoltageRating, 1)}V · Margin:{" "}
              {formatNumber(safeVoltageRating - safeAppliedVoltage, 1)}V
            </text>

            <SmoothingBar
              smoothingLevel={smoothingLevel}
              reversePolarity={reversePolarity}
              overVoltage={overVoltage}
            />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            Polarity Rule
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Long lead is usually positive. The printed stripe usually marks the
            negative terminal.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {isSafe ? "Safe connection" : "Check polarity"}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            High Capacitance
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Thin oxide dielectric and electrolyte allow high capacitance in a
            compact body.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatCapacitance(safeCapacitance)}
          </p>
        </div>

        <div
          className={`rounded-2xl p-4 ring-1 ${
            overVoltage
              ? "bg-red-50 ring-red-100"
              : "bg-green-50 ring-green-100"
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              overVoltage ? "text-red-700" : "text-green-700"
            }`}
          >
            Voltage Rating
          </p>

          <p className="mt-1 text-sm text-slate-700">
            Applied voltage should stay below the rated voltage. A 20% margin is
            good practice.
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {overVoltage
              ? "Over rating"
              : `${formatNumber(safeVoltageRating, 0)}V rated`}
          </p>
        </div>
      </div>
    </section>
  );
}
