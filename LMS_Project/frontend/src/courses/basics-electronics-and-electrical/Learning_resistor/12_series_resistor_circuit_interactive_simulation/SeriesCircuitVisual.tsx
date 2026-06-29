"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import { clamp, formatCurrent, formatNumber, formatResistance } from "./logic";
import type { ResistorItem } from "./types";

type SeriesCircuitVisualProps = {
  supplyVoltage: number;
  resistors: ResistorItem[];
};

const VIEW_BOX = "0 0 820 410";
const VIEW_BOX_WIDTH = 820;
const VIEW_BOX_HEIGHT = 410;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  formulaPanel: 1,
  buildBar: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const MIN_RESISTANCE = 0.001;
const MAX_CURRENT_FOR_FLOW = 0.035;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  wire: "#53657d",
  current: "#2563eb",
  active: "#38bdf8",
  voltage: "#16a34a",
  build: "#f59e0b",
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
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
}

const BASE_COMPONENT = {
  battery: { x: 58, y: 178, width: 88, height: 96, rotate: 0 },
  resistor: { x: 190, y: 109, width: 92, height: 66, rotate: 0 },
  formulaPanel: { x: 265, y: 218, width: 290, height: 38, rotate: 0 },
  buildBar: { x: 170, y: 352, width: 480, height: 13, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  battery: scaleComponent(
    BASE_COMPONENT.battery,
    CIRCUIT_COMPONENT_SCALE.battery,
  ),
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
  ),
  formulaPanel: scaleComponent(
    BASE_COMPONENT.formulaPanel,
    CIRCUIT_COMPONENT_SCALE.formulaPanel,
  ),
  buildBar: scaleComponent(
    BASE_COMPONENT.buildBar,
    CIRCUIT_COMPONENT_SCALE.buildBar,
  ),
} as const;

const NODE = {
  batteryPositive: pointOnComponent(COMPONENT.battery, 0.5, 0),
  batteryNegative: pointOnComponent(COMPONENT.battery, 0.5, 1),
  circuitY: 142,
  rightDropX: 700,
  bottomY: 304,
  startX: 190,
  endX: 700,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  batteryToSeriesStart: [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.circuitY },
    { x: NODE.startX, y: NODE.circuitY },
  ],

  seriesEndToBatteryNegative: (lastRight: number): Point[] => [
    { x: lastRight, y: NODE.circuitY },
    { x: NODE.rightDropX, y: NODE.circuitY },
    { x: NODE.rightDropX, y: NODE.bottomY },
    { x: NODE.batteryNegative.x, y: NODE.bottomY },
    NODE.batteryNegative,
  ],
} as const;

const LABEL = {
  title: { x: 410, y: 42 },
  sameCurrent: { x: 230, y: 92 },
  voltageShared: { x: 620, y: 92 },
  formula: { x: 410, y: 243 },
  summary: { x: 410, y: 282 },
} as const;

function WirePath({
  points,
  wireWidth,
}: {
  points: readonly Point[];
  wireWidth: number;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={wireWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function BatteryBlock({ svgId, voltage }: { svgId: string; voltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.battery.x}
        y={COMPONENT.battery.y}
        width={COMPONENT.battery.width}
        height={COMPONENT.battery.height}
        rx="16"
        fill="#0f172a"
        stroke="#94a3b8"
        strokeWidth="3"
        filter={`url(#${svgId}-shadow)`}
      />

      <text
        x={NODE.batteryPositive.x}
        y={COMPONENT.battery.y + 40}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="18"
        fontWeight="900"
      >
        DC
      </text>

      <text
        x={NODE.batteryPositive.x}
        y={COMPONENT.battery.y + 70}
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="18"
        fontWeight="900"
      >
        {formatNumber(voltage, 1)}V
      </text>

      <circle
        cx={NODE.batteryPositive.x}
        cy={NODE.batteryPositive.y}
        r="5.5"
        fill="#ef4444"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <circle
        cx={NODE.batteryNegative.x}
        cy={NODE.batteryNegative.y}
        r="5.5"
        fill="#2563eb"
        stroke="#ffffff"
        strokeWidth="2"
      />

      <text
        x={NODE.batteryPositive.x + 34}
        y={NODE.batteryPositive.y - 8}
        fill="#f97316"
        fontSize="16"
        fontWeight="900"
      >
        +
      </text>
      <text
        x={NODE.batteryNegative.x + 34}
        y={NODE.batteryNegative.y + 8}
        fill="#0ea5e9"
        fontSize="18"
        fontWeight="900"
      >
        −
      </text>
    </g>
  );
}

function SeriesResistorBlock({
  svgId,
  x,
  width,
  height,
  index,
  value,
  drop,
  heatLevel,
  circuitY,
}: {
  svgId: string;
  x: number;
  width: number;
  height: number;
  index: number;
  value: number;
  drop: number;
  heatLevel: number;
  circuitY: number;
}) {
  return (
    <g>
      <motion.g
        filter={`url(#${svgId}-shadow)`}
        animate={{ x: heatLevel > 0.7 ? [0, 1.2, -1.2, 0] : 0 }}
        transition={{ repeat: Infinity, duration: 0.22 }}
      >
        <rect
          x={x}
          y={circuitY - height / 2}
          width={width}
          height={height}
          rx={height / 2}
          fill={`url(#${svgId}-resistor)`}
          stroke="#111827"
          strokeWidth="4"
          filter={`url(#${svgId}-glow)`}
        />

        <rect
          x={x + width * 0.2}
          y={circuitY - height / 2}
          width="10"
          height={height}
          fill="#ef4444"
        />
        <rect
          x={x + width * 0.43}
          y={circuitY - height / 2}
          width="10"
          height={height}
          fill="#111827"
        />
        <rect
          x={x + width * 0.66}
          y={circuitY - height / 2}
          width="10"
          height={height}
          fill="#f59e0b"
        />

        <text
          x={x + width / 2}
          y={circuitY + 5}
          textAnchor="middle"
          fill="#78350f"
          fontSize="12"
          fontWeight="900"
        >
          R{index + 1}
        </text>
      </motion.g>

      <text
        x={x + width / 2}
        y={circuitY - 48}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        {formatResistance(value)}
      </text>

      <text
        x={x + width / 2}
        y={circuitY + 58}
        textAnchor="middle"
        fill={STYLE.current}
        fontSize="12"
        fontWeight="900"
      >
        V{index + 1} = {formatNumber(drop, 2)}V
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
        I = Vs / Rtotal
      </text>

      <line
        x1="285"
        y1="251"
        x2="535"
        y2="251"
        stroke="#fb923c"
        strokeWidth="2"
        opacity="0.45"
      />
    </g>
  );
}

function CurrentParticles({
  particles,
  currentSpeed,
  particleCount,
  currentPath,
}: {
  particles: number[];
  currentSpeed: number;
  particleCount: number;
  currentPath: string;
}) {
  return (
    <g>
      {particles.map((index) => (
        <circle
          key={`series-current-dot-${index}`}
          r="3.4"
          fill={STYLE.current}
          stroke="#dbeafe"
          strokeWidth="1.2"
        >
          <animateMotion
            dur={`${currentSpeed}s`}
            repeatCount="indefinite"
            path={currentPath}
            begin={`${index * (currentSpeed / particleCount)}s`}
          />
        </circle>
      ))}
    </g>
  );
}

function BuildBar({ totalResistance }: { totalResistance: number }) {
  return (
    <g transform={`translate(${COMPONENT.buildBar.x} ${COMPONENT.buildBar.y})`}>
      <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
        Total Resistance Build-up
      </text>

      <rect
        x="0"
        y="8"
        width={COMPONENT.buildBar.width}
        height={COMPONENT.buildBar.height}
        rx="7"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="8"
        height={COMPONENT.buildBar.height}
        rx="7"
        fill={STYLE.build}
        animate={{
          width:
            COMPONENT.buildBar.width * clamp(totalResistance / 20000, 0.06, 1),
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      <text
        x={COMPONENT.buildBar.width}
        y="46"
        textAnchor="end"
        fill="#475569"
        fontSize="12"
        fontWeight="700"
      >
        Rtotal = {formatResistance(totalResistance)}
      </text>
    </g>
  );
}

export function SeriesCircuitVisual({
  supplyVoltage,
  resistors,
}: SeriesCircuitVisualProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeVoltage = Number.isFinite(supplyVoltage) ? supplyVoltage : 0;
  const safeResistors =
    resistors.length > 0 ? resistors : [{ id: "fallback-r1", value: 1000 }];

  const totalResistance = Math.max(
    safeResistors.reduce(
      (sum, item) =>
        sum + Math.max(Number.isFinite(item.value) ? item.value : 0, 0),
      0,
    ),
    MIN_RESISTANCE,
  );

  const current = safeVoltage / totalResistance;

  const voltageDrops = safeResistors.map((item) => {
    const safeValue = Math.max(Number.isFinite(item.value) ? item.value : 0, 0);
    return current * safeValue;
  });

  const sumDrop = voltageDrops.reduce((sum, value) => sum + value, 0);
  const flowLevel = clamp(current / MAX_CURRENT_FOR_FLOW, 0.04, 1);
  const particleCount = clamp(Math.round(flowLevel * 22), 3, 26);
  const currentSpeed = clamp(2.8 - flowLevel * 1.7, 0.65, 2.9);
  const wireWidth = WIRE.width + flowLevel * 4;

  const resistorCount = safeResistors.length;
  const availableWidth = 420;
  const gap =
    resistorCount <= 3 ? 145 : availableWidth / Math.max(resistorCount - 1, 1);
  const resistorWidth = resistorCount <= 3 ? 92 : 76;
  const resistorHeight = COMPONENT.resistor.height;

  const resistorXs = safeResistors.map((_, index) => NODE.startX + index * gap);
  const lastResistorX = resistorXs[resistorXs.length - 1];
  const lastResistorRight = lastResistorX + resistorWidth;

  const currentPath = pathD([
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.circuitY },
    { x: NODE.startX, y: NODE.circuitY },
    { x: lastResistorRight, y: NODE.circuitY },
    { x: NODE.rightDropX, y: NODE.circuitY },
    { x: NODE.rightDropX, y: NODE.bottomY },
    { x: NODE.batteryNegative.x, y: NODE.bottomY },
    NODE.batteryNegative,
  ]);

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
            Series Resistor Circuit Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            In a series circuit, total resistance adds together, current stays
            the same, and voltage is shared across each resistor.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          SERIES CONNECTION
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[820px] sm:w-full"
          role="img"
          aria-label="Series resistor circuit visualizer showing same current and shared voltage"
        >
          <defs>
            <linearGradient id={`${svgId}-resistor`} x1="0" x2="1">
              <stop offset="0%" stopColor="#f8d890" />
              <stop offset="55%" stopColor="#e8b95d" />
              <stop offset="100%" stopColor="#dca843" />
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
              x="-50%"
              y="-65%"
              width="200%"
              height="230%"
            >
              <feGaussianBlur stdDeviation={2 + flowLevel * 8} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="8" y="10" width="804" height="385" rx="20" fill="#f8fafc" />

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="900"
            >
              Rtotal = R1 + R2 + R3 ... | Same current flows through every
              resistor
            </text>

            <WirePath
              points={WIRE.batteryToSeriesStart}
              wireWidth={wireWidth}
            />

            <WirePath
              points={WIRE.seriesEndToBatteryNegative(lastResistorRight)}
              wireWidth={wireWidth}
            />

            <BatteryBlock svgId={svgId} voltage={safeVoltage} />

            {safeResistors.map((item, index) => {
              const x = resistorXs[index];
              const safeValue = Math.max(
                Number.isFinite(item.value) ? item.value : 0,
                0,
              );
              const drop = voltageDrops[index];
              const heatLevel = clamp(
                drop / Math.max(Math.abs(safeVoltage), 1),
                0.08,
                1,
              );
              const previousRight =
                index === 0
                  ? NODE.startX
                  : resistorXs[index - 1] + resistorWidth;

              return (
                <g key={item.id}>
                  {index > 0 && (
                    <WirePath
                      points={[
                        { x: previousRight, y: NODE.circuitY },
                        { x, y: NODE.circuitY },
                      ]}
                      wireWidth={wireWidth}
                    />
                  )}

                  <SeriesResistorBlock
                    svgId={svgId}
                    x={x}
                    width={resistorWidth}
                    height={resistorHeight}
                    index={index}
                    value={safeValue}
                    drop={drop}
                    heatLevel={heatLevel}
                    circuitY={NODE.circuitY}
                  />
                </g>
              );
            })}

            <FormulaPanel svgId={svgId} />

            <text
              x={LABEL.summary.x}
              y={LABEL.summary.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="12"
              fontWeight="800"
            >
              I = {formatCurrent(current)} · Rtotal ={" "}
              {formatResistance(totalResistance)} · Vdrop sum ={" "}
              {formatNumber(sumDrop, 2)}V
            </text>

            <CurrentParticles
              particles={particles}
              currentSpeed={currentSpeed}
              particleCount={particleCount}
              currentPath={currentPath}
            />

            <circle
              cx="410"
              cy={NODE.bottomY}
              r="4"
              fill={STYLE.current}
              stroke="#dbeafe"
            />
            <circle
              cx={NODE.rightDropX}
              cy={NODE.bottomY}
              r="3.5"
              fill={STYLE.active}
            />

            <text
              x={LABEL.sameCurrent.x}
              y={LABEL.sameCurrent.y}
              textAnchor="middle"
              fill={STYLE.current}
              fontSize="12"
              fontWeight="900"
            >
              Same conventional current through all resistors
            </text>

            <text
              x={LABEL.voltageShared.x}
              y={LABEL.voltageShared.y}
              textAnchor="middle"
              fill={STYLE.voltage}
              fontSize="12"
              fontWeight="900"
            >
              Voltage is shared
            </text>

            <BuildBar totalResistance={totalResistance} />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-700">
            Total Resistance
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Rtotal ={" "}
            {safeResistors.map((_, index) => `R${index + 1}`).join(" + ")}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Rtotal = {formatResistance(totalResistance)}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Same Current
          </p>
          <p className="mt-1 text-sm text-slate-700">I = Vs / Rtotal</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            I = {formatNumber(safeVoltage, 1)}V /{" "}
            {formatResistance(totalResistance)} = {formatCurrent(current)}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Voltage Drop Check
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {voltageDrops.map((_, index) => `V${index + 1}`).join(" + ")} = Vs
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(sumDrop, 2)}V ≈ {formatNumber(safeVoltage, 1)}V
          </p>
        </div>
      </div>
    </section>
  );
}
