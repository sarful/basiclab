"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import { clamp, computeStructureSnapshot, dielectricOptions } from "./logic";

type CapacitorStructureVisualProps = {
  plateArea: number;
  plateDistance: number;
  dielectricIndex: number;
  showField: boolean;
};

const VIEW_BOX = "0 0 840 455";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 455;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  capacitor: 1,
  formulaPanel: 1,
  effectBar: 1,
  energyBar: 1,
} as const;

const BASE_WIRE_WIDTH = 6;
const CIRCUIT_WIRE_SCALE = 1;

const MIN_DISTANCE = 0.001;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  panel: "#f8fafc",
  wire: "#53657d",
  negativePlate: "#2563eb",
  positivePlate: "#ef4444",
  electron: "#0ea5e9",
  field: "#8b5cf6",
  energy: "#22c55e",
  batteryBody: "#0f172a",
  batteryStroke: "#94a3b8",
  dielectricStroke: "#334155",
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
    x: 58,
    y: 178,
    width: 88,
    height: 96,
    rotate: 0,
  },

  capacitor: {
    x: 410,
    y: 75,
    width: 120,
    height: 210,
    rotate: 0,
  },

  formulaPanel: {
    x: 284,
    y: 272,
    width: 272,
    height: 38,
    rotate: 0,
  },

  effectBar: {
    x: 160,
    y: 370,
    width: 500,
    height: 13,
    rotate: 0,
  },

  energyBar: {
    x: 160,
    y: 410,
    width: 500,
    height: 10,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  battery: scaleComponent(
    BASE_COMPONENT.battery,
    CIRCUIT_COMPONENT_SCALE.battery,
  ),
  capacitor: scaleComponent(
    BASE_COMPONENT.capacitor,
    CIRCUIT_COMPONENT_SCALE.capacitor,
  ),
  formulaPanel: scaleComponent(
    BASE_COMPONENT.formulaPanel,
    CIRCUIT_COMPONENT_SCALE.formulaPanel,
  ),
  effectBar: scaleComponent(
    BASE_COMPONENT.effectBar,
    CIRCUIT_COMPONENT_SCALE.effectBar,
  ),
  energyBar: scaleComponent(
    BASE_COMPONENT.energyBar,
    CIRCUIT_COMPONENT_SCALE.energyBar,
  ),
} as const;

const NODE = {
  batteryPositive: pointOnComponent(COMPONENT.battery, 0.5, 0),
  batteryNegative: pointOnComponent(COMPONENT.battery, 0.5, 1),

  center: pointOnComponent(COMPONENT.capacitor, 0.5, 0.405),

  bottomWire: { x: 0, y: 320 },
  rightDrop: { x: 700, y: 160 },

  formulaCenter: pointOnComponent(COMPONENT.formulaPanel, 0.5, 0.66),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  positivePath: (leftPlateX: number, circuitY: number): Point[] => [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: circuitY },
    { x: leftPlateX, y: circuitY },
  ],

  negativePath: (
    positivePlateLeadX: number,
    circuitY: number,
    bottomWireY: number,
  ): Point[] => [
    { x: positivePlateLeadX, y: circuitY },
    { x: NODE.rightDrop.x, y: circuitY },
    { x: NODE.rightDrop.x, y: bottomWireY },
    { x: NODE.batteryNegative.x, y: bottomWireY },
    NODE.batteryNegative,
  ],
} as const;

const LABEL = {
  title: { x: 420, y: 42 },
  chargeNotice: { x: 265, y: 92 },
  dielectricNotice: { x: 650, y: 92 },
  negativePlate: { xOffset: -36, yOffset: -12 },
  positivePlate: { xOffset: 58, yOffset: -12 },
  dielectric: { x: 470, yOffset: 32 },
  formula: { x: 420, y: 297 },
  summary: { x: 420, y: 330 },
} as const;

function BatteryBlock({ svgId }: { svgId: string }) {
  return (
    <g>
      <rect
        x={COMPONENT.battery.x}
        y={COMPONENT.battery.y}
        width={COMPONENT.battery.width}
        height={COMPONENT.battery.height}
        rx="16"
        fill={STYLE.batteryBody}
        stroke={STYLE.batteryStroke}
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
        Source
      </text>

      <circle
        cx={NODE.batteryPositive.x}
        cy={NODE.batteryPositive.y}
        r="5.5"
        fill={STYLE.positivePlate}
        stroke="#ffffff"
        strokeWidth="2"
      />

      <circle
        cx={NODE.batteryNegative.x}
        cy={NODE.batteryNegative.y}
        r="5.5"
        fill={STYLE.negativePlate}
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
        fill={STYLE.electron}
        fontSize="18"
        fontWeight="900"
      >
        −
      </text>
    </g>
  );
}

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

function CapacitorStructure({
  svgId,
  leftPlateX,
  rightPlateX,
  topY,
  plateHeight,
  plateWidth,
  dielectricColor,
}: {
  svgId: string;
  leftPlateX: number;
  rightPlateX: number;
  topY: number;
  plateHeight: number;
  plateWidth: number;
  dielectricColor: string;
}) {
  return (
    <g>
      <motion.rect
        x={leftPlateX}
        y={topY}
        width={plateWidth}
        height={plateHeight}
        rx="5"
        fill={STYLE.negativePlate}
        filter={`url(#${svgId}-plateGlow)`}
        animate={{ opacity: [0.76, 1, 0.76] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />

      <motion.rect
        x={rightPlateX}
        y={topY}
        width={plateWidth}
        height={plateHeight}
        rx="5"
        fill={STYLE.positivePlate}
        filter={`url(#${svgId}-plateGlow)`}
        animate={{ opacity: [0.76, 1, 0.76] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />

      <motion.rect
        x={leftPlateX + plateWidth + 4}
        y={topY + 4}
        width={Math.max(rightPlateX - leftPlateX - plateWidth - 8, 8)}
        height={plateHeight - 8}
        rx="12"
        fill={dielectricColor}
        stroke={STYLE.dielectricStroke}
        strokeDasharray="6 5"
        strokeWidth="2"
        animate={{ opacity: [0.7, 0.95, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      />
    </g>
  );
}

function StaticChargeDots({
  dots,
  leftPlateX,
  rightPlateX,
  topY,
  plateHeight,
  plateWidth,
}: {
  dots: number[];
  leftPlateX: number;
  rightPlateX: number;
  topY: number;
  plateHeight: number;
  plateWidth: number;
}) {
  return (
    <g>
      {dots.map((index) => {
        const y =
          topY +
          16 +
          index * ((plateHeight - 32) / Math.max(dots.length - 1, 1));

        return (
          <g key={`static-charge-${index}`}>
            <circle cx={leftPlateX - 10} cy={y} r="3" fill={STYLE.electron} />

            <text
              x={rightPlateX + plateWidth + 10}
              y={y + 4}
              textAnchor="middle"
              fill="#dc2626"
              fontSize="10"
              fontWeight="900"
            >
              +
            </text>
          </g>
        );
      })}
    </g>
  );
}

function FieldLines({
  show,
  count,
  leftPlateX,
  rightPlateX,
  topY,
  plateHeight,
  plateWidth,
}: {
  show: boolean;
  count: number;
  leftPlateX: number;
  rightPlateX: number;
  topY: number;
  plateHeight: number;
  plateWidth: number;
}) {
  if (!show) return null;

  return (
    <g>
      {Array.from({ length: count }).map((_, index) => {
        const y =
          topY + 18 + index * ((plateHeight - 36) / Math.max(count - 1, 1));

        return (
          <motion.g
            key={`field-${index}`}
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{
              repeat: Infinity,
              duration: 1.35,
              delay: index * 0.04,
            }}
          >
            <line
              x1={leftPlateX + plateWidth + 18}
              y1={y}
              x2={rightPlateX - 10}
              y2={y}
              stroke={STYLE.field}
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            <polygon
              points={`${rightPlateX - 10},${y} ${rightPlateX - 18},${
                y - 4
              } ${rightPlateX - 18},${y + 4}`}
              fill={STYLE.field}
            />
          </motion.g>
        );
      })}
    </g>
  );
}

function Dipoles({
  dipoles,
  leftPlateX,
  rightPlateX,
  centerY,
  plateWidth,
}: {
  dipoles: number[];
  leftPlateX: number;
  rightPlateX: number;
  centerY: number;
  plateWidth: number;
}) {
  return (
    <g>
      {dipoles.map((index) => {
        const x =
          leftPlateX +
          plateWidth +
          18 +
          index *
            ((rightPlateX - leftPlateX - plateWidth - 42) /
              Math.max(dipoles.length - 1, 1));

        const y = centerY + (index % 2 === 0 ? -22 : 22);

        return (
          <motion.g
            key={`dipole-${index}`}
            animate={{ rotate: [-4, 4, -4] }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              delay: index * 0.08,
            }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          >
            <circle
              cx={x - 7}
              cy={y}
              r="5"
              fill={STYLE.negativePlate}
              opacity="0.85"
            />
            <circle
              cx={x + 7}
              cy={y}
              r="5"
              fill={STYLE.positivePlate}
              opacity="0.85"
            />
            <line
              x1={x - 2}
              y1={y}
              x2={x + 2}
              y2={y}
              stroke={STYLE.muted}
              strokeWidth="1.5"
            />
          </motion.g>
        );
      })}
    </g>
  );
}

function MovingChargeFlow({
  movingDots,
  chargeDotCount,
  negativeChargePath,
  positiveChargePath,
}: {
  movingDots: number[];
  chargeDotCount: number;
  negativeChargePath: string;
  positiveChargePath: string;
}) {
  return (
    <g>
      {movingDots.map((index) => (
        <circle
          key={`negative-flow-${index}`}
          r="3.3"
          fill={STYLE.electron}
          stroke="#e0f2fe"
          strokeWidth="1.2"
        >
          <animateMotion
            dur="2.4s"
            repeatCount="indefinite"
            path={negativeChargePath}
            begin={`${index * (2.4 / chargeDotCount)}s`}
          />
        </circle>
      ))}

      {movingDots
        .slice(0, Math.max(3, Math.floor(movingDots.length / 2)))
        .map((index) => (
          <circle
            key={`positive-flow-${index}`}
            r="3.1"
            fill={STYLE.positivePlate}
            stroke="#fee2e2"
            strokeWidth="1.1"
          >
            <animateMotion
              dur="2.7s"
              repeatCount="indefinite"
              path={positiveChargePath}
              begin={`${index * (2.7 / Math.max(3, Math.floor(movingDots.length / 2)))}s`}
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
        E = ½ C V²
      </text>

      <line
        x1="310"
        y1="305"
        x2="530"
        y2="305"
        stroke={STYLE.field}
        strokeWidth="2"
        opacity="0.45"
      />
    </g>
  );
}

function LevelBars({
  relativeEffect,
  storedEnergyLevel,
}: {
  relativeEffect: number;
  storedEnergyLevel: number;
}) {
  return (
    <g>
      <g
        transform={`translate(${COMPONENT.effectBar.x} ${COMPONENT.effectBar.y})`}
      >
        <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
          Capacitance Effect
        </text>

        <rect
          x="0"
          y="8"
          width={COMPONENT.effectBar.width}
          height={COMPONENT.effectBar.height}
          rx="7"
          fill="#e2e8f0"
        />

        <motion.rect
          x="0"
          y="8"
          height={COMPONENT.effectBar.height}
          rx="7"
          fill={STYLE.field}
          animate={{ width: COMPONENT.effectBar.width * relativeEffect }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />

        <text
          x={COMPONENT.effectBar.width}
          y="46"
          textAnchor="end"
          fill="#475569"
          fontSize="12"
          fontWeight="700"
        >
          Area ↑ · k ↑ · distance ↓
        </text>
      </g>

      <g
        transform={`translate(${COMPONENT.energyBar.x} ${COMPONENT.energyBar.y})`}
      >
        <text x="0" y="-10" fill={STYLE.text} fontSize="13" fontWeight="900">
          Stored Energy Indicator
        </text>

        <rect
          x="0"
          y="6"
          width={COMPONENT.energyBar.width}
          height={COMPONENT.energyBar.height}
          rx="5"
          fill="#e2e8f0"
        />

        <motion.rect
          x="0"
          y="6"
          height={COMPONENT.energyBar.height}
          rx="5"
          fill={STYLE.energy}
          animate={{ width: COMPONENT.energyBar.width * storedEnergyLevel }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </g>
    </g>
  );
}

export function CapacitorStructureVisual({
  plateArea,
  plateDistance,
  dielectricIndex,
  showField,
}: CapacitorStructureVisualProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safePlateArea = Math.max(Number.isFinite(plateArea) ? plateArea : 0, 0);
  const safePlateDistance = Math.max(
    Number.isFinite(plateDistance) ? plateDistance : 0,
    MIN_DISTANCE,
  );

  const safeDielectricIndex = clamp(
    Math.round(Number.isFinite(dielectricIndex) ? dielectricIndex : 0),
    0,
    dielectricOptions.length - 1,
  );

  const dielectric = dielectricOptions[safeDielectricIndex];

  const { relativeEffect } = computeStructureSnapshot({
    plateArea: safePlateArea,
    plateDistance: safePlateDistance,
    dielectricK: dielectric.k,
  });

  const capacitanceEffect = clamp(
    (safePlateArea * dielectric.k) / safePlateDistance / 90,
    0.08,
    1,
  );

  const plateHeight = clamp(95 + safePlateArea * 2.2, 95, 210);
  const plateWidth = clamp(14 + safePlateArea * 0.08, 14, 24);
  const gap = clamp(42 + safePlateDistance * 5.5, 48, 150);

  const centerX = 470;
  const centerY = 160;

  const leftPlateX = centerX - gap / 2;
  const rightPlateX = centerX + gap / 2;

  const topY = centerY - plateHeight / 2;
  const bottomY = centerY + plateHeight / 2;

  const fieldLineCount = clamp(Math.round(plateHeight / 17), 5, 15);
  const chargeDotCount = clamp(Math.round(capacitanceEffect * 16), 5, 18);
  const dipoleCount = clamp(Math.round(gap / 18), 3, 8);

  const positivePlateLeadX = rightPlateX + plateWidth;
  const circuitY = centerY;
  const bottomWireY = 320;

  const negativeChargePath = pathD(
    WIRE.negativePath(positivePlateLeadX, circuitY, bottomWireY),
  );

  const positiveChargePath = pathD(WIRE.positivePath(leftPlateX, circuitY));

  const movingDots = useMemo(
    () => Array.from({ length: chargeDotCount }, (_, index) => index),
    [chargeDotCount],
  );

  const plateChargeDots = useMemo(
    () => Array.from({ length: chargeDotCount }, (_, index) => index),
    [chargeDotCount],
  );

  const dipoles = useMemo(
    () => Array.from({ length: dipoleCount }, (_, index) => index),
    [dipoleCount],
  );

  const storedEnergyLevel = clamp(relativeEffect * capacitanceEffect, 0.04, 1);
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Professional Capacitor Structure Simulator
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            See how plate area, plate distance, dielectric material, charge
            separation, electric field, and stored energy build capacitance.
          </p>
        </div>

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          EDUCATIONAL STRUCTURE VIEW
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[840px] sm:w-full"
          role="img"
          aria-label="Professional capacitor structure simulator"
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
              id={`${svgId}-plateGlow`}
              x="-50%"
              y="-60%"
              width="200%"
              height="230%"
            >
              <feGaussianBlur
                stdDeviation={3 + capacitanceEffect * 8}
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
              C ∝ A × k / d · Larger area ↑ Dielectric k ↑ Distance ↓
            </text>

            <WirePath points={WIRE.positivePath(leftPlateX, circuitY)} />
            <WirePath
              points={WIRE.negativePath(
                positivePlateLeadX,
                circuitY,
                bottomWireY,
              )}
            />

            <BatteryBlock svgId={svgId} />

            <CapacitorStructure
              svgId={svgId}
              leftPlateX={leftPlateX}
              rightPlateX={rightPlateX}
              topY={topY}
              plateHeight={plateHeight}
              plateWidth={plateWidth}
              dielectricColor={dielectric.color}
            />

            <StaticChargeDots
              dots={plateChargeDots}
              leftPlateX={leftPlateX}
              rightPlateX={rightPlateX}
              topY={topY}
              plateHeight={plateHeight}
              plateWidth={plateWidth}
            />

            <FieldLines
              show={showField}
              count={fieldLineCount}
              leftPlateX={leftPlateX}
              rightPlateX={rightPlateX}
              topY={topY}
              plateHeight={plateHeight}
              plateWidth={plateWidth}
            />

            <Dipoles
              dipoles={dipoles}
              leftPlateX={leftPlateX}
              rightPlateX={rightPlateX}
              centerY={centerY}
              plateWidth={plateWidth}
            />

            <MovingChargeFlow
              movingDots={movingDots}
              chargeDotCount={chargeDotCount}
              negativeChargePath={negativeChargePath}
              positiveChargePath={positiveChargePath}
            />

            <text
              x={leftPlateX - 36}
              y={topY - 12}
              textAnchor="middle"
              fill={STYLE.negativePlate}
              fontSize="12"
              fontWeight="900"
            >
              Negative Plate
            </text>

            <text
              x={rightPlateX + 58}
              y={topY - 12}
              textAnchor="middle"
              fill="#dc2626"
              fontSize="12"
              fontWeight="900"
            >
              Positive Plate
            </text>

            <text
              x={centerX}
              y={bottomY + 32}
              textAnchor="middle"
              fill="#7c3aed"
              fontSize="13"
              fontWeight="900"
            >
              Dielectric: {dielectric.label} · k = {dielectric.k}
            </text>

            <text
              x={LABEL.chargeNotice.x}
              y={LABEL.chargeNotice.y}
              textAnchor="middle"
              fill={STYLE.negativePlate}
              fontSize="12"
              fontWeight="900"
            >
              Charge accumulates on plates
            </text>

            <text
              x={LABEL.dielectricNotice.x}
              y={LABEL.dielectricNotice.y}
              textAnchor="middle"
              fill="#16a34a"
              fontSize="12"
              fontWeight="900"
            >
              Dielectric polarization
            </text>

            <FormulaPanel svgId={svgId} />

            <text
              x={LABEL.summary.x}
              y={LABEL.summary.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="12"
              fontWeight="800"
            >
              Capacitance ability ≠ stored charge · Energy rises with C and V²
            </text>

            <LevelBars
              relativeEffect={relativeEffect}
              storedEnergyLevel={storedEnergyLevel}
            />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Capacitance Ability
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Capacitance means the ability to store charge, not the charge
            itself.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Area = {safePlateArea} cm²
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Dielectric Polarization
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Dielectric molecules align with the electric field and improve
            charge storage.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            k = {dielectric.k}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Plate Distance
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Smaller plate distance gives stronger field coupling and higher
            capacitance.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            d = {safePlateDistance} mm
          </p>
        </div>
      </div>
    </section>
  );
}
