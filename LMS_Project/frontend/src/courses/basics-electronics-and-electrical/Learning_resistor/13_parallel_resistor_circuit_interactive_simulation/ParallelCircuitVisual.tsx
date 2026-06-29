"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import {
  clamp,
  equivalentParallel,
  formatCurrent,
  formatNumber,
  formatResistance,
} from "./logic";
import type { BranchItem } from "./types";

type ParallelCircuitVisualProps = {
  supplyVoltage: number;
  branches: BranchItem[];
};

const VIEW_BOX = "0 0 840 450";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 450;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  branchResistor: 1,
  formulaPanel: 1,
  resistanceBar: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const MIN_RESISTANCE = 0.001;
const MAX_CURRENT_FOR_FLOW = 0.08;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  wire: "#53657d",
  current: "#2563eb",
  mainCurrent: "#7c3aed",
  active: "#38bdf8",
  voltage: "#2563eb",
  branchCurrent: "#16a34a",
  parallel: "#8b5cf6",
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
  battery: { x: 58, y: 170, width: 88, height: 96, rotate: 0 },
  branchResistor: { x: 305, y: 79, width: 185, height: 52, rotate: 0 },
  formulaPanel: { x: 275, y: 305, width: 290, height: 36, rotate: 0 },
  resistanceBar: { x: 170, y: 382, width: 500, height: 13, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  battery: scaleComponent(
    BASE_COMPONENT.battery,
    CIRCUIT_COMPONENT_SCALE.battery,
  ),
  branchResistor: scaleComponent(
    BASE_COMPONENT.branchResistor,
    CIRCUIT_COMPONENT_SCALE.branchResistor,
  ),
  formulaPanel: scaleComponent(
    BASE_COMPONENT.formulaPanel,
    CIRCUIT_COMPONENT_SCALE.formulaPanel,
  ),
  resistanceBar: scaleComponent(
    BASE_COMPONENT.resistanceBar,
    CIRCUIT_COMPONENT_SCALE.resistanceBar,
  ),
} as const;

const NODE = {
  batteryPositive: pointOnComponent(COMPONENT.battery, 0.5, 0),
  batteryNegative: pointOnComponent(COMPONENT.battery, 0.5, 1),

  leftBusX: 190,
  resistorX: 305,
  resistorRightX: 490,
  rightBusX: 650,
  returnY: 330,

  firstBranchY: 105,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  leftBus: (topY: number, bottomY: number): Point[] => [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: topY },
    { x: NODE.leftBusX, y: topY },
    { x: NODE.leftBusX, y: bottomY },
  ],

  rightBusReturn: (topY: number): Point[] => [
    { x: NODE.rightBusX, y: topY },
    { x: NODE.rightBusX, y: NODE.returnY },
    { x: NODE.batteryNegative.x, y: NODE.returnY },
    NODE.batteryNegative,
  ],

  branchInput: (y: number): Point[] => [
    { x: NODE.leftBusX, y },
    { x: NODE.resistorX, y },
  ],

  branchOutput: (y: number): Point[] => [
    { x: NODE.resistorRightX, y },
    { x: NODE.rightBusX, y },
  ],
} as const;

const LABEL = {
  title: { x: 420, y: 42 },
  split: { x: 240, y: 82 },
  rejoin: { x: 620, y: 82 },
  formula: { x: 420, y: 329 },
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

function BranchResistorBlock({
  svgId,
  y,
  index,
  resistance,
  voltage,
  current,
}: {
  svgId: string;
  y: number;
  index: number;
  resistance: number;
  voltage: number;
  current: number;
}) {
  return (
    <g>
      <motion.g
        filter={`url(#${svgId}-shadow)`}
        animate={{ opacity: [0.94, 1, 0.94] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <rect
          x={NODE.resistorX}
          y={y - COMPONENT.branchResistor.height / 2}
          width={COMPONENT.branchResistor.width}
          height={COMPONENT.branchResistor.height}
          rx={COMPONENT.branchResistor.height / 2}
          fill={`url(#${svgId}-resistor)`}
          stroke="#111827"
          strokeWidth="4"
          filter={`url(#${svgId}-glow)`}
        />

        <rect
          x={NODE.resistorX + 32}
          y={y - COMPONENT.branchResistor.height / 2}
          width="11"
          height={COMPONENT.branchResistor.height}
          fill="#ef4444"
        />
        <rect
          x={NODE.resistorX + 78}
          y={y - COMPONENT.branchResistor.height / 2}
          width="11"
          height={COMPONENT.branchResistor.height}
          fill="#111827"
        />
        <rect
          x={NODE.resistorX + 124}
          y={y - COMPONENT.branchResistor.height / 2}
          width="11"
          height={COMPONENT.branchResistor.height}
          fill="#f59e0b"
        />
        <rect
          x={NODE.resistorX + 160}
          y={y - COMPONENT.branchResistor.height / 2}
          width="11"
          height={COMPONENT.branchResistor.height}
          fill="#d4af37"
        />

        <text
          x={NODE.resistorX + COMPONENT.branchResistor.width / 2}
          y={y + 5}
          textAnchor="middle"
          fill="#78350f"
          fontSize="12"
          fontWeight="900"
        >
          R{index + 1}
        </text>
      </motion.g>

      <text
        x={NODE.resistorX + COMPONENT.branchResistor.width / 2}
        y={y - 38}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        {formatResistance(resistance)}
      </text>

      <text
        x="245"
        y={y - 8}
        textAnchor="middle"
        fill={STYLE.voltage}
        fontSize="12"
        fontWeight="900"
      >
        V = {formatNumber(voltage, 1)}V
      </text>

      <text
        x="585"
        y={y - 8}
        textAnchor="middle"
        fill={STYLE.branchCurrent}
        fontSize="12"
        fontWeight="900"
      >
        I{index + 1} = {formatCurrent(current)}
      </text>
    </g>
  );
}

function BranchParticles({
  branchId,
  y,
  branchCurrent,
  totalCurrent,
}: {
  branchId: string;
  y: number;
  branchCurrent: number;
  totalCurrent: number;
}) {
  const branchFlow = clamp(
    Math.abs(branchCurrent) / Math.max(Math.abs(totalCurrent), 0.000001),
    0.12,
    1,
  );

  const branchParticleCount = clamp(Math.round(branchFlow * 16), 4, 18);
  const branchSpeed = clamp(2.6 - branchFlow * 1.4, 0.7, 2.7);
  const branchCurrentPath = pathD([
    { x: NODE.leftBusX, y },
    { x: NODE.resistorX, y },
    { x: NODE.resistorRightX, y },
    { x: NODE.rightBusX, y },
  ]);

  return (
    <g>
      {Array.from({ length: branchParticleCount }).map((_, index) => (
        <circle
          key={`branch-current-${branchId}-${index}`}
          r="3.3"
          fill={STYLE.current}
          stroke="#dbeafe"
          strokeWidth="1.2"
        >
          <animateMotion
            dur={`${branchSpeed}s`}
            repeatCount="indefinite"
            path={branchCurrentPath}
            begin={`${index * (branchSpeed / branchParticleCount)}s`}
          />
        </circle>
      ))}
    </g>
  );
}

function MainParticles({
  particles,
  currentSpeed,
  particleCount,
  path,
}: {
  particles: number[];
  currentSpeed: number;
  particleCount: number;
  path: string;
}) {
  return (
    <g>
      {particles.map((index) => (
        <circle
          key={`main-current-${index}`}
          r="3.2"
          fill={STYLE.mainCurrent}
          stroke="#ede9fe"
          strokeWidth="1.2"
        >
          <animateMotion
            dur={`${currentSpeed}s`}
            repeatCount="indefinite"
            path={path}
            begin={`${index * (currentSpeed / particleCount)}s`}
          />
        </circle>
      ))}
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
        1 / Req = 1 / R1 + 1 / R2 + ...
      </text>

      <line
        x1="295"
        y1="337"
        x2="545"
        y2="337"
        stroke="#a855f7"
        strokeWidth="2"
        opacity="0.45"
      />
    </g>
  );
}

function EquivalentResistanceBar({
  eqResistance,
  totalCurrent,
}: {
  eqResistance: number;
  totalCurrent: number;
}) {
  return (
    <g
      transform={`translate(${COMPONENT.resistanceBar.x} ${COMPONENT.resistanceBar.y})`}
    >
      <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
        Equivalent Resistance
      </text>

      <rect
        x="0"
        y="8"
        width={COMPONENT.resistanceBar.width}
        height={COMPONENT.resistanceBar.height}
        rx="7"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="8"
        height={COMPONENT.resistanceBar.height}
        rx="7"
        fill={STYLE.parallel}
        animate={{
          width:
            COMPONENT.resistanceBar.width *
            clamp(eqResistance / 10000, 0.04, 1),
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      <text
        x={COMPONENT.resistanceBar.width}
        y="46"
        textAnchor="end"
        fill="#475569"
        fontSize="12"
        fontWeight="700"
      >
        Req = {formatResistance(eqResistance)} · Itotal ={" "}
        {formatCurrent(totalCurrent)}
      </text>
    </g>
  );
}

export function ParallelCircuitVisual({
  supplyVoltage,
  branches,
}: ParallelCircuitVisualProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeVoltage = Number.isFinite(supplyVoltage) ? supplyVoltage : 0;
  const safeBranches =
    branches.length > 0 ? branches : [{ id: "fallback-b1", value: 1000 }];

  const normalizedBranches = safeBranches.map((branch, index) => ({
    ...branch,
    id: branch.id || `branch-${index + 1}`,
    value: Math.max(
      Number.isFinite(branch.value) ? branch.value : 0,
      MIN_RESISTANCE,
    ),
  }));

  const eqResistance = Math.max(
    equivalentParallel(normalizedBranches),
    MIN_RESISTANCE,
  );

  const branchCurrents = normalizedBranches.map(
    (branch) => safeVoltage / branch.value,
  );

  const totalCurrent = branchCurrents.reduce((sum, value) => sum + value, 0);
  const flowLevel = clamp(totalCurrent / MAX_CURRENT_FOR_FLOW, 0.04, 1);

  const mainWireWidth = WIRE.width + flowLevel * 4;
  const particleCount = clamp(Math.round(flowLevel * 24), 4, 28);
  const currentSpeed = clamp(2.8 - flowLevel * 1.7, 0.65, 2.9);

  const branchGap = normalizedBranches.length <= 3 ? 78 : 62;
  const branchYs = normalizedBranches.map(
    (_, index) => NODE.firstBranchY + index * branchGap,
  );

  const topY = branchYs[0];
  const bottomBranchY = branchYs[branchYs.length - 1];

  const mainCurrentPath = pathD([
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: topY },
    { x: NODE.leftBusX, y: topY },
    { x: NODE.leftBusX, y: bottomBranchY },
    { x: NODE.rightBusX, y: topY },
    { x: NODE.rightBusX, y: NODE.returnY },
    { x: NODE.batteryNegative.x, y: NODE.returnY },
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
            Parallel Resistor Circuit Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            In a parallel circuit, voltage stays the same across every branch
            while current divides through separate paths.
          </p>
        </div>

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          PARALLEL CONNECTION
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[840px] sm:w-full"
          role="img"
          aria-label="Parallel resistor circuit visualizer"
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

          <rect x="8" y="10" width="824" height="425" rx="20" fill="#f8fafc" />

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="900"
            >
              Same voltage across each branch · Total current = I1 + I2 + I3 ...
            </text>

            <WirePath
              points={WIRE.leftBus(topY, bottomBranchY)}
              wireWidth={mainWireWidth}
            />

            <WirePath
              points={WIRE.rightBusReturn(topY)}
              wireWidth={mainWireWidth}
            />

            <BatteryBlock svgId={svgId} voltage={safeVoltage} />

            {normalizedBranches.map((branch, index) => {
              const y = branchYs[index];
              const branchCurrent = branchCurrents[index];
              const branchFlow = clamp(
                Math.abs(branchCurrent) /
                  Math.max(Math.abs(totalCurrent), 0.000001),
                0.12,
                1,
              );
              const branchWireWidth = 4 + branchFlow * 6;

              return (
                <g key={branch.id}>
                  <WirePath
                    points={WIRE.branchInput(y)}
                    wireWidth={branchWireWidth}
                  />
                  <WirePath
                    points={WIRE.branchOutput(y)}
                    wireWidth={branchWireWidth}
                  />

                  <BranchResistorBlock
                    svgId={svgId}
                    y={y}
                    index={index}
                    resistance={branch.value}
                    voltage={safeVoltage}
                    current={branchCurrent}
                  />

                  <BranchParticles
                    branchId={branch.id}
                    y={y}
                    branchCurrent={branchCurrent}
                    totalCurrent={totalCurrent}
                  />
                </g>
              );
            })}

            <MainParticles
              particles={particles}
              currentSpeed={currentSpeed}
              particleCount={particleCount}
              path={mainCurrentPath}
            />

            <text
              x={LABEL.split.x}
              y={LABEL.split.y}
              textAnchor="middle"
              fill={STYLE.voltage}
              fontSize="12"
              fontWeight="900"
            >
              Current splits into branches →
            </text>

            <text
              x={LABEL.rejoin.x}
              y={LABEL.rejoin.y}
              textAnchor="middle"
              fill={STYLE.branchCurrent}
              fontSize="12"
              fontWeight="900"
            >
              Branch currents rejoin
            </text>

            <FormulaPanel svgId={svgId} />

            <EquivalentResistanceBar
              eqResistance={eqResistance}
              totalCurrent={totalCurrent}
            />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Equivalent Resistance
          </p>
          <p className="mt-1 text-sm text-slate-700">
            1/Req ={" "}
            {normalizedBranches
              .map((_, index) => `1/R${index + 1}`)
              .join(" + ")}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Req = {formatResistance(eqResistance)}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Same Voltage
          </p>
          <p className="mt-1 text-sm text-slate-700">V1 = V2 = V3 = Vs</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Each branch = {formatNumber(safeVoltage, 1)}V
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Total Current
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Itotal ={" "}
            {branchCurrents.map((_, index) => `I${index + 1}`).join(" + ")}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Itotal = {formatCurrent(totalCurrent)}
          </p>
        </div>
      </div>
    </section>
  );
}
