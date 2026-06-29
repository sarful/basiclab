"use client";

import { motion } from "framer-motion";

import { FlowDots } from "./FlowDots";
import { FuseSymbol } from "./FuseSymbol";
import { clamp, formatNumber } from "./logic";
import type { FuseRating, FuseState, SimulationResult } from "./types";

type FuseCircuitSvgProps = {
  supplyVoltage: number;
  loadResistance: number;
  fuseRating: FuseRating;
  fuseState: FuseState;
  result: SimulationResult;
};

const VIEW_BOX = "0 0 1100 560";
const VIEW_BOX_WIDTH = 1100;
const VIEW_BOX_HEIGHT = 560;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  fuse: 1,
  load: 1,
  statusPanel: 1,
} as const;

const BASE_WIRE_WIDTH = 6;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  wire: "#111827",
  active: "#2563eb",
  safeBg: "#dcfce7",
  safeStroke: "#16a34a",
  safeText: "#166534",
  dangerBg: "#fef3c7",
  dangerStroke: "#f59e0b",
  dangerText: "#92400e",
  blownBg: "#fee2e2",
  blownStroke: "#dc2626",
  blownText: "#991b1b",
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
  battery: {
    x: 78,
    y: 185,
    width: 64,
    height: 285,
    rotate: 0,
  },

  fuse: {
    x: 430,
    y: 150,
    width: 220,
    height: 80,
    rotate: 0,
  },

  load: {
    x: 760,
    y: 145,
    width: 210,
    height: 90,
    rotate: 0,
  },

  statusPanel: {
    x: 330,
    y: 460,
    width: 440,
    height: 72,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  battery: scaleComponent(
    BASE_COMPONENT.battery,
    CIRCUIT_COMPONENT_SCALE.battery,
  ),
  fuse: scaleComponent(BASE_COMPONENT.fuse, CIRCUIT_COMPONENT_SCALE.fuse),
  load: scaleComponent(BASE_COMPONENT.load, CIRCUIT_COMPONENT_SCALE.load),
  statusPanel: scaleComponent(
    BASE_COMPONENT.statusPanel,
    CIRCUIT_COMPONENT_SCALE.statusPanel,
  ),
} as const;

const NODE = {
  batteryPositive: { x: 110, y: 260 },
  batteryNegative: { x: 110, y: 310 },
  batteryTopBus: { x: 110, y: 190 },
  batteryBottomBus: { x: 110, y: 470 },

  fuseInput: { x: 430, y: 190 },
  fuseOutput: { x: 650, y: 190 },

  loadInput: { x: 760, y: 190 },
  loadOutput: { x: 970, y: 190 },

  rightDropTop: { x: 1010, y: 190 },
  rightDropBottom: { x: 1010, y: 470 },

  statusCenter: pointOnComponent(COMPONENT.statusPanel, 0.5, 0.62),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  batteryVertical: [NODE.batteryTopBus, NODE.batteryBottomBus],
  batteryTopToFuse: [NODE.batteryTopBus, NODE.fuseInput],
  fuseToLoad: [NODE.fuseOutput, NODE.loadInput],
  loadToRightReturn: [NODE.loadOutput, NODE.rightDropTop],
  rightReturn: [NODE.rightDropTop, NODE.rightDropBottom],
  bottomReturn: [NODE.rightDropBottom, NODE.batteryBottomBus],
} as const;

const PATH = {
  flow: "M110 260 V190 H430 M650 190 H760 M970 190 H1010 V470 H110 V310",
} as const;

const LABEL = {
  title: { x: 550, y: 48 },
  voltage: { x: 62, y: 165 },
  plus: { x: 42, y: 252 },
  minus: { x: 48, y: 340 },
  load: { x: 825, y: 125 },
  warning: { x: 540, y: 292 },
  fuseRating: { x: 430, y: 360 },
  current: { x: 430, y: 395 },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      fill="none"
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function BatteryBlock({ supplyVoltage }: { supplyVoltage: number }) {
  return (
    <g>
      <WirePath points={WIRE.batteryVertical} />

      <line
        x1="78"
        y1="260"
        x2="142"
        y2="260"
        stroke={STYLE.wire}
        strokeWidth="9"
      />

      <line
        x1="88"
        y1="310"
        x2="132"
        y2="310"
        stroke={STYLE.wire}
        strokeWidth="6"
      />

      <text
        x={LABEL.plus.x}
        y={LABEL.plus.y}
        fontSize="44"
        fontWeight="900"
        fontFamily="Arial"
      >
        +
      </text>

      <text
        x={LABEL.minus.x}
        y={LABEL.minus.y}
        fontSize="44"
        fontWeight="900"
        fontFamily="Arial"
      >
        -
      </text>

      <text
        x={LABEL.voltage.x}
        y={LABEL.voltage.y}
        fontSize="30"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.active}
      >
        {formatNumber(supplyVoltage, 1)}V
      </text>
    </g>
  );
}

function LoadResistor({ loadResistance }: { loadResistance: number }) {
  return (
    <g>
      <polyline
        points="760,190 790,145 820,235 850,145 880,235 910,145 940,235 970,190"
        fill="none"
        stroke={STYLE.wire}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x={LABEL.load.x}
        y={LABEL.load.y}
        fontSize="28"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.text}
      >
        LOAD {loadResistance}Ohm
      </text>
    </g>
  );
}

function DangerIndicator({ danger }: { danger: boolean }) {
  if (!danger) return null;

  return (
    <motion.g
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 0.7, repeat: Infinity }}
    >
      <circle cx="540" cy="190" r="70" fill={STYLE.blownBg} />

      <text
        x={LABEL.warning.x}
        y={LABEL.warning.y}
        textAnchor="middle"
        fontSize="24"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.blownStroke}
      >
        OVERCURRENT
      </text>
    </motion.g>
  );
}

function BlownLabel({ fuseState }: { fuseState: FuseState }) {
  if (fuseState !== "BLOWN") return null;

  return (
    <text
      x={LABEL.warning.x}
      y={LABEL.warning.y}
      textAnchor="middle"
      fontSize="28"
      fontWeight="900"
      fontFamily="Arial"
      fill={STYLE.blownStroke}
    >
      FUSE BLOWN
    </text>
  );
}

function StatusPanel({
  fuseState,
  danger,
}: {
  fuseState: FuseState;
  danger: boolean;
}) {
  const isBlown = fuseState === "BLOWN";

  const fill = isBlown ? STYLE.blownBg : danger ? STYLE.dangerBg : STYLE.safeBg;

  const stroke = isBlown
    ? STYLE.blownStroke
    : danger
      ? STYLE.dangerStroke
      : STYLE.safeStroke;

  const textFill = isBlown
    ? STYLE.blownText
    : danger
      ? STYLE.dangerText
      : STYLE.safeText;

  const label = isBlown
    ? "CIRCUIT OPEN"
    : danger
      ? "UNSAFE CURRENT"
      : "SAFE CURRENT";

  return (
    <g>
      <rect
        x={COMPONENT.statusPanel.x}
        y={COMPONENT.statusPanel.y}
        width={COMPONENT.statusPanel.width}
        height={COMPONENT.statusPanel.height}
        rx="22"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />

      <text
        x={NODE.statusCenter.x}
        y={NODE.statusCenter.y}
        textAnchor="middle"
        fontSize="28"
        fontWeight="900"
        fontFamily="Arial"
        fill={textFill}
      >
        {label}
      </text>
    </g>
  );
}

function MeasurementLabels({
  fuseRating,
  currentA,
}: {
  fuseRating: FuseRating;
  currentA: number;
}) {
  return (
    <g>
      <text
        x={LABEL.fuseRating.x}
        y={LABEL.fuseRating.y}
        fontSize="24"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.text}
      >
        Fuse Rating: {fuseRating}
      </text>

      <text
        x={LABEL.current.x}
        y={LABEL.current.y}
        fontSize="24"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.text}
      >
        Current: {formatNumber(currentA, 2)} A
      </text>
    </g>
  );
}

export function FuseCircuitSvg({
  supplyVoltage,
  loadResistance,
  fuseRating,
  fuseState,
  result,
}: FuseCircuitSvgProps) {
  const active = fuseState === "GOOD" && result.currentA > 0.02;
  const danger = fuseState === "GOOD" && result.shouldBlow;

  const flowDuration = clamp(3.2 - result.currentA * 0.32, 0.6, 3.2);
  const flowCount = Math.round(clamp(8 + result.currentA * 3, 8, 34));

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-auto w-full bg-white"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="Fuse overvoltage and overcurrent protection circuit"
    >
      <rect width="1100" height="560" fill="#ffffff" />

      <g transform={canvasTransform}>
        <text
          x={LABEL.title.x}
          y={LABEL.title.y}
          textAnchor="middle"
          fontSize="34"
          fontWeight="900"
          fontFamily="Arial"
          fill={STYLE.text}
        >
          Fuse Protection Circuit - Overvoltage / Overcurrent
        </text>

        <BatteryBlock supplyVoltage={supplyVoltage} />

        <WirePath points={WIRE.batteryTopToFuse} />

        <FuseSymbol fuseState={fuseState} danger={danger} />

        <WirePath points={WIRE.fuseToLoad} />

        <LoadResistor loadResistance={loadResistance} />

        <WirePath points={WIRE.loadToRightReturn} />
        <WirePath points={WIRE.rightReturn} />
        <WirePath points={WIRE.bottomReturn} />

        <DangerIndicator danger={danger} />
        <BlownLabel fuseState={fuseState} />

        <FlowDots
          path={PATH.flow}
          active={active}
          color={STYLE.active}
          count={flowCount}
          duration={flowDuration}
        />

        <StatusPanel fuseState={fuseState} danger={danger} />

        <MeasurementLabels fuseRating={fuseRating} currentA={result.currentA} />
      </g>
    </svg>
  );
}
