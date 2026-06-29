"use client";

import React, { useEffect, useMemo, useState } from "react";

import JFETNChannelSymbol from "@/src/library/electronics-symbol-library/jfets/JFETNChannelSymbol";
import JFETPChannelSymbol from "@/src/library/electronics-symbol-library/jfets/JFETPChannelSymbol";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = { x: 0, y: 0, width: 1200, height: 1080 };

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

  nType: "#bbf7d0",
  nStroke: "#16a34a",
  pType: "#fed7aa",
  pStroke: "#ea580c",
  depletion: "#c4b5fd",
  depletionStroke: "#7c3aed",
  junction: "#7c3aed",
  metal: "#374151",

  electron: "#2563eb",
  conventional: "#f59e0b",
  yellow: "#facc15",
  red: "#ef4444",
  green: "#16a34a",
  blue: "#2563eb",
  orange: "#f59e0b",
};

const NODE = { terminal: 11, small: 6 };

const WIRE = {
  color: "#111827",
  width: BASE_WIRE_WIDTH * SCALE.wire,
  thin: 2 * SCALE.wire,
};

const PATH = {
  overviewPanel: { x: 35, y: 35, width: 260, height: 530, rx: 18 },
  mainPanel: { x: 315, y: 35, width: 560, height: 530, rx: 18 },
  explorerPanel: { x: 895, y: 35, width: 270, height: 530, rx: 18 },
  dashboardPanel: { x: 35, y: 590, width: 1130, height: 450, rx: 18 },

  deviceBody: { x: 405, y: 165, width: 380, height: 250, rx: 18 },
  channel: { x: 455, y: 245, width: 280, height: 90, rx: 28 },
  upperGate: { x: 505, y: 175, width: 180, height: 70, rx: 16 },
  lowerGate: { x: 505, y: 335, width: 180, height: 70, rx: 16 },

  sourceMetal: { x: 425, y: 258, width: 35, height: 64, rx: 6 },
  drainMetal: { x: 730, y: 258, width: 35, height: 64, rx: 6 },
  gateMetalTop: { x: 565, y: 140, width: 60, height: 35, rx: 6 },
  gateMetalBottom: { x: 565, y: 405, width: 60, height: 35, rx: 6 },
};

const LABEL = {
  fontFamily: "Arial, sans-serif",
  title: 22,
  heading: 16,
  normal: 13,
  small: 11,
};

/* =========================================================
   TYPES
========================================================= */

type JfetType = "N-Channel JFET" | "P-Channel JFET";
type Terminal = "Source" | "Gate" | "Drain";
type RegionPick = "Channel" | "Gate Region" | "Junction" | "Metal Contact";
type FlowMode = "Electron" | "Conventional" | "Both";
type WorkingRegion =
  | "Normally ON"
  | "Depletion Begins"
  | "Weak Channel"
  | "Pinch-Off"
  | "Cutoff";

const LEARNING_STEPS = [
  "JFET normally ON",
  "Apply reverse gate voltage",
  "Depletion region expands",
  "Channel narrows",
  "Pinch-Off appears",
  "Cutoff reached",
];

/* =========================================================
   LOGIC
========================================================= */

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function isN(type: JfetType) {
  return type === "N-Channel JFET";
}

function reverseBiasAmount(type: JfetType, vgs: number) {
  return isN(type) ? Math.abs(Math.min(0, vgs)) : Math.max(0, vgs);
}

function normalizeControl(type: JfetType, vgs: number, vgsOffAbs: number) {
  const rb = reverseBiasAmount(type, vgs);
  return clamp(rb / vgsOffAbs, 0, 1);
}

function channelWidthPercent(type: JfetType, vgs: number, vgsOffAbs: number) {
  return clamp(1 - normalizeControl(type, vgs, vgsOffAbs), 0, 1);
}

function drainCurrent(type: JfetType, vgs: number, idssMa: number, vgsOffAbs: number) {
  const control = normalizeControl(type, vgs, vgsOffAbs);
  return idssMa * Math.pow(1 - control, 2);
}

function getRegion(type: JfetType, vgs: number, vds: number, vgsOffAbs: number): WorkingRegion {
  const width = channelWidthPercent(type, vgs, vgsOffAbs);
  if (width <= 0.03) return "Cutoff";
  if (vds > 12 && width < 0.75) return "Pinch-Off";
  if (width < 0.3) return "Weak Channel";
  if (width < 0.85) return "Depletion Begins";
  return "Normally ON";
}

function regionColor(region: WorkingRegion) {
  if (region === "Cutoff") return COMPONENT.red;
  if (region === "Pinch-Off") return COMPONENT.orange;
  if (region === "Weak Channel") return COMPONENT.yellow;
  if (region === "Depletion Begins") return COMPONENT.blue;
  return COMPONENT.green;
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

function Panel({ x, y, width, height, rx }: { x: number; y: number; width: number; height: number; rx: number }) {
  return <rect x={x} y={y} width={width} height={height} rx={rx} fill={COMPONENT.panel} stroke={COMPONENT.panelStroke} strokeWidth={3} />;
}

function Text({ x, y, children, size = LABEL.normal, color = COMPONENT.black, weight = 400 }: {
  x: number; y: number; children: React.ReactNode; size?: number; color?: string; weight?: number;
}) {
  return <text x={x} y={y} fontFamily={LABEL.fontFamily} fontSize={size} fill={color} fontWeight={weight}>{children}</text>;
}

function Button({ x, y, width, label, active, onClick }: {
  x: number; y: number; width: number; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect x={x} y={y} width={width} height={34} rx={9} fill={active ? COMPONENT.dark : "#fff"} stroke={active ? COMPONENT.dark : COMPONENT.panelStroke} strokeWidth={2} />
      <Text x={x + 13} y={y + 22} size={12} color={active ? "#fff" : COMPONENT.black} weight={700}>{label}</Text>
    </g>
  );
}

function Slider({ x, y, label, value, min, max, step, unit, onChange }: {
  x: number; y: number; label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void;
}) {
  const w = 205;
  const knob = x + ((value - min) / (max - min)) * w;
  return (
    <g>
      <Text x={x} y={y - 8} size={11}>{label}: {value.toFixed(1)}{unit}</Text>
      <line x1={x} y1={y + 12} x2={x + w} y2={y + 12} stroke="#cbd5e1" strokeWidth={7} strokeLinecap="round" />
      <line x1={x} y1={y + 12} x2={knob} y2={y + 12} stroke={COMPONENT.blue} strokeWidth={7} strokeLinecap="round" />
      <circle cx={knob} cy={y + 12} r={10} fill={COMPONENT.blue} />
      <foreignObject x={x - 8} y={y - 6} width={w + 16} height={38}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-8 w-full cursor-pointer opacity-0" />
      </foreignObject>
    </g>
  );
}

function StatusCard({ x, y, title, value, color = COMPONENT.blue }: {
  x: number; y: number; title: string; value: string; color?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={170} height={60} rx={12} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
      <circle cx={x + 16} cy={y + 18} r={6} fill={color} />
      <Text x={x + 28} y={y + 22} size={11} color={COMPONENT.gray}>{title}</Text>
      <Text x={x + 14} y={y + 44} size={15} color={color} weight={700}>{value}</Text>
    </g>
  );
}

/* =========================================================
   MAIN CONSTRUCTION + WORKING VISUAL
========================================================= */

function JfetWorkingVisual({
  type,
  selectedTerminal,
  selectedRegion,
  vgs,
  vds,
  vgsOffAbs,
  idssMa,
  flowMode,
  running,
}: {
  type: JfetType;
  selectedTerminal: Terminal;
  selectedRegion: RegionPick;
  vgs: number;
  vds: number;
  vgsOffAbs: number;
  idssMa: number;
  flowMode: FlowMode;
  running: boolean;
}) {
  const n = isN(type);
  const channelFill = n ? COMPONENT.nType : COMPONENT.pType;
  const channelStroke = n ? COMPONENT.nStroke : COMPONENT.pStroke;
  const gateFill = n ? COMPONENT.pType : COMPONENT.nType;
  const gateStroke = n ? COMPONENT.pStroke : COMPONENT.nStroke;

  const width = channelWidthPercent(type, vgs, vgsOffAbs);
  const id = drainCurrent(type, vgs, idssMa, vgsOffAbs);
  const region = getRegion(type, vgs, vds, vgsOffAbs);
  const depletion = 1 - width;
  const channelH = 18 + width * 72;
  const channelY = 290 - channelH / 2;
  const pinch = region === "Pinch-Off";

  return (
    <g>
      <rect {...PATH.deviceBody} fill="#fff7ed" stroke="#111827" strokeWidth={3} />

      <rect
        x={PATH.channel.x}
        y={channelY}
        width={PATH.channel.width}
        height={channelH}
        rx={18}
        fill={channelFill}
        stroke={selectedRegion === "Channel" ? COMPONENT.blue : channelStroke}
        strokeWidth={selectedRegion === "Channel" ? 5 : 3}
      />

      <rect {...PATH.upperGate} fill={gateFill} stroke={gateStroke} strokeWidth={selectedRegion === "Gate Region" ? 5 : 3} />
      <rect {...PATH.lowerGate} fill={gateFill} stroke={gateStroke} strokeWidth={selectedRegion === "Gate Region" ? 5 : 3} />

      <rect
        x={505}
        y={245}
        width={180}
        height={depletion * 45}
        rx={10}
        fill={COMPONENT.depletion}
        stroke={COMPONENT.depletionStroke}
        strokeWidth={2}
        opacity={0.25 + depletion * 0.6}
      />
      <rect
        x={505}
        y={335 - depletion * 45}
        width={180}
        height={depletion * 45}
        rx={10}
        fill={COMPONENT.depletion}
        stroke={COMPONENT.depletionStroke}
        strokeWidth={2}
        opacity={0.25 + depletion * 0.6}
      />

      <line x1="505" y1="245" x2="685" y2="245" stroke={COMPONENT.junction} strokeWidth={selectedRegion === "Junction" ? 6 : 4} strokeDasharray="8 7" />
      <line x1="505" y1="335" x2="685" y2="335" stroke={COMPONENT.junction} strokeWidth={selectedRegion === "Junction" ? 6 : 4} strokeDasharray="8 7" />

      {pinch && (
        <path
          d="M690 252 C745 270 745 315 690 332 C700 305 700 278 690 252 Z"
          fill="#fff7ed"
          stroke={COMPONENT.red}
          strokeWidth={5}
          opacity={0.85}
        />
      )}

      {Array.from({ length: Math.round(6 + width * 20) }).map((_, i) => (
        <circle
          key={i}
          cx={475 + (i % 10) * 24}
          cy={channelY + 10 + Math.floor(i / 10) * 22}
          r={4}
          fill={COMPONENT.electron}
          opacity={0.3 + width * 0.7}
        />
      ))}

      <FlowParticles width={width} flowMode={flowMode} running={running} />

      <rect {...PATH.sourceMetal} fill={selectedTerminal === "Source" ? COMPONENT.yellow : COMPONENT.metal} stroke={COMPONENT.black} strokeWidth={selectedTerminal === "Source" ? 4 : 2} />
      <rect {...PATH.drainMetal} fill={selectedTerminal === "Drain" ? COMPONENT.yellow : COMPONENT.metal} stroke={COMPONENT.black} strokeWidth={selectedTerminal === "Drain" ? 4 : 2} />
      <rect {...PATH.gateMetalTop} fill={selectedTerminal === "Gate" ? COMPONENT.yellow : COMPONENT.metal} stroke={COMPONENT.black} strokeWidth={selectedTerminal === "Gate" ? 4 : 2} />
      <rect {...PATH.gateMetalBottom} fill={selectedTerminal === "Gate" ? COMPONENT.yellow : COMPONENT.metal} stroke={COMPONENT.black} strokeWidth={selectedTerminal === "Gate" ? 4 : 2} />
      <line x1="595" y1="175" x2="595" y2="205" stroke={WIRE.color} strokeWidth={WIRE.width} />
      <line x1="595" y1="405" x2="595" y2="385" stroke={WIRE.color} strokeWidth={WIRE.width} />

      <Text x={430} y={245} size={13} weight={700}>Source</Text>
      <Text x={720} y={245} size={13} weight={700}>Drain</Text>
      <Text x={560} y={132} size={13} weight={700}>Gate</Text>
      <Text x={560} y={458} size={13} weight={700}>Gate</Text>

      <Text x={518} y={302} size={15} color={channelStroke} weight={700}>{n ? "N Channel" : "P Channel"}</Text>
      <Text x={690} y={248} size={12} color={COMPONENT.junction}>PN Gate Junction</Text>
      <Text x={690} y={338} size={12} color={COMPONENT.junction}>PN Gate Junction</Text>
      <Text x={430} y={475} size={13} color={regionColor(region)} weight={700}>
        Region: {region} • ID: {id.toFixed(2)}mA
      </Text>
    </g>
  );
}

function FlowParticles({ width, flowMode, running }: { width: number; flowMode: FlowMode; running: boolean }) {
  const showElectron = flowMode === "Electron" || flowMode === "Both";
  const showConventional = flowMode === "Conventional" || flowMode === "Both";
  const active = width > 0.03;
  const duration = `${2.5 - width * 1.4}s`;

  return (
    <g>
      {showElectron && [0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={`e-${i}`}
          cx={470 + i * 42}
          cy={290}
          r={5}
          fill={COMPONENT.electron}
          opacity={active ? 0.35 + width * 0.65 : 0}
          style={{ animation: running && active ? `electronFlow ${duration} linear infinite` : "none", animationDelay: `${i * 0.12}s` }}
        />
      ))}
      {showConventional && [0, 1, 2, 3, 4].map((i) => (
        <line
          key={`c-${i}`}
          x1={720 - i * 44}
          y1={318}
          x2={704 - i * 44}
          y2={318}
          stroke={COMPONENT.conventional}
          strokeWidth={3}
          markerEnd="url(#currentArrow)"
          opacity={active ? 0.4 + width * 0.6 : 0}
          style={{ animation: running && active ? `currentFlow ${duration} linear infinite` : "none", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </g>
  );
}

/* =========================================================
   PANELS
========================================================= */

function OverviewPanel() {
  return (
    <g>
      <Panel {...PATH.overviewPanel} />
      <Text x={60} y={75} size={22} weight={700}>JFET Working</Text>
      <Text x={60} y={100} size={13} color={COMPONENT.gray}>Junction Field Effect Transistor</Text>

      <rect x="60" y="135" width="210" height="90" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <Text x={78} y={163} size={14} weight={700}>Normally ON Device</Text>
      <Text x={78} y={188} size={12}>At VGS = 0, channel is open</Text>
      <Text x={78} y={208} size={12}>Gate voltage narrows channel</Text>

      <rect x="60" y="250" width="210" height="100" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <Text x={78} y={278} size={14} weight={700}>Working Focus</Text>
      <Text x={78} y={302} size={12}>Depletion region growth</Text>
      <Text x={78} y={322} size={12}>Channel width control</Text>
      <Text x={78} y={342} size={12}>Pinch-off and cutoff</Text>

      <rect x="60" y="380" width="210" height="115" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <Text x={78} y={408} size={14} weight={700}>Shockley Model</Text>
      <Text x={78} y={434} size={12}>ID = IDSS ×</Text>
      <Text x={78} y={454} size={12}>(1 − VGS / VGS(off))²</Text>
    </g>
  );
}

function ExplorerPanel({
  type, setType, selectedTerminal, setSelectedTerminal, selectedRegion, setSelectedRegion,
  vgs, setVgs, vds, setVds, idssMa, setIdssMa, vgsOffAbs, setVgsOffAbs,
  flowMode, setFlowMode, running, setRunning, reset, autoplay, setAutoplay,
}: any) {
  const minGate = isN(type) ? -8 : 0;
  const maxGate = isN(type) ? 0 : 8;

  return (
    <g>
      <Panel {...PATH.explorerPanel} />
      <Text x={925} y={70} size={18} weight={700}>Controls</Text>

      <Button x={925} y={90} width={100} label="N-JFET" active={type === "N-Channel JFET"} onClick={() => { setType("N-Channel JFET"); setVgs(0); }} />
      <Button x={1030} y={90} width={100} label="P-JFET" active={type === "P-Channel JFET"} onClick={() => { setType("P-Channel JFET"); setVgs(0); }} />

      <Slider x={925} y={155} label="Gate Voltage" value={vgs} min={minGate} max={maxGate} step={0.1} unit="V" onChange={setVgs} />
      <Slider x={925} y={215} label="Drain Voltage" value={vds} min={0} max={20} step={0.1} unit="V" onChange={setVds} />
      <Slider x={925} y={275} label="IDSS" value={idssMa} min={5} max={50} step={1} unit="mA" onChange={setIdssMa} />
      <Slider x={925} y={335} label="VGS(off)" value={vgsOffAbs} min={2} max={8} step={0.1} unit="V" onChange={setVgsOffAbs} />

      <Text x={925} y={390} size={13} weight={700}>Flow Mode</Text>
      {(["Electron", "Conventional", "Both"] as FlowMode[]).map((m, i) => (
        <Button key={m} x={925} y={405 + i * 38} width={205} label={m} active={flowMode === m} onClick={() => setFlowMode(m)} />
      ))}

      <Button x={925} y={525} width={63} label="Run" active={running} onClick={() => setRunning(true)} />
      <Button x={995} y={525} width={63} label="Pause" active={!running} onClick={() => setRunning(false)} />
      <Button x={1065} y={525} width={63} label="Reset" active={false} onClick={reset} />

      <Button x={925} y={485} width={205} label={autoplay ? "Auto-Play ON" : "Auto-Play OFF"} active={autoplay} onClick={() => setAutoplay(!autoplay)} />
    </g>
  );
}

function DashboardPanel({
  type, vgs, vds, idssMa, vgsOffAbs, flowMode, selectedTerminal, selectedRegion, step, setStep,
}: any) {
  const id = drainCurrent(type, vgs, idssMa, vgsOffAbs);
  const width = channelWidthPercent(type, vgs, vgsOffAbs);
  const region = getRegion(type, vgs, vds, vgsOffAbs);
  const offText = isN(type) ? `-${vgsOffAbs.toFixed(1)}V` : `+${vgsOffAbs.toFixed(1)}V`;
  const highVds = vds > 16;
  const cutoff = region === "Cutoff";

  return (
    <g>
      <Panel {...PATH.dashboardPanel} />
      <rect x="60" y="615" width="1080" height="36" rx="12" fill={COMPONENT.dark} />
      <Text x={82} y={638} size={17} color="#fff" weight={700}>JFET Working Principle Dashboard</Text>

      <StatusCard x={60} y={675} title="JFET Type" value={type} color={isN(type) ? COMPONENT.nStroke : COMPONENT.pStroke} />
      <StatusCard x={250} y={675} title="VGS" value={`${vgs.toFixed(1)}V`} color={COMPONENT.blue} />
      <StatusCard x={440} y={675} title="VDS" value={`${vds.toFixed(1)}V`} color={COMPONENT.orange} />
      <StatusCard x={630} y={675} title="IDSS" value={`${idssMa.toFixed(0)}mA`} color={COMPONENT.green} />
      <StatusCard x={820} y={675} title="VGS(off)" value={offText} color={COMPONENT.red} />
      <StatusCard x={1010} y={675} title="ID" value={`${id.toFixed(2)}mA`} color={regionColor(region)} />

      <StatusCard x={60} y={755} title="Channel Width" value={`${Math.round(width * 100)}%`} color={COMPONENT.depletionStroke} />
      <StatusCard x={250} y={755} title="Region" value={region} color={regionColor(region)} />
      <StatusCard x={440} y={755} title="Flow Mode" value={flowMode} color={COMPONENT.conventional} />
      <StatusCard x={630} y={755} title="Terminal" value={selectedTerminal} color={COMPONENT.blue} />
      <StatusCard x={820} y={755} title="Region Pick" value={selectedRegion} color={COMPONENT.orange} />

      <Text x={60} y={855} size={14} weight={700}>Learning Mode</Text>
      {LEARNING_STEPS.map((s, i) => (
        <g key={s} onClick={() => setStep(i)} className="cursor-pointer">
          <circle cx={80 + i * 44} cy={880} r={13} fill={step === i ? COMPONENT.blue : "#e2e8f0"} />
          <Text x={76 + i * 44} y={885} size={12} color={step === i ? "#fff" : COMPONENT.black} weight={700}>{i + 1}</Text>
        </g>
      ))}
      <Text x={60} y={920} size={13} color={COMPONENT.gray}>{step + 1}. {LEARNING_STEPS[step]}</Text>

      <rect x="440" y="850" width="700" height="80" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <Text x={465} y={875} size={15} weight={700}>Warning Panel</Text>
      <circle cx="470" cy="900" r={7} fill={highVds ? COMPONENT.red : COMPONENT.green} />
      <Text x={485} y={905} size={12}>High VDS</Text>
      <circle cx="585" cy="900" r={7} fill={cutoff ? COMPONENT.red : COMPONENT.green} />
      <Text x={600} y={905} size={12}>Cutoff</Text>
      <circle cx="695" cy="900" r={7} fill={id > idssMa * 0.85 ? COMPONENT.orange : COMPONENT.green} />
      <Text x={710} y={905} size={12}>High ID</Text>

      <rect x="60" y="950" width="1080" height="55" rx="14" fill="#fff" stroke="#cbd5e1" />
      <Text x={82} y={976} size={14} weight={700}>Live Equation:</Text>
      <Text x={205} y={976} size={13}>
        ID = IDSS × (1 − VGS / VGS(off))² = {idssMa.toFixed(0)}mA × control² = {id.toFixed(2)}mA
      </Text>
    </g>
  );
}

function OscilloscopePanel({ vgsHistory, idHistory, running, setRunning, autoScale, setAutoScale, clearTrace }: any) {
  return (
    <g>
      <rect x="345" y="430" width="500" height="110" rx="14" fill="#020617" stroke="#cbd5e1" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <line x1="360" y1={450 + i * 18} x2="830" y2={450 + i * 18} stroke="#1e293b" />
          <line x1={360 + i * 95} y1="442" x2={360 + i * 95} y2="525" stroke="#1e293b" />
        </g>
      ))}
      <path d={graphPath(vgsHistory.map((v: number) => Math.abs(v)), 360, 445, 470, 78, 8)} stroke={COMPONENT.blue} strokeWidth={2.5} fill="none" />
      <path d={graphPath(idHistory, 360, 445, 470, 78, autoScale ? Math.max(10, Math.max(...idHistory, 1)) : 50)} stroke={COMPONENT.green} strokeWidth={2.5} fill="none" />
      <Text x={360} y={535} size={11} color={COMPONENT.blue}>CH1 VGS</Text>
      <Text x={430} y={535} size={11} color={COMPONENT.green}>CH2 ID</Text>
      <foreignObject x="690" y="510" width="150" height="28">
        <div className="flex gap-1 text-[10px]">
          <button onClick={() => setRunning(!running)} className="rounded border bg-white px-1">{running ? "Pause" : "Run"}</button>
          <button onClick={() => setAutoScale(!autoScale)} className="rounded border bg-white px-1">Auto</button>
          <button onClick={clearTrace} className="rounded border bg-white px-1">Clear</button>
        </div>
      </foreignObject>
    </g>
  );
}

function JfetLibrarySymbolShowcase({ type }: { type: JfetType }) {
  const symbolCards = [
    {
      key: "n-jfet",
      title: "N-Channel JFET Symbol",
      active: type === "N-Channel JFET",
      SymbolComponent: JFETNChannelSymbol,
    },
    {
      key: "p-jfet",
      title: "P-Channel JFET Symbol",
      active: type === "P-Channel JFET",
      SymbolComponent: JFETPChannelSymbol,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {symbolCards.map(({ key, title, active, SymbolComponent }) => (
        <div
          key={key}
          className={`rounded-[28px] border bg-white p-5 shadow-sm transition ${
            active ? "border-emerald-300 shadow-emerald-100" : "border-slate-200"
          }`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Library Symbol View
              </p>
              <h3 className="mt-1 text-lg font-black text-slate-900">{title}</h3>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {active ? "Active" : "Reference"}
            </div>
          </div>

          <div className="flex min-h-[190px] items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50">
            <SymbolComponent
              width={150}
              height={180}
              className="h-[160px] w-[140px] overflow-visible"
              label={title}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function JfetConstructionSimulator() {
  const [type, setType] = useState<JfetType>("N-Channel JFET");
  const [selectedTerminal] = useState<Terminal>("Gate");
  const [selectedRegion] = useState<RegionPick>("Channel");

  const [vgs, setVgs] = useState(0);
  const [vds, setVds] = useState(6);
  const [idssMa, setIdssMa] = useState(25);
  const [vgsOffAbs, setVgsOffAbs] = useState(4);
  const [flowMode, setFlowMode] = useState<FlowMode>("Both");
  const [running, setRunning] = useState(true);
  const [scopeRunning, setScopeRunning] = useState(true);
  const [autoScale, setAutoScale] = useState(true);
  const [step, setStep] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [vgsHistory, setVgsHistory] = useState<number[]>(Array(50).fill(0));
  const [idHistory, setIdHistory] = useState<number[]>(Array(50).fill(0));

  const id = useMemo(() => drainCurrent(type, vgs, idssMa, vgsOffAbs), [type, vgs, idssMa, vgsOffAbs]);

  useEffect(() => {
    if (!scopeRunning) return;
    const t = window.setInterval(() => {
      setVgsHistory((p) => [...p.slice(-79), vgs]);
      setIdHistory((p) => [...p.slice(-79), id]);
    }, 250);
    return () => window.clearInterval(t);
  }, [scopeRunning, vgs, id]);

  useEffect(() => {
    if (!autoplay) return;
    const points = isN(type)
      ? [0, -1, -2, -3, -3.5, -vgsOffAbs]
      : [0, 1, 2, 3, 3.5, vgsOffAbs];
    setVgs(points[step] ?? 0);
    const t = window.setTimeout(() => setStep((s) => (s + 1) % 6), 1600);
    return () => window.clearTimeout(t);
  }, [autoplay, step, type, vgsOffAbs]);

  const reset = () => {
    setVgs(0);
    setVds(6);
    setIdssMa(25);
    setVgsOffAbs(4);
    setFlowMode("Both");
    setRunning(false);
    setAutoplay(false);
    setStep(0);
  };

  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-slate-100 p-2 sm:p-4">
      <div className="flex w-full min-w-[980px] max-w-7xl flex-col gap-4">
        <svg viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`} className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
        <style>{`
          @keyframes electronFlow { 0% { transform: translateX(-55px); } 100% { transform: translateX(120px); } }
          @keyframes currentFlow { 0% { transform: translateX(45px); } 100% { transform: translateX(-120px); } }
        `}</style>

        <defs>
          <marker id="currentArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.conventional} />
          </marker>
        </defs>

        <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill={COMPONENT.bg} />

        <OverviewPanel />

        <Panel {...PATH.mainPanel} />
        <Text x={345} y={75} size={22} weight={700}>How a JFET Works</Text>
        <Text x={345} y={100} size={13} color={COMPONENT.gray}>
          Depletion region control, channel narrowing, drain current path, pinch-off, and cutoff.
        </Text>

        <JfetWorkingVisual
          type={type}
          selectedTerminal={selectedTerminal}
          selectedRegion={selectedRegion}
          vgs={vgs}
          vds={vds}
          vgsOffAbs={vgsOffAbs}
          idssMa={idssMa}
          flowMode={flowMode}
          running={running}
        />

        <OscilloscopePanel
          vgsHistory={vgsHistory}
          idHistory={idHistory}
          running={scopeRunning}
          setRunning={setScopeRunning}
          autoScale={autoScale}
          setAutoScale={setAutoScale}
          clearTrace={() => {
            setVgsHistory(Array(50).fill(0));
            setIdHistory(Array(50).fill(0));
          }}
        />

        <ExplorerPanel
          type={type}
          setType={setType}
          selectedTerminal={selectedTerminal}
          setSelectedTerminal={() => {}}
          selectedRegion={selectedRegion}
          setSelectedRegion={() => {}}
          vgs={vgs}
          setVgs={setVgs}
          vds={vds}
          setVds={setVds}
          idssMa={idssMa}
          setIdssMa={setIdssMa}
          vgsOffAbs={vgsOffAbs}
          setVgsOffAbs={setVgsOffAbs}
          flowMode={flowMode}
          setFlowMode={setFlowMode}
          running={running}
          setRunning={setRunning}
          reset={reset}
          autoplay={autoplay}
          setAutoplay={setAutoplay}
        />

        <DashboardPanel
          type={type}
          vgs={vgs}
          vds={vds}
          idssMa={idssMa}
          vgsOffAbs={vgsOffAbs}
          flowMode={flowMode}
          selectedTerminal={selectedTerminal}
          selectedRegion={selectedRegion}
          step={step}
          setStep={setStep}
        />
        </svg>

        <JfetLibrarySymbolShowcase type={type} />
      </div>
    </div>
  );
}
