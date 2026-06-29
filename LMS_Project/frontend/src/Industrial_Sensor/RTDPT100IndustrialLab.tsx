"use client";

import {
  Activity,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileText,
  Info,
  Maximize,
  Monitor,
  Play,
  RotateCcw,
  Settings,
  Square,
  Sun,
  Volume2,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type RTDType = "PT100" | "PT1000";
type WireMode = "2-Wire" | "3-Wire" | "4-Wire";
type Process =
  | "Bearing Housing"
  | "Pipe Surface"
  | "Liquid Tank"
  | "Oven Chamber";
type OutputMode = "Resistance Ω" | "Transmitter 4-20mA" | "PLC RTD Input";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const WIRING_VIEW_BOX = "0 0 620 190";
const WIRING_VIEW_BOX_WIDTH = 620;
const WIRING_VIEW_BOX_HEIGHT = 190;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  processBlock: 1,
  rtdProbe: 1,
  transmitter: 1,
  plc: 1,
  wiringRtd: 1,
} as const;

const BASE_WIRE_WIDTH = 18;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  active: "#2563eb",
  run: "#22c55e",
  danger: "#ef4444",
  warning: "#f97316",
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

function buildCanvasScaleTransform(
  scale: number,
  width = VIEW_BOX_WIDTH,
  height = VIEW_BOX_HEIGHT,
) {
  if (scale === 1) return undefined;
  const centerX = width / 2;
  const centerY = height / 2;
  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

const BASE_COMPONENT = {
  base: { x: 70, y: 420, width: 980, height: 42, rotate: 0 },
  processBlock: { x: 125, y: 210, width: 305, height: 180, rotate: 0 },
  rtdProbe: { x: 365, y: 276, width: 330, height: 26, rotate: 0 },
  transmitter: { x: 705, y: 235, width: 145, height: 105, rotate: 0 },
  plc: { x: 910, y: 375, width: 150, height: 85, rotate: 0 },
  wiringRtd: { x: 30, y: 70, width: 130, height: 55, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  processBlock: scaleComponent(
    BASE_COMPONENT.processBlock,
    CIRCUIT_COMPONENT_SCALE.processBlock,
  ),
  rtdProbe: scaleComponent(
    BASE_COMPONENT.rtdProbe,
    CIRCUIT_COMPONENT_SCALE.rtdProbe,
  ),
  transmitter: scaleComponent(
    BASE_COMPONENT.transmitter,
    CIRCUIT_COMPONENT_SCALE.transmitter,
  ),
  plc: scaleComponent(BASE_COMPONENT.plc, CIRCUIT_COMPONENT_SCALE.plc),
  wiringRtd: scaleComponent(
    BASE_COMPONENT.wiringRtd,
    CIRCUIT_COMPONENT_SCALE.wiringRtd,
  ),
} as const;

const NODE = {
  processCenter: { x: 280, y: 295 },
  sensingElement: { x: 375, y: 289 },
  transmitterInput: { x: 700, y: 289 },
  plcInput: { x: 915, y: 410 },

  wiringElementLeft: { x: 50, y: 97 },
  wiringElementRight: { x: 160, y: 97 },
  wiringBusStartX: 210,
  wiringBusEndX: 410,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  signalToPlc: "M700 289 C745 395 835 360 915 410",
} as const;

const PATH = {
  signalToPlcMotion: WIRE.signalToPlc,
  wiringCompMotion: "M210 85 L410 85",
} as const;

const LABEL = {
  process: { x: 155, y: 198 },
  probe: { x: 465, y: 262 },
  sensingElement: { x: 340, y: 340 },
  wiringComp: { x: 705, y: 360 },
  temperature: { x: 300, y: 135 },
  setPoint: { x: 300, y: 170 },
  alarm: { x: 485, y: 150 },
  footerOne: { x: 80, y: 505 },
  footerTwo: { x: 80, y: 530 },
  wiringFooter: { x: 35, y: 180 },
} as const;

function getBaseResistance(rtdType: RTDType) {
  return rtdType === "PT100" ? 100 : 1000;
}

function getLeadError(wireMode: WireMode) {
  if (wireMode === "2-Wire") return 1.8;
  if (wireMode === "3-Wire") return 0.25;
  return 0.03;
}

function getResistance(rtdType: RTDType, temperature: number, power: boolean) {
  const baseR = getBaseResistance(rtdType);
  return power ? baseR * (1 + 0.00385 * temperature) : baseR;
}

function getCurrent(temperature: number, power: boolean) {
  return power
    ? 4 + Math.min(16, Math.max(0, ((temperature + 50) / 350) * 16))
    : 0;
}

function LabBase() {
  return (
    <g>
      <rect
        x={COMPONENT.base.x}
        y={COMPONENT.base.y}
        width={COMPONENT.base.width}
        height={COMPONENT.base.height}
        rx="8"
        fill="#e5e7eb"
        stroke="#94a3b8"
      />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />
    </g>
  );
}

function ProcessHeatBlock({
  power,
  process,
  temperature,
}: {
  power: boolean;
  process: Process;
  temperature: number;
}) {
  const heat = Math.min(1, Math.max(0, (temperature + 50) / 350));

  return (
    <g>
      <rect
        x={COMPONENT.processBlock.x}
        y={COMPONENT.processBlock.y}
        width={COMPONENT.processBlock.width}
        height={COMPONENT.processBlock.height}
        rx="18"
        fill="#334155"
        stroke={STYLE.wire}
        filter="url(#shadow)"
      />
      <rect
        x="155"
        y="238"
        width="245"
        height="118"
        rx="12"
        fill={STYLE.wire}
      />
      <circle
        cx={NODE.processCenter.x}
        cy={NODE.processCenter.y}
        r="92"
        fill={STYLE.danger}
        opacity={power ? heat * 0.22 : 0.04}
      />
      <path
        d="M190 338 C170 300 220 285 205 250 C250 285 235 310 270 338 C260 290 310 265 300 235 C365 290 350 330 330 338 Z"
        fill={STYLE.danger}
        opacity={power ? Math.max(0.1, heat) : 0.05}
      />
      <text
        x={LABEL.process.x}
        y={LABEL.process.y}
        fontSize="13"
        fill="#475569"
      >
        {process}
      </text>
    </g>
  );
}

function RTDProbe({
  rtdType,
  highAlarm,
  temperature,
}: {
  rtdType: RTDType;
  highAlarm: boolean;
  temperature: number;
}) {
  const heat = Math.min(1, Math.max(0, (temperature + 50) / 350));

  return (
    <g>
      <rect
        x={COMPONENT.rtdProbe.x}
        y={COMPONENT.rtdProbe.y}
        width={COMPONENT.rtdProbe.width}
        height={COMPONENT.rtdProbe.height}
        rx="13"
        fill="url(#probe)"
        stroke="#334155"
        filter="url(#shadow)"
      />
      <circle
        cx={NODE.sensingElement.x}
        cy={NODE.sensingElement.y}
        r="32"
        fill="url(#heatGlow)"
        opacity={heat}
      />
      <circle
        cx={NODE.sensingElement.x}
        cy={NODE.sensingElement.y}
        r="8"
        fill={highAlarm ? STYLE.danger : STYLE.warning}
      />
      <text x={LABEL.probe.x} y={LABEL.probe.y} fontSize="13" fill="#475569">
        {rtdType} Platinum Resistance Probe
      </text>
      <text
        x={LABEL.sensingElement.x}
        y={LABEL.sensingElement.y}
        fontSize="13"
        fill={STYLE.danger}
      >
        Sensing Element
      </text>
    </g>
  );
}

function TransmitterBlock({
  power,
  highAlarm,
  measuredResistance,
  current,
}: {
  power: boolean;
  highAlarm: boolean;
  measuredResistance: number;
  current: number;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.transmitter.x}
        y={COMPONENT.transmitter.y}
        width={COMPONENT.transmitter.width}
        height={COMPONENT.transmitter.height}
        rx="16"
        fill="#f8fafc"
        stroke="#94a3b8"
        filter="url(#shadow)"
      />
      <text x="730" y="265" fontSize="15" fontWeight="700" fill={STYLE.active}>
        RTD TX
      </text>
      <text x="726" y="292" fontSize="13" fill="#475569">
        {measuredResistance.toFixed(2)} Ω
      </text>
      <text x="728" y="315" fontSize="13" fill="#475569">
        {current.toFixed(1)} mA
      </text>
      <circle cx="825" cy="260" r="6" fill={power ? STYLE.run : STYLE.muted} />
      <circle
        cx="825"
        cy="285"
        r="6"
        fill={highAlarm ? STYLE.danger : STYLE.run}
      />
    </g>
  );
}

function PlcBlock() {
  return (
    <g>
      <rect
        x={COMPONENT.plc.x}
        y={COMPONENT.plc.y}
        width={COMPONENT.plc.width}
        height={COMPONENT.plc.height}
        rx="16"
        fill="#e5e7eb"
        stroke="#94a3b8"
        filter="url(#shadow)"
      />
      <text x="943" y="410" fontSize="15" fontWeight="700" fill={STYLE.active}>
        PLC AI
      </text>
      <text x="935" y="435" fontSize="13" fill="#475569">
        RTD / 4-20mA
      </text>
    </g>
  );
}

function SignalCable({
  power,
  highAlarm,
}: {
  power: boolean;
  highAlarm: boolean;
}) {
  return (
    <g>
      <path
        d={WIRE.signalToPlc}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
      />
      {power && (
        <circle r="5" fill={highAlarm ? STYLE.danger : STYLE.run}>
          <animateMotion
            dur="1.3s"
            repeatCount="indefinite"
            path={PATH.signalToPlcMotion}
          />
        </circle>
      )}
    </g>
  );
}

function SceneLabels({
  temperature,
  setPoint,
  highAlarm,
  wireMode,
}: {
  temperature: number;
  setPoint: number;
  highAlarm: boolean;
  wireMode: WireMode;
}) {
  return (
    <g>
      <line x1="160" y1="145" x2="440" y2="145" stroke="#9ca3af" />
      <text
        x={LABEL.temperature.x}
        y={LABEL.temperature.y}
        textAnchor="middle"
        fill={highAlarm ? "#dc2626" : STYLE.active}
        fontSize="20"
        fontWeight="700"
      >
        {temperature.toFixed(0)}°C
      </text>
      <text
        x={LABEL.setPoint.x}
        y={LABEL.setPoint.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="13"
      >
        Alarm Setpoint: {setPoint}°C
      </text>
      <text
        x={LABEL.wiringComp.x}
        y={LABEL.wiringComp.y}
        fontSize="13"
        fill="#475569"
      >
        Wiring Compensation: {wireMode}
      </text>
      {highAlarm && (
        <text
          x={LABEL.alarm.x}
          y={LABEL.alarm.y}
          fill="#dc2626"
          fontSize="24"
          fontWeight="700"
        >
          HIGH TEMPERATURE ALARM
        </text>
      )}
      <text
        x={LABEL.footerOne.x}
        y={LABEL.footerOne.y}
        fontSize="13"
        fill="#475569"
      >
        Industrial RTD temperature measurement loop
      </text>
      <text
        x={LABEL.footerTwo.x}
        y={LABEL.footerTwo.y}
        fontSize="13"
        fill="#64748b"
      >
        RTD Probe → Transmitter / PLC RTD Input → Temperature Control
      </text>
    </g>
  );
}

function RTDScene({
  power,
  rtdType,
  wireMode,
  process,
  temperature,
  setPoint,
  highAlarm,
  measuredResistance,
  current,
}: {
  power: boolean;
  rtdType: RTDType;
  wireMode: WireMode;
  process: Process;
  temperature: number;
  setPoint: number;
  highAlarm: boolean;
  measuredResistance: number;
  current: number;
}) {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg viewBox={VIEW_BOX} className="h-full w-full">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>
        <linearGradient id="probe" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" />
          <stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
        <radialGradient id="heatGlow">
          <stop offset="0" stopColor="#ef4444" stopOpacity=".8" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={canvasTransform}>
        <LabBase />
        <ProcessHeatBlock
          power={power}
          process={process}
          temperature={temperature}
        />
        <RTDProbe
          rtdType={rtdType}
          highAlarm={highAlarm}
          temperature={temperature}
        />
        <TransmitterBlock
          power={power}
          highAlarm={highAlarm}
          measuredResistance={measuredResistance}
          current={current}
        />
        <SignalCable power={power} highAlarm={highAlarm} />
        <PlcBlock />
        <SceneLabels
          temperature={temperature}
          setPoint={setPoint}
          highAlarm={highAlarm}
          wireMode={wireMode}
        />
      </g>
    </svg>
  );
}

function WiringRtdElement() {
  return (
    <g>
      <rect
        x={COMPONENT.wiringRtd.x}
        y={COMPONENT.wiringRtd.y}
        width={COMPONENT.wiringRtd.width}
        height={COMPONENT.wiringRtd.height}
        rx="26"
        fill="#e5e7eb"
        stroke="#64748b"
      />
      <line
        x1={NODE.wiringElementLeft.x}
        y1={NODE.wiringElementLeft.y}
        x2="140"
        y2="97"
        stroke={STYLE.danger}
        strokeWidth="5"
      />
      <text x="48" y="155" fontSize="12" fill="#475569">
        RTD Element
      </text>
    </g>
  );
}

function WiringLine({
  index,
  wires,
  label,
}: {
  index: number;
  wires: number;
  label: string;
}) {
  const y = 35 + index * 35;
  const color =
    index === 0 ? "#dc2626" : index === wires - 1 ? STYLE.active : STYLE.wire;

  return (
    <g>
      <line
        x1={NODE.wiringElementRight.x}
        y1={NODE.wiringElementRight.y}
        x2={NODE.wiringBusStartX}
        y2={y}
        stroke={color}
        strokeWidth="2"
      />
      <line
        x1={NODE.wiringBusStartX}
        y1={y}
        x2={NODE.wiringBusEndX}
        y2={y}
        stroke={color}
        strokeWidth="2.5"
      />
      <polygon points={`410,${y - 6} 426,${y} 410,${y + 6}`} fill={color} />
      <text x="225" y={y - 6} fontSize="13" fill={color}>
        {label}
      </text>
    </g>
  );
}

function WiringSvg({
  wireMode,
  outputMode,
  current,
  measuredResistance,
  highAlarm,
}: {
  wireMode: WireMode;
  outputMode: OutputMode;
  current: number;
  measuredResistance: number;
  highAlarm: boolean;
}) {
  const wires = wireMode === "2-Wire" ? 2 : wireMode === "3-Wire" ? 3 : 4;
  const canvasTransform = buildCanvasScaleTransform(
    CIRCUIT_CANVAS_SCALE,
    WIRING_VIEW_BOX_WIDTH,
    WIRING_VIEW_BOX_HEIGHT,
  );

  const wireLabels = Array.from({ length: wires }).map((_, index) =>
    index === 0 ? "RTD +" : index === wires - 1 ? "RTD −" : "Compensation",
  );

  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <g transform={canvasTransform}>
        <WiringRtdElement />

        {wireLabels.map((label, index) => (
          <WiringLine
            key={`${label}-${index}`}
            index={index}
            wires={wires}
            label={label}
          />
        ))}

        <text x="450" y="45" fontSize="14">
          RTD / TX Input
        </text>
        <text x="450" y="85" fontSize="14">
          {measuredResistance.toFixed(2)} Ω
        </text>
        <text x="450" y="125" fontSize="14">
          {outputMode === "Resistance Ω"
            ? "Resistance"
            : `${current.toFixed(1)} mA`}
        </text>
        <text x="450" y="165" fontSize="14">
          {highAlarm ? "High Alarm" : "Normal"}
        </text>

        <circle r="5" fill={highAlarm ? STYLE.danger : STYLE.run}>
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={PATH.wiringCompMotion}
          />
        </circle>

        <text
          x={LABEL.wiringFooter.x}
          y={LABEL.wiringFooter.y}
          fontSize="12"
          fill="#475569"
        >
          {wireMode} RTD wiring compensation
        </text>
      </g>
    </svg>
  );
}

/* UI blocks */

function Header({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  const tabs: Tab[] = [
    "Simulator",
    "Theory",
    "Wiring Diagram",
    "Quiz",
    "Report",
  ];

  return (
    <header className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
      <div className="flex items-center gap-4 lg:col-span-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
          <Cpu size={30} />
        </div>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">INDUSTRIAL LAB</h1>
          <p className="text-base text-blue-600 sm:text-lg">
            RTD PT100 / PT1000 Simulation
          </p>
        </div>
      </div>

      <nav className="flex overflow-x-auto rounded-xl border bg-white shadow-sm lg:col-span-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`min-w-[135px] flex-1 px-4 py-4 text-sm ${tab === item ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-700"}`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="hidden justify-end gap-8 text-slate-800 lg:col-span-3 lg:flex">
        <Sun size={24} />
        <Volume2 size={24} />
        <Maximize size={24} />
      </div>
    </header>
  );
}

function Panel({ title, icon, children, className = "" }: any) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex h-14 items-center gap-3 border-b px-5 font-bold text-blue-600">
        {icon}
        {title}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Control({ label, children }: any) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-[120px_1fr] sm:items-center">
      <span>{label}</span>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }: any) {
  return (
    <select
      className="input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function Status({ label, value, dot, badge, distance, danger }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
      <span>{label}</span>
      <span
        className={`flex h-8 items-center justify-center rounded-md ${badge ? `${danger ? "bg-red-600" : "bg-green-600"} font-semibold text-white` : ""} ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}
      >
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}
        {value}
      </span>
    </div>
  );
}

function Read({ label, value, green, danger }: any) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <b className={danger ? "text-red-600" : green ? "text-green-600" : ""}>
        {value}
      </b>
    </div>
  );
}

function Lamp({ label, on, danger }: any) {
  return (
    <div className="text-center">
      <p className="mb-5 text-sm">{label}</p>
      <div className="grid h-16 w-16 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div
          className={`h-10 w-10 rounded-full ${on ? `${danger ? "bg-red-500 shadow-[0_0_20px_#ef4444]" : "bg-green-500 shadow-[0_0_20px_#22c55e]"}` : "bg-slate-300"}`}
        />
      </div>
    </div>
  );
}

function LiveReadout({
  temperature,
  setPoint,
  highAlarm,
  resistance,
  measuredResistance,
  current,
  rtdType,
  wireMode,
  outputMode,
  leadError,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read
          label="Temperature"
          value={`${temperature.toFixed(0)}°C`}
          green={!highAlarm}
          danger={highAlarm}
        />
        <Read label="Setpoint" value={`${setPoint}°C`} />
        <Read
          label="Alarm"
          value={highAlarm ? "HIGH" : "NORMAL"}
          danger={highAlarm}
          green={!highAlarm}
        />
        <Read label="Ideal R" value={`${resistance.toFixed(2)} Ω`} />
        <Read
          label="Measured R"
          value={`${measuredResistance.toFixed(2)} Ω`}
          green
        />
        <Read label="Lead Error" value={`+${leadError.toFixed(2)} Ω`} />
        <Read label="Current" value={`${current.toFixed(1)} mA`} />
        <Read label="RTD Type" value={rtdType} />
        <Read label="Wiring" value={wireMode} />
        <Read label="Output" value={outputMode} />
      </div>
    </div>
  );
}

function LearningTab({
  tab,
  rtdType,
  wireMode,
  outputMode,
}: {
  tab: Tab;
  rtdType: RTDType;
  wireMode: WireMode;
  outputMode: OutputMode;
}) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "RTD PT100 / PT1000 Theory",
      points: [
        "RTD means Resistance Temperature Detector.",
        "PT100 has 100 Ω resistance at 0°C; PT1000 has 1000 Ω at 0°C.",
        "Resistance increases almost linearly as temperature increases.",
        "RTD sensors are more accurate and stable than thermocouples for many industrial ranges.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${wireMode} / ${outputMode} Wiring Explanation`,
      points: [
        "2-wire RTD is simple but has more lead-wire error.",
        "3-wire RTD compensates most cable resistance and is common in industry.",
        "4-wire RTD gives the highest measurement accuracy.",
        "RTD can connect directly to PLC RTD input or through a 4–20mA transmitter.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What is the resistance of PT100 at 0°C?",
        "Q2: Why is 3-wire RTD commonly used?",
        "Q3: Which wiring gives highest accuracy?",
        "Q4: What happens to RTD resistance when temperature increases?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected RTD type: ${rtdType}`,
        `Selected wiring: ${wireMode}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: compare measured resistance in 2-wire, 3-wire and 4-wire modes.",
      ],
    },
  };

  const item = data[tab];

  return (
    <Panel title={tab.toUpperCase()} icon={item.icon}>
      <div className="min-h-[520px] rounded-xl bg-slate-50 p-6">
        <h2 className="mb-5 text-2xl font-bold text-blue-600">{item.title}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {item.points.map((point, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-3 font-bold text-slate-800">
                Learning Point {index + 1}
              </div>
              <p className="leading-7 text-slate-700">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export default function RTDPT100IndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [rtdType, setRtdType] = useState<RTDType>("PT100");
  const [wireMode, setWireMode] = useState<WireMode>("3-Wire");
  const [process, setProcess] = useState<Process>("Bearing Housing");
  const [outputMode, setOutputMode] =
    useState<OutputMode>("Transmitter 4-20mA");
  const [setPoint, setSetPoint] = useState(120);
  const [temperature, setTemperature] = useState(75);
  const [alarmCount, setAlarmCount] = useState(1);

  const resistance = getResistance(rtdType, temperature, power);
  const leadError = getLeadError(wireMode);
  const measuredResistance = resistance + leadError;
  const current = getCurrent(temperature, power);
  const highAlarm = power && temperature >= setPoint;
  const outputActive =
    power &&
    (outputMode === "Resistance Ω"
      ? resistance > getBaseResistance(rtdType)
      : current > 4);

  function moveTemp(value: number) {
    const next = Number(Math.max(-50, Math.min(300, value)).toFixed(0));

    if (!highAlarm && power && next >= setPoint) {
      setAlarmCount((count) => count + 1);
    }

    setTemperature(next);
  }

  function reset() {
    setPower(false);
    setRtdType("PT100");
    setWireMode("3-Wire");
    setProcess("Bearing Housing");
    setOutputMode("Transmitter 4-20mA");
    setSetPoint(120);
    setTemperature(75);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "RTD Measurement Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "High Temperature Alarm", "text-red-600"]
        : ["10:24:23", "Temperature Normal", "text-green-600"],
      [
        "10:24:18",
        `${measuredResistance.toFixed(2)} Ω / ${current.toFixed(1)} mA`,
        "text-slate-900",
      ],
      ["LIVE", `${rtdType} / ${wireMode}`, "text-blue-600"],
    ];
  }, [power, highAlarm, measuredResistance, current, rtdType, wireMode]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab
            tab={tab}
            rtdType={rtdType}
            wireMode={wireMode}
            outputMode={outputMode}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="RTD CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="RTD Type">
                  <Select
                    value={rtdType}
                    onChange={(value: RTDType) => setRtdType(value)}
                  >
                    <option>PT100</option>
                    <option>PT1000</option>
                  </Select>
                </Control>

                <Control label="Wiring">
                  <Select
                    value={wireMode}
                    onChange={(value: WireMode) => setWireMode(value)}
                  >
                    <option>2-Wire</option>
                    <option>3-Wire</option>
                    <option>4-Wire</option>
                  </Select>
                </Control>

                <Control label="Process">
                  <Select
                    value={process}
                    onChange={(value: Process) => setProcess(value)}
                  >
                    <option>Bearing Housing</option>
                    <option>Pipe Surface</option>
                    <option>Liquid Tank</option>
                    <option>Oven Chamber</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select
                    value={outputMode}
                    onChange={(value: OutputMode) => setOutputMode(value)}
                  >
                    <option>Resistance Ω</option>
                    <option>Transmitter 4-20mA</option>
                    <option>PLC RTD Input</option>
                  </Select>
                </Control>

                <Control label="Alarm Setpoint">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{setPoint}</b>
                      <span>°C</span>
                    </div>
                    <button
                      className="miniBtn"
                      onClick={() => setSetPoint(Math.max(-20, setPoint - 5))}
                    >
                      −
                    </button>
                    <button
                      className="miniBtn"
                      onClick={() => setSetPoint(Math.min(300, setPoint + 5))}
                    >
                      +
                    </button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC / RTD Input</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="RTD STATUS" icon={<Activity size={20} />}>
                <Status
                  label="Power"
                  value={power ? "Active" : "OFF"}
                  dot={power}
                />
                <Status
                  label="Alarm"
                  value={highAlarm ? "HIGH" : "NORMAL"}
                  badge={highAlarm}
                  danger={highAlarm}
                />
                <Status
                  label="Output"
                  value={outputActive ? "ACTIVE" : "OFF"}
                  badge={outputActive}
                />
                <Status
                  label="Temp"
                  value={`${temperature.toFixed(0)}°C`}
                  distance
                />
                <Status
                  label="Resistance"
                  value={`${measuredResistance.toFixed(2)} Ω`}
                />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select PT100/PT1000 and wiring method.</li>
                  <li>2. Adjust process temperature.</li>
                  <li>3. Observe resistance increase with temperature.</li>
                  <li>4. Compare 2-wire, 3-wire and 4-wire lead error.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn">
                    <Play size={17} /> Start
                  </button>
                  <button
                    onClick={() => setPower(false)}
                    className="secondaryBtn"
                  >
                    <Square size={15} /> Stop
                  </button>
                  <button onClick={reset} className="secondaryBtn col-span-2">
                    <RotateCcw size={17} /> Reset
                  </button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel
                title="RTD PT100 / PT1000 SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <RTDScene
                    power={power}
                    rtdType={rtdType}
                    wireMode={wireMode}
                    process={process}
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    measuredResistance={measuredResistance}
                    current={current}
                  />

                  <LiveReadout
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    resistance={resistance}
                    measuredResistance={measuredResistance}
                    current={current}
                    rtdType={rtdType}
                    wireMode={wireMode}
                    outputMode={outputMode}
                    leadError={leadError}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={-50}
                      max={300}
                      step={1}
                      value={temperature}
                      onChange={(event) => moveTemp(Number(event.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Cold</span>
                      <span>Adjust RTD process temperature</span>
                      <span>Hot</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel
                  title="I/O INDICATOR"
                  icon={<Cpu size={19} />}
                  className="xl:col-span-3"
                >
                  <div className="grid h-[190px] grid-cols-2 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="ALARM" on={highAlarm} danger />
                  </div>
                </Panel>

                <Panel
                  title="RTD CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg
                    wireMode={wireMode}
                    outputMode={outputMode}
                    current={current}
                    measuredResistance={measuredResistance}
                    highAlarm={highAlarm}
                  />
                </Panel>

                <Panel
                  title="EVENT LOG"
                  icon={<ClipboardList size={19} />}
                  className="md:col-span-2 xl:col-span-4"
                >
                  <div className="space-y-4 pt-2 text-sm">
                    {logs.map(([time, message, color], index) => (
                      <div key={index} className="grid grid-cols-[75px_1fr]">
                        <span>{time}</span>
                        <span className={color}>{message}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs">
                    High Alarm Count: <b>{alarmCount}</b>
                  </div>
                </Panel>
              </div>
            </section>
          </div>
        )}
      </div>

      <style jsx global>{`
        .input {
          height: 42px;
          width: 100%;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: white;
          padding: 0 12px;
          outline: none;
          font-size: 14px;
        }
        .miniBtn {
          height: 42px;
          width: 42px;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: white;
          font-size: 23px;
        }
        .primaryBtn {
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-weight: 600;
        }
        .secondaryBtn {
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          border: 1px solid #dbe3ef;
          background: white;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}
