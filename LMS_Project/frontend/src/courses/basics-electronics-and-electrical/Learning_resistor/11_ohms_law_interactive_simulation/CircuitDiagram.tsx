"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import {
  clamp,
  formatCurrent,
  formatNumber,
  formatResistance,
  getSafeLedStatus,
} from "./logic";
import type { LedOption } from "./types";

type CircuitDiagramProps = {
  voltage: number;
  resistance: number;
  current: number;
  ledBrightness: number;
  led: LedOption;
};

const VIEW_BOX = "0 0 780 410";
const VIEW_BOX_WIDTH = 780;
const VIEW_BOX_HEIGHT = 410;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  led: 1,
  formulaPanel: 1,
  currentBar: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const MAX_CURRENT_FOR_FLOW = 0.08;
const MIN_RESISTANCE = 0.001;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  wire: "#53657d",
  current: "#2563eb",
  safe: "#22c55e",
  caution: "#f97316",
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
  resistor: { x: 245, y: 108, width: 245, height: 66, rotate: 0 },
  led: { x: 515, y: 99, width: 100, height: 84, rotate: 0 },
  formulaPanel: { x: 270, y: 212, width: 240, height: 36, rotate: 0 },
  currentBar: { x: 160, y: 352, width: 480, height: 13, rotate: 0 },
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
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
  formulaPanel: scaleComponent(
    BASE_COMPONENT.formulaPanel,
    CIRCUIT_COMPONENT_SCALE.formulaPanel,
  ),
  currentBar: scaleComponent(
    BASE_COMPONENT.currentBar,
    CIRCUIT_COMPONENT_SCALE.currentBar,
  ),
} as const;

const NODE = {
  batteryPositive: pointOnComponent(COMPONENT.battery, 0.5, 0),
  batteryNegative: pointOnComponent(COMPONENT.battery, 0.5, 1),

  resistorLeft: pointOnComponent(COMPONENT.resistor, 0, 0.5),
  resistorRight: pointOnComponent(COMPONENT.resistor, 1, 0.5),
  resistorCenter: pointOnComponent(COMPONENT.resistor, 0.5, 0.5),

  ledLeadLeft: { x: 515, y: 141 },
  ledSymbolLeft: { x: 535, y: 141 },
  ledCenter: { x: 565, y: 141 },
  ledSymbolRight: { x: 595, y: 141 },
  ledLeadRight: { x: 615, y: 141 },

  rightDrop: { x: 650, y: 141 },
  bottomBus: { x: 650, y: 304 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  batteryToResistor: [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.resistorCenter.y },
    NODE.resistorLeft,
  ],

  resistorToLed: [NODE.resistorRight, NODE.ledLeadLeft],

  ledToReturn: [
    NODE.ledLeadRight,
    NODE.rightDrop,
    { x: NODE.rightDrop.x, y: NODE.bottomBus.y },
    { x: NODE.batteryNegative.x, y: NODE.bottomBus.y },
    NODE.batteryNegative,
  ],
} as const;

const PATH = {
  conventionalCurrent: pathD([
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.resistorCenter.y },
    NODE.resistorLeft,
    NODE.resistorRight,
    NODE.ledLeadLeft,
    NODE.ledLeadRight,
    NODE.rightDrop,
    { x: NODE.rightDrop.x, y: NODE.bottomBus.y },
    { x: NODE.batteryNegative.x, y: NODE.bottomBus.y },
    NODE.batteryNegative,
  ]),
} as const;

const LABEL = {
  title: { x: 210, y: 92 },
  led: { x: NODE.ledCenter.x, y: 92 },
  formula: { x: 390, y: 236 },
  summary: { x: 390, y: 274 },
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
  resistance,
  heatLevel,
}: {
  svgId: string;
  resistance: number;
  heatLevel: number;
}) {
  return (
    <motion.g
      filter={`url(#${svgId}-shadow)`}
      animate={{ x: heatLevel > 0.7 ? [0, 1.5, -1.5, 0] : 0 }}
      transition={{ repeat: Infinity, duration: 0.2 }}
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
        filter={`url(#${svgId}-heatGlow)`}
      />

      <rect
        x={COMPONENT.resistor.x + 42}
        y={COMPONENT.resistor.y}
        width="16"
        height={COMPONENT.resistor.height}
        fill="#ef4444"
      />
      <rect
        x={COMPONENT.resistor.x + 98}
        y={COMPONENT.resistor.y}
        width="17"
        height={COMPONENT.resistor.height}
        fill="#111827"
      />
      <rect
        x={COMPONENT.resistor.x + 158}
        y={COMPONENT.resistor.y}
        width="16"
        height={COMPONENT.resistor.height}
        fill="#f59e0b"
      />
      <rect
        x={COMPONENT.resistor.x + 198}
        y={COMPONENT.resistor.y}
        width="16"
        height={COMPONENT.resistor.height}
        fill="#d4af37"
      />

      <text
        x={NODE.resistorCenter.x}
        y={COMPONENT.resistor.y + 40}
        textAnchor="middle"
        fill="#78350f"
        fontSize="13"
        fontWeight="900"
      >
        R = {formatResistance(resistance)}
      </text>
    </motion.g>
  );
}

function LedBlock({
  svgId,
  led,
  ledBrightness,
}: {
  svgId: string;
  led: LedOption;
  ledBrightness: number;
}) {
  return (
    <g filter={`url(#${svgId}-ledGlow)`}>
      <line
        x1={NODE.ledLeadLeft.x}
        y1={NODE.ledCenter.y}
        x2={NODE.ledSymbolLeft.x}
        y2={NODE.ledCenter.y}
        stroke={STYLE.wire}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1={NODE.ledSymbolRight.x}
        y1={NODE.ledCenter.y}
        x2={NODE.ledLeadRight.x}
        y2={NODE.ledCenter.y}
        stroke={STYLE.wire}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <circle
        cx={NODE.ledCenter.x}
        cy={NODE.ledCenter.y}
        r="34"
        fill={`rgba(${led.glow},${0.14 + ledBrightness * 0.72})`}
        stroke={led.stroke}
        strokeWidth={4 + ledBrightness * 3}
      />

      <polygon
        points={`${NODE.ledCenter.x - 16},${NODE.ledCenter.y - 22} ${
          NODE.ledCenter.x - 16
        },${NODE.ledCenter.y + 22} ${NODE.ledCenter.x + 18},${
          NODE.ledCenter.y
        }`}
        fill={led.fill}
        stroke={led.stroke}
        strokeWidth="3"
      />

      <line
        x1={NODE.ledCenter.x + 29}
        y1={NODE.ledCenter.y - 24}
        x2={NODE.ledCenter.x + 29}
        y2={NODE.ledCenter.y + 24}
        stroke={led.stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />

      <motion.g
        animate={{
          opacity: ledBrightness > 0.15 ? [0.35, 1, 0.35] : 0.15,
        }}
        transition={{ repeat: Infinity, duration: 1.1 }}
      >
        <path
          d={`M${NODE.ledCenter.x + 14} ${NODE.ledCenter.y - 38} l14 -14`}
          stroke={led.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d={`M${NODE.ledCenter.x + 28} ${NODE.ledCenter.y - 38} l14 -14`}
          stroke={led.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
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
        V = I × R
      </text>

      <line
        x1="292"
        y1="244"
        x2="488"
        y2="244"
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
}: {
  particles: number[];
  particleCount: number;
  currentSpeed: number;
}) {
  return (
    <g>
      {particles.map((index) => (
        <circle
          key={`conventional-current-dot-${index}`}
          r="3.4"
          fill={STYLE.current}
          stroke="#dbeafe"
          strokeWidth="1.2"
        >
          <animateMotion
            dur={`${currentSpeed}s`}
            repeatCount="indefinite"
            path={PATH.conventionalCurrent}
            begin={`${index * (currentSpeed / particleCount)}s`}
          />
        </circle>
      ))}
    </g>
  );
}

function WarningBox({
  ledStatus,
}: {
  ledStatus: ReturnType<typeof getSafeLedStatus>;
}) {
  return (
    <motion.g
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ repeat: Infinity, duration: 0.9 }}
    >
      <rect
        x="432"
        y="252"
        width="245"
        height="42"
        rx="12"
        fill={ledStatus.label === "UNSAFE" ? "#fee2e2" : "#ffedd5"}
        stroke={ledStatus.label === "UNSAFE" ? STYLE.danger : STYLE.caution}
        strokeWidth="2"
      />

      <text
        x="555"
        y="278"
        textAnchor="middle"
        fill={ledStatus.label === "UNSAFE" ? "#dc2626" : "#c2410c"}
        fontSize="12"
        fontWeight="900"
      >
        Warning: LED may burn
      </text>
    </motion.g>
  );
}

function CurrentLevelBar({
  ledStatus,
  currentLevel,
  ledBrightness,
}: {
  ledStatus: ReturnType<typeof getSafeLedStatus>;
  currentLevel: number;
  ledBrightness: number;
}) {
  const barColor =
    ledStatus.label === "UNSAFE"
      ? STYLE.danger
      : ledStatus.label === "CAUTION"
        ? STYLE.caution
        : STYLE.safe;

  return (
    <g
      transform={`translate(${COMPONENT.currentBar.x} ${COMPONENT.currentBar.y})`}
    >
      <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
        Conventional Current Level
      </text>

      <rect
        x="0"
        y="8"
        width={COMPONENT.currentBar.width}
        height={COMPONENT.currentBar.height}
        rx="7"
        fill="#e2e8f0"
      />

      <motion.rect
        x="0"
        y="8"
        height={COMPONENT.currentBar.height}
        rx="7"
        fill={barColor}
        animate={{ width: COMPONENT.currentBar.width * currentLevel }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />

      <text
        x={COMPONENT.currentBar.width}
        y="46"
        textAnchor="end"
        fill="#475569"
        fontSize="12"
        fontWeight="700"
      >
        LED brightness {Math.round(ledBrightness * 100)}%
      </text>
    </g>
  );
}

export function CircuitDiagram({
  voltage,
  resistance,
  current,
  ledBrightness,
  led,
}: CircuitDiagramProps) {
  const rawId = useId();
  const svgId = rawId.replace(/:/g, "");

  const safeVoltage = Number.isFinite(voltage) ? voltage : 0;
  const safeResistance = Math.max(
    Number.isFinite(resistance) ? resistance : 0,
    MIN_RESISTANCE,
  );
  const safeCurrent = Math.max(Number.isFinite(current) ? current : 0, 0);

  const currentLevel = clamp(safeCurrent / MAX_CURRENT_FOR_FLOW, 0.04, 1);
  const heatLevel = clamp(
    (safeCurrent * safeCurrent * safeResistance) / 2,
    0,
    1,
  );

  const particleCount = clamp(Math.round(currentLevel * 22), 3, 26);
  const currentSpeed = clamp(2.8 - currentLevel * 1.7, 0.65, 2.9);

  const ledStatus = getSafeLedStatus(safeCurrent, led.safeCurrentMa);
  const showBurnWarning =
    ledStatus.label === "UNSAFE" || ledStatus.label === "CAUTION";

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
            Ohm&apos;s Law Circuit Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Conventional current flows from the positive terminal through the
            resistor and LED, then returns to the negative terminal.
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
          CONVENTIONAL CURRENT
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[780px] sm:w-full"
          role="img"
          aria-label="Ohm's law circuit diagram with connected LED and conventional current"
        >
          <defs>
            <linearGradient id={`${svgId}-resistor`} x1="0" x2="1">
              <stop offset="0%" stopColor="#f8d890" />
              <stop
                offset="55%"
                stopColor={heatLevel > 0.6 ? "#fb923c" : "#e8b95d"}
              />
              <stop
                offset="100%"
                stopColor={heatLevel > 0.9 ? "#ef4444" : "#dca843"}
              />
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
              id={`${svgId}-ledGlow`}
              x="-70%"
              y="-70%"
              width="240%"
              height="240%"
            >
              <feGaussianBlur
                stdDeviation={6 + ledBrightness * 14}
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
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

          <rect x="8" y="10" width="764" height="385" rx="20" fill="#f8fafc" />

          <g transform={canvasTransform}>
            <WirePath points={WIRE.batteryToResistor} />
            <WirePath points={WIRE.resistorToLed} />
            <WirePath points={WIRE.ledToReturn} />

            <BatteryBlock svgId={svgId} voltage={safeVoltage} />

            <ResistorBlock
              svgId={svgId}
              resistance={safeResistance}
              heatLevel={heatLevel}
            />

            <LedBlock svgId={svgId} led={led} ledBrightness={ledBrightness} />

            <text
              x={LABEL.led.x}
              y={LABEL.led.y}
              textAnchor="middle"
              fill="#16a34a"
              fontSize="15"
              fontWeight="900"
            >
              {led.label} LED
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
              I = {formatCurrent(safeCurrent)} · V ={" "}
              {formatNumber(safeVoltage, 1)}V · R ={" "}
              {formatResistance(safeResistance)}
            </text>

            <CurrentParticles
              particles={particles}
              particleCount={particleCount}
              currentSpeed={currentSpeed}
            />

            {showBurnWarning && <WarningBox ledStatus={ledStatus} />}

            <circle
              cx="390"
              cy={NODE.bottomBus.y}
              r="4"
              fill="#2563eb"
              stroke="#dbeafe"
            />
            <circle
              cx={NODE.rightDrop.x}
              cy={NODE.bottomBus.y}
              r="3.5"
              fill="#38bdf8"
            />

            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill="#2563eb"
              fontSize="12"
              fontWeight="900"
            >
              Conventional current: + → Resistor → LED → −
            </text>

            <CurrentLevelBar
              ledStatus={ledStatus}
              currentLevel={currentLevel}
              ledBrightness={ledBrightness}
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
