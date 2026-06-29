"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import {
  clamp,
  formatCapacitance,
  formatCurrent,
  formatNumber,
  formatResistance,
} from "./logic";
import type { CircuitMode } from "./types";

type CapacitorCircuitVisualProps = {
  supplyVoltage: number;
  resistance: number;
  capacitance: number;
  chargeLevel: number;
  capacitorVoltage: number;
  current: number;
  mode: CircuitMode;
  timeConstant: number;
};

const VIEW_BOX = "0 0 840 430";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 430;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  capacitor: 1,
  status: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const MIN_RESISTANCE = 0.001;
const MIN_CURRENT_BASE = 0.000001;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  panel: "#f8fafc",
  wire: "#53657d",
  charge: "#2563eb",
  discharge: "#f97316",
  returnFlow: "#0ea5e9",
  capacitorField: "#8b5cf6",
  batteryPositive: "#ef4444",
  batteryNegative: "#2563eb",
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

  resistor: {
    x: 230,
    y: 109,
    width: 155,
    height: 66,
    rotate: 0,
  },

  capacitor: {
    x: 455,
    y: 76,
    width: 74,
    height: 150,
    rotate: 0,
  },

  status: {
    x: 285,
    y: 270,
    width: 270,
    height: 38,
    rotate: 0,
  },
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
  capacitor: scaleComponent(
    BASE_COMPONENT.capacitor,
    CIRCUIT_COMPONENT_SCALE.capacitor,
  ),
  status: scaleComponent(BASE_COMPONENT.status, CIRCUIT_COMPONENT_SCALE.status),
} as const;

const NODE = {
  batteryPositive: pointOnComponent(COMPONENT.battery, 0.5, 0),
  batteryNegative: pointOnComponent(COMPONENT.battery, 0.5, 1),

  circuitY: { x: 0, y: 142 },
  bottomBusY: { x: 0, y: 320 },
  rightDrop: { x: 670, y: 142 },

  resistorLeft: pointOnComponent(COMPONENT.resistor, 0, 0.5),
  resistorRight: pointOnComponent(COMPONENT.resistor, 1, 0.5),
  resistorCenter: pointOnComponent(COMPONENT.resistor, 0.5, 0.5),

  capLeftPlateTop: pointOnComponent(COMPONENT.capacitor, 0, 0),
  capLeftPlateBottom: pointOnComponent(COMPONENT.capacitor, 0, 1),
  capRightPlateTop: pointOnComponent(COMPONENT.capacitor, 0.81, 0),
  capRightPlateBottom: pointOnComponent(COMPONENT.capacitor, 0.81, 1),

  capLeftTerminal: pointOnComponent(COMPONENT.capacitor, 0, 0.44),
  capRightTerminal: pointOnComponent(COMPONENT.capacitor, 0.81, 0.44),

  capCenter: pointOnComponent(COMPONENT.capacitor, 0.405, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  chargeTopPath: [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.circuitY.y },
    NODE.resistorLeft,
    NODE.resistorRight,
    NODE.capLeftTerminal,
  ],

  chargeReturnPath: [
    NODE.batteryNegative,
    { x: NODE.batteryNegative.x, y: NODE.bottomBusY.y },
    { x: NODE.rightDrop.x, y: NODE.bottomBusY.y },
    NODE.rightDrop,
    NODE.capRightTerminal,
  ],

  dischargePath: [
    NODE.capLeftTerminal,
    NODE.resistorRight,
    NODE.resistorLeft,
    { x: NODE.batteryPositive.x, y: NODE.circuitY.y },
    NODE.batteryPositive,
  ],
} as const;

const LABEL = {
  topTitle: { x: 420, y: 42 },
  resistorValue: { x: NODE.resistorCenter.x, y: NODE.resistorCenter.y + 58 },
  capacitance: { x: NODE.capCenter.x, y: 64 },
  capacitorVoltage: { x: NODE.capCenter.x, y: 250 },
  batteryPlus: {
    x: NODE.batteryPositive.x + 34,
    y: NODE.batteryPositive.y - 8,
  },
  batteryMinus: {
    x: NODE.batteryNegative.x + 34,
    y: NODE.batteryNegative.y + 8,
  },
  modeText: { x: 250, y: 92 },
  currentText: { x: 620, y: 92 },
  formulaText: { x: 420, y: 295 },
  summaryText: { x: 420, y: 330 },
  chargeBar: { x: 160, y: 366 },
} as const;

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
        fill={STYLE.batteryPositive}
        stroke="#ffffff"
        strokeWidth="2"
      />

      <circle
        cx={NODE.batteryNegative.x}
        cy={NODE.batteryNegative.y}
        r="5.5"
        fill={STYLE.batteryNegative}
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
  resistance,
  flowLevel,
}: {
  svgId: string;
  resistance: number;
  flowLevel: number;
}) {
  return (
    <g>
      <motion.g
        filter={`url(#${svgId}-shadow)`}
        animate={{ opacity: [0.94, 1, 0.94] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <rect
          x={COMPONENT.resistor.x}
          y={COMPONENT.resistor.y}
          width={COMPONENT.resistor.width}
          height={COMPONENT.resistor.height}
          rx={COMPONENT.resistor.height / 2}
          fill={`url(#${svgId}-resistor)`}
          stroke="#111827"
          strokeWidth="4"
        />

        <rect
          x={COMPONENT.resistor.x + 28}
          y={COMPONENT.resistor.y}
          width="11"
          height={COMPONENT.resistor.height}
          fill="#ef4444"
        />

        <rect
          x={COMPONENT.resistor.x + 68}
          y={COMPONENT.resistor.y}
          width="11"
          height={COMPONENT.resistor.height}
          fill="#111827"
        />

        <rect
          x={COMPONENT.resistor.x + 108}
          y={COMPONENT.resistor.y}
          width="11"
          height={COMPONENT.resistor.height}
          fill="#f59e0b"
        />

        <text
          x={NODE.resistorCenter.x}
          y={NODE.resistorCenter.y + 5}
          textAnchor="middle"
          fill="#78350f"
          fontSize="12"
          fontWeight="900"
        >
          R
        </text>
      </motion.g>

      <text
        x={LABEL.resistorValue.x}
        y={LABEL.resistorValue.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        {formatResistance(resistance)}
      </text>
    </g>
  );
}

function CapacitorBlock({
  svgId,
  capacitance,
  capacitorVoltage,
  chargeLevel,
}: {
  svgId: string;
  capacitance: number;
  capacitorVoltage: number;
  chargeLevel: number;
}) {
  const plateGlow = clamp(chargeLevel, 0.12, 1);
  const fieldLines = clamp(Math.round(chargeLevel * 12), 3, 12);

  return (
    <g>
      <rect
        x={NODE.capLeftPlateTop.x}
        y={NODE.capLeftPlateTop.y}
        width="14"
        height={COMPONENT.capacitor.height}
        rx="5"
        fill={STYLE.charge}
        filter={`url(#${svgId}-capacitorGlow)`}
      />

      <rect
        x={NODE.capRightPlateTop.x}
        y={NODE.capRightPlateTop.y}
        width="14"
        height={COMPONENT.capacitor.height}
        rx="5"
        fill="#ef4444"
        filter={`url(#${svgId}-capacitorGlow)`}
      />

      <text
        x={LABEL.capacitance.x}
        y={LABEL.capacitance.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        C = {formatCapacitance(capacitance)}
      </text>

      <text
        x={LABEL.capacitorVoltage.x}
        y={LABEL.capacitorVoltage.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="900"
      >
        Vc = {formatNumber(capacitorVoltage, 2)}V
      </text>

      <text
        x={NODE.capLeftPlateTop.x - 22}
        y="102"
        textAnchor="middle"
        fill={STYLE.charge}
        fontSize="13"
        fontWeight="900"
      >
        −
      </text>

      <text
        x={NODE.capRightPlateTop.x + 34}
        y="102"
        textAnchor="middle"
        fill="#dc2626"
        fontSize="13"
        fontWeight="900"
      >
        +
      </text>

      {Array.from({ length: fieldLines }).map((_, index) => {
        const y = 96 + index * 10;

        return (
          <motion.g
            key={`field-${index}`}
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              delay: index * 0.03,
            }}
          >
            <line
              x1={NODE.capLeftPlateTop.x + 20}
              y1={y}
              x2={NODE.capRightPlateTop.x - 6}
              y2={y}
              stroke={STYLE.capacitorField}
              strokeWidth="2"
              strokeLinecap="round"
              opacity={plateGlow}
            />
          </motion.g>
        );
      })}
    </g>
  );
}

function FormulaPanel({
  svgId,
  current,
  timeConstant,
  chargeLevel,
}: {
  svgId: string;
  current: number;
  timeConstant: number;
  chargeLevel: number;
}) {
  return (
    <g>
      <g filter={`url(#${svgId}-shadow)`}>
        <rect
          x={COMPONENT.status.x}
          y={COMPONENT.status.y}
          width={COMPONENT.status.width}
          height={COMPONENT.status.height}
          fill="#ffffff"
          opacity="0.97"
        />

        <text
          x={LABEL.formulaText.x}
          y={LABEL.formulaText.y}
          textAnchor="middle"
          fill={STYLE.text}
          fontSize="17"
          fontWeight="900"
        >
          τ = R × C
        </text>

        <line
          x1="310"
          y1="303"
          x2="530"
          y2="303"
          stroke={STYLE.capacitorField}
          strokeWidth="2"
          opacity="0.45"
        />
      </g>

      <text
        x={LABEL.summaryText.x}
        y={LABEL.summaryText.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="800"
      >
        I = {formatCurrent(Math.abs(current))} · τ ={" "}
        {formatNumber(timeConstant, 3)}s · Charge ={" "}
        {formatNumber(chargeLevel * 100, 1)}%
      </text>
    </g>
  );
}

function ParticleFlow({
  particles,
  particleSpeed,
  particleCount,
  mode,
}: {
  particles: number[];
  particleSpeed: number;
  particleCount: number;
  mode: CircuitMode;
}) {
  const activePath =
    mode === "charge" ? pathD(WIRE.chargeTopPath) : pathD(WIRE.dischargePath);
  const returnPath = pathD(WIRE.chargeReturnPath);

  return (
    <g>
      {particles.map((index) => (
        <circle
          key={`capacitor-flow-${index}`}
          r="3.4"
          fill={mode === "charge" ? STYLE.charge : STYLE.discharge}
          stroke={mode === "charge" ? "#dbeafe" : "#ffedd5"}
          strokeWidth="1.2"
        >
          <animateMotion
            dur={`${particleSpeed}s`}
            repeatCount="indefinite"
            path={activePath}
            begin={`${index * (particleSpeed / particleCount)}s`}
          />
        </circle>
      ))}

      {mode === "charge" &&
        particles
          .slice(0, Math.max(3, Math.floor(particles.length / 2)))
          .map((index) => (
            <circle
              key={`capacitor-return-flow-${index}`}
              r="3.1"
              fill={STYLE.returnFlow}
              stroke="#e0f2fe"
              strokeWidth="1.1"
            >
              <animateMotion
                dur={`${particleSpeed}s`}
                repeatCount="indefinite"
                path={returnPath}
                begin={`${index * (particleSpeed / particleCount)}s`}
              />
            </circle>
          ))}
    </g>
  );
}

export function CapacitorCircuitVisual({
  supplyVoltage,
  resistance,
  capacitance,
  chargeLevel,
  capacitorVoltage,
  current,
  mode,
  timeConstant,
}: CapacitorCircuitVisualProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeVoltage = Number.isFinite(supplyVoltage) ? supplyVoltage : 0;
  const safeResistance = Math.max(
    Number.isFinite(resistance) ? resistance : 0,
    MIN_RESISTANCE,
  );
  const safeCapacitance = Math.max(
    Number.isFinite(capacitance) ? capacitance : 0,
    0,
  );
  const safeCurrent = Number.isFinite(current) ? current : 0;
  const safeChargeLevel = clamp(
    Number.isFinite(chargeLevel) ? chargeLevel : 0,
    0,
    1,
  );
  const safeCapacitorVoltage = Number.isFinite(capacitorVoltage)
    ? capacitorVoltage
    : 0;
  const safeTimeConstant = Math.max(
    Number.isFinite(timeConstant) ? timeConstant : 0,
    0,
  );

  const maxCurrent = Math.max(
    Math.abs(safeVoltage) / safeResistance,
    MIN_CURRENT_BASE,
  );
  const flowLevel = clamp(Math.abs(safeCurrent) / maxCurrent, 0.04, 1);

  const wireWidth = WIRE.width + flowLevel * 4;
  const particleCount = clamp(Math.round(flowLevel * 20), 3, 24);
  const particleSpeed = clamp(2.8 - flowLevel * 1.7, 0.65, 2.9);

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
            Capacitor Charge & Discharge Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            A capacitor stores energy as an electric field between two plates.
            The flow slows down as the capacitor charges.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            mode === "charge"
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {mode === "charge" ? "CHARGING MODE" : "DISCHARGING MODE"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[840px] sm:w-full"
          role="img"
          aria-label="Capacitor charging and discharging circuit visualizer"
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
              id={`${svgId}-capacitorGlow`}
              x="-50%"
              y="-60%"
              width="200%"
              height="230%"
            >
              <feGaussianBlur
                stdDeviation={3 + safeChargeLevel * 8}
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id={`${svgId}-resistor`} x1="0" x2="1">
              <stop offset="0%" stopColor="#f8d890" />
              <stop
                offset="55%"
                stopColor={flowLevel > 0.55 ? "#fb923c" : "#e8b95d"}
              />
              <stop offset="100%" stopColor="#dca843" />
            </linearGradient>
          </defs>

          <rect
            x="8"
            y="10"
            width="824"
            height="405"
            rx="20"
            fill={STYLE.panel}
          />

          <g transform={canvasTransform}>
            <text
              x={LABEL.topTitle.x}
              y={LABEL.topTitle.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="900"
            >
              τ = R × C · Charging: capacitor voltage rises · Discharging:
              capacitor voltage falls
            </text>

            <path
              d={pathD(WIRE.chargeTopPath)}
              stroke={STYLE.wire}
              strokeWidth={wireWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={pathD(WIRE.chargeReturnPath)}
              stroke={STYLE.wire}
              strokeWidth={wireWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <BatteryBlock svgId={svgId} voltage={safeVoltage} />

            <ResistorBlock
              svgId={svgId}
              resistance={safeResistance}
              flowLevel={flowLevel}
            />

            <CapacitorBlock
              svgId={svgId}
              capacitance={safeCapacitance}
              capacitorVoltage={safeCapacitorVoltage}
              chargeLevel={safeChargeLevel}
            />

            <FormulaPanel
              svgId={svgId}
              current={safeCurrent}
              timeConstant={safeTimeConstant}
              chargeLevel={safeChargeLevel}
            />

            <ParticleFlow
              particles={particles}
              particleSpeed={particleSpeed}
              particleCount={particleCount}
              mode={mode}
            />

            <text
              x={LABEL.modeText.x}
              y={LABEL.modeText.y}
              textAnchor="middle"
              fill={mode === "charge" ? STYLE.charge : STYLE.discharge}
              fontSize="12"
              fontWeight="900"
            >
              {mode === "charge"
                ? "Charging current toward capacitor"
                : "Discharge current through resistor"}
            </text>

            <text
              x={LABEL.currentText.x}
              y={LABEL.currentText.y}
              textAnchor="middle"
              fill="#16a34a"
              fontSize="12"
              fontWeight="900"
            >
              Current = {formatCurrent(Math.abs(safeCurrent))}
            </text>

            <g
              transform={`translate(${LABEL.chargeBar.x} ${LABEL.chargeBar.y})`}
            >
              <text
                x="0"
                y="-10"
                fill={STYLE.text}
                fontSize="14"
                fontWeight="900"
              >
                Capacitor Charge Level
              </text>

              <rect x="0" y="8" width="500" height="13" rx="7" fill="#e2e8f0" />

              <motion.rect
                x="0"
                y="8"
                height="13"
                rx="7"
                fill={STYLE.capacitorField}
                animate={{ width: 500 * safeChargeLevel }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              />

              <text
                x="500"
                y="46"
                textAnchor="end"
                fill="#475569"
                fontSize="12"
                fontWeight="700"
              >
                {formatNumber(safeChargeLevel * 100, 1)}% charged
              </text>
            </g>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Capacitance Meaning
          </p>
          <p className="mt-1 text-sm text-slate-700">
            More capacitance allows more charge storage at the same voltage.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            C = {formatCapacitance(safeCapacitance)}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Time Constant
          </p>
          <p className="mt-1 text-sm text-slate-700">τ = R × C</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            τ = {formatNumber(safeTimeConstant, 3)} s
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Stored Voltage
          </p>
          <p className="mt-1 text-sm text-slate-700">
            During charging, capacitor voltage rises toward the supply voltage.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Vc = {formatNumber(safeCapacitorVoltage, 2)}V
          </p>
        </div>
      </div>
    </section>
  );
}
