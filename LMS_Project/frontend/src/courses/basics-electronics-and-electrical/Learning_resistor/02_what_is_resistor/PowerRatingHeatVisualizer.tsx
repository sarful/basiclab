"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import {
  clamp,
  formatCurrent,
  formatNumber,
  formatPower,
  formatResistance,
  getHeatStatus,
  getResistorColorBands,
} from "./logic";
import type { LedOption, ResistorLessonMode, ResistorPackage } from "./types";

const VIEW_BOX_WIDTH = 900;
const VIEW_BOX_HEIGHT = 445;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  resistor: 1,
  led: 1,
  heatBar: 1,
} as const;

const BASE_WIRE_WIDTH = 5;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  wire: "#64748b",
  activeFlow: "#38bdf8",
  current: "#0ea5e9",
  arrow: "#2563eb",
  heat: "#f97316",
  danger: "#ef4444",
  safe: "#22c55e",
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

function displayVoltage(value: number) {
  if (!Number.isFinite(value)) return "0V";
  return `${formatNumber(Math.max(0, Number(value.toFixed(2))), 2)}V`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  source: {
    x: 42,
    y: 106,
    width: 98,
    height: 102,
    rotate: 0,
  },

  resistor: {
    x: 300,
    y: 122,
    width: 260,
    height: 60,
    rotate: 0,
  },

  led: {
    x: 624,
    y: 126,
    width: 52,
    height: 52,
    rotate: 0,
  },

  heatBar: {
    x: 140,
    y: 380,
    width: 560,
    height: 12,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
  ),
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
  heatBar: scaleComponent(
    BASE_COMPONENT.heatBar,
    CIRCUIT_COMPONENT_SCALE.heatBar,
  ),
} as const;

const NODE = {
  sourcePositive: { x: 140, y: 152 },
  sourceNegative: { x: 91, y: 208 },

  resistorLeft: pointOnComponent(COMPONENT.resistor, 0, 0.5),
  resistorRight: pointOnComponent(COMPONENT.resistor, 1, 0.5),
  resistorCenter: pointOnComponent(COMPONENT.resistor, 0.5, 0.5),

  ledCenter: pointOnComponent(COMPONENT.led, 0.5, 0.5),
  ledLeft: { x: 624, y: 152 },
  ledRight: { x: 676, y: 152 },

  returnTop: { x: 790, y: 152 },
  returnBottom: { x: 790, y: 270 },
  returnLeft: { x: 91, y: 270 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  sourceToResistor: (bodyX: number): Point[] => [
    NODE.sourcePositive,
    { x: bodyX, y: NODE.sourcePositive.y },
  ],

  resistorToReturn: (bodyRightX: number): Point[] => [
    { x: bodyRightX, y: NODE.sourcePositive.y },
    NODE.returnTop,
  ],

  resistorToLed: (bodyRightX: number, ledWireLeftX: number): Point[] => [
    { x: bodyRightX, y: NODE.sourcePositive.y },
    { x: ledWireLeftX, y: NODE.sourcePositive.y },
  ],

  ledToReturn: (ledWireRightX: number): Point[] => [
    { x: ledWireRightX, y: NODE.sourcePositive.y },
    NODE.returnTop,
  ],

  returnPath: [
    NODE.returnTop,
    NODE.returnBottom,
    NODE.returnLeft,
    NODE.sourceNegative,
  ],
} as const;

const LABEL = {
  title: { x: VIEW_BOX_WIDTH / 2, y: 30 },
  subtitle: { x: VIEW_BOX_WIDTH / 2, y: 56 },
  resistorInput: { y: 112 },
  heatOut: { y: 74 },
  currentFlow: { x: 236, y: 128 },
  outputVoltage: { x: NODE.returnTop.x + 10, y: 148 },
  returnReference: { x: NODE.returnTop.x + 10, y: 172 },
} as const;

function Gauge({ label, value }: { label: string; value: number }) {
  const percent = clamp(value, 0, 1) * 100;

  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="font-bold text-slate-500">
          {formatNumber(percent, 0)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className={`h-2 rounded-full ${
            percent > 80
              ? "bg-red-500"
              : percent > 55
                ? "bg-amber-500"
                : "bg-green-500"
          }`}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>
    </div>
  );
}

function DashboardCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <motion.div
      key={`${label}-${value}`}
      initial={{ y: 5, opacity: 0.65 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-2xl bg-white p-3 ring-1 ring-slate-200"
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-base font-black text-slate-950">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{helper}</p>
    </motion.div>
  );
}

function WirePath({
  points,
  width,
}: {
  points: readonly Point[];
  width: number;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function SourceBlock({ voltage }: { voltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.source.x}
        y={COMPONENT.source.y}
        width={COMPONENT.source.width}
        height={COMPONENT.source.height}
        rx="16"
        fill="#0f172a"
        stroke="#94a3b8"
        strokeWidth="3"
      />

      <text
        x="91"
        y="132"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="20"
        fontWeight="900"
      >
        +
      </text>
      <text
        x="91"
        y="156"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="16"
        fontWeight="800"
      >
        DC
      </text>
      <text
        x="91"
        y="182"
        textAnchor="middle"
        fill="#7dd3fc"
        fontSize="15"
        fontWeight="800"
      >
        {displayVoltage(voltage)}
      </text>
      <text
        x="91"
        y="206"
        textAnchor="middle"
        fill="#cbd5e1"
        fontSize="18"
        fontWeight="900"
      >
        −
      </text>
      <text
        x="91"
        y="224"
        textAnchor="middle"
        fill="#2563eb"
        fontSize="12"
        fontWeight="800"
      >
        Supply Voltage
      </text>
    </g>
  );
}

function ResistorBody({
  bodyX,
  bodyY,
  selectedPackage,
  isOverload,
  heatLevel,
  bandOneColor,
  bandTwoColor,
  multiplierColor,
  toleranceColor,
}: {
  bodyX: number;
  bodyY: number;
  selectedPackage: ResistorPackage;
  isOverload: boolean;
  heatLevel: number;
  bandOneColor: string;
  bandTwoColor: string;
  multiplierColor: string;
  toleranceColor: string;
}) {
  return (
    <motion.g
      animate={{ x: isOverload ? [0, 2, -2, 0] : 0 }}
      transition={{ repeat: Infinity, duration: 0.18 }}
    >
      <rect
        x={bodyX}
        y={bodyY}
        width={selectedPackage.bodyWidth}
        height={selectedPackage.bodyHeight}
        rx={selectedPackage.bodyHeight / 2}
        fill="url(#lessonTwoHotBody)"
        stroke="#4a2d12"
        strokeWidth="5"
        filter="url(#lessonTwoResistorShadow)"
      />

      <rect
        x={bodyX + 45}
        y={bodyY}
        width="20"
        height={selectedPackage.bodyHeight}
        fill={bandOneColor}
        opacity="0.96"
      />
      <rect
        x={bodyX + 105}
        y={bodyY}
        width="20"
        height={selectedPackage.bodyHeight}
        fill={bandTwoColor}
        opacity="0.96"
      />
      <rect
        x={bodyX + 165}
        y={bodyY}
        width="20"
        height={selectedPackage.bodyHeight}
        fill={multiplierColor}
        opacity="0.96"
      />
      <rect
        x={bodyX + selectedPackage.bodyWidth - 62}
        y={bodyY}
        width="20"
        height={selectedPackage.bodyHeight}
        fill={toleranceColor}
        opacity="0.98"
      />

      <text
        x={bodyX + selectedPackage.bodyWidth / 2}
        y="158"
        textAnchor="middle"
        fill="#3b1f0a"
        fontSize="15"
        fontWeight="900"
      >
        {selectedPackage.label} Resistor
      </text>
    </motion.g>
  );
}

function LedLoad({
  ledOff,
  ledX,
  ledY,
  ledRadius,
  selectedLed,
  ledGlowOpacity,
}: {
  ledOff: boolean;
  ledX: number;
  ledY: number;
  ledRadius: number;
  selectedLed: LedOption;
  ledGlowOpacity: number;
}) {
  return (
    <>
      <motion.ellipse
        cx={ledX}
        cy={ledY}
        rx="40"
        ry="40"
        fill={selectedLed.glow}
        opacity={ledGlowOpacity}
        filter="url(#lessonTwoLedGlow)"
        animate={{ opacity: ledOff ? 0.08 : [0.55, 1, 0.55] }}
        transition={{ repeat: Infinity, duration: 1.1 }}
      />

      <circle
        cx={ledX}
        cy={ledY}
        r={ledRadius}
        fill="#0f172a"
        stroke={ledOff ? "#94a3b8" : selectedLed.color}
        strokeWidth="4"
      />

      <path
        d={`M${ledX - 10} ${ledY - 12} L${ledX - 10} ${ledY + 12} L${ledX + 8} ${ledY}`}
        fill={ledOff ? "#64748b" : selectedLed.color}
      />

      <path
        d={`M${ledX + 14} ${ledY - 15} V${ledY + 15}`}
        stroke="#f8fafc"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <text
        x={ledX}
        y="104"
        textAnchor="middle"
        fill={ledOff ? "#64748b" : selectedLed.color}
        fontSize="12"
        fontWeight="800"
      >
        {ledOff ? "LED OFF" : "LED brightness"}
      </text>
    </>
  );
}

export function PowerRatingHeatVisualizer({
  mode,
  voltage,
  outputVoltage,
  voltageDrop,
  ledVoltageDrop,
  resistance,
  rating,
  brightnessLevel,
  selectedLed,
  selectedPackage,
}: {
  mode: ResistorLessonMode;
  voltage: number;
  outputVoltage: number;
  voltageDrop: number;
  ledVoltageDrop: number;
  resistance: number;
  rating: number;
  brightnessLevel: number;
  selectedLed: LedOption;
  selectedPackage: ResistorPackage;
}) {
  const isLedMode = mode === "led";
  const ledOff = isLedMode && voltage < selectedLed.forwardVoltage;

  const safeResistance = Math.max(resistance, 1);
  const effectiveVoltageDrop = ledOff ? 0 : Math.max(0, voltageDrop);
  const current = effectiveVoltageDrop / safeResistance;
  const power = current * current * safeResistance;
  const loadRatio = rating > 0 ? power / rating : 0;

  const heatLevel = clamp(loadRatio, 0, 1);
  const flowLevel = ledOff ? 0.02 : clamp(current / 0.08, 0.05, 1);
  const resistanceEffect = clamp(safeResistance / 10000, 0.05, 1);
  const currentStrength = ledOff ? 0 : clamp(current / 0.08, 0, 1);
  const energyConversion = clamp(power / Math.max(rating, 0.001), 0, 1);

  const particleCount = ledOff
    ? 0
    : Math.min(Math.max(Math.round(flowLevel * 28), 5), 30);

  const congestionCount = Math.min(
    Math.max(Math.round(resistanceEffect * 12), 3),
    14,
  );

  const conversionParticleCount = Math.min(
    Math.max(Math.round(energyConversion * 12), 3),
    14,
  );

  const electronSpeed = Math.max(0.5, 3.2 - flowLevel * 2.25);
  const status = getHeatStatus(power, rating);
  const isOverload = loadRatio >= 1;

  const resistanceLabel =
    safeResistance <= 220
      ? "Low Resistance"
      : safeResistance <= 1000
        ? "Medium Resistance"
        : "High Resistance";

  const ledX = 650;
  const ledY = 152;
  const ledRadius = 26;
  const ledWireLeftX = ledX - ledRadius;
  const ledWireRightX = ledX + ledRadius;

  const bodyX = isLedMode
    ? 350 - selectedPackage.bodyWidth / 2
    : 430 - selectedPackage.bodyWidth / 2;

  const bodyY = 152 - selectedPackage.bodyHeight / 2;
  const bodyRightX = bodyX + selectedPackage.bodyWidth;
  const wireWidth = WIRE.width + flowLevel * 4;
  const ledGlowOpacity = ledOff ? 0.08 : 0.15 + brightnessLevel * 0.85;

  const [bandOneColor, bandTwoColor, multiplierColor, toleranceColor] =
    getResistorColorBands(safeResistance);

  const conventionalCurrentPath = isLedMode
    ? `path('M140 152 H${bodyX} H${bodyRightX} H${ledWireLeftX} H${ledWireRightX} H${NODE.returnTop.x} V270 H91 V208')`
    : `path('M140 152 H${bodyX} H${bodyRightX} H${NODE.returnTop.x} V270 H91 V208')`;

  const energyIntoResistorPath = `path('M150 152 H${bodyX + selectedPackage.bodyWidth / 2}')`;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  const title = isLedMode ? "Resistor Protects an LED" : "What a Resistor Does";

  const subtitle = isLedMode
    ? ledOff
      ? "The source voltage is below the LED forward voltage, so the LED stays OFF and current is blocked."
      : "Conventional current flows from + terminal through resistor and LED, then returns to 0V."
    : "Conventional current flows from + terminal through the resistor and returns to 0V.";

  const particleIndexes = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => index),
    [particleCount],
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-600">{subtitle}</p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${status.bg} ${status.tone}`}
        >
          {ledOff ? "LED OFF" : status.label}
        </span>
      </div>

      {ledOff ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <b>Not enough voltage to turn on LED.</b> The {selectedLed.label}{" "}
          needs about <b>{displayVoltage(selectedLed.forwardVoltage)}</b>, but
          the source is only <b>{displayVoltage(voltage)}</b>.
        </div>
      ) : null}

      <div className="mb-4">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          Engineering Measurements
        </p>

        <div className="grid gap-3 md:grid-cols-4">
          <DashboardCard
            label="Resistor Voltage Drop"
            value={displayVoltage(effectiveVoltageDrop)}
            helper="V across resistor"
          />
          <DashboardCard
            label="Resistance"
            value={formatResistance(safeResistance)}
            helper={resistanceLabel}
          />
          <DashboardCard
            label="Current"
            value={formatCurrent(current)}
            helper="I = V ÷ R"
          />
          <DashboardCard
            label="Power"
            value={formatPower(power)}
            helper="P = I²R"
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          Learning Indicators
        </p>

        <div className="grid gap-3 md:grid-cols-4">
          <Gauge label="Current Strength" value={currentStrength} />
          <Gauge label="Heat Generation" value={heatLevel} />
          <Gauge label="Current Limiting Effect" value={resistanceEffect} />
          <Gauge label="Energy Conversion" value={energyConversion} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[900px] sm:w-full"
          role="img"
          aria-label="Conventional current flow through resistor circuit"
        >
          <defs>
            <linearGradient id="lessonTwoHotBody" x1="0" x2="1" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor={isOverload ? "#7f1d1d" : "#f5e3b4"}
              />
              <stop
                offset="50%"
                stopColor={heatLevel > 0.55 ? "#ea8a00" : "#cf9954"}
              />
              <stop
                offset="100%"
                stopColor={heatLevel > 0.9 ? "#991b1b" : "#b3783a"}
              />
            </linearGradient>

            <filter
              id="lessonTwoResistorShadow"
              x="-40%"
              y="-60%"
              width="180%"
              height="240%"
            >
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation={isOverload ? "14" : "8"}
                floodColor={isOverload ? "#dc2626" : "#7c5a2d"}
                floodOpacity={isOverload ? "0.55" : "0.28"}
              />
            </filter>

            <filter
              id="lessonTwoLedGlow"
              x="-120%"
              y="-120%"
              width="340%"
              height="340%"
            >
              <feGaussianBlur stdDeviation="12" result="blur" />
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
              fontSize="15"
              fontWeight="800"
            >
              Conventional Current: + Terminal → Resistor → Load → 0V Return
            </text>

            {isLedMode ? (
              <text
                x={LABEL.subtitle.x}
                y={LABEL.subtitle.y}
                textAnchor="middle"
                fill="#475569"
                fontSize="12"
                fontWeight="700"
              >
                Supply Voltage = Resistor Voltage Drop + LED Forward Voltage
              </text>
            ) : null}

            <SourceBlock voltage={voltage} />

            <WirePath points={WIRE.sourceToResistor(bodyX)} width={wireWidth} />

            {isLedMode ? (
              <>
                <WirePath
                  points={WIRE.resistorToLed(bodyRightX, ledWireLeftX)}
                  width={wireWidth}
                />
                <WirePath
                  points={WIRE.ledToReturn(ledWireRightX)}
                  width={wireWidth}
                />
              </>
            ) : (
              <WirePath
                points={WIRE.resistorToReturn(bodyRightX)}
                width={wireWidth}
              />
            )}

            <WirePath points={WIRE.returnPath} width={wireWidth} />

            {!ledOff ? (
              <motion.path
                d={
                  isLedMode
                    ? `M140 152 H${bodyX} H${bodyRightX} H${ledWireLeftX} H${ledWireRightX} H${NODE.returnTop.x}`
                    : `M140 152 H${bodyX} H${bodyRightX} H${NODE.returnTop.x}`
                }
                stroke={STYLE.activeFlow}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ opacity: [0.15, 0.95, 0.15] }}
                transition={{ repeat: Infinity, duration: electronSpeed }}
              />
            ) : null}

            <text
              x={bodyX - 95}
              y={LABEL.resistorInput.y}
              textAnchor="middle"
              fill="#2563eb"
              fontSize="12"
              fontWeight="800"
            >
              Electrical Energy In
            </text>

            <text
              x={bodyX + selectedPackage.bodyWidth / 2}
              y={LABEL.resistorInput.y}
              textAnchor="middle"
              fill="#7c2d12"
              fontSize="12"
              fontWeight="900"
            >
              Resistance Opposes Flow
            </text>

            <text
              x={bodyX + selectedPackage.bodyWidth / 2}
              y={LABEL.heatOut.y}
              textAnchor="middle"
              fill="#dc2626"
              fontSize="12"
              fontWeight="900"
            >
              Heat Energy Out ↑
            </text>

            {Array.from({ length: conversionParticleCount }).map((_, index) => (
              <motion.circle
                key={`blue-energy-in-${index}`}
                r="3.6"
                fill={STYLE.activeFlow}
                stroke="#e0f2fe"
                strokeWidth="1.3"
                initial={{ offsetDistance: "0%", opacity: 0 }}
                animate={{
                  offsetDistance: "100%",
                  opacity: ledOff ? 0 : [0, 1, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: Math.max(0.65, electronSpeed * 0.85),
                  ease: "linear",
                  delay: index * (electronSpeed / conversionParticleCount),
                }}
                style={{ offsetPath: energyIntoResistorPath }}
              />
            ))}

            {Array.from({ length: conversionParticleCount }).map((_, index) => (
              <motion.circle
                key={`orange-energy-out-${index}`}
                cx={
                  bodyX + selectedPackage.bodyWidth / 2 + ((index % 5) - 2) * 16
                }
                cy={bodyY + 14}
                r="3.4"
                fill={heatLevel > 0.7 ? STYLE.danger : STYLE.heat}
                animate={{
                  y: ledOff || power <= 0 ? 0 : [-4, -72],
                  x: ledOff || power <= 0 ? 0 : [0, ((index % 3) - 1) * 10],
                  opacity: ledOff || power <= 0 ? 0 : [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2 + index * 0.03,
                  delay: index * 0.11,
                }}
              />
            ))}

            {Array.from({ length: congestionCount }).map((_, index) => (
              <motion.circle
                key={`congestion-${index}`}
                cx={bodyX - 18 - index * 8}
                cy={152 + ((index % 3) - 1) * 7}
                r={ledOff ? 1.8 : 2.8}
                fill={STYLE.activeFlow}
                animate={{
                  x: resistanceEffect > 0.4 ? [0, -4, 0] : [0, 2, 0],
                  opacity: ledOff ? 0.15 : [0.35, 1, 0.35],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + resistanceEffect,
                  delay: index * 0.05,
                }}
              />
            ))}

            <ResistorBody
              bodyX={bodyX}
              bodyY={bodyY}
              selectedPackage={selectedPackage}
              isOverload={isOverload}
              heatLevel={heatLevel}
              bandOneColor={bandOneColor}
              bandTwoColor={bandTwoColor}
              multiplierColor={multiplierColor}
              toleranceColor={toleranceColor}
            />

            {Array.from({ length: 5 }).map((_, index) => (
              <motion.path
                key={`heat-wave-${index}`}
                d={`M${bodyX + 70 + index * 38} 92 C${bodyX + 56 + index * 38} 70 ${
                  bodyX + 84 + index * 38
                } 62 ${bodyX + 70 + index * 38} 40`}
                stroke={heatLevel > 0.7 ? STYLE.danger : STYLE.heat}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                animate={{ opacity: heatLevel > 0.12 ? [0.12, 1, 0.12] : 0.05 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  delay: index * 0.12,
                }}
              />
            ))}

            {isLedMode ? (
              <LedLoad
                ledOff={ledOff}
                ledX={ledX}
                ledY={ledY}
                ledRadius={ledRadius}
                selectedLed={selectedLed}
                ledGlowOpacity={ledGlowOpacity}
              />
            ) : (
              <text
                x={NODE.returnTop.x - 10}
                y="104"
                textAnchor="end"
                fill="#475569"
                fontSize="12"
                fontWeight="700"
              >
                Complete 0V return path
              </text>
            )}

            {particleIndexes.map((index) => (
              <motion.circle
                key={`conventional-current-${mode}-${particleCount}-${index}`}
                r="4"
                fill={STYLE.current}
                stroke="#e0f2fe"
                strokeWidth="1.5"
                initial={{ offsetDistance: "0%", opacity: 0 }}
                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: electronSpeed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * (electronSpeed / Math.max(particleCount, 1)),
                }}
                style={{ offsetPath: conventionalCurrentPath }}
              />
            ))}

            <text
              x={LABEL.currentFlow.x}
              y={LABEL.currentFlow.y}
              textAnchor="middle"
              fill="#2563eb"
              fontSize="12"
              fontWeight="700"
            >
              Conventional current flow →
            </text>

            <text
              x={bodyX + selectedPackage.bodyWidth / 2}
              y="218"
              textAnchor="middle"
              fill="#7c2d12"
              fontSize="14"
              fontWeight="800"
            >
              Resistor drop = {displayVoltage(effectiveVoltageDrop)}
            </text>

            <text
              x={bodyX + selectedPackage.bodyWidth / 2}
              y="234"
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="12"
              fontWeight="800"
            >
              Blue current energy converts into orange heat energy
            </text>

            {isLedMode ? (
              <text
                x={ledX}
                y="248"
                textAnchor="middle"
                fill={ledOff ? "#64748b" : selectedLed.color}
                fontSize="14"
                fontWeight="800"
              >
                {selectedLed.label} = {displayVoltage(ledVoltageDrop)}
              </text>
            ) : null}

            <text
              x={LABEL.outputVoltage.x}
              y={LABEL.outputVoltage.y}
              textAnchor="start"
              fill={STYLE.text}
              fontSize="14"
              fontWeight="800"
            >
              {displayVoltage(outputVoltage)}
            </text>

            <text
              x={LABEL.returnReference.x}
              y={LABEL.returnReference.y}
              textAnchor="start"
              fill="#475569"
              fontSize="12"
              fontWeight="700"
            >
              0V Return Reference
            </text>

            {isOverload ? (
              <motion.g
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <rect
                  x="290"
                  y="286"
                  width="320"
                  height="42"
                  rx="14"
                  fill="#fee2e2"
                  stroke={STYLE.danger}
                  strokeWidth="2"
                />
                <text
                  x="450"
                  y="312"
                  textAnchor="middle"
                  fill={STYLE.danger}
                  fontSize="13"
                  fontWeight="900"
                >
                  Power rating exceeded.
                </text>
              </motion.g>
            ) : null}

            <g
              transform={`translate(${COMPONENT.heatBar.x} ${COMPONENT.heatBar.y})`}
            >
              <text
                x="0"
                y="0"
                fill={STYLE.muted}
                fontSize="12"
                fontWeight="700"
              >
                Heat from resistor power loss: P = I²R = {formatPower(power)}
              </text>

              <rect
                x="0"
                y="12"
                width={COMPONENT.heatBar.width}
                height={COMPONENT.heatBar.height}
                rx="6"
                fill="#e2e8f0"
              />

              <motion.rect
                x="0"
                y="12"
                height={COMPONENT.heatBar.height}
                rx="6"
                fill={
                  isOverload
                    ? STYLE.danger
                    : heatLevel > 0.75
                      ? STYLE.heat
                      : STYLE.safe
                }
                animate={{
                  width: COMPONENT.heatBar.width * clamp(loadRatio, 0, 1),
                }}
              />

              <text
                x={COMPONENT.heatBar.width}
                y="40"
                textAnchor="end"
                fill="#64748b"
                fontSize="11"
              >
                {formatNumber(loadRatio * 100, 1)}% of rating
              </text>
            </g>
          </g>
        </svg>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
            <p className="font-bold">Ohm&apos;s Law</p>
            <p className="mt-1">I = V ÷ R</p>
            <p className="font-bold">
              I = {displayVoltage(effectiveVoltageDrop)} ÷{" "}
              {formatResistance(safeResistance)} = {formatCurrent(current)}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-bold">Current Flow Conversion</p>
            <p className="mt-1">
              Blue current energy enters the resistor and becomes orange heat
              energy.
            </p>
            <p className="font-bold">P = V × I = {formatPower(power)}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-bold text-slate-950">{resistanceLabel}</p>
            <p className="mt-1">
              {safeResistance <= 220
                ? "Low resistance allows more conventional current to flow."
                : safeResistance <= 1000
                  ? "Medium resistance controls current safely."
                  : "High resistance strongly limits conventional current flow."}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="font-black text-blue-950">Key Learning</p>
          <p className="mt-1 text-sm leading-relaxed text-blue-900">
            This simulator uses <b>conventional current direction</b>: current
            flows from the positive terminal through the resistor/load and
            returns to 0V. A resistor controls that current and converts part of
            the electrical energy into heat.
          </p>
        </div>
      </div>
    </div>
  );
}
