"use client";

import { motion } from "framer-motion";

import FlowDots from "./FlowDots";
import {
  clamp,
  formatNumber,
  getTransistorLevel,
  MIN_BASE_BIAS_CURRENT,
} from "./logic";

type CircuitVisualProps = {
  baseVoltage: number;
  baseResistance: number;
  loadResistance: number;
  switchOn: boolean;
  gain: number;
};

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = {
  tank: 1,
  switch: 1,
  transistorValve: 1,
} as const;

const BASE_WIRE_WIDTH = 14;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

/* =========================================================
   VIEW BOX / SCALE
========================================================= */

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 480,
  height: 520,
};

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

const SVG_VIEW_BOX = `${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`;

/* =========================================================
   STYLE CONSTANTS
========================================================= */

const STYLE = {
  canvasBg: "#F8FAFC",
  pipeOuter: "#0F172A",
  pipeInner: "#E0F2FE",
  pipeIdleWater: "#BFDBFE",
  waterMain: "#0284C7",
  waterLight: "#67E8F9",
  waterNode: "#FDE68A",
  tankFill: "#BAE6FD",
  tankStroke: "#0F172A",
  valveIdle: "#64748B",
  valveActive: "#0284C7",
  label: "#0369A1",
  baseFlow: "#06B6D4",
} as const;

/* =========================================================
   BASE COMPONENTS
========================================================= */

const BASE_COMPONENT = {
  tank: { x: 8, y: 212, width: 60, height: 58, rotate: 0 },
  switch: { x: 226, y: 222, width: 58, height: 80, rotate: 0 },
  transistorValve: { x: 355, y: 285, width: 69, height: 113, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

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

const COMPONENT = {
  tank: scaleComponent(BASE_COMPONENT.tank, SCALE.component.tank),
  switch: scaleComponent(BASE_COMPONENT.switch, SCALE.component.switch),
  transistorValve: scaleComponent(
    BASE_COMPONENT.transistorValve,
    SCALE.component.transistorValve,
  ),
} as const;

/* =========================================================
   NODES
========================================================= */

const NODE = {
  tankOutlet: { x: 38, y: 226 },

  supplyTopLeft: { x: 38, y: 38 },
  supplyTopRight: { x: 420, y: 38 },

  collectorInput: { x: 420, y: 285 },
  transistorInsideTop: { x: 362, y: 322 },
  transistorInsideBottom: { x: 362, y: 352 },
  emitterOutput: { x: 420, y: 382 },

  returnBottomRight: { x: 420, y: 475 },
  returnBottomLeft: { x: 38, y: 475 },
  tankReturn: { x: 38, y: 260 },

  baseSupplyTap: { x: 226, y: 38 },
  switchTop: { x: 226, y: 222 },
  switchClosedBottom: { x: 226, y: 302 },
  baseDriveDown: { x: 226, y: 338 },
  transistorBase: { x: 355, y: 338 },
} as const;

/* =========================================================
   WIRES / PIPES
========================================================= */

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.wire,

  tankToCollector: [
    NODE.tankOutlet,
    NODE.supplyTopLeft,
    NODE.supplyTopRight,
    NODE.collectorInput,
  ],

  emitterToReturn: [
    NODE.emitterOutput,
    NODE.returnBottomRight,
    NODE.returnBottomLeft,
    NODE.tankReturn,
  ],

  baseSupplyPipe: [NODE.supplyTopLeft, NODE.baseSupplyTap, NODE.switchTop],

  baseToValvePipe: [
    NODE.switchClosedBottom,
    NODE.baseDriveDown,
    NODE.transistorBase,
  ],
} as const;

/* =========================================================
   ANIMATION PATHS
========================================================= */

const PATH = {
  baseSupplyFlow: "M38 38 H226 V222",
  baseDriveFlow: "M226 302 V338 H355",
  mainWaterFlow: "M38 226 V38 H420 V285 L362 322 V352 L420 382 V475 H38 V260",
} as const;

/* =========================================================
   LABELS
========================================================= */

const LABEL = {
  tank: { x: 38, y: 202 },
  base: { x: 333, y: 342 },
  collector: { x: 414, y: 307 },
  emitter: { x: 414, y: 368 },
} as const;

/* =========================================================
   HELPERS
========================================================= */

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX.width / 2;
  const centerY = VIEW_BOX.height / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function PipePath({
  points,
  active = false,
  stroke = STYLE.waterMain,
  width = WIRE.width,
}: {
  points: readonly Point[];
  active?: boolean;
  stroke?: string;
  width?: number;
}) {
  return (
    <g>
      <path
        d={pathD(points)}
        stroke={STYLE.pipeOuter}
        strokeWidth={width + 6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={pathD(points)}
        stroke={STYLE.pipeInner}
        strokeWidth={width}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <motion.path
        d={pathD(points)}
        stroke={active ? stroke : STYLE.pipeIdleWater}
        strokeWidth={width - 4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={active ? "18 14" : undefined}
        animate={active ? { strokeDashoffset: [0, -64] } : undefined}
        transition={
          active
            ? { duration: 1.1, ease: "linear", repeat: Infinity }
            : undefined
        }
      />
    </g>
  );
}

function MiniWaterTank({ active }: { active: boolean }) {
  const tankWaterX = COMPONENT.tank.x + 6;
  const tankWaterY = COMPONENT.tank.y + 20;
  const tankWaterWidth = COMPONENT.tank.width - 12;
  const tankWaterHeight = 30;

  const waveLeftX = tankWaterX;
  const waveMidLeftX = tankWaterX + 12;
  const waveCenterX = tankWaterX + 24;
  const waveRightX = tankWaterX + tankWaterWidth;
  const waveY = tankWaterY;

  return (
    <g>
      <text
        x={LABEL.tank.x}
        y={LABEL.tank.y}
        textAnchor="middle"
        fill={STYLE.label}
        fontSize="10"
        fontWeight="900"
      >
        WATER TANK
      </text>

      <rect
        x={COMPONENT.tank.x}
        y={COMPONENT.tank.y}
        width={COMPONENT.tank.width}
        height={COMPONENT.tank.height}
        rx="10"
        fill="#F8FAFC"
        stroke={STYLE.tankStroke}
        strokeWidth="4"
      />

      {active && (
        <>
          <motion.rect
            x={tankWaterX}
            y={tankWaterY - 225}
            width={tankWaterWidth}
            height={tankWaterHeight}
            rx={6}
            fill={STYLE.tankFill}
            animate={{
              y: [tankWaterY, tankWaterY - 4, tankWaterY],
              height: [tankWaterHeight, tankWaterHeight + 4, tankWaterHeight],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.path
            d={`M${waveLeftX} ${waveY} Q${waveMidLeftX} ${waveY - 6} ${waveCenterX} ${waveY} T${waveRightX} ${waveY}`}
            stroke={STYLE.waterLight}
            strokeWidth="3"
            fill="none"
            animate={{
              d: [
                `M${waveLeftX} ${waveY} Q${waveMidLeftX} ${waveY - 6} ${waveCenterX} ${waveY} T${waveRightX} ${waveY}`,
                `M${waveLeftX} ${waveY - 3} Q${waveMidLeftX} ${waveY + 3} ${waveCenterX} ${waveY - 3} T${waveRightX} ${waveY - 3}`,
                `M${waveLeftX} ${waveY} Q${waveMidLeftX} ${waveY - 6} ${waveCenterX} ${waveY} T${waveRightX} ${waveY}`,
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <circle cx="25" cy="250" r="2.5" fill="#FFFFFF" opacity="0.8" />
          <circle cx="43" cy="242" r="3" fill="#FFFFFF" opacity="0.75" />
          <circle cx="53" cy="256" r="2.5" fill="#FFFFFF" opacity="0.7" />
        </>
      )}
    </g>
  );
}

function BaseControlSwitch({ switchOn }: { switchOn: boolean }) {
  return (
    <motion.path
      d={switchOn ? "M226 222 L226 302" : "M226 222 L252 280"}
      animate={{ d: switchOn ? "M226 222 L226 302" : "M226 222 L252 280" }}
      stroke={switchOn ? STYLE.valveActive : STYLE.valveIdle}
      strokeWidth="7"
      strokeLinecap="round"
    />
  );
}

function TransistorValve({ active }: { active: boolean }) {
  return (
    <g>
      <line
        x1={NODE.transistorInsideTop.x}
        y1="302"
        x2={NODE.transistorInsideTop.x}
        y2="375"
        stroke={STYLE.valveIdle}
        strokeWidth="5"
        strokeLinecap="square"
      />

      <text
        x={LABEL.base.x - 10}
        y={LABEL.base.y - 20}
        fill={STYLE.label}
        fontSize="12"
        fontWeight="900"
      >
        BASE
      </text>

      <text
        x={LABEL.collector.x}
        y={LABEL.collector.y}
        fill={STYLE.label}
        fontSize="11"
        fontWeight="900"
      >
        COLLECTOR
      </text>

      <text
        x={LABEL.emitter.x}
        y={LABEL.emitter.y}
        fill={STYLE.label}
        fontSize="11"
        fontWeight="900"
      >
        EMITTER
      </text>

      <line
        x1={NODE.transistorBase.x}
        y1={NODE.transistorBase.y}
        x2={NODE.transistorInsideTop.x}
        y2={NODE.transistorBase.y}
        stroke={active ? STYLE.baseFlow : STYLE.valveIdle}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M420 285 L362 322 V352 L420 382"
        stroke={active ? STYLE.waterMain : STYLE.valveIdle}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <polygon
        points="420,359 424,384 399,391"
        fill={active ? STYLE.waterLight : STYLE.valveIdle}
      />
    </g>
  );
}

function WaterNode({
  cx,
  cy,
  active,
}: {
  cx: number;
  cy: number;
  active: boolean;
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="5"
      fill={active ? STYLE.waterNode : "#CBD5E1"}
      stroke="#FFFFFF"
      strokeWidth="2"
      animate={
        active ? { scale: [1, 1.22, 1], opacity: [0.85, 1, 0.85] } : undefined
      }
      transition={
        active
          ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    />
  );
}

function MainPipeNetwork({ active }: { active: boolean }) {
  return (
    <g>
      <PipePath
        points={WIRE.tankToCollector}
        active={active}
        stroke={STYLE.waterMain}
      />

      <PipePath
        points={WIRE.emitterToReturn}
        active={active}
        stroke={STYLE.waterLight}
      />

      <PipePath
        points={WIRE.baseSupplyPipe}
        active={active}
        stroke={STYLE.baseFlow}
        width={10}
      />

      <WaterNode
        cx={NODE.tankOutlet.x}
        cy={NODE.tankOutlet.y}
        active={active}
      />
      <WaterNode
        cx={NODE.supplyTopLeft.x}
        cy={NODE.supplyTopLeft.y}
        active={active}
      />
      <WaterNode
        cx={NODE.baseSupplyTap.x}
        cy={NODE.baseSupplyTap.y}
        active={active}
      />
      <WaterNode
        cx={NODE.collectorInput.x}
        cy={NODE.collectorInput.y}
        active={active}
      />
      <WaterNode
        cx={NODE.emitterOutput.x}
        cy={NODE.emitterOutput.y}
        active={active}
      />
    </g>
  );
}

function FlowLayer({ active }: { active: boolean }) {
  return (
    <g>
      <FlowDots
        path={PATH.baseSupplyFlow}
        active={active}
        color={STYLE.baseFlow}
      />

      <FlowDots
        path={PATH.baseDriveFlow}
        active={active}
        color={STYLE.baseFlow}
        delayOffset={0.15}
      />

      <FlowDots
        path={PATH.mainWaterFlow}
        active={active}
        color={STYLE.waterMain}
        delayOffset={0.1}
      />
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CircuitVisual({
  baseVoltage,
  baseResistance,
  loadResistance,
  switchOn,
  gain,
}: CircuitVisualProps) {
  const rawBaseCurrent = switchOn ? baseVoltage / baseResistance : 0;
  const transistorBiased = rawBaseCurrent >= MIN_BASE_BIAS_CURRENT;
  const baseCurrent = transistorBiased ? rawBaseCurrent : 0;

  const collectorCurrent = transistorBiased
    ? clamp(baseCurrent * gain, 0, baseVoltage / loadResistance)
    : 0;

  const waterFlow = clamp(
    collectorCurrent / Math.max(baseVoltage / loadResistance, 0.00001),
    0,
    1,
  );

  const isSaturated = waterFlow > 0.86;

  const transistorLevel = getTransistorLevel({
    switchOn,
    transistorBiased,
    lampGlow: waterFlow,
  });

  const canvasTransform = buildCanvasScaleTransform(SCALE.canvas);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:rounded-3xl sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
            Water Flow Transistor Analogy
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">
            Water tank → collector → transistor valve → emitter → return pipe.
          </p>
        </div>

        <span
          className={`inline-flex flex-wrap items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold sm:px-3 sm:text-xs ${
            transistorBiased
              ? "bg-sky-100 text-sky-700"
              : switchOn
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {transistorBiased
            ? isSaturated
              ? "FULL WATER FLOW"
              : "WATER FLOWING"
            : switchOn
              ? "LOW BASE PRESSURE"
              : "FLOW OFF"}

          <span className="rounded-full bg-black/10 px-2 py-0.5 text-[9px] font-black tracking-wide sm:text-[10px]">
            LEVEL: {transistorLevel}
          </span>
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:p-3">
        <svg
          viewBox={SVG_VIEW_BOX}
          className="mx-auto h-auto w-full max-w-[480px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            width={VIEW_BOX.width}
            height={VIEW_BOX.height}
            rx="18"
            fill={STYLE.canvasBg}
          />

          <g transform={canvasTransform}>
            <MainPipeNetwork active={transistorBiased} />

            <MiniWaterTank active={transistorBiased} />

            <BaseControlSwitch switchOn={switchOn} />

            <PipePath
              points={WIRE.baseToValvePipe}
              active={transistorBiased}
              stroke={STYLE.baseFlow}
              width={10}
            />

            <TransistorValve active={transistorBiased} />

            <FlowLayer active={transistorBiased} />
          </g>
        </svg>
      </div>

      <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Base Pressure
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Minimum pressure/current:{" "}
            {formatNumber(MIN_BASE_BIAS_CURRENT * 1000, 2)} mA.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(rawBaseCurrent * 1000, 2)} mA
          </p>
        </div>

        <div className="rounded-2xl bg-sky-50 p-3 ring-1 ring-sky-100 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Main Water Flow
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Water enters through the collector, passes through the transistor
            valve, and exits through the emitter.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(waterFlow * 100, 0)}% Flow
          </p>
        </div>
      </div>
    </div>
  );
}
