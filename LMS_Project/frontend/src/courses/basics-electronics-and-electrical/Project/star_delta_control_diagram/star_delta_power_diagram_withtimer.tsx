"use client";

import { useEffect, useState } from "react";

import ContactorPowerContacts3P from "../library/contactors/ContactorPowerContacts3P";
import ACMotor3P6Terminal from "../library/motors/ACMotor3P6Terminal";
import CircuitBreaker3P from "../library/protection/CircuitBreaker3P";
import ThermalOverloadRelay3P from "../library/protection/ThermalOverloadRelay3P";

type StarDeltaPowerDiagramWithTimerProps = {
  className?: string;
  mcbOn?: boolean;
  overloadTripped?: boolean;
  mainOn?: boolean;
  starOn?: boolean;
  deltaOn?: boolean;
  transferOpen?: boolean;
  loadPercent?: number;
};

type WireState = "active" | "inactive" | "fault";
type MotorMode = "star" | "transfer" | "delta" | "idle";

const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 1176;
const VIEW_BOX = `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  mccb: 2.4,
  k1: 2.4,
  k2: 2.4,
  k3: 2.4,
  ol1: 2.4,
  ol2: 2.4,
  motor: 2.3,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  l1: "#c56b1f",
  l2: "#111111",
  l3: "#7c7c7c",
  active: "#16a34a",
  inactive: "#cbd5e1",
  fault: "#dc2626",
  electron: "#fde047",
  electronFault: "#f87171",
  text: "#111111",
  blue: "#1d4ed8",
  board: "#ffffff",
  border: "#d1dae5",
  muted: "#64748b",
  transfer: "#d97706",
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  activeWidth: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE + 1,
} as const;

const ELECTRON = {
  radius: 3.2,
  blur: 2.2,
  stagger: [0, 0.35, 0.7],
} as const;

const BOARD = {
  x: 28,
  y: 28,
  width: 704,
  height: 1120,
} as const;

const NODE = {
  lineStartX: 70,
  lineEndX: 660,
  labelX: 18,

  l1Y: 72,
  l2Y: 112,
  l3Y: 152,

  mccb: { x: 108, y: 198 },
  k1: { x: 96, y: 430 },
  k2: { x: 366, y: 430 },
  k3: { x: 566, y: 430 },
  ol1: { x: 96, y: 640 },
  ol2: { x: 366, y: 640 },
  motor: { x: 230, y: 810 },

  mccbTopY: 210,
  mccbBottomY: 330,

  k1TopY: 430,
  k1BottomY: 550,
  k2TopY: 430,
  k2BottomY: 550,
  k3TopY: 430,
  k3BottomY: 550,

  k3StarBusY: 338,

  ol1TopY: 640,
  ol1BottomY: 760,
  ol2TopY: 640,
  ol2BottomY: 760,

  motorLeftTerminalX: 242,
  motorRightTerminalX: 338,

  motorU1Y: 830,
  motorV1Y: 876,
  motorW1Y: 922,
  motorU2Y: 830,
  motorV2Y: 875,
  motorW2Y: 922,

  k1ToK2UpperRowY: 360,
  k1ToK2MiddleRowY: 392,
  k1ToK2LowerRowY: 424,

  k3ToOl2Row1Y: 604,
  k3ToOl2Row2Y: 628,
  k3ToOl2Row3Y: 652,
} as const;

const COLUMN = {
  mccb: [120, 168, 216],
  k1: [120, 168, 216],
  k2: [390, 438, 486],
  k3: [590, 638, 686],
} as const;

const COMPONENT = {
  mccb: { ...NODE.mccb, scale: CIRCUIT_COMPONENT_SCALE.mccb },
  k1: { ...NODE.k1, scale: CIRCUIT_COMPONENT_SCALE.k1 },
  k2: { ...NODE.k2, scale: CIRCUIT_COMPONENT_SCALE.k2 },
  k3: { ...NODE.k3, scale: CIRCUIT_COMPONENT_SCALE.k3 },
  ol1: { ...NODE.ol1, scale: CIRCUIT_COMPONENT_SCALE.ol1 },
  ol2: { ...NODE.ol2, scale: CIRCUIT_COMPONENT_SCALE.ol2 },
  motor: { ...NODE.motor, scale: CIRCUIT_COMPONENT_SCALE.motor },
} as const;

const PATH = {
  main: [
    `M ${COLUMN.mccb[0]} ${NODE.l1Y} V ${NODE.mccbBottomY} V ${NODE.k1TopY} V ${NODE.k1BottomY} V ${NODE.ol1TopY} V ${NODE.ol1BottomY} V ${NODE.motorU1Y} H ${NODE.motorLeftTerminalX}`,
    `M ${COLUMN.mccb[1]} ${NODE.l2Y} V ${NODE.mccbBottomY} V ${NODE.k1TopY} V ${NODE.k1BottomY} V ${NODE.ol1TopY} V ${NODE.ol1BottomY} V ${NODE.motorV1Y} H ${NODE.motorLeftTerminalX}`,
    `M ${COLUMN.mccb[2]} ${NODE.l3Y} V ${NODE.mccbBottomY} V ${NODE.k1TopY} V ${NODE.k1BottomY} V ${NODE.ol1TopY} V ${NODE.ol1BottomY} V ${NODE.motorW1Y} H ${NODE.motorLeftTerminalX}`,
  ],

  delta: [
    `M ${COLUMN.k1[2]} ${NODE.mccbBottomY} V ${NODE.k1ToK2LowerRowY} H ${COLUMN.k2[0]} V ${NODE.k2BottomY} V ${NODE.ol2TopY} V ${NODE.ol2BottomY} V ${NODE.motorU2Y} H ${NODE.motorRightTerminalX}`,
    `M ${COLUMN.k1[1]} ${NODE.mccbBottomY} V ${NODE.k1ToK2MiddleRowY} H ${COLUMN.k2[1]} V ${NODE.k2BottomY} V ${NODE.ol2TopY} V ${NODE.ol2BottomY} V ${NODE.motorV2Y} H ${NODE.motorRightTerminalX}`,
    `M ${COLUMN.k1[0]} ${NODE.mccbBottomY} V ${NODE.k1ToK2UpperRowY} H ${COLUMN.k2[2]} V ${NODE.k2BottomY} V ${NODE.ol2TopY} V ${NODE.ol2BottomY} V ${NODE.motorW2Y} H ${NODE.motorRightTerminalX}`,
  ],

  star: [
    `M ${COLUMN.k3[0]} ${NODE.k3StarBusY} V ${NODE.k3BottomY} V ${NODE.k3ToOl2Row1Y} H ${COLUMN.k2[0]} V ${NODE.ol2TopY} V ${NODE.ol2BottomY} V ${NODE.motorU2Y} H ${NODE.motorRightTerminalX}`,
    `M ${COLUMN.k3[1]} ${NODE.k3StarBusY} V ${NODE.k3BottomY} V ${NODE.k3ToOl2Row2Y} H ${COLUMN.k2[1]} V ${NODE.ol2TopY} V ${NODE.ol2BottomY} V ${NODE.motorV2Y} H ${NODE.motorRightTerminalX}`,
    `M ${COLUMN.k3[2]} ${NODE.k3StarBusY} V ${NODE.k3BottomY} V ${NODE.k3ToOl2Row3Y} H ${COLUMN.k2[2]} V ${NODE.ol2TopY} V ${NODE.ol2BottomY} V ${NODE.motorW2Y} H ${NODE.motorRightTerminalX}`,
  ],

  trip: [
    `M ${COLUMN.mccb[0]} ${NODE.l1Y} V ${NODE.mccbBottomY} V ${NODE.k1TopY} V ${NODE.k1BottomY} V ${NODE.ol1TopY}`,
    `M ${COLUMN.mccb[1]} ${NODE.l2Y} V ${NODE.mccbBottomY} V ${NODE.k1TopY} V ${NODE.k1BottomY} V ${NODE.ol1TopY}`,
    `M ${COLUMN.mccb[2]} ${NODE.l3Y} V ${NODE.mccbBottomY} V ${NODE.k1TopY} V ${NODE.k1BottomY} V ${NODE.ol1TopY}`,
  ],
} as const;

const PHASE = [
  { label: "L1", color: STYLE.l1, y: NODE.l1Y },
  { label: "L2", color: STYLE.l2, y: NODE.l2Y },
  { label: "L3", color: STYLE.l3, y: NODE.l3Y },
] as const;

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function resolveActiveColor(state: WireState) {
  if (state === "fault") return STYLE.fault;
  if (state === "active") return STYLE.active;
  return STYLE.inactive;
}

function ActivePath({ d, state }: { d: string; state: WireState }) {
  if (state === "inactive") return null;

  return (
    <path
      d={d}
      fill="none"
      stroke={resolveActiveColor(state)}
      strokeWidth={WIRE.activeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.95}
    />
  );
}

function WirePath({ d, stroke }: { d: string; stroke: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function WireLine({
  x1,
  y1,
  x2,
  y2,
  stroke,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
    />
  );
}

function ElectronFlow({
  path,
  active,
  fault = false,
  duration = 2.8,
}: {
  path: string;
  active: boolean;
  fault?: boolean;
  duration?: number;
}) {
  if (!active) return null;

  return (
    <>
      {ELECTRON.stagger.map((begin) => (
        <circle
          key={`${path}-${begin}`}
          r={ELECTRON.radius}
          fill={fault ? STYLE.electronFault : STYLE.electron}
          filter="url(#electron-glow-star-delta-power)"
        >
          <animateMotion
            path={path}
            dur={`${duration}s`}
            begin={`${begin}s`}
            repeatCount="indefinite"
            calcMode="linear"
          />
        </circle>
      ))}
    </>
  );
}

function MotorRotationOverlay({
  spinLevel,
  mode,
  loadPercent,
}: {
  spinLevel: number;
  mode: MotorMode;
  loadPercent: number;
}) {
  const loadFactor = Math.min(1.5, Math.max(0, loadPercent) / 100);
  const baseDuration =
    mode === "delta"
      ? 0.9
      : mode === "star"
        ? 1.8
        : mode === "transfer"
          ? 3.2
          : 4.5;

  const duration =
    spinLevel > 0.02
      ? baseDuration * (1 + loadFactor * (mode === "delta" ? 0.55 : 0.8))
      : baseDuration;

  const accent =
    mode === "delta"
      ? STYLE.active
      : mode === "star"
        ? "#2563eb"
        : mode === "transfer"
          ? STYLE.transfer
          : "#94a3b8";

  return (
    <g
      transform={`translate(${COMPONENT.motor.x}, ${COMPONENT.motor.y}) scale(${COMPONENT.motor.scale}) rotate(-90 29 30)`}
    >
      <circle
        cx="29"
        cy="30"
        r="8"
        fill="none"
        stroke={accent}
        strokeWidth="0.9"
        opacity={0.3 + spinLevel * 0.65}
      />
      <path
        d="M29 22 L33 30 L29 29 L25 30 Z"
        fill={accent}
        opacity={0.3 + spinLevel * 0.65}
      >
        {spinLevel > 0.02 && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 29 30"
            to="360 29 30"
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        )}
      </path>
    </g>
  );
}

function ActivePathLayer({
  mainState,
  starState,
  deltaState,
  tripState,
}: {
  mainState: WireState;
  starState: WireState;
  deltaState: WireState;
  tripState: WireState;
}) {
  return (
    <>
      {PATH.main.map((path) => (
        <ActivePath key={path} d={path} state={mainState} />
      ))}
      {PATH.delta.map((path) => (
        <ActivePath key={path} d={path} state={deltaState} />
      ))}
      {PATH.star.map((path) => (
        <ActivePath key={path} d={path} state={starState} />
      ))}
      {PATH.trip.map((path) => (
        <ActivePath key={path} d={path} state={tripState} />
      ))}
    </>
  );
}

function FlowLayer({
  mcbOn,
  overloadTripped,
  mainOn,
  starOn,
  deltaOn,
  tripState,
}: {
  mcbOn: boolean;
  overloadTripped: boolean;
  mainOn: boolean;
  starOn: boolean;
  deltaOn: boolean;
  tripState: WireState;
}) {
  return (
    <>
      {PATH.main.map((path, index) => (
        <ElectronFlow
          key={`main-flow-${path}`}
          path={path}
          active={mainOn && !overloadTripped && mcbOn}
          duration={3.1 + index * 0.15}
        />
      ))}

      {PATH.delta.map((path, index) => (
        <ElectronFlow
          key={`delta-flow-${path}`}
          path={path}
          active={deltaOn && !overloadTripped && mcbOn}
          duration={2.7 + index * 0.15}
        />
      ))}

      {PATH.star.map((path, index) => (
        <ElectronFlow
          key={`star-flow-${path}`}
          path={path}
          active={starOn && !overloadTripped && mcbOn}
          duration={2.7 + index * 0.15}
        />
      ))}

      {PATH.trip.map((path, index) => (
        <ElectronFlow
          key={`trip-flow-${path}`}
          path={path}
          active={tripState === "fault"}
          fault
          duration={2.2 + index * 0.15}
        />
      ))}
    </>
  );
}

function SupplyRails() {
  return (
    <>
      {PHASE.map((phase, index) => (
        <g key={phase.label}>
          <text
            x={NODE.labelX}
            y={phase.y + 8}
            fontSize="18"
            fontWeight="700"
            fill={STYLE.text}
          >
            {phase.label}
          </text>

          <WireLine
            x1={NODE.lineStartX}
            y1={phase.y}
            x2={NODE.lineEndX}
            y2={phase.y}
            stroke={phase.color}
          />

          <WireLine
            x1={COLUMN.mccb[index]}
            y1={phase.y}
            x2={COLUMN.mccb[index]}
            y2={NODE.mccbTopY}
            stroke={phase.color}
          />
        </g>
      ))}
    </>
  );
}

function BreakerSection({ mcbOn }: { mcbOn: boolean }) {
  return (
    <>
      <CircuitBreaker3P
        x={COMPONENT.mccb.x}
        y={COMPONENT.mccb.y}
        scale={COMPONENT.mccb.scale}
        on={mcbOn}
        label=""
        standalone={false}
        strokeColor="#f97316"
        orientation="vertical"
      />

      <text x="8" y="236" fontSize="16" fontWeight="700" fill={STYLE.text}>
        3P MCCB
      </text>

      {["1", "3", "5"].map((label, index) => (
        <text
          key={`mccb-top-${label}`}
          x={COLUMN.mccb[index] + 4}
          y="246"
          fontSize="12"
          fontWeight="700"
          fill={STYLE.text}
        >
          {label}
        </text>
      ))}

      {["2", "4", "6"].map((label, index) => (
        <text
          key={`mccb-bottom-${label}`}
          x={COLUMN.mccb[index] + 4}
          y="330"
          fontSize="12"
          fontWeight="700"
          fill={STYLE.text}
        >
          {label}
        </text>
      ))}

      {PHASE.map((phase, index) => (
        <WireLine
          key={`mccb-to-k1-${phase.label}`}
          x1={COLUMN.k1[index]}
          y1={NODE.mccbBottomY}
          x2={COLUMN.k1[index]}
          y2={NODE.k1TopY}
          stroke={phase.color}
        />
      ))}
    </>
  );
}

function ContactorsSection({
  mainOn,
  starOn,
  deltaOn,
}: {
  mainOn: boolean;
  starOn: boolean;
  deltaOn: boolean;
}) {
  return (
    <>
      <ContactorPowerContacts3P
        x={COMPONENT.k1.x}
        y={COMPONENT.k1.y}
        scale={COMPONENT.k1.scale}
        closed={mainOn}
        label=""
        showCoilSymbol={false}
        standalone={false}
      />

      <ContactorPowerContacts3P
        x={COMPONENT.k2.x}
        y={COMPONENT.k2.y}
        scale={COMPONENT.k2.scale}
        closed={deltaOn}
        label=""
        showCoilSymbol={false}
        standalone={false}
      />

      <ContactorPowerContacts3P
        x={COMPONENT.k3.x}
        y={COMPONENT.k3.y}
        scale={COMPONENT.k3.scale}
        closed={starOn}
        label=""
        showCoilSymbol={false}
        standalone={false}
      />

      <text x="36" y="434" fontSize="16" fontWeight="700" fill={STYLE.text}>
        K1
      </text>
      <text x="36" y="462" fontSize="14" fontWeight="700" fill={STYLE.blue}>
        MAIN
      </text>

      <text x="350" y="434" fontSize="16" fontWeight="700" fill={STYLE.text}>
        K2
      </text>
      <text x="350" y="462" fontSize="14" fontWeight="700" fill={STYLE.blue}>
        DELTA
      </text>

      <text x="550" y="434" fontSize="16" fontWeight="700" fill={STYLE.text}>
        K3
      </text>
      <text x="550" y="462" fontSize="14" fontWeight="700" fill={STYLE.blue}>
        STAR
      </text>
    </>
  );
}

function StaticPowerWires() {
  return (
    <>
      <WirePath
        d={`M ${COLUMN.k1[2]} ${NODE.mccbBottomY} V ${NODE.k1ToK2LowerRowY} H ${COLUMN.k2[0]} V ${NODE.k2TopY}`}
        stroke={STYLE.l1}
      />
      <WirePath
        d={`M ${COLUMN.k1[1]} ${NODE.mccbBottomY} V ${NODE.k1ToK2MiddleRowY} H ${COLUMN.k2[1]} V ${NODE.k2TopY}`}
        stroke={STYLE.l2}
      />
      <WirePath
        d={`M ${COLUMN.k1[0]} ${NODE.mccbBottomY} V ${NODE.k1ToK2UpperRowY} H ${COLUMN.k2[2]} V ${NODE.k2TopY}`}
        stroke={STYLE.l3}
      />

      {PHASE.map((phase, index) => (
        <WireLine
          key={`k1-to-ol1-${phase.label}`}
          x1={COLUMN.k1[index]}
          y1={NODE.k1BottomY}
          x2={COLUMN.k1[index]}
          y2={NODE.ol1TopY}
          stroke={phase.color}
        />
      ))}

      {PHASE.map((phase, index) => (
        <WireLine
          key={`k2-to-ol2-${phase.label}`}
          x1={COLUMN.k2[index]}
          y1={NODE.k2BottomY}
          x2={COLUMN.k2[index]}
          y2={NODE.ol2TopY}
          stroke={phase.color}
        />
      ))}

      {PHASE.map((phase, index) => (
        <WireLine
          key={`k3-top-${phase.label}`}
          x1={COLUMN.k3[index]}
          y1={NODE.k3StarBusY}
          x2={COLUMN.k3[index]}
          y2={NODE.k3TopY}
          stroke={phase.color}
        />
      ))}

      <WireLine
        x1={COLUMN.k3[0]}
        y1={NODE.k3StarBusY}
        x2={COLUMN.k3[2]}
        y2={NODE.k3StarBusY}
        stroke={STYLE.text}
      />

      <WirePath
        d={`M ${COLUMN.k3[0]} ${NODE.k3BottomY} V ${NODE.k3ToOl2Row1Y} H ${COLUMN.k2[0]} V ${NODE.ol2TopY}`}
        stroke={STYLE.l1}
      />
      <WirePath
        d={`M ${COLUMN.k3[1]} ${NODE.k3BottomY} V ${NODE.k3ToOl2Row2Y} H ${COLUMN.k2[1]} V ${NODE.ol2TopY}`}
        stroke={STYLE.l2}
      />
      <WirePath
        d={`M ${COLUMN.k3[2]} ${NODE.k3BottomY} V ${NODE.k3ToOl2Row3Y} H ${COLUMN.k2[2]} V ${NODE.ol2TopY}`}
        stroke={STYLE.l3}
      />

      <WirePath
        d={`M ${COLUMN.k1[0]} ${NODE.ol1BottomY} V ${NODE.motorU1Y} H ${NODE.motorLeftTerminalX}`}
        stroke={STYLE.l1}
      />
      <WirePath
        d={`M ${COLUMN.k1[1]} ${NODE.ol1BottomY} V ${NODE.motorV1Y} H ${NODE.motorLeftTerminalX}`}
        stroke={STYLE.l2}
      />
      <WirePath
        d={`M ${COLUMN.k1[2]} ${NODE.ol1BottomY} V ${NODE.motorW1Y} H ${NODE.motorLeftTerminalX}`}
        stroke={STYLE.l3}
      />

      <WirePath
        d={`M ${COLUMN.k2[0]} ${NODE.ol2BottomY} V ${NODE.motorU2Y} H ${NODE.motorRightTerminalX}`}
        stroke={STYLE.l1}
      />
      <WirePath
        d={`M ${COLUMN.k2[1]} ${NODE.ol2BottomY} V ${NODE.motorV2Y} H ${NODE.motorRightTerminalX}`}
        stroke={STYLE.l2}
      />
      <WirePath
        d={`M ${COLUMN.k2[2]} ${NODE.ol2BottomY} V ${NODE.motorW2Y} H ${NODE.motorRightTerminalX}`}
        stroke={STYLE.l3}
      />
    </>
  );
}

function OverloadSection({ overloadTripped }: { overloadTripped: boolean }) {
  return (
    <>
      <ThermalOverloadRelay3P
        x={COMPONENT.ol1.x}
        y={COMPONENT.ol1.y}
        scale={COMPONENT.ol1.scale}
        tripped={overloadTripped}
        label=""
        standalone={false}
      />

      <ThermalOverloadRelay3P
        x={COMPONENT.ol2.x}
        y={COMPONENT.ol2.y}
        scale={COMPONENT.ol2.scale}
        tripped={overloadTripped}
        label=""
        standalone={false}
      />

      <text x="28" y="690" fontSize="16" fontWeight="700" fill={STYLE.text}>
        O/L1
      </text>

      <text x="328" y="690" fontSize="16" fontWeight="700" fill={STYLE.text}>
        O/L2
      </text>
    </>
  );
}

function MotorSection({
  spinLevel,
  motorMode,
  loadPercent,
  overloadTripped,
  transferOpen,
  deltaOn,
  starOn,
  mainOn,
}: {
  spinLevel: number;
  motorMode: MotorMode;
  loadPercent: number;
  overloadTripped: boolean;
  transferOpen: boolean;
  deltaOn: boolean;
  starOn: boolean;
  mainOn: boolean;
}) {
  const statusColor = overloadTripped
    ? STYLE.fault
    : transferOpen
      ? STYLE.transfer
      : deltaOn
        ? STYLE.active
        : starOn
          ? "#2563eb"
          : STYLE.muted;

  const statusText = overloadTripped
    ? "Trip Active"
    : transferOpen
      ? "Open Transition"
      : deltaOn
        ? "Delta Running"
        : starOn
          ? "Star Starting"
          : mainOn
            ? "Main Picked"
            : "Idle";

  return (
    <>
      <ACMotor3P6Terminal
        x={COMPONENT.motor.x}
        y={COMPONENT.motor.y}
        scale={COMPONENT.motor.scale}
        label=""
        standalone={false}
        orientation="vertical"
        showTerminalLabels={false}
      />

      <MotorRotationOverlay
        spinLevel={spinLevel}
        mode={motorMode}
        loadPercent={loadPercent}
      />

      <text x="242" y="844" fontSize="12" fontWeight="700" fill={STYLE.text}>
        U1
      </text>
      <text x="240" y="890" fontSize="12" fontWeight="700" fill={STYLE.text}>
        V1
      </text>
      <text x="255" y="930" fontSize="12" fontWeight="700" fill={STYLE.text}>
        W1
      </text>
      <text x="340" y="840" fontSize="12" fontWeight="700" fill={STYLE.text}>
        U2
      </text>
      <text x="335" y="885" fontSize="12" fontWeight="700" fill={STYLE.text}>
        V2
      </text>
      <text x="320" y="930" fontSize="12" fontWeight="700" fill={STYLE.text}>
        W2
      </text>
      <text x="250" y="945" fontSize="18" fontWeight="700" fill={STYLE.text}>
        3-Phase Motor
      </text>
      <text x="510" y="910" fontSize="13" fontWeight="700" fill={statusColor}>
        {statusText}
      </text>
    </>
  );
}

export default function StarDeltaPowerDiagramWithTimer({
  className = "",
  mcbOn = true,
  overloadTripped = false,
  mainOn = false,
  starOn = false,
  deltaOn = false,
  transferOpen = false,
  loadPercent = 45,
}: StarDeltaPowerDiagramWithTimerProps) {
  const mainState: WireState =
    mcbOn && !overloadTripped && mainOn ? "active" : "inactive";

  const starState: WireState =
    mcbOn && !overloadTripped && starOn ? "active" : "inactive";

  const deltaState: WireState =
    mcbOn && !overloadTripped && deltaOn ? "active" : "inactive";

  const tripState: WireState = mcbOn && overloadTripped ? "fault" : "inactive";

  const motorMode: MotorMode =
    !mcbOn || overloadTripped || !mainOn
      ? "idle"
      : deltaOn
        ? "delta"
        : starOn
          ? "star"
          : transferOpen
            ? "transfer"
            : "idle";

  const [spinLevel, setSpinLevel] = useState(0);

  useEffect(() => {
    const target =
      motorMode === "delta"
        ? 1
        : motorMode === "star"
          ? 0.68
          : motorMode === "transfer"
            ? 0.38
            : 0;

    const timer = window.setInterval(() => {
      setSpinLevel((prev) => {
        const next = prev + (target - prev) * 0.08;

        if (Math.abs(next - target) < 0.01) {
          window.clearInterval(timer);
          return target;
        }

        return next;
      });
    }, 24);

    return () => window.clearInterval(timer);
  }, [motorMode]);

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className={`control-diagram-layout ${className}`}>
      <div className="control-diagram-shell">
        <div className="control-diagram-scroll">
          <svg
            viewBox={VIEW_BOX}
            className="control-diagram-svg"
            role="img"
            aria-label="Star delta power diagram starter template"
          >
            <defs>
              <filter
                id="electron-glow-star-delta-power"
                x="-200%"
                y="-200%"
                width="500%"
                height="500%"
              >
                <feGaussianBlur stdDeviation={ELECTRON.blur} result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g transform={`translate(${BOARD.x}, ${BOARD.y})`}>
              <rect
                x={0}
                y={0}
                width={BOARD.width}
                height={BOARD.height}
                rx={14}
                fill={STYLE.board}
                stroke={STYLE.border}
                strokeWidth={1}
              />

              <g transform={canvasTransform}>
                <ActivePathLayer
                  mainState={mainState}
                  starState={starState}
                  deltaState={deltaState}
                  tripState={tripState}
                />

                <FlowLayer
                  mcbOn={mcbOn}
                  overloadTripped={overloadTripped}
                  mainOn={mainOn}
                  starOn={starOn}
                  deltaOn={deltaOn}
                  tripState={tripState}
                />

                <SupplyRails />

                <BreakerSection mcbOn={mcbOn} />

                <ContactorsSection
                  mainOn={mainOn}
                  starOn={starOn}
                  deltaOn={deltaOn}
                />

                <StaticPowerWires />

                <OverloadSection overloadTripped={overloadTripped} />

                <MotorSection
                  spinLevel={spinLevel}
                  motorMode={motorMode}
                  loadPercent={loadPercent}
                  overloadTripped={overloadTripped}
                  transferOpen={transferOpen}
                  deltaOn={deltaOn}
                  starOn={starOn}
                  mainOn={mainOn}
                />

                <text x="0" y={BOARD.height - 14} fontSize="11" fill="#94a3b8">
                  Star-Delta Power Diagram Template
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
