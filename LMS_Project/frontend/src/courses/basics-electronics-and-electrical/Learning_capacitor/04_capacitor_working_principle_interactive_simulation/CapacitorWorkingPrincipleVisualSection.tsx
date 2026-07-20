"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import type { WorkingMode } from "./types";

type Props = {
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
  resistance: number;
  setResistance: (value: number) => void;
  capacitance: number;
  setCapacitance: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  maxTime: number;
  mode: WorkingMode;
  setMode: (value: WorkingMode) => void;
  timeConstant: number;
  chargeRatio: number;
  capacitorVoltage: number;
  current: number;
  resetSimulation: () => void;
};

const VIEW_BOX = "0 0 840 455";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 455;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  capacitor: 1,
  formulaPanel: 1,
  chargeBar: 1,
  energyBar: 1,
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
  positive: "#ef4444",
  electron: "#0ea5e9",
  field: "#8b5cf6",
  energy: "#22c55e",
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

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0";
}

function formatResistance(value: number) {
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, 2)} MΩ`;
  if (value >= 1_000) return `${formatNumber(value / 1_000, 2)} kΩ`;
  return `${formatNumber(value, 0)} Ω`;
}

function formatCapacitance(value: number) {
  if (value >= 0.001) return `${formatNumber(value * 1000, 2)} mF`;
  if (value >= 0.000001) return `${formatNumber(value * 1_000_000, 2)} µF`;
  if (value >= 0.000000001) {
    return `${formatNumber(value * 1_000_000_000, 2)} nF`;
  }
  return `${formatNumber(value, 6)} F`;
}

function formatCurrent(value: number) {
  if (value >= 1) return `${formatNumber(value, 2)} A`;
  if (value >= 0.001) return `${formatNumber(value * 1000, 2)} mA`;
  return `${formatNumber(value * 1_000_000, 2)} µA`;
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
    y: 72,
    width: 79,
    height: 155,
    rotate: 0,
  },

  formulaPanel: {
    x: 270,
    y: 272,
    width: 300,
    height: 38,
    rotate: 0,
  },

  chargeBar: {
    x: 160,
    y: 366,
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
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
  ),
  capacitor: scaleComponent(
    BASE_COMPONENT.capacitor,
    CIRCUIT_COMPONENT_SCALE.capacitor,
  ),
  formulaPanel: scaleComponent(
    BASE_COMPONENT.formulaPanel,
    CIRCUIT_COMPONENT_SCALE.formulaPanel,
  ),
  chargeBar: scaleComponent(
    BASE_COMPONENT.chargeBar,
    CIRCUIT_COMPONENT_SCALE.chargeBar,
  ),
  energyBar: scaleComponent(
    BASE_COMPONENT.energyBar,
    CIRCUIT_COMPONENT_SCALE.energyBar,
  ),
} as const;

const NODE = {
  batteryPositive: pointOnComponent(COMPONENT.battery, 0.5, 0),
  batteryNegative: pointOnComponent(COMPONENT.battery, 0.5, 1),

  circuitY: { x: 0, y: 142 },
  bottomBus: { x: 0, y: 320 },
  rightDrop: { x: 690, y: 142 },

  resistorLeft: pointOnComponent(COMPONENT.resistor, 0, 0.5),
  resistorRight: pointOnComponent(COMPONENT.resistor, 1, 0.5),
  resistorCenter: pointOnComponent(COMPONENT.resistor, 0.5, 0.5),

  positivePlateTop: pointOnComponent(COMPONENT.capacitor, 0, 0),
  positivePlateBottom: pointOnComponent(COMPONENT.capacitor, 0, 1),
  negativePlateTop: pointOnComponent(COMPONENT.capacitor, 0.82, 0),
  negativePlateBottom: pointOnComponent(COMPONENT.capacitor, 0.82, 1),

  positivePlateTerminal: pointOnComponent(COMPONENT.capacitor, 0, 0.45),
  negativePlateTerminal: pointOnComponent(COMPONENT.capacitor, 1, 0.45),

  capacitorCenter: pointOnComponent(COMPONENT.capacitor, 0.41, 0.5),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  chargeBatteryPositiveToResistor: [
    NODE.batteryPositive,
    { x: NODE.batteryPositive.x, y: NODE.circuitY.y },
    NODE.resistorLeft,
  ],

  resistorToPositivePlate: [NODE.resistorRight, NODE.positivePlateTerminal],

  chargeNegativePlateToBatteryNegative: [
    NODE.negativePlateTerminal,
    NODE.rightDrop,
    { x: NODE.rightDrop.x, y: NODE.bottomBus.y },
    { x: NODE.batteryNegative.x, y: NODE.bottomBus.y },
    NODE.batteryNegative,
  ],

  dischargeLoop: [
    NODE.negativePlateTerminal,
    NODE.rightDrop,
    { x: NODE.rightDrop.x, y: NODE.bottomBus.y },
    { x: NODE.resistorLeft.x, y: NODE.bottomBus.y },
    NODE.resistorLeft,
    NODE.resistorRight,
    NODE.positivePlateTerminal,
  ],
} as const;

const PATH = {
  chargingElectronToNegativePlate: pathD(
    WIRE.chargeNegativePlateToBatteryNegative,
  ),
  chargingElectronFromPositivePlate: pathD([
    NODE.positivePlateTerminal,
    NODE.resistorRight,
    NODE.resistorLeft,
    { x: NODE.batteryPositive.x, y: NODE.circuitY.y },
    NODE.batteryPositive,
  ]),
  dischargingElectron: pathD(WIRE.dischargeLoop),
} as const;

const LABEL = {
  title: { x: 420, y: 42 },
  resistorValue: { x: NODE.resistorCenter.x, y: NODE.resistorCenter.y + 58 },
  capacitance: { x: NODE.capacitorCenter.x, y: 63 },
  capacitorVoltage: { x: NODE.capacitorCenter.x, y: 252 },
  positivePlate: { x: NODE.positivePlateTop.x - 34, y: 100 },
  negativePlate: { x: NODE.negativePlateTop.x + 22, y: 100 },
  formula: { x: 420, y: 297 },
  summary: { x: 420, y: 330 },
} as const;

export function CapacitorWorkingPrincipleVisualSection({
  supplyVoltage,
  setSupplyVoltage,
  resistance,
  setResistance,
  capacitance,
  setCapacitance,
  time,
  setTime,
  maxTime,
  mode,
  setMode,
  timeConstant,
  chargeRatio,
  capacitorVoltage,
  current,
  resetSimulation,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        supplyVoltage={supplyVoltage}
        setSupplyVoltage={setSupplyVoltage}
        resistance={resistance}
        setResistance={setResistance}
        capacitance={capacitance}
        setCapacitance={setCapacitance}
        time={time}
        setTime={setTime}
        maxTime={maxTime}
        mode={mode}
        setMode={setMode}
        timeConstant={timeConstant}
        resetSimulation={resetSimulation}
      />

      <div className="lg:col-span-2">
        <CapacitorWorkingVisual
          supplyVoltage={supplyVoltage}
          resistance={resistance}
          capacitance={capacitance}
          time={time}
          timeConstant={timeConstant}
          chargeRatio={chargeRatio}
          capacitorVoltage={capacitorVoltage}
          current={current}
          mode={mode}
        />
      </div>
    </div>
  );
}

function BatteryBlock({
  svgId,
  voltage,
  mode,
}: {
  svgId: string;
  voltage: number;
  mode: WorkingMode;
}) {
  return (
    <g opacity={mode === "charging" ? 1 : 0.35}>
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
        fill={STYLE.positive}
        stroke="#ffffff"
        strokeWidth="2"
      />

      <circle
        cx={NODE.batteryNegative.x}
        cy={NODE.batteryNegative.y}
        r="5.5"
        fill={STYLE.charge}
        stroke="#ffffff"
        strokeWidth="2"
      />

      <text
        x={NODE.batteryPositive.x + 34}
        y={NODE.batteryPositive.y - 8}
        fill={STYLE.discharge}
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

function WirePath({
  points,
  wireWidth,
  opacity = 1,
  stroke = STYLE.wire,
}: {
  points: readonly Point[];
  wireWidth: number;
  opacity?: number;
  stroke?: string;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={stroke}
      strokeWidth={wireWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
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
      <motion.g filter={`url(#${svgId}-shadow)`}>
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
  chargeRatio,
  fieldLineCount,
  plateCharges,
}: {
  svgId: string;
  capacitance: number;
  capacitorVoltage: number;
  chargeRatio: number;
  fieldLineCount: number;
  plateCharges: number[];
}) {
  return (
    <g>
      <motion.rect
        x={NODE.positivePlateTop.x}
        y={NODE.positivePlateTop.y}
        width="14"
        height={COMPONENT.capacitor.height}
        rx="5"
        fill={STYLE.positive}
        filter={`url(#${svgId}-plateGlow)`}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />

      <motion.rect
        x={NODE.negativePlateTop.x}
        y={NODE.negativePlateTop.y}
        width="14"
        height={COMPONENT.capacitor.height}
        rx="5"
        fill={STYLE.charge}
        filter={`url(#${svgId}-plateGlow)`}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />

      {plateCharges.map((index) => {
        const y =
          NODE.positivePlateTop.y +
          14 +
          index *
            ((COMPONENT.capacitor.height - 28) /
              Math.max(plateCharges.length - 1, 1));

        return (
          <g key={`plate-charge-${index}`}>
            <text
              x={NODE.positivePlateTop.x - 12}
              y={y + 4}
              textAnchor="middle"
              fill="#dc2626"
              fontSize="11"
              fontWeight="900"
            >
              +
            </text>

            <circle
              cx={NODE.negativePlateTop.x + 26}
              cy={y}
              r="3"
              fill={STYLE.electron}
            />
          </g>
        );
      })}

      {Array.from({ length: fieldLineCount }).map((_, index) => {
        const y =
          NODE.positivePlateTop.y +
          18 +
          index *
            ((COMPONENT.capacitor.height - 36) /
              Math.max(fieldLineCount - 1, 1));

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
              x1={NODE.positivePlateTop.x + 22}
              y1={y}
              x2={NODE.negativePlateTop.x - 8}
              y2={y}
              stroke={STYLE.field}
              strokeWidth="2.3"
              strokeLinecap="round"
            />
            <polygon
              points={`${NODE.negativePlateTop.x - 8},${y} ${
                NODE.negativePlateTop.x - 16
              },${y - 4} ${NODE.negativePlateTop.x - 16},${y + 4}`}
              fill={STYLE.field}
            />
          </motion.g>
        );
      })}

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
        x={LABEL.positivePlate.x}
        y={LABEL.positivePlate.y}
        fill="#dc2626"
        fontSize="12"
        fontWeight="900"
      >
        + plate
      </text>

      <text
        x={LABEL.negativePlate.x}
        y={LABEL.negativePlate.y}
        fill={STYLE.charge}
        fontSize="12"
        fontWeight="900"
      >
        − plate
      </text>
    </g>
  );
}

function ParticleFlow({
  mode,
  particles,
  halfParticles,
  particleSpeed,
  particleCount,
}: {
  mode: WorkingMode;
  particles: number[];
  halfParticles: number[];
  particleSpeed: number;
  particleCount: number;
}) {
  return (
    <g>
      {mode === "charging" &&
        particles.map((index) => (
          <circle
            key={`charge-electron-to-negative-${index}`}
            r="3.4"
            fill={STYLE.electron}
            stroke="#e0f2fe"
            strokeWidth="1.2"
          >
            <animateMotion
              dur={`${particleSpeed}s`}
              repeatCount="indefinite"
              path={PATH.chargingElectronToNegativePlate}
              begin={`${index * (particleSpeed / particleCount)}s`}
            />
          </circle>
        ))}

      {mode === "charging" &&
        halfParticles.map((index) => (
          <circle
            key={`charge-electron-from-positive-${index}`}
            r="3.1"
            fill={STYLE.discharge}
            stroke="#ffedd5"
            strokeWidth="1.1"
          >
            <animateMotion
              dur={`${particleSpeed}s`}
              repeatCount="indefinite"
              path={PATH.chargingElectronFromPositivePlate}
              begin={`${index * (particleSpeed / Math.max(halfParticles.length, 1))}s`}
            />
          </circle>
        ))}

      {mode === "discharging" &&
        particles.map((index) => (
          <circle
            key={`discharge-electron-${index}`}
            r="3.4"
            fill={STYLE.discharge}
            stroke="#ffedd5"
            strokeWidth="1.2"
          >
            <animateMotion
              dur={`${particleSpeed}s`}
              repeatCount="indefinite"
              path={PATH.dischargingElectron}
              begin={`${index * (particleSpeed / particleCount)}s`}
            />
          </circle>
        ))}
    </g>
  );
}

function FormulaPanel({
  svgId,
  time,
  tau,
  current,
}: {
  svgId: string;
  time: number;
  tau: number;
  current: number;
}) {
  return (
    <g>
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
          τ = R × C · E = ½CV²
        </text>

        <line
          x1="300"
          y1="305"
          x2="540"
          y2="305"
          stroke={STYLE.field}
          strokeWidth="2"
          opacity="0.45"
        />
      </g>

      <text
        x={LABEL.summary.x}
        y={LABEL.summary.y}
        textAnchor="middle"
        fill={STYLE.muted}
        fontSize="12"
        fontWeight="800"
      >
        t = {formatNumber(time, 2)}s · τ = {formatNumber(tau, 3)}s · I ={" "}
        {formatCurrent(Math.abs(current))}
      </text>
    </g>
  );
}

function LevelBars({
  chargeRatio,
  storedEnergyLevel,
}: {
  chargeRatio: number;
  storedEnergyLevel: number;
}) {
  return (
    <g>
      <g
        transform={`translate(${COMPONENT.chargeBar.x} ${COMPONENT.chargeBar.y})`}
      >
        <text x="0" y="-10" fill={STYLE.text} fontSize="14" fontWeight="900">
          Charge Level
        </text>

        <rect
          x="0"
          y="8"
          width={COMPONENT.chargeBar.width}
          height={COMPONENT.chargeBar.height}
          rx="7"
          fill="#e2e8f0"
        />

        <motion.rect
          x="0"
          y="8"
          height={COMPONENT.chargeBar.height}
          rx="7"
          fill={STYLE.field}
          animate={{ width: COMPONENT.chargeBar.width * chargeRatio }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />

        <text
          x={COMPONENT.chargeBar.width}
          y="46"
          textAnchor="end"
          fill="#475569"
          fontSize="12"
          fontWeight="700"
        >
          {formatNumber(chargeRatio * 100, 1)}% charged
        </text>
      </g>

      <g
        transform={`translate(${COMPONENT.energyBar.x} ${COMPONENT.energyBar.y})`}
      >
        <text x="0" y="-10" fill={STYLE.text} fontSize="13" fontWeight="900">
          Stored Energy
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

function CapacitorWorkingVisual({
  supplyVoltage,
  resistance,
  capacitance,
  time,
  timeConstant,
  chargeRatio,
  capacitorVoltage,
  current,
  mode,
}: {
  supplyVoltage: number;
  resistance: number;
  capacitance: number;
  time: number;
  timeConstant: number;
  chargeRatio: number;
  capacitorVoltage: number;
  current: number;
  mode: WorkingMode;
}) {
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
  const safeTime = Math.max(Number.isFinite(time) ? time : 0, 0);
  const safeTau = Math.max(Number.isFinite(timeConstant) ? timeConstant : 0, 0);
  const safeCharge = clampValue(
    Number.isFinite(chargeRatio) ? chargeRatio : 0,
    0,
    1,
  );
  const safeVc = Number.isFinite(capacitorVoltage) ? capacitorVoltage : 0;
  const safeCurrent = Number.isFinite(current) ? current : 0;

  const maxCurrent = Math.max(
    Math.abs(safeVoltage) / safeResistance,
    MIN_CURRENT_BASE,
  );

  const flowLevel = clampValue(Math.abs(safeCurrent) / maxCurrent, 0.04, 1);
  const particleCount = clampValue(Math.round(flowLevel * 22), 4, 26);
  const particleSpeed = clampValue(2.8 - flowLevel * 1.7, 0.65, 2.9);
  const wireWidth = WIRE.width + flowLevel * 4;
  const fieldLineCount = clampValue(Math.round(safeCharge * 12), 3, 12);
  const storedEnergyLevel = clampValue(safeCharge * safeCharge, 0.03, 1);
  const plateChargeCount = clampValue(Math.round(safeCharge * 12), 2, 12);

  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => index),
    [particleCount],
  );

  const halfParticles = useMemo(
    () => particles.slice(0, Math.max(3, Math.floor(particles.length / 2))),
    [particles],
  );

  const plateCharges = useMemo(
    () => Array.from({ length: plateChargeCount }, (_, index) => index),
    [plateChargeCount],
  );

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Capacitor Working Principle Visualizer
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Electrons never cross the dielectric. Charging separates charge on
            the plates; discharging moves electrons from the negative plate
            through the resistor to the positive plate.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            mode === "charging"
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {mode === "charging" ? "CHARGING" : "DISCHARGING"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-2">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[840px] sm:w-full"
          role="img"
          aria-label="Capacitor charging and discharging working principle"
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
                stdDeviation={3 + safeCharge * 10}
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
                stopColor={flowLevel > 0.5 ? "#fb923c" : "#e8b95d"}
              />
              <stop offset="100%" stopColor="#dca843" />
            </linearGradient>
          </defs>

          <rect x="8" y="10" width="824" height="430" rx="20" fill="#f8fafc" />

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="14"
              fontWeight="900"
            >
              {mode === "charging"
                ? "Charging: e− from battery − to − plate, and e− from + plate to battery +"
                : "Discharging: e− from − plate → resistor → + plate; battery path is inactive"}
            </text>

            <WirePath
              points={WIRE.chargeBatteryPositiveToResistor}
              wireWidth={wireWidth}
              opacity={mode === "charging" ? 1 : 0.25}
            />

            <WirePath
              points={WIRE.resistorToPositivePlate}
              wireWidth={wireWidth}
            />

            <WirePath
              points={WIRE.chargeNegativePlateToBatteryNegative}
              wireWidth={wireWidth}
              opacity={mode === "charging" ? 1 : 0.25}
            />

            {mode === "discharging" && (
              <WirePath
                points={WIRE.dischargeLoop}
                wireWidth={wireWidth}
                stroke={STYLE.discharge}
                opacity={0.95}
              />
            )}

            <BatteryBlock svgId={svgId} voltage={safeVoltage} mode={mode} />

            <ResistorBlock
              svgId={svgId}
              resistance={safeResistance}
              flowLevel={flowLevel}
            />

            <CapacitorBlock
              svgId={svgId}
              capacitance={safeCapacitance}
              capacitorVoltage={safeVc}
              chargeRatio={safeCharge}
              fieldLineCount={fieldLineCount}
              plateCharges={plateCharges}
            />

            <ParticleFlow
              mode={mode}
              particles={particles}
              halfParticles={halfParticles}
              particleSpeed={particleSpeed}
              particleCount={particleCount}
            />

            <FormulaPanel
              svgId={svgId}
              time={safeTime}
              tau={safeTau}
              current={safeCurrent}
            />

            <LevelBars
              chargeRatio={safeCharge}
              storedEnergyLevel={storedEnergyLevel}
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
