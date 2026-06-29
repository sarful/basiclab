"use client";

import React, { useEffect, useMemo, useState } from "react";

import MosfetTypesControlPanel from "./MosfetTypesControlPanel";
import MosfetTypesDashboardPanel from "./MosfetTypesDashboardPanel";
import MosfetTypesGraphPanel from "./MosfetTypesGraphPanel";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = { x: 0, y: 0, width: 1200, height: 1320 };

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

const BASE_COMPONENT = {
  stroke: "#111827",
  strokeWidth: 4 * SCALE.component,
  fill: "#ffffff",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const COMPONENT = {
  bg: "#f8fafc",
  panel: "#ffffff",
  panelStroke: "#cbd5e1",
  dark: "#111827",
  black: "#111111",
  gray: "#64748b",
  lightGray: "#e5e7eb",
  substrate: "#ffe7b8",
  nRegion: "#b6e79a",
  pRegion: "#f8b4c4",
  oxide: "#d7b4ee",
  gate: "#2c2c2c",
  channel: "#e8f7ff",
  depletion: "#fecaca",
  electron: "#1d72e8",
  hole: "#ef4444",
  current: "#f59e0b",
  green: "#16a34a",
  blue: "#2563eb",
  orange: "#f59e0b",
  red: "#ef4444",
  purple: "#7c3aed",
};

const NODE = { terminal: 10, small: 5 };

const WIRE = {
  color: "#111827",
  width: BASE_WIRE_WIDTH * SCALE.wire,
  active: 6 * SCALE.wire,
};

const PATH = {
  topPanel: { x: 35, y: 25, width: 1130, height: 520, rx: 18 },
  leftDevice: { x: 70, y: 130, width: 500, height: 330, rx: 14 },
  rightDevice: { x: 630, y: 130, width: 500, height: 330, rx: 14 },
  controlPanel: { x: 35, y: 565, width: 360, height: 520, rx: 18 },
  scopePanel: { x: 415, y: 565, width: 350, height: 250, rx: 18 },
  graphPanel: { x: 785, y: 565, width: 380, height: 250, rx: 18 },
  dashboardPanel: { x: 415, y: 835, width: 750, height: 250, rx: 18 },
  lessonPanel: { x: 35, y: 1105, width: 360, height: 185, rx: 18 },
  truthPanel: { x: 415, y: 1105, width: 360, height: 185, rx: 18 },
  symbolPanel: { x: 795, y: 1105, width: 370, height: 185, rx: 18 },
};

const DEVICE_POS = {
  structure: { x: 105, y: 60 },
  body: { x: 0, y: 80, width: 350, height: 160, rx: 8 },
  sourcePath: "M20 80 H115 V125 Q105 150 75 150 H45 Q20 146 20 110 Z",
  drainPath: "M235 80 H330 V125 Q320 150 290 150 H260 Q235 146 235 110 Z",
  oxide: { x: 105, y: 77, width: 155, height: 16 },
  gate: { x: 120, y: 50, width: 125, height: 28 },
  gatePin: { x: 175, y: 35, width: 15, height: 17 },
  channelPath: "M115 112 C155 95 205 95 235 112 L235 142 C205 130 155 130 115 142 Z",
  depletionPath: "M115 108 C165 145 220 145 235 108 L235 165 C205 150 150 150 115 165 Z",
  pinchPath: "M220 104 C245 115 250 138 238 158 C225 148 210 142 192 142 C208 132 222 118 220 104 Z",
};

const LABEL = {
  fontFamily: "Arial, sans-serif",
  title: 22,
  normal: 13,
  small: 11,
};

/* =========================================================
   TYPES
========================================================= */

type MosfetType =
  | "N-Channel Enhancement"
  | "P-Channel Enhancement"
  | "N-Channel Depletion"
  | "P-Channel Depletion";

type FlowMode = "Carrier" | "Conventional" | "Both";
type LoadType = "Resistor" | "LED" | "DC Motor" | "Lamp";
type EduMode = "Beginner" | "Advanced" | "Expert";
type Lesson =
  | "MOSFET Structure"
  | "Enhancement MOSFET"
  | "Depletion MOSFET"
  | "N vs P Channel"
  | "Threshold Voltage"
  | "Saturation Region"
  | "Load Driving"
  | "Industrial Applications";

const MOSFET_TYPES: MosfetType[] = [
  "N-Channel Enhancement",
  "P-Channel Enhancement",
  "N-Channel Depletion",
  "P-Channel Depletion",
];

const FLOW_MODES: FlowMode[] = ["Carrier", "Conventional", "Both"];
const LOAD_TYPES: LoadType[] = ["Resistor", "LED", "DC Motor", "Lamp"];
const EDU_MODES: EduMode[] = ["Beginner", "Advanced", "Expert"];
const LESSONS: Lesson[] = [
  "MOSFET Structure",
  "Enhancement MOSFET",
  "Depletion MOSFET",
  "N vs P Channel",
  "Threshold Voltage",
  "Saturation Region",
  "Load Driving",
  "Industrial Applications",
];

const LOGIC = {
  gateMin: -6,
  gateMax: 6,
  drainMin: 0,
  drainMax: 12,
  threshold: 2.5,
  cutoff: -4,
  idMax: 0.28,
};

/* =========================================================
   HELPERS
========================================================= */

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function getMode(type: MosfetType) {
  return type.includes("Enhancement") ? "Enhancement" : "Depletion";
}

function getPolarity(type: MosfetType) {
  return type.startsWith("N") ? "N" : "P";
}

function getCarrier(type: MosfetType) {
  return getPolarity(type) === "N" ? "Electrons" : "Holes";
}

function getCarrierColor(type: MosfetType) {
  return getPolarity(type) === "N" ? COMPONENT.electron : COMPONENT.hole;
}

function getChannelStrength(type: MosfetType, vgs: number) {
  const mode = getMode(type);
  const polarity = getPolarity(type);

  if (mode === "Enhancement") {
    const overdrive =
      polarity === "N"
        ? vgs - LOGIC.threshold
        : -vgs - LOGIC.threshold;

    return clamp(overdrive / 4, 0, 1);
  }

  if (polarity === "N") {
    if (vgs <= LOGIC.cutoff) return 0;
    if (vgs < 0) return clamp(1 - vgs / LOGIC.cutoff, 0, 1);
    return clamp(1 + vgs / 6, 0, 1.5);
  }

  if (vgs >= Math.abs(LOGIC.cutoff)) return 0;
  if (vgs > 0) return clamp(1 - vgs / Math.abs(LOGIC.cutoff), 0, 1);
  return clamp(1 + Math.abs(vgs) / 6, 0, 1.5);
}

function getRegion(type: MosfetType, vgs: number, vds: number, strength: number) {
  const mode = getMode(type);
  if (strength <= 0.03) return mode === "Enhancement" ? "OFF" : "CUTOFF";
  if (mode === "Enhancement") {
    if (strength < 0.22) return "THRESHOLD";
    return vds > 5 ? "SATURATION" : "LINEAR";
  }
  if (strength < 0.35) return "WEAK CHANNEL";
  if (strength > 1) return vds > 5 ? "SATURATION" : "ENHANCED CONDUCTION";
  return "NORMALLY ON / DEPLETION";
}

function getDrainCurrent(type: MosfetType, vgs: number, vds: number, load: LoadType) {
  const strength = getChannelStrength(type, vgs);
  const loadFactor = load === "LED" ? 0.75 : load === "DC Motor" ? 1.2 : load === "Lamp" ? 1.05 : 1;
  return clamp(LOGIC.idMax * strength * (vds / LOGIC.drainMax) * loadFactor, 0, LOGIC.idMax);
}

function getStateColor(region: string) {
  if (region === "OFF" || region === "CUTOFF") return COMPONENT.gray;
  if (region.includes("THRESHOLD") || region.includes("WEAK")) return COMPONENT.orange;
  if (region.includes("SATURATION")) return COMPONENT.red;
  if (region.includes("ENHANCED")) return COMPONENT.blue;
  return COMPONENT.green;
}

function isWrongGatePolarity(type: MosfetType, vgs: number) {
  const mode = getMode(type);
  const polarity = getPolarity(type);
  if (mode === "Enhancement" && polarity === "N") return vgs < 0;
  if (mode === "Enhancement" && polarity === "P") return vgs > 0;
  return false;
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

function lessonText(lesson: Lesson) {
  const map: Record<Lesson, string> = {
    "MOSFET Structure": "A MOSFET has Source, Gate, Drain, oxide insulation, channel, and body/substrate. The Gate controls channel conductivity using electric field.",
    "Enhancement MOSFET": "Enhancement MOSFET is normally OFF. A correct gate voltage creates an inversion channel and allows drain current.",
    "Depletion MOSFET": "Depletion MOSFET is normally ON. A reverse gate voltage depletes the existing channel and can turn it OFF.",
    "N vs P Channel": "N-channel mainly uses electrons. P-channel mainly uses holes. Required gate polarity is opposite.",
    "Threshold Voltage": "Threshold voltage is the gate voltage where an enhancement MOSFET starts forming a useful channel.",
    "Saturation Region": "At high drain voltage, the channel pinches off near drain. Current becomes less dependent on VDS.",
    "Load Driving": "MOSFETs drive LED, motor, lamp, or resistor loads. Load type changes current and visible output behavior.",
    "Industrial Applications": "MOSFETs are used in motor drives, inverters, SMPS, LED drivers, battery systems, and industrial controllers.",
  };
  return map[lesson];
}

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function Panel({ x, y, width, height, rx }: { x: number; y: number; width: number; height: number; rx: number }) {
  return <rect x={x} y={y} width={width} height={height} rx={rx} fill={COMPONENT.panel} stroke={COMPONENT.panelStroke} strokeWidth={3} />;
}

function Text({ x, y, children, size = LABEL.normal, color = COMPONENT.black, weight = 400 }: { x: number; y: number; children: React.ReactNode; size?: number; color?: string; weight?: number }) {
  return <text x={x} y={y} fontFamily={LABEL.fontFamily} fontSize={size} fill={color} fontWeight={weight}>{children}</text>;
}

function StatusLed({ x, y, active, color = COMPONENT.green }: { x: number; y: number; active: boolean; color?: string }) {
  return <circle cx={x} cy={y} r={6} fill={active ? color : COMPONENT.gray} />;
}

function TooltipLabel({ x, y, label, detail, color = COMPONENT.black }: { x: number; y: number; label: string; detail: string; color?: string }) {
  return (
    <g className="cursor-help">
      <circle cx={x - 8} cy={y - 4} r={5} fill={color} />
      <title>{detail}</title>
      <Text x={x} y={y} size={10} color={color}>{label}</Text>
    </g>
  );
}

function SelectBox({ x, y, label, value, options, onChange }: { x: number; y: number; label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <foreignObject x={x} y={y} width={300} height={52}>
      <label className="block text-[11px] font-semibold text-gray-900">
        {label}
        <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-7 w-full rounded border bg-white px-2 text-[11px]">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
    </foreignObject>
  );
}

function Slider({ x, y, label, value, min, max, step, unit, onChange }: { x: number; y: number; label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  const w = 285;
  const knob = x + ((value - min) / (max - min)) * w;

  return (
    <g>
      <Text x={x} y={y - 8} size={11}>{label}: {value.toFixed(1)}{unit}</Text>
      <line x1={x} y1={y + 12} x2={x + w} y2={y + 12} stroke="#d1d5db" strokeWidth={7} strokeLinecap="round" />
      <line x1={x} y1={y + 12} x2={knob} y2={y + 12} stroke={COMPONENT.blue} strokeWidth={7} strokeLinecap="round" />
      <circle cx={knob} cy={y + 12} r={10} fill={COMPONENT.blue} />
      <foreignObject x={x - 8} y={y - 5} width={w + 16} height={36}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-8 w-full cursor-pointer opacity-0" />
      </foreignObject>
    </g>
  );
}

function Button({ x, y, label, onClick }: { x: number; y: number; label: string; onClick: () => void }) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect x={x} y={y} width={82} height={30} rx={8} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
      <Text x={x + 14} y={y + 20} size={11} weight={700}>{label}</Text>
    </g>
  );
}

/* =========================================================
   EXPORTABLE REUSABLE COMPONENTS
========================================================= */

export function MosfetSymbol({ type, x, y, scale = 0.85 }: { type: MosfetType; x: number; y: number; scale?: number }) {
  const mode = getMode(type);
  const polarity = getPolarity(type);
  const arrowPoints = polarity === "N" ? "70,58 88,48 88,68" : "90,58 72,48 72,68";

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-20" y="-20" width="150" height="140" rx="14" fill="#fff" stroke="#d1d5db" strokeWidth={2} />
      <line x1="28" y1="15" x2="28" y2="95" stroke={COMPONENT.black} strokeWidth={4} />
      <line x1="50" y1="18" x2="50" y2="92" stroke={COMPONENT.black} strokeWidth={mode === "Enhancement" ? 3 : 6} />
      <line x1="50" y1="25" x2="100" y2="25" stroke={COMPONENT.black} strokeWidth={4} />
      <line x1="50" y1="85" x2="100" y2="85" stroke={COMPONENT.black} strokeWidth={4} />
      <line x1="100" y1="25" x2="100" y2="0" stroke={COMPONENT.black} strokeWidth={4} />
      <line x1="100" y1="85" x2="100" y2="110" stroke={COMPONENT.black} strokeWidth={4} />
      <polygon points={arrowPoints} fill={COMPONENT.black} />
    </g>
  );
}

export function MosfetStructure({ x, y, title, type, vgs, vds, flowMode, loadType, isRunning, eduMode }: any) {
  const mode = getMode(type);
  const polarity = getPolarity(type);
  const carrierColor = getCarrierColor(type);
  const strength = getChannelStrength(type, vgs);
  const id = getDrainCurrent(type, vgs, vds, loadType);
  const region = getRegion(type, vgs, vds, strength);
  const active = strength > 0.03;
  const showDepletion = mode === "Depletion" && ((polarity === "N" && vgs < 0) || (polarity === "P" && vgs > 0));
  const regionFill = polarity === "N" ? COMPONENT.nRegion : COMPONENT.pRegion;
  const fieldCount = Math.round(Math.abs(vgs) * 1.2);
  const channelWidth = active ? 2 + clamp(strength, 0, 1.5) * 6 : 0;
  const channelOpacity = active ? 0.18 + clamp(strength, 0, 1) * 0.82 : 0;
  const power = vds * id;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="500" height="330" rx="14" fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
      <Text x={18} y={28} size={15} weight={700}>{title}: {type}</Text>
      <Text x={18} y={48} size={11} color="#475569">{mode} • {polarity}-Channel • {getCarrier(type)}</Text>
      <MosfetSymbol type={type} x={25} y={75} scale={0.62} />

      <g transform={`translate(${DEVICE_POS.structure.x} ${DEVICE_POS.structure.y})`}>
        <rect {...DEVICE_POS.body} fill={COMPONENT.substrate} stroke={COMPONENT.black} strokeWidth={3} />
        <path d={DEVICE_POS.sourcePath} fill={regionFill} stroke={COMPONENT.black} strokeWidth={2} />
        <path d={DEVICE_POS.drainPath} fill={regionFill} stroke={COMPONENT.black} strokeWidth={2} />
        <rect {...DEVICE_POS.oxide} fill={COMPONENT.oxide} stroke={COMPONENT.black} strokeWidth={1.5} />
        <rect {...DEVICE_POS.gate} fill={COMPONENT.gate} />
        <rect {...DEVICE_POS.gatePin} fill={COMPONENT.black} />

        {eduMode !== "Beginner" && Array.from({ length: fieldCount }).map((_, i) => (
          <path key={i} d={`M${120 + i * 13} 82 C${116 + i * 13} 100 ${118 + i * 13} 120 ${125 + i * 13} 142`} stroke={vgs >= 0 ? COMPONENT.red : COMPONENT.blue} strokeWidth={1.4} fill="none" markerEnd="url(#fieldArrow)" opacity={0.4 + Math.abs(vgs) / 10} />
        ))}

        {showDepletion && (
          <path d={DEVICE_POS.depletionPath} fill={COMPONENT.depletion} stroke={COMPONENT.red} strokeWidth={2} strokeDasharray="8 6" opacity={0.3 + Math.abs(vgs) / 8} />
        )}

        <path d={DEVICE_POS.channelPath} fill={COMPONENT.channel} stroke={carrierColor} strokeWidth={channelWidth} opacity={channelOpacity} />

        {eduMode !== "Beginner" && active && Array.from({ length: Math.round(8 + clamp(strength, 0, 1) * 16) }).map((_, i) => (
          <circle key={i} cx={125 + (i % 8) * 13} cy={116 + Math.floor(i / 8) * 15} r={3.5} fill={carrierColor} opacity={0.85} />
        ))}

        {region.includes("SATURATION") && (
          <path d={DEVICE_POS.pinchPath} fill={COMPONENT.substrate} stroke={COMPONENT.red} strokeWidth={3} opacity={0.75} />
        )}

        <FlowAnimation polarity={polarity} strength={strength} flowMode={flowMode} isRunning={isRunning} />

        <TooltipLabel x={35} y={72} label="Source" detail="Source: terminal where carriers enter the channel." />
        <TooltipLabel x={160} y={45} label="Gate" detail="Gate: insulated control terminal that creates electric field." />
        <TooltipLabel x={270} y={72} label="Drain" detail="Drain: terminal where controlled current exits." />
        <TooltipLabel x={145} y={96} label="Oxide" detail="Thin oxide insulation between gate and semiconductor." color={COMPONENT.purple} />
        <TooltipLabel x={145} y={182} label="Substrate" detail="Body/substrate region supporting source, drain, and channel." />
        <TooltipLabel x={145} y={135} label="Channel" detail="Conductive path controlled by gate voltage." color={carrierColor} />
      </g>

      <LoadMini x={380} y={245} type={loadType} id={id} power={power} />

      <rect x="18" y="255" width="340" height="55" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
      <StatusLed x={34} y={275} active={active} color={getStateColor(region)} />
      <Text x={48} y={280} size={11}>Region: {region}</Text>
      <Text x={48} y={300} size={11}>VGS {vgs.toFixed(1)}V • VDS {vds.toFixed(1)}V • ID {(id * 1000).toFixed(1)}mA</Text>
    </g>
  );
}

function FlowAnimation({ polarity, strength, flowMode, isRunning }: any) {
  const active = strength > 0.03;
  const carrierColor = polarity === "N" ? COMPONENT.electron : COMPONENT.hole;
  const showCarrier = flowMode === "Carrier" || flowMode === "Both";
  const showConventional = flowMode === "Conventional" || flowMode === "Both";

  return (
    <g>
      {showCarrier && [0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={125 + i * 24} cy={128} r={4} fill={carrierColor} opacity={active ? 0.8 : 0} style={{ animation: isRunning && active ? `carrierFlow ${2 - clamp(strength, 0, 1)}s linear infinite` : "none", animationDelay: `${i * 0.12}s` }} />
      ))}
      {showConventional && [0, 1, 2, 3].map((i) => (
        <line key={i} x1={225 - i * 25} y1={150} x2={211 - i * 25} y2={150} stroke={COMPONENT.current} strokeWidth={3} markerEnd="url(#currentArrow)" opacity={active ? 0.8 : 0} style={{ animation: isRunning && active ? `currentFlow ${2 - clamp(strength, 0, 1)}s linear infinite` : "none", animationDelay: `${i * 0.12}s` }} />
      ))}
    </g>
  );
}

function LoadMini({ x, y, type, id, power }: { x: number; y: number; type: LoadType; id: number; power: number }) {
  const intensity = clamp(id * 8 + power * 0.8, 0, 1);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="95" height="58" rx="10" fill="#fff" stroke="#cbd5e1" />
      <Text x={10} y={17} size={10}>{type}</Text>
      {type === "LED" && <circle cx="48" cy="37" r="12" fill={COMPONENT.red} opacity={0.2 + intensity * 0.8} />}
      {type === "Lamp" && <circle cx="48" cy="37" r="14" fill={COMPONENT.orange} opacity={0.15 + intensity * 0.85} />}
      {type === "DC Motor" && <g><circle cx="48" cy="37" r="14" fill="#fff" stroke={COMPONENT.black} /><path d="M48 23 V51 M34 37 H62" stroke={COMPONENT.blue} strokeWidth={3} style={{ animation: intensity > 0.05 ? `spin ${1.2 - intensity * 0.8}s linear infinite` : "none", transformOrigin: "48px 37px" }} /></g>}
      {type === "Resistor" && <path d="M18 38 h10 l7 -10 l10 20 l10 -20 l7 10 h12" fill="none" stroke={COMPONENT.black} strokeWidth={2} />}
    </g>
  );
}

export function ControlPanel({ typeA, typeB, vgs, vds, flowMode, loadType, eduMode, lesson, isRunning, setTypeA, setTypeB, setVgs, setVds, setFlowMode, setLoadType, setEduMode, setLesson, setIsRunning, singleShot, clearTrace }: any) {
  return (
    <g>
      <Panel {...PATH.controlPanel} />
      <Text x={60} y={600} size={18} weight={700}>Synchronized Controls</Text>
      <SelectBox x={60} y={615} label="MOSFET A" value={typeA} options={MOSFET_TYPES} onChange={setTypeA} />
      <SelectBox x={60} y={667} label="MOSFET B" value={typeB} options={MOSFET_TYPES} onChange={setTypeB} />
      <SelectBox x={60} y={719} label="Flow Mode" value={flowMode} options={FLOW_MODES} onChange={setFlowMode} />
      <SelectBox x={60} y={771} label="Load Type" value={loadType} options={LOAD_TYPES} onChange={setLoadType} />
      <Slider x={60} y={850} label="Gate Voltage" value={vgs} min={-6} max={6} step={0.1} unit="V" onChange={setVgs} />
      <Slider x={60} y={910} label="Drain Voltage" value={vds} min={0} max={12} step={0.1} unit="V" onChange={setVds} />
      <SelectBox x={60} y={945} label="Education Mode" value={eduMode} options={EDU_MODES} onChange={setEduMode} />
      <SelectBox x={210} y={945} label="Lesson" value={lesson} options={LESSONS} onChange={setLesson} />
      <Button x={60} y={1040} label="Run" onClick={() => setIsRunning(true)} />
      <Button x={150} y={1040} label="Pause" onClick={() => setIsRunning(false)} />
      <Button x={240} y={1040} label="Single" onClick={singleShot} />
      <Button x={60} y={1000} label="Clear" onClick={clearTrace} />
      <StatusLed x={340} y={1055} active={isRunning} />
    </g>
  );
}

export function ScopePanel({ vgsHistory, idHistory, running, autoScale, timeScale, setRunning, setAutoScale, setTimeScale }: any) {
  const visible = Math.max(20, Math.round(60 / timeScale));
  const vgs = vgsHistory.slice(-visible).map((v: number) => v + 6);
  const id = idHistory.slice(-visible);

  return (
    <g>
      <Panel {...PATH.scopePanel} />
      <Text x={440} y={600} size={18} weight={700}>Dual Channel Scope</Text>
      <rect x="445" y="625" width="290" height="145" rx="8" fill="#020617" />
      {Array.from({ length: 6 }).map((_, i) => <g key={i}><line x1="455" y1={640 + i * 24} x2="725" y2={640 + i * 24} stroke="#1e293b" /><line x1={455 + i * 54} y1="635" x2={455 + i * 54} y2="760" stroke="#1e293b" /></g>)}
      <path d={graphPath(vgs, 455, 638, 270, 118, autoScale ? 12 : 15)} stroke={COMPONENT.blue} strokeWidth={2.5} fill="none" />
      <path d={graphPath(id, 455, 638, 270, 118, autoScale ? Math.max(50, Math.max(...id, 1)) : 300)} stroke={COMPONENT.green} strokeWidth={2.5} fill="none" />
      <Text x={445} y={795} size={12} color={COMPONENT.blue}>CH1 VGS</Text>
      <Text x={530} y={795} size={12} color={COMPONENT.green}>CH2 ID</Text>
      <foreignObject x="620" y="780" width="130" height="28"><div className="flex gap-1 text-[10px]"><button onClick={() => setRunning(!running)} className="rounded border px-1">{running ? "Pause" : "Run"}</button><button onClick={() => setAutoScale(!autoScale)} className="rounded border px-1">Auto</button></div></foreignObject>
      <Slider x={445} y={835} label="Time Scale" value={timeScale} min={0.5} max={3} step={0.1} unit="x" onChange={setTimeScale} />
    </g>
  );
}

export function LegacyGraphPanel({ typeA, typeB, vgs, vds, loadType }: any) {
  const graphX = 815, graphY = 625, graphW = 310, graphH = 145;
  const transferA = Array.from({ length: 40 }, (_, i) => getDrainCurrent(typeA, -6 + (i / 39) * 12, vds, loadType) * 1000);
  const transferB = Array.from({ length: 40 }, (_, i) => getDrainCurrent(typeB, -6 + (i / 39) * 12, vds, loadType) * 1000);
  const opX = graphX + ((vgs + 6) / 12) * graphW;
  const opY = graphY + graphH - (getDrainCurrent(typeA, vgs, vds, loadType) * 1000 / 300) * graphH;

  return (
    <g>
      <Panel {...PATH.graphPanel} />
      <Text x={810} y={600} size={18} weight={700}>Transfer Characteristics</Text>
      <rect x={graphX} y={graphY} width={graphW} height={graphH} rx={8} fill="#ffffff" stroke="#cbd5e1" />
      {Array.from({ length: 6 }).map((_, i) => <g key={i}><line x1={graphX + 10} y1={graphY + 15 + i * 24} x2={graphX + graphW - 10} y2={graphY + 15 + i * 24} stroke="#e5e7eb" /><line x1={graphX + 20 + i * 54} y1={graphY + 10} x2={graphX + 20 + i * 54} y2={graphY + graphH - 10} stroke="#e5e7eb" /></g>)}
      <path d={graphPath(transferA, graphX + 10, graphY + 12, graphW - 20, graphH - 24, 300)} fill="none" stroke={COMPONENT.blue} strokeWidth={3} />
      <path d={graphPath(transferB, graphX + 10, graphY + 12, graphW - 20, graphH - 24, 300)} fill="none" stroke={COMPONENT.red} strokeWidth={3} />
      <circle cx={opX} cy={opY} r={6} fill={COMPONENT.orange} stroke={COMPONENT.black} />
      <Text x={graphX} y={graphY + graphH + 25} size={12}>ID vs VGS • operating point marker</Text>
    </g>
  );
}

export function DashboardPanel({ typeA, typeB, vgs, vds, loadType, flowMode, eduMode }: any) {
  const data = [typeA, typeB].map((type) => {
    const id = getDrainCurrent(type, vgs, vds, loadType);
    const region = getRegion(type, vgs, vds, getChannelStrength(type, vgs));
    return { type, id, region, power: id * vds };
  });

  return (
    <g>
      <Panel {...PATH.dashboardPanel} />
      <rect x="435" y="855" width="710" height="34" rx="10" fill={COMPONENT.dark} />
      <Text x={455} y={877} size={16} color="#fff" weight={700}>SCADA Industrial Dashboard</Text>
      <StatusLed x={690} y={872} active />
      <Text x={705} y={876} size={12} color="#fff">ONLINE</Text>
      <StatusLed x={775} y={872} active={data.some((d) => d.power > 0.8)} color={COMPONENT.red} />
      <Text x={790} y={876} size={12} color="#fff">ALARM</Text>

      {data.map((d, row) => (
        <g key={d.type}>
          <Text x={450} y={920 + row * 75} size={14} weight={700}>MOSFET {row === 0 ? "A" : "B"}: {d.type}</Text>
          {[
            ["Region", d.region], ["VGS", `${vgs.toFixed(1)}V`], ["VDS", `${vds.toFixed(1)}V`],
            ["VTH/Voff", d.type.includes("Enhancement") ? `${LOGIC.threshold}V` : `${LOGIC.cutoff}V`],
            ["ID", `${(d.id * 1000).toFixed(1)}mA`], ["Power", `${d.power.toFixed(2)}W`],
            ["Carrier", getCarrier(d.type)], ["Load", loadType], ["Flow", flowMode], ["Mode", eduMode],
          ].map(([k, v], i) => (
            <g key={k}>
              <rect x={450 + (i % 5) * 135} y={930 + row * 75 + Math.floor(i / 5) * 28} width="124" height="22" rx="6" fill="#fff" stroke="#d1d5db" />
              <StatusLed x={460 + (i % 5) * 135} y={944 + row * 75 + Math.floor(i / 5) * 28} active color={getStateColor(d.region)} />
              <Text x={470 + (i % 5) * 135} y={948 + row * 75 + Math.floor(i / 5) * 28} size={10}>{k}: {v}</Text>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

function LessonGuidePanel({ lesson }: { lesson: Lesson }) {
  return (
    <g>
      <Panel {...PATH.lessonPanel} />
      <Text x={60} y={1135} size={18} weight={700}>Lesson Guide</Text>
      <Text x={60} y={1160} size={13} color={COMPONENT.blue}>{lesson}</Text>
      <foreignObject x="60" y="1175" width="315" height="90">
        <p className="text-[12px] leading-5 text-slate-700">{lessonText(lesson)}</p>
      </foreignObject>
    </g>
  );
}

function TruthTablePanel({ vgs }: { vgs: number }) {
  return (
    <g>
      <Panel {...PATH.truthPanel} />
      <Text x={440} y={1135} size={18} weight={700}>ON/OFF Truth Table</Text>
      {MOSFET_TYPES.map((type, i) => {
        const s = getChannelStrength(type, vgs);
        const on = s > 0.03;
        return (
          <g key={type}>
            <rect x="440" y={1152 + i * 31} width="315" height="25" rx="7" fill="#fff" stroke="#d1d5db" />
            <StatusLed x={455} y={1167 + i * 31} active={on} color={on ? COMPONENT.green : COMPONENT.red} />
            <Text x={468} y={1171 + i * 31} size={11}>{type}</Text>
            <Text x={670} y={1171 + i * 31} size={11} color={on ? COMPONENT.green : COMPONENT.red}>{on ? "ON" : "OFF"}</Text>
          </g>
        );
      })}
    </g>
  );
}

function SymbolComparisonPanel() {
  return (
    <g>
      <Panel {...PATH.symbolPanel} />
      <Text x={820} y={1135} size={18} weight={700}>Symbol Comparison</Text>
      {MOSFET_TYPES.map((type, i) => (
        <g key={type}>
          <MosfetSymbol type={type} x={825 + (i % 2) * 170} y={1160 + Math.floor(i / 2) * 70} scale={0.38} />
          <Text x={875 + (i % 2) * 170} y={1175 + Math.floor(i / 2) * 70} size={10}>{type.replace("-Channel ", " ")}</Text>
        </g>
      ))}
    </g>
  );
}

function AlarmPanel({ typeA, typeB, vgs, vds, loadType }: any) {
  const data = [typeA, typeB].map((t) => ({
    type: t,
    id: getDrainCurrent(t, vgs, vds, loadType),
    power: getDrainCurrent(t, vgs, vds, loadType) * vds,
    region: getRegion(t, vgs, vds, getChannelStrength(t, vgs)),
  }));

  const alarms = [
    ["High ID", data.some((d) => d.id > 0.2)],
    ["High Power", data.some((d) => d.power > 0.8)],
    ["Wrong Gate Polarity", isWrongGatePolarity(typeA, vgs) || isWrongGatePolarity(typeB, vgs)],
    ["Cutoff Condition", data.some((d) => d.region === "CUTOFF" || d.region === "OFF")],
  ] as const;

  return (
    <g>
      <rect x="910" y="55" width="225" height="72" rx="12" fill="#fff" stroke="#cbd5e1" />
      <Text x={925} y={77} size={14} weight={700}>Alarm Panel</Text>
      {alarms.map(([label, active], i) => (
        <g key={label}>
          <StatusLed x={930 + (i % 2) * 105} y={96 + Math.floor(i / 2) * 20} active={active} color={active ? COMPONENT.red : COMPONENT.green} />
          <Text x={942 + (i % 2) * 105} y={100 + Math.floor(i / 2) * 20} size={10}>{label}</Text>
        </g>
      ))}
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MosfetTypesSimulator() {
  const [typeA, setTypeA] = useState<MosfetType>("N-Channel Enhancement");
  const [typeB, setTypeB] = useState<MosfetType>("P-Channel Depletion");
  const [vgs, setVgs] = useState(0);
  const [vds, setVds] = useState(6);
  const [flowMode, setFlowMode] = useState<FlowMode>("Both");
  const [loadType, setLoadType] = useState<LoadType>("Resistor");
  const [eduMode, setEduMode] = useState<EduMode>("Advanced");
  const [lesson, setLesson] = useState<Lesson>("MOSFET Structure");
  const [isRunning, setIsRunning] = useState(true);
  const [scopeRunning, setScopeRunning] = useState(true);
  const [autoScale, setAutoScale] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [vgsHistory, setVgsHistory] = useState<number[]>(Array(60).fill(0));
  const [idHistory, setIdHistory] = useState<number[]>(Array(60).fill(0));

  const idA = useMemo(() => getDrainCurrent(typeA, vgs, vds, loadType), [typeA, vgs, vds, loadType]);
  const idB = useMemo(() => getDrainCurrent(typeB, vgs, vds, loadType), [typeB, vgs, vds, loadType]);

  useEffect(() => {
    if (!scopeRunning) return;
    const t = window.setInterval(() => {
      setVgsHistory((p) => [...p.slice(-119), vgs + Math.sin(Date.now() / 350) * 0.2]);
      setIdHistory((p) => [...p.slice(-119), ((idA + idB) / 2) * 1000]);
    }, 250);
    return () => window.clearInterval(t);
  }, [scopeRunning, vgs, idA, idB]);

  const clearTrace = () => {
    setVgsHistory(Array(60).fill(0));
    setIdHistory(Array(60).fill(0));
  };

  const singleShot = () => {
    setScopeRunning(false);
    setVgsHistory((p) => [...p.slice(-119), vgs]);
    setIdHistory((p) => [...p.slice(-119), ((idA + idB) / 2) * 1000]);
  };

  return (
    <div className="w-full bg-slate-100 p-3 sm:p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <MosfetTypesControlPanel
            typeA={typeA}
            typeB={typeB}
            vgs={vgs}
            vds={vds}
            flowMode={flowMode}
            loadType={loadType}
            eduMode={eduMode}
            lesson={lesson}
            isRunning={isRunning}
            vgsHistory={vgsHistory}
            idHistory={idHistory}
            scopeRunning={scopeRunning}
            autoScale={autoScale}
            timeScale={timeScale}
            setTypeA={setTypeA}
            setTypeB={setTypeB}
            setVgs={setVgs}
            setVds={setVds}
            setFlowMode={setFlowMode}
            setLoadType={setLoadType}
            setEduMode={setEduMode}
            setLesson={setLesson}
            setIsRunning={setIsRunning}
            setScopeRunning={setScopeRunning}
            setAutoScale={setAutoScale}
            setTimeScale={setTimeScale}
            singleShot={singleShot}
            clearTrace={clearTrace}
          />

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
                    Simulation Canvas
                  </p>
                  <h2 className="mt-2 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                    Complete MOSFET Technology Training Lab
                  </h2>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:text-sm">
                  {lesson}
                </div>
              </div>

              <svg viewBox="0 0 1200 560" className="h-auto w-full" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg">
                <style>{`
                  @keyframes carrierFlow { 0% { transform: translateX(-45px); } 100% { transform: translateX(105px); } }
                  @keyframes currentFlow { 0% { transform: translateX(45px); } 100% { transform: translateX(-105px); } }
                  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                `}</style>
                <rect width="1200" height="560" fill={COMPONENT.bg} />
                <Panel x={35} y={25} width={1130} height={500} rx={18} />
                <Text x={60} y={65} size={22} weight={700}>Complete MOSFET Technology Training Lab</Text>
                <Text x={60} y={90} size={13} color="#475569">Responsive split-screen comparison across MOSFET families.</Text>
                <AlarmPanel typeA={typeA} typeB={typeB} vgs={vgs} vds={vds} loadType={loadType} />
                <MosfetStructure x={70} y={130} title="MOSFET A" type={typeA} vgs={vgs} vds={vds} flowMode={flowMode} loadType={loadType} isRunning={isRunning} eduMode={eduMode} />
                <MosfetStructure x={630} y={130} title="MOSFET B" type={typeB} vgs={vgs} vds={vds} flowMode={flowMode} loadType={loadType} isRunning={isRunning} eduMode={eduMode} />
                <defs>
                  <marker id="currentArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.current} />
                  </marker>
                  <marker id="fieldArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.red} />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <MosfetTypesGraphPanel typeA={typeA} typeB={typeB} vgs={vgs} vds={vds} loadType={loadType} />

              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <h3 className="text-lg font-black text-slate-900">Lesson Guide</h3>
                <p className="mt-2 text-sm font-bold text-blue-700">{lesson}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{lessonText(lesson)}</p>
              </div>
            </div>

            <MosfetTypesDashboardPanel
              typeA={typeA}
              typeB={typeB}
              vgs={vgs}
              vds={vds}
              loadType={loadType}
              flowMode={flowMode}
              eduMode={eduMode}
            />

            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-4">
              <svg viewBox="0 1090 1200 220" className="h-auto w-full" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg">
                <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill={COMPONENT.bg} />
                <LessonGuidePanel lesson={lesson} />
                <TruthTablePanel vgs={vgs} />
                <SymbolComparisonPanel />
              </svg>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
