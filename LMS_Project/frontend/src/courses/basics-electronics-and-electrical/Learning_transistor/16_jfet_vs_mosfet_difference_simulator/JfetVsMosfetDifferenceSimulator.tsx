"use client";

import React, { useMemo, useState } from "react";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = { x: 0, y: 0, width: 1200, height: 1120 };

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
  black: "#111827",
  gray: "#64748b",
  grid: "#e5e7eb",

  nType: "#bbf7d0",
  nStroke: "#16a34a",
  pType: "#fed7aa",
  pStroke: "#ea580c",

  oxide: "#d8b4fe",
  oxideStroke: "#7c3aed",
  metal: "#374151",
  channel: "#bfdbfe",
  channelStroke: "#2563eb",
  depletion: "#ddd6fe",
  depletionStroke: "#7c3aed",
  field: "#ef4444",

  electron: "#2563eb",
  conventional: "#f59e0b",

  green: "#16a34a",
  blue: "#2563eb",
  orange: "#f59e0b",
  red: "#ef4444",
  purple: "#7c3aed",
  yellow: "#facc15",
};

const NODE = { terminal: 10, small: 5 };

const WIRE = {
  color: "#111827",
  width: BASE_WIRE_WIDTH * SCALE.wire,
  thin: 2 * SCALE.wire,
};

const PATH = {
  leftPanel: { x: 35, y: 35, width: 340, height: 500, rx: 18 },
  centerPanel: { x: 395, y: 35, width: 390, height: 500, rx: 18 },
  rightPanel: { x: 805, y: 35, width: 360, height: 500, rx: 18 },

  dashboardPanel: { x: 35, y: 560, width: 1130, height: 220, rx: 18 },
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

type Device = "JFET" | "Enhancement MOSFET" | "Depletion MOSFET";
type Mode = "JFET vs Enhancement MOSFET" | "JFET vs Depletion MOSFET" | "All Types Comparison";
type EduMode = "Beginner" | "Advanced";
type FlowMode = "Carrier Flow" | "Conventional Current" | "Both";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const DEVICES: Device[] = ["JFET", "Enhancement MOSFET", "Depletion MOSFET"];
const MODES: Mode[] = ["JFET vs Enhancement MOSFET", "JFET vs Depletion MOSFET", "All Types Comparison"];
const EDU_MODES: EduMode[] = ["Beginner", "Advanced"];
const FLOW_MODES: FlowMode[] = ["Carrier Flow", "Conventional Current", "Both"];

const STEPS = [
  "Compare construction",
  "Compare gate structure",
  "Compare channel existence",
  "Compare control mechanism",
  "Compare input behavior",
  "Final summary",
];

/* =========================================================
   DATA / LOGIC
========================================================= */

function getDeviceInfo(device: Device) {
  if (device === "JFET") {
    return {
      family: "JFET",
      channel: "Existing Channel",
      gate: "PN Junction Gate",
      input: "High",
      gateCurrent: "Small Leakage",
      control: "Depletion Control",
      defaultState: "Normally ON",
      construction: "PN junction gate touches semiconductor",
      physics: "Reverse gate voltage expands depletion region",
      carrier: "Electron",
      currentDirection: "Drain → Source",
      color: COMPONENT.green,
    };
  }

  if (device === "Enhancement MOSFET") {
    return {
      family: "MOSFET",
      channel: "No Channel Initially",
      gate: "Oxide Insulated Gate",
      input: "Very High",
      gateCurrent: "Almost Zero",
      control: "Electric Field Creates Channel",
      defaultState: "Normally OFF",
      construction: "Metal gate separated by oxide",
      physics: "Electric field forms inversion channel",
      carrier: "Electron",
      currentDirection: "Drain → Source",
      color: COMPONENT.blue,
    };
  }

  return {
    family: "MOSFET",
    channel: "Existing Channel",
    gate: "Oxide Insulated Gate",
    input: "Very High",
    gateCurrent: "Almost Zero",
    control: "Electric Field Modifies Channel",
    defaultState: "Normally ON",
    construction: "Insulated gate with built-in channel",
    physics: "Electric field narrows or enhances channel",
    carrier: "Electron",
    currentDirection: "Drain → Source",
    color: COMPONENT.purple,
  };
}

function mosfetFromMode(mode: Mode): Device {
  if (mode === "JFET vs Depletion MOSFET") return "Depletion MOSFET";
  return "Enhancement MOSFET";
}

function getChannelAvailable(device: Device, showChannel: boolean) {
  if (device === "Enhancement MOSFET") return showChannel;
  return true;
}

function getFlowStrength(device: Device, showChannel: boolean, showDepletion: boolean) {
  if (!getChannelAvailable(device, showChannel)) return 0;
  if (device === "JFET" && showDepletion) return 0.65;
  if (device === "Depletion MOSFET" && showDepletion) return 0.75;
  return 1;
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

function Button({ x, y, width, label, active, onClick }: { x: number; y: number; width: number; label: string; active: boolean; onClick: () => void }) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect x={x} y={y} width={width} height={32} rx={9} fill={active ? COMPONENT.dark : "#fff"} stroke={active ? COMPONENT.dark : COMPONENT.panelStroke} strokeWidth={2} />
      <Text x={x + 10} y={y + 21} size={10.5} color={active ? "#fff" : COMPONENT.black} weight={700}>{label}</Text>
    </g>
  );
}

function Toggle({ x, y, label, active, onClick }: { x: number; y: number; label: string; active: boolean; onClick: () => void }) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect x={x} y={y} width={145} height={28} rx={8} fill={active ? "#eff6ff" : "#fff"} stroke={active ? COMPONENT.blue : COMPONENT.panelStroke} strokeWidth={2} />
      <circle cx={x + 14} cy={y + 14} r={5} fill={active ? COMPONENT.blue : COMPONENT.gray} />
      <Text x={x + 26} y={y + 18} size={10}>{label}</Text>
    </g>
  );
}

function StatusCard({ x, y, title, value, color, width = 170 }: { x: number; y: number; title: string; value: string; color: string; width?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={58} rx={12} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
      <circle cx={x + 15} cy={y + 18} r={6} fill={color} />
      <Text x={x + 28} y={y + 22} size={11} color={COMPONENT.gray}>{title}</Text>
      <Text x={x + 14} y={y + 43} size={13} color={color} weight={700}>{value}</Text>
    </g>
  );
}

function MeterBar({ x, y, label, value, color }: { x: number; y: number; label: string; value: number; color: string }) {
  return (
    <g>
      <Text x={x} y={y} size={11}>{label}</Text>
      <rect x={x} y={y + 8} width="165" height="12" rx="6" fill="#e5e7eb" />
      <rect x={x} y={y + 8} width={value * 165} height="12" rx="6" fill={color} />
    </g>
  );
}

/* =========================================================
   FLOW VISUALIZATION
========================================================= */

function FlowParticles({
  x,
  y,
  strength,
  flowMode,
  running,
  beginner,
}: {
  x: number;
  y: number;
  strength: number;
  flowMode: FlowMode;
  running: boolean;
  beginner: boolean;
}) {
  const showCarrier = flowMode === "Carrier Flow" || flowMode === "Both";
  const showConventional = flowMode === "Conventional Current" || flowMode === "Both";
  const active = strength > 0.05;
  const duration = `${2.4 - strength * 1.2}s`;

  if (beginner) {
    return (
      <g opacity={active ? 0.35 + strength * 0.65 : 0}>
        {showCarrier && (
          <path d={`M${x} ${y} H${x + 150}`} stroke={COMPONENT.electron} strokeWidth={5} markerEnd="url(#carrierArrow)" />
        )}
        {showConventional && (
          <path d={`M${x + 150} ${y + 26} H${x}`} stroke={COMPONENT.conventional} strokeWidth={5} markerEnd="url(#currentArrow)" />
        )}
      </g>
    );
  }

  return (
    <g>
      {showCarrier && [0, 1, 2, 3, 4].map((i) => (
        <circle
          key={`carrier-${i}`}
          cx={x + i * 32}
          cy={y}
          r={5}
          fill={COMPONENT.electron}
          opacity={active ? 0.3 + strength * 0.7 : 0}
          style={{
            animation: running && active ? `carrierFlow ${duration} linear infinite` : "none",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
      {showConventional && [0, 1, 2, 3].map((i) => (
        <line
          key={`conv-${i}`}
          x1={x + 150 - i * 34}
          y1={y + 26}
          x2={x + 132 - i * 34}
          y2={y + 26}
          stroke={COMPONENT.conventional}
          strokeWidth={3}
          markerEnd="url(#currentArrow)"
          opacity={active ? 0.35 + strength * 0.65 : 0}
          style={{
            animation: running && active ? `currentFlow ${duration} linear infinite` : "none",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </g>
  );
}

/* =========================================================
   DEVICE VISUALS
========================================================= */

function JfetVisual({
  x,
  y,
  showChannel,
  showDepletion,
  showJunctions,
  activeStep,
  advanced,
  flowMode,
  running,
  showCarrierFlow,
}: {
  x: number;
  y: number;
  showChannel: boolean;
  showDepletion: boolean;
  showJunctions: boolean;
  activeStep: Step;
  advanced: boolean;
  flowMode: FlowMode;
  running: boolean;
  showCarrierFlow: boolean;
}) {
  const strength = showCarrierFlow ? getFlowStrength("JFET", showChannel, showDepletion) : 0;
  const highlightGate = activeStep === 2;
  const highlightChannel = activeStep === 3;
  const highlightControl = activeStep === 4;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="285" height="245" rx="16" fill="#fff7ed" stroke={COMPONENT.black} strokeWidth={3} />

      {showChannel && <rect x="62" y="88" width="160" height="70" rx="28" fill={COMPONENT.nType} stroke={highlightChannel ? COMPONENT.blue : COMPONENT.nStroke} strokeWidth={highlightChannel ? 5 : 3} />}

      <rect x="85" y="32" width="115" height="58" rx="14" fill={COMPONENT.pType} stroke={highlightGate ? COMPONENT.red : COMPONENT.pStroke} strokeWidth={highlightGate ? 5 : 3} />
      <rect x="85" y="158" width="115" height="58" rx="14" fill={COMPONENT.pType} stroke={highlightGate ? COMPONENT.red : COMPONENT.pStroke} strokeWidth={highlightGate ? 5 : 3} />

      {showDepletion && (
        <>
          <rect x="85" y="88" width="115" height={highlightControl ? 32 : 22} rx="10" fill={COMPONENT.depletion} stroke={COMPONENT.depletionStroke} opacity={0.75} />
          <rect x="85" y={highlightControl ? 126 : 136} width="115" height={highlightControl ? 32 : 22} rx="10" fill={COMPONENT.depletion} stroke={COMPONENT.depletionStroke} opacity={0.75} />
        </>
      )}

      {showJunctions && (
        <>
          <line x1="85" y1="90" x2="200" y2="90" stroke={COMPONENT.purple} strokeWidth={4} strokeDasharray="7 6" />
          <line x1="85" y1="158" x2="200" y2="158" stroke={COMPONENT.purple} strokeWidth={4} strokeDasharray="7 6" />
        </>
      )}

      {advanced && (
        <>
          <circle cx="105" cy="120" r="4" fill={COMPONENT.blue} />
          <circle cx="135" cy="120" r="4" fill={COMPONENT.blue} />
          <circle cx="165" cy="120" r="4" fill={COMPONENT.blue} />
        </>
      )}

      <FlowParticles x={70} y={121} strength={strength} flowMode={flowMode} running={running} beginner={!advanced} />

      <rect x="35" y="100" width="32" height="45" rx="5" fill={COMPONENT.metal} />
      <rect x="220" y="100" width="32" height="45" rx="5" fill={COMPONENT.metal} />
      <rect x="120" y="5" width="45" height="30" rx="5" fill={COMPONENT.metal} />

      {advanced && (
        <>
          <Text x={34} y={94} size={11}>Source</Text>
          <Text x={218} y={94} size={11}>Drain</Text>
          <Text x={125} y={28} size={11} color="#fff">Gate</Text>
        </>
      )}

      <Text x={94} y={128} size={12} color={COMPONENT.nStroke} weight={700}>Existing Channel</Text>
      <Text x={68} y={235} size={13} weight={700}>JFET: PN Junction Gate</Text>
    </g>
  );
}

function MosfetVisual({
  x,
  y,
  device,
  showChannel,
  showOxide,
  showField,
  activeStep,
  advanced,
  flowMode,
  running,
  showCarrierFlow,
}: {
  x: number;
  y: number;
  device: Device;
  showChannel: boolean;
  showOxide: boolean;
  showField: boolean;
  activeStep: Step;
  advanced: boolean;
  flowMode: FlowMode;
  running: boolean;
  showCarrierFlow: boolean;
}) {
  const isEnhancement = device === "Enhancement MOSFET";
  const hasChannel = !isEnhancement || showChannel;
  const strength = showCarrierFlow ? getFlowStrength(device, showChannel, false) : 0;
  const highlightGate = activeStep === 2;
  const highlightChannel = activeStep === 3;
  const highlightControl = activeStep === 4;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="305" height="245" rx="16" fill="#fff7ed" stroke={COMPONENT.black} strokeWidth={3} />

      <rect x="32" y="78" width="58" height="72" rx="12" fill={COMPONENT.nType} stroke={COMPONENT.nStroke} strokeWidth={3} />
      <rect x="215" y="78" width="58" height="72" rx="12" fill={COMPONENT.nType} stroke={COMPONENT.nStroke} strokeWidth={3} />

      {hasChannel && <rect x="88" y="104" width="130" height="28" rx="14" fill={COMPONENT.channel} stroke={highlightChannel ? COMPONENT.orange : COMPONENT.channelStroke} strokeWidth={highlightChannel ? 5 : 3} opacity={isEnhancement ? 0.75 : 1} />}

      {showOxide && <rect x="78" y="68" width="150" height="16" rx="4" fill={COMPONENT.oxide} stroke={highlightGate ? COMPONENT.red : COMPONENT.oxideStroke} strokeWidth={highlightGate ? 5 : 2} />}
      <rect x="94" y="35" width="118" height="32" rx="6" fill={COMPONENT.metal} />

      {showField && advanced && [0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${110 + i * 22} 84 C${105 + i * 22} 100 ${108 + i * 22} 118 ${116 + i * 22} 136`} stroke={highlightControl ? COMPONENT.red : COMPONENT.field} strokeWidth={highlightControl ? 3 : 2} fill="none" markerEnd="url(#fieldArrow)" />
      ))}

      <FlowParticles x={80} y={118} strength={hasChannel ? strength : 0} flowMode={flowMode} running={running} beginner={!advanced} />

      {advanced && (
        <>
          <Text x={34} y={70} size={11}>Source</Text>
          <Text x={218} y={70} size={11}>Drain</Text>
          <Text x={132} y={57} size={11} color="#fff">Gate</Text>
        </>
      )}

      <Text x={96} y={158} size={12} color={hasChannel ? COMPONENT.channelStroke : COMPONENT.red} weight={700}>
        {isEnhancement ? (hasChannel ? "Inversion Channel" : "No Channel Initially") : "Existing Channel"}
      </Text>
      <Text x={62} y={235} size={13} weight={700}>{device}: Insulated Gate</Text>
    </g>
  );
}

/* =========================================================
   PANELS
========================================================= */

function DevicePanel({ device, title, x, y, children }: { device: Device; title: string; x: number; y: number; children: React.ReactNode }) {
  const info = getDeviceInfo(device);
  return (
    <g>
      <Panel x={x} y={y} width={device === "JFET" ? 340 : 390} height={500} rx={18} />
      <Text x={x + 25} y={y + 40} size={22} weight={700}>{title}</Text>
      <Text x={x + 25} y={y + 65} size={13} color={COMPONENT.gray}>{device}</Text>
      {children}
      <StatusCard x={x + 25} y={y + 390} title="Gate Type" value={info.gate} color={info.color} width={device === "JFET" ? 290 : 330} />
      <StatusCard x={x + 25} y={y + 455} title="Default Channel" value={info.defaultState} color={info.color} width={device === "JFET" ? 290 : 330} />
    </g>
  );
}

function ExplorerPanel({
  selectedDevice,
  setSelectedDevice,
  mode,
  setMode,
  eduMode,
  setEduMode,
  flowMode,
  setFlowMode,
  running,
  setRunning,
  reset,
  showChannel,
  setShowChannel,
  showDepletion,
  setShowDepletion,
  showOxide,
  setShowOxide,
  showField,
  setShowField,
  showJunctions,
  setShowJunctions,
  showCarrierFlow,
  setShowCarrierFlow,
  step,
  setStep,
}: any) {
  const info = getDeviceInfo(selectedDevice);
  const channelAvailable = getChannelAvailable(selectedDevice, showChannel);

  return (
    <g>
      <Panel {...PATH.rightPanel} />
      <Text x={830} y={65} size={20} weight={700}>Control Panel</Text>

      <Text x={830} y={92} size={12} weight={700}>Device Selector</Text>
      {DEVICES.map((d, i) => (
        <Button key={d} x={830} y={105 + i * 35} width={300} label={d} active={selectedDevice === d} onClick={() => setSelectedDevice(d)} />
      ))}

      <Text x={830} y={225} size={12} weight={700}>Comparison Mode</Text>
      {MODES.map((m, i) => (
        <Button key={m} x={830} y={238 + i * 35} width={300} label={m} active={mode === m} onClick={() => setMode(m)} />
      ))}

      <Text x={830} y={360} size={12} weight={700}>Learning + Flow</Text>
      {EDU_MODES.map((m, i) => (
        <Button key={m} x={830 + i * 155} y={373} width={145} label={m} active={eduMode === m} onClick={() => setEduMode(m)} />
      ))}
      {FLOW_MODES.map((m, i) => (
        <Button key={m} x={830} y={412 + i * 35} width={300} label={m} active={flowMode === m} onClick={() => setFlowMode(m)} />
      ))}

      <Text x={830} y={530} size={12} weight={700}>Animation</Text>
      <Button x={830} y={545} width={90} label="Run" active={running} onClick={() => setRunning(true)} />
      <Button x={930} y={545} width={90} label="Pause" active={!running} onClick={() => setRunning(false)} />
      <Button x={1030} y={545} width={90} label="Reset" active={false} onClick={reset} />

      <Text x={830} y={610} size={12} weight={700}>Physics Layers</Text>
      <Toggle x={830} y={625} label="Channel" active={showChannel} onClick={() => setShowChannel(!showChannel)} />
      <Toggle x={985} y={625} label="Depletion" active={showDepletion} onClick={() => setShowDepletion(!showDepletion)} />
      <Toggle x={830} y={660} label="Oxide" active={showOxide} onClick={() => setShowOxide(!showOxide)} />
      <Toggle x={985} y={660} label="Field" active={showField} onClick={() => setShowField(!showField)} />
      <Toggle x={830} y={695} label="PN Junction" active={showJunctions} onClick={() => setShowJunctions(!showJunctions)} />
      <Toggle x={985} y={695} label="Carrier Flow" active={showCarrierFlow} onClick={() => setShowCarrierFlow(!showCarrierFlow)} />

      <rect x="830" y="735" width="300" height="72" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <Text x={850} y={758} size={12} weight={700}>Indicators</Text>
      <Text x={850} y={778} size={10}>Flow: {flowMode} • Animation: {running ? "RUN" : "PAUSE"}</Text>
      <Text x={850} y={795} size={10}>Channel: {channelAvailable ? "YES" : "NO"} • Carrier: {info.carrier}</Text>

      {[1, 2, 3, 4, 5, 6].map((s) => (
        <g key={s} onClick={() => setStep(s as Step)} className="cursor-pointer">
          <circle cx={845 + (s - 1) * 43} cy={845} r={13} fill={step === s ? COMPONENT.blue : "#e2e8f0"} />
          <Text x={841 + (s - 1) * 43} y={850} size={12} color={step === s ? "#fff" : COMPONENT.black} weight={700}>{s}</Text>
        </g>
      ))}
      <Text x={830} y={875} size={12} color={COMPONENT.gray}>{step}. {STEPS[step - 1]}</Text>
    </g>
  );
}

function Dashboard({
  selectedDevice,
  step,
  mode,
  flowMode,
  running,
  showChannel,
}: {
  selectedDevice: Device;
  step: Step;
  mode: Mode;
  flowMode: FlowMode;
  running: boolean;
  showChannel: boolean;
}) {
  const info = getDeviceInfo(selectedDevice);
  const channelAvailable = getChannelAvailable(selectedDevice, showChannel);

  return (
    <g>
      <Panel {...PATH.dashboardPanel} />
      <rect x="60" y="585" width="1080" height="36" rx="12" fill={COMPONENT.dark} />
      <Text x={82} y={608} size={17} color="#fff" weight={700}>Professional JFET vs MOSFET Learning Dashboard</Text>

      <StatusCard x={60} y={650} title="Comparison Mode" value={mode} color={COMPONENT.blue} width={255} />
      <StatusCard x={335} y={650} title="Selected Device" value={selectedDevice} color={info.color} width={210} />
      <StatusCard x={565} y={650} title="Gate Type" value={info.gate} color={info.color} width={220} />
      <StatusCard x={805} y={650} title="Channel State" value={channelAvailable ? "Available" : "No Channel"} color={channelAvailable ? COMPONENT.green : COMPONENT.red} width={170} />
      <StatusCard x={995} y={650} title="Animation" value={running ? "RUN" : "PAUSE"} color={running ? COMPONENT.green : COMPONENT.gray} width={125} />

      <StatusCard x={60} y={725} title="Flow Mode" value={flowMode} color={COMPONENT.conventional} width={210} />
      <StatusCard x={290} y={725} title="Carrier Type" value={info.carrier} color={COMPONENT.electron} width={190} />
      <StatusCard x={500} y={725} title="Current Direction" value={info.currentDirection} color={COMPONENT.orange} width={260} />
      <StatusCard x={780} y={725} title="Control Method" value={info.control} color={COMPONENT.purple} width={250} />

      <MeterBar x={60} y={805} label="JFET Input Resistance" value={0.7} color={COMPONENT.green} />
      <MeterBar x={250} y={805} label="MOSFET Input Resistance" value={0.98} color={COMPONENT.blue} />
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function JfetVsMosfetDifferenceSimulator() {
  const [mode, setMode] = useState<Mode>("JFET vs Enhancement MOSFET");
  const [selectedDevice, setSelectedDevice] = useState<Device>("JFET");
  const [eduMode, setEduMode] = useState<EduMode>("Advanced");
  const [flowMode, setFlowMode] = useState<FlowMode>("Both");
  const [running, setRunning] = useState(true);
  const [step, setStep] = useState<Step>(1);

  const [showChannel, setShowChannel] = useState(true);
  const [showDepletion, setShowDepletion] = useState(true);
  const [showOxide, setShowOxide] = useState(true);
  const [showField, setShowField] = useState(true);
  const [showJunctions, setShowJunctions] = useState(true);
  const [showCarrierFlow, setShowCarrierFlow] = useState(true);

  const compareDevice = useMemo(() => mosfetFromMode(mode), [mode]);
  const advanced = eduMode === "Advanced";

  const reset = () => {
    setEduMode("Advanced");
    setFlowMode("Both");
    setRunning(false);
    setStep(1);
    setShowChannel(true);
    setShowDepletion(true);
    setShowOxide(true);
    setShowField(true);
    setShowJunctions(true);
    setShowCarrierFlow(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 p-2 sm:p-4 flex items-center justify-center overflow-x-auto">
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        className="w-full min-w-[980px] max-w-7xl h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes carrierFlow {
            0% { transform: translateX(-35px); }
            100% { transform: translateX(95px); }
          }
          @keyframes currentFlow {
            0% { transform: translateX(40px); }
            100% { transform: translateX(-95px); }
          }
        `}</style>

        <defs>
          <marker id="fieldArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 Z" fill={COMPONENT.field} />
          </marker>
          <marker id="carrierArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 Z" fill={COMPONENT.electron} />
          </marker>
          <marker id="currentArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 Z" fill={COMPONENT.conventional} />
          </marker>
        </defs>

        <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill={COMPONENT.bg} />

        <DevicePanel device="JFET" title="Left Panel: JFET" x={35} y={35}>
          <JfetVisual
            x={62}
            y={115}
            showChannel={showChannel}
            showDepletion={showDepletion}
            showJunctions={showJunctions}
            activeStep={step}
            advanced={advanced}
            flowMode={flowMode}
            running={running}
            showCarrierFlow={showCarrierFlow}
          />
        </DevicePanel>

        <DevicePanel device={compareDevice} title="Center Panel: MOSFET" x={395} y={35}>
          <MosfetVisual
            x={438}
            y={115}
            device={compareDevice}
            showChannel={showChannel}
            showOxide={showOxide}
            showField={showField}
            activeStep={step}
            advanced={advanced}
            flowMode={flowMode}
            running={running}
            showCarrierFlow={showCarrierFlow}
          />
        </DevicePanel>

        {mode === "All Types Comparison" && (
          <g>
            <rect x="445" y="390" width="285" height="82" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
            <Text x={465} y={418} size={14} weight={700}>All Types Summary</Text>
            <Text x={465} y={442} size={12}>JFET: PN junction + existing channel</Text>
            <Text x={465} y={462} size={12}>E-MOSFET: oxide + created channel</Text>
          </g>
        )}

        <ExplorerPanel
          selectedDevice={selectedDevice}
          setSelectedDevice={setSelectedDevice}
          mode={mode}
          setMode={setMode}
          eduMode={eduMode}
          setEduMode={setEduMode}
          flowMode={flowMode}
          setFlowMode={setFlowMode}
          running={running}
          setRunning={setRunning}
          reset={reset}
          showChannel={showChannel}
          setShowChannel={setShowChannel}
          showDepletion={showDepletion}
          setShowDepletion={setShowDepletion}
          showOxide={showOxide}
          setShowOxide={setShowOxide}
          showField={showField}
          setShowField={setShowField}
          showJunctions={showJunctions}
          setShowJunctions={setShowJunctions}
          showCarrierFlow={showCarrierFlow}
          setShowCarrierFlow={setShowCarrierFlow}
          step={step}
          setStep={setStep}
        />

        <Dashboard
          selectedDevice={selectedDevice}
          step={step}
          mode={mode}
          flowMode={flowMode}
          running={running}
          showChannel={showChannel}
        />

      </svg>
    </div>
  );
}
