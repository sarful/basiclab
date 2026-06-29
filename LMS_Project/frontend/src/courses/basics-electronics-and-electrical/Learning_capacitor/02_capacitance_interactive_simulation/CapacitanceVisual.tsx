"use client";

import { motion } from "framer-motion";

import {
  clamp,
  computeCapacitanceSnapshot,
  dielectricOptions,
  formatCapacitance,
  formatCharge,
  formatEnergy,
} from "./logic";

type CapacitanceVisualProps = {
  plateArea: number;
  plateDistance: number;
  dielectricIndex: number;
  voltage: number;
};

const VIEW_BOX = "0 0 840 430";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 430;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  capacitor: 1,
  chargeBar: 1,
} as const;

const BASE_WIRE_WIDTH = 8;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  wire: "#64748b",
  negativePlate: "#2563eb",
  positivePlate: "#ef4444",
  field: "#8b5cf6",
  electron: "#0ea5e9",
  panel: "#f8fafc",
  dielectricStroke: "#334155",
  batteryBody: "#0f172a",
  batteryStroke: "#94a3b8",
  ledGlow: "#facc15",
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
    x: 72,
    y: 160,
    width: 110,
    height: 92,
    rotate: 0,
  },

  capacitor: {
    x: 360,
    y: 120,
    width: 120,
    height: 170,
    rotate: 0,
  },

  chargeBar: {
    x: 150,
    y: 390,
    width: 540,
    height: 12,
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
  chargeBar: scaleComponent(
    BASE_COMPONENT.chargeBar,
    CIRCUIT_COMPONENT_SCALE.chargeBar,
  ),
} as const;

const NODE = {
  batteryNegativeTerminal: pointOnComponent(COMPONENT.battery, 1, 0.27),
  batteryPositiveTerminal: pointOnComponent(COMPONENT.battery, 0.5, 1.06),

  capacitorCenter: pointOnComponent(COMPONENT.capacitor, 0.5, 0.5),

  returnRight: { x: 705, y: 335 },
  returnBottom: { x: 127, y: 335 },
  returnBattery: { x: 127, y: 252 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  negativeWire: (leftPlateX: number): Point[] => [
    NODE.batteryNegativeTerminal,
    { x: leftPlateX, y: NODE.batteryNegativeTerminal.y },
  ],

  positiveReturnWire: (rightPlateX: number): Point[] => [
    { x: rightPlateX + 16, y: NODE.batteryNegativeTerminal.y },
    { x: NODE.returnRight.x, y: NODE.batteryNegativeTerminal.y },
    NODE.returnRight,
    NODE.returnBottom,
    NODE.returnBattery,
  ],
} as const;

const LABEL = {
  title: { x: 420, y: 28 },
  formula: { x: 420, y: 82 },
  batteryDc: { x: 127, y: 196 },
  batteryVoltage: { x: 127, y: 222 },
  batteryMinus: { x: 185, y: 178 },
  batteryPlus: { x: 125, y: 258 },
  dielectric: { x: 420, yOffset: 36 },
  chargeBar: { x: 150, y: 390 },
} as const;

function BatteryBlock({ voltage }: { voltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.battery.x}
        y={COMPONENT.battery.y}
        width={COMPONENT.battery.width}
        height={COMPONENT.battery.height}
        rx="15"
        fill={STYLE.batteryBody}
        stroke={STYLE.batteryStroke}
        strokeWidth="3"
      />

      <text
        x={LABEL.batteryDc.x}
        y={LABEL.batteryDc.y}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="15"
        fontWeight="800"
      >
        DC
      </text>

      <text
        x={LABEL.batteryVoltage.x}
        y={LABEL.batteryVoltage.y}
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="14"
        fontWeight="800"
      >
        {voltage}V
      </text>

      <text
        x={LABEL.batteryMinus.x}
        y={LABEL.batteryMinus.y}
        fill="#38bdf8"
        fontSize="18"
        fontWeight="900"
      >
        -
      </text>

      <text
        x={LABEL.batteryPlus.x}
        y={LABEL.batteryPlus.y}
        fill="#f97316"
        fontSize="18"
        fontWeight="900"
      >
        +
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

function CapacitorPlates({
  leftPlateX,
  rightPlateX,
  topY,
  plateHeight,
  dielectricColor,
  capacitanceLevel,
}: {
  leftPlateX: number;
  rightPlateX: number;
  topY: number;
  plateHeight: number;
  dielectricColor: string;
  capacitanceLevel: number;
}) {
  return (
    <g>
      <motion.rect
        x={leftPlateX}
        y={topY}
        width="16"
        height={plateHeight}
        rx="5"
        fill={STYLE.negativePlate}
        filter="url(#capacitanceGlow)"
        animate={{ opacity: [0.78, 1, 0.78] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />

      <motion.rect
        x={rightPlateX}
        y={topY}
        width="16"
        height={plateHeight}
        rx="5"
        fill={STYLE.positivePlate}
        filter="url(#capacitanceGlow)"
        animate={{ opacity: [0.78, 1, 0.78] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />

      <motion.rect
        x={leftPlateX + 18}
        y={topY + 5}
        width={Math.max(rightPlateX - leftPlateX - 20, 8)}
        height={plateHeight - 10}
        rx="13"
        fill={dielectricColor}
        stroke={STYLE.dielectricStroke}
        strokeDasharray="6 5"
        strokeWidth="2"
        animate={{ opacity: [0.68, 0.96, 0.68] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      />
    </g>
  );
}

function ElectricFieldLines({
  leftPlateX,
  rightPlateX,
  topY,
  plateHeight,
  count,
}: {
  leftPlateX: number;
  rightPlateX: number;
  topY: number;
  plateHeight: number;
  count: number;
}) {
  return (
    <g>
      {Array.from({ length: count }).map((_, index) => {
        const y =
          topY + 20 + index * ((plateHeight - 40) / Math.max(count - 1, 1));

        return (
          <motion.g key={`field-${index}`}>
            <line
              x1={leftPlateX + 28}
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

function ChargeDots({
  leftPlateX,
  rightPlateX,
  topY,
  plateHeight,
  count,
}: {
  leftPlateX: number;
  rightPlateX: number;
  topY: number;
  plateHeight: number;
  count: number;
}) {
  return (
    <g>
      {Array.from({ length: count }).map((_, index) => {
        const y = topY + 16 + (index % 13) * ((plateHeight - 32) / 13);
        const sideOffset = Math.floor(index / 13) * 7;

        return (
          <g key={`charge-dot-${index}`}>
            <circle
              cx={leftPlateX - 10 - sideOffset}
              cy={y}
              r="4"
              fill={STYLE.electron}
              stroke="#e0f2fe"
              strokeWidth="1.3"
            />
            <text
              x={leftPlateX - 10 - sideOffset}
              y={y + 3}
              textAnchor="middle"
              fill="white"
              fontSize="7"
              fontWeight="900"
            >
              -
            </text>

            <circle
              cx={rightPlateX + 26 + sideOffset}
              cy={y}
              r="4"
              fill={STYLE.positivePlate}
              stroke="#fee2e2"
              strokeWidth="1.3"
            />
            <text
              x={rightPlateX + 26 + sideOffset}
              y={y + 3}
              textAnchor="middle"
              fill="white"
              fontSize="7"
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

function ElectronFlowLine({ leftPlateX }: { leftPlateX: number }) {
  const path = `M182 185 H${leftPlateX}`;

  return (
    <g>
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.circle
          key={`electron-${index}`}
          r="4"
          fill={STYLE.electron}
          stroke="#e0f2fe"
          strokeWidth="1.5"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2.1,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.16,
          }}
          style={{ offsetPath: `path('${path}')` }}
        />
      ))}
    </g>
  );
}

function ChargeBar({ capacitanceLevel }: { capacitanceLevel: number }) {
  return (
    <g transform={`translate(${LABEL.chargeBar.x} ${LABEL.chargeBar.y})`}>
      <text x="0" y="0" fill={STYLE.muted} fontSize="12" fontWeight="700">
        Charge Storing Ability
      </text>

      <rect
        x="0"
        y="12"
        width={COMPONENT.chargeBar.width}
        height={COMPONENT.chargeBar.height}
        rx="6"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="12"
        height={COMPONENT.chargeBar.height}
        rx="6"
        fill={STYLE.field}
        animate={{ width: COMPONENT.chargeBar.width * capacitanceLevel }}
      />

      <text
        x={COMPONENT.chargeBar.width}
        y="42"
        textAnchor="end"
        fill="#64748b"
        fontSize="11"
      >
        More capacitance means more charge at the same voltage
      </text>
    </g>
  );
}

export function CapacitanceVisual({
  plateArea,
  plateDistance,
  dielectricIndex,
  voltage,
}: CapacitanceVisualProps) {
  const dielectric = dielectricOptions[dielectricIndex];

  const { capacitance, charge, energy, capacitanceLevel } =
    computeCapacitanceSnapshot({
      plateArea,
      plateDistance,
      dielectricK: dielectric.k,
      voltage,
    });

  const safeCapacitanceLevel = clamp(capacitanceLevel, 0, 1);

  const plateHeight = 92 + plateArea * 2.25;
  const gap = 44 + plateDistance * 5.4;
  const leftPlateX = 420 - gap / 2;
  const rightPlateX = 420 + gap / 2;
  const topY = 205 - plateHeight / 2;

  const fieldLineCount = Math.min(
    Math.max(Math.round(safeCapacitanceLevel * 15), 4),
    15,
  );

  const chargeDotCount = Math.min(
    Math.max(Math.round(safeCapacitanceLevel * voltage), 6),
    26,
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Capacitance Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            Capacitance is the measure of how much charge a capacitor can store
            at a given voltage.
          </p>
        </div>

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          Q = C × V
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox={VIEW_BOX} className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter
              id="capacitanceGlow"
              x="-45%"
              y="-55%"
              width="190%"
              height="210%"
            >
              <feGaussianBlur
                stdDeviation={4 + safeCapacitanceLevel * 8}
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="800"
            >
              Capacitance: charge storing ability of a capacitor
            </text>

            <BatteryBlock voltage={voltage} />

            <WirePath points={WIRE.negativeWire(leftPlateX)} />
            <WirePath points={WIRE.positiveReturnWire(rightPlateX)} />

            <CapacitorPlates
              leftPlateX={leftPlateX}
              rightPlateX={rightPlateX}
              topY={topY}
              plateHeight={plateHeight}
              dielectricColor={dielectric.color}
              capacitanceLevel={safeCapacitanceLevel}
            />

            <ElectricFieldLines
              leftPlateX={leftPlateX}
              rightPlateX={rightPlateX}
              topY={topY}
              plateHeight={plateHeight}
              count={fieldLineCount}
            />

            <ChargeDots
              leftPlateX={leftPlateX}
              rightPlateX={rightPlateX}
              topY={topY}
              plateHeight={plateHeight}
              count={chargeDotCount}
            />

            <ElectronFlowLine leftPlateX={leftPlateX} />

            <text
              x={leftPlateX - 34}
              y={topY - 12}
              textAnchor="middle"
              fill={STYLE.negativePlate}
              fontSize="12"
              fontWeight="900"
            >
              - Plate
            </text>

            <text
              x={rightPlateX + 46}
              y={topY - 12}
              textAnchor="middle"
              fill="#dc2626"
              fontSize="12"
              fontWeight="900"
            >
              + Plate
            </text>

            <text
              x={LABEL.dielectric.x}
              y={topY + plateHeight + LABEL.dielectric.yOffset}
              textAnchor="middle"
              fill="#7c3aed"
              fontSize="13"
              fontWeight="900"
            >
              Dielectric: {dielectric.label} | k = {dielectric.k}
            </text>

            <text
              x={LABEL.formula.x}
              y={LABEL.formula.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="12"
              fontWeight="800"
            >
              C = {formatCapacitance(capacitance)} | Q = {formatCharge(charge)}{" "}
              | Energy = {formatEnergy(energy)}
            </text>

            <ChargeBar capacitanceLevel={safeCapacitanceLevel} />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Capacitance Definition
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Capacitance is how much charge a capacitor can store per volt.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">C = Q / V</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Stored Charge
          </p>
          <p className="mt-1 text-sm text-slate-700">
            At the same voltage, higher capacitance stores more charge.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Q = {formatCharge(charge)}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Main Unit
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The SI unit of capacitance is the farad. Practical circuits often
            use uF, nF, and pF.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">1F = 1C/V</p>
        </div>
      </div>
    </div>
  );
}
