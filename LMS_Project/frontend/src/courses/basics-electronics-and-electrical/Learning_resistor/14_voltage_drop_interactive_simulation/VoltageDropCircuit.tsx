"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import { clamp, formatCurrent, formatNumber, formatResistance } from "./logic";

type VoltageDropCircuitProps = {
  supplyVoltage: number;
  r1: number;
  r2: number;
  r3: number;
  showR3: boolean;
};

const VIEW_BOX = "0 0 780 410";
const VIEW_BOX_WIDTH = 780;
const VIEW_BOX_HEIGHT = 410;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  formulaPanel: 1,
  voltageBar: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const MIN_RESISTANCE = 0.001;
const MAX_CURRENT_FOR_FLOW = 0.03;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  wire: "#53657d",
  current: "#2563eb",
  active: "#38bdf8",
  voltage: "#16a34a",
  heat: "#fb923c",
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
  battery: { x: 58, y: 178, width: 88, height: 96, rotate: 0 },
  resistor: { x: 205, y: 109, width: 88, height: 66, rotate: 0 },
  formulaPanel: { x: 255, y: 218, width: 270, height: 38, rotate: 0 },
  voltageBar: { x: 150, y: 352, width: 500, height: 13, rotate: 0 },
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
  voltageBar: scaleComponent(
    BASE_COMPONENT.voltageBar,
    CIRCUIT_COMPONENT_SCALE.voltageBar,
  ),
} as const;

const NODE = {
  batteryPositive: pointOnComponent(COMPONENT.battery, 0.5, 0),
  batteryNegative: pointOnComponent(COMPONENT.battery, 0.5, 1),

  circuitY: 142,
  rightDropX: 665,
  bottomY: 304,

  twoResistorX: [260, 430],
  threeResistorX: [205, 355, 505],
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  batteryToFirstResistor: (firstX: number): Point[] => [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.circuitY },
    { x: firstX, y: NODE.circuitY },
  ],

  lastResistorToBattery: (lastRight: number): Point[] => [
    { x: lastRight, y: NODE.circuitY },
    { x: NODE.rightDropX, y: NODE.circuitY },
    { x: NODE.rightDropX, y: NODE.bottomY },
    { x: NODE.batteryNegative.x, y: NODE.bottomY },
    NODE.batteryNegative,
  ],

  resistorGap: (previousRight: number, nextX: number): Point[] => [
    { x: previousRight, y: NODE.circuitY },
    { x: nextX, y: NODE.circuitY },
  ],
} as const;

const LABEL = {
  title: { x: 390, y: 42 },
  sameCurrent: { x: 215, y: 92 },
  voltageDivided: { x: 575, y: 92 },
  formula: { x: 390, y: 243 },
  summary: { x: 390, y: 282 },
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

function ResistorBlock({
  svgId,
  x,
  index,
  resistance,
  drop,
  dropRatio,
}: {
  svgId: string;
  x: number;
  index: number;
  resistance: number;
  drop: number;
  dropRatio: number;
}) {
  return (
    <g>
      <motion.g
        filter={`url(#${svgId}-shadow)`}
        animate={{ x: dropRatio > 0.7 ? [0, 1.2, -1.2, 0] : 0 }}
        transition={{ repeat: Infinity, duration: 0.22 }}
      >
        <rect
          x={x}
          y={NODE.circuitY - COMPONENT.resistor.height / 2}
          width={COMPONENT.resistor.width}
          height={COMPONENT.resistor.height}
          rx={COMPONENT.resistor.height / 2}
          fill={dropRatio > 0.55 ? STYLE.heat : `url(#${svgId}-resistor)`}
          stroke="#111827"
          strokeWidth="4"
          filter={`url(#${svgId}-glow)`}
        />

        <rect
          x={x + 17}
          y={NODE.circuitY - COMPONENT.resistor.height / 2}
          width="10"
          height={COMPONENT.resistor.height}
          fill="#ef4444"
        />
        <rect
          x={x + 39}
          y={NODE.circuitY - COMPONENT.resistor.height / 2}
          width="10"
          height={COMPONENT.resistor.height}
          fill="#111827"
        />
        <rect
          x={x + 61}
          y={NODE.circuitY - COMPONENT.resistor.height / 2}
          width="10"
          height={COMPONENT.resistor.height}
          fill="#f59e0b"
        />

        <text
          x={x + COMPONENT.resistor.width / 2}
          y={NODE.circuitY + 5}
          textAnchor="middle"
          fill="#78350f"
          fontSize="12"
          fontWeight="900"
        >
          R{index + 1}
        </text>
      </motion.g>

      <text
        x={x + COMPONENT.resistor.width / 2}
        y={NODE.circuitY - 48}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        {formatResistance(resistance)}
      </text>

      <text
        x={x + COMPONENT.resistor.width / 2}
        y={NODE.circuitY + 58}
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
        Vdrop = I × R
      </text>

      <line
        x1="280"
        y1="251"
        x2="500"
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
  particleCount,
  currentSpeed,
  currentPath,
}: {
  particles: number[];
  particleCount: number;
  currentSpeed: number;
  currentPath: string;
}) {
  return (
    <g>
      {particles.map((index) => (
        <circle
          key={`voltage-drop-current-${index}`}
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

function VoltageDropBar({
  sumDrop,
  safeVoltage,
}: {
  sumDrop: number;
  safeVoltage: number;
}) {
  return (
    <g
      transform={`translate(${COMPONENT.voltageBar.x} ${COMPONENT.voltageBar.y})`}
    >
      <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
        Voltage Drop Sum
      </text>

      <rect
        x="0"
        y="8"
        width={COMPONENT.voltageBar.width}
        height={COMPONENT.voltageBar.height}
        rx="7"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="8"
        height={COMPONENT.voltageBar.height}
        rx="7"
        fill={STYLE.current}
        animate={{
          width:
            COMPONENT.voltageBar.width *
            clamp(Math.abs(sumDrop) / Math.max(Math.abs(safeVoltage), 1), 0, 1),
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      <text
        x={COMPONENT.voltageBar.width}
        y="46"
        textAnchor="end"
        fill="#475569"
        fontSize="12"
        fontWeight="700"
      >
        {formatNumber(sumDrop, 2)}V / {formatNumber(safeVoltage, 1)}V
      </text>
    </g>
  );
}

export function VoltageDropCircuit({
  supplyVoltage,
  r1,
  r2,
  r3,
  showR3,
}: VoltageDropCircuitProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeVoltage = Number.isFinite(supplyVoltage) ? supplyVoltage : 0;

  const resistors = [r1, r2, ...(showR3 ? [r3] : [])].map((value) =>
    Math.max(Number.isFinite(value) ? value : 0, MIN_RESISTANCE),
  );

  const totalResistance = Math.max(
    resistors.reduce((sum, value) => sum + value, 0),
    MIN_RESISTANCE,
  );

  const current = safeVoltage / totalResistance;
  const drops = resistors.map((resistance) => current * resistance);
  const sumDrop = drops.reduce((sum, value) => sum + value, 0);

  const flowLevel = clamp(Math.abs(current) / MAX_CURRENT_FOR_FLOW, 0.04, 1);
  const particleCount = clamp(Math.round(flowLevel * 22), 3, 26);
  const currentSpeed = clamp(2.8 - flowLevel * 1.7, 0.65, 2.9);
  const wireWidth = WIRE.width + flowLevel * 4;

  const resistorXs = showR3 ? NODE.threeResistorX : NODE.twoResistorX;
  const lastRight =
    resistorXs[resistorXs.length - 1] + COMPONENT.resistor.width;

  const currentPath = pathD([
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.circuitY },
    { x: resistorXs[0], y: NODE.circuitY },
    { x: lastRight, y: NODE.circuitY },
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
            Voltage Drop Circuit Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            In a series circuit, the supply voltage is divided across resistors
            according to their resistance values.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          SERIES VOLTAGE DROP
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[780px] sm:w-full"
          role="img"
          aria-label="Series voltage drop circuit visualizer"
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

          <rect x="8" y="10" width="764" height="385" rx="20" fill="#f8fafc" />

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="900"
            >
              Vs = V1 + V2 {showR3 ? "+ V3" : ""} · Current is same through
              every resistor
            </text>

            <WirePath
              points={WIRE.batteryToFirstResistor(resistorXs[0])}
              wireWidth={wireWidth}
            />

            <WirePath
              points={WIRE.lastResistorToBattery(lastRight)}
              wireWidth={wireWidth}
            />

            <BatteryBlock svgId={svgId} voltage={safeVoltage} />

            {resistors.map((resistance, index) => {
              const x = resistorXs[index];
              const previousRight =
                index === 0
                  ? resistorXs[0]
                  : resistorXs[index - 1] + COMPONENT.resistor.width;

              const drop = drops[index];
              const dropRatio = clamp(
                Math.abs(drop) / Math.max(Math.abs(safeVoltage), 1),
                0.08,
                1,
              );

              return (
                <g key={`voltage-drop-r${index + 1}`}>
                  {index > 0 && (
                    <WirePath
                      points={WIRE.resistorGap(previousRight, x)}
                      wireWidth={wireWidth}
                    />
                  )}

                  <ResistorBlock
                    svgId={svgId}
                    x={x}
                    index={index}
                    resistance={resistance}
                    drop={drop}
                    dropRatio={dropRatio}
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
              particleCount={particleCount}
              currentSpeed={currentSpeed}
              currentPath={currentPath}
            />

            <circle
              cx="390"
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
              Same conventional current through series path
            </text>

            <text
              x={LABEL.voltageDivided.x}
              y={LABEL.voltageDivided.y}
              textAnchor="middle"
              fill={STYLE.voltage}
              fontSize="12"
              fontWeight="900"
            >
              Supply voltage is divided
            </text>

            <VoltageDropBar sumDrop={sumDrop} safeVoltage={safeVoltage} />
          </g>
        </svg>
      </div>
    </section>
  );
}
