"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import { clamp, formatNumber, getStatus, recommendedPackage } from "./logic";
import type { ResistorPackage } from "./types";

type PowerVisualProps = {
  voltage: number;
  resistance: number;
  rating: number;
  selectedPackage: ResistorPackage;
};

const VIEW_BOX = "0 0 780 390";
const VIEW_BOX_WIDTH = 780;
const VIEW_BOX_HEIGHT = 390;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  formulaPanel: 1,
  powerBar: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const MIN_RESISTANCE = 0.001;
const MIN_RATING = 0.001;
const MAX_CURRENT_FOR_FLOW = 0.15;

const STYLE = {
  text: "#0f172a",
  muted: "#475569",
  wire: "#53657d",
  positive: "#ef4444",
  negative: "#2563eb",
  current: "#2563eb",
  currentStroke: "#dbeafe",
  heat: "#fb923c",
  safe: "#22c55e",
  warning: "#f97316",
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

const BASE_COMPONENT = {
  battery: { x: 58, y: 178, width: 88, height: 96, rotate: 0 },
  resistor: { x: 245, y: 108, width: 290, height: 68, rotate: 0 },
  formulaPanel: { x: 268, y: 212, width: 244, height: 36, rotate: 0 },
  powerBar: { x: 160, y: 336, width: 480, height: 13, rotate: 0 },
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
  powerBar: scaleComponent(
    BASE_COMPONENT.powerBar,
    CIRCUIT_COMPONENT_SCALE.powerBar,
  ),
} as const;

const NODE = {
  batteryPositive: pointOnComponent(COMPONENT.battery, 0.5, 0),
  batteryNegative: pointOnComponent(COMPONENT.battery, 0.5, 1),

  rightDrop: { x: 650, y: 304 },
  bottomMid: { x: 390, y: 304 },

  resistorCenter: pointOnComponent(COMPONENT.resistor, 0.5, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  leftPath: (bodyX: number, bodyCenterY: number): Point[] => [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: bodyCenterY },
    { x: bodyX, y: bodyCenterY },
  ],

  rightPath: (bodyRight: number, bodyCenterY: number): Point[] => [
    { x: bodyRight, y: bodyCenterY },
    { x: NODE.rightDrop.x, y: bodyCenterY },
    NODE.rightDrop,
    { x: NODE.batteryNegative.x, y: NODE.rightDrop.y },
    NODE.batteryNegative,
  ],

  currentPath: (
    bodyX: number,
    bodyRight: number,
    bodyCenterY: number,
  ): Point[] => [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: bodyCenterY },
    { x: bodyX, y: bodyCenterY },
    { x: bodyRight, y: bodyCenterY },
    { x: NODE.rightDrop.x, y: bodyCenterY },
    NODE.rightDrop,
    { x: NODE.batteryNegative.x, y: NODE.rightDrop.y },
    NODE.batteryNegative,
  ],
} as const;

const LABEL = {
  heatOutput: { x: 595, y: 92 },
  formula: { x: 390, y: 236 },
  batteryPlus: {
    x: NODE.batteryPositive.x + 34,
    y: NODE.batteryPositive.y - 8,
  },
  batteryMinus: {
    x: NODE.batteryNegative.x + 34,
    y: NODE.batteryNegative.y + 8,
  },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
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
        {formatNumber(voltage, 0)}V
      </text>

      <circle
        cx={NODE.batteryPositive.x}
        cy={NODE.batteryPositive.y}
        r="5.5"
        fill={STYLE.positive}
        stroke="#ffffff"
        strokeWidth="2"
      />

      <circle
        cx={NODE.batteryNegative.x}
        cy={NODE.batteryNegative.y}
        r="5.5"
        fill={STYLE.negative}
        stroke="#ffffff"
        strokeWidth="2"
      />

      <text
        x={LABEL.batteryPlus.x}
        y={LABEL.batteryPlus.y}
        fill="#f97316"
        fontSize="16"
        fontWeight="900"
      >
        +
      </text>

      <text
        x={LABEL.batteryMinus.x}
        y={LABEL.batteryMinus.y}
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
  bodyX,
  bodyY,
  bodyWidth,
  bodyHeight,
  bodyCenterY,
  bodyRight,
  selectedPackage,
  isOverload,
}: {
  svgId: string;
  bodyX: number;
  bodyY: number;
  bodyWidth: number;
  bodyHeight: number;
  bodyCenterY: number;
  bodyRight: number;
  selectedPackage: ResistorPackage;
  isOverload: boolean;
}) {
  return (
    <g>
      <line
        x1={bodyX - 22}
        y1={bodyCenterY}
        x2={bodyX}
        y2={bodyCenterY}
        stroke={`url(#${svgId}-terminal)`}
        strokeWidth="10"
      />

      <line
        x1={bodyRight}
        y1={bodyCenterY}
        x2={bodyRight + 22}
        y2={bodyCenterY}
        stroke={`url(#${svgId}-terminal)`}
        strokeWidth="10"
      />

      <motion.g
        filter={`url(#${svgId}-shadow)`}
        animate={{ x: isOverload ? [0, 2, -2, 0] : 0 }}
        transition={{ repeat: Infinity, duration: 0.18 }}
      >
        <rect
          x={bodyX}
          y={bodyY}
          width={bodyWidth}
          height={bodyHeight}
          rx={bodyHeight / 2}
          fill={`url(#${svgId}-body)`}
          stroke="#111827"
          strokeWidth="4"
          filter={`url(#${svgId}-heatGlow)`}
        />

        <rect
          x={bodyX + 42}
          y={bodyY}
          width="16"
          height={bodyHeight}
          fill="#ef4444"
        />
        <rect
          x={bodyX + 104}
          y={bodyY}
          width="17"
          height={bodyHeight}
          fill="#111827"
        />
        <rect
          x={bodyX + 168}
          y={bodyY}
          width="16"
          height={bodyHeight}
          fill="#f59e0b"
        />
        <rect
          x={bodyX + 210}
          y={bodyY}
          width="16"
          height={bodyHeight}
          fill="#d4af37"
          opacity="0.9"
        />

        <text
          x="390"
          y={bodyY + 41}
          textAnchor="middle"
          fill="#78350f"
          fontSize="13"
          fontWeight="900"
        >
          {selectedPackage.label} Resistor
        </text>
      </motion.g>
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
        P = V × I = I²R = V²/R
      </text>

      <line
        x1="282"
        y1="244"
        x2="498"
        y2="244"
        stroke={STYLE.heat}
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
        <motion.circle
          key={`current-dot-${index}`}
          r="3.4"
          fill={STYLE.current}
          stroke={STYLE.currentStroke}
          strokeWidth="1.2"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: currentSpeed,
            repeat: Infinity,
            ease: "linear",
            delay: index * (currentSpeed / particleCount),
          }}
          style={{ offsetPath: `path('${currentPath}')` }}
        />
      ))}
    </g>
  );
}

function WarningPanel({
  isOverload,
  recommended,
}: {
  isOverload: boolean;
  recommended: ResistorPackage;
}) {
  return (
    <motion.g
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ repeat: Infinity, duration: 0.9 }}
    >
      <rect
        x="244"
        y="252"
        width="292"
        height="40"
        rx="12"
        fill={isOverload ? "#fee2e2" : "#ffedd5"}
        stroke={isOverload ? STYLE.danger : STYLE.warning}
        strokeWidth="2"
      />

      <text
        x="390"
        y="268"
        textAnchor="middle"
        fill={isOverload ? "#dc2626" : "#c2410c"}
        fontSize="12"
        fontWeight="900"
      >
        {isOverload ? "Power rating exceeded" : "Near power limit"}
      </text>

      <text
        x="390"
        y="285"
        textAnchor="middle"
        fill="#7f1d1d"
        fontSize="11"
        fontWeight="700"
      >
        Recommended: {recommended.label} or higher
      </text>
    </motion.g>
  );
}

function PowerBar({
  loadRatio,
  heatLevel,
  isOverload,
}: {
  loadRatio: number;
  heatLevel: number;
  isOverload: boolean;
}) {
  return (
    <g transform={`translate(${COMPONENT.powerBar.x} ${COMPONENT.powerBar.y})`}>
      <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
        Power Load
      </text>

      <rect
        x="0"
        y="8"
        width={COMPONENT.powerBar.width}
        height={COMPONENT.powerBar.height}
        rx="7"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="8"
        height={COMPONENT.powerBar.height}
        rx="7"
        fill={
          isOverload
            ? STYLE.danger
            : heatLevel > 0.75
              ? STYLE.warning
              : STYLE.safe
        }
        animate={{ width: COMPONENT.powerBar.width * clamp(loadRatio, 0, 1) }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      <text
        x={COMPONENT.powerBar.width}
        y="46"
        textAnchor="end"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="700"
      >
        {formatNumber(loadRatio * 100, 1)}% of rating
      </text>
    </g>
  );
}

export function PowerVisual({
  voltage,
  resistance,
  rating,
  selectedPackage,
}: PowerVisualProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeVoltage = Number.isFinite(voltage) ? voltage : 0;
  const safeResistance = Math.max(
    Number.isFinite(resistance) ? resistance : 0,
    MIN_RESISTANCE,
  );
  const safeRating = Math.max(Number.isFinite(rating) ? rating : 0, MIN_RATING);

  const current = safeVoltage / safeResistance;
  const power = (safeVoltage * safeVoltage) / safeResistance;
  const loadRatio = power / safeRating;

  const heatLevel = clamp(loadRatio, 0, 1);
  const flowLevel = clamp(current / MAX_CURRENT_FOR_FLOW, 0.06, 1);

  const particleCount = clamp(Math.round(flowLevel * 16), 4, 20);
  const currentSpeed = clamp(2.6 - flowLevel * 1.55, 0.7, 2.8);

  const status = getStatus(power, safeRating);
  const recommended = recommendedPackage(power);

  const isOverload = loadRatio >= 1;
  const isWarning = loadRatio >= 0.8 && loadRatio < 1;

  const bodyWidth = clamp(selectedPackage.bodyWidth, 255, 290);
  const bodyHeight = clamp(selectedPackage.bodyHeight, 58, 68);
  const bodyX = NODE.resistorCenter.x - bodyWidth / 2;
  const bodyY = COMPONENT.resistor.y;
  const bodyRight = bodyX + bodyWidth;
  const bodyCenterY = bodyY + bodyHeight / 2;

  const currentPath = pathD(WIRE.currentPath(bodyX, bodyRight, bodyCenterY));

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
            Power Rating Heat Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Conventional current flows from the positive terminal through the
            resistor and returns to the negative terminal.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${status.bg} ${status.tone}`}
        >
          {status.label}
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[780px] sm:w-full"
          role="img"
          aria-label="Power rating heat visualizer circuit"
        >
          <defs>
            <linearGradient id={`${svgId}-body`} x1="0" x2="1">
              <stop offset="0%" stopColor="#f8d890" />
              <stop
                offset="55%"
                stopColor={heatLevel > 0.6 ? "#fb923c" : "#e8b95d"}
              />
              <stop
                offset="100%"
                stopColor={heatLevel > 0.9 ? STYLE.danger : "#dca843"}
              />
            </linearGradient>

            <linearGradient id={`${svgId}-terminal`} x1="0" x2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#020617" />
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
                floodOpacity="0.24"
              />
            </filter>

            <filter
              id={`${svgId}-heatGlow`}
              x="-50%"
              y="-65%"
              width="200%"
              height="230%"
            >
              <feGaussianBlur stdDeviation={2 + heatLevel * 12} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="8" y="10" width="764" height="365" rx="20" fill="#f8fafc" />

          <g transform={canvasTransform}>
            <WirePath points={WIRE.leftPath(bodyX, bodyCenterY)} />
            <WirePath points={WIRE.rightPath(bodyRight, bodyCenterY)} />

            <BatteryBlock svgId={svgId} voltage={safeVoltage} />

            <circle
              cx={NODE.bottomMid.x}
              cy={NODE.bottomMid.y}
              r="4"
              fill={STYLE.negative}
              stroke="#dbeafe"
            />
            <circle
              cx={NODE.rightDrop.x}
              cy={NODE.rightDrop.y}
              r="3.5"
              fill="#38bdf8"
            />

            <ResistorBlock
              svgId={svgId}
              bodyX={bodyX}
              bodyY={bodyY}
              bodyWidth={bodyWidth}
              bodyHeight={bodyHeight}
              bodyCenterY={bodyCenterY}
              bodyRight={bodyRight}
              selectedPackage={selectedPackage}
              isOverload={isOverload}
            />

            <text
              x={LABEL.heatOutput.x}
              y={LABEL.heatOutput.y}
              textAnchor="middle"
              fill="#16a34a"
              fontSize="15"
              fontWeight="900"
            >
              Heat output
            </text>

            <FormulaPanel svgId={svgId} />

            <CurrentParticles
              particles={particles}
              currentSpeed={currentSpeed}
              particleCount={particleCount}
              currentPath={currentPath}
            />

            {(isWarning || isOverload) && (
              <WarningPanel isOverload={isOverload} recommended={recommended} />
            )}

            <PowerBar
              loadRatio={loadRatio}
              heatLevel={heatLevel}
              isOverload={isOverload}
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
