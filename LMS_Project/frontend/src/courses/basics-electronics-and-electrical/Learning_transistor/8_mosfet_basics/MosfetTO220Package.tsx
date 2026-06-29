"use client";

import type { FlowMode, MosfetState } from "./mosfetSimulatorTypes";

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 320,
  height: 620,
};

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
} as const;

const BASE_COMPONENT = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const COMPONENT = {
  packageX: 55,
  packageW: 210,
  metalY: 20,
  metalH: 145,
  metalFill: "#d9d8d2",
  metalStroke: "#77746e",
  tabHoleCX: 160,
  tabHoleCY: 82,
  tabHoleR: 36,
  bodyY: 165,
  bodyH: 160,
  bodyFill: "#161719",
  bodyStroke: "#252525",
  screwHoleCX: 160,
  screwHoleCY: 213,
  screwHoleR: 16,
  pinY: 325,
  pinH: 250,
  pinW: 31,
  pinGap: 26,
  pinStroke: "#8f8d86",
  textFill: "#8b8175",
  labelFill: "#334155",
  activeLabelFill: "#0f172a",
  gatePinFill: "#93c5fd",
  drainPinFill: "#fca5a5",
  sourcePinFill: "#86efac",
  inactivePinFill: "#d8d7d2",
} as const;

const LABEL = {
  fontFamily: "serif",
  fontWeight: 700,
  letterSpacing: 1.5,
} as const;

const PINS = {
  leftX: 83,
  middleX: 83 + COMPONENT.pinW + COMPONENT.pinGap,
  rightX: 83 + (COMPONENT.pinW + COMPONENT.pinGap) * 2,
} as const;

function getPackageFill(temperature: number) {
  if (temperature >= 95) {
    return "#3b1616";
  }

  if (temperature >= 70) {
    return "#2b1f13";
  }

  return COMPONENT.bodyFill;
}

function getDrainGlowOpacity(active: boolean, drainVoltage: number) {
  if (!active) {
    return 0;
  }

  return Math.min(0.82, 0.2 + drainVoltage / 20);
}

function MetalTab({
  active,
  drainVoltage,
  stateColor,
}: {
  active: boolean;
  drainVoltage: number;
  stateColor: string;
}) {
  const glowOpacity = getDrainGlowOpacity(active, drainVoltage);

  return (
    <g>
      {glowOpacity > 0 ? (
        <rect
          x={COMPONENT.packageX - 6}
          y={COMPONENT.metalY - 6}
          width={COMPONENT.packageW + 12}
          height={COMPONENT.metalH + 12}
          rx={10}
          fill={stateColor}
          opacity={glowOpacity * 0.18}
        />
      ) : null}

      <rect
        x={COMPONENT.packageX}
        y={COMPONENT.metalY}
        width={COMPONENT.packageW}
        height={COMPONENT.metalH}
        rx={5}
        fill={COMPONENT.metalFill}
        stroke={COMPONENT.metalStroke}
        strokeWidth={2}
        {...BASE_COMPONENT}
      />

      <circle
        cx={COMPONENT.tabHoleCX}
        cy={COMPONENT.tabHoleCY}
        r={COMPONENT.tabHoleR}
        fill="#f6f7f6"
        stroke={active ? stateColor : "#9b9a96"}
        strokeWidth={active ? 4 : 3}
      />

      <rect x={COMPONENT.packageX} y={COMPONENT.metalY + 4} width={7} height={138} fill="rgba(0,0,0,0.12)" />
      <rect
        x={COMPONENT.packageX + COMPONENT.packageW - 7}
        y={COMPONENT.metalY + 4}
        width={7}
        height={138}
        fill="rgba(0,0,0,0.12)"
      />
    </g>
  );
}

function BlackPackage({
  active,
  stateColor,
  temperature,
}: {
  active: boolean;
  stateColor: string;
  temperature: number;
}) {
  return (
    <g>
      <path
        d={`
          M ${COMPONENT.packageX} ${COMPONENT.bodyY}
          H ${COMPONENT.packageX + 73}
          Q ${COMPONENT.packageX + 78} ${COMPONENT.bodyY - 8}
            ${COMPONENT.packageX + 88} ${COMPONENT.bodyY - 8}
          H ${COMPONENT.packageX + 122}
          Q ${COMPONENT.packageX + 132} ${COMPONENT.bodyY - 8}
            ${COMPONENT.packageX + 137} ${COMPONENT.bodyY}
          H ${COMPONENT.packageX + COMPONENT.packageW}
          V ${COMPONENT.bodyY + COMPONENT.bodyH}
          H ${COMPONENT.packageX}
          Z
        `}
        fill={getPackageFill(temperature)}
        stroke={active ? stateColor : COMPONENT.bodyStroke}
        strokeWidth={active ? 2.8 : 2}
        {...BASE_COMPONENT}
      />

      <circle
        cx={COMPONENT.screwHoleCX}
        cy={COMPONENT.screwHoleCY}
        r={COMPONENT.screwHoleR}
        fill="#080909"
        stroke="#222"
        strokeWidth={2}
      />

      <rect
        x={COMPONENT.packageX + 4}
        y={COMPONENT.bodyY + 4}
        width={COMPONENT.packageW - 8}
        height={20}
        fill="rgba(255,255,255,0.05)"
      />
    </g>
  );
}

function Pin({
  x,
  fill,
  stroke,
}: {
  x: number;
  fill: string;
  stroke: string;
}) {
  const y = COMPONENT.pinY;
  const w = COMPONENT.pinW;
  const h = COMPONENT.pinH;

  return (
    <path
      d={`
        M ${x} ${y}
        H ${x + w}
        V ${y + h - 32}
        Q ${x + w - 2} ${y + h} ${x + w / 2} ${y + h}
        Q ${x + 2} ${y + h} ${x} ${y + h - 32}
        Z
      `}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      {...BASE_COMPONENT}
    />
  );
}

function Pins({
  active,
  flowMode,
  stateColor,
}: {
  active: boolean;
  flowMode: FlowMode;
  stateColor: string;
}) {
  const gateActive = active;
  const drainActive = active;
  const sourceActive = active;
  const drainFill =
    flowMode === "Conventional" || flowMode === "Both"
      ? COMPONENT.drainPinFill
      : "#fecaca";
  const sourceFill =
    flowMode === "Electron" || flowMode === "Both"
      ? COMPONENT.sourcePinFill
      : "#d9f99d";

  return (
    <g>
      <Pin
        x={PINS.leftX}
        fill={gateActive ? COMPONENT.gatePinFill : COMPONENT.inactivePinFill}
        stroke={gateActive ? stateColor : COMPONENT.pinStroke}
      />
      <Pin
        x={PINS.middleX}
        fill={drainActive ? drainFill : COMPONENT.inactivePinFill}
        stroke={drainActive ? stateColor : COMPONENT.pinStroke}
      />
      <Pin
        x={PINS.rightX}
        fill={sourceActive ? sourceFill : COMPONENT.inactivePinFill}
        stroke={sourceActive ? stateColor : COMPONENT.pinStroke}
      />

      <rect x={PINS.leftX + 4} y={360} width={7} height={160} fill="rgba(255,255,255,0.28)" />
      <rect x={PINS.middleX + 4} y={360} width={7} height={160} fill="rgba(255,255,255,0.28)" />
      <rect x={PINS.rightX + 4} y={360} width={7} height={160} fill="rgba(255,255,255,0.28)" />
    </g>
  );
}

function EngravedText() {
  return (
    <g fill={COMPONENT.textFill} opacity={0.72} textAnchor="middle" style={LABEL}>
      <text x="160" y="257" fontSize="24">
        IRLB3034
      </text>
      <text x="160" y="292" fontSize="22">
        P113D
      </text>
      <text x="160" y="322" fontSize="25">
        I079
      </text>

      <text x="108" y="292" fontSize="20" opacity={0.45}>
        IR
      </text>
    </g>
  );
}

function SurfaceTexture() {
  return (
    <g opacity={0.28}>
      <circle cx="80" cy="70" r="2" fill="#c4c1b8" />
      <circle cx="235" cy="110" r="2" fill="#c4c1b8" />
      <circle cx="92" cy="245" r="2" fill="#2b2b2b" />
      <circle cx="235" cy="280" r="2" fill="#2b2b2b" />
      <path d="M62 170 H258" stroke="#000" strokeOpacity={0.35} strokeWidth={2} />
    </g>
  );
}

function TerminalLabels({
  active,
  stateColor,
}: {
  active: boolean;
  stateColor: string;
}) {
  return (
    <g
      fontFamily="Arial, sans-serif"
      fontSize="20"
      fontWeight="700"
      textAnchor="middle"
      fill={active ? COMPONENT.activeLabelFill : COMPONENT.labelFill}
    >
      <text x={PINS.leftX + COMPONENT.pinW / 2} y="606">
        G
      </text>
      <text x={PINS.middleX + COMPONENT.pinW / 2} y="606" fill={active ? stateColor : COMPONENT.labelFill}>
        D
      </text>
      <text x={PINS.rightX + COMPONENT.pinW / 2} y="606">
        S
      </text>
    </g>
  );
}

function PackageStatusLabel({
  gateVoltage,
  drainVoltage,
  mosfetState,
  stateColor,
  temperature,
}: {
  gateVoltage: number;
  drainVoltage: number;
  mosfetState: MosfetState;
  stateColor: string;
  temperature: number;
}) {
  return (
    <g fontFamily="Arial, sans-serif">
      <text x="160" y="42" textAnchor="middle" fontSize="16" fontWeight="700" fill={stateColor}>
        {mosfetState}
      </text>
      <text x="160" y="60" textAnchor="middle" fontSize="11" fill="#64748b">
        GATE {gateVoltage.toFixed(1)}V | DRAIN {drainVoltage.toFixed(1)}V
      </text>
      <text
        x="160"
        y="76"
        textAnchor="middle"
        fontSize="11"
        fill={temperature >= 70 ? "#b45309" : "#64748b"}
      >
        TEMP {temperature.toFixed(0)}C
      </text>
    </g>
  );
}

type MosfetTO220PackageProps = {
  active?: boolean;
  className?: string;
  drainVoltage?: number;
  flowMode?: FlowMode;
  gateVoltage?: number;
  label?: string;
  mosfetState?: MosfetState;
  stateColor?: string;
  temperature?: number;
};

export default function MosfetTO220Package({
  active = false,
  className = "w-full max-w-[360px] h-auto",
  drainVoltage = 0,
  flowMode = "Both",
  gateVoltage = 0,
  label = "IRLB3034 TO-220 MOSFET package SVG illustration",
  mosfetState = "OFF",
  stateColor = "#94a3b8",
  temperature = 25,
}: MosfetTO220PackageProps) {
  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      className={className}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={`scale(${SCALE.canvas})`}>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.18" />
        </filter>

        <g filter="url(#softShadow)">
          <PackageStatusLabel
            gateVoltage={gateVoltage}
            drainVoltage={drainVoltage}
            mosfetState={mosfetState}
            stateColor={stateColor}
            temperature={temperature}
          />
          <Pins active={active} flowMode={flowMode} stateColor={stateColor} />
          <MetalTab active={active} drainVoltage={drainVoltage} stateColor={stateColor} />
          <BlackPackage active={active} stateColor={stateColor} temperature={temperature} />
          <SurfaceTexture />
          <EngravedText />
          <TerminalLabels active={active} stateColor={stateColor} />
        </g>
      </g>
    </svg>
  );
}
