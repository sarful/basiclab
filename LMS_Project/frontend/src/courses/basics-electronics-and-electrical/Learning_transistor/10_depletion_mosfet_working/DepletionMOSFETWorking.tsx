"use client";

import React, { useEffect, useMemo, useState } from "react";

import DepletionMosfetControlPanel from "./DepletionMosfetControlPanel";
import DepletionMosfetWorkingDashboard from "./DepletionMosfetWorkingDashboard";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = { x: 0, y: 0, width: 1200, height: 760 };

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

/* =========================================================
   BASE STYLES
========================================================= */

const BASE_COMPONENT = {
  stroke: "#111111",
  strokeWidth: 4 * SCALE.component,
  fill: "#ffffff",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const COMPONENT = {
  background: "#ffffff",
  panel: "#ffffff",
  panelStroke: "#dddddd",
  dashboard: "#f8fafc",
  dashboardDark: "#111827",

  black: "#111111",
  dark: "#2c2c2c",
  metal: "#333333",

  semiconductor: "#ffe7b8",
  nRegion: "#b6e79a",
  nRegionStroke: "#2d7a31",
  oxide: "#d7b4ee",
  oxideStroke: "#7f55a0",

  channel: "#e8f7ff",
  channelStroke: "#1584d8",
  depletion: "#fca5a5",
  depletionStroke: "#ef4444",

  blue: "#1d72e8",
  blueStroke: "#1c63d6",
  green: "#0f7a25",
  weakGreen: "#65b96f",
  orange: "#f59e0b",
  red: "#ef4444",
  gray: "#999999",
  lightGray: "#d5d5d5",
  buttonStroke: "#c8c8c8",
};

const NODE = {
  terminal: 12,
  small: 7,
  timeline: 13,
};

const WIRE = {
  color: "#111111",
  width: BASE_WIRE_WIDTH * SCALE.wire,
  thin: 3 * SCALE.wire,
  thick: 8 * SCALE.wire,
  active: 6 * SCALE.wire,
};

const PATH = {
  mainPanel: { x: 80, y: 165, width: 1040, height: 470, rx: 18 },
  controlPanel: { x: 80, y: 755, width: 420, height: 220, rx: 20 },
  scopePanel: { x: 520, y: 755, width: 600, height: 220, rx: 20 },
  dashboardPanel: { x: 80, y: 995, width: 1040, height: 210, rx: 22 },

  body: { x: 130, y: 325, width: 940, height: 295, rx: 10 },

  sourceRegion:
    "M160 325 H345 V390 Q335 425 285 425 H215 Q160 420 160 355 Z",

  drainRegion:
    "M840 325 H1030 V390 Q1020 425 970 425 H900 Q845 420 840 355 Z",

  channel:
    "M345 360 C465 330 665 330 840 360 L840 405 C665 372 485 372 345 405 Z",

  pinchOff:
    "M790 352 C820 360 840 375 850 398 C835 390 810 386 780 388 C792 378 800 365 790 352 Z",
};

const LABEL = {
  fontFamily: "Arial, sans-serif",
  meterSize: 33,
  regionSize: 34,
  small: 13,
};

/* =========================================================
   CONTROL VARIABLES
========================================================= */

type RegionState =
  | "NORMALLY ON"
  | "DEPLETION"
  | "WEAK CHANNEL"
  | "CUTOFF"
  | "ENHANCEMENT"
  | "SATURATION";

type FlowMode = "Electron" | "Conventional" | "Both";
type LearningMode = "Beginner" | "Advanced";

const MOSFET_LOGIC = {
  minGateVoltage: -6,
  maxGateVoltage: 6,
  defaultGateVoltage: 0,
  minCutoffVoltage: -8,
  maxCutoffVoltage: -1,
  defaultCutoffVoltage: -4,
  thresholdVoltage: 0,
  minDrainVoltage: 0,
  maxDrainVoltage: 15,
  minTemperature: 25,
  maxTemperature: 125,
  minLoadResistance: 10,
  maxLoadResistance: 1000,
  idss: 0.18,
  thermalResistance: 38,
};

const MAIN = {
  topNode: { cx: 215, cy: 180 },
  mainAmmeter: { cx: 865, cy: 180 },
  drainWireEnd: { x: 1015, y: 320 },
  gateWire: { x: 565, y1: 105, y2: 305 },

  sourceTerminal: { x: 185, y: 310, width: 36, height: 16 },
  drainTerminal: { x: 1005, y: 310, width: 36, height: 16 },

  oxide: { x: 310, y: 325, width: 525, height: 27 },
  gate: { x: 355, y: 295, width: 420, height: 35 },
  gatePin: { x: 555, y: 285, width: 22, height: 18 },

  ground: { x: 565, y: 620 },
};

const SLIDER = {
  panel: { x: 355, y: 38, width: 430, height: 105, rx: 18 },
  minus: { cx: 410, cy: 90, r: 22 },
  plus: { cx: 730, cy: 90, r: 22 },
  rail: { x1: 455, y1: 90, x2: 685, y2: 90 },
  knob: { cy: 90, r: 16 },
  vgs: { x: 488, y: 132 },
};

const ELECTRONS = [
  [380, 370], [430, 390], [480, 368], [530, 392], [580, 370],
  [630, 390], [680, 368], [730, 392], [780, 370],
];

const BODY_PARTICLES = [
  [165, 455], [215, 505], [300, 455], [415, 515], [495, 470],
  [635, 505], [785, 515], [955, 460], [250, 570], [345, 520],
  [480, 570], [725, 570], [885, 520], [1035, 545], [580, 570],
];

const TRAINING_STEPS = [
  "Channel exists at VGS = 0",
  "Negative gate voltage applied",
  "Depletion region expands",
  "Channel becomes narrow",
  "Cutoff condition reached",
  "Positive VGS enhances channel",
];

const AUTOPLAY_STAGES = [
  { gateVoltage: 0, drainVoltage: 6 },
  { gateVoltage: -1.5, drainVoltage: 6 },
  { gateVoltage: -2.8, drainVoltage: 6 },
  { gateVoltage: -3.5, drainVoltage: 6 },
  { gateVoltage: -4.5, drainVoltage: 6 },
  { gateVoltage: 3.5, drainVoltage: 8 },
];

/* =========================================================
   HELPERS
========================================================= */

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function normalizeSigned(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

function getChannelStrength(vgs: number, vgsOff: number, temperature: number) {
  const tempPenalty = 1 - (temperature - 25) * 0.0015;

  if (vgs <= vgsOff) return 0;
  if (vgs < 0) {
    const depletionRatio = 1 - vgs / vgsOff;
    return clamp(depletionRatio * tempPenalty, 0, 1);
  }

  return clamp((1 + vgs / 6) * tempPenalty, 0, 1.8);
}

function getRegionState(vgs: number, vgsOff: number, vds: number, strength: number): RegionState {
  if (vgs <= vgsOff || strength <= 0.03) return "CUTOFF";
  if (vgs < 0 && strength < 0.28) return "WEAK CHANNEL";
  if (vgs < 0) return "DEPLETION";
  if (vgs === 0) return "NORMALLY ON";
  if (vds > 6 && strength > 0.35) return "SATURATION";
  return "ENHANCEMENT";
}

function calculateDrainCurrent({
  gateVoltage,
  cutoffVoltage,
  drainVoltage,
  loadResistance,
  temperature,
}: {
  gateVoltage: number;
  cutoffVoltage: number;
  drainVoltage: number;
  loadResistance: number;
  temperature: number;
}) {
  const strength = getChannelStrength(gateVoltage, cutoffVoltage, temperature);
  if (strength <= 0.02) return 0;

  const channelCurrent =
    gateVoltage < 0
      ? MOSFET_LOGIC.idss * Math.pow(1 - gateVoltage / cutoffVoltage, 2)
      : MOSFET_LOGIC.idss * (1 + gateVoltage / MOSFET_LOGIC.maxGateVoltage) * strength;

  const loadLimited = drainVoltage / loadResistance;
  return clamp(Math.min(channelCurrent, loadLimited), 0, 1.5);
}

function getStateColor(state: RegionState) {
  if (state === "CUTOFF") return COMPONENT.gray;
  if (state === "WEAK CHANNEL") return COMPONENT.weakGreen;
  if (state === "DEPLETION") return COMPONENT.orange;
  if (state === "NORMALLY ON") return COMPONENT.green;
  if (state === "ENHANCEMENT") return COMPONENT.blue;
  return COMPONENT.red;
}

function getThermalColor(junctionTemp: number) {
  if (junctionTemp < 45) return COMPONENT.blue;
  if (junctionTemp < 70) return COMPONENT.green;
  if (junctionTemp < 95) return COMPONENT.orange;
  return COMPONENT.red;
}

function graphPath(values: number[], x: number, y: number, w: number, h: number, max: number) {
  return values
    .map((v, i) => {
      const px = x + (i / Math.max(1, values.length - 1)) * w;
      const py = y + h - (clamp(v, 0, max) / max) * h;
      return `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");
}

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

type PanelProps = { x: number; y: number; width: number; height: number; rx: number };

function SvgPanel({ x, y, width, height, rx }: PanelProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      fill={COMPONENT.panel}
      stroke={COMPONENT.panelStroke}
      strokeWidth={3}
    />
  );
}

function Meter({ cx, cy, label, color }: { cx: number; cy: number; label: string; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={29} fill="#fff" stroke={color} strokeWidth={4} />
      <text x={cx - 13} y={cy + 11} fontSize={LABEL.meterSize} fontFamily={LABEL.fontFamily} fill={color}>
        {label}
      </text>
    </g>
  );
}

function Ground({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={WIRE.color} strokeWidth={WIRE.width} strokeLinecap="round">
      <line x1={x} y1={y} x2={x} y2={y + 30} />
      <line x1={x - 30} y1={y + 30} x2={x + 30} y2={y + 30} />
      <line x1={x - 20} y1={y + 45} x2={x + 20} y2={y + 45} />
      <line x1={x - 10} y1={y + 60} x2={x + 10} y2={y + 60} />
    </g>
  );
}

function ActiveWire({
  d,
  active,
  strength,
  color,
}: {
  d: string;
  active: boolean;
  strength: number;
  color: string;
}) {
  return (
    <path
      d={d}
      stroke={active ? color : WIRE.color}
      strokeWidth={active ? WIRE.active : WIRE.width}
      opacity={active ? 0.35 + clamp(strength, 0, 1) * 0.65 : 1}
      fill="none"
      strokeLinecap="round"
      style={{ transition: "stroke 250ms ease, opacity 250ms ease, stroke-width 250ms ease" }}
    />
  );
}

function IndustrialSlider({
  x, y, label, value, min, max, step, unit, onChange,
}: {
  x: number; y: number; label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void;
}) {
  const railW = 300;
  const knobX = x + normalizeSigned(value, min, max) * railW;

  return (
    <g>
      <text x={x} y={y - 8} fontSize={LABEL.small} fontFamily={LABEL.fontFamily} fill={COMPONENT.black}>
        {label}: {value.toFixed(step < 1 ? 1 : 0)}{unit}
      </text>
      <line x1={x} y1={y + 12} x2={x + railW} y2={y + 12} stroke="#cfcfcf" strokeWidth={6} strokeLinecap="round" />
      <line x1={x} y1={y + 12} x2={knobX} y2={y + 12} stroke={COMPONENT.blue} strokeWidth={6} strokeLinecap="round" />
      <circle cx={knobX} cy={y + 12} r={11} fill="#3d7fe8" stroke={COMPONENT.blueStroke} strokeWidth={3} />
      <foreignObject x={x - 8} y={y - 5} width={railW + 18} height={35}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-8 w-full cursor-pointer opacity-0"
        />
      </foreignObject>
    </g>
  );
}

function SelectBox({
  x, y, label, value, options, onChange,
}: {
  x: number; y: number; label: string; value: string; options: string[]; onChange: (v: any) => void;
}) {
  return (
    <foreignObject x={x} y={y} width={170} height={42}>
      <label className="block text-[11px] font-medium text-gray-900">
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 h-6 w-full rounded border border-gray-300 bg-white px-1 text-[11px]"
        >
          {options.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
    </foreignObject>
  );
}

function TopGateSlider({
  gateVoltage,
  cutoffVoltage,
  regionState,
  onChange,
}: {
  gateVoltage: number;
  cutoffVoltage: number;
  regionState: RegionState;
  onChange: (v: number) => void;
}) {
  const railLength = SLIDER.rail.x2 - SLIDER.rail.x1;
  const knobCx =
    SLIDER.rail.x1 +
    normalizeSigned(gateVoltage, MOSFET_LOGIC.minGateVoltage, MOSFET_LOGIC.maxGateVoltage) * railLength;

  const zeroX =
    SLIDER.rail.x1 +
    normalizeSigned(0, MOSFET_LOGIC.minGateVoltage, MOSFET_LOGIC.maxGateVoltage) * railLength;

  const cutoffX =
    SLIDER.rail.x1 +
    normalizeSigned(cutoffVoltage, MOSFET_LOGIC.minGateVoltage, MOSFET_LOGIC.maxGateVoltage) * railLength;

  return (
    <g>
      <rect {...SLIDER.panel} fill="#fff" stroke={COMPONENT.lightGray} strokeWidth={3} />
      <circle {...SLIDER.minus} fill="#fff" stroke={COMPONENT.blueStroke} strokeWidth={4} />
      <text x="398" y="103" fontSize="40" fill={COMPONENT.blueStroke}>−</text>

      <line {...SLIDER.rail} stroke={COMPONENT.gray} strokeWidth={WIRE.thick} strokeLinecap="round" />
      <line x1={zeroX} y1={SLIDER.rail.y1} x2={knobCx} y2={SLIDER.rail.y1} stroke={getStateColor(regionState)} strokeWidth={WIRE.thick} strokeLinecap="round" />

      <line x1={zeroX} y1="72" x2={zeroX} y2="108" stroke={COMPONENT.green} strokeWidth={3} strokeLinecap="round" />
      <line x1={cutoffX} y1="72" x2={cutoffX} y2="108" stroke={COMPONENT.red} strokeWidth={3} strokeLinecap="round" />

      <circle cx={knobCx} cy={SLIDER.knob.cy} r={SLIDER.knob.r} fill="#3d7fe8" stroke={COMPONENT.blueStroke} strokeWidth={3} />

      <circle {...SLIDER.plus} fill="#fff" stroke={COMPONENT.red} strokeWidth={4} />
      <text x="717" y="104" fontSize="40" fill={COMPONENT.red}>+</text>

      <text x={SLIDER.vgs.x} y={SLIDER.vgs.y} fontSize="18" fontFamily={LABEL.fontFamily} fill={getStateColor(regionState)}>
        VGS {gateVoltage.toFixed(1)}V
      </text>

      <foreignObject x="448" y="68" width="245" height="45">
        <input
          type="range"
          min={MOSFET_LOGIC.minGateVoltage}
          max={MOSFET_LOGIC.maxGateVoltage}
          step={0.1}
          value={gateVoltage}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-10 w-full cursor-pointer opacity-0"
        />
      </foreignObject>
    </g>
  );
}

function EquationPanel({
  x, y, visible, gateVoltage, cutoffVoltage, drainVoltage, drainCurrent,
}: {
  x: number; y: number; visible: boolean; gateVoltage: number; cutoffVoltage: number; drainVoltage: number; drainCurrent: number;
}) {
  if (!visible) return null;

  const power = drainVoltage * drainCurrent;
  const items = [
    `VGS(off) = ${cutoffVoltage.toFixed(1)}V`,
    `ID decreases as VGS becomes negative`,
    `ID ≈ IDSS × (1 − VGS / VGS(off))²`,
    `Power = VDS × ID = ${power.toFixed(2)}W`,
    `Live ID = ${(drainCurrent * 1000).toFixed(1)}mA`,
  ];

  return (
    <g>
      <rect x={x} y={y} width={255} height={128} rx={12} fill="#ffffff" stroke="#cbd5e1" strokeWidth={2} />
      <text x={x + 14} y={y + 22} fontSize={15} fontFamily={LABEL.fontFamily} fill={COMPONENT.black} fontWeight={700}>
        Depletion MOSFET Equations
      </text>
      {items.map((item, i) => (
        <text key={item} x={x + 14} y={y + 45 + i * 16} fontSize={12} fontFamily={LABEL.fontFamily} fill="#374151">
          {item}
        </text>
      ))}
    </g>
  );
}

function DepletionRegion({ gateVoltage, cutoffVoltage }: { gateVoltage: number; cutoffVoltage: number }) {
  if (gateVoltage >= 0) return null;

  const depletionStrength = clamp(Math.abs(gateVoltage / cutoffVoltage), 0, 1);
  const h = 18 + depletionStrength * 58;

  return (
    <g opacity={0.2 + depletionStrength * 0.65}>
      <path
        d={`M345 360 C465 ${350 + h} 665 ${350 + h} 840 360 L840 ${360 + h} C665 ${390 + h} 485 ${390 + h} 345 ${360 + h} Z`}
        fill={COMPONENT.depletion}
        stroke={COMPONENT.depletionStroke}
        strokeWidth={2 + depletionStrength * 2}
        strokeDasharray="8 7"
      />
    </g>
  );
}

function ChannelLayer({ channelStrength, regionState }: { channelStrength: number; regionState: RegionState }) {
  if (regionState === "CUTOFF" || channelStrength <= 0.03) return null;

  const strokeWidth = 2 + clamp(channelStrength, 0, 1.8) * 5;
  const opacity = 0.25 + clamp(channelStrength, 0, 1) * 0.75;

  return (
    <path
      d={PATH.channel}
      fill={COMPONENT.channel}
      stroke={COMPONENT.channelStroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      style={{ transition: "opacity 350ms ease, stroke-width 350ms ease" }}
    />
  );
}

function DensityMap({ strength }: { strength: number }) {
  if (strength <= 0.01) return null;

  const count = Math.round(18 + strength * 20);

  return (
    <g opacity={0.15 + clamp(strength, 0, 1) * 0.75}>
      {Array.from({ length: count }).map((_, i) => {
        const x = 365 + (i % 17) * 27;
        const y = 365 + Math.floor(i / 17) * 23;
        return <circle key={i} cx={x} cy={y} r={2 + clamp(strength, 0, 1) * 3} fill={COMPONENT.blue} />;
      })}
    </g>
  );
}

function FlowParticles({
  strength, isRunning, flowMode, conventional = false,
}: {
  strength: number; isRunning: boolean; flowMode: FlowMode; conventional?: boolean;
}) {
  const allowed = flowMode === "Both" || flowMode === (conventional ? "Conventional" : "Electron");
  const active = strength > 0.03 && allowed;
  const duration = `${2.4 - clamp(strength, 0, 1) * 1.35}s`;
  const opacity = active ? 0.2 + clamp(strength, 0, 1) * 0.8 : 0;

  const data = conventional
    ? [[790, 412], [710, 418], [630, 415], [550, 420], [470, 414], [390, 418]]
    : ELECTRONS;

  return (
    <g>
      {data.map(([x, y], index) => (
        <line
          key={`${conventional ? "c" : "e"}-${index}`}
          x1={x}
          y1={y}
          x2={x + (conventional ? -12 : 12)}
          y2={y}
          stroke={conventional ? COMPONENT.orange : COMPONENT.blue}
          strokeWidth={conventional ? 2.5 : 3}
          strokeLinecap="round"
          opacity={opacity}
          markerEnd={conventional ? "url(#currentArrow)" : "url(#electronArrow)"}
          style={{
            animationName:
              isRunning && active
                ? conventional
                  ? "currentFlowDrainToSource"
                  : "electronFlowSourceToDrain"
                : "none",
            animationDuration: isRunning && active ? duration : undefined,
            animationTimingFunction: isRunning && active ? "linear" : undefined,
            animationDelay: isRunning && active ? `${index * 0.08}s` : undefined,
            animationIterationCount: isRunning && active ? "infinite" : undefined,
          }}
        />
      ))}
    </g>
  );
}

function SvgLabels({ advanced }: { advanced: boolean }) {
  return (
    <g fontFamily={LABEL.fontFamily} fontSize="13" fill="#111827">
      <text x="195" y="302">Source</text>
      <text x="525" y="286">Gate</text>
      <text x="1000" y="302">Drain</text>
      {advanced && (
        <>
          <text x="515" y="350" fill={COMPONENT.oxideStroke}>Oxide</text>
          <text x="520" y="575">P-substrate</text>
          <text x="500" y="425" fill={COMPONENT.channelStroke}>Existing channel</text>
          <text x="500" y="455" fill={COMPONENT.depletionStroke}>Depletion region</text>
        </>
      )}
    </g>
  );
}

function MainMosfetStructure({
  channelStrength,
  regionState,
  gateVoltage,
  cutoffVoltage,
  junctionTemp,
  power,
  flowMode,
  isRunning,
  learningMode,
}: {
  channelStrength: number;
  regionState: RegionState;
  gateVoltage: number;
  cutoffVoltage: number;
  junctionTemp: number;
  power: number;
  flowMode: FlowMode;
  isRunning: boolean;
  learningMode: LearningMode;
}) {
  const isSaturation = regionState === "SATURATION";
  const pinchOpacity = isSaturation ? 0.3 + clamp(channelStrength, 0, 1) * 0.7 : 0;
  const thermalColor = getThermalColor(junctionTemp);

  return (
    <g>
      <rect {...PATH.body} fill={COMPONENT.semiconductor} stroke={COMPONENT.black} strokeWidth={4} />
      <path d={PATH.sourceRegion} fill={COMPONENT.nRegion} stroke={COMPONENT.nRegionStroke} strokeWidth={2} />
      <path d={PATH.drainRegion} fill={COMPONENT.nRegion} stroke={COMPONENT.nRegionStroke} strokeWidth={2} />

      <text x="230" y="385" fontSize={LABEL.regionSize} fill="#156b20">N⁺</text>
      <text x="907" y="385" fontSize={LABEL.regionSize} fill="#156b20">N⁺</text>

      <rect {...MAIN.oxide} fill={COMPONENT.oxide} stroke={COMPONENT.oxideStroke} strokeWidth={2} />
      <rect {...MAIN.gate} fill={COMPONENT.dark} stroke={COMPONENT.black} strokeWidth={3} />
      <rect {...MAIN.gatePin} fill={COMPONENT.black} />

      <rect {...MAIN.sourceTerminal} rx={3} fill={COMPONENT.black} />
      <rect {...MAIN.drainTerminal} rx={3} fill={COMPONENT.black} />

      <g opacity={clamp(power * 12, 0.04, 0.75)}>
        <circle cx="760" cy="380" r={28 + power * 120} fill={thermalColor} />
        <circle cx="760" cy="380" r={12 + power * 50} fill={thermalColor} opacity="0.8" />
      </g>

      <DepletionRegion gateVoltage={gateVoltage} cutoffVoltage={cutoffVoltage} />
      <ChannelLayer channelStrength={channelStrength} regionState={regionState} />

      {learningMode === "Advanced" && <DensityMap strength={channelStrength} />}

      <path
        d={PATH.pinchOff}
        fill={COMPONENT.semiconductor}
        stroke={COMPONENT.red}
        strokeWidth={3 + clamp(channelStrength, 0, 1) * 2}
        opacity={pinchOpacity}
        style={{ transition: "opacity 350ms ease" }}
      />

      <FlowParticles strength={channelStrength} isRunning={isRunning} flowMode={flowMode} />
      <FlowParticles strength={channelStrength} isRunning={isRunning} flowMode={flowMode} conventional />

      {BODY_PARTICLES.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={NODE.small} fill="#fff5dd" stroke={COMPONENT.gray} strokeWidth={3} opacity={0.55 + clamp(channelStrength, 0, 1) * 0.3} />
      ))}

      <SvgLabels advanced={learningMode === "Advanced"} />

      <path d="M225 550 l20 -25" stroke={COMPONENT.black} strokeWidth={4} markerEnd="url(#arrow)" />
      <rect x={PATH.body.x} y={600} width={PATH.body.width} height={20} fill={COMPONENT.metal} />
      <Ground {...MAIN.ground} />
    </g>
  );
}

function ControlButton({
  x, y, type, onClick,
}: {
  x: number; y: number; type: "run" | "pause" | "reset" | "auto"; onClick: () => void;
}) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect x={x} y={y} width={46} height={30} rx={8} fill="#fff" stroke={COMPONENT.buttonStroke} strokeWidth={2} />
      {type === "run" && <polygon points={`${x + 17},${y + 8} ${x + 17},${y + 22} ${x + 31},${y + 15}`} fill={COMPONENT.green} />}
      {type === "pause" && (
        <>
          <rect x={x + 16} y={y + 8} width={5} height={14} rx={1} fill={COMPONENT.orange} />
          <rect x={x + 26} y={y + 8} width={5} height={14} rx={1} fill={COMPONENT.orange} />
        </>
      )}
      {type === "reset" && <path d={`M${x + 31} ${y + 10} A9 9 0 1 1 ${x + 19} ${y + 22}`} fill="none" stroke={COMPONENT.blue} strokeWidth={3} />}
      {type === "auto" && <text x={x + 9} y={y + 20} fontSize="10" fontFamily={LABEL.fontFamily} fill={COMPONENT.black}>AUTO</text>}
    </g>
  );
}

function ControlPanel({
  gateVoltage,
  drainVoltage,
  cutoffVoltage,
  temperature,
  loadResistance,
  flowMode,
  learningMode,
  trainingStep,
  autoplay,
  setGateVoltage,
  setDrainVoltage,
  setCutoffVoltage,
  setTemperature,
  setLoadResistance,
  setFlowMode,
  setLearningMode,
  setTrainingStep,
  onRun,
  onPause,
  onReset,
  onAuto,
}: {
  gateVoltage: number;
  drainVoltage: number;
  cutoffVoltage: number;
  temperature: number;
  loadResistance: number;
  flowMode: FlowMode;
  learningMode: LearningMode;
  trainingStep: number;
  autoplay: boolean;
  setGateVoltage: (v: number) => void;
  setDrainVoltage: (v: number) => void;
  setCutoffVoltage: (v: number) => void;
  setTemperature: (v: number) => void;
  setLoadResistance: (v: number) => void;
  setFlowMode: (v: FlowMode) => void;
  setLearningMode: (v: LearningMode) => void;
  setTrainingStep: (v: number) => void;
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
  onAuto: () => void;
}) {
  return (
    <g>
      <SvgPanel {...PATH.controlPanel} />

      <IndustrialSlider x={105} y={785} label="Gate Voltage" value={gateVoltage} min={-6} max={6} step={0.1} unit="V" onChange={setGateVoltage} />
      <IndustrialSlider x={105} y={820} label="Drain Voltage" value={drainVoltage} min={0} max={15} step={0.1} unit="V" onChange={setDrainVoltage} />
      <IndustrialSlider x={105} y={855} label="VGS(off)" value={cutoffVoltage} min={-8} max={-1} step={0.1} unit="V" onChange={setCutoffVoltage} />
      <IndustrialSlider x={105} y={890} label="Load Resistance" value={loadResistance} min={10} max={1000} step={10} unit="Ω" onChange={setLoadResistance} />
      <IndustrialSlider x={105} y={925} label="Temperature" value={temperature} min={25} max={125} step={1} unit="°C" onChange={setTemperature} />

      <SelectBox x={345} y={770} label="Flow Mode" value={flowMode} options={["Electron", "Conventional", "Both"]} onChange={setFlowMode} />
      <SelectBox x={345} y={812} label="Learning Mode" value={learningMode} options={["Beginner", "Advanced"]} onChange={setLearningMode} />

      <foreignObject x="345" y="854" width="165" height="48">
        <div className="text-[11px] text-gray-900">
          <div className="font-semibold">Training Stage</div>
          <input type="range" min={0} max={5} step={1} value={trainingStep} onChange={(e) => setTrainingStep(Number(e.target.value))} className="w-full" />
          <div>{trainingStep + 1}. {TRAINING_STEPS[trainingStep]}</div>
        </div>
      </foreignObject>

      <ControlButton x={345} y={920} type="run" onClick={onRun} />
      <ControlButton x={397} y={920} type="pause" onClick={onPause} />
      <ControlButton x={449} y={920} type="reset" onClick={onReset} />
      <ControlButton x={397} y={884} type="auto" onClick={onAuto} />
      <circle cx="390" cy="899" r="5" fill={autoplay ? COMPONENT.green : COMPONENT.gray} />
    </g>
  );
}

function OscilloscopePanel({
  gateVoltage, drainCurrent, running, autoScale, setRunning, setAutoScale,
}: {
  gateVoltage: number; drainCurrent: number; running: boolean; autoScale: boolean; setRunning: (v: boolean) => void; setAutoScale: (v: boolean) => void;
}) {
  const vMax = autoScale ? 6 : 10;
  const iMax = autoScale ? Math.max(100, drainCurrent * 1200) : 250;
  const vgsWave = Array.from({ length: 48 }, (_, i) => gateVoltage + (running ? Math.sin(i / 2) * 0.25 : 0));
  const idWave = Array.from({ length: 48 }, (_, i) => drainCurrent * 1000 + (running ? Math.sin(i / 1.8) * drainCurrent * 180 : 0));

  return (
    <g>
      <SvgPanel {...PATH.scopePanel} />
      <text x="545" y="783" fontSize={18} fontFamily={LABEL.fontFamily} fill={COMPONENT.black}>Dual Channel Oscilloscope</text>

      <rect x="545" y="805" width="250" height="135" rx="8" fill="#fbfbfb" stroke={COMPONENT.lightGray} strokeWidth={2} />
      <rect x="825" y="805" width="250" height="135" rx="8" fill="#fbfbfb" stroke={COMPONENT.lightGray} strokeWidth={2} />

      {Array.from({ length: 5 }).map((_, i) => (
        <React.Fragment key={i}>
          <line x1="555" y1={820 + i * 25} x2="785" y2={820 + i * 25} stroke="#e5e5e5" strokeWidth={1} />
          <line x1="835" y1={820 + i * 25} x2="1065" y2={820 + i * 25} stroke="#e5e5e5" strokeWidth={1} />
        </React.Fragment>
      ))}

      <path d={graphPath(vgsWave.map((v) => v + 6), 560, 820, 220, 95, vMax + 6)} fill="none" stroke={COMPONENT.blue} strokeWidth={3} />
      <path d={graphPath(idWave, 840, 820, 220, 95, iMax)} fill="none" stroke={COMPONENT.green} strokeWidth={3} />

      <text x="560" y="960" fontSize={14} fontFamily={LABEL.fontFamily} fill={COMPONENT.blue}>CH1 VGS</text>
      <text x="840" y="960" fontSize={14} fontFamily={LABEL.fontFamily} fill={COMPONENT.green}>CH2 ID</text>

      <foreignObject x="930" y="760" width="170" height="38">
        <div className="flex gap-2 text-[11px]">
          <button onClick={() => setRunning(!running)} className="rounded border px-2 py-1">{running ? "Pause" : "Run"}</button>
          <button onClick={() => setAutoScale(!autoScale)} className="rounded border px-2 py-1">Auto {autoScale ? "ON" : "OFF"}</button>
        </div>
      </foreignObject>
    </g>
  );
}

function DashboardCard({
  x, y, w, title, value, unit, color, gaugeValue, gaugeMax,
}: {
  x: number; y: number; w: number; title: string; value: string; unit?: string; color: string; gaugeValue?: number; gaugeMax?: number;
}) {
  const barW = gaugeValue !== undefined && gaugeMax ? clamp(gaugeValue / gaugeMax, 0, 1) * (w - 24) : 0;

  return (
    <g>
      <rect x={x} y={y} width={w} height={56} rx={12} fill="#ffffff" stroke="#d1d5db" strokeWidth={2} />
      <circle cx={x + 15} cy={y + 17} r={5} fill={color} />
      <text x={x + 27} y={y + 21} fontSize={11} fontFamily={LABEL.fontFamily} fill="#4b5563">{title}</text>
      <text x={x + 12} y={y + 42} fontSize={18} fontFamily={LABEL.fontFamily} fill={color} fontWeight={700}>
        {value}{unit && <tspan fontSize={11}> {unit}</tspan>}
      </text>
      {gaugeValue !== undefined && gaugeMax !== undefined && (
        <>
          <rect x={x + 12} y={y + 47} width={w - 24} height={5} rx={3} fill="#e5e7eb" />
          <rect x={x + 12} y={y + 47} width={barW} height={5} rx={3} fill={color} />
        </>
      )}
    </g>
  );
}

function DepletionDashboard({
  gateVoltage, cutoffVoltage, drainVoltage, drainCurrent, power, junctionTemp, regionState, flowMode, learningMode,
}: {
  gateVoltage: number; cutoffVoltage: number; drainVoltage: number; drainCurrent: number; power: number; junctionTemp: number; regionState: RegionState; flowMode: FlowMode; learningMode: LearningMode;
}) {
  const stateColor = getStateColor(regionState);
  const thermalColor = getThermalColor(junctionTemp);

  const beginnerCards = [
    { title: "VGS", value: gateVoltage.toFixed(1), unit: "V", color: COMPONENT.blue, gaugeValue: gateVoltage + 6, gaugeMax: 12 },
    { title: "VGS(off)", value: cutoffVoltage.toFixed(1), unit: "V", color: COMPONENT.red, gaugeValue: Math.abs(cutoffVoltage), gaugeMax: 8 },
    { title: "ID", value: (drainCurrent * 1000).toFixed(1), unit: "mA", color: COMPONENT.green, gaugeValue: drainCurrent * 1000, gaugeMax: 250 },
    { title: "Region", value: regionState, color: stateColor },
    { title: "Temperature", value: junctionTemp.toFixed(1), unit: "°C", color: thermalColor, gaugeValue: junctionTemp, gaugeMax: 150 },
  ];

  const advancedCards = [
    ...beginnerCards,
    { title: "VDS", value: drainVoltage.toFixed(1), unit: "V", color: COMPONENT.blueStroke, gaugeValue: drainVoltage, gaugeMax: 15 },
    { title: "Power", value: power.toFixed(2), unit: "W", color: power > 0.6 ? COMPONENT.red : COMPONENT.orange, gaugeValue: power, gaugeMax: 1.5 },
    { title: "Threshold", value: "0.0", unit: "V", color: COMPONENT.gray, gaugeValue: 0, gaugeMax: 6 },
    { title: "Flow Mode", value: flowMode, color: COMPONENT.blue },
    { title: "Mode", value: learningMode, color: COMPONENT.black },
  ];

  const cards = learningMode === "Beginner" ? beginnerCards : advancedCards;

  return (
    <g>
      <rect {...PATH.dashboardPanel} fill={COMPONENT.dashboard} stroke="#cbd5e1" strokeWidth={3} />

      <rect x="100" y="1012" width="1000" height="34" rx="12" fill={COMPONENT.dashboardDark} />
      <text x="122" y="1034" fontSize={17} fontFamily={LABEL.fontFamily} fill="#ffffff" fontWeight={700}>
        Depletion MOSFET Working Dashboard
      </text>

      <circle cx="455" cy="1028" r="7" fill={regionState === "CUTOFF" ? COMPONENT.gray : COMPONENT.green} />
      <text x="468" y="1033" fontSize={12} fill="#ffffff" fontFamily={LABEL.fontFamily}>Normally ON at VGS = 0</text>

      <circle cx="650" cy="1028" r="7" fill={stateColor} />
      <text x="663" y="1033" fontSize={12} fill="#ffffff" fontFamily={LABEL.fontFamily}>{regionState}</text>

      {cards.map((card, index) => {
        const col = index % 5;
        const row = Math.floor(index / 5);
        return (
          <DashboardCard key={card.title} x={100 + col * 198} y={1060 + row * 66} w={180} {...card} />
        );
      })}
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MosfetSimulatorSketch() {
  const [gateVoltage, setGateVoltage] = useState(MOSFET_LOGIC.defaultGateVoltage);
  const [drainVoltage, setDrainVoltage] = useState(8);
  const [cutoffVoltage, setCutoffVoltage] = useState(MOSFET_LOGIC.defaultCutoffVoltage);
  const [temperature, setTemperature] = useState(25);
  const [loadResistance, setLoadResistance] = useState(220);
  const [flowMode, setFlowMode] = useState<FlowMode>("Both");
  const [learningMode, setLearningMode] = useState<LearningMode>("Advanced");
  const [trainingStep, setTrainingStep] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [scopeRunning, setScopeRunning] = useState(true);
  const [autoScale, setAutoScale] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const stage = AUTOPLAY_STAGES[trainingStep];
    setGateVoltage(stage.gateVoltage);
    setDrainVoltage(stage.drainVoltage);

    const timer = window.setTimeout(() => {
      setTrainingStep((prev) => (prev + 1) % TRAINING_STEPS.length);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [autoplay, trainingStep]);

  const channelStrength = useMemo(
    () => getChannelStrength(gateVoltage, cutoffVoltage, temperature),
    [gateVoltage, cutoffVoltage, temperature]
  );

  const drainCurrent = useMemo(
    () =>
      calculateDrainCurrent({
        gateVoltage,
        cutoffVoltage,
        drainVoltage,
        loadResistance,
        temperature,
      }),
    [gateVoltage, cutoffVoltage, drainVoltage, loadResistance, temperature]
  );

  const regionState = useMemo(
    () => getRegionState(gateVoltage, cutoffVoltage, drainVoltage, channelStrength),
    [gateVoltage, cutoffVoltage, drainVoltage, channelStrength]
  );

  const active = regionState !== "CUTOFF";
  const power = drainVoltage * drainCurrent;
  const junctionTemp = temperature + power * MOSFET_LOGIC.thermalResistance;

  const resetSimulation = () => {
    setGateVoltage(0);
    setDrainVoltage(8);
    setCutoffVoltage(MOSFET_LOGIC.defaultCutoffVoltage);
    setTemperature(25);
    setLoadResistance(220);
    setFlowMode("Both");
    setLearningMode("Advanced");
    setTrainingStep(0);
    setAutoplay(false);
    setIsRunning(false);
  };

  return (
    <div className="w-full bg-white p-3 sm:p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <DepletionMosfetControlPanel
            autoScale={autoScale}
            drainCurrent={drainCurrent}
            gateVoltage={gateVoltage}
            drainVoltage={drainVoltage}
            cutoffVoltage={cutoffVoltage}
            temperature={temperature}
            loadResistance={loadResistance}
            flowMode={flowMode}
            learningMode={learningMode}
            trainingStep={trainingStep}
            autoplay={autoplay}
            running={scopeRunning}
            setGateVoltage={setGateVoltage}
            setDrainVoltage={setDrainVoltage}
            setCutoffVoltage={setCutoffVoltage}
            setTemperature={setTemperature}
            setLoadResistance={setLoadResistance}
            setFlowMode={setFlowMode}
            setLearningMode={setLearningMode}
            setTrainingStep={setTrainingStep}
            setRunning={setScopeRunning}
            setAutoScale={setAutoScale}
            onRun={() => setIsRunning(true)}
            onPause={() => setIsRunning(false)}
            onReset={resetSimulation}
            onAuto={() => {
              setAutoplay((value) => !value);
              setIsRunning(true);
            }}
          />

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
                    Simulation Canvas
                  </p>
                  <h2 className="mt-2 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                    Depletion MOSFET Working View
                  </h2>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:text-sm">
                  {regionState}
                </div>
              </div>

              <svg
                viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
                className="h-auto w-full"
                preserveAspectRatio="xMidYMin meet"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>{`
                  @keyframes electronFlowSourceToDrain {
                    0% { transform: translateX(-40px); }
                    100% { transform: translateX(95px); }
                  }
                  @keyframes currentFlowDrainToSource {
                    0% { transform: translateX(45px); }
                    100% { transform: translateX(-95px); }
                  }
                `}</style>

                <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill={COMPONENT.background} />
                <SvgPanel {...PATH.mainPanel} />
                <TopGateSlider
                  gateVoltage={gateVoltage}
                  cutoffVoltage={cutoffVoltage}
                  regionState={regionState}
                  onChange={setGateVoltage}
                />
                <circle cx={MAIN.topNode.cx} cy={MAIN.topNode.cy} r={NODE.terminal} fill="#fff" stroke={COMPONENT.black} strokeWidth={4} />
                <ActiveWire d={`M${MAIN.topNode.cx} ${MAIN.topNode.cy} H${MAIN.mainAmmeter.cx}`} active={active} strength={channelStrength} color={getStateColor(regionState)} />
                <Meter {...MAIN.mainAmmeter} label="A" color={getStateColor(regionState)} />
                <ActiveWire d={`M894 180 H${MAIN.drainWireEnd.x} V${MAIN.drainWireEnd.y}`} active={active} strength={channelStrength} color={getStateColor(regionState)} />
                <path d={`M${MAIN.gateWire.x} ${MAIN.gateWire.y1} V${MAIN.gateWire.y2}`} stroke={WIRE.color} strokeWidth={WIRE.width} fill="none" />
                <MainMosfetStructure
                  channelStrength={channelStrength}
                  regionState={regionState}
                  gateVoltage={gateVoltage}
                  cutoffVoltage={cutoffVoltage}
                  junctionTemp={junctionTemp}
                  power={power}
                  flowMode={flowMode}
                  isRunning={isRunning}
                  learningMode={learningMode}
                />

                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 Z" fill={COMPONENT.black} />
                  </marker>
                  <marker id="electronArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.blue} />
                  </marker>
                  <marker id="currentArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.orange} />
                  </marker>
                </defs>
              </svg>
            </div>

            {learningMode === "Advanced" ? (
              <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
                  Equation Panel
                </p>
                <h3 className="mt-2 text-lg font-black text-slate-900">Depletion MOSFET Formula View</h3>
                <div className="mt-4 space-y-2 text-sm font-medium text-slate-700">
                  <p>{`VGS(off) = ${cutoffVoltage.toFixed(1)}V`}</p>
                  <p>ID decreases as VGS becomes negative.</p>
                  <p>ID approx IDSS x (1 - VGS / VGS(off))^2</p>
                  <p>{`Power = VDS x ID = ${power.toFixed(2)}W`}</p>
                  <p>{`Live ID = ${(drainCurrent * 1000).toFixed(1)}mA`}</p>
                </div>
              </section>
            ) : null}

            <DepletionMosfetWorkingDashboard
              gateVoltage={gateVoltage}
              cutoffVoltage={cutoffVoltage}
              drainVoltage={drainVoltage}
              drainCurrent={drainCurrent}
              power={power}
              junctionTemp={junctionTemp}
              regionState={regionState}
              flowMode={flowMode}
              learningMode={learningMode}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
