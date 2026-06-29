"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import {
  ceramicCodeToPf,
  clamp,
  dielectricOptions,
  formatCapacitancePf,
  formatNumber,
} from "./logic";

type CeramicCapacitorVisualProps = {
  code: string;
  dielectricIndex: number;
  appliedVoltage: number;
  voltageRating: number;
  frequency: number;
};

const VIEW_BOX = "0 0 840 455";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 455;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  capacitorBody: 1,
  mlccWindow: 1,
  leftTerminal: 1,
  rightTerminal: 1,
  formulaPanel: 1,
  filterBar: 1,
} as const;

const BASE_WIRE_WIDTH = 7;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  panel: "#f8fafc",
  wire: "#53657d",
  metal: "#475569",
  field: "#8b5cf6",
  inputRipple: "#0ea5e9",
  bypassRipple: "#f97316",
  outputRipple: "#22c55e",
  danger: "#ef4444",
  safe: "#16a34a",
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
  capacitorBody: {
    x: 252,
    y: 114,
    width: 336,
    height: 192,
    rotate: 0,
  },

  mlccWindow: {
    x: 300,
    y: 135,
    width: 240,
    height: 150,
    rotate: 0,
  },

  leftTerminal: {
    x: 288,
    y: 135,
    width: 16,
    height: 150,
    rotate: 0,
  },

  rightTerminal: {
    x: 536,
    y: 135,
    width: 16,
    height: 150,
    rotate: 0,
  },

  formulaPanel: {
    x: 274,
    y: 338,
    width: 292,
    height: 36,
    rotate: 0,
  },

  filterBar: {
    x: 160,
    y: 392,
    width: 500,
    height: 13,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  capacitorBody: scaleComponent(
    BASE_COMPONENT.capacitorBody,
    CIRCUIT_COMPONENT_SCALE.capacitorBody,
  ),
  mlccWindow: scaleComponent(
    BASE_COMPONENT.mlccWindow,
    CIRCUIT_COMPONENT_SCALE.mlccWindow,
  ),
  leftTerminal: scaleComponent(
    BASE_COMPONENT.leftTerminal,
    CIRCUIT_COMPONENT_SCALE.leftTerminal,
  ),
  rightTerminal: scaleComponent(
    BASE_COMPONENT.rightTerminal,
    CIRCUIT_COMPONENT_SCALE.rightTerminal,
  ),
  formulaPanel: scaleComponent(
    BASE_COMPONENT.formulaPanel,
    CIRCUIT_COMPONENT_SCALE.formulaPanel,
  ),
  filterBar: scaleComponent(
    BASE_COMPONENT.filterBar,
    CIRCUIT_COMPONENT_SCALE.filterBar,
  ),
} as const;

const NODE = {
  inputStart: { x: 82, y: 210 },
  inputEnd: { x: 252, y: 210 },

  outputStart: { x: 588, y: 210 },
  outputEnd: { x: 758, y: 210 },

  bodyCenter: pointOnComponent(COMPONENT.capacitorBody, 0.5, 0.5),
  mlccCenter: pointOnComponent(COMPONENT.mlccWindow, 0.5, 0.5),

  bypassStart: { x: 300, y: 210 },
  bypassControl1: { x: 330, y: 250 },
  bypassControl2: { x: 370, y: 270 },
  bypassEnd: { x: 420, y: 270 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  inputWire: [NODE.inputStart, NODE.inputEnd],
  outputWire: [NODE.outputStart, NODE.outputEnd],
} as const;

const PATH = {
  inputNoise: pathD([NODE.inputStart, { x: 232, y: 210 }]),
  outputSignal: pathD([NODE.outputStart, NODE.outputEnd]),
  bypass: `M${NODE.bypassStart.x} ${NODE.bypassStart.y} C${NODE.bypassControl1.x} ${NODE.bypassControl1.y} ${NODE.bypassControl2.x} ${NODE.bypassControl2.y} ${NODE.bypassEnd.x} ${NODE.bypassEnd.y}`,
} as const;

const LABEL = {
  title: { x: 420, y: 42 },
  code: { x: 420, y: 205 },
  capacitance: { x: 420, y: 235 },
  dielectric: { x: 420, y: 262 },
  inputNoise: { x: 170, y: 165 },
  cleanOutput: { x: 668, y: 165 },
  voltageInfo: { x: 420, y: 324 },
  formulaText: { x: 420, y: 362 },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      fill="none"
    />
  );
}

function CeramicBody({
  svgId,
  dielectricColor,
}: {
  svgId: string;
  dielectricColor: string;
}) {
  return (
    <g>
      <motion.ellipse
        cx={NODE.bodyCenter.x}
        cy={NODE.bodyCenter.y}
        rx={COMPONENT.capacitorBody.width / 2}
        ry={COMPONENT.capacitorBody.height / 2}
        fill={`url(#${svgId}-body)`}
        stroke="#111827"
        strokeWidth="4"
        filter={`url(#${svgId}-ceramicGlow)`}
        animate={{ opacity: [0.88, 1, 0.88] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />

      <rect
        x={COMPONENT.mlccWindow.x}
        y={COMPONENT.mlccWindow.y}
        width={COMPONENT.mlccWindow.width}
        height={COMPONENT.mlccWindow.height}
        rx="22"
        fill="#ffffff"
        opacity="0.38"
        stroke={STYLE.muted}
        strokeDasharray="6 5"
      />

      <rect
        x={COMPONENT.leftTerminal.x}
        y={COMPONENT.leftTerminal.y}
        width={COMPONENT.leftTerminal.width}
        height={COMPONENT.leftTerminal.height}
        rx="6"
        fill={STYLE.metal}
        opacity="0.92"
      />

      <rect
        x={COMPONENT.rightTerminal.x}
        y={COMPONENT.rightTerminal.y}
        width={COMPONENT.rightTerminal.width}
        height={COMPONENT.rightTerminal.height}
        rx="6"
        fill={STYLE.metal}
        opacity="0.92"
      />
    </g>
  );
}

function MlcLayers({
  layers,
  dielectricColor,
}: {
  layers: number[];
  dielectricColor: string;
}) {
  return (
    <g>
      {layers.map((index) => {
        const y = 150 + index * 18;
        const isMetal = index % 2 === 0;

        return (
          <g key={`mlcc-layer-${index}`}>
            <rect
              x={isMetal ? 326 : 350}
              y={y}
              width={isMetal ? 145 : 95}
              height="8"
              rx="4"
              fill={isMetal ? STYLE.metal : dielectricColor}
              opacity={isMetal ? 0.92 : 0.7}
            />

            <text
              x={isMetal ? 488 : 462}
              y={y + 8}
              fill={isMetal ? STYLE.muted : "#7c3aed"}
              fontSize="8"
              fontWeight="800"
            >
              {isMetal ? "metal" : "ceramic"}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function FieldLines({ fieldLines }: { fieldLines: number[] }) {
  return (
    <g>
      {fieldLines.map((index) => {
        const y = 150 + index * (118 / Math.max(fieldLines.length - 1, 1));

        return (
          <motion.g
            key={`ceramic-field-${index}`}
            animate={{ opacity: [0.25, 0.9, 0.25] }}
            transition={{
              repeat: Infinity,
              duration: 1.35,
              delay: index * 0.04,
            }}
          >
            <line
              x1="330"
              y1={y}
              x2="510"
              y2={y}
              stroke={STYLE.field}
              strokeWidth="2"
              strokeLinecap="round"
            />

            <polygon
              points={`510,${y} 502,${y - 4} 502,${y + 4}`}
              fill={STYLE.field}
            />
          </motion.g>
        );
      })}
    </g>
  );
}

function RippleFlow({
  rippleDots,
  rippleSpeed,
  rippleCount,
  filterLevel,
}: {
  rippleDots: number[];
  rippleSpeed: number;
  rippleCount: number;
  filterLevel: number;
}) {
  return (
    <g>
      {rippleDots.map((index) => (
        <circle
          key={`input-ripple-${index}`}
          r="3.5"
          fill={STYLE.inputRipple}
          stroke="#e0f2fe"
          strokeWidth="1.2"
        >
          <animateMotion
            dur={`${rippleSpeed}s`}
            repeatCount="indefinite"
            path={PATH.inputNoise}
            begin={`${index * (rippleSpeed / rippleCount)}s`}
          />
        </circle>
      ))}

      {rippleDots
        .slice(0, Math.max(3, Math.floor(rippleDots.length * filterLevel)))
        .map((index) => (
          <circle
            key={`bypass-ripple-${index}`}
            r="3.4"
            fill={STYLE.bypassRipple}
            stroke="#ffedd5"
            strokeWidth="1.2"
          >
            <animateMotion
              dur={`${rippleSpeed * 1.15}s`}
              repeatCount="indefinite"
              path={PATH.bypass}
              begin={`${index * (rippleSpeed / rippleCount)}s`}
            />
          </circle>
        ))}

      {rippleDots
        .slice(
          0,
          Math.max(2, Math.round(rippleDots.length * (1 - filterLevel) * 0.6)),
        )
        .map((index) => (
          <circle
            key={`output-ripple-${index}`}
            r="3.1"
            fill={STYLE.outputRipple}
            stroke="#dcfce7"
            strokeWidth="1.1"
          >
            <animateMotion
              dur={`${rippleSpeed * 1.25}s`}
              repeatCount="indefinite"
              path={PATH.outputSignal}
              begin={`${index * (rippleSpeed / rippleCount)}s`}
            />
          </circle>
        ))}
    </g>
  );
}

function InfoPanel({ svgId }: { svgId: string }) {
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
        x={LABEL.formulaText.x}
        y={LABEL.formulaText.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="16"
        fontWeight="900"
      >
        High frequency noise → capacitor → ground/bypass
      </text>
    </g>
  );
}

function FilterBar({
  filterLevel,
  isOverVoltage,
  safeFrequency,
  voltageStress,
}: {
  filterLevel: number;
  isOverVoltage: boolean;
  safeFrequency: number;
  voltageStress: number;
}) {
  return (
    <g
      transform={`translate(${COMPONENT.filterBar.x} ${COMPONENT.filterBar.y})`}
    >
      <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
        Filtering / Bypass Effect
      </text>

      <rect
        x="0"
        y="8"
        width={COMPONENT.filterBar.width}
        height={COMPONENT.filterBar.height}
        rx="7"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="8"
        height={COMPONENT.filterBar.height}
        rx="7"
        fill={isOverVoltage ? STYLE.danger : STYLE.bypassRipple}
        animate={{ width: COMPONENT.filterBar.width * filterLevel }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      <text
        x={COMPONENT.filterBar.width}
        y="46"
        textAnchor="end"
        fill="#475569"
        fontSize="12"
        fontWeight="700"
      >
        Frequency: {formatNumber(safeFrequency, 0)} Hz · Stress:{" "}
        {formatNumber(voltageStress * 100, 0)}%
      </text>
    </g>
  );
}

export function CeramicCapacitorVisual({
  code,
  dielectricIndex,
  appliedVoltage,
  voltageRating,
  frequency,
}: CeramicCapacitorVisualProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeCode = code.trim() || "104";
  const capacitancePf = Math.max(ceramicCodeToPf(safeCode), 0);

  const safeDielectricIndex = clamp(
    Math.round(Number.isFinite(dielectricIndex) ? dielectricIndex : 0),
    0,
    dielectricOptions.length - 1,
  );

  const dielectric = dielectricOptions[safeDielectricIndex];

  const safeVoltageRating = Math.max(
    Number.isFinite(voltageRating) ? voltageRating : 0,
    0.001,
  );

  const safeAppliedVoltage = Math.max(
    Number.isFinite(appliedVoltage) ? appliedVoltage : 0,
    0,
  );

  const safeFrequency = Math.max(Number.isFinite(frequency) ? frequency : 0, 0);

  const voltageStress = clamp(safeAppliedVoltage / safeVoltageRating, 0, 1.4);
  const frequencyEffect = clamp(Math.log10(safeFrequency + 1) / 6, 0.04, 1);
  const capacitanceEffect = clamp(capacitancePf / 100_000, 0.05, 1);

  const filterLevel = clamp(
    frequencyEffect * capacitanceEffect * dielectric.stability,
    0.06,
    1,
  );

  const bodyGlow = clamp(capacitanceEffect * dielectric.stability, 0.12, 1);
  const rippleCount = clamp(Math.round(filterLevel * 18), 4, 20);
  const rippleSpeed = clamp(2.8 - filterLevel * 1.7, 0.7, 2.9);
  const fieldLineCount = clamp(Math.round(filterLevel * 11), 4, 12);
  const layerCount = 7;

  const isOverVoltage = voltageStress >= 1;
  const margin = safeVoltageRating - safeAppliedVoltage;

  const rippleDots = useMemo(
    () => Array.from({ length: rippleCount }, (_, index) => index),
    [rippleCount],
  );

  const layers = useMemo(
    () => Array.from({ length: layerCount }, (_, index) => index),
    [],
  );

  const fieldLines = useMemo(
    () => Array.from({ length: fieldLineCount }, (_, index) => index),
    [fieldLineCount],
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Ceramic Capacitor Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Ceramic capacitors are non-polarized components used for bypass,
            decoupling, and high-frequency noise filtering.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isOverVoltage
              ? "bg-red-100 text-red-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {isOverVoltage ? "OVER VOLTAGE" : "NON-POLARIZED"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[840px] sm:w-full"
          role="img"
          aria-label="Professional ceramic capacitor visualizer showing MLCC structure and high frequency filtering"
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
              id={`${svgId}-ceramicGlow`}
              x="-50%"
              y="-60%"
              width="200%"
              height="230%"
            >
              <feGaussianBlur stdDeviation={3 + bodyGlow * 8} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id={`${svgId}-body`} x1="0" x2="1">
              <stop offset="0%" stopColor={dielectric.color} />
              <stop offset="55%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor={dielectric.color} />
            </linearGradient>
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
              MLCC structure: ceramic dielectric layers + metal electrodes ·
              High-frequency noise is bypassed
            </text>

            <WirePath points={WIRE.inputWire} />
            <WirePath points={WIRE.outputWire} />

            <CeramicBody svgId={svgId} dielectricColor={dielectric.color} />

            <MlcLayers layers={layers} dielectricColor={dielectric.color} />

            <FieldLines fieldLines={fieldLines} />

            <text
              x={LABEL.code.x}
              y={LABEL.code.y}
              textAnchor="middle"
              fill="#111827"
              fontSize="30"
              fontWeight="900"
            >
              {safeCode}
            </text>

            <text
              x={LABEL.capacitance.x}
              y={LABEL.capacitance.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="900"
            >
              {formatCapacitancePf(capacitancePf)}
            </text>

            <text
              x={LABEL.dielectric.x}
              y={LABEL.dielectric.y}
              textAnchor="middle"
              fill="#7c3aed"
              fontSize="12"
              fontWeight="900"
            >
              Dielectric: {dielectric.name}
            </text>

            <RippleFlow
              rippleDots={rippleDots}
              rippleSpeed={rippleSpeed}
              rippleCount={rippleCount}
              filterLevel={filterLevel}
            />

            <text
              x={LABEL.inputNoise.x}
              y={LABEL.inputNoise.y}
              textAnchor="middle"
              fill="#2563eb"
              fontSize="12"
              fontWeight="900"
            >
              Noisy signal / ripple
            </text>

            <text
              x={LABEL.cleanOutput.x}
              y={LABEL.cleanOutput.y}
              textAnchor="middle"
              fill={STYLE.safe}
              fontSize="12"
              fontWeight="900"
            >
              Cleaner output
            </text>

            <text
              x={LABEL.voltageInfo.x}
              y={LABEL.voltageInfo.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="12"
              fontWeight="900"
            >
              Applied: {formatNumber(safeAppliedVoltage, 1)}V / Rated:{" "}
              {formatNumber(safeVoltageRating, 1)}V · Margin:{" "}
              {formatNumber(margin, 1)}V
            </text>

            <InfoPanel svgId={svgId} />

            <FilterBar
              filterLevel={filterLevel}
              isOverVoltage={isOverVoltage}
              safeFrequency={safeFrequency}
              voltageStress={voltageStress}
            />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            MLCC Structure
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Ceramic capacitors use stacked metal electrodes separated by ceramic
            dielectric layers.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {dielectric.name}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Code Reading
          </p>
          <p className="mt-1 text-sm text-slate-700">
            First two digits are significant figures; the third digit is the pF
            multiplier.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {safeCode} = {formatCapacitancePf(capacitancePf)}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Voltage Safety
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Keep applied voltage below the rating to avoid dielectric stress or
            failure.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(safeVoltageRating, 1)}V rated
          </p>
        </div>
      </div>
    </section>
  );
}
