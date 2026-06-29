"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import {
  clamp,
  computeVariableCapacitorSnapshot,
  formatCapacitance,
  formatFrequency,
  formatNumber,
} from "./logic";

type VariableCapacitorVisualProps = {
  rotation: number;
  minCapacitance: number;
  maxCapacitance: number;
  inductanceUh: number;
  plateCount: number;
};

const VIEW_BOX = "0 0 840 455";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 455;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  tuningAssembly: 1,
  formulaPanel: 1,
  tuningBar: 1,
} as const;

const BASE_WIRE_WIDTH = 8;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  panel: "#f8fafc",
  wire: "#53657d",
  input: "#0ea5e9",
  output: "#22c55e",
  statorLeft: "#2563eb",
  statorRight: "#ef4444",
  rotor: "#94a3b8",
  rotorStroke: "#334155",
  field: "#8b5cf6",
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
    x: 58,
    y: 166,
    width: 105,
    height: 86,
    rotate: 0,
  },

  tuningAssembly: {
    x: 294,
    y: 82,
    width: 252,
    height: 252,
    rotate: 0,
  },

  formulaPanel: {
    x: 272,
    y: 298,
    width: 296,
    height: 38,
    rotate: 0,
  },

  tuningBar: {
    x: 150,
    y: 384,
    width: 540,
    height: 13,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  tuningAssembly: scaleComponent(
    BASE_COMPONENT.tuningAssembly,
    CIRCUIT_COMPONENT_SCALE.tuningAssembly,
  ),
  formulaPanel: scaleComponent(
    BASE_COMPONENT.formulaPanel,
    CIRCUIT_COMPONENT_SCALE.formulaPanel,
  ),
  tuningBar: scaleComponent(
    BASE_COMPONENT.tuningBar,
    CIRCUIT_COMPONENT_SCALE.tuningBar,
  ),
} as const;

const NODE = {
  sourceOutput: { x: 163, y: 208 },
  inputEnd: { x: 260, y: 208 },

  outputStart: { x: 580, y: 208 },
  outputEnd: { x: 710, y: 208 },

  returnRight: { x: 710, y: 328 },
  returnBottom: { x: 110, y: 328 },
  returnSource: { x: 110, y: 252 },

  assemblyCenter: pointOnComponent(COMPONENT.tuningAssembly, 0.5, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  inputWire: [NODE.sourceOutput, NODE.inputEnd],
  outputWire: [NODE.outputStart, NODE.outputEnd],
  returnWire: [
    NODE.outputEnd,
    NODE.returnRight,
    NODE.returnBottom,
    NODE.returnSource,
  ],
} as const;

const PATH = {
  rfInput: pathD(WIRE.inputWire),
  rfOutput: pathD(WIRE.outputWire),
} as const;

const LABEL = {
  title: { x: 420, y: 42 },
  sourceRf: { x: 110, y: 198 },
  sourceSignal: { x: 110, y: 224 },
  stator: { x: 260, y: 122 },
  rotor: { x: 590, y: 122 },
  liveValue: { x: 420, y: 78 },
  assemblyCaption: { x: 0, y: 153 },
  formula: { x: 420, y: 323 },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function SourceBlock({ svgId }: { svgId: string }) {
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
        x={LABEL.sourceRf.x}
        y={LABEL.sourceRf.y}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="15"
        fontWeight="900"
      >
        RF
      </text>

      <text
        x={LABEL.sourceSignal.x}
        y={LABEL.sourceSignal.y}
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="13"
        fontWeight="900"
      >
        Signal
      </text>
    </g>
  );
}

function RfParticles({
  rfDots,
  rfSpeed,
  rfDotCount,
  tuningPercent,
}: {
  rfDots: number[];
  rfSpeed: number;
  rfDotCount: number;
  tuningPercent: number;
}) {
  return (
    <g>
      {rfDots.map((index) => (
        <circle
          key={`rf-input-${index}`}
          r="3.3"
          fill={STYLE.input}
          stroke="#e0f2fe"
          strokeWidth="1.1"
        >
          <animateMotion
            dur={`${rfSpeed}s`}
            repeatCount="indefinite"
            path={PATH.rfInput}
            begin={`${index * (rfSpeed / rfDotCount)}s`}
          />
        </circle>
      ))}

      {rfDots
        .slice(0, Math.max(3, Math.round(rfDots.length * tuningPercent)))
        .map((index) => (
          <circle
            key={`rf-output-${index}`}
            r="3.1"
            fill={STYLE.output}
            stroke="#dcfce7"
            strokeWidth="1.1"
          >
            <animateMotion
              dur={`${rfSpeed * 1.15}s`}
              repeatCount="indefinite"
              path={PATH.rfOutput}
              begin={`${index * (rfSpeed / rfDotCount)}s`}
            />
          </circle>
        ))}
    </g>
  );
}

function TuningAssembly({
  svgId,
  safePlateCount,
  rotorAngle,
  fieldLineCount,
}: {
  svgId: string;
  safePlateCount: number;
  rotorAngle: number;
  fieldLineCount: number;
}) {
  return (
    <g
      transform={`translate(${NODE.assemblyCenter.x} ${NODE.assemblyCenter.y})`}
    >
      <circle
        r="126"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="3"
        filter={`url(#${svgId}-shadow)`}
      />

      <circle r="105" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

      {Array.from({ length: safePlateCount }).map((_, index) => {
        const y = -82 + index * (164 / Math.max(safePlateCount - 1, 1));

        return (
          <g key={`stator-${index}`}>
            <rect
              x="-108"
              y={y - 6}
              width="100"
              height="12"
              rx="5"
              fill={STYLE.statorLeft}
              opacity="0.9"
            />

            <rect
              x="8"
              y={y - 6}
              width="100"
              height="12"
              rx="5"
              fill={STYLE.statorRight}
              opacity="0.9"
            />
          </g>
        );
      })}

      <motion.g
        animate={{ rotate: rotorAngle }}
        transition={{ type: "spring", stiffness: 85, damping: 16 }}
      >
        {Array.from({ length: safePlateCount - 1 }).map((_, index) => {
          const y = -66 + index * (132 / Math.max(safePlateCount - 2, 1));

          return (
            <g key={`rotor-${index}`} filter={`url(#${svgId}-glow)`}>
              <rect
                x="-90"
                y={y - 5}
                width="180"
                height="10"
                rx="5"
                fill={STYLE.rotor}
                stroke={STYLE.rotorStroke}
                strokeWidth="1.2"
              />

              <circle cx="0" cy={y} r="4" fill="#475569" />
            </g>
          );
        })}

        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-118"
          stroke="#111827"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <circle cy="-122" r="9" fill="#111827" />
      </motion.g>

      <circle r="18" fill="#334155" />
      <circle r="8" fill="#f8fafc" />

      {Array.from({ length: fieldLineCount }).map((_, index) => {
        const y = -74 + index * (148 / Math.max(fieldLineCount - 1, 1));

        return (
          <motion.g
            key={`field-${index}`}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              repeat: Infinity,
              duration: 1.3,
              delay: index * 0.04,
            }}
          >
            <line
              x1="-5"
              y1={y}
              x2="5"
              y2={y}
              stroke={STYLE.field}
              strokeWidth="2.2"
            />

            <circle cx="0" cy={y} r="2.2" fill={STYLE.field} />
          </motion.g>
        );
      })}

      <text
        x={LABEL.assemblyCaption.x}
        y={LABEL.assemblyCaption.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        Rotor + Stator Plate Assembly
      </text>
    </g>
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
        f = 1 / 2π√LC
      </text>

      <line
        x1="300"
        y1="331"
        x2="540"
        y2="331"
        stroke={STYLE.field}
        strokeWidth="2"
        opacity="0.45"
      />
    </g>
  );
}

function TuningBar({ tuningPercent }: { tuningPercent: number }) {
  return (
    <g
      transform={`translate(${COMPONENT.tuningBar.x} ${COMPONENT.tuningBar.y})`}
    >
      <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
        Radio Tuning Position
      </text>

      <rect
        x="0"
        y="8"
        width={COMPONENT.tuningBar.width}
        height={COMPONENT.tuningBar.height}
        rx="7"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="8"
        height={COMPONENT.tuningBar.height}
        rx="7"
        fill={STYLE.field}
        animate={{ width: COMPONENT.tuningBar.width * tuningPercent }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      <text
        x={COMPONENT.tuningBar.width}
        y="46"
        textAnchor="end"
        fill="#64748b"
        fontSize="12"
        fontWeight="700"
      >
        Low C = high frequency · High C = low frequency
      </text>
    </g>
  );
}

export function VariableCapacitorVisual({
  rotation,
  minCapacitance,
  maxCapacitance,
  inductanceUh,
  plateCount,
}: VariableCapacitorVisualProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeRotation = clamp(Number.isFinite(rotation) ? rotation : 0, 0, 180);
  const safePlateCount = clamp(
    Math.round(Number.isFinite(plateCount) ? plateCount : 6),
    3,
    10,
  );

  const { overlapRatio, capacitance, frequency, tuningPercent } =
    computeVariableCapacitorSnapshot({
      rotation: safeRotation,
      minCapacitance,
      maxCapacitance,
      inductanceUh,
    });

  const rotorAngle = -70 + safeRotation * 0.78;
  const fieldLineCount = clamp(Math.round(overlapRatio * 14), 3, 14);
  const rfDotCount = clamp(Math.round((1 - overlapRatio) * 10 + 6), 6, 18);
  const rfSpeed = clamp(2.4 - tuningPercent * 1.4, 0.75, 2.4);

  const rfDots = useMemo(
    () => Array.from({ length: rfDotCount }, (_, index) => index),
    [rfDotCount],
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Variable Capacitor Tuning Visualizer
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Turning the knob changes rotor and stator plate overlap. More
            overlap gives higher capacitance and lowers the LC resonant
            frequency.
          </p>
        </div>

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          ADJUSTABLE CAPACITANCE
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[840px] sm:w-full"
          role="img"
          aria-label="Variable capacitor tuning visualizer"
        >
          <defs>
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
                stdDeviation={3 + overlapRatio * 8}
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x="8"
            y="10"
            width="824"
            height="430"
            rx="20"
            fill={STYLE.panel}
          />

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="900"
            >
              More overlap → higher capacitance → lower resonant frequency
            </text>

            <SourceBlock svgId={svgId} />

            <WirePath points={WIRE.inputWire} />
            <WirePath points={WIRE.outputWire} />
            <WirePath points={WIRE.returnWire} />

            <RfParticles
              rfDots={rfDots}
              rfSpeed={rfSpeed}
              rfDotCount={rfDotCount}
              tuningPercent={tuningPercent}
            />

            <TuningAssembly
              svgId={svgId}
              safePlateCount={safePlateCount}
              rotorAngle={rotorAngle}
              fieldLineCount={fieldLineCount}
            />

            <text
              x={LABEL.stator.x}
              y={LABEL.stator.y}
              textAnchor="middle"
              fill={STYLE.statorLeft}
              fontSize="12"
              fontWeight="900"
            >
              Fixed stator plates
            </text>

            <text
              x={LABEL.rotor.x}
              y={LABEL.rotor.y}
              textAnchor="middle"
              fill="#475569"
              fontSize="12"
              fontWeight="900"
            >
              Rotating rotor plates
            </text>

            <text
              x={LABEL.liveValue.x}
              y={LABEL.liveValue.y}
              textAnchor="middle"
              fill="#7c3aed"
              fontSize="13"
              fontWeight="900"
            >
              Overlap = {formatNumber(overlapRatio * 100, 0)}% · C ={" "}
              {formatCapacitance(capacitance)} · f ={" "}
              {formatFrequency(frequency)}
            </text>

            <FormulaPanel svgId={svgId} />

            <TuningBar tuningPercent={tuningPercent} />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Variable Capacitance
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Rotating the rotor changes effective plate overlap, so capacitance
            changes.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            C = {formatCapacitance(capacitance)}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            LC Tuning
          </p>
          <p className="mt-1 text-sm text-slate-700">
            A variable capacitor and an inductor form a resonant tuning circuit.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            f = {formatFrequency(frequency)}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Plate Overlap
          </p>
          <p className="mt-1 text-sm text-slate-700">
            More overlap means stronger electric field coupling and higher
            capacitance.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(overlapRatio * 100, 0)}%
          </p>
        </div>
      </div>
    </section>
  );
}
